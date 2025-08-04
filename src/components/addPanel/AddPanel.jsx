import './AddPanel.scss';
import { useEffect, useState } from 'react';
import { MdError } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@clerk/clerk-react";

export default function AddPanel({ onClose, trade = null }) {
    const { userId } = useAuth();

    const addTrade = useMutation(api.trades.addTrade);
    const updateTrade = useMutation(api.trades.updateTrade);
    const settings = useQuery(api.userSettings.getSettings, { userId: userId });
    const saveSettings = useMutation(api.userSettings.saveSettings);

    const [deleteMode, setDeleteMode] = useState(false);

    // States für Settings
    const [strategies, setStrategies] = useState(["Breakout", "Reversal", "FVG", "OB Test"]);
    const [errorTags, setErrorTags] = useState([]);

    // UI States
    const [showStrategyPanel, setShowStrategyPanel] = useState(false);
    const [newStrategy, setNewStrategy] = useState("");
    const [showTagInput, setShowTagInput] = useState(false);
    const [newTag, setNewTag] = useState("");

    // Controlled Inputs für Trade
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

    // Settings laden bei Start / Änderungen
    useEffect(() => {
        if (settings) {
            setStrategies(settings.strategies || []);
            setErrorTags(settings.errorTags || []);
        }
    }, [settings]);

    // Trade laden, wenn Editieren
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
        } else {
            // Reset
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
        }
    }, [trade]);

    // Scroll verhindern bei geöffnetem Panel
    useEffect(() => {
        document.querySelector('html').style.overflowY = 'hidden';
        return () => {
            document.querySelector('html').style.overflowY = 'auto';
        };
    }, []);

    // Persistiere Einstellungen zentral
    const persistSettings = (updatedStrategies = strategies, updatedTags = errorTags) => {
        saveSettings({
            userId: userId,
            strategies: updatedStrategies,
            errorTags: updatedTags,
        });
    };

    // Strategie hinzufügen und direkt speichern
    const handleAddStrategy = () => {
        const trimmed = newStrategy.trim();
        if (!trimmed || strategies.includes(trimmed)) return;
        const updated = [...strategies, trimmed];
        setStrategies(updated);
        setNewStrategy("");
        persistSettings(updated, errorTags);
    };

    // Strategie löschen und speichern
    const handleDeleteStrategy = (strat) => {
        const updated = strategies.filter(s => s !== strat);
        setStrategies(updated);
        persistSettings(updated, errorTags);
        // Falls gelöschte Strategie aktuell ausgewählt ist, clearen
        if (strategy === strat) setStrategy("");
    };

    // Neues Fehler-Tag hinzufügen und speichern
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

    // Fehler-Tag löschen und speichern
    const handleDeleteTag = (tag) => {
        const updated = errorTags.filter(t => t !== tag);
        setErrorTags(updated);
        setSelectedTags(prev => prev.filter(t => t !== tag));
        persistSettings(strategies, updated);
    };

    // Toggle Fehler-Tag Auswahl
    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    // Save Trade (neu oder update)
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

        // Strategie in Liste sichern, wenn neu
        let updatedStrategies = strategies;
        if (strategy && !strategies.includes(strategy)) {
            updatedStrategies = [...strategies, strategy];
            setStrategies(updatedStrategies);
        }

        // Neue Error-Tags sichern, falls vorhanden
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

    if (!userId) return <div>Bitte anmelden...</div>;

    return (
        <div className='blur'>
            <div className="panel">
                <div className="header">
                    <h1>{trade ? "Trade bearbeiten" : "Neuen Trade hinzufügen"}</h1>
                </div>
                <div className="form">
                    {errorMessage && (
                        <div style={{
                            color: '#dc3232',
                            textAlign: 'center',
                            marginBottom: '1rem',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <MdError />
                            {errorMessage}
                        </div>
                    )}

                    <label>Wert</label>
                    <input type="text" placeholder='Wert' value={name} onChange={e => setName(e.target.value)} />

                    <div className="unite">
                        <div className="inputComplete twoPart">
                            <label>G/V</label>
                            <div className="gvRow">
                                <div className="toggle-row">
                                    <button
                                        className={isLoss ? 'toggle loss' : 'toggle gain'}
                                        onClick={() => setIsLoss(prev => !prev)}
                                    >
                                        {isLoss ? '-' : '+'}
                                    </button>
                                </div>
                                <input type="number" placeholder='G/V' value={profit} onChange={e => setProfit(e.target.value)} />
                            </div>
                        </div>

                        <div className="inputComplete">
                            <label>RRR</label>
                            <input type="number" placeholder='Risk Reward Ratio' value={ratio} onChange={e => setRatio(e.target.value)} />
                        </div>
                    </div>

                    <div className="unite">
                        <div className="inputComplete">
                            <label>Strategie</label>
                            <select value={strategy} onChange={e => setStrategy(e.target.value)}>
                                <option value="">Bitte auswählen</option>
                                {strategies.map((strat, i) => (
                                    <option key={i} value={strat}>{strat}</option>
                                ))}
                            </select>
                            <div className="toggle-row">
                                <button className="toggle on" onClick={() => setShowStrategyPanel(true)}>
                                    Liste anpassen
                                </button>
                            </div>
                        </div>

                        <div className="inputComplete">
                            <label>Chartbild Link (optional)</label>
                            <input type="text" placeholder='URL' value={imageOrLink} onChange={e => setImageOrLink(e.target.value)} />
                        </div>
                    </div>

                    <div className="unite">
                        <div className="inputComplete">
                            <label>Kommentar (optional)</label>
                            <input type="text" placeholder='optional' value={comment} onChange={e => setComment(e.target.value)} />
                        </div>
                        <div className="inputComplete">
                            <label>Long/Short</label>
                            <select value={direction} onChange={e => setDirection(e.target.value)}>
                                <option value="Long">Long</option>
                                <option value="Short">Short</option>
                            </select>
                        </div>
                    </div>

                    {/* Fehler Tagging */}
                    <div className="formSection">
                        <label>Fehler-Tagging (optional)</label>
                        <div className="tag-container">
                            {errorTags.map(tag => (
                                <div
                                    key={tag}
                                    className={`tag ${selectedTags.includes(tag) ? "selected" : ""}`}
                                    onClick={() => toggleTag(tag)}
                                >
                                    {tag}
                                    {deleteMode && (
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTag(tag);
                                            }}
                                            style={{ marginLeft: '5px', color: 'red', cursor: 'pointer' }}
                                        >
                                            <IoClose className='IoClose' />
                                        </span>
                                    )}
                                </div>
                            ))}

                            <div className="tag add-tag-button" onClick={() => setShowTagInput(true)}>+</div>

                            <div
                                className={`tag delete-toggle-button ${deleteMode ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation(); // verhindert Sofort-Deaktivierung
                                    setDeleteMode(prev => !prev);
                                }}
                                title="Fehler löschen"
                            >
                                <FaTrash />
                            </div>
                        </div>

                        {showTagInput && (
                            <div className="tag-input-panel">
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

                    {/* Strategie Verwaltung Popup */}
                    {showStrategyPanel && (
                        <div className="add-strategy-popup">
                            <div className="popup-inner">
                                <h3>Strategien verwalten</h3>
                                <ul className="strategy-list">
                                    {strategies.map((strat, i) => (
                                        <li key={i}>
                                            {strat}
                                            <button onClick={() => handleDeleteStrategy(strat)}><IoClose /></button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="popup-input-row">
                                    <input
                                        type="text"
                                        placeholder="Neue Strategie..."
                                        value={newStrategy}
                                        onChange={e => setNewStrategy(e.target.value)}
                                    />
                                    <button onClick={handleAddStrategy}>Hinzufügen</button>
                                </div>
                                <div className="popup-actions">
                                    <button
                                        onClick={() => {
                                            setShowStrategyPanel(false);
                                            persistSettings(); // Beim Schließen speichern
                                        }}
                                    >
                                        Fertig
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Erweitert */}
                    <h2 style={{ fontSize: "1.2rem", color: "white", paddingLeft: "1rem", margin: "1rem 0" }}>Erweitert</h2>
                    <div className="unite">
                        <div className="inputComplete">
                            <label>Position Größe</label>
                            <input
                                type="number"
                                disabled={!showPositionSize}
                                value={positionSize}
                                onChange={e => setPositionSize(e.target.value)}
                                placeholder='optional'
                            />
                            <div className="toggle-row">
                                <button
                                    className={showPositionSize ? 'toggle on' : 'toggle off'}
                                    onClick={() => setShowPositionSize(prev => !prev)}
                                >
                                    {showPositionSize ? 'Aktiviert' : 'Deaktiviert'}
                                </button>
                            </div>
                        </div>

                        <div className="inputComplete">
                            <label>Uhrzeit</label>
                            <input
                                type="datetime-local"
                                disabled={!manualTime}
                                value={time}
                                onChange={e => setTime(e.target.value)}
                            />
                            <div className="toggle-row">
                                <button
                                    className={manualTime ? 'toggle on' : 'toggle off'}
                                    onClick={() => setManualTime(prev => !prev)}
                                >
                                    {manualTime ? 'Manuell' : 'Automatisch'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="unite">
                        <div className="inputComplete">
                            <label>Entry Preis</label>
                            <input
                                type="number"
                                placeholder='z. B. 5321.5'
                                value={entry}
                                onChange={e => setEntry(e.target.value)}
                            />
                        </div>
                        <div className="inputComplete">
                            <label>Exit Preis</label>
                            <input
                                type="number"
                                placeholder='z. B. 5389.0'
                                value={exit}
                                onChange={e => setExit(e.target.value)}
                            />
                        </div>
                    </div>

                </div>

                <div className="bottomHandlings">
                    <button onClick={onClose} className='Ignore'>Verwerfen</button>
                    <button onClick={handleSave} className='Save'>
                        {trade ? "Aktualisieren" : "Speichern"}
                    </button>
                </div>
            </div>
        </div>
    );
}
