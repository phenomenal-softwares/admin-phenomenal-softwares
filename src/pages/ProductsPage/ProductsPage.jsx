import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownWideShort,
  faArrowUpWideShort,
  faChevronLeft,
  faChevronRight,
  faPlus,
  faMagnifyingGlass,
  faEye,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useFirebase } from "../../context/FirebaseContext";
import ProductDetails from "./ProductDetails/ProductDetails";
import "./ProductsPage.css";

const productAsset = (product, field) =>
  product[field] ||
  product[field.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)];
const productAssetPaths = (product) =>
  [
    productAsset(product, "imagePrimary"),
    productAsset(product, "imagePhone"),
    productAsset(product, "readMe"),
    ...(product.gallery || []),
  ].filter(Boolean);

function timestampValue(timestamp) {
  if (typeof timestamp?.toMillis === "function") return timestamp.toMillis();
  if (timestamp instanceof Date) return timestamp.getTime();
  if (typeof timestamp === "number") return timestamp;
  if (typeof timestamp === "string") {
    const parsedTimestamp = Date.parse(timestamp);
    return Number.isNaN(parsedTimestamp) ? 0 : parsedTimestamp;
  }
  return 0;
}

function ProductThumbnail({ product, src }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return (
      <span className="product-cell__image" aria-hidden="true">
        {product.name?.charAt(0)?.toUpperCase() || "P"}
      </span>
    );
  }

  return (
    <img
      className="product-cell__image product-cell__image--photo"
      src={src}
      alt=""
      onError={() => {
        console.error(
          `Unable to display the primary image for product "${product.name}".`,
        );
        setFailedSrc(src);
      }}
    />
  );
}

function ProductsPage({
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  products = [],
  productsLoading,
}) {
  const { getFileDownloadUrl } = useFirebase();
  const [assetUrls, setAssetUrls] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    let isCurrent = true;
    const paths = [...new Set(products.flatMap(productAssetPaths))];

    Promise.all(
      paths.map(async (path) => {
        if (/^(https?:|data:|blob:|\/)/i.test(path)) return [path, path];
        try {
          return [path, await getFileDownloadUrl(path)];
        } catch (error) {
          console.error(`Unable to resolve product asset "${path}".`, error);
          return [path, null];
        }
      }),
    ).then((resolved) => {
      if (isCurrent) setAssetUrls(Object.fromEntries(resolved));
    });

    return () => {
      isCurrent = false;
    };
  }, [products, getFileDownloadUrl]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const matchingProducts = normalizedSearch
      ? products.filter((product) =>
          [
            product.name,
            product.type,
            product.description,
            product.developerInfo?.status,
          ].some((value) => value?.toLowerCase().includes(normalizedSearch)),
        )
      : products;
    const direction = sortDirection === "desc" ? -1 : 1;

    return [...matchingProducts].sort(
      (a, b) =>
        direction * (timestampValue(a.createdAt) - timestampValue(b.createdAt)),
    );
  }, [products, search, sortDirection]);

  const pageCount = Math.ceil(filteredProducts.length / pageSize);
  const pageIndex = Math.min(currentPage, Math.max(pageCount - 1, 0));
  const pageProducts = filteredProducts.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize,
  );
  const firstProductNumber = filteredProducts.length
    ? pageIndex * pageSize + 1
    : 0;
  const lastProductNumber = Math.min(
    (pageIndex + 1) * pageSize,
    filteredProducts.length,
  );

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">CATALOGUE</span>
          <h1>Products</h1>
          <p>View and manage all products in your catalogue.</p>
        </div>
        <button
          className="button button--primary"
          onClick={onAddProduct}
          type="button"
        >
          <span aria-hidden="true">
            <FontAwesomeIcon aria-hidden="true" icon={faPlus} />
          </span>{" "}
          Add product
        </button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="table-toolbar__title">
            <h2>All products</h2>
            <span className="count-pill">{filteredProducts.length}</span>
          </div>
          <div className="product-toolbar__controls">
            <label className="product-search">
              <span aria-hidden="true">
                <FontAwesomeIcon aria-hidden="true" icon={faMagnifyingGlass} />
              </span>
              <input
                aria-label="Search products"
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(0);
                }}
                placeholder="Search products"
                type="search"
                value={search}
              />
            </label>
            <button
              aria-label={`Sort ${sortDirection === "desc" ? "oldest" : "newest"} products first`}
              className="sort-button"
              onClick={() =>
                {
                  setCurrentPage(0);
                  setSortDirection((current) =>
                    current === "desc" ? "asc" : "desc",
                  );
                }
              }
              title={`Sort ${sortDirection === "desc" ? "oldest" : "newest"} products first`}
              type="button"
            >
              <FontAwesomeIcon
                aria-hidden="true"
                icon={
                  sortDirection === "desc"
                    ? faArrowDownWideShort
                    : faArrowUpWideShort
                }
              />
            </button>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Developer status</th>
                <th>Project link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsLoading ? (
                <tr>
                  <td colSpan="5">
                    <div className="table-message">Loading products...</div>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                pageProducts.map((product) => {
                  const primaryImage = productAsset(product, "imagePrimary");
                  const developerStatus = product.developerInfo?.status;
                  const statusClass =
                    developerStatus?.toLowerCase().replace(/\s+/g, "-") ||
                    "unknown";
                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="product-cell">
                          <ProductThumbnail
                            product={product}
                            src={assetUrls[primaryImage]}
                          />
                          <span className="product-cell__text">
                            <strong>{product.name}</strong>
                            <small>
                              {product.description || "No description"}
                            </small>
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="type-pill">{product.type || "—"}</span>
                      </td>
                      <td>
                        <span className={`status-pill status-pill--${statusClass}`}>
                          {developerStatus || "—"}
                        </span>
                      </td>
                      <td>
                        {product.url ? (
                          <a
                            className="product-link"
                            href={product.url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {product.url}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="table-actions">
                        <button
                          className="icon-button"
                          onClick={() => setSelectedProduct(product)}
                          type="button"
                          aria-label={`View ${product.name}`}
                          title="View product"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          className="icon-button"
                          onClick={() => onEditProduct(product)}
                          type="button"
                          aria-label={`Edit ${product.name}`}
                          title="Edit product"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button
                          className="icon-button icon-button--danger"
                          onClick={() => onDeleteProduct(product)}
                          type="button"
                          aria-label={`Delete ${product.name}`}
                          title="Delete product"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <span className="empty-state__icon" aria-hidden="true">
                        ▧
                      </span>
                      <strong>
                        {products.length > 0
                          ? "No matching products"
                          : "No products to show yet"}
                      </strong>
                      <p>
                        {products.length > 0
                          ? "Try a different product name, type, or status."
                          : "Your catalogue is ready. Add a product to get started."}
                      </p>
                      {products.length === 0 && (
                        <button
                          className="button button--secondary"
                          onClick={onAddProduct}
                          type="button"
                        >
                          Add your first product
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>
            Showing {firstProductNumber}–{lastProductNumber} of {filteredProducts.length} products
          </span>
          <span>Changes sync with Firestore</span>
          <div className="pagination-controls" aria-label="Product pages">
            <button
              aria-label="Previous page"
              className="pagination-controls__button"
              disabled={pageIndex === 0}
              onClick={() => setCurrentPage(pageIndex - 1)}
              type="button"
            >
              <FontAwesomeIcon aria-hidden="true" icon={faChevronLeft} />
            </button>
            <span aria-live="polite">
              Page {pageCount ? pageIndex + 1 : 0} of {pageCount}
            </span>
            <button
              aria-label="Next page"
              className="pagination-controls__button"
              disabled={pageIndex >= pageCount - 1}
              onClick={() => setCurrentPage(pageIndex + 1)}
              type="button"
            >
              <FontAwesomeIcon aria-hidden="true" icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <ProductDetails
          assetUrls={assetUrls}
          onClose={() => setSelectedProduct(null)}
          onEdit={() => {
            onEditProduct(selectedProduct);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}
    </section>
  );
}

export default ProductsPage;
