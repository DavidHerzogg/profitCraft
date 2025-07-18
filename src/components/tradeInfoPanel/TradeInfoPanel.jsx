import React, { useEffect, useState } from "react";
import "./TradeInfoPanel.scss";

export function TradeInfoPanel({ trade, onClose }) {
    const [imageError, setImageError] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);

    useEffect(() => {
        document.querySelector('html').style.overflowY = 'hidden';
        return () => {
            document.querySelector('html').style.overflowY = 'auto';
        };
    }, []);

    if (!trade) return null;

    return (
        <>
            {/* Hintergrund-Overlay: Klick schließt das Panel */}
            <div className="trade-info-overlay" onClick={onClose} />

            {/* Panel selbst */}
            <div className="trade-info-panel" role="dialog" aria-modal="true">
                <div className="header">
                    <h2>Trade Details</h2>
                    <button className="close-btn" onClick={onClose} aria-label="Schließen">
                        ✕
                    </button>
                </div>

                {/* Bild oben, klickbar für Großansicht */}
                <div className="image-wrapper">
                    {trade.screenshot && !imageError ? (
                        <img
                            src={trade.screenshot}
                            alt="Trade Screenshot"
                            onError={() => setImageError(true)}
                            onClick={() => setShowLightbox(true)}
                            tabIndex={0}
                            role="button"
                            aria-label="Screenshot in groß anzeigen"
                            style={{ cursor: "pointer" }}
                        />
                    ) : trade.screenshot ? (
                        <p className="image-error">Screenshot konnte nicht geladen werden.</p>
                    ) : (
                        <p className="image-error">Kein Screenshot vorhanden.</p>
                    )}
                </div>

                {/* Textinhalt */}
                <div className="content">
                    <p><strong>Symbol:</strong> {trade.name}</p>
                    <p><strong>Datum:</strong> {new Date(trade.date).toLocaleString()}</p>
                    <p><strong>G/V:</strong> {trade.profit.toFixed(2)} €</p>
                    <p><strong>RRR:</strong> {trade.ratio.toFixed(2)}</p>
                    <p><strong>Strategie:</strong> {trade.strategy}</p>
                    <p><strong>Richtung:</strong> {trade.direction}</p>
                    <p><strong>Kommentar:</strong> {trade.comment || "–"}</p>
                    <p><strong>Fehler-Tags:</strong> {(trade.errorTags || []).join(", ") || "–"}</p>
                    <p><strong>Entry:</strong> {trade.entry ?? "–"} | <strong>Exit:</strong> {trade.exit ?? "–"}</p>
                    <p><strong>Positionsgröße:</strong> {trade.size ?? "–"}</p>
                    <p><strong>Profit (%):</strong> {trade.pnlPercent != null ? `${trade.pnlPercent.toFixed(2)} %` : "–"}</p>
                </div>
            </div>

            {/* Lightbox für Großansicht */}
            {showLightbox && (
                <div className="lightbox-overlay" onClick={() => setShowLightbox(false)}>
                    <img className="lightbox-image" src={trade.screenshot} alt="Großansicht Screenshot" />
                </div>
            )}
        </>
    );
}
