import './DashboardPage.css'

function DashboardPage({ onViewProducts, productCount }) {
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>Welcome to your product management workspace.</p>
        </div>
        <button className="button button--primary" onClick={onViewProducts} type="button">
          View products <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="dashboard-cards">
        <article className="metric-card">
          <span className="metric-card__label">Total products</span>
          <span className="metric-card__value">{productCount}</span>
          <span className="metric-card__hint">Products in your catalogue</span>
          <span className="metric-card__icon" aria-hidden="true">▧</span>
        </article>
        <article className="metric-card">
          <span className="metric-card__label">Catalogue status</span>
          <span className="metric-card__value metric-card__value--small">{productCount ? 'Up to date' : 'Getting started'}</span>
          <span className="metric-card__hint">{productCount ? 'Your catalogue is ready to manage' : 'Add a product to get started'}</span>
          <span className="metric-card__icon metric-card__icon--green" aria-hidden="true">✓</span>
        </article>
      </div>

      <article className="welcome-card">
        <div className="welcome-card__copy">
          <span className="eyebrow eyebrow--light">YOUR WORKSPACE</span>
          <h2>Manage your products<br />in one place.</h2>
          <p>Add, update and organize your product catalogue from the Products section.</p>
          <button className="button button--white" onClick={onViewProducts} type="button">Go to products <span aria-hidden="true">→</span></button>
        </div>
        <div className="welcome-card__art" aria-hidden="true">
          <div className="art-card art-card--back" />
          <div className="art-card art-card--front"><span>✦</span><i /><i /><i /></div>
          <div className="art-spark art-spark--one">✦</div>
          <div className="art-spark art-spark--two">✧</div>
        </div>
      </article>

      <div className="section-heading">
        <div><h2>Quick start</h2><p>Get your catalogue ready for management.</p></div>
      </div>
      <article className="quick-start-card">
        <span className="quick-start-card__number">01</span>
        <div><strong>Review your products</strong><p>View and update your catalogue from the Products page.</p></div>
        <button className="text-button" onClick={onViewProducts} type="button">Open products <span aria-hidden="true">→</span></button>
      </article>
    </section>
  )
}

export default DashboardPage
