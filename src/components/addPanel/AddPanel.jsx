import { useEffect, useState } from 'react';
import { MdError } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@clerk/clerk-react";
import './AddPanel.scss';

export default function AddPanel({ onClose, trade = null }) {
  const { userId } = useAuth();

  const addTrade = useMutation(api.trades.addTrade);
  const updateTrade = useMutation(api.trades.updateTrade);
  const settings = useQuery(api.userSettings.getSettings, { userId: userId });
  const saveSettings = useMutation(api.userSettings.saveSettings);

  const [deleteMode, setDeleteMode] = useState(false);
  const [strategies, setStrategies] = useState(["Breakout", "Reversal", "FVG", "OB Test"]);
  const [errorTags, setErrorTags] = useState([]);
  const [showStrategyPanel, setShowStrategyPanel] = useState(false);
  const [newStrategy, setNewStrategy] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [name, setName] = useState("");
  const [profit, setProfit] = useState("");
  const [ratio, setRatio] = useState("");
  const [entry, setEntry] = useState("");
  const [exit, setExit] = useState("");
  const [strategy, setStrategy] = useState("");
  const [direction, setDirection] = useState("Long");
  const [imageOrLink, setImageOrLink] = useState("");
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoss, setIsLoss] = useState(false);
  const [showPositionSize, setShowPositionSize] = useState(false);
  const [positionSize, setPositionSize] = useState("");
  const [manualTime, setManualTime] = useState(false);
  const [time, setTime] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const timeframes = ['1D', '4H', '1H', '30m', '15m', '5m', '1m'];
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.tag-container')) {
        setDeleteMode(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (settings) {
      setStrategies(settings.strategies || []);
      setErrorTags(settings.errorTags || []);
    }
  }, [settings]);

  useEffect(() => {
    if (trade) {
      setName(trade.name || "");
      setProfit(trade.profit != null ? Math.abs(trade.profit).toString() : "");
      setIsLoss(trade.profit != null && trade.profit < 0);
      setRatio(trade.ratio != null ? trade.ratio.toString() : "");
      setEntry(trade.entry != null ? trade.entry.toString() : "");
      setExit(trade.exit != null ? trade.exit.toString() : "");
      setStrategy(trade.strategy || "");
      setDirection(trade.direction || "Long");
      setImageOrLink(trade.screenshot || "");
      setComment(trade.comment || "");
      setErrorTags(trade.errorTags || []);
      setSelectedTags(trade.errorTags || []);
      setPositionSize(trade.size != null ? trade.size.toString() : "");
      setShowPositionSize(trade.size != null);
      setManualTime(false);
      setTime(trade.date ? new Date(trade.date).toISOString().slice(0, 16) : "");
      setTimeframe(trade.timeframe || "");
    } else {
      setName("");
      setProfit("");
      setIsLoss(false);
      setRatio("");
      setEntry("");
      setExit("");
      setStrategy("");
      setDirection("Long");
      setImageOrLink("");
      setComment("");
      setErrorTags([]);
      setSelectedTags([]);
      setPositionSize("");
      setShowPositionSize(false);
      setManualTime(false);
      setTime("");
      setTimeframe("");
    }
  }, [trade]);

  useEffect(() => {
    document.querySelector('html').style.overflowY = 'hidden';
    return () => {
      document.querySelector('html').style.overflowY = 'auto';
    };
  }, []);

  const persistSettings = (updatedStrategies = strategies, updatedTags = errorTags) => {
    saveSettings({
      userId: userId,
      strategies: updatedStrategies,
      errorTags: updatedTags,
    });
  };

  const handleAddStrategy = () => {
    const trimmed = newStrategy.trim();
    if (!trimmed || strategies.includes(trimmed)) return;
    const updated = [...strategies, trimmed];
    setStrategies(updated);
    setNewStrategy("");
    persistSettings(updated, errorTags);
  };

  const handleDeleteStrategy = (strat) => {
    const updated = strategies.filter(s => s !== strat);
    setStrategies(updated);
    persistSettings(updated, errorTags);
    if (strategy === strat) setStrategy("");
  };

  const handleAddNewTag = () => {
    const trimmed = newTag.trim();
    if (!trimmed || errorTags.includes(trimmed)) return;
    const updated = [...errorTags, trimmed];
    setErrorTags(updated);
    setSelectedTags(prev => [...prev, trimmed]);
    setNewTag("");
    setShowTagInput(false);
    persistSettings(strategies, updated);
  };

  const handleDeleteTag = (tag) => {
    const updated = errorTags.filter(t => t !== tag);
    setErrorTags(updated);
    setSelectedTags(prev => prev.filter(t => t !== tag));
    persistSettings(strategies, updated);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!name || !profit || !ratio || !strategy || !direction) {
      setErrorMessage("Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    setErrorMessage("");

    const profitValue = parseFloat(profit);
    const effectiveProfit = isLoss ? -Math.abs(profitValue) : Math.abs(profitValue);
    const percentageGain = positionSize
      ? ((effectiveProfit / parseFloat(positionSize)) * 100).toFixed(2)
      : null;
    const tradeTime = manualTime
      ? new Date(time).toISOString()
      : trade?.date || new Date().toISOString();

    let updatedStrategies = strategies;
    if (strategy && !strategies.includes(strategy)) {
      updatedStrategies = [...strategies, strategy];
      setStrategies(updatedStrategies);
    }

    let updatedTags = errorTags;
    const newTags = selectedTags.filter(tag => !errorTags.includes(tag));
    if (newTags.length > 0) {
      updatedTags = [...errorTags, ...newTags];
      setErrorTags(updatedTags);
    }

    persistSettings(updatedStrategies, updatedTags);

    try {
      if (trade) {
        await updateTrade({
          _id: trade._id,
          userId: userId,
          name,
          profit: effectiveProfit,
          ratio: parseFloat(ratio),
          timeframe: timeframe || "",
          isLoss,
          entry: entry ? parseFloat(entry) : undefined,
          exit: exit ? parseFloat(exit) : undefined,
          direction,
          strategy,
          screenshot: imageOrLink || "",
          comment: comment || "",
          errorTags: selectedTags,
          size: showPositionSize ? parseFloat(positionSize) : undefined,
          pnlPercent: percentageGain ? parseFloat(percentageGain) : undefined,
          date: tradeTime,
        });
      } else {
        await addTrade({
          userId: userId,
          name,
          profit: effectiveProfit,
          ratio: parseFloat(ratio),
          timeframe: timeframe || "",
          isLoss,
          entry: entry ? parseFloat(entry) : undefined,
          exit: exit ? parseFloat(exit) : undefined,
          direction,
          strategy,
          screenshot: imageOrLink || "",
          comment: comment || "",
          errorTags: selectedTags,
          size: showPositionSize ? parseFloat(positionSize) : undefined,
          pnlPercent: percentageGain ? parseFloat(percentageGain) : undefined,
          date: tradeTime,
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage("Fehler beim Speichern.");
    }
  };

  if (!userId) return <div className="not-logged-in">Bitte anmelden...</div>;

  return (
    <div className="add-panel" role="dialog" aria-modal="true" aria-labelledby="addPanelTitle">
      <div className="panel-container">
        <div className="scrollable-content">
          <div className="header">
            <h1 id="addPanelTitle">{trade ? "Trade bearbeiten" : "Neuen Trade hinzufügen"}</h1>
          </div>
          <div className="form-content">
            {errorMessage && (
              <div className="error-message">
                <MdError />
                {errorMessage}
              </div>
            )}
            <div className="input-group">
              <label>Wert</label>
              <input
                type="text"
                placeholder="Wert"
                value={name}
                onChange={e => setName(e.target.value)}
                aria-invalid={!!errorMessage}
              />
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>G/V</label>
                <div className="profit-group">
                  <button
                    className={isLoss ? "loss" : ""}
                    onClick={() => setIsLoss(prev => !prev)}
                  >
                    {isLoss ? '-' : '+'}
                  </button>
                  <input
                    type="number"
                    placeholder="G/V"
                    value={profit}
                    onChange={e => setProfit(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>RRR</label>
                <input
                  type="number"
                  placeholder="Risk Reward Ratio"
                  value={ratio}
                  onChange={e => setRatio(e.target.value)}
                />
              </div>
            </div>
            <div className="input-row strategy-group">
              <div className="input-group">
                <label>Strategie</label>
                <select value={strategy} onChange={e => setStrategy(e.target.value)}>
                  <option value="">Bitte auswählen</option>
                  {strategies.map((strat, i) => (
                    <option key={i} value={strat}>{strat}</option>
                  ))}
                </select>
                <button className="edit-list-button" onClick={() => setShowStrategyPanel(true)}>
                  Liste anpassen
                </button>
              </div>
              <div className="input-group">
                <label>Chartbild Link (optional)</label>
                <input
                  type="text"
                  placeholder="URL"
                  value={imageOrLink}
                  onChange={e => setImageOrLink(e.target.value)}
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Kommentar (optional)</label>
                <input
                  type="text"
                  placeholder="optional"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Long/Short</label>
                <select value={direction} onChange={e => setDirection(e.target.value)}>
                  <option value="Long">Long</option>
                  <option value="Short">Short</option>
                </select>
              </div>
            </div>
            <div className="timeframe-group">
              <label>Timeframe (optional)</label>
              <div className="tag-container">
                {timeframes.map((tf) => (
                  <div
                    key={tf}
                    className={`tag ${timeframe === tf ? 'selected' : ''}`}
                    onClick={() => setTimeframe(tf === timeframe ? null : tf)}
                  >
                    {tf}
                  </div>
                ))}
              </div>
            </div>
            <div className="tag-group">
              <label>Fehler-Tagging (optional)</label>
              <div className="tag-container">
                {errorTags.map(tag => (
                  <div
                    key={tag}
                    className={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                    {deleteMode && (
                      <span
                        className="delete-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTag(tag);
                        }}
                      >
                        <IoClose />
                      </span>
                    )}
                  </div>
                ))}
                <div className="add-tag" onClick={() => setShowTagInput(true)}>
                  +
                </div>
                <div
                  className={`delete-mode ${deleteMode ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteMode(prev => !prev);
                  }}
                  title="Fehler löschen"
                >
                  <FaTrash />
                </div>
              </div>
              {showTagInput && (
                <div className="tag-input">
                  <input
                    type="text"
                    placeholder="Neues Tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                  <button onClick={handleAddNewTag}>Hinzufügen</button>
                </div>
              )}
            </div>
            {showStrategyPanel && (
              <div className="strategy-panel">
                <div className="strategy-panel-content">
                  <h3>Strategien verwalten</h3>
                  <ul>
                    {strategies.map((strat, i) => (
                      <li key={i}>
                        {strat}
                        <button onClick={() => handleDeleteStrategy(strat)}>
                          <IoClose />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Neue Strategie..."
                      value={newStrategy}
                      onChange={e => setNewStrategy(e.target.value)}
                    />
                    <button onClick={handleAddStrategy}>Hinzufügen</button>
                  </div>
                  <div className="close-button">
                    <button
                      onClick={() => {
                        setShowStrategyPanel(false);
                        persistSettings();
                      }}
                    >
                      Fertig
                    </button>
                  </div>
                </div>
              </div>
            )}
            <h2 className="section-title">Erweitert</h2>
            <div className="input-row position-size-group">
              <div className="input-group">
                <label>Position Größe</label>
                <input
                  type="number"
                  disabled={!showPositionSize}
                  value={positionSize}
                  onChange={e => setPositionSize(e.target.value)}
                  placeholder="optional"
                />
                <button
                  className={`toggle-button ${showPositionSize ? 'active' : ''}`}
                  onClick={() => setShowPositionSize(prev => !prev)}
                >
                  {showPositionSize ? 'Aktiviert' : 'Deaktiviert'}
                </button>
              </div>
              <div className="input-group time-group">
                <label>Uhrzeit</label>
                <input
                  type="datetime-local"
                  disabled={!manualTime}
                  value={time}
                  onChange={e => setTime(e.target.value)}
                />
                <button
                  className={`toggle-button ${manualTime ? 'active' : ''}`}
                  onClick={() => setManualTime(prev => !prev)}
                >
                  {manualTime ? 'Manuell' : 'Automatisch'}
                </button>
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Entry Preis</label>
                <input
                  type="number"
                  placeholder="z. B. 5321.5"
                  value={entry}
                  onChange={e => setEntry(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Exit Preis</label>
                <input
                  type="number"
                  placeholder="z. B. 5389.0"
                  value={exit}
                  onChange={e => setExit(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="action-buttons">
          <button className="cancel" onClick={onClose}>
            Verwerfen
          </button>
          <button className="save" onClick={handleSave}>
            {trade ? "Aktualisieren" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}
