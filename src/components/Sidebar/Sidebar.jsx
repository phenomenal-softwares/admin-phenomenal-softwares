import logoBanner from '../../assets/logo-banner.png'
import logoIconYellowBg from '../../assets/phen-logo-eagle-bg-yellow.png'
import './Sidebar.css'

function Icon({ name }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    box: <><path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z" /><path d="m3.8 7.5 8.2 4.4 8.2-4.4M12 12v9" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
  }

  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function Sidebar({ navigation, activePage, onNavigate, onLogout, adminEmail }) {
  return (
    <aside className="sidebar">
      <button className="sidebar__brand" type="button" onClick={() => onNavigate('dashboard')} aria-label="Go to dashboard">
        <img src={logoBanner} alt="Phenomenal" />
      </button>

      <div className="sidebar__section-label">WORKSPACE</div>
      <nav className="sidebar__nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <button
            className={`nav-item${activePage === item.id || (activePage === 'edit-product' && item.id === 'products') ? ' nav-item--active' : ''}`}
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            aria-current={activePage === item.id ? 'page' : undefined}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
            {item.id === 'products' && <span className="nav-item__chevron" aria-hidden="true">›</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__admin">
          <span className="sidebar__avatar"><img src={logoIconYellowBg} alt="Phenomenal" /></span>
          <span className="sidebar__admin-info"><strong>Admin</strong><small>{adminEmail}</small></span>
        </div>
        <button className="nav-item nav-item--logout" type="button" onClick={onLogout}>
          <Icon name="logout" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
