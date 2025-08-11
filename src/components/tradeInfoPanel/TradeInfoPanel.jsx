import React, { useEffect, useState } from "react";
import "./TradeInfoPanel.scss";
import { IoClose } from "react-icons/io5";

export function TradeInfoPanel({ trade, onClose }) {
  const [imageError, setImageError] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    document.querySelector("html").style.overflowY = "hidden";
    return () => {
      document.querySelector("html").style.overflowY = "auto";
    };
  }, []);

  if (!trade) return null;

  return (
    <>
      <div className="trade-overlay" onClick={onClose} />
      <div
        className="trade-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tradeTitle"
        onClick={(e) => e.stopPropagation()} // verhindert, dass Klick im Panel Overlay schließt
      >
        <div className="trade-header">
          <h1 id="tradeTitle">Trade Details</h1>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Schließen"
            title="Trade Details schließen"
          >
            <IoClose />
          </button>
        </div>

        <div className="trade-scroll-area">
          <div className="trade-image-wrapper">
            {trade.screenshot && !imageError ? (
              <img
                src={trade.screenshot}
                alt="Trade Screenshot"
                onError={() => setImageError(true)}
                onClick={() => setShowLightbox(true)}
                tabIndex={0}
                role="button"
                aria-label="Screenshot in groß anzeigen"
              />
            ) : trade.screenshot ? (
              <p className="trade-image-error">
                Screenshot konnte nicht geladen werden.
              </p>
            ) : (
              <p className="trade-image-error">Kein Screenshot vorhanden.</p>
            )}
          </div>

          <div className="trade-content">
            <p>
              <strong>Symbol:</strong> {trade.name}
            </p>
            <p>
              <strong>Datum:</strong> {new Date(trade.date).toLocaleString()}
            </p>
            <p>
              <strong>G/V:</strong> {trade.profit.toFixed(2)} €
            </p>
            <p>
              <strong>RRR:</strong> {trade.ratio.toFixed(2)}
            </p>
            <p>
              <strong>Strategie:</strong> {trade.strategy}
            </p>
            <p>
              <strong>Richtung:</strong> {trade.direction}
            </p>
            <p>
              <strong>Kommentar:</strong> {trade.comment || "–"}
            </p>
            <p>
              <strong>Fehler-Tags:</strong> {(trade.errorTags || []).join(", ") || "–"}
            </p>
            <p>
              <strong>Entry:</strong> {trade.entry ?? "–"} | <strong>Exit:</strong> {trade.exit ?? "–"}
            </p>
            <p>
              <strong>Positionsgröße:</strong> {trade.size ?? "–"}
            </p>
            <p>
              <strong>Profit (%):</strong>{" "}
              {trade.pnlPercent != null ? `${trade.pnlPercent.toFixed(2)} %` : "–"}
            </p>
          </div>
        </div>
      </div>

      {showLightbox && (
        <div className="trade-lightbox-overlay" onClick={() => setShowLightbox(false)}>
          <img
            className="trade-lightbox-image"
            src={trade.screenshot}
            alt="Großansicht Screenshot"
          />
        </div>
      )}
    </>
  );
}
