import { useEffect } from "react";
import "./PurchasedProductsPanel.scss";
import { useNavigate } from "react-router-dom";

export default function PurchasedProductsPanel({
  products = [], // schon gekaufte Produktobjekte
  onClose,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div className="purchased-panel-overlay" onClick={onClose}>
      <div
        className="purchased-panel-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchased-panel-title"
      >
        <div className="purchased-panel-header">
          <h2 id="purchased-panel-title" className="purchased-panel-title">
            Erworbene Produkte
          </h2>
          <button
            className="purchased-panel-close-btn"
            onClick={onClose}
            aria-label="Schließen"
          >
            ×
          </button>
        </div>

        {products.length === 0 ? (
          <p className="purchased-panel-empty-text">
            Du hast noch keine Produkte erworben.
          </p>
        ) : (
          <ul className="purchased-product-list">
            {products.map((product) => (
              <li
                key={String(product._id)}
                className="purchased-product-item"
                tabIndex={0}
              >
                <div className="purchased-product-info">
                  <h3 className="purchased-product-title">{product.title}</h3>
                  {product.description && (
                    <p className="purchased-product-description">
                      {product.description}
                    </p>
                  )}
                </div>
                <button
                  className="purchased-product-open-btn"
                  onClick={() => {
                    navigate(`/product/${product._id}`);
                  }}
                >
                  Zugang öffnen
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
