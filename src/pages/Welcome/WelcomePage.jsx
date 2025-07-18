import Logo from "../../assets/ProfitCraftMiniBackgroundRemoved.png";
import heroImage from "../../assets/Analysis-pana.svg";
import { useClerk } from "@clerk/clerk-react";
import "./WelcomePage.scss";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
    const { openSignIn } = useClerk();

    const navigate = useNavigate();
    const { isSignedIn } = useUser();
    
    useEffect(() => {
        if (isSignedIn) {
            navigate("/");
        }
    }, [isSignedIn, navigate]);

    const handleStart = () => {
        openSignIn();
    };

    return (
        <div className="welcome-column">
            <div className="left-column">
                <div className="head">
                    <img src={Logo} alt="ProfitCraft Logo" className="logo" />
                    <h1 className="headline">Trade it. Chart it. Own it.</h1>
                </div>
                <p className="subline">Dein Trading-Analyse-Tool Nr. 1</p>

                <p className="intro">
                    Analysiere deine Trades, erkenne Muster und optimiere deine Strategie. ProfitCraft macht Smart Money sichtbar – visuell, datenbasiert und kompromisslos ehrlich.
                </p>

                <ul className="features">
                    <li>📈 Kapital- & Fehleranalyse in Echtzeit</li>
                    <li>🧠 Optimiert für SMC- & ICT-Trader</li>
                    <li>⚡ Individuelle Checklisten & Strategien</li>
                    <li>🔗 Visualisierte Trade-Dokumentation</li>
                </ul>

                <button className="btn-primary" onClick={handleStart}>
                    Jetzt starten
                </button>
            </div>

            <div className="right-column">
                <img src={heroImage} alt="Hero Grafik" className="hero-img" />
            </div>
        </div>
    );
}
