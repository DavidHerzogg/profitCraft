import './checklistPanel.scss';
import { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";

export default function ChecklistPanel({ onClose }) {
  const [selectedChecklist, setSelectedChecklist] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    document.querySelector('html').style.overflowY = 'hidden';
    return () => {
      document.querySelector('html').style.overflowY = 'auto';
    };
  }, []);

  const exampleChecklists = {
    "Silver Bullet Strategie": [
      "London Manipulation erkannt",
      "Marktstruktur Break (MSB) vorhanden",
      "Fair Value Gap im Entry-Bereich",
      "Entry in FVG nach Liquidity Grab",
      "Stopp korrekt gesetzt",
      "Take Profit Level klar definiert",
      "Time Window korrekt (10:00–12:00 CET)"
    ]
  };

  const checklistNames = Object.keys(exampleChecklists);

  const toggleCheck = (item) => {
    setCheckedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  return (
    <div className="checklist-overlay">
      <div className="checklist-container">
        <div className="checklist-header">
          <h1 id="checklistTitle">Checkliste</h1>
          <button onClick={onClose} aria-label="Schließen" title="Checkliste schließen" className="close-btn">
            <IoClose />
          </button>
        </div>

        <div className="checklist-content">
          <div className="checklist-section">
            <label>Checkliste auswählen</label>
            <select
              value={selectedChecklist}
              onChange={e => {
                setSelectedChecklist(e.target.value);
                setCheckedItems([]);
              }}
              className="checklist-select"
            >
              <option value="">– Keine ausgewählt –</option>
              {checklistNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {selectedChecklist ? (
            <div className="checklist-section checklist-checkbox-group">
              {exampleChecklists[selectedChecklist].map(item => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(item)}
                    onChange={() => toggleCheck(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          ) : (
            <div className="checklist-section">
              <p>Du hast noch keine Checkliste ausgewählt.</p>
              <a href="/shop">
                <button className="checklist-link-btn">Zum Shop</button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
