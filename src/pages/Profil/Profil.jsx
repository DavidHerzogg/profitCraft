import React, { useState } from "react";
import "./Profil.scss";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { PiSignOutBold } from "react-icons/pi";
import { useUser } from "@clerk/clerk-react";
import { useClerk } from "@clerk/clerk-react";
import ImportPanel from "../../components/ImportPanel"
import { useMutation } from "convex/react";

import JSZip from "jszip";
import { saveAs } from "file-saver";

const altImg = "../../assets/NoProfile.jpg";

export default function Profil() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const userId = user?.id;
  const importTrades = useMutation(api.trades.importTrades);

  const [showImportPanel, setShowImportPanel] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importMode, setImportMode] = useState("append"); // "append" oder "replace"
  const [importing, setImporting] = useState(false);

  const trades = useQuery(api.trades.getUserTrades, userId ? { userId } : "skip");
  const purchased = useQuery(api.userSettings.getUserPurchasedProducts, userId ? { userId } : "skip");

  if (!user || !trades || !purchased) return <div>Lade...</div>;

  const totalTrades = trades.length;
  const wins = trades.filter(t => !t.isLoss).length;
  const winrate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0;
  const avgProfit = trades.length > 0
    ? (trades.reduce((acc, t) => acc + t.profit, 0) / trades.length).toFixed(2)
    : "0.00";

  const strategyCount = {};
  trades.forEach(t => {
    strategyCount[t.strategy] = (strategyCount[t.strategy] || 0) + 1;
  });
  const topStrategy = Object.entries(strategyCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "Keine";

  const handleExportData = async () => {
    if (!trades) return;

    const zip = new JSZip();
    const tradesJson = JSON.stringify(trades, null, 2); // schön formatiert
    zip.file("trades.json", tradesJson);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "ProfitCraft-TradeExport.zip");
  };

  const handleImportData = async () => {
    if (!importFile) return;
    setImporting(true);

    try {
      const text = await importFile.text();
      const importedTrades = JSON.parse(text);

      await importTrades({
        trades: importedTrades,
        mode: importMode,
      });

      // TODO: Zeige Erfolgsmeldung im UI
      setImportFile(null);
    } catch (error) {
      // TODO: Zeige Fehlermeldung im UI
      console.error("Import fehlgeschlagen:", error);
    } finally {
      setImporting(false);
    }
  };


  return (
    <div className="pageContent">
      <header>
        <h1>Profil</h1>
        <button className="signout" onClick={() => signOut()}>
          <PiSignOutBold /> Abmelden
        </button>
      </header>

      <div className="profile-container">
        <div className="profile-header">
          <img src={user.imageUrl || altImg} alt="Profil" className="profile-avatar" />
          <div>
            <h2>{user.fullName || user.emailAddresses[0]?.emailAddress}</h2>
            <p>Clerk-ID: {user.id}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card"><span>Trades: </span><strong>{totalTrades}</strong></div>
          <div className="stat-card"><span>Winrate: </span><strong>{winrate}%</strong></div>
          <div className="stat-card"><span>Ø Profit: </span><strong>{avgProfit}</strong></div>
          <div className="stat-card"><span>Top Strategie: </span><strong>{topStrategy}</strong></div>
          <div className="stat-card"><span>Käufe: </span><strong>{purchased.length}</strong></div>
        </div>

        <div className="profile-settings">
          <h3>Nützliche Einstellungen</h3>
          <ul>
            <li><button onClick={handleExportData}>📥 Trade Daten exportieren</button></li>
            <li><button onClick={() => setShowImportPanel(!showImportPanel)}>📤 Trade Daten importieren</button></li>
            <li><button onClick={() => alert("Feature kommt bald!")}>📊 Persönliche Analyse anfordern</button></li>
            <li><button onClick={() => alert("Feature kommt bald!")}>🎯 Strategieauswertung anzeigen</button></li>
            <li><button onClick={() => alert("Feature kommt bald!")}>🎛️ Fehler-Tags verwalten</button></li>
            <li><button onClick={() => alert("Feature kommt bald!")}>🧠 Strategien verwalten</button></li>
            <li><button onClick={() => alert("Feature kommt bald!")}>📅 Zeitfenster-Voreinstellungen setzen</button></li>
            <li><button onClick={() => alert("Feature kommt bald!")}>🔔 Tages-Benachrichtigungen aktivieren</button></li>
            <li><button onClick={() => alert("Feature kommt bald!")}>📦 Gekaufte Produkte verwalten</button></li>
            <li><button onClick={() => alert("Feature kommt bald!")}>📝 Eigene Checklisten anlegen</button></li>
            <li><button onClick={() => alert("Feature kommt bald!")}>⚙️ App-Thema (Dark/Light) ändern</button></li>
            <li><button onClick={() => alert("Feature kommt bald!")}>🔐 Account löschen</button></li>
          </ul>
        </div>
      </div>
      {showImportPanel && (
        <ImportPanel
          importFile={importFile}
          setImportFile={setImportFile}
          importMode={importMode}
          setImportMode={setImportMode}
          handleImportData={handleImportData}
          importing={importing}
          onClose={() => setShowImportPanel(false)}
        />
      )}
    </div>
  );
}
