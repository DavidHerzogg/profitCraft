import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { useQuery } from "convex/react";
import "./Shop.scss";

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("empfohlen");
  const navigate = useNavigate();

  const allProducts = useQuery("products:getAllProducts") || [];

  const filteredProducts =
    selectedCategory === "empfohlen"
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory);

  const handleClick = (product) => {
    if (product.externalLink) {
      window.open(product.externalLink, "_blank", "noopener,noreferrer");
    } else {
      navigate("/payment", { state: { product } });
    }
  };

  const categories = [
    { key: "empfohlen", label: "Empfohlen" },
    { key: "checklisten", label: "Checklisten" },
    { key: "guides", label: "Guides" },
    { key: "affiliate", label: "Affiliate-Partner" },
  ];

  return (
    <div className="pageContent">
      <header>
        <h1 style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <FaCartShopping /> Shop
        </h1>
      </header>

      {/* Kategorie-Filter */}
      <div className="filterBar">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`filterBtn ${selectedCategory === cat.key ? "active" : ""
              }`}
            onClick={() => setSelectedCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <main className="mainContent">
        {filteredProducts.map((item, i) => (
          <section key={i} className="shopItem">
            <div className="imageWrapper">
              <img src={item.img || "/placeholder.png"} alt={item.title} />
            </div>
            <h2>{item.title}</h2>
            <p className="description">{item.description}</p>
            {item.price !== null && item.price !== undefined && (
              <p className="price">
                Preis: {item.price.toFixed(2)} {item.currency}
              </p>
            )}

            {item.externalLink ? (
              <a
                href={item.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                {item.actionText}
              </a>
            ) : (
              <button onClick={() => handleClick(item)} className="btn">
                {item.actionText}
              </button>
            )}
          </section>
        ))}
      </main>
    </div>
  );
}
