import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBoxArchive,
  faCircleCheck,
  faCube,
  faGamepad,
  faIndustry,
  faCheck,
  faLayerGroup,
  faScrewdriverWrench,
  faWallet,
  faCartShopping,
  faBook,
  faCirclePlay,
  faUniversalAccess,
  faBusinessTime,
  faHouseUser,
  faCross,
  faUtensils,
  faGear
} from "@fortawesome/free-solid-svg-icons";
import "./DashboardPage.css";

const STATUS_CARDS = [
  { label: "Active Development", icon: faLayerGroup, tone: "active" },
  { label: "Maintenance", icon: faScrewdriverWrench, tone: "maintenance" },
  { label: "Completed", icon: faCircleCheck, tone: "completed" },
  { label: "Archived", icon: faBoxArchive, tone: "archived" },
];

function DashboardPage({ onViewProducts, productCount, products = [] }) {
  const productTypes = products.reduce((types, product) => {
    const type =
      typeof product.type === "string" && product.type.trim()
        ? product.type.trim()
        : "Unspecified";
    const key = type.toLocaleLowerCase();
    const existing = types.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      types.set(key, { label: type, count: 1 });
    }
    return types;
  }, new Map());
  const sortedProductTypes = [...productTypes.values()].sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
  );
  const productsByStatus = products.reduce(
    (counts, product) => {
      const rawStatus = product.developerInfo?.status;
      const status =
        typeof rawStatus === "string" ? rawStatus.trim().toLowerCase() : "";
      if (status === "active development") counts["Active Development"] += 1;
      if (status === "maintenance") counts.Maintenance += 1;
      if (status === "completed") counts.Completed += 1;
      if (status === "archived") counts.Archived += 1;
      return counts;
    },
    {
      "Active Development": 0,
      Maintenance: 0,
      Completed: 0,
      Archived: 0,
    },
  );

  const typeIcon = (type) => {
    const normalizedType = type.toLowerCase();
    if (normalizedType.includes("game")) return faGamepad;
    if (normalizedType === "e-commerce") return faCartShopping;
    if (normalizedType === "educational") return faBook;
    if (normalizedType === "entertainment") return faCirclePlay;
    if (normalizedType === "lifestyle") return faUniversalAccess;
    if (normalizedType === "productivity") return faBusinessTime;
    if (normalizedType === "real-estate") return faHouseUser;
    if (normalizedType === "christian") return faCross;
    if (normalizedType === "restaurant") return faUtensils;
    if (normalizedType === "utility") return faGear;
    if (normalizedType === "fintech") return faWallet;
    
    return faCube;
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>Welcome to your product management workspace.</p>
        </div>
        <button
          className="button button--primary"
          onClick={onViewProducts}
          type="button"
        >
          View products{" "}
          <span aria-hidden="true">
            <FontAwesomeIcon icon={faArrowRight} />
          </span>
        </button>
      </div>

      <div className="dashboard-cards">
        <article className="metric-card">
          <span className="metric-card__label">Total products</span>
          <span className="metric-card__value">{productCount}</span>
          <span className="metric-card__hint">Products in your catalogue</span>
          <span className="metric-card__icon" aria-hidden="true">
            <FontAwesomeIcon icon={faIndustry} />
          </span>
        </article>
        <article className="metric-card">
          <span className="metric-card__label">Catalogue status</span>
          <span className="metric-card__value metric-card__value--small">
            {productCount ? "Up to date" : "Getting started"}
          </span>
          <span className="metric-card__hint">
            {productCount
              ? "Your catalogue is ready to manage"
              : "Add a product to get started"}
          </span>
          <span
            className="metric-card__icon metric-card__icon--green"
            aria-hidden="true"
          >
            <FontAwesomeIcon icon={faCheck} />
          </span>
        </article>
      </div>

      <section
        className="dashboard-breakdown"
        aria-labelledby="product-type-heading"
      >
        <div className="section-heading dashboard-breakdown__heading">
          <div>
            <h2 id="product-type-heading">Products by type</h2>
            <p>Catalogue totals grouped by product type.</p>
          </div>
        </div>
        <div className="dashboard-stat-grid">
          {sortedProductTypes.length ? (
            sortedProductTypes.map(({ label, count }) => (
              <article
                className="dashboard-stat-card"
                key={label.toLowerCase()}
              >
                <span className="dashboard-stat-card__icon" aria-hidden="true">
                  <FontAwesomeIcon icon={typeIcon(label)} />
                </span>
                <span className="dashboard-stat-card__label">{label}</span>
                <span className="dashboard-stat-card__count">{count}</span>
              </article>
            ))
          ) : (
            <p className="dashboard-breakdown__empty">
              No product types to show yet.
            </p>
          )}
        </div>
      </section>

      <section
        className="dashboard-breakdown"
        aria-labelledby="product-status-heading"
      >
        <div className="section-heading dashboard-breakdown__heading">
          <div>
            <h2 id="product-status-heading">Products by status</h2>
            <p>Totals across each development status.</p>
          </div>
        </div>
        <div className="dashboard-stat-grid dashboard-stat-grid--statuses">
          {STATUS_CARDS.map(({ label, icon, tone }) => (
            <article className="dashboard-stat-card" key={label}>
              <span
                className={`dashboard-stat-card__icon dashboard-stat-card__icon--${tone}`}
                aria-hidden="true"
              >
                <FontAwesomeIcon icon={icon} />
              </span>
              <span className="dashboard-stat-card__label">{label}</span>
              <span className="dashboard-stat-card__count">
                {productsByStatus[label]}
              </span>
            </article>
          ))}
        </div>
      </section>

      <article className="welcome-card">
        <div className="welcome-card__copy">
          <span className="eyebrow eyebrow--light">YOUR WORKSPACE</span>
          <h2>
            Manage your products
            <br />
            in one place.
          </h2>
          <p>
            Add, update and organize your product catalogue from the Products
            section.
          </p>
          <button
            className="button button--white"
            onClick={onViewProducts}
            type="button"
          >
            Go to products{" "}
            <span aria-hidden="true">
              <FontAwesomeIcon icon={faArrowRight} />
            </span>
          </button>
        </div>
        <div className="welcome-card__art" aria-hidden="true">
          <div className="art-card art-card--back" />
          <div className="art-card art-card--front">
            <span>✦</span>
            <i />
            <i />
            <i />
          </div>
          <div className="art-spark art-spark--one">✦</div>
          <div className="art-spark art-spark--two">✧</div>
        </div>
      </article>

      <div className="section-heading">
        <div>
          <h2>Quick start</h2>
          <p>Get your catalogue ready for management.</p>
        </div>
      </div>
      <article className="quick-start-card">
        <span className="quick-start-card__number">01</span>
        <div>
          <strong>Review your products</strong>
          <p>View and update your catalogue from the Products page.</p>
        </div>
        <button className="text-button" onClick={onViewProducts} type="button">
          Open products{" "}
          <span aria-hidden="true">
            <FontAwesomeIcon icon={faArrowRight} />
          </span>
        </button>
      </article>
    </section>
  );
}

export default DashboardPage;
