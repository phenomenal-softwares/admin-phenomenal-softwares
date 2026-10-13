import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage'
import { auth, db, storage } from '../services/firebase'

const FirebaseContext = createContext(null)
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase()
const STORAGE_ROOT = 'phenomenal-softwares/products'
const ASSET_FIELDS = ['imagePrimary', 'imagePhone', 'readMe', 'gallery']

if (!ADMIN_EMAIL) {
  throw new Error('Missing ADMIN_EMAIL in .env. Set it to the authorized admin email.')
}

export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider')
  }
  return context
}

function isAuthorized(user) {
  return user?.email?.trim().toLowerCase() === ADMIN_EMAIL
}

function assetPath(productId, field, file) {
  const safeFileName = file.name.replace(/[^\w.-]/g, '-')
  return `${STORAGE_ROOT}/${productId}/${field}/${crypto.randomUUID()}-${safeFileName}`
}

async function uploadProductFiles(productId, filesByField) {
  const uploadedPaths = {}
  const tasks = []

  for (const [field, files] of Object.entries(filesByField)) {
    for (const file of files) {
      const path = assetPath(productId, field, file)
      tasks.push({ field, path, promise: uploadBytes(storageRef(storage, path), file) })
    }
  }

  const results = await Promise.allSettled(tasks.map(({ promise }) => promise))
  const uploadErrors = []

  results.forEach((result, index) => {
    const { field, path } = tasks[index]
    if (result.status === 'fulfilled') {
      if (field === 'gallery') {
        uploadedPaths.gallery = [...(uploadedPaths.gallery || []), path]
      } else {
        uploadedPaths[field] = path
      }
    } else {
      uploadErrors.push(result.reason)
    }
  })

  if (uploadErrors.length > 0) {
    await removeStoragePaths(Object.values(uploadedPaths).flat())
    throw new AggregateError(uploadErrors, 'One or more product files could not be uploaded.')
  }

  return uploadedPaths
}

async function removeStoragePaths(paths) {
  const uniquePaths = [...new Set(paths.filter(Boolean))]
  const results = await Promise.allSettled(
    uniquePaths.map((path) => deleteObject(storageRef(storage, path))),
  )
  const failures = results
    .filter((result) => result.status === 'rejected')
    .map((result) => result.reason)

  if (failures.length > 0) {
    throw new AggregateError(failures, 'One or more product files could not be removed from Storage.')
  }
}

function productAssetPaths(product) {
  return ASSET_FIELDS.flatMap((field) => {
    const value = product?.[field]
    return Array.isArray(value) ? value : value ? [value] : []
  })
}

export function FirebaseProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const productsCollection = useMemo(() => collection(db, 'products'), [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        if (authenticatedUser && !isAuthorized(authenticatedUser)) {
          setAdmin(null)
          try {
            await signOut(auth)
          } catch (error) {
            console.error('Unable to sign out an unauthorized account.', error)
          }
          setLoading(false)
          return
        }

        setAdmin(authenticatedUser)
        setLoading(false)
      },
      (error) => {
        console.error('Unable to check admin authentication state.', error)
        setAdmin(null)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const value = useMemo(() => ({
    admin,
    loading,
    productsCollection,
    async login(email, password) {
      if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
        throw new Error('This email address is not authorized to access the admin workspace.')
      }

      const credentials = await signInWithEmailAndPassword(auth, email.trim(), password)
      if (!isAuthorized(credentials.user)) {
        await signOut(auth)
        throw new Error('This email address is not authorized to access the admin workspace.')
      }
      return credentials
    },
    logout: () => signOut(auth),
    subscribeProducts(onProducts, onError) {
      return onSnapshot(
        productsCollection,
        (snapshot) => {
          const products = snapshot.docs
            .map((productDoc) => ({ ...productDoc.data(), id: productDoc.id }))
          onProducts(products)
        },
        onError,
      )
    },
    async getFileDownloadUrl(path) {
      return getDownloadURL(storageRef(storage, path))
    },
    async addProduct(product, filesByField) {
      const productRef = doc(productsCollection)
      const filePaths = await uploadProductFiles(productRef.id, filesByField)
      try {
        await setDoc(productRef, {
          ...product,
          imagePrimary: '',
          imagePhone: '',
          gallery: [],
          readMe: '',
          ...filePaths,
          id: productRef.id,
          createdAt: serverTimestamp(),
        })
      } catch (error) {
        try {
          await removeStoragePaths(Object.values(filePaths).flat())
        } catch (cleanupError) {
          throw new AggregateError(
            [error, cleanupError],
            'Saving the product failed and uploaded files could not be fully cleaned up.',
            { cause: cleanupError },
          )
        }
        throw error
      }
      return productRef.id
    },
    async updateProduct(product, filesByField) {
      const productRef = doc(productsCollection, product.id)
      const newFilePaths = await uploadProductFiles(product.id, filesByField)
      const replacedFields = Object.keys(filesByField).filter((field) => filesByField[field].length > 0)
      const updatedProduct = { ...product }

      for (const field of replacedFields) {
        updatedProduct[field] = newFilePaths[field] ?? (field === 'gallery' ? [] : '')
      }

      try {
        await updateDoc(productRef, updatedProduct)
      } catch (error) {
        try {
          await removeStoragePaths(Object.values(newFilePaths).flat())
        } catch (cleanupError) {
          throw new AggregateError(
            [error, cleanupError],
            'Updating the product failed and replacement files could not be fully cleaned up.',
            { cause: cleanupError },
          )
        }
        throw error
      }

      const previousFiles = replacedFields.flatMap((field) => {
        const value = product[field]
        return Array.isArray(value) ? value : value ? [value] : []
      })

      if (previousFiles.length > 0) {
        await removeStoragePaths(previousFiles)
      }
    },
    async deleteProduct(product) {
      await deleteDoc(doc(productsCollection, product.id))
      await removeStoragePaths(productAssetPaths(product))
    },
  }), [admin, loading, productsCollection])

  return createElement(FirebaseContext.Provider, { value }, children)
}
