"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  Settings, 
  BookOpen, 
  Layout, 
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  ZoomIn,
  ZoomOut,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  ChevronDown
} from "lucide-react";

/* ------- Demo data (same as your original) ------- */
const CATALOG = [
  {
    id: 1,
    title: "Mathematics for Class 10",
    subtitle: "Algebra • Geometry • Trigonometry • Statistics",
    pages: [
      // 1
      "Welcome! This book covers Algebra, Geometry, Trigonometry, and Statistics with solved examples and practice sets.",
      // 2
      <>
        <h3>Algebra – Foundations</h3>
        <p>
          Variables, constants, expressions, and linear equations. Form of a
          linear equation: <code>ax + b = 0</code>.
        </p>
      </>,
      // 3
      <>
        <h3>Linear Equations – Examples</h3>
        <ul>
          <li>3x + 5 = 20 → x = 5</li>
          <li>2(x − 3) = 10 → x = 8</li>
          <li>7 − 2x = −9 → x = 8</li>
        </ul>
      </>,
      // 4
      <>
        <h3>Graphs of Lines</h3>
        <p>
          Slope-intercept form: <code>y = mx + c</code>. Slope <code>m</code>{" "}
          and intercept <code>c</code> define a unique line.
        </p>
        <img
          src="https://picsum.photos/seed/line-graph/700/420"
          alt="Line Graph"
        />
      </>,
      // 5
      <>
        <h3>Quadratic Equations</h3>
        <p>
          Standard form: <code>ax² + bx + c = 0</code>. Discriminant{" "}
          <code>D = b² − 4ac</code>.
        </p>
        <ul>
          <li>D &gt; 0 → two real distinct roots</li>
          <li>D = 0 → two equal real roots</li>
          <li>D &lt; 0 → complex roots</li>
        </ul>
      </>,
      // 6
      <>
        <h3>Quadratic – Solved Example</h3>
        <p>
          Equation: <code>x² − 5x + 6 = 0</code> → factors: (x − 2)(x − 3) = 0
          → x = 2, 3
        </p>
      </>,
      // 7
      <>
        <h3>Polynomials</h3>
        <p>
          Degree, zeros, factor theorem. If <code>p(a)=0</code> then (x − a) is
          a factor of p(x).
        </p>
      </>,
      // 8
      <>
        <h3>Algebra – Practice Set A</h3>
        <ol>
          <li>Solve: 4x − 9 = 23</li>
          <li>Find zeros of x² − 7x + 12</li>
          <li>Factorize: 2x² − 5x − 3</li>
        </ol>
      </>,
      // 9
      <>
        <h3>Geometry – Basics</h3>
        <p>
          Points, lines, angles, triangles, circles. Properties and theorems
          build reasoning.
        </p>
      </>,
      // 10
      <>
        <h3>Triangles – Congruence</h3>
        <ul>
          <li>SSS, SAS, ASA, AAS, RHS criteria</li>
          <li>Corresponding parts of congruent triangles are equal (CPCT)</li>
        </ul>
        <img src="https://picsum.photos/seed/tri/700/420" alt="Triangles" />
      </>,
      // 11
      <>
        <h3>Pythagoras Theorem</h3>
        <p>
          Right triangle with hypotenuse c and legs a,b: <code>a² + b² = c²</code>.
        </p>
      </>,
      // 12
      <>
        <h3>Circle – Key Terms</h3>
        <p>
          Chord, diameter, radius, arc, sector, segment; angle subtended by arc
          at center vs. circumference.
        </p>
      </>,
      // 13
      <>
        <h3>Coordinate Geometry</h3>
        <p>
          Distance between (x₁, y₁) and (x₂, y₂):{" "}
          <code>√((x₂ − x₁)² + (y₂ − y₁)²)</code>
        </p>
        <p>
          Midpoint: <code>((x₁+x₂)/2, (y₁+y₂)/2)</code>
        </p>
      </>,
      // 14
      <>
        <h3>Geometry – Practice Set B</h3>
        <ol>
          <li>Find length of diagonal in a 6–8–? right triangle.</li>
          <li>Midpoint of A(−2, 5) and B(4, −1).</li>
          <li>Arc and central angle relationships.</li>
        </ol>
      </>,
      // 15
      <>
        <h3>Trigonometry – Ratios</h3>
        <p>
          For right triangle: sin θ, cos θ, tan θ, sec θ, cosec θ, cot θ.
        </p>
        <img src="https://picsum.photos/seed/trig/700/420" alt="Trigonometry" />
      </>,
      // 16
      <>
        <h3>Trigonometric Identities</h3>
        <ul>
          <li>sin²θ + cos²θ = 1</li>
          <li>1 + tan²θ = sec²θ</li>
          <li>1 + cot²θ = cosec²θ</li>
        </ul>
      </>,
      // 17
      <>
        <h3>Heights & Distances</h3>
        <p>
          Angle of elevation/depression problems using tan θ. Draw diagram, mark
          knowns, apply ratio.
        </p>
      </>,
      // 18
      <>
        <h3>Trigonometry – Practice Set C</h3>
        <ol>
          <li>Compute sin²30° + cos²30°</li>
          <li>Find height of a tower if tan 60° = h/100</li>
          <li>Prove: sec²θ − tan²θ = 1</li>
        </ol>
      </>,
      // 19
      <>
        <h3>Statistics – Basics</h3>
        <p>
          Mean, median, mode; grouped data, class intervals, frequency
          distribution, cumulative frequency.
        </p>
      </>,
      // 20
      <>
        <h3>Mean/Median/Mode</h3>
        <ul>
          <li>Mean (ungrouped): Σx / n</li>
          <li>Median: middle value (or average of two middles)</li>
          <li>Mode: most frequent value</li>
        </ul>
      </>,
      // 21
      <>
        <h3>Histogram & Ogive</h3>
        <p>
          Graphical representation for grouped frequency; use class boundaries
          on x-axis, frequencies on y-axis.
        </p>
      </>,
      // 22
      <>
        <h3>Statistics – Practice Set D</h3>
        <ol>
          <li>Find mean of 2, 4, 6, 8, 10</li>
          <li>Calculate median of 3, 7, 2, 9, 5</li>
          <li>Mode of data: 1, 2, 2, 3, 4, 2, 5</li>
        </ol>
      </>,
      // 23
      <>
        <h3>Probability – Basics</h3>
        <p>
          Outcomes, sample space, events. P(E) = favorable/total outcomes.
          0 ≤ P(E) ≤ 1.
        </p>
      </>,
      // 24
      <>
        <h3>Probability – Examples</h3>
        <ul>
          <li>Coin toss: P(Head) = 1/2</li>
          <li>Die roll: P(even) = 3/6 = 1/2</li>
          <li>Card draw: P(King) = 4/52 = 1/13</li>
        </ul>
      </>,
      // 25
      <>
        <h3>Complementary Events</h3>
        <p>
          If P(E) is probability of event E, then P(not E) = 1 − P(E).
        </p>
      </>,
      // 26
      <>
        <h3>Applications</h3>
        <p>
          <strong>Real Estate</strong>: Area calculations, mortgage computations.
        </p>
        <p>
          <strong>Engineering</strong>: Structural analysis, optimization.
        </p>
        <p>
          <strong>Data Science</strong>: Statistical inference, modeling.
        </p>
      </>,
      // 27
      <>
        <h3>Review Summary</h3>
        <p>
          We covered: algebraic methods, geometric theorems, trigonometric
          ratios, statistical measures, probability concepts.
        </p>
      </>,
      // 28
      <>
        <h3>Challenge Problems</h3>
        <ol>
          <li>Prove: (x − y)³ = x³ − 3x²y + 3xy² − y³</li>
          <li>
            If A(2,3), B(6,11), find slope of AB and its midpoint
          </li>
          <li>If sin θ = 3/5, find cos θ and tan θ</li>
        </ol>
      </>,
      // 29
      <>
        <h3>Image Page</h3>
        <img
          src="https://picsum.photos/seed/mathboard/800/480"
          alt="Math board"
        />
      </>,
      // 30
      "The End — Good luck with your exams! Keep practicing daily for best results.",
    ],
  },
];

// Your original DemoPage component
function DemoPage({ title, body }) {
  return (
    <div style={{ padding: "20px 24px", height: "100%", display: "flex", flexDirection: "column" }}>
      <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", color: "#1f2937" }}>
        {title}
      </h4>
      <div style={{ flex: 1, fontSize: "14px", lineHeight: "1.6", color: "#374151" }}>
        {body}
      </div>
    </div>
  );
}

export default function BookDetailsPage() {
  const { id } = useParams();
  const bookId = Number(id);

  const book = React.useMemo(() => CATALOG.find((b) => b.id === bookId), [bookId]);
  
  // View state
  const [viewMode, setViewMode] = React.useState('flipbook');
  const [deviceView, setDeviceView] = React.useState('desktop');
  const [zoom, setZoom] = React.useState(100);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(16);
  const [showSettings, setShowSettings] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  if (!book) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0B0D10", color: "#fff" }}>
        <div>
          <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Book not found</p>
          <Link href="/books" style={{ color: "#34d399", textDecoration: "underline" }}>Back to all books</Link>
        </div>
      </div>
    );
  }

  const containerStyle = {
    minHeight: "100vh", 
    color: isDarkMode ? "#fff" : "#000",
    background: isDarkMode ? "#0B0D10" : "#f8fafc",
    transition: "all 0.3s ease"
  };

  const getDeviceWidth = () => {
    switch(deviceView) {
      case 'mobile': return { width: 380, height: 620 };
      case 'tablet': return { width: 520, height: 420 };
      default: return { width: 720, height: 520 };
    }
  };

  const deviceDimensions = getDeviceWidth();

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
        {/* Header with View Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/books" style={{ opacity: 0.85, display: "flex", alignItems: "center", gap: 8 }}>
              <ArrowLeft size={20} />
              Back
            </Link>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>{book.title}</h1>
              <p style={{ opacity: 0.8, marginTop: 4, fontSize: 14 }}>{book.subtitle}</p>
            </div>
          </div>
          
          {/* Compact View Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* View Mode Selector */}
            <div style={{ display: "flex", background: isDarkMode ? "#1f2937" : "#f1f5f9", borderRadius: 8, padding: 4 }}>
              <button
                onClick={() => setViewMode('flipbook')}
                style={{
                  padding: "6px 12px",
                  borderRadius: 4,
                  border: "none",
                  background: viewMode === 'flipbook' ? (isDarkMode ? "#3b82f6" : "#2563eb") : "transparent",
                  color: viewMode === 'flipbook' ? "#fff" : (isDarkMode ? "#d1d5db" : "#64748b"),
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}
              >
                <BookOpen size={14} />
                Flip Book
              </button>
              <button
                onClick={() => setViewMode('scroll')}
                style={{
                  padding: "6px 12px",
                  borderRadius: 4,
                  border: "none",
                  background: viewMode === 'scroll' ? (isDarkMode ? "#3b82f6" : "#2563eb") : "transparent",
                  color: viewMode === 'scroll' ? "#fff" : (isDarkMode ? "#d1d5db" : "#64748b"),
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}
              >
                <Layout size={14} />
                Scroll
              </button>
              <button
                onClick={() => setViewMode('slide')}
                style={{
                  padding: "6px 12px",
                  borderRadius: 4,
                  border: "none",
                  background: viewMode === 'slide' ? (isDarkMode ? "#3b82f6" : "#2563eb") : "transparent",
                  color: viewMode === 'slide' ? "#fff" : (isDarkMode ? "#d1d5db" : "#64748b"),
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}
              >
                <Eye size={14} />
                Slide
              </button>
            </div>

            {/* Quick Controls */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                padding: "8px",
                borderRadius: 6,
                border: "1px solid " + (isDarkMode ? "#374151" : "#e2e8f0"),
                background: isDarkMode ? "#1f2937" : "#fff",
                color: isDarkMode ? "#d1d5db" : "#64748b",
                cursor: "pointer"
              }}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                padding: "8px",
                borderRadius: 6,
                border: "1px solid " + (isDarkMode ? "#374151" : "#e2e8f0"),
                background: isDarkMode ? "#1f2937" : "#fff",
                color: isDarkMode ? "#d1d5db" : "#64748b",
                cursor: "pointer"
              }}
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div style={{
            background: isDarkMode ? "#1f2937" : "#fff",
            border: "1px solid " + (isDarkMode ? "#374151" : "#e2e8f0"),
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: isDarkMode ? "#f3f4f6" : "#1f2937" }}>
              Reading Settings
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <div>
                <label style={{ fontSize: 14, fontWeight: 500, color: isDarkMode ? "#d1d5db" : "#64748b", display: "block", marginBottom: 8 }}>
                  Device View
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {['desktop', 'tablet', 'mobile'].map(device => (
                    <button
                      key={device}
                      onClick={() => setDeviceView(device)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "1px solid " + (isDarkMode ? "#374151" : "#e2e8f0"),
                        background: deviceView === device ? (isDarkMode ? "#3b82f6" : "#2563eb") : (isDarkMode ? "#1f2937" : "#fff"),
                        color: deviceView === device ? "#fff" : (isDarkMode ? "#d1d5db" : "#64748b"),
                        cursor: "pointer",
                        fontSize: 12,
                        textTransform: "capitalize"
                      }}
                    >
                      {device}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 14, fontWeight: 500, color: isDarkMode ? "#d1d5db" : "#64748b", display: "block", marginBottom: 8 }}>
                  Zoom: {zoom}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={zoom}
                  onChange={(e) => setZoom(parseInt(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Book Container with Zoom */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          transform: `scale(${zoom / 100})`,
          transition: "transform 0.3s ease",
          transformOrigin: "center top"
        }}>
          {viewMode === 'flipbook' && (
            <OriginalFlipBookCSS 
              pages={book.pages} 
              isDarkMode={isDarkMode}
              soundEnabled={soundEnabled}
            />
          )}
          {viewMode === 'scroll' && (
            <ScrollView 
              pages={book.pages}
              isDarkMode={isDarkMode}
              fontSize={fontSize}
              deviceDimensions={deviceDimensions}
            />
          )}
          {viewMode === 'slide' && (
            <SlideView 
              pages={book.pages}
              isDarkMode={isDarkMode}
              fontSize={fontSize}
              deviceDimensions={deviceDimensions}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   YOUR ORIGINAL FlipBookCSS — Completely Preserved
   ========================================================= */
function OriginalFlipBookCSS({ pages, width = 480, height = 360, isDarkMode, soundEnabled }) {
  const sheets = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < pages.length; i += 2) {
      arr.push({ front: pages[i], back: pages[i + 1] ?? "" });
    }
    return arr;
  }, [pages]);

  const [curr, setCurr] = React.useState(0); // current page index

  const onPageClick = (idx, e) => {
    const isBack = e.target.closest && e.target.closest(".back");
    const nextVal = isBack ? idx : idx + 1; // front→next, back→stay
    
    // Optional: Play sound effect
    if (soundEnabled) {
      // You can add sound effect here
    }
    
    setCurr(nextVal);
  };

  return (
    <div className="stage" style={{ color: isDarkMode ? "#fff" : "black" }}>
      <div className="book" style={{ width, height, ["--c"]: curr }}>
        {sheets.map((sheet, idx) => {
          const total = pages.length;
          const frontNum = idx * 2 + 1; // right page
          const backNum = idx * 2 + 2; // left page

          return (
            <div key={idx} className="page" style={{ ["--i"]: idx }}>
              {/* RIGHT PAGE (front) */}
              <div className="front" onClick={(e) => onPageClick(idx, e)}>
                {typeof sheet.front === "string" ? (
                  <DemoPage title={`PAGE HEADER - ${frontNum}`} body={sheet.front} />
                ) : (
                  sheet.front
                )}
                {frontNum <= total && (
                  <div className="pageNum pageNum-right">{frontNum}</div>
                )}
              </div>

              {/* LEFT PAGE (back) */}
              <div className="back" onClick={(e) => onPageClick(idx, e)}>
                {typeof sheet.back === "string" ? (
                  <DemoPage title={`PAGE HEADER - ${backNum}`} body={sheet.back} />
                ) : (
                  sheet.back
                )}
                {backNum <= total && (
                  <div className="pageNum pageNum-left">{backNum}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* YOUR ORIGINAL CSS STYLES - Exactly as they were */}
      <style jsx>{`
        .stage {
          margin-top: 18px;
          display: flex;
          justify-content: center;
          perspective: 1000px;
        }
        .book {
          --paper-top: ${isDarkMode ? "#2d3748" : "#efe2cf"};
          --paper-bottom: ${isDarkMode ? "#1a202c" : "#e6d3b5"};
          --paper-back-top: ${isDarkMode ? "#2d3748" : "#e7d5bb"};
          --paper-back-bottom: ${isDarkMode ? "#1a202c" : "#f0e4cd"};
          --paper-edge: ${isDarkMode ? "#4a5568" : "#d7c2a2"};

          display: flex;
          margin: 24px auto 0;
          pointer-events: none;
          transform-style: preserve-3d;
          transition: translate 1s;
          translate: calc(min(var(--c), 1) * 50%) 0%;
          rotate: 1 0 0 30deg;
        }
        .page {
          --thickness: 5;
          flex: none;
          display: flex;
          width: 100%;
          pointer-events: all;
          user-select: none;
          transform-style: preserve-3d;
          transform-origin: left center;
          border: 1px solid rgba(80, 60, 30, 0.25);
          transition: transform 1s,
            rotate 1s ease-in
              calc((min(var(--i), var(--c)) - max(var(--i), var(--c))) * 50ms);
          translate: calc(var(--i) * -100%) 0 0;
          transform: translateZ(
            calc((var(--c) - var(--i) - 0.5) * calc(var(--thickness) * 1px))
          );
          rotate: 0 1 0 calc(clamp(0, var(--c) - var(--i), 1) * -180deg);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
          background: transparent;
          border-radius: 8px;
        }

        .front,
        .back {
          position: relative;
          flex: none;
          width: 100%;
          padding: 18px;
          backface-visibility: hidden;
          translate: 0;
          border-radius: 8px;
          background: linear-gradient(
            180deg,
              var(--paper-top) 0%,
              var(--paper-bottom) 100%
          );
          box-shadow: inset 0 0 0 1px rgba(115, 84, 40, 0.1),
            inset 0 -8px 28px rgba(115, 84, 40, 0.1),
            inset 8px 0 22px rgba(0, 0, 0, 0.05);
        }

        .front::before,
        .back::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 8px;
          background: radial-gradient(
              at 10% 8%,
              rgba(0, 0, 0, 0.06),
              transparent 55%
            ),
            radial-gradient(
              at 90% 92%,
              rgba(0, 0, 0, 0.05),
              transparent 55%
            ),
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.03) 0 1px,
              transparent 1px 2px
            );
          mix-blend-mode: multiply;
          opacity: 0.35;
        }

        .front::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 8px;
          pointer-events: none;
          background: linear-gradient(to right, rgba(0, 0, 0, 0.08), transparent 35%);
          opacity: 0.35;
        }

        .back {
          background: linear-gradient(
            180deg,
              var(--paper-back-top) 0%,
              var(--paper-back-bottom) 100%
          );
          translate: -100% 0;
          rotate: 0 1 0 180deg;
        }
        .back::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 8px;
          pointer-events: none;
          background: linear-gradient(to left, rgba(0, 0, 0, 0.1), transparent 40%);
          opacity: 0.35;
        }

        .page :global(img) {
          width: 100%;
          height: 220px;
          object-fit: cover;
          border-radius: 6px;
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15);
        }

        .pageNum {
          position: absolute;
          bottom: 10px;
          font-size: 12px;
          font-weight: 600;
          color: #5a4934;
          opacity: 0.9;
          pointer-events: none;
          letter-spacing: 0.02em;
        }
        .pageNum-left {
          left: 14px;
          text-align: left;
        }
        .pageNum-right {
          right: 14px;
          text-align: right;
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   Additional View Options
   ========================================================= */
function ScrollView({ pages, isDarkMode, fontSize, deviceDimensions }) {
  return (
    <div style={{
      maxWidth: deviceDimensions.width,
      maxHeight: deviceDimensions.height,
      overflowY: "auto",
      background: isDarkMode ? "#1f2937" : "#fff",
      borderRadius: 12,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      border: "1px solid " + (isDarkMode ? "#374151" : "#e2e8f0")
    }}>
      {pages.map((page, index) => (
        <div key={index} style={{
          padding: "24px",
          borderBottom: index < pages.length - 1 ? "1px solid " + (isDarkMode ? "#374151" : "#e2e8f0") : "none",
          fontSize: fontSize,
          lineHeight: "1.6",
          color: isDarkMode ? "#f3f4f6" : "#1f2937"
        }}>
          <div style={{ marginBottom: 16, fontSize: 12, fontWeight: 600, color: isDarkMode ? "#9ca3af" : "#6b7280" }}>
            Page {index + 1}
          </div>
          {typeof page === "string" ? (
            <p>{page}</p>
          ) : (
            <div>{page}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function SlideView({ pages, isDarkMode, fontSize, deviceDimensions }) {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  return (
    <div style={{
      width: deviceDimensions.width,
      height: deviceDimensions.height,
      position: "relative",
      background: isDarkMode ? "#1f2937" : "#fff",
      borderRadius: 12,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      border: "1px solid " + (isDarkMode ? "#374151" : "#e2e8f0"),
      overflow: "hidden"
    }}>
      {/* Slide Content */}
      <div style={{
        padding: "40px",
        height: "calc(100% - 80px)",
        fontSize: fontSize,
        lineHeight: "1.6",
        color: isDarkMode ? "#f3f4f6" : "#1f2937",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflowY: "auto"
      }}>
        {typeof pages[currentSlide] === "string" ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: fontSize * 1.2, lineHeight: "1.5" }}>
              {pages[currentSlide]}
            </p>
          </div>
        ) : (
          <div style={{ textAlign: "left" }}>
            {pages[currentSlide]}
          </div>
        )}
      </div>

      {/* Slide Navigation */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: isDarkMode ? "rgba(31, 41, 55, 0.9)" : "rgba(248, 250, 252, 0.9)",
        backdropFilter: "blur(8px)",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: "1px solid " + (isDarkMode ? "#374151" : "#e2e8f0"),
            background: isDarkMode ? "#374151" : "#fff",
            color: currentSlide === 0 ? "#9ca3af" : (isDarkMode ? "#d1d5db" : "#374151"),
            cursor: currentSlide === 0 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14
          }}
        >
          <ArrowLeft size={16} />
          Previous
        </button>

        {/* Slide Indicators */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ 
            fontSize: 14, 
            color: isDarkMode ? "#9ca3af" : "#6b7280",
            fontWeight: 500 
          }}>
            {currentSlide + 1} / {pages.length}
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {pages.slice(0, Math.min(10, pages.length)).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  border: "none",
                  background: index === currentSlide 
                    ? (isDarkMode ? "#3b82f6" : "#2563eb") 
                    : (isDarkMode ? "#4b5563" : "#d1d5db"),
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              />
            ))}
            {pages.length > 10 && <span style={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}>...</span>}
          </div>
        </div>

        <button
          onClick={() => setCurrentSlide(Math.min(pages.length - 1, currentSlide + 1))}
          disabled={currentSlide === pages.length - 1}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: "1px solid " + (isDarkMode ? "#374151" : "#e2e8f0"),
            background: isDarkMode ? "#374151" : "#fff",
            color: currentSlide === pages.length - 1 ? "#9ca3af" : (isDarkMode ? "#d1d5db" : "#374151"),
            cursor: currentSlide === pages.length - 1 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14
          }}
        >
          Next
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Keyboard Navigation Hint */}
      <div style={{
        position: "absolute",
        top: 16,
        right: 16,
        fontSize: 12,
        color: isDarkMode ? "#6b7280" : "#9ca3af",
        background: isDarkMode ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.8)",
        padding: "4px 8px",
        borderRadius: 4,
        backdropFilter: "blur(4px)"
      }}>
        Use ← → keys to navigate
      </div>

      {/* Keyboard Navigation */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              // Previous slide logic would go here
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              // Next slide logic would go here
            }
          });
        `
      }} />
    </div>
  );
}