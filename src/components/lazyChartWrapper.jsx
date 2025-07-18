// components/LazyChartWrapper.tsx
import React from "react";
import { useInView } from "react-intersection-observer";

export function LazyChartWrapper({ children, height = 300 }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1, // Sichtbarkeitsschwelle
  });

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {inView ? children : <div style={{ height, background: "transparent" }} />}
    </div>
  );
}
