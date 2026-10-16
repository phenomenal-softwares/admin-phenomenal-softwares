import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./ProductDetails.css";

const COLOR_KEYS = ["primary", "secondary", "accent", "bg"];
const productAsset = (product, field) =>
  product[field] ||
  product[field.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)];

function ProductDetails({ product, assetUrls, onClose, onEdit }) {
  const selectedImage = productAsset(product, "imagePrimary");
  const selectedPhoneImage = productAsset(product, "imagePhone");
  const selectedReadMe = productAsset(product, "readMe");

  return (
    <div
      className="product-detail-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <section
        className="product-detail"
        aria-labelledby="product-detail-title"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header className="product-detail__header">
          <div>
            <span className="eyebrow">PRODUCT DETAILS</span>
            <h2 id="product-detail-title">{product.name}</h2>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            type="button"
            aria-label="Close product details"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </header>
        <div className="product-detail__body">
          {selectedImage && assetUrls[selectedImage] && (
            <img
              className="product-detail__hero"
              src={assetUrls[selectedImage]}
              alt={`${product.name} primary`}
            />
          )}
          <p>{product.description || "No product description provided."}</p>
          <dl className="product-detail__facts">
            <div>
              <dt>Type</dt>
              <dd>{product.type || "—"}</dd>
            </div>
            <div>
              <dt>URL</dt>
              <dd>
                {product.url ? (
                  <a href={product.url} rel="noreferrer" target="_blank">
                    {product.url}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{product.developerInfo?.status || "—"}</dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>{product.developerInfo?.mode || "—"}</dd>
            </div>
            <div>
              <dt>Platforms</dt>
              <dd>{product.developerInfo?.targetPlatforms?.join(", ") || "—"}</dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>{product.developerInfo?.languages || "—"}</dd>
            </div>
            <div>
              <dt>Framework</dt>
              <dd>{product.developerInfo?.framework || "—"}</dd>
            </div>
            <div>
              <dt>Styling</dt>
              <dd>{product.developerInfo?.styling || "—"}</dd>
            </div>
            <div>
              <dt>Animation</dt>
              <dd>{product.developerInfo?.animation || "—"}</dd>
            </div>
            <div>
              <dt>Icons</dt>
              <dd>{product.developerInfo?.icons || "—"}</dd>
            </div>
            <div>
              <dt>Hosting</dt>
              <dd>{product.developerInfo?.hosting || "—"}</dd>
            </div>
            <div>
              <dt>Initial release</dt>
              <dd>{product.developerInfo?.initialRelease || "—"}</dd>
            </div>
          </dl>
          {COLOR_KEYS.some((key) => product.colors?.[key]) && (
            <section className="product-detail__section">
              <h3>Colors</h3>
              <div className="product-detail__colors">
                {COLOR_KEYS.filter((key) => product.colors?.[key]).map((key) => (
                  <div className="product-detail__color" key={key}>
                    <span
                      aria-label={`${key}: ${product.colors[key]}`}
                      className="product-detail__color-swatch"
                      style={{ backgroundColor: product.colors[key] }}
                    />
                    <span>{key}</span>
                    <code>{product.colors[key]}</code>
                  </div>
                ))}
              </div>
            </section>
          )}
          {product.features?.some(
            (feature) => feature.icon || feature.title || feature.desc,
          ) && (
            <section className="product-detail__section">
              <h3>Features</h3>
              <div className="product-detail__features">
                {product.features
                  .filter(
                    (feature) => feature.icon || feature.title || feature.desc,
                  )
                  .map((feature, index) => (
                    <article className="product-detail__feature" key={index}>
                      {feature.icon && <span>{feature.icon}</span>}
                      {feature.title && <h4>{feature.title}</h4>}
                      {feature.desc && <p>{feature.desc}</p>}
                    </article>
                  ))}
              </div>
            </section>
          )}
          {product.developerInfo?.description && (
            <div className="product-detail__developer">
              <h3>Developer dossier</h3>
              <p>{product.developerInfo.description}</p>
            </div>
          )}
          {selectedPhoneImage && assetUrls[selectedPhoneImage] && (
            <div className="product-detail__asset">
              <h3>Phone image</h3>
              <img
                src={assetUrls[selectedPhoneImage]}
                alt={`${product.name} phone preview`}
              />
            </div>
          )}
          {product.gallery?.length > 0 && (
            <div className="product-detail__asset">
              <h3>Gallery</h3>
              <div className="product-gallery">
                {product.gallery.map(
                  (path) =>
                    assetUrls[path] && (
                      <img
                        key={path}
                        src={assetUrls[path]}
                        alt={`${product.name} gallery`}
                      />
                    ),
                )}
              </div>
            </div>
          )}
          {selectedReadMe && (
            <div className="product-detail__readme">
              <h3>ReadMe</h3>
              {assetUrls[selectedReadMe] ? (
                <a
                  href={assetUrls[selectedReadMe]}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open ReadMe file{" "}
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </a>
              ) : (
                <span>{selectedReadMe}</span>
              )}
            </div>
          )}
        </div>
        <footer className="product-detail__actions">
          <button
            className="button button--outline"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
          <button className="button button--primary" onClick={onEdit} type="button">
            Edit product
          </button>
        </footer>
      </section>
    </div>
  );
}

export default ProductDetails;
