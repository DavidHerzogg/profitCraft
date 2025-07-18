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
    <div className='filter-blur'>
      <div className="filter-panel">
        <div className="header">
          <h2>Checkliste</h2>
          <button onClick={onClose} aria-label="Schließen">
            <IoClose style={{ color: "white" }} />
          </button>
        </div>

        <div className="section">
          <label>Checkliste auswählen</label>
          <select
            value={selectedChecklist}
            onChange={e => {
              setSelectedChecklist(e.target.value);
              setCheckedItems([]);
            }}
          >
            <option value="">– Keine ausgewählt –</option>
            {checklistNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {selectedChecklist ? (
          <div className="section checkbox-group">
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
          <div className="section">
            <p>Du hast noch keine Checkliste ausgewählt.</p>
            <a href="/shop">
              <button style={{ marginTop: "1rem" }}>Zum Shop</button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
