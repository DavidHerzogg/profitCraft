import React from "react";

export function ConfirmDeleteModal({ trade, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content bounce-in">
        <h3>Löschen bestätigen</h3>
        <p>
          Willst du den Eintrag <strong>{trade.name}</strong> wirklich löschen?
        </p>
        <div className="modal-buttons">
          <button className="btn btn-danger" onClick={onConfirm}>
            Ja, löschen
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}
