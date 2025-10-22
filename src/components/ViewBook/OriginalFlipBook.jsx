// OriginalFlipBookCSS.jsx
"use client";
import React from "react";
import TextFormat from "../format/TextFormat";

/**
 * Flipbook with scrollable content panes.
 * pages: array of strings (markdown/HTML for each page)
 */
export function OriginalFlipBookCSS({ pages, width = 640, height = 480, soundEnabled = false }) {
  // pair pages into sheets (front/back)
  const sheets = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < pages.length; i += 2) {
      arr.push({ front: pages[i] ?? "", back: pages[i + 1] ?? "" });
    }
    return arr;
  }, [pages]);

  const [curr, setCurr] = React.useState(0); // current turned sheets (0..sheets.length)

  const flipTo = React.useCallback((next) => {
    // optional sound here
    setCurr(Math.max(0, Math.min(next, sheets.length)));
  }, [sheets.length]);

  // Flip only when clicking the sheet background, not content
  const handleSheetClick = (sideIndex /* 0=front, 1=back */, sheetIdx, e) => {
    // If click originated inside the content scroller, ignore (stop bubbling below)
    if (e.target.closest(".page-scroll")) return;
    const next = sideIndex === 0 ? sheetIdx + 1 : sheetIdx; // front click -> go forward, back click -> go back
    flipTo(next);
  };

  return (
    <div className="stage">
      <div
        className="book"
        style={{
          width,
          height,
          // expose --c to CSS
          ["--c"]: curr,
        }}
      >
        {sheets.map((sheet, idx) => {
          const total = pages.length;
          const frontNum = idx * 2 + 1;
          const backNum = idx * 2 + 2;

          return (
            <div key={idx} className="page" style={{ ["--i"]: idx }}>
              {/* FRONT (right side when open) */}
              <div className="front" onClick={(e) => handleSheetClick(0, idx, e)}>
                <div className="page-inner" onClick={(e) => e.stopPropagation()}>
                  <header className="page-header">PAGE {frontNum}</header>
                  <div className="page-scroll">
                    <TextFormat data={sheet.front} />
                  </div>
                </div>
                {frontNum <= total && <div className="pageNum pageNum-right">{frontNum}</div>}
              </div>

              {/* BACK (left side when turned) */}
              <div className="back" onClick={(e) => handleSheetClick(1, idx, e)}>
                <div className="page-inner" onClick={(e) => e.stopPropagation()}>
                  <header className="page-header">PAGE {backNum}</header>
                  <div className="page-scroll">
                    <TextFormat data={sheet.back} />
                  </div>
                </div>
                {backNum <= total && <div className="pageNum pageNum-left">{backNum}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .stage {
          margin-top: 18px;
          display: flex;
          justify-content: center;
          perspective: 1200px;
        }

        .book {
          --paper-top: #efe2cf;
          --paper-bottom: #e6d3b5;
          --paper-back-top: #e7d5bb;
          --paper-back-bottom: #f0e4cd;
          --paper-edge: #d7c2a2;

          position: relative;
          display: flex;
          margin: 24px auto 0;
          pointer-events: none; /* child pages re-enable */
          transform-style: preserve-3d;
          transition: translate 1s;
          translate: calc(min(var(--c), 1) * 50%) 0%;
          rotate: 1 0 0 30deg;
        }

        .page {
          --thickness: 6;

          flex: none;
          display: flex;
          width: 100%;
          height: 100%;
          pointer-events: all;
          user-select: none;
          transform-style: preserve-3d;
          transform-origin: left center;
          border: 1px solid rgba(80, 60, 30, 0.25);
          background: transparent;
          border-radius: 10px;

          /* 3D layering + page turn */
          translate: calc(var(--i) * -100%) 0 0;
          transform: translateZ(
              calc((var(--c) - var(--i) - 0.5) * calc(var(--thickness) * 1px))
            );
          rotate: 0 1 0 calc(clamp(0, var(--c) - var(--i), 1) * -180deg);
          transition:
            transform 1s,
            rotate 1s ease-in
              calc((min(var(--i), var(--c)) - max(var(--i), var(--c))) * 50ms);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
        }

        .front,
        .back {
          position: relative;
          flex: none;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 10px;

          /* paper texture */
          background: linear-gradient(
            180deg,
            var(--paper-top) 0%,
            var(--paper-bottom) 100%
          );
          box-shadow:
            inset 0 0 0 1px rgba(115, 84, 40, 0.1),
            inset 0 -8px 28px rgba(115, 84, 40, 0.1),
            inset 8px 0 22px rgba(0, 0, 0, 0.05);
        }

        .front::before,
        .back::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 10px;
          background:
            radial-gradient(at 10% 8%, rgba(0, 0, 0, 0.06), transparent 55%),
            radial-gradient(at 90% 92%, rgba(0, 0, 0, 0.05), transparent 55%),
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
          border-radius: 10px;
          pointer-events: none;
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.08),
            transparent 35%
          );
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
          border-radius: 10px;
          pointer-events: none;
          background: linear-gradient(
            to left,
            rgba(0, 0, 0, 0.1),
            transparent 40%
          );
          opacity: 0.35;
        }

        /* Inner layout to keep content inside the sheet */
        .page-inner {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 14px 16px 22px 16px; /* room for header + number */
        }

        .page-header {
          font-size: 13px;
          font-weight: 700;
          color: #1f2937;
          opacity: 0.9;
          margin: 2px 2px 8px 2px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .page-scroll {
          /* THIS keeps content inside the page */
          flex: 1;
          min-height: 0;          /* allow flex child to actually shrink */
          overflow: auto;         /* scroll if content grows */
          border-radius: 6px;
        }

        .pageNum {
          position: absolute;
          bottom: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #5a4934;
          opacity: 0.9;
          pointer-events: none;
          letter-spacing: 0.02em;
        }
        .pageNum-left { left: 12px; text-align: left; }
        .pageNum-right { right: 12px; text-align: right; }
      `}</style>
    </div>
  );
}
