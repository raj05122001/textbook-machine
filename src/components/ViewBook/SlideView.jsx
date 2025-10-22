// SlideView.jsx
import React from "react";
import {
  ArrowLeft,
  ArrowRight
} from "lucide-react";



export function SlideView({ pages, fontSize, deviceDimensions }) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  return (
    <div style={{
      width: deviceDimensions.width,
      height: deviceDimensions.height,
      position: "relative",
      background:  "#fff",
      borderRadius: 12,
      boxShadow: "0 10px 25px rgba(0,0,0,.15)",
      border: "1px solid " + "#e2e8f0",
      overflow: "hidden",
    }}>
      <div style={{
        padding: 40, height: "calc(100% - 80px)", fontSize, lineHeight: 1.6,
        color:  "#1f2937", display: "flex", flexDirection: "column",
        justifyContent: "center", overflowY: "auto", whiteSpace: "pre-wrap",
      }}>
        {pages[currentSlide]}
      </div>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "rgba(248,250,252,.9)",
        backdropFilter: "blur(8px)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <button
          onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
          disabled={currentSlide === 0}
          style={{
            padding: "8px 16px", borderRadius: 6, border: "1px solid " + "#e2e8f0",
            background: "#fff",
            color: currentSlide === 0 ? "#9ca3af" : "#374151",
            cursor: currentSlide === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14,
          }}
        >
          <ArrowLeft size={16} /> Previous
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>
            {currentSlide + 1} / {pages.length}
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {pages.slice(0, Math.min(10, pages.length)).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  width: 8, height: 8, borderRadius: "50%", border: "none",
                  background: i === currentSlide ? "#2563eb" : "#d1d5db",
                  cursor: "pointer", transition: "all .2s ease",
                }}
              />
            ))}
            {pages.length > 10 && <span style={{ color: "#6b7280" }}>…</span>}
          </div>
        </div>

        <button
          onClick={() => setCurrentSlide((s) => Math.min(pages.length - 1, s + 1))}
          disabled={currentSlide === pages.length - 1}
          style={{
            padding: "8px 16px", borderRadius: 6, border: "1px solid " + "#e2e8f0",
            background: "#fff",
            color: currentSlide === pages.length - 1 ? "#9ca3af" : "#374151",
            cursor: currentSlide === pages.length - 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14,
          }}
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}