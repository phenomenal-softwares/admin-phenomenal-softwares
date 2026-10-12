import { useState } from 'react'
import { useFirebase } from '../../context/FirebaseContext'
import logoSquare from '../../assets/logo-square-eagle.png'
import logoBanner from '../../assets/logo-banner.png'
import './LoginPage.css'

function LoginPage() {
  const { login } = useFirebase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(email.trim(), password)
    } catch (loginError) {
      setError(loginError.message || 'Unable to sign in. Please check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-screen">
      <section className="login-card" aria-labelledby="login-title">
        <img className="login-brand-banner" src={logoBanner} alt="Phenomenal" />
        <div className="login-card__intro">
          <span className="eyebrow">ADMIN PORTAL</span>
          <h1 id="login-title">Welcome back</h1>
          <p>Sign in to manage your product catalogue.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            autoComplete="username"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Admin email"
            required
            type="email"
            value={email}
          />
          <label htmlFor="password">Password</label>
          <input
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            type="password"
            value={password}
          />
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="button button--primary login-form__submit" disabled={submitting} type="submit">
            {submitting ? 'Signing in...' : 'Sign in'}
            {!submitting && <span aria-hidden="true">→</span>}
          </button>
        </form>
        <p className="login-card__note">Authorized admin access only. New account registration is disabled.</p>
      </section>
      <aside className="login-aside">
        <div className="login-aside__content">
          <span className="eyebrow eyebrow--light">PRODUCT MANAGEMENT</span>
          <h2>Everything your<br />catalogue needs.</h2>
          <p>A focused workspace to keep your products organized and up to date.</p>
          <div className="login-aside__emblem"><img src={logoSquare} alt="" /></div>
        </div>
        <span className="login-aside__footer">PHENOMENAL SOFTWARES · ADMIN</span>
      </aside>
    </main>
  )
}

export default LoginPage
