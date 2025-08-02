import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import ShopBanner from "../assets/ShopBanner.jpg";
import PremiumBanner from "../assets/PremiumBanner.jpg";

const images = [ShopBanner, PremiumBanner];

export default function ImageSlider() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const timeoutRef = useRef(null);

  const clearExistingTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const changeSlide = (newIndex) => {
    setFade(false);
    setTimeout(() => {
      setIndex(newIndex);
      setFade(true);
    }, 300);
  };

  const prev = () => {
    clearExistingTimeout();
    const newIndex = index === 0 ? images.length - 1 : index - 1;
    changeSlide(newIndex);
  };

  const next = () => {
    clearExistingTimeout();
    const newIndex = index === images.length - 1 ? 0 : index + 1;
    changeSlide(newIndex);
  };

  useEffect(() => {
    clearExistingTimeout();
    timeoutRef.current = setTimeout(() => {
      const newIndex = index === images.length - 1 ? 0 : index + 1;
      changeSlide(newIndex);
    }, 10000);

    return () => clearExistingTimeout();
  }, [index]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        maxHeight: "400px", // kannst du bei Bedarf anpassen
        margin: "0 auto",
        overflow: "hidden",
        border: "1px solid var(--PrimaryColor)",
        borderRadius: "8px",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={images[index]}
        alt={`Slide ${index + 1}`}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "100%",
          objectFit: "contain",
          opacity: fade ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />

      <button
        onClick={prev}
        style={{
          position: "absolute",
          top: "50%",
          height: "40px",
          left: "10px",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "var(--PrimaryColor)",
          border: "none",
          padding: "10px",
          cursor: "pointer",
          borderRadius: "50%",
          fontSize: "18px",
          zIndex: 10,
          WebkitTapHighlightColor: "transparent",
        }}
        aria-label="Vorheriges Bild"
      >
        <FaArrowLeft />
      </button>

      <button
        onClick={next}
        style={{
          position: "absolute",
          top: "50%",
          height: "40px",
          right: "10px",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "var(--PrimaryColor)",
          border: "none",
          padding: "10px",
          cursor: "pointer",
          borderRadius: "50%",
          fontSize: "18px",
          zIndex: 10,
          WebkitTapHighlightColor: "transparent",
        }}
        aria-label="Nächstes Bild"
      >
        <FaArrowRight />
      </button>
    </div>
  );
}
