import "./Dashboard.scss";
import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useLocation } from "react-router-dom";

import { CapitalChart } from "../../components/dashboard/CapitalChart/CapitalChart";
import { WinrateChart } from "../../components/dashboard/WinrateChart/WinrateChart";
import { RrrChart } from "../../components/dashboard/RrrChart/RrrChart";
import { PnlChart } from "../../components/dashboard/PnlChart/PnlChart";
import { DirectionChart } from "../../components/dashboard/DirectionChart/DirectionChart";

import PurchasedProductsPanel from "../../components/purchasedProductsPanel/PurchasedProductsPanel";
import ImageSlider from "../../components/imageSlider";

import { IoClose } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { IoCheckmarkCircle } from "react-icons/io5";
import { LuTableOfContents } from "react-icons/lu";

import ChartPick from "../../assets/chart-1942060_1280.jpg"
import ShopPick from "../../assets/coffee-shop-6771371_1280.jpg"

import { useAuth } from "@clerk/clerk-react";
import { StartCapitalPanel } from "../../components/startCapitalPanel"

export default function Dashboard() {
  const { userId } = useAuth();
  const startCapital = useQuery(api.userSettings.getStartCapital, userId ? { userId } : "skip");
  const [showStartCapitalPanel, setShowStartCapitalPanel] = useState(false);
  useEffect(() => {
    if (startCapital === null || startCapital === undefined) {
      setShowStartCapitalPanel(true);
    }
  }, [startCapital]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const openPurchased = queryParams.get("openPurchased") === "true";

  // States
  const [showPremium, setShowPremium] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(openPurchased);
  const [activeProduct, setActiveProduct] = useState(null);

  // Sync Panel Open Status mit URL-Parameter
  useEffect(() => {
    setIsPanelOpen(openPurchased);
  }, [openPurchased]);

  // Convex-Daten abfragen
  const trades = useQuery(api.trades.getUserTrades, { userId });
  const purchasedProducts = useQuery(api.userSettings.getUserPurchasedProducts, { userId });

  // Trades formatieren
  const parsedTrades = useMemo(() => {
    return (trades ?? []).map((t) => ({
      date: t.date,
      profit: t.profit,
      rrr: t.ratio,
      type: t.direction.toLowerCase(),
    }));
  }, [trades]);

  // Handler
  const openPremiumPanel = (e) => {
    e.preventDefault();
    setShowPremium(true);
  };
  const closePremiumPanel = () => setShowPremium(false);
  const openProductsPanel = () => setIsPanelOpen(true);
  const closeProductsPanel = () => {
    setIsPanelOpen(false);
    setActiveProduct(null);
  };
  const handleOpenProduct = (product) => setActiveProduct(product);

  if (!userId) return <div>Bitte anmelden...</div>;
  if (!trades || !purchasedProducts) return <div className="loader">Lade Daten...</div>;
  if (startCapital === undefined) {
    // Lade-Status: Nichts rendern oder Loader anzeigen
    return null; // Oder <Loader /> wenn du willst
  }
  const canChangeStartCapital = !startCapital || startCapital === 0;

  return (
    <div className="pageContent">
      <header>
        <h1>Dashboard</h1>
        <button className="rescources" onClick={openProductsPanel}>
          <LuTableOfContents style={{ fontSize: "1.8rem" }} />
          Meine Inhalte
        </button>
      </header>

      {isPanelOpen && (
        <PurchasedProductsPanel
          products={purchasedProducts}
          onClose={closeProductsPanel}
          onOpenProduct={handleOpenProduct}
        />
      )}

      {canChangeStartCapital && showStartCapitalPanel && (
        <StartCapitalPanel onComplete={() => setShowStartCapitalPanel(false)} />
      )}


      <div className="mainContent">
        <ImageSlider />

        <div className="capital">
          <CapitalChart data={parsedTrades} startCapital={startCapital} />
        </div>

        <div className="stats">
          <div className="winrate">
            <WinrateChart trades={parsedTrades} />
          </div>
          <div className="rrr">
            <RrrChart trades={parsedTrades} />
          </div>
          <div className="pnl">
            <PnlChart trades={parsedTrades} />
          </div>
          <div className="direction">
            <DirectionChart trades={parsedTrades} />
          </div>
        </div>

        {activeProduct && (
          <div className="activeProductDisplay">
            <h2>Aktives Produkt: {activeProduct.title}</h2>
            {activeProduct.description && <p>{activeProduct.description}</p>}
          </div>
        )}

        <div className="redirection">
          <div className="premiumBanner">
            <a href="#" className="bannerLink" onClick={openPremiumPanel}>
              <img
                src={ChartPick}
                alt="Premium"
              />
              <div className="bannerContent">
                <span>
                  <h3 style={{ color: "var(--PrimaryColor)", fontWeight: "540" }}>
                    Premium freischalten
                  </h3>
                  <p>
                    Hol dir die volle Kontrolle über dein Trading: Keine Limits,
                    keine Werbung, dafür exklusive Tools, die deinen Fortschritt
                    sichtbar machen. Mach den nächsten Schritt – werde Premium.
                  </p>
                </span>
                <button>Jetzt upgraden</button>
              </div>
            </a>
          </div>

          <div className="shopBanner">
            <a href="/shop" className="bannerLink">
              <img
                src={ShopPick}
                alt="Shop Vorschau"
              />
              <div className="bannerContent">
                <h3 style={{ color: "var(--PrimaryColor)", fontWeight: "540" }}>
                  Entdecke den Trading-Shop
                </h3>
                <p>
                  Checklisten, Guides und exklusive Tools – einmal zahlen,
                  langfristig profitieren.
                </p>
                <button>Jetzt entdecken</button>
              </div>
            </a>
          </div>

          {showPremium && (
            <div className="premiumPanelOverlay">
              <div className="premiumPanel">
                <button className="closeBtn" onClick={closePremiumPanel}>
                  <IoClose className="IoClose" />
                </button>
                <img
                  src={ChartPick}
                  alt="Premium Vorteile"
                />
                <div className="premiumContent">
                  <h2 className="premiumTitle">Upgrade auf Premium</h2>
                  <ul className="benefitsList">
                    <li className="benefit negative">
                      <IoIosCloseCircle className="icon" />
                      Max. 25 Trades
                    </li>
                    <li className="benefit negative">
                      <IoIosCloseCircle className="icon" />
                      Begrenzte Analysemittel
                    </li>
                    <li className="benefit positive">
                      <IoCheckmarkCircle /> Keine Werbung
                    </li>
                    <li className="benefit positive">
                      <IoCheckmarkCircle /> Checklisten- & Guides-Funktion
                    </li>
                    <li className="benefit positive">
                      <IoCheckmarkCircle /> Bis zu 1000 Trades
                    </li>
                    <li className="benefit positive">
                      <IoCheckmarkCircle /> Volle Analysemittel
                    </li>
                  </ul>
                  <button className="premiumButton">Jetzt upgraden</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
