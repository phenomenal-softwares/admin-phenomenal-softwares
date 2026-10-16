import { useEffect, useState } from 'react'
import { useFirebase } from './context/FirebaseContext'
import Sidebar from './components/Sidebar/Sidebar'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import LoginPage from './pages/LoginPage/LoginPage'
import ProductFormPage from './pages/ProductFormPage/ProductFormPage'
import ProductsPage from './pages/ProductsPage/ProductsPage'
import logoIconYellowBg from './assets/phen-logo-eagle-bg-yellow.png'
import './app/App.css'

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'products', label: 'Products', icon: 'box' },
  { id: 'add-product', label: 'Add product', icon: 'plus' },
]

function MobileRestriction() {
  return (
    <main className="mobile-restriction">
      <div className="mobile-restriction__icon" aria-hidden="true">↔</div>
      <h1>Use a larger screen</h1>
      <p>The admin workspace is available on tablets and desktop devices.</p>
    </main>
  )
}

function LoadingScreen() {
  return (
    <main className="loading-screen" role="status">
      <span className="loading-screen__spinner" />
      <span>Loading your workspace...</span>
    </main>
  )
}

function AdminWorkspace() {
  const {
    admin,
    addProduct,
    deleteProduct,
    logout,
    subscribeProducts,
    updateProduct,
  } = useFirebase()
  const [activePage, setActivePage] = useState('dashboard')
  const [pageError, setPageError] = useState('')
  const [productToEdit, setProductToEdit] = useState(null)
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => subscribeProducts(
    (nextProducts) => {
      setProducts(nextProducts)
      setProductsLoading(false)
    },
    (error) => {
      console.error('Unable to load products.', error)
      const permissionDenied = error.code === 'permission-denied'
        || error.message?.includes('Missing or insufficient permissions')
      setPageError(permissionDenied
        ? 'Firestore denied access to the products collection in the phenomenal-softwares database. Confirm the signed-in email matches the admin allowlist, then deploy firestore.rules to this Firebase project and database.'
        : error.message || 'Unable to load products.')
      setProductsLoading(false)
    },
  ), [subscribeProducts])

  const handleLogout = async () => {
    setPageError('')
    try {
      await logout()
    } catch (error) {
      setPageError(error.message || 'Unable to log out. Please try again.')
    }
  }

  const handleSaveProduct = async (product, filesByField) => {
    setPageError('')
    try {
      if (productToEdit) {
        await updateProduct({ ...productToEdit, ...product, id: productToEdit.id }, filesByField)
      } else {
        await addProduct(product, filesByField)
      }
      setProductToEdit(null)
      setActivePage('products')
    } catch (error) {
      console.error('Unable to save product.', error)
      setPageError(error.message || 'Unable to save product. Please try again.')
    }
  }

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}" and its uploaded files?`)) return
    setPageError('')
    try {
      await deleteProduct(product)
    } catch (error) {
      console.error('Unable to delete product.', error)
      setPageError(error.message || 'Unable to delete product. Please try again.')
    }
  }

  const pageContent = () => {
    if (activePage === 'products') {
      return (
        <ProductsPage
          onAddProduct={() => {
            setPageError('')
            setProductToEdit(null)
            setActivePage('add-product')
          }}
          onDeleteProduct={handleDeleteProduct}
          onEditProduct={(product) => {
            setPageError('')
            setProductToEdit(product)
            setActivePage('edit-product')
          }}
          products={products}
          productsLoading={productsLoading}
        />
      )
    }

    if (activePage === 'add-product' || activePage === 'edit-product') {
      return (
        <ProductFormPage
          key={productToEdit?.id || 'new-product'}
          onCancel={() => setActivePage('products')}
          onSave={handleSaveProduct}
          product={activePage === 'edit-product' ? productToEdit : null}
        />
      )
    }

    return <DashboardPage onViewProducts={() => setActivePage('products')} productCount={products.length} products={products} />
  }

  return (
    <div className="app-shell">
      <Sidebar
        navigation={navigation}
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={handleLogout}
        adminEmail={admin?.email}
      />
      <main className="main-content">
        <header className="topbar">
          <div className="topbar__breadcrumb">Admin workspace <span>/</span> {navigation.find((item) => item.id === activePage)?.label ?? (activePage === 'edit-product' ? 'Edit product' : 'Dashboard')}</div>
          <div className="topbar__profile">
            <span className="topbar__avatar"><img src={logoIconYellowBg} alt="Phenomenal" /></span>
            <span>{admin?.email || 'Admin'}</span>
          </div>
        </header>
        {pageError && <div className="inline-error" role="alert">{pageError}</div>}
        {pageContent()}
      </main>
    </div>
  )
}

function App() {
  const { admin, loading } = useFirebase()
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const updateScreenSize = (event) => setIsMobile(event.matches)
    mediaQuery.addEventListener('change', updateScreenSize)
    return () => mediaQuery.removeEventListener('change', updateScreenSize)
  }, [])

  if (isMobile) return <MobileRestriction />
  if (loading) return <LoadingScreen />
  if (!admin) return <LoginPage />
  return <AdminWorkspace />
}

export default App
