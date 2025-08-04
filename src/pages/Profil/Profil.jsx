import React, { useState, useMemo } from "react";
import "./Profil.scss";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { PiSignOutBold } from "react-icons/pi";
import { useUser } from "@clerk/clerk-react";
import { useClerk } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import ImportPanel from "../../components/Profil/ImportPanel"
import StrategyInfoPanel from "../../components/Profil/StrategyInfoPanel";
import ErrorTagsMananger from "../../components/Profil/ErrorTagsMananger";
import StrategyManagementPanel from "../../components/Profil/StrategyManagementPanel";
import DeleteAllTradesPanel from "../../components/Profil/DeleteAllTradesPanel";
import { StartCapitalPanel } from "../../components/Profil/startCapitalPanel";
import { ExportPanel } from "../../components/Profil/ExportPanel"

import JSZip from "jszip";

const altImg = "../../assets/NoProfile.jpg";

export default function Profil() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const userId = user?.id;
  const importTrades = useMutation(api.trades.importTrades);

  const [showStartCapitalPanel, setShowStartCapitalPanel] = useState(false);

  const [showImportPanel, setShowImportPanel] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importMode, setImportMode] = useState("append"); // "append" oder "replace"
  const [importing, setImporting] = useState(false);

  const [showStrategyPanel, setShowStrategyPanel] = useState(false);
  const [showFehlerTagsPanel, setShowFehlerTagsPanel] = useState(false);
  const [showStrategiesPanel, setShowStrategiesPanel] = useState(false);
  const [showDeletePanel, setShowDeletePanel] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);

  const trades = useQuery(api.trades.getUserTrades, userId ? { userId } : "skip");
  const purchased = useQuery(api.userSettings.getUserPurchasedProducts, userId ? { userId } : "skip");

  const strategyData = useMemo(() => {
    const safeTrades = Array.isArray(trades) ? trades : [];

    const grouped = {};
    safeTrades.forEach((trade) => {
      const key = trade.strategy || "Unbekannt";
      if (!grouped[key]) grouped[key] = { count: 0, wins: 0 };
      grouped[key].count += 1;
      if (trade.profit > 0) grouped[key].wins += 1;
    });

    return Object.entries(grouped).map(([strategy, stats]) => ({
      strategy,
      count: stats.count,
      wins: stats.wins,
      winrate: Math.round((stats.wins / stats.count) * 100),
    }));
  }, [trades]);

  if (!user || !trades || !purchased) return <div className="lds-ripple loader-text"><div></div><div></div></div>;

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

  const handleImportData = async () => {
    if (!importFile) return;
    setImporting(true);

    try {
      const text = await importFile.text();
      let importedTrades = JSON.parse(text);

      // Namen anpassen:
      importedTrades = importedTrades.map(t => ({
        ...t,
        name: t.name ? t.name + " - import" : "importierter Trade",
      }));

      await importTrades({
        trades: importedTrades,
        mode: importMode,
      });

      // TODO: UI Erfolgsmeldung
      setImportFile(null);
    } catch (error) {
      // TODO: UI Fehlermeldung
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
        {showStartCapitalPanel && (
          <StartCapitalPanel onComplete={() => setShowStartCapitalPanel(false)} />
        )}

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
            <li><button onClick={() => setShowExportPanel(true)}>📥 Trade Daten exportieren</button></li>
            <li><button onClick={() => setShowImportPanel(!showImportPanel)}>📤 Trade Daten importieren</button></li>
            <li><button onClick={() => setShowStartCapitalPanel(true)}>💰 Startkapital ändern</button></li>
            <li><button onClick={() => alert("Feature kommt bald!")}>📊 Persönliche Analyse anfordern</button></li>
            <li><button onClick={() => setShowStrategyPanel(true)}>🎯 Strategieauswertung anzeigen</button></li>
            <li><button onClick={() => setShowFehlerTagsPanel(true)}>🎛️ Fehler-Tags verwalten</button></li>
            <li><button onClick={() => setShowStrategiesPanel(true)}>🧠 Strategien verwalten</button></li>
            <li><button onClick={() => alert("Feature kommt bald!")}>📝 Eigene Checklisten anlegen</button></li>
            <li><button onClick={() => alert("Feature kommt bald!")}>⚙️ App-Thema (Dark/Light) ändern</button></li>
            <li><button onClick={() => setShowDeletePanel(true)}>❌ Alle Einträge Löschen</button></li>
            <li><button onClick={() => alert("Feature kommt bald!")}>🔐 Account löschen</button></li>
          </ul>
        </div>
      </div>
      {showStrategyPanel && (
        <StrategyInfoPanel
          strategyData={strategyData}
          onClose={() => setShowStrategyPanel(false)}
        />
      )}

      {showDeletePanel && (
        <DeleteAllTradesPanel userId={userId} onClose={() => setShowDeletePanel(false)} />
      )}

      {showFehlerTagsPanel && (
        <ErrorTagsMananger onClose={() => setShowFehlerTagsPanel(false)} />
      )}

      {showStrategiesPanel && <StrategyManagementPanel onClose={() => setShowStrategiesPanel(false)} />}

      {showExportPanel && (
        <ExportPanel
          trades={trades}
          onClose={() => setShowExportPanel(false)}
        />
      )}

      {showImportPanel && (
        <ImportPanel
          importFile={importFile}
          setImportFile={setImportFile}
          importMode={importMode}
          setImportMode={setImportMode}
          onImportSuccess={async (data, mode) => {
            const mapped = data.map(t => ({
              ...t,
              name: t.name ? t.name + " - import" : "importierter Trade",
            }));
            await importTrades({ trades: mapped, mode });
          }}
          handleImportData={handleImportData}
          importing={importing}
          setImporting={setImporting}
          onClose={() => setShowImportPanel(false)}
        />
      )}
    </div>
  );
}
