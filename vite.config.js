import react from '@vitejs/plugin-react'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'

const firebaseKeys = [
  'API_KEY',
  'AUTH_DOMAIN',
  'PROJECT_ID',
  'STORAGE_BUCKET',
  'MESSAGING_SENDER_ID',
  'APP_ID',
]

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const firebaseEnv = Object.fromEntries(firebaseKeys.map((key) => {
    const viteKey = `VITE_FIREBASE_${key}`
    const existingKey = `FIREBASE_${key}`
    return [`import.meta.env.${viteKey}`, JSON.stringify(env[viteKey] || env[existingKey] || '')]
  }))

  firebaseEnv['import.meta.env.VITE_ADMIN_EMAIL'] = JSON.stringify(
    env.VITE_ADMIN_EMAIL || env.ADMIN_EMAIL || '',
  )

  return {
    plugins: [react()],
    define: firebaseEnv,
  }
})
