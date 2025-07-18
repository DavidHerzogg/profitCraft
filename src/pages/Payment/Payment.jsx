import "./Payment.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@clerk/clerk-react";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const { userId } = useAuth();

  const addPurchasedProduct = useMutation(api.userSettings.addPurchase);

  if (!product) {
    return (
      <div className="payment-fullscreen error">
        <p>❌ Kein Produkt übergeben.</p>
        <button className="Payment_button" onClick={() => navigate(-1)}>
          ← Zurück
        </button>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!userId) {
      // Statt Alert: vielleicht eine Fehlermeldung im UI anzeigen (hier simpel gelassen)
      console.error("Nicht eingeloggt");
      return;
    }

    try {
      await addPurchasedProduct({
        userId,
        productId: product._id,
      });

      // Kein Alert, direkt Redirect mit Query-Param, um Panel im Dashboard zu öffnen
      navigate("/?openPurchased=true");
    } catch (error) {
      console.error("Fehler beim Freischalten:", error);
      // Optional: Fehlermeldung im UI setzen, kein Alert
    }
  };

  return (
    <div className="payment-fullscreen">
      <button className="back-button Payment_button" onClick={() => navigate(-1)}>
        ← Zurück
      </button>

      <div className="payment-card">
        <h1>Zahlung</h1>

        <div className="details">
          <div>
            <strong>Produkt:</strong>
            <span>{product.title}</span>
          </div>
          <div>
            <strong>Preis:</strong>
            <span>
              {product.price.toFixed(2)} {product.currency}
              {product.taxIncluded && " (inkl. MwSt.)"}
            </span>
          </div>
          <div>
            <strong>Zahlung:</strong>
            <span>{product.paymentMethods.join(", ")}</span>
          </div>
        </div>

        <p className="product-description">{product.description}</p>

        <ul className="benefits">
          {product.benefits.map((benefit, idx) => (
            <li key={idx}>{benefit}</li>
          ))}
        </ul>

        <p className="legal">
          Mit Klick auf „Jetzt bezahlen“ akzeptierst du unsere{" "}
          <a href={product.legalLinks.agb} target="_blank" rel="noopener noreferrer">
            AGB
          </a>{" "}
          und die{" "}
          <a href={product.legalLinks.widerruf} target="_blank" rel="noopener noreferrer">
            Widerrufsbelehrung
          </a>
          .
        </p>

        <button className="Payment_button" onClick={handlePayment}>
          Jetzt bezahlen
        </button>
      </div>
    </div>
  );
}
