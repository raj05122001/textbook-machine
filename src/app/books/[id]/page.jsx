"use client";

import React from "react";
import ReactDOM from "react-dom";
import Link from "next/link";
import { useParams } from "next/navigation";

import pageThemes from "./pageThemes.json";
import TextFormat, { markdownToHtml } from "@/components/format/TextFormat";

const API_BASE = "https://tbmplus-backend.ultimeet.io";


function ImageMagnifierOverlay({
  src,
  onClose,
  minScale = 0.5,
  maxScale = 8,
  initialScale = 1,
}) {
  const wrapRef = React.useRef(null);
  const imgRef = React.useRef(null);
  const [scale, setScale] = React.useState(initialScale);
  const [tx, setTx] = React.useState(0);
  const [ty, setTy] = React.useState(0);
  const [panning, setPanning] = React.useState(false);
  const panStart = React.useRef({ x: 0, y: 0, tx0: 0, ty0: 0 });

  const pinchRef = React.useRef({
    active: false,
    startDist: 0,
    startScale: initialScale,
    centerX: 0,
    centerY: 0,
  });

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  React.useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        zoomAtCenter(1.15);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        zoomAtCenter(1 / 1.15);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "0") {
        e.preventDefault();
        resetView();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function resetView() {
    setScale(1);
    setTx(0);
    setTy(0);
  }

  function zoomAtCenter(factor) {
    const box = wrapRef.current?.getBoundingClientRect();
    const cx = box ? box.left + box.width / 2 : window.innerWidth / 2;
    const cy = box ? box.top + box.height / 2 : window.innerHeight / 2;
    zoomAtPoint(factor, cx, cy);
  }

  function zoomAtPoint(factor, clientX, clientY) {
    const img = imgRef.current;
    const wrap = wrapRef.current;
    if (!img || !wrap) return;

    const rect = wrap.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;

    const newScale = clamp(scale * factor, minScale, maxScale);

    const dx = px - (px - tx) * (newScale / scale);
    const dy = py - (py - ty) * (newScale / scale);
    setScale(newScale);
    setTx(dx);
    setTy(dy);
  }

  function onWheel(e) {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 1 / 1.1 : 1.1;
    zoomAtPoint(direction, e.clientX, e.clientY);
  }

  function onMouseDown(e) {
    if (e.button !== 0) return;
    setPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, tx0: tx, ty0: ty };
  }
  function onMouseMove(e) {
    if (!panning) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setTx(panStart.current.tx0 + dx);
    setTy(panStart.current.ty0 + dy);
  }
  function onMouseUp() {
    setPanning(false);
  }

  function onDoubleClick(e) {
    e.preventDefault();
    const targetScale = scale < 2 ? 2 : 1;
    const factor = targetScale / scale;
    zoomAtPoint(factor, e.clientX, e.clientY);
  }

  function getTouches(e) {
    return Array.from(e.touches || []);
  }
  function dist(a, b) {
    const dx = a.clientX - b.clientX,
      dy = a.clientY - b.clientY;
    return Math.hypot(dx, dy);
  }
  function center(a, b) {
    return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
  }

  function onTouchStart(e) {
    if (e.touches.length === 2) {
      const [t1, t2] = getTouches(e);
      pinchRef.current.active = true;
      pinchRef.current.startDist = dist(t1, t2);
      pinchRef.current.startScale = scale;
      const c = center(t1, t2);
      pinchRef.current.centerX = c.x;
      pinchRef.current.centerY = c.y;
    } else if (e.touches.length === 1) {
      setPanning(true);
      const t = e.touches[0];
      panStart.current = { x: t.clientX, y: t.clientY, tx0: tx, ty0: ty };
    }
  }
  function onTouchMove(e) {
    if (pinchRef.current.active && e.touches.length === 2) {
      e.preventDefault();
      const [t1, t2] = getTouches(e);
      const d = dist(t1, t2);
      const factor = d / (pinchRef.current.startDist || d);
      const target = clamp(
        pinchRef.current.startScale * factor,
        minScale,
        maxScale
      );
      const f = target / scale;
      zoomAtPoint(f, pinchRef.current.centerX, pinchRef.current.centerY);
    } else if (panning && e.touches.length === 1) {
      const t = e.touches[0];
      const dx = t.clientX - panStart.current.x;
      const dy = t.clientY - panStart.current.y;
      setTx(panStart.current.tx0 + dx);
      setTy(panStart.current.ty0 + dy);
    }
  }
  function onTouchEnd() {
    if (pinchRef.current.active) {
      pinchRef.current.active = false;
    }
    setPanning(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,.7)",
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        cursor: panning ? "grabbing" : "default",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          display: "flex",
          gap: 8,
          zIndex: 10000,
        }}
      >
        <button
          onClick={() => zoomAtCenter(1 / 1.15)}
          style={btnStyle}
          title="Zoom out (Ctrl/Cmd -)"
        >
          –
        </button>
        <button
          onClick={() => zoomAtCenter(1.15)}
          style={btnStyle}
          title="Zoom in (Ctrl/Cmd +)"
        >
          +
        </button>
        <button onClick={resetView} style={btnStyle} title="Reset (Ctrl/Cmd 0)">
          Reset
        </button>
        <button
          onClick={onClose}
          style={{ ...btnStyle, background: "#ef4444", color: "#fff" }}
          title="Close (Esc)"
        >
          Close
        </button>
      </div>

      <div
        ref={wrapRef}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onDoubleClick={onDoubleClick}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          position: "relative",
          width: "min(92vw, 1200px)",
          height: "min(88vh, 90vh)",
          background: "#0b0d10",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #334155",
          touchAction: "none",
          userSelect: "none",
          cursor: panning ? "grabbing" : "grab",
        }}
      >
        <img
          ref={imgRef}
          src={src}
          alt="Zoom"
          draggable={false}
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            transformOrigin: "0 0",
            willChange: "transform",
            maxWidth: "unset",
            maxHeight: "unset",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </div>
    </div>
  );
}

const btnStyle = {
  height: 36,
  padding: "0 12px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};


async function jfetch(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}


function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}
function hexToRgb(hex) {
  const h = (hex || "").replace("#", "").trim();
  const v = h.length === 3
    ? h.split("").map((c) => c + c).join("")
    : h.padEnd(6, "0").slice(0, 6);
  const n = parseInt(v, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHex({ r, g, b }) {
  const to = (n) => Math.max(0, Math.min(255, Math.round(n)))
    .toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}
function mix(c1, c2, t) {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  const m = { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t };
  return rgbToHex(m);
}
function lighten(hex, t = 0.1) {
  return mix(hex, "#ffffff", clamp01(t));
}
function darken(hex, t = 0.1) {
  return mix(hex, "#000000", clamp01(t));
}
function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b].map((v) => v / 255).map((c) => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}
function contrastRatio(h1, h2) {
  const L1 = relativeLuminance(h1);
  const L2 = relativeLuminance(h2);
  const hi = Math.max(L1, L2), lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}
function encodeSVG(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
function pickReadableTextOn(bg) {
  const cBlack = contrastRatio(bg, "#000000");
  const cWhite = contrastRatio(bg, "#ffffff");
  return cBlack > cWhite ? "#000000" : "#ffffff";
}

function buildA4Background({
  pageBG = "#ffffff",
  accent = "#2563eb",
  accent2 = "#60a5fa",
  style = "waves",
  watermark = "TBM+",
  wmOpacity = 0.12,
  wmSize = 56,
  wmGap = 220,
}) {
  const W = 2480, H = 3508;

  const p0 = pageBG;
  const p1 = lighten(pageBG, 0.06);
  const p2 = darken(pageBG, 0.10);
  const a1 = accent || "#2563eb";
  const a2 = accent2 || lighten(a1, 0.35);

  const textOnAccent = pickReadableTextOn(a1);
  const wmColor = textOnAccent === "#000000" ? darken(a1, 0.5) : lighten(a1, 0.7);

  const watermarkDef = `
    <defs>
      <pattern id="wm" width="${wmGap}" height="${wmGap}" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
        <text x="0" y="${wmSize}" font-family="Inter,system-ui,Arial" font-size="${wmSize}"
              fill="${wmColor}" opacity="${wmOpacity}" font-weight="700">
          ${escapeXml(watermark)}
        </text>
      </pattern>
      <linearGradient id="gA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${a2}" />
        <stop offset="1" stop-color="${a1}" />
      </linearGradient>
      <linearGradient id="gB" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${lighten(a1, 0.25)}" />
        <stop offset="1" stop-color="${darken(a2, 0.25)}" />
      </linearGradient>
      <radialGradient id="gMesh" cx="25%" cy="20%" r="80%">
        <stop offset="0" stop-color="${lighten(a2, 0.45)}" stop-opacity="0.65"/>
        <stop offset="1" stop-color="${p0}" stop-opacity="0.0"/>
      </radialGradient>
      <radialGradient id="gMesh2" cx="75%" cy="85%" r="80%">
        <stop offset="0" stop-color="${lighten(a1, 0.35)}" stop-opacity="0.55"/>
        <stop offset="1" stop-color="${p0}" stop-opacity="0.0"/>
      </radialGradient>
    </defs>
  `;

  const baseRect = `<rect x="0" y="0" width="${W}" height="${H}" fill="${p0}"/>`;

  let overlay = "";
  if (style === "diagonal") {
    overlay = `
      <path d="M0,0 L${W},0 L${W},${Math.round(H * 0.26)} Q ${Math.round(W * 0.55)},${Math.round(H * 0.36)} ${Math.round(W * 0.35)},${Math.round(H * 0.24)} T 0,${Math.round(H * 0.34)} Z" fill="url(#gA)" opacity="0.95"/>
      <path d="M0,${Math.round(H * 0.70)} Q ${Math.round(W * 0.25)},${Math.round(H * 0.60)} ${Math.round(W * 0.55)},${Math.round(H * 0.72)} T ${W},${Math.round(H * 0.60)} L${W},${H} L0,${H} Z" fill="url(#gB)" opacity="0.90"/>
    `;
  } else if (style === "mesh") {
    overlay = `
      <rect x="0" y="0" width="${W}" height="${H}" fill="url(#gMesh)"/>
      <rect x="0" y="0" width="${W}" height="${H}" fill="url(#gMesh2)"/>
      <circle cx="${Math.round(W * 0.15)}" cy="${Math.round(H * 0.18)}" r="${Math.round(H * 0.14)}" fill="${lighten(a2, 0.1)}" opacity="0.08"/>
      <circle cx="${Math.round(W * 0.82)}" cy="${Math.round(H * 0.86)}" r="${Math.round(H * 0.12)}" fill="${lighten(a1, 0.1)}" opacity="0.08"/>
    `;
  } else if (style === "soft-arcs") {
    overlay = `
      <path d="M0,${Math.round(H * 0.16)} Q ${Math.round(W * 0.26)},${Math.round(H * 0.04)} ${Math.round(W * 0.52)},${Math.round(H * 0.10)} T ${W},${Math.round(H * 0.07)} L${W},0 L0,0 Z" fill="${a2}" opacity="0.85"/>
      <path d="M0,${Math.round(H * 0.22)} Q ${Math.round(W * 0.30)},${Math.round(H * 0.10)} ${Math.round(W * 0.60)},${Math.round(H * 0.16)} T ${W},${Math.round(H * 0.12)} L${W},${Math.round(H * 0.07)} Q ${Math.round(W * 0.70)},${Math.round(H * 0.18)} ${Math.round(W * 0.35)},${Math.round(H * 0.11)} T 0,${Math.round(H * 0.16)} Z" fill="${a1}" opacity="0.92"/>
      <path d="M0,${Math.round(H * 0.86)} Q ${Math.round(W * 0.28)},${Math.round(H * 0.98)} ${Math.round(W * 0.60)},${Math.round(H * 0.90)} T ${W},${Math.round(H * 0.95)} L${W},${H} L0,${H} Z" fill="${lighten(a2, 0.05)}" opacity="0.9"/>
    `;
  } else {
    // waves (default)
    overlay = `
      <path d="M0,0 L${W},0 L${W},${Math.round(H * 0.18)} Q ${Math.round(W * 0.66)},${Math.round(H * 0.28)} ${Math.round(W * 0.35)},${Math.round(H * 0.16)} T 0,${Math.round(H * 0.22)} Z"
            fill="${a1}" opacity="0.95"/>
      <path d="M0,${Math.round(H * 0.20)} Q ${Math.round(W * 0.26)},${Math.round(H * 0.08)} ${Math.round(W * 0.52)},${Math.round(H * 0.16)} T ${W},${Math.round(H * 0.10)} L${W},${Math.round(H * 0.0)} L0,0 Z"
            fill="${a2}" opacity="0.85"/>
      <path d="M0,${Math.round(H * 0.84)} Q ${Math.round(W * 0.25)},${Math.round(H * 0.70)} ${Math.round(W * 0.55)},${Math.round(H * 0.88)} T ${W},${Math.round(H * 0.76)} L${W},${H} L0,${H} Z"
            fill="${lighten(a1, 0.05)}" opacity="0.90"/>
    `;
  }

  const watermarkRect = `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#wm)"/>`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
      ${watermarkDef}
      ${baseRect}
      ${overlay}
      ${watermarkRect}
    </svg>
  `.trim();

  return encodeSVG(svg);
}
function escapeXml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


function generateBackgroundCandidates({
  pageBG,
  accent,
  accent2,
  watermark,
  wmOpacity,
}) {
  const styles = ["waves", "diagonal", "mesh", "soft-arcs"];
  const list = [];
  const combos = [
    { a: accent, b: accent2 },
    { a: darken(accent, 0.08), b: accent2 },
    { a: accent, b: lighten(accent2, 0.08) },
  ];
  for (let i = 0; i < combos.length; i++) {
    for (let s = 0; s < styles.length; s++) {
      const url = buildA4Background({
        pageBG,
        accent: combos[i].a,
        accent2: combos[i].b,
        style: styles[s],
        watermark,
        wmOpacity,
      });
      list.push({ url, label: `${styles[s]} #${i + 1}` });
    }
  }
  const ranked = list
    .map((it) => ({ ...it, score: contrastRatio(pageBG, accent) + contrastRatio(pageBG, accent2) }))
    .sort((a, b) => b.score - a.score);
  return ranked.slice(0, 8);
}


function normalizeQuestions(q) {
  if (!q) return "";
  if (Array.isArray(q))
    return q.map((x, i) => `${i + 1}. ${String(x ?? "").trim()}`).join("\n");
  if (typeof q === "object") {
    const vals = Object.values(q)
      .map((v) => String(v ?? "").trim())
      .filter(Boolean);
    return vals.map((x, i) => `${i + 1}. ${x}`).join("\n");
  }
  return String(q ?? "").trim();
}

function pickFirst(obj, paths) {
  for (const p of paths) {
    const val = p
      .split(".")
      .reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
    if (typeof val === "string" && val.trim()) return val.trim();
    if (Array.isArray(val) && val.length) return val;
    if (val && typeof val === "object" && Object.keys(val).length) return val;
  }
  return "";
}

function addOptionSpacing(s) {
  if (!s) return "";
  const lines = String(s).split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    out.push(line);
    if (/^\s*-?\s*[A-D]\)\s/i.test(line)) {
      const next = lines[i + 1];
      if (next !== undefined && next.trim() !== "") out.push("");
    }
  }
  return out.join("\n");
}

function blocksFromLesson(lesson) {
  const items =
    Array.isArray(lesson?.contents) && lesson.contents.length
      ? lesson.contents
      : lesson?.contents && typeof lesson.contents === "object"
        ? [lesson.contents]
        : [lesson];

  const blocks = [];
  items.forEach((it) => {
    const textVal = pickFirst(it, ["text", "body", "content.text"]);
    const summaryVal = pickFirst(it, [
      "content_summary",
      "summary",
      "content.content_summary",
    ]);
    const quesVal = pickFirst(it, ["questions", "content.questions"]);
    const text = textVal ? `\n${String(textVal).trim()}` : "";
    const summary = summaryVal
      ? `\n#### Content Summary\n\n${String(summaryVal).trim()}`
      : "";

    const qRaw = normalizeQuestions(quesVal);
    const qSpaced = addOptionSpacing(qRaw);
    const questions = qSpaced ? `#### Questions\n\n${qSpaced}` : "";

    let block = [text, summary, questions].filter(Boolean).join("\n\n");

    if (!block && items.length === 1) {
      const lText = pickFirst(lesson, ["text", "generated_prompt"]);
      const lSum = pickFirst(lesson, ["content_summary", "lesson_description"]);
      const lQ = addOptionSpacing(
        normalizeQuestions(pickFirst(lesson, ["questions"]))
      );
      const t = lText ? `${String(lText).trim()}` : "";
      const s = lSum ? `#### Content Summary\n\n${String(lSum).trim()}` : "";
      const q = lQ ? `#### Questions\n\n${lQ}` : "";
      block = [t, s, q].filter(Boolean).join("\n\n");
    }
    if (block) blocks.push(block);
  });
  return blocks;
}

function _escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function stripScripts(html = "") {
  return String(html).replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}
function renderTemplate(html, ctx) {
  if (!html) return "";
  return html
    .replace(/\{\{\s*page\s*\}\}/g, String(ctx.page ?? ""))
    .replace(/\{\{\s*total\s*\}\}/g, String(ctx.total ?? ""))
    .replace(/\{\{\s*unit\s*\}\}/g, String(ctx.unit ?? ""))
    .replace(/\{\{\s*class\s*\}\}/g, String(ctx.className ?? ""))
    .replace(/\{\{\s*date\s*\}\}/g, String(ctx.date ?? ""))
    .replace(/\{\{\s*title\s*\}\}/g, String(ctx.title ?? ""))
    .replace(/\{\{\s*subtitle\s*\}\}/g, String(ctx.subtitle ?? ""));
}

function extractHexColorsFromHTML(html) {
  if (!html) return [];
  const colors = new Set();
  const re =
    /(?:fill|stroke|stop-color)\s*[:=]\s*["']?\s*(#[0-9a-fA-F]{3,6})\b/gi;
  let m;
  while ((m = re.exec(html))) {
    colors.add(m[1].toLowerCase());
  }
  return Array.from(colors);
}

function replaceHexColors(html, colorMap) {
  if (!html) return "";
  let out = String(html);
  const keys = Object.keys(colorMap || {}).sort((a, b) => b.length - a.length);
  for (const from of keys) {
    const to = colorMap[from];
    if (!from || !to || from.toLowerCase() === to.toLowerCase()) continue;
    const re = new RegExp(from.replace("#", "\\#"), "gi");
    out = out.replace(re, to);
  }
  return out;
}

function readMeta(html) {
  const unit = (String(html).match(/data-unit="([^"]*)"/i)?.[1] || "").trim();
  const title = (String(html).match(/data-title="([^"]*)"/i)?.[1] || "").trim();
  const klass = (String(html).match(/data-class="([^"]*)"/i)?.[1] || "").trim();
  return { unit, title, className: klass };
}


function bookToPagesWithTheme(book, theme) {
  const tempPages = [];
  const page_bg = theme?.page_bg || "#ffffff";
  const text = theme?.text || "#0f172a";
  const accent = theme?.accent || "#2563eb";
  const accent2 = theme?.accent2 || "#60a5fa";
  const hasBgImg = !!theme?.page_bg_image;
  const blockBg = hasBgImg ? "transparent" : page_bg;                 // for sections/cards
  const tableBg = hasBgImg ? "transparent" : page_bg;                 // for <table>
  const thBg = hasBgImg ? "transparent" : "rgba(37,99,235,.06)";


  const muted = hasBgImg ? (text || "#e2e8f0") : "#64748b";
  const tableBd = hasBgImg ? "rgba(255,255,255,.25)" : "#e5e7eb";

  const chipBg = hasBgImg ? "transparent" : "#fff";
  const chipBd = tableBd;
  const chipShadow = hasBgImg ? "none" : "0 2px 8px rgba(0,0,0,.03)";
  const badgeBg = hasBgImg ? "transparent" : (accent || text);
  const badgeTxt = hasBgImg ? text : "#fff";




  const sj = book?.syllabus;
  const units =
    Array.isArray(book?.units) && book.units.length
      ? book.units
      : Array.isArray(sj?.units)
        ? sj.units.map((u) => ({
          title: u.title,
          number_of_pages: u.number_of_pages,
          description: u.description || "",
          lessons: (u.lessons || []).map((l) => ({
            title: l.title,
            content_summary: l.contents?.content_summary,
            questions: l.contents?.questions,
            text: l.contents?.text,
          })),
        }))
        : [];

  let pageCounter = 1;
  const className =
    pickFirst(book, ["class_name", "class", "grade", "standard"]) || "";

  function wrap(bodyHtml, ctx = {}) {
    const metaProbe = `
      <span style="display:none"
        data-unit="${_escapeHtml(ctx.unit || "")}"
        data-class="${_escapeHtml(className)}"
        data-title="${_escapeHtml(ctx.title || "")}">
      </span>
    `;
    const full = `
      <div class="tbm-page" style="position:relative;background-color:${page_bg};color:${text};margin:0;padding:0">
        <div class="tbm-body" style="padding:16px 18px;line-height:normal;font-size:inherit">
          ${metaProbe}
          ${bodyHtml}
        </div>
      </div>
    `.trim();
    pageCounter += 1;
    tempPages.push(full);
  }

  const tocRows = (units || [])
    .map((u, ui) => {
      const uTitle = u.title || `Unit ${ui + 1}`;
      const uPages = u.number_of_pages ?? "—";

      const chipBase = `
  display:inline-flex;align-items:center;gap:6px;
  padding:6px 10px;margin:6px 8px 0 0;
  border:1px solid ${tableBd};
  border-radius:9999px;font-size:12px;line-height:1.1;
  background:${hasBgImg ? "transparent" : "#fff"};
  color:${text};
  max-width:100%;box-sizing:border-box;overflow:hidden
`;

      const chipNum = `
  display:inline-grid;place-items:center;min-width:18px;height:18px;
  padding:0 4px;border-radius:6px;
  ${hasBgImg
          ? `background:transparent;border:1px solid ${tableBd};color:${text};`
          : `background:${accent};color:#fff;`}
  font-weight:700;font-size:11px;flex:0 0 auto
`;

      const chipTitle = `
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;max-width:100%;
  color:${text}
`;


      const lessonChipsInner = (u.lessons || [])
        .map((l, li) => {
          const num = `${ui + 1}.${li + 1}`;
          const title = l.title || `Lesson ${li + 1}`;
          return `
      <span style="${chipBase}">
  <span style="${chipNum}">${num}</span>
  <span style="${chipTitle}">${_escapeHtml(title)}</span>
</span>

      `;
        })
        .join("");

      const lessonChips =
        u.lessons && u.lessons.length
          ? lessonChipsInner
          : `<span style="${chipBase};opacity:.7;background:#f8fafc">No lessons</span>`;

      const rowBg = hasBgImg ? "transparent" : (ui % 2 === 0 ? "rgba(0,0,0,.02)" : page_bg);

      return `
      <tr style="background:${rowBg}">
        <td style="padding:12px 12px;width:42px;color:#64748b;font-weight:700;">
          ${ui + 1}.
        </td>
        <td style="padding:12px 12px;">
          <div style="
            font-weight:800;color:${text};
            overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%
          ">
            ${_escapeHtml(uTitle)}
          </div>
        </td>
        <td style="padding:12px 12px;width:120px;text-align:right;color:${accent};font-weight:800;">
          ${uPages} pages
        </td>
      </tr>

      <tr style="background:${rowBg}">
        <td></td>
        <td colspan="2" style="padding:4px 12px 14px 12px;">
          <div style="display:flex;flex-wrap:wrap;align-items:flex-start;max-width:100%;overflow:hidden">
            ${lessonChips}
          </div>
        </td>
      </tr>
    `;
    })
    .join("");

  const contentsBody = `
  <div style="padding:8px 0 4px 0; background:${blockBg};">
    <div style="
      display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin:0 0 8px 0;
    ">
      <h1 style="
        margin:0 auto;
        font-size:2.25rem;
        font-weight:800;
        color:${text};
        text-align:center;
        width:100%;
      ">Contents</h1>
    </div>

 <table style="
  width:100%;border-collapse:separate;border-spacing:0;margin-top:10px;
  border:1px solid ${tableBd};
  border-radius:12px;overflow:hidden;
  background-color:${blockBg};
  box-shadow:${hasBgImg ? 'none' : '0 2px 10px rgba(0,0,0,.03)'}">
  <thead>
    <tr>
      <th style="
        text-align:left;padding:12px 12px;width:42px;color:${accent};font-weight:800;
        border-bottom:1px solid ${tableBd};
        background:${hasBgImg ? 'transparent' : 'rgba(37,99,235,.06)'}">#</th>
      <th style="
        text-align:left;padding:12px 12px;color:${accent};font-weight:800;
        border-bottom:1px solid ${tableBd};
        background:${hasBgImg ? 'transparent' : 'rgba(37,99,235,.06)'}">Unit</th>
      <th style="
        text-align:right;padding:12px 12px;color:${accent};font-weight:800;width:120px;
        border-bottom:1px solid ${tableBd};
        background:${hasBgImg ? 'transparent' : 'rgba(37,99,235,.06)'}">Pages</th>
    </tr>
  </thead>
  <tbody style="background:${blockBg};">
    ${tocRows || `
      <tr style="background:${blockBg};">
        <td colspan="3" style="
          padding:16px 12px;
          color:${muted};
          text-align:center;
          border-top:1px dashed ${tableBd};
          background:${blockBg};
        ">
          No units available
        </td>
      </tr>
    `}
  </tbody>
</table>

  </div>
`;

  wrap(contentsBody, { unit: "Contents" });

  units.forEach((u, ui) => {
    const uTitle = u.title || `Unit ${ui + 1}`;
    const uPages = u.number_of_pages ?? "—";
    const uDesc = u.description || "";
    const lessonChipBase = `
  display:inline-flex;align-items:center;gap:8px;
  padding:10px 12px;border-radius:12px;
  background:${chipBg};
  border:1px solid ${chipBd};
  box-shadow:${chipShadow};
  max-width:100%; box-sizing:border-box; margin:6px 8px 0 0
`;

    const lessonNumBadge = `
  display:inline-grid;place-items:center;min-width:24px;height:24px;
  padding:0 6px;border-radius:8px;
  background:${badgeBg};
  color:${badgeTxt};
  font-weight:800;font-size:12px;flex:0 0 auto
`;

    const lessonTitleStyle = `
  font-weight:700;color:${text};font-size:13px;min-width:0;max-width:100%;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap
`;


    const lessonsChipsHTML = (u.lessons || [])
      .map((l, li) => {
        const num = `${ui + 1}.${li + 1}`;
        const title = l.title || `Lesson ${li + 1}`;
        return `
      <div style="${lessonChipBase}">
        <span style="${lessonNumBadge}">${num}</span>
        <span style="${lessonTitleStyle}">${_escapeHtml(title)}</span>
      </div>
    `;
      })
      .join("");


    const lessonsBlock =
      u.lessons && u.lessons.length
        ? `
      <div style="
        display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start;
        width:100%;box-sizing:border-box;max-width:100%;overflow:hidden
      ">
        ${lessonsChipsHTML}
      </div>
    `
        : `<p style="margin:0;color:#64748b;">No lessons</p>`;

    const unitHeroBody = [
      `<section style="min-height:58vh;display:flex;align-items:center;justify-content:center;text-align:center;border-radius:12px;background-color:${blockBg};">
    <div style="padding:20px 16px;max-width:820px;">
      <h1 style="margin:0 0 10px 0;font-size:2.5rem;font-weight:800;letter-spacing:.2px;color:${text};">
        ${_escapeHtml(uTitle)}
      </h1>
      ${uDesc
        ? `<p style="margin:14px auto 0;max-width:720px;color:${text};line-height:1.7;">
             ${_escapeHtml(uDesc)}
           </p>`
        : ``}
    </div>
  </section>`,

      `<div style="margin-top:18px;background:${blockBg};">
    <div style="display:flex;align-items:center;gap:10px;margin:0 0 10px 0">
      <h3 style="margin:0;font-size:1.125rem;font-weight:800;color:${text};">Lessons</h3>
    </div>
    ${lessonsBlock}
  </div>`,
    ].join("\n\n");

    wrap(unitHeroBody, { unit: uTitle });

    (u.lessons || []).forEach((l, li) => {
      const lTitle = l.title || `Lesson ${li + 1}`;
      const lPages = l.number_of_pages ?? "—";
      const blocks = blocksFromLesson(l);

      if (blocks.length) {
        blocks.forEach((b, bi) => {
          const titleTop =
            bi === 0
              ? `<h3 style="margin:0 0 8px 0;color:${accent};">${_escapeHtml(
                uTitle
              )} • ${ui + 1}.${li + 1} ${_escapeHtml(lTitle)}</h3>
       <div style="color:#64748b;font-size:12px;margin-bottom:10px">(Estimated pages: ${lPages})</div>`
              : `<h3 style="margin:0 0 8px 0;color:${accent2};">${_escapeHtml(
                lTitle
              )} — Page ${bi + 1}</h3>`;

          const safeHtml = stripScripts(b);

          const body = `${titleTop}
  <div style="line-height:1.6;color:${text}">${safeHtml}</div>`;
          wrap(body, { unit: uTitle, title: lTitle });
        });
      } else {
        const body = `
          <h3 style="margin:0 0 8px 0;color:${accent2};">${_escapeHtml(
          uTitle
        )} • ${ui + 1}.${li + 1} ${_escapeHtml(lTitle)}</h3>
          <div style="color:#64748b;font-size:12px;margin-bottom:10px">(Estimated pages: ${lPages})</div>
          <div style="color:${text}"><em>No content available yet.</em></div>`;
        wrap(body, { unit: uTitle, title: lTitle });
      }
    });
  });

  const total = tempPages.length;
  return tempPages.map((html) =>
    html.replace(/\{\{\s*total\s*\}\}/g, String(total))
  );
}

/* ===========================
   Theme Panel (+ Smart Background generator)
=========================== */
function ThemePanel({
  selectedThemeKey,
  setSelectedThemeKey,
  themeKeys,
  pageThemes,
  effectiveTheme,
  apply,
  setApply,
  custom,
  setCustom,
  svgColorMap,
  setSvgColorMap,
  onClose,
  onPickImage,
  onPickImageUrl,
  onApplyBackgroundUrl,
  wmDefault = "TBM+",
  bgScope = "all",
  setBgScope = () => { },
}) {

  const [styleKind, setStyleKind] = React.useState("auto");
  const [bgCandidates, setBgCandidates] = React.useState([]);

  const pageBG = custom.page_bg || effectiveTheme?.page_bg || "#ffffff";
  const textCol = custom.text || effectiveTheme?.text || "#0f172a";
  const a1 = custom.accent || effectiveTheme?.accent || "#2563eb";
  const a2 = custom.accent2 || effectiveTheme?.accent2 || "#60a5fa";
  const [wmEnabled, setWmEnabled] = React.useState(true);
  const [wmText, setWmText] = React.useState((wmDefault || "TBM+").toUpperCase());
  const [wmOpacity, setWmOpacity] = React.useState(0.12);
  const [wmGap, setWmGap] = React.useState(220);
  const [wmSize, setWmSize] = React.useState(56);
  const [wmAngle, setWmAngle] = React.useState(-30);

  const regenerate = React.useCallback(() => {
    const base = generateBackgroundCandidates({
      pageBG: pageBG,
      accent: a1,
      accent2: a2,
      watermark: wmText || wmDefault || "TBM+",
      wmOpacity: wmOpacity,
    });
    const filtered =
      styleKind === "auto" ? base : base.filter((c) => c.label.startsWith(styleKind));
    setBgCandidates(filtered.length ? filtered : base);
  }, [pageBG, a1, a2, wmText, wmOpacity, styleKind, wmDefault]);

  React.useEffect(() => {
    regenerate();
  }, [regenerate]);

  const smallBtn = {
    border: "1px solid #e5e7eb",
    background: "#fff",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
  };

  return (
    <aside
      style={{
        position: "sticky",
        top: 16,
        alignSelf: "start",
        height: "calc(100vh - 32px)",
        overflow: "auto",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        background: "#fff",
        padding: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>
          Theme settings
        </div>
        <button onClick={onClose} style={smallBtn} title="Close theme panel">
          Close
        </button>
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 10,
          marginBottom: 12,
        }}
      >
        <div style={{ color: "#0f172a", marginBottom: 8 }}>
          Upload Page Background (A4, 2480×3508) — applies to all pages
        </div>

        <div style={{
          display: "grid", gap: 8, fontSize: 12, color: "#334155",
          gridTemplateColumns: "1fr 1fr", alignItems: "center", marginBottom: 8
        }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={wmEnabled}
              onChange={(e) => setWmEnabled(e.target.checked)}
            />
            <span style={{ fontWeight: 700 }}>Add watermark</span>
          </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span style={{ fontWeight: 600 }}>Opacity (0–1)</span>
            <input
              type="number" min={0} max={1} step={0.01}
              value={wmOpacity}
              onChange={(e) => setWmOpacity(Math.max(0, Math.min(1, Number(e.target.value) || 0)))}
              style={{ height: 32, borderRadius: 8, border: "1px solid #e2e8f0", padding: "0 8px" }}
            />
          </label>

          <label style={{ gridColumn: "1 / -1", display: "grid", gap: 4 }}>
            <span style={{ fontWeight: 600 }}>Watermark text</span>
            <input
              type="text"
              value={wmText}
              onChange={(e) => setWmText(e.target.value)}
              placeholder="e.g. TBM+ / Book Title"
              style={{ height: 32, borderRadius: 8, border: "1px solid #e2e8f0", padding: "0 10px" }}
            />
          </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span style={{ fontWeight: 600 }}>Font size</span>
            <input
              type="number" min={10} max={200} step={2}
              value={wmSize}
              onChange={(e) => setWmSize(Math.max(10, Math.min(200, Number(e.target.value) || 56)))}
              style={{ height: 32, borderRadius: 8, border: "1px solid #e2e8f0", padding: "0 8px" }}
            />
          </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span style={{ fontWeight: 600 }}>Gap</span>
            <input
              type="number" min={60} max={400} step={10}
              value={wmGap}
              onChange={(e) => setWmGap(Math.max(60, Math.min(400, Number(e.target.value) || 220)))}
              style={{ height: 32, borderRadius: 8, border: "1px solid #e2e8f0", padding: "0 8px" }}
            />
          </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span style={{ fontWeight: 600 }}>Angle (°)</span>
            <input
              type="number" min={-90} max={90} step={1}
              value={wmAngle}
              onChange={(e) => setWmAngle(Math.max(-90, Math.min(90, Number(e.target.value) || -30)))}
              style={{ height: 32, borderRadius: 8, border: "1px solid #e2e8f0", padding: "0 8px" }}
            />
          </label>
        </div>

        <div style={{ display: "grid", gap: 8, fontSize: 12, color: "#334155" }}>
          <input
            id="bg-file"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = reader.result;
                if (wmEnabled) {
                  const wmDataUrl = createWatermarkedBackgroundSVG({
                    imageUrl: dataUrl,
                    text: wmText || "TBM+",
                    opacity: wmOpacity,
                    gap: wmGap,
                    size: wmSize,
                    angle: wmAngle,
                  });
                  onApplyBackgroundUrl?.(wmDataUrl);
                } else {
                  onApplyBackgroundUrl?.(dataUrl);
                }
              };
              reader.readAsDataURL(file);
              e.target.value = "";
            }}
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0,0,0,0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
            title="Select background image"
          />

          <button
            type="button"
            onClick={() => document.getElementById("bg-file")?.click()}
            style={{
              height: 36,
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              padding: "6px 12px",
              background: "#fff",
              color: "#0f172a",
              cursor: "pointer",
              fontWeight: 600,
              justifySelf: "start",
              width: "100%",
            }}
            aria-label="Choose page background"
          >
            Choose Background (all pages)
          </button>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => onApplyBackgroundUrl?.("")}
              style={{
                height: 32,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                padding: "0 10px",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
              title="Remove background"
            >
              Remove background
            </button>
          </div>

          <div style={{ fontSize: 12, color: "#64748b" }}>
            Tip: 2480×3508 (A4 @ 300 DPI) best rahega. SVG/data URL bhi chalega. Agar “Add watermark” on hai,
            to upload hotey hi background me diagonal repeated text embed ho jayega.
          </div>
        </div>
      </div>


      <label
        style={{
          display: "grid",
          gap: 6,
          marginBottom: 12,
          fontSize: 12,
          color: "#334155",
        }}
      >
        <span style={{ fontWeight: 700 }}>Or upload a cover (2480 × 3508)</span>

        <input
          id="cover-file"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && onPickImage) onPickImage(file);
          }}
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
          title="Select an image to show on top"
        />

        <button
          type="button"
          onClick={() => document.getElementById("cover-file")?.click()}
          style={{
            height: 36,
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            padding: "6px 12px",
            background: "#fff",
            color: "#0f172a",
            cursor: "pointer",
            fontWeight: 600,
            justifySelf: "start",
            width: "100%",
          }}
          aria-label="Choose cover page"
        >
          Choose Cover page
        </button>
      </label>

      <label
        style={{
          display: "grid",
          gap: 6,
          marginBottom: 12,
          fontSize: 12,
          color: "#334155",
        }}
      >
        <span style={{ fontWeight: 700 }}>Choose theme</span>
        <select
          value={selectedThemeKey}
          onChange={(e) => setSelectedThemeKey(e.target.value)}
          style={{
            width: "100%",
            height: 36,
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            padding: "0 10px",
            background: "#fff",
            color: "#0f172a",
            minWidth: 200,
          }}
          title="Choose page theme"
        >
          {themeKeys.map((k) => {
            const t = pageThemes[k];
            return (
              <option key={k} value={k}>
                {k} — {t?.id || "untitled"}
              </option>
            );
          })}
        </select>
      </label>

      <div style={{ fontSize: 12, color: "#334155", display: "grid", gap: 12 }}>
        <label
          style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
        >
          <input
            type="checkbox"
            checked={apply.page_bg}
            onChange={(e) => setApply((s) => ({ ...s, page_bg: e.target.checked }))}
          />
          <span style={{ fontWeight: 700, minWidth: 140 }}>Apply page_bg</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 8px",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              background: "#fff",
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                border: "1px solid #e2e8f0",
                background:
                  custom.page_bg || effectiveTheme?.page_bg || "#ffffff",
              }}
            />
            <input
              type="color"
              value={custom.page_bg || effectiveTheme?.page_bg || "#ffffff"}
              onChange={(e) =>
                setCustom((c) => ({ ...c, page_bg: e.target.value }))
              }
              style={{
                width: 32,
                height: 20,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              title="Pick page/body background"
            />
            <button
              onClick={() => setCustom((c) => ({ ...c, page_bg: "" }))}
              style={{
                border: "1px solid #e2e8f0",
                background: "#fff",
                borderRadius: 6,
                padding: "2px 6px",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </span>
          <span style={{ color: "#64748b" }}>
            Body background is always same as page background.
          </span>
        </label>

        <label
          style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
        >
          <input
            type="checkbox"
            checked={apply.text}
            onChange={(e) => setApply((s) => ({ ...s, text: e.target.checked }))}
          />
          <span style={{ fontWeight: 700, minWidth: 140 }}>Apply text</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 8px",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              background: "#fff",
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                border: "1px solid #e2e8f0",
                background: custom.text || effectiveTheme?.text || "#0f172a",
              }}
            />
            <input
              type="color"
              value={custom.text || effectiveTheme?.text || "#0f172a"}
              onChange={(e) => setCustom((c) => ({ ...c, text: e.target.value }))}
              style={{
                width: 32,
                height: 20,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              title="Pick text color"
            />
            <button
              onClick={() => setCustom((c) => ({ ...c, text: "" }))}
              style={{
                border: "1px solid #e2e8f0",
                background: "#fff",
                borderRadius: 6,
                padding: "2px 6px",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </span>
        </label>

        <label
          style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
        >
          <input
            type="checkbox"
            checked={apply.accent}
            onChange={(e) => setApply((s) => ({ ...s, accent: e.target.checked }))}
          />
          <span style={{ fontWeight: 700, minWidth: 140 }}>Apply accent</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 8px",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              background: "#fff",
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                border: "1px solid #e2e8f0",
                background: custom.accent || effectiveTheme?.accent || "#2563eb",
              }}
            />
            <input
              type="color"
              value={custom.accent || effectiveTheme?.accent || "#2563eb"}
              onChange={(e) =>
                setCustom((c) => ({ ...c, accent: e.target.value }))
              }
              style={{
                width: 32,
                height: 20,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              title="Pick accent color"
            />
            <button
              onClick={() => setCustom((c) => ({ ...c, accent: "" }))}
              style={{
                border: "1px solid #e2e8f0",
                background: "#fff",
                borderRadius: 6,
                padding: "2px 6px",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </span>
        </label>

        <label
          style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
        >
          <input
            type="checkbox"
            checked={apply.accent2}
            onChange={(e) =>
              setApply((s) => ({ ...s, accent2: e.target.checked }))
            }
          />
          <span style={{ fontWeight: 700, minWidth: 140 }}>Apply accent2</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 8px",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              background: "#fff",
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                border: "1px solid #e2e8f0",
                background:
                  custom.accent2 || effectiveTheme?.accent2 || "#60a5fa",
              }}
            />
            <input
              type="color"
              value={custom.accent2 || effectiveTheme?.accent2 || "#60a5fa"}
              onChange={(e) =>
                setCustom((c) => ({ ...c, accent2: e.target.value }))
              }
              style={{
                width: 32,
                height: 20,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              title="Pick accent2 color"
            />
            <button
              onClick={() => setCustom((c) => ({ ...c, accent2: "" }))}
              style={{
                border: "1px solid #e2e8f0",
                background: "#fff",
                borderRadius: 6,
                padding: "2px 6px",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </span>
        </label>

        <div style={{ marginTop: 6, paddingTop: 8, borderTop: "1px solid #e2e8f0" }}>
          <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
            SVG colors
          </div>
          {Object.keys(svgColorMap).length === 0 ? (
            <div style={{ color: "#64748b", fontSize: 12 }}>
              No SVG colors detected in this theme.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {Object.entries(svgColorMap).map(([orig, current]) => (
                <label
                  key={orig}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      minWidth: 120,
                      fontFamily: "monospace",
                      fontSize: 12,
                    }}
                  >
                    {orig.toLowerCase()}
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "4px 8px",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      background: "#fff",
                    }}
                  >
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 4,
                        border: "1px solid #e2e8f0",
                        background: current,
                      }}
                    />
                    <input
                      type="color"
                      value={current}
                      onChange={(e) => {
                        const v = e.target.value;
                        setSvgColorMap((m) => ({ ...m, [orig]: v }));
                      }}
                      style={{
                        width: 32,
                        height: 20,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                      title={`Replace ${orig}`}
                    />
                    <button
                      onClick={() =>
                        setSvgColorMap((m) => ({ ...m, [orig]: orig }))
                      }
                      style={{
                        border: "1px solid #e2e8f0",
                        background: "#fff",
                        borderRadius: 6,
                        padding: "2px 6px",
                        cursor: "pointer",
                      }}
                      title="Reset to original"
                    >
                      Reset
                    </button>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 6, color: "#64748b" }}>
          Toggle which theme parts apply. Unchecked values fall back to safe
          defaults.
        </div>
      </div>
    </aside>
  );
}

/* ===========================
   Editor Panel (with inline Magnification/Resize overlay)
=========================== */
function EditorPanel({ onClose }) {
  const fonts = ["Arial", "Inter", "Times New Roman", "Georgia", "Roboto"];
  const sizes = [10, 11, 12, 14, 16, 18, 20, 24];

  const fileRef = React.useRef(null);
  const [objectUrls, setObjectUrls] = React.useState([]);

  const lastRangeRef = React.useRef(null);
  const lastEditableElRef = React.useRef(null);

  const [selectedImg, setSelectedImg] = React.useState(null);
  const [imgWidth, setImgWidth] = React.useState(400);

  const [overlayRect, setOverlayRect] = React.useState(null);
  const resizingRef = React.useRef(null);
  const draggingRef = React.useRef(null);

  function saveCurrentRangeIfEditable() {
    const sel = window.getSelection && window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const root = range.startContainer
      ? (range.startContainer.nodeType === 1
        ? range.startContainer
        : range.startContainer.parentElement
      )?.closest('[data-editable="true"]')
      : null;
    if (root) {
      lastRangeRef.current = range.cloneRange();
      lastEditableElRef.current = root;
    }
  }

  function placeCaretAtEnd(el) {
    try {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      lastRangeRef.current = range.cloneRange();
      lastEditableElRef.current = el;
    } catch { }
  }

  React.useEffect(() => {
    return () => {
      objectUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [objectUrls]);

  React.useEffect(() => {
    function onDocClick(e) {
      const t = e.target;
      if (!t) return;

      const editableRoot = t.closest?.('[data-editable="true"]');
      if (editableRoot) {
        setTimeout(() => {
          saveCurrentRangeIfEditable();
          if (t.tagName === "IMG") {
            const img = t;
            setSelectedImg(img);
            const w =
              (img.style.width && parseInt(img.style.width, 10)) ||
              Math.min(
                img.naturalWidth || 400,
                editableRoot.clientWidth || 720
              );
            setImgWidth(w);
            updateOverlayRect(img);
          } else {
            setSelectedImg(null);
            setOverlayRect(null);
          }
        }, 0);
      } else {
        setSelectedImg(null);
        setOverlayRect(null);
      }
    }

    function onSelectionChange() {
      saveCurrentRangeIfEditable();
    }

    document.addEventListener("click", onDocClick);
    document.addEventListener("selectionchange", onSelectionChange);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, []);

  React.useEffect(() => {
    function onWin() {
      if (selectedImg) updateOverlayRect(selectedImg);
    }
    window.addEventListener("scroll", onWin, true);
    window.addEventListener("resize", onWin);
    return () => {
      window.removeEventListener("scroll", onWin, true);
      window.removeEventListener("resize", onWin);
    };
  }, [selectedImg]);

  function updateOverlayRect(img) {
    if (!img) {
      setOverlayRect(null);
      return;
    }
    const r = img.getBoundingClientRect();
    setOverlayRect({
      left: r.left + window.scrollX,
      top: r.top + window.scrollY,
      width: r.width,
      height: r.height,
    });
  }

  function cmd(command, value = null) {
    try {
      document.execCommand(command, false, value);
      const active = document.querySelector('[data-editable="true"]');
      if (active) active.focus();
    } catch { }
  }

  function makeLink() {
    const url = prompt("Enter URL:");
    if (!url) return;
    cmd("createLink", url);
  }
  function setFont(e) {
    cmd("fontName", e.target.value);
  }
  function setSize(e) {
    const px = Number(e.target.value);
    const map = { 10: 1, 11: 1, 12: 2, 14: 3, 16: 4, 18: 5, 20: 6, 24: 7 };
    cmd("fontSize", map[px] || 3);
  }
  function setColor(e) {
    cmd("foreColor", e.target.value);
  }
  function setHilite(e) {
    cmd("hiliteColor", e.target.value);
  }

  function insertImageFromFile(f) {
    const editable =
      lastEditableElRef.current ||
      document.activeElement?.closest?.('[data-editable="true"]');
    if (!editable) return;

    const url = URL.createObjectURL(f);
    setObjectUrls((arr) => [...arr, url]);

    const html =
      `<img src="${url}" class="tbm-img" ` +
      `style="max-width:100%;height:auto;width:400px;display:block;margin:8px auto;cursor:pointer;" />`;

    editable.focus();
    const sel = window.getSelection();
    sel.removeAllRanges();

    if (lastRangeRef.current) {
      try {
        sel.addRange(lastRangeRef.current);
      } catch {
        placeCaretAtEnd(editable);
      }
    } else {
      placeCaretAtEnd(editable);
    }

    try {
      document.execCommand("insertHTML", false, html);
    } catch {
      editable.insertAdjacentHTML("beforeend", html);
    }

    editable.focus();
    saveCurrentRangeIfEditable();
  }

  function onPickImageClick() {
    if (fileRef.current) fileRef.current.click();
  }
  function onFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    insertImageFromFile(f);
    e.target.value = "";
  }

  function beginResize(dir, e) {
    if (!selectedImg) return;
    e.preventDefault();
    const r = selectedImg.getBoundingClientRect();
    resizingRef.current = {
      dir,
      startX: e.pageX,
      startY: e.pageY,
      startW: r.width,
      startH: r.height,
      naturalRatio:
        (selectedImg.naturalWidth || r.width) /
        (selectedImg.naturalHeight || r.height),
    };
    document.addEventListener("mousemove", onResizing);
    document.addEventListener("mouseup", endResize, { once: true });
  }
  function onResizing(e) {
    const s = resizingRef.current;
    if (!s || !selectedImg) return;
    const dx = e.pageX - s.startX;
    const dy = e.pageY - s.startY;
    let w = s.startW,
      h = s.startH;

    if (s.dir.includes("e")) w = s.startW + dx;
    if (s.dir.includes("w")) w = s.startW - dx;
    if (s.dir.includes("s")) h = s.startH + dy;
    if (s.dir.includes("n")) h = s.startH - dy;

    if (e.shiftKey) {
      const ratio = s.naturalRatio || s.startW / s.startH;
      if (Math.abs(dx) > Math.abs(dy)) {
        h = w / ratio;
      } else {
        w = h * ratio;
      }
    }

    w = Math.max(80, w);
    h = Math.max(80, h);

    selectedImg.style.width = `${w}px`;
    selectedImg.style.height = `${h}px`;
    selectedImg.style.maxWidth = "none";

    setImgWidth(w);
    updateOverlayRect(selectedImg);
  }
  function endResize() {
    document.removeEventListener("mousemove", onResizing);
    resizingRef.current = null;
    saveCurrentRangeIfEditable();
  }

  function beginDrag(e) {
    if (!selectedImg || !overlayRect) return;
    e.preventDefault();
    const r = selectedImg.getBoundingClientRect();
    draggingRef.current = {
      startX: e.pageX,
      startY: e.pageY,
      startLeft: r.left + window.scrollX,
      startTop: r.top + window.scrollY,
    };
    document.addEventListener("mousemove", onDragging);
    document.addEventListener("mouseup", endDrag, { once: true });
  }
  function onDragging(e) {
    const s = draggingRef.current;
    if (!s) return;
    const dx = e.pageX - s.startX;
    const dy = e.pageY - s.startY;
    setOverlayRect((rect) =>
      rect
        ? {
          ...rect,
          left: s.startLeft + dx,
          top: s.startTop + dy,
        }
        : rect
    );
  }
  function endDrag() {
    document.removeEventListener("mousemove", onDragging);
    draggingRef.current = null;
    updateOverlayRect(selectedImg);
  }

  React.useEffect(() => {
    if (!selectedImg) return;
    function onWheel(e) {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1 / 1.1 : 1.1;
      const currentW =
        selectedImg.getBoundingClientRect().width || imgWidth || 400;
      const w = Math.max(80, currentW * factor);
      selectedImg.style.width = `${w}px`;
      selectedImg.style.height = "auto";
      selectedImg.style.maxWidth = "none";
      setImgWidth(w);
      updateOverlayRect(selectedImg);
    }
    function onKey(e) {
      if (!selectedImg) return;
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        const currentW =
          selectedImg.getBoundingClientRect().width || imgWidth || 400;
        const w = Math.max(80, currentW * 1.1);
        selectedImg.style.width = `${w}px`;
        selectedImg.style.height = "auto";
        setImgWidth(w);
        updateOverlayRect(selectedImg);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        const currentW =
          selectedImg.getBoundingClientRect().width || imgWidth || 400;
        const w = Math.max(80, currentW / 1.1);
        selectedImg.style.width = `${w}px`;
        selectedImg.style.height = "auto";
        setImgWidth(w);
        updateOverlayRect(selectedImg);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "0") {
        e.preventDefault();
        const w = selectedImg.naturalWidth || 400;
        selectedImg.style.width = `${w}px`;
        selectedImg.style.height = "auto";
        setImgWidth(w);
        updateOverlayRect(selectedImg);
      }
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedImg, imgWidth]);

  function Overlay() {
    if (!selectedImg || !overlayRect) return null;
    const { left, top, width, height } = overlayRect;
    const boxStyle = {
      position: "absolute",
      left,
      top,
      width,
      height,
      border: "2px solid #2563eb",
      borderRadius: 6,
      boxSizing: "border-box",
      pointerEvents: "none",
      zIndex: 9998,
    };
    const handleBase = {
      position: "absolute",
      width: 12,
      height: 12,
      borderRadius: 6,
      border: "2px solid #fff",
      background: "#2563eb",
      boxShadow: "0 0 0 1px #2563eb",
      pointerEvents: "auto",
    };
    const mkHandle = (dir, style, cursor) => (
      <div
        key={dir}
        onMouseDown={(e) => beginResize(dir, e)}
        style={{ ...handleBase, ...style, cursor }}
        title={`Resize ${dir.toUpperCase()} (Shift = lock ratio)`}
      />
    );

    const handles = [
      mkHandle("nw", { left: -6, top: -6 }, "nwse-resize"),
      mkHandle("n", { left: width / 2 - 6, top: -6 }, "ns-resize"),
      mkHandle("ne", { left: width - 6, top: -6 }, "nesw-resize"),
      mkHandle("e", { left: width - 6, top: height / 2 - 6 }, "ew-resize"),
      mkHandle("se", { left: width - 6, top: height - 6 }, "nwse-resize"),
      mkHandle("s", { left: width / 2 - 6, top: height - 6 }, "ns-resize"),
      mkHandle("sw", { left: -6, top: height - 6 }, "nesw-resize"),
      mkHandle("w", { left: -6, top: height / 2 - 6 }, "ew-resize"),
    ];

    const dragBarStyle = {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: 24,
      background: "rgba(37,99,235,.15)",
      cursor: "move",
      pointerEvents: "auto",
      borderBottom: "1px solid rgba(37,99,235,.4)",
    };

    return ReactDOM.createPortal(
      <>
        <div style={boxStyle} />
        <div
          style={{
            position: "absolute",
            left,
            top,
            width,
            height,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <div style={dragBarStyle} onMouseDown={beginDrag} />
          {handles}
        </div>
      </>,
      document.body
    );
  }

  const btn = (label, onClick, title) => (
    <button
      onClick={onClick}
      title={title || label}
      style={{
        height: 32,
        padding: "0 10px",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        background: "#fff",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );

  return (
    <aside
      style={{
        position: "sticky",
        top: 16,
        alignSelf: "start",
        height: "calc(100vh - 32px)",
        overflow: "auto",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        background: "#fff",
        padding: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>
          Editor
        </div>
        {btn("Close", onClose, "Close editor panel")}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ display: "none" }}
        />
        {btn(
          "Insert image",
          onPickImageClick,
          "Insert an image at the last clicked cursor spot"
        )}
      </div>

      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select
            onChange={setFont}
            style={{
              height: 36,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "0 10px",
            }}
          >
            {fonts.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <select
            onChange={setSize}
            defaultValue={16}
            style={{
              height: 36,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "0 10px",
            }}
          >
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {btn("B", () => cmd("bold"), "Bold")}
          {btn("I", () => cmd("italic"), "Italic")}
          {btn("U", () => cmd("underline"), "Underline")}
          {btn("S", () => cmd("strikeThrough"), "Strikethrough")}
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#334155", width: 72 }}>Text</span>
            <input type="color" defaultValue="#111827" onChange={setColor} />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#334155", width: 72 }}>
              Highlight
            </span>
            <input type="color" defaultValue="#ffff00" onChange={setHilite} />
          </label>
          {btn("Clear", () => cmd("removeFormat"), "Clear direct formatting")}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {btn("Left", () => cmd("justifyLeft"), "Align left")}
          {btn("Center", () => cmd("justifyCenter"), "Align center")}
          {btn("Right", () => cmd("justifyRight"), "Align right")}
          {btn("Justify", () => cmd("justifyFull"), "Justify")}
          {btn("• List", () => cmd("insertUnorderedList"), "Bullet list")}
          {btn("1. List", () => cmd("insertOrderedList"), "Numbered list")}
          {btn("Link", makeLink, "Create link")}
          {btn("— Indent", () => cmd("outdent"), "Outdent")}
          {btn("+ Indent", () => cmd("indent"), "Indent")}
        </div>
      </div>

      <Overlay />
    </aside>
  );
}


function DocView({
  pages,
  fontSize = 16,
  deviceDimensions = { width: 720, height: 520 },
  theme = null,
  onPageInView = () => { },
  editable = false,
  imageUrl = null,
  onImageClick = () => { },
  bgScope = "all",
  selectedPage = null,
  onSelectPage = () => { },
  bgDisabledPages = new Set(),
  collectEditedHTMLRef,
}) {
  const pageWidth = Math.min(deviceDimensions.width, 860);
  const pageMinHeight = Math.max(deviceDimensions.height, 980);
  const contentRefs = React.useRef([]);
  contentRefs.current = [];
  const pageBg = theme?.page_bg ?? "#ffffff";
  const bodyBg = theme?.body_bg ?? pageBg;
  const textCol = theme?.text ?? "#1f2937";
  const accent = theme?.accent ?? null;
  const accent2 = theme?.accent2 ?? null;
  const headHTML = theme?.header || "";
  const footHTML = theme?.footer || "";
  const bgImg = theme?.page_bg_image || null;
  function getMetaFromPage(html, key) {
    const m = new RegExp(`data-${key}="([^"]*)"`, "i").exec(String(html || ""));
    return m && m[1] ? m[1] : "";
  }

  const pageRefs = React.useRef([]);
  pageRefs.current = [];



  const hydratedOnceRef = React.useRef(new Set());
  const dirtyRef = React.useRef(new Set());
  const dirtyHandlersRef = React.useRef(new WeakMap());

  function bindDirtyGuards(el, idx) {
    if (!el) return;
    if (dirtyHandlersRef.current.has(el)) return;
    const handler = () => dirtyRef.current.add(idx);
    ["input", "blur", "paste", "keydown"].forEach(evt => el.addEventListener(evt, handler));
    dirtyHandlersRef.current.set(el, handler);
  }

  function unbindDirtyGuards(el) {
    if (!el) return;
    const handler = dirtyHandlersRef.current.get(el);
    if (!handler) return;
    ["input", "blur", "paste", "keydown"].forEach(evt => el.removeEventListener(evt, handler));
    dirtyHandlersRef.current.delete(el);
  }

  function resetPageFromSource(idx) {
    const el = contentRefs.current[idx];
    if (!el) return;
    dirtyRef.current.delete(idx);
    hydratedOnceRef.current.delete(idx);
    const nextHtml = markdownToHtml(pages[idx] || "");
    if (el.innerHTML !== nextHtml) el.innerHTML = nextHtml;
    hydratedOnceRef.current.add(idx);
  }







  React.useEffect(() => {
    if (!pages?.length) return;
    const opts = { root: null, rootMargin: "0px 0px -50% 0px", threshold: 0.1 };
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.dataset?.page) {
        onPageInView(Number(visible.target.dataset.page));
      }
    }, opts);

    pageRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [pages, onPageInView]);
  React.useEffect(() => {
    if (!editable) return;

    contentRefs.current.forEach((el, idx) => {
      if (!el) return;

      bindDirtyGuards(el, idx);

      if (dirtyRef.current.has(idx)) return;

      const already = hydratedOnceRef.current.has(idx);
      const nextHtml = markdownToHtml(pages[idx] || "");

      if (!already) {
        if (el.innerHTML !== nextHtml) el.innerHTML = nextHtml;
        hydratedOnceRef.current.add(idx);
        return;
      }

      if (el.innerHTML !== nextHtml) {
        el.innerHTML = nextHtml;
      }
    });

    return () => {
      contentRefs.current.forEach(el => unbindDirtyGuards(el));
    };
  }, [editable, pages]);



  React.useEffect(() => {
    if (!collectEditedHTMLRef) return;
    collectEditedHTMLRef.current = () => {
      try {
        if (editable && contentRefs.current?.length) {
          return contentRefs.current.map((el) => (el ? el.innerHTML || "" : ""));
        }
        return (pages || []).slice();
      } catch (e) {
        console.warn("collectEditedHTML failed:", e);
        return (pages || []).slice();
      }
    };

    // ✅ capture baseline once (first time pages render in this mount)
    try {
      if (collectEditedHTMLRef.current && !collectEditedHTMLRef.current.__initial) {
        if (editable && contentRefs.current?.length) {
          collectEditedHTMLRef.current.__initial = contentRefs.current.map((el) => (el ? el.innerHTML || "" : ""));
        } else {
          collectEditedHTMLRef.current.__initial = (pages || []).slice();
        }
      }
    } catch { }

    return () => {
      if (collectEditedHTMLRef) collectEditedHTMLRef.current = null;
    };
  }, [editable, pages, collectEditedHTMLRef]);


  return (
    <div data-docview style={{ padding: "12px 0 24px", background: "transparent" }}>

      {bgImg ? (
        <style>{`
        .doc-sheet .tbm-page { background-color: transparent !important; }
        .doc-sheet .tbm-body { background-color: transparent !important; }
      `}</style>
      ) : null}
      {imageUrl ? (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div
            style={{
              width: pageWidth,
              aspectRatio: "210 / 297",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              overflow: "hidden",
              background: "#fff",
              boxShadow:
                "0 4px 10px rgba(0,0,0,.06), 0 20px 40px rgba(0,0,0,.04)",
            }}
          >
            <img
              src={imageUrl}
              alt="Top A4 Image"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                cursor: "zoom-in",
              }}
              onClick={() => onImageClick(imageUrl)}
            />
          </div>
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        {pages.map((page, i) => (
          <div
            key={i}
            className="doc-sheet"
            id={`page-${i + 1}`}
            data-page={i + 1}
            ref={(el) => (pageRefs.current[i] = el)}
            style={{
              width: pageWidth,
              minHeight: pageMinHeight,
              backgroundColor: (theme?.page_bg_image ? "transparent" : pageBg),
              outline: editable && selectedPage === i + 1 ? "2px solid #2563eb" : "none",
              outlineOffset: 0,
              ...(theme?.page_bg_image && (bgScope === "all" || i === 0)
                ? (bgDisabledPages?.has?.(i)
                  ? { backgroundImage: "none" }
                  : {
                    backgroundImage: `url("${theme.page_bg_image}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  })
                : {
                  backgroundImage: "none",
                }),
              color: textCol,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 4px 10px rgba(0,0,0,.06), 0 20px 40px rgba(0,0,0,.04)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={() => {
              if (editable) onSelectPage(i + 1);
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", backgroundColor: bgImg ? "transparent" : pageBg }}>
              {accent ? <div style={{ height: 4, background: accent }} /> : null}
              {accent2 ? <div style={{ height: 4, background: accent2 }} /> : null}
              {editable && selectedPage === i + 1 ? (
                <div style={{
                  position: "absolute", top: 6, right: 10, zIndex: 1,
                  background: "#2563eb", color: "#fff", borderRadius: 8, padding: "2px 8px", fontSize: 12, fontWeight: 700
                }}>
                  Selected
                </div>
              ) : null}
              {headHTML ? (
                <div
                  style={{ overflow: "hidden", lineHeight: 0 }}
                  dangerouslySetInnerHTML={{
                    __html: renderTemplate(headHTML, {
                      page: i + 1,
                      total: pages.length,
                      unit: getMetaFromPage(page, "unit"),
                      className: getMetaFromPage(page, "class"),
                      date: new Date().toLocaleDateString(),
                    }),
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 14px",
                    borderBottom: "1px solid #e5e7eb",
                    color: textCol,
                    backgroundColor: pageBg,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <span>{getMetaFromPage(page, "unit") || "—"}</span>
                  <span>
                    Page {i + 1} / {pages.length}
                  </span>
                </div>
              )}
            </div>
            <div
              ref={(el) => (contentRefs.current[i] = el)}
              data-editable={editable ? "true" : "false"}
              contentEditable={editable}
              suppressContentEditableWarning
              style={{
                flex: 1,
                padding: "22px 28px",
                fontSize,
                lineHeight: 1.7,
                color: textCol,
                backgroundColor: theme?.page_bg_image ? "transparent" : bodyBg,
                ...(theme?.page_bg_image ? {} : {
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(0,0,0,0.02) 31px, rgba(0,0,0,0.02) 32px)"
                }),
              }}
              onMouseDown={(e) => {
                if (editable) e.currentTarget.focus();
              }}
              onClick={(e) => {
                if (editable) return;
                const t = e.target;
                if (t && t.tagName === "IMG") {
                  const src = t.getAttribute("src");
                  if (src) onImageClick(src);
                }
              }}
            >
              {!editable ? <TextFormat data={page} /> : null}
            </div>


            <div style={{ display: "flex", flexDirection: "column", backgroundColor: pageBg }}>
              {footHTML ? (
                <div
                  style={{ overflow: "hidden", lineHeight: 0 }}
                  dangerouslySetInnerHTML={{
                    __html: renderTemplate(footHTML, {
                      page: i + 1,
                      total: pages.length,
                      unit: getMetaFromPage(page, "unit"),
                      className: getMetaFromPage(page, "class"),
                      date: new Date().toLocaleDateString(),
                    }),
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 14px",
                    borderTop: "1px solid #e5e7eb",
                    color: textCol,
                    backgroundColor: bgImg ? "transparent" : pageBg,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <span>{getMetaFromPage(page, "unit") || "—"}</span>
                  <span>
                    Page {i + 1} / {pages.length}
                  </span>
                  <span>{getMetaFromPage(page, "class") || "—"}</span>
                </div>
              )}

              {accent2 ? <div style={{ height: 4, background: accent2 }} /> : null}
              {accent ? <div style={{ height: 4, background: accent }} /> : null}
            </div>
          </div>
        ))}
      </div>

      <style>{`
[data-editable="true"] img, .doc-sheet img { cursor: zoom-in; }

@media (max-width: 768px) {
  div[data-docview] { padding: 8px 0 16px; }
}
  .doc-sheet { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
@media print {
  body { background: #fff !important; }
  * { box-shadow: none !important; }
  .doc-sheet {
    page-break-after: always;
    border: none !important;
    border-radius: 0 !important;
    width: auto !important;
    min-height: auto !important;
    box-shadow: none !important;
    background-color: #ffffff !important;
    color: #000000 !important;
  }
}
`}</style>
    </div>
  );
}

/* ===========================
   Page Component
=========================== */
export default function BookDetailsPage() {
  const { id } = useParams();
  const bookId = Number(id);

  const [book, setBook] = React.useState(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [zoomSrc, setZoomSrc] = React.useState("");
  const themeKeys = React.useMemo(() => Object.keys(pageThemes || {}), []);
  const [selectedThemeKey, setSelectedThemeKey] = React.useState(
    themeKeys[0] || "theme1"
  );
  const currentTheme = pageThemes?.[selectedThemeKey] || null;
  const [pageBgImage, setPageBgImage] = React.useState("");
  const [bgScope, setBgScope] = React.useState("all");
  const [showThemePanel, setShowThemePanel] = React.useState(false);
  const [showEditorPanel, setShowEditorPanel] = React.useState(false);
  const [selectedPage, setSelectedPage] = React.useState(null);
  const [bgDisabledPages, setBgDisabledPages] = React.useState(new Set());
  const collectEditedHTMLRef = React.useRef(null);
  const tocRef = React.useRef(null);
  const [contentIds, setContentIds] = React.useState([]);
  const [primaryContentId, setPrimaryContentId] = React.useState(null);

  const [topImageUrl, setTopImageUrl] = React.useState("");

  const [apply, setApply] = React.useState({
    page_bg: true,
    text: true,
    accent: true,
    accent2: true,
  });

  const [custom, setCustom] = React.useState({
    page_bg: "",
    text: "",
    accent: "",
    accent2: "",
  });

  const [svgColorMap, setSvgColorMap] = React.useState({});

  React.useEffect(() => {
    if (!currentTheme) return;
    const src = (currentTheme.header || "") + "\n" + (currentTheme.footer || "");
    const found = extractHexColorsFromHTML(src);
    const init = {};
    found.forEach((c) => (init[c] = c));
    setSvgColorMap(init);
  }, [currentTheme]);

  const effectiveTheme = React.useMemo(() => {
    if (!currentTheme) return null;
    const defaults = {
      page_bg: "#f8fafc",
      text: "#0f172a",
      accent: undefined,
      accent2: undefined,
    };

    const pageBG = apply.page_bg
      ? custom.page_bg || currentTheme.page_bg
      : defaults.page_bg;
    const text = apply.text ? custom.text || currentTheme.text : defaults.text;
    const accent = apply.accent
      ? custom.accent || currentTheme.accent
      : defaults.accent;
    const accent2 = apply.accent2
      ? custom.accent2 || currentTheme.accent2
      : defaults.accent2;

    const baseMap = {};
    if (currentTheme.page_bg) baseMap[currentTheme.page_bg] = pageBG;
    if (currentTheme.text) baseMap[currentTheme.text] = text;
    if (currentTheme.accent && accent) baseMap[currentTheme.accent] = accent;
    if (currentTheme.accent2 && accent2) baseMap[currentTheme.accent2] = accent2;

    const recoloredHeaderBase = replaceHexColors(currentTheme.header || "", baseMap);
    const recoloredFooterBase = replaceHexColors(currentTheme.footer || "", baseMap);

    const finalHeader = replaceHexColors(recoloredHeaderBase, svgColorMap);
    const finalFooter = replaceHexColors(recoloredFooterBase, svgColorMap);

    return {
      id: currentTheme.id,
      page_bg: pageBG,
      body_bg: pageBG,
      text,
      accent,
      accent2,
      header: finalHeader,
      footer: finalFooter,
      page_bg_image: pageBgImage || undefined,
    };
  }, [currentTheme, apply, custom, svgColorMap, pageBgImage]);
  const handleApplyBgUrl = React.useCallback((url) => {
    setPageBgImage(url);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch { }
  }, []);

  React.useEffect(() => {
    return () => {
      if (topImageUrl && topImageUrl.startsWith("blob:")) {
        try { URL.revokeObjectURL(topImageUrl); } catch { }
      }
    };
  }, [topImageUrl]);

  const handlePickImage = React.useCallback((file) => {
    const url = URL.createObjectURL(file);
    setTopImageUrl((prev) => {
      if (prev && prev.startsWith("blob:")) {
        try { URL.revokeObjectURL(prev); } catch { }
      }
      return url;
    });
  }, []);

  const handlePickImageUrl = React.useCallback((url) => {
    setTopImageUrl((prev) => {
      if (prev && prev.startsWith("blob:")) {
        try { URL.revokeObjectURL(prev); } catch { }
      }
      return url;
    });
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch { }
  }, []);

  const pages = React.useMemo(
    () => bookToPagesWithTheme(book, effectiveTheme),
    [book, effectiveTheme]
  );



  React.useEffect(() => {
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const res = await jfetch(`/api/books/${bookId}/`);
        if (!mounted) return;

        const B = res?.data ?? res;
        setBook(B ?? null);
        setError("");

        const all = collectAllContentIdsFromBook(B);
        setContentIds(all); // array of strings
        console.groupCollapsed("[CID] all content ids (payload)");
        console.table(all);
        console.groupEnd();
      } catch (e) {
        if (!mounted) return;
        console.error("Book load failed:", e);
        setError(e?.message || "Failed to load book");
        setBook(null);
        setContentIds([]);
      } finally {
        if (mounted) setLoading(false); // 🔥 IMPORTANT: loading off
      }
    })();

    return () => { mounted = false; };
  }, [bookId]);


  React.useEffect(() => {
    (async () => {
      if (!book) return;
      if (Array.isArray(contentIds) && contentIds.length) return;
      try {
        const ids = await resolveAllContentIds({ bookId, book }); // <-- हमारा helper
        console.log("[CID] resolved fallback →", ids);
        setContentIds(ids);
      } catch (e) {
        console.warn("Could not resolve content ids:", e?.message || e);
      }
    })();
  }, [book, contentIds?.length, bookId]);


  React.useEffect(() => {
    if (contentIds) console.log("[CID] state →", contentIds);
  }, [contentIds]);
  const pageIndex = React.useMemo(() => {
    return (pages || []).map((p, i) => {
      const meta = readMeta(p);
      return { page: i + 1, ...meta };
    });
  }, [pages]);

  const groupedTOC = React.useMemo(() => {
    const map = new Map();
    pageIndex.forEach(({ page, unit, title }) => {
      const uKey = unit || "Untitled Unit";
      if (!map.has(uKey)) map.set(uKey, new Map());
      const L = map.get(uKey);
      const lKey = title || "Page";
      if (!L.has(lKey)) L.set(lKey, page);
    });
    return Array.from(map.entries()).map(([unitTitle, lessonsMap]) => ({
      unit: unitTitle,
      lessons: Array.from(lessonsMap.entries()).map(([title, firstPage]) => ({
        title,
        firstPage,
      })),
    }));
  }, [pageIndex]);

  const [currentPage, setCurrentPage] = React.useState(1);

  const activePointer = React.useMemo(() => {
    let active = { unit: "", title: "", firstPage: 1 };
    groupedTOC.forEach((u) => {
      u.lessons.forEach((l) => {
        if (l.firstPage <= currentPage) {
          if (!active.title || l.firstPage >= (active.firstPage || 0)) {
            active = { ...l, unit: u.unit };
          }
        }
      });
    });
    return active;
  }, [groupedTOC, currentPage]);

  React.useEffect(() => {
    const id = activePointer?.firstPage ? `toc-${activePointer.firstPage}` : "";
    const el = id ? document.getElementById(id) : null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [activePointer]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc" }}>
        <div style={{ color: "#1f2937", fontWeight: 600 }}>Loading book…</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0B0D10", color: "#fff" }}>
        <div>
          <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{error || "Book not found"}</p>
          <Link href="/books" style={{ color: "#34d399", textDecoration: "underline" }}>
            Back to all books
          </Link>
        </div>
      </div>
    );
  }

  const containerStyle = {
    minHeight: "100vh",
    color: "#0f172a",
    background: "#f8fafc",
    transition: "all 0.3s ease",
  };





















  /* =========================
     BOOK CONTENT SAVE HELPERS
     ========================= */

  /* ---- Content ID helpers ---- */
  function pickId(v) {
    if (v == null) return null;
    if (typeof v === "string" || typeof v === "number") return String(v);
    if (typeof v === "object")
      return v?.id ?? v?.content?.id ?? v?.pk ?? v?.uuid ?? null;
    return null;
  }

  function collectAllContentIdsFromBook(book) {
    const out = [];
    const seen = new Set();
    const push = (val) => {
      const id = pickId(val);
      if (id && !seen.has(id)) { seen.add(id); out.push(id); }
    };

    if (!book) return out;

    // direct/common
    push(book?.content);
    push(book?.content?.id);
    push(book?.content_id);
    push(book?.primary_content_id);
    if (Array.isArray(book?.contents)) book.contents.forEach(push);
    push(book?.syllabus?.content);

    // syllabus.units -> lessons -> contents
    if (Array.isArray(book?.syllabus?.units)) {
      for (const u of book.syllabus.units) {
        const lessons = Array.isArray(u?.lessons) ? u.lessons : [];
        for (const l of lessons) {
          const c = l?.contents;
          if (Array.isArray(c)) c.forEach(push);
          else push(c);
        }
      }
    }

    // legacy units -> lessons -> contents
    if (Array.isArray(book?.units)) {
      for (const u of book.units) {
        const lessons = Array.isArray(u?.lessons) ? u.lessons : [];
        for (const l of lessons) {
          const c = l?.contents;
          if (Array.isArray(c)) c.forEach(push);
          else push(c);
        }
      }
    }

    return out;
  }

  async function resolveAllContentIds({ bookId, book }) {
    if (book) return collectAllContentIdsFromBook(book);
    const r = await jfetch(`/api/books/${encodeURIComponent(bookId)}/`);
    const B = r?.data ?? r;
    return collectAllContentIdsFromBook(B);
  }

  function normalizeText(s = "") {
    return String(s || "")
      .replace(/\r\n/g, "\n")
      .replace(/\u00A0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  /* ---- URL utils (robust base + join) ---- */
  const RAW_API_BASE =
    (typeof API_BASE !== "undefined" && API_BASE) ||
    (typeof process !== "undefined" && process?.env?.NEXT_PUBLIC_API_BASE) ||
    "";

  function normalizeBase(base) {
    let b = String(base || "").trim();
    b = b.replace(/^https\/\//i, "https://").replace(/^http\/\//i, "http://");
    if (!/^https?:\/\//i.test(b)) {
      b = "https://" + b.replace(/^\/+/, "");
    }
    b = b.replace(/\/+$/, "");
    return b;
  }
  const ABS_API_BASE = normalizeBase(RAW_API_BASE);

  function isAbsoluteUrl(u = "") {
    return /^https?:\/\//i.test(u);
  }
  function joinUrl(base, path) {
    const b = String(base || "").replace(/\/+$/, "");
    const p = String(path || "").trim();
    if (!p) return b;
    if (isAbsoluteUrl(p)) return p;
    if (!p.startsWith("/")) return `${b}/${p}`;
    return `${b}${p}`;
  }

  /* ---- Build {id -> {text, lesson?}} from loaded book if possible ---- */
  function extractBookContentTextMap(book) {
    const map = {};
    const push = (cid, obj) => {
      const id = pickId(cid);
      if (!id) return;
      const text = obj?.text ?? obj?.content_text ?? obj?.body ?? obj?.markdown ?? "";
      const lesson = obj?.lesson ?? obj?.lesson_id ?? obj?.lessonId;
      if (map[id] == null) map[id] = { text: String(text || ""), lesson };
    };

    // Common places
    if (book?.content) push(book.content?.id ?? book.content, book.content);
    if (Array.isArray(book?.contents)) {
      for (const c of book.contents) push(c?.id ?? c, c);
    }

    // New syllabus model
    const units = Array.isArray(book?.syllabus?.units) ? book.syllabus.units : [];
    for (const u of units) {
      const lessons = Array.isArray(u?.lessons) ? u.lessons : [];
      for (const l of lessons) {
        const cs = Array.isArray(l?.contents) ? l.contents : (l?.contents ? [l.contents] : []);
        for (const c of cs) push(c?.id ?? c, { ...c, lesson: l?.id ?? l?.lesson_id });
      }
    }

    // Legacy units
    const legacyUnits = Array.isArray(book?.units) ? book.units : [];
    for (const u of legacyUnits) {
      const lessons = Array.isArray(u?.lessons) ? u.lessons : [];
      for (const l of lessons) {
        const cs = Array.isArray(l?.contents) ? l.contents : (l?.contents ? [l?.contents] : []);
        for (const c of cs) push(c?.id ?? c, { ...c, lesson: l?.id ?? l?.lesson_id });
      }
    }

    return map;
  }

  /* ---- Fetch {id -> {text, lesson?}} from API (bulk + fallback) ---- */
  async function fetchExistingContentTextMap(ids = []) {
    const out = {};
    if (!ids.length) return out;

    try {
      const bulkUrl = `${API_BASE}/api/contents/bulk/?ids=${ids.map(encodeURIComponent).join(",")}`;
      const bulkRes = await jfetch(bulkUrl);
      const list = bulkRes?.data ?? bulkRes ?? [];
      if (Array.isArray(list) && list.length) {
        for (const c of list) {
          const id = String(c?.id ?? "");
          if (!id) continue;
          const text = c?.text ?? c?.content_text ?? c?.body ?? c?.markdown ?? "";
          const lesson = c?.lesson ?? c?.lesson_id ?? c?.lessonId;
          out[id] = { text: String(text || ""), lesson };
        }
        return out;
      }
    } catch (e) {
      console.warn("[bulk fetchExisting] failed, will try sequential. Msg:", e?.message || e);
    }

    const BATCH = 10;
    for (let i = 0; i < ids.length; i += BATCH) {
      const slice = ids.slice(i, i + BATCH);
      await Promise.all(slice.map(async (id) => {
        try {
          const r = await jfetch(`${API_BASE}/api/contents/${encodeURIComponent(String(id))}/`);
          const c = r?.data ?? r ?? {};
          const text = c?.text ?? c?.content_text ?? c?.body ?? c?.markdown ?? "";
          const lesson = c?.lesson ?? c?.lesson_id ?? c?.lessonId;
          out[String(id)] = { text: String(text || ""), lesson };
        } catch (e) {
          console.warn("[fetch content] id", id, "failed:", e?.message || e);
        }
      }));
    }
    return out;
  }

  function htmlToMarkdown(html = "") {
    if (!html || typeof html !== "string") return "";

    let s = html;

    s = s.replace(/<br\s*\/?>/gi, "\n");
    s = s.replace(/<\/p>\s*/gi, "\n\n").replace(/<p[^>]*>/gi, "");

    s = s.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `# ${t}\n\n`);
    s = s.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `## ${t}\n\n`);
    s = s.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `### ${t}\n\n`);
    s = s.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `#### ${t}\n\n`);
    s = s.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (_, t) => `##### ${t}\n\n`);
    s = s.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, (_, t) => `###### ${t}\n\n`);

    s = s.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**");
    s = s.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**");
    s = s.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "_$1_");
    s = s.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "_$1_");
    s = s.replace(/<u[^>]*>([\s\S]*?)<\/u>/gi, "$1");

    s = s.replace(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi, (_, src) => `\n\n![](${src})\n\n`);

    s = s.replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => `[${text}](${href})`);

    s = s.replace(/<\/li>\s*<\/ul>/gi, "</li>\n</ul>");
    s = s.replace(/<ul[^>]*>\s*/gi, "\n");
    s = s.replace(/<li[^>]*>\s*/gi, "- ");
    s = s.replace(/<\/li>/gi, "\n");
    s = s.replace(/<\/ul>/gi, "\n");

    s = s.replace(/<\/?div[^>]*>/gi, "\n");
    s = s.replace(/<\/?span[^>]*>/gi, "");
    s = s.replace(/<\/?section[^>]*>/gi, "\n");

    s = s.replace(/<\/?[^>]+>/g, "");

    s = s.replace(/\n{3,}/g, "\n\n");

    return s.trim();
  }

  function mapEditedPagesToIds(editedHtmlPages = [], ids = [], WANT_MARKDOWN = true) {
    const map = {};
    const n = Math.min(editedHtmlPages.length, ids.length);
    for (let i = 0; i < n; i++) {
      const id = String(ids[i]);
      const html = String(editedHtmlPages[i] ?? "");
      const text = WANT_MARKDOWN ? htmlToMarkdown(html) : html; // NO HTML in payload
      map[id] = normalizeText(text);
    }
    return map;
  }
  /* ============
     SAVE (PATCH)
     ============ */




  // ----- Pretty printer for logs -----

  function headersToObject(h) {
    const out = {};
    try { for (const [k, v] of h.entries()) out[k] = v; } catch { }
    return out;
  }

  // ----- Request with FULL logging (request + response) -----
  async function requestWithLog(url, { method = "PATCH", bodyObj = null, headers = {}, credentials = "include" } = {}) {
    const reqHeaders = { "Content-Type": "application/json", ...headers };
    const body = bodyObj != null ? JSON.stringify(bodyObj) : undefined;

    const startedAt = performance.now();
    console.log("[HTTP] ▶️ request", { method, url, headers: reqHeaders, body: bodyObj });

    let resp;
    try {
      resp = await fetch(url, { method, headers: reqHeaders, body, credentials });
    } catch (e) {
      const ms = Math.round(performance.now() - startedAt);
      console.error("[HTTP] ❌ network error", { method, url, ms, error: e?.message || String(e) });
      throw e;
    }

    const ms = Math.round(performance.now() - startedAt);
    let text = "";
    try { text = await resp.text(); } catch { }

    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch { /* not JSON */ }

    const headObj = headersToObject(resp.headers);

    const logPayload = {
      method,
      url,
      status: resp.status,
      ok: resp.ok,
      duration_ms: ms,
      response_headers: headObj,
      response_body: json ?? text,
    };

    if (resp.ok) {
      console.log("[HTTP] ✅ response", logPayload);
    } else {
      console.warn("[HTTP] ⚠️ response (non-2xx)", logPayload);
    }

    return { ok: resp.ok, status: resp.status, headers: headObj, json, text, duration_ms: ms };
  }

  async function handleSaveEditedPages() {
    const WANT_MARKDOWN = true;

    let ids = Array.isArray(contentIds) ? contentIds.slice() : [];
    if (!ids.length) ids = await resolveAllContentIds({ bookId, book });
    ids = Array.from(new Set(ids.filter(Boolean))).map(String);
    if (!ids.length) {
      alert("No content ids available to save.");
      return;
    }

    const rawPages = typeof collectEditedHTMLRef?.current === "function"
      ? collectEditedHTMLRef.current()
      : (pages || []);
    if (!Array.isArray(rawPages) || !rawPages.length) {
      alert("No edited pages found.");
      return;
    }

    const editedHTML = Array.isArray(rawPages) ? rawPages : [];
    const baselineHTML =
      (collectEditedHTMLRef?.current && collectEditedHTMLRef.current.__initial) ||
      (pages || []);

    const toNorm = (h) =>
      normalizeText(WANT_MARKDOWN ? htmlToMarkdown(String(h || "")) : String(h || ""));

    let dirtyIdx = [];
    if (Array.isArray(editedHTML) && Array.isArray(baselineHTML) && baselineHTML.length) {
      const N = Math.min(editedHTML.length, baselineHTML.length, ids.length);
      for (let i = 0; i < N; i++) {
        if (toNorm(editedHTML[i]) !== toNorm(baselineHTML[i])) dirtyIdx.push(i);
      }
    } else {
      dirtyIdx = editedHTML.map((_, i) => i).slice(0, ids.length);
    }

    if (!dirtyIdx.length) {
      console.info("[DIRTY] No real edits — abort.");
      alert("Nothing changed — no updates needed.");
      return;
    }

    let existingMap = extractBookContentTextMap(book);
    const missing = ids.filter((id) => existingMap[id] == null);
    if (missing.length) {
      const fetched = await fetchExistingContentTextMap(missing);
      existingMap = { ...existingMap, ...fetched };
    }

    const changes = [];
    for (const i of dirtyIdx) {
      const id = ids[i];
      const beforeApi = normalizeText(existingMap[id]?.text || "");
      const afterUser = toNorm(editedHTML[i]);
      if (afterUser !== beforeApi) {
        changes.push({ id, payload: { text: afterUser } });
      }
    }

    if (!changes.length) {
      console.info("[DIFF] Dirty vs baseline था, पर API text already match — nothing to send.");
      alert("Nothing changed — already up to date.");
      return;
    }

    console.log("[DIFF] Mismatched Content IDs:", changes.map(c => c.id));

    const patchResults = [];   // [{ id, sent, server, status, ok, ms }]

    const errors = [];
    for (const { id, payload } of changes) {
      const path = `/api/contents/${encodeURIComponent(String(id))}/`;
      const url = joinUrl(ABS_API_BASE, path);

      console.groupCollapsed(`[PATCH] id=${id}`);
      console.log("url:", url);
      console.log("payload (sent):", payload);

      // Replace the whole try/catch pair with a single always-logged request:
      try {
        const url = joinUrl(ABS_API_BASE, path);     // ABS url pakka
        const resp = await requestWithLog(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          bodyObj: payload,    // wrapper hi stringify karega
        });

        // response ko json prefer karo, warna raw text
        const server = (resp && (resp.json ?? resp.text)) ?? null;

        console.log("[HTTP] meta:", {
          status: resp.status, ok: resp.ok, ms: resp.duration_ms, url   // <- local `url` var from above
        });

        console.log("[PATCH] payload (sent):", payload);
        console.log("[PATCH] response (full):\n", JSON.stringify(server, null, 2));

        if (!resp.ok) {
          throw new Error(`[${resp.status}] ${JSON.stringify(server)}`);
        }

        patchResults.push({
          id: server?.id ?? id,
          ok: resp.ok,
          status: resp.status,
          ms: resp.duration_ms,
          sent: payload,
          server,
        });
      } catch (e) {
        console.error(`[PATCH] id=${id} failed:`, e?.message || e);
        errors.push({ id, error: e?.message || String(e) });
      } finally {
        console.groupEnd();
      }

    }

    // nice post-summary
    if (patchResults.length) {
      console.groupCollapsed("[PATCH] summary table");
      console.table(
        patchResults.map(r => ({
          id: r.id,
          status: r.status,
          ok: r.ok,
          ms: r.ms,
          text_len: (r.server?.text || "").length,
          updated_at: r.server?.updated_at,
          lesson: r.server?.lesson,
        }))
      );
      console.groupEnd();
    }



    if (errors.length) {
      alert(`Saved with some errors ❗\n` + errors.map(e => `id=${e.id}: ${e.error}`).join("\n"));
    } else {
      // ✅ refresh baseline so subsequent saves don't re-diff same content
      if (collectEditedHTMLRef?.current) {
        try {
          collectEditedHTMLRef.current.__initial = editedHTML.slice();
        } catch { }
      }
      alert(`Saved successfully ✅ (${changes.length} item${changes.length > 1 ? "s" : ""} updated)`);
    }
  }




  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>{book.title}</h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => {
                setShowThemePanel((s) => !s);
                setShowEditorPanel(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              title="Theme"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 36,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                padding: "0 12px",
                background: "#fff",
                color: "#0f172a",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              <span role="img" aria-label="palette">🎨</span>
              <span>
                {selectedThemeKey} — {effectiveTheme?.id || "theme"}
              </span>
            </button>

            <button
              onClick={() => {
                setShowEditorPanel((s) => !s);
                setShowThemePanel(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              title="Edit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 36,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                padding: "0 12px",
                background: "#fff",
                color: "#0f172a",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              <span role="img" aria-label="edit">✏️</span>
              <span>{showEditorPanel ? "Close Edit" : "Edit"}</span>
            </button>

            {showEditorPanel ? (
              <
                >


                <button
                  onClick={() => {
                    if (selectedPage == null) return;
                    setBgDisabledPages((prev) => {
                      const s = new Set(prev);
                      s.add(selectedPage - 1); // store 0-based
                      return s;
                    });
                  }}
                  disabled={selectedPage == null}
                  style={{
                    height: 32,
                    padding: "0 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    background: "#fff",
                    fontWeight: 600,
                    cursor: selectedPage != null ? "pointer" : "not-allowed",
                  }}
                  title="Remove background image on this page only"
                >
                  Remove BG (this page)
                </button>
                <button
                  onClick={handleSaveEditedPages}
                  style={{
                    height: 32,
                    padding: "0 12px",
                    border: "1px solid #10b981",
                    borderRadius: 8,
                    background: "#10b981",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  title="Save edited pages"
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    if (selectedPage == null) return;
                    setBgDisabledPages((prev) => {
                      const s = new Set(prev);
                      s.delete(selectedPage - 1);
                      return s;
                    });
                  }}
                  disabled={selectedPage == null}
                  style={{
                    height: 32,
                    padding: "0 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    background: "#fff",
                    fontWeight: 600,
                    cursor: selectedPage != null ? "pointer" : "not-allowed",
                  }}
                  title="Restore background image on this page"
                >
                  Restore BG (this page)
                </button>
              </>
            ) : null}

          </div>
        </div>




        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: 16,
            alignItems: "start",
          }}
        >
          {showEditorPanel ? (
            <EditorPanel onClose={() => setShowEditorPanel(false)} />
          ) : showThemePanel ? (
            <ThemePanel
              selectedThemeKey={selectedThemeKey}
              setSelectedThemeKey={setSelectedThemeKey}
              themeKeys={themeKeys}
              pageThemes={pageThemes}
              effectiveTheme={effectiveTheme}
              onApplyBackgroundUrl={handleApplyBgUrl}
              apply={apply}
              setApply={setApply}
              custom={custom}
              setCustom={setCustom}
              svgColorMap={svgColorMap}
              setSvgColorMap={setSvgColorMap}
              onClose={() => setShowThemePanel(false)}
              onPickImage={handlePickImage}
              onPickImageUrl={handlePickImageUrl}   // NEW
              wmDefault={(book?.title || "TBM+").toUpperCase()} // NEW default watermark text
              bgScope={bgScope}
              setBgScope={setBgScope}
            />
          ) : (
            <>
              <aside
                ref={tocRef}
                style={{
                  position: "sticky",
                  top: 16,
                  alignSelf: "start",
                  height: "calc(100vh - 32px)",
                  overflow: "auto",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  background: "#fff",
                  padding: 12,
                }}
              >
                <div style={{ display: "grid", gap: 8 }}>
                  {(() => {
                    const pageIndexLocal = (pages || []).map((p, i) => ({
                      page: i + 1,
                      ...readMeta(p),
                    }));

                    const map = new Map();
                    pageIndexLocal.forEach(({ page, unit, title }) => {
                      const uKey = unit || "Untitled Unit";
                      if (!map.has(uKey)) map.set(uKey, new Map());
                      const L = map.get(uKey);
                      const lKey = title || "Page";
                      if (!L.has(lKey)) L.set(lKey, page);
                    });

                    const grouped = Array.from(map.entries()).map(([unitTitle, lessonsMap]) => ({
                      unit: unitTitle,
                      lessons: Array.from(lessonsMap.entries()).map(([title, firstPage]) => ({
                        title,
                        firstPage,
                      })),
                    }));

                    const isGenericTitle = (t) => {
                      const s = String(t || "").trim();
                      if (!s) return true;
                      const low = s.toLowerCase();
                      if (low === "page" || low === "pages") return true;
                      if (/^page\s*\d*$/i.test(s)) return true;
                      if (low === "contents" || low === "table of contents") return true;
                      return false;
                    };

                    return grouped
                      .filter((u) => String(u.unit || "").trim().toLowerCase() !== "contents")
                      .map((u) => {
                        const seen = new Set();
                        const filtered = u.lessons
                          .slice()
                          .sort((a, b) => a.firstPage - b.firstPage)
                          .filter((l) => l.firstPage > 2)
                          .filter((l) => !isGenericTitle(l.title))
                          .filter((l) => {
                            const key = String(l.title || "").trim().toLowerCase();
                            if (!key) return false;
                            if (seen.has(key)) return false;
                            seen.add(key);
                            return true;
                          });

                        if (!filtered.length) return null;

                        return (
                          <div key={u.unit}>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: 13,
                                color: "#111827",
                                marginBottom: 6,
                              }}
                            >
                              {u.unit || "Unit"}
                            </div>

                            <div style={{ display: "grid", gap: 4 }}>
                              {filtered.map((l) => {
                                const isActive = currentPage === l.firstPage;

                                const handleClick = (e) => {
                                  e.preventDefault();
                                  const targetId = `page-${l.firstPage}`;
                                  setCurrentPage(l.firstPage);
                                  const doScroll = () => {
                                    const el = document.getElementById(targetId);
                                    if (el) {
                                      el.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                        inline: "nearest",
                                      });
                                    }
                                  };
                                  requestAnimationFrame(doScroll);
                                  setTimeout(doScroll, 0);
                                };

                                return (
                                  <button
                                    type="button"
                                    id={`toc-${l.firstPage}`}
                                    key={u.unit + "::" + l.title}
                                    onClick={handleClick}
                                    title={l.title ? l.title : `Go to page ${l.firstPage}`}
                                    style={{
                                      textAlign: "left",
                                      cursor: "pointer",
                                      fontSize: 12,
                                      border: `1px solid ${isActive ? (effectiveTheme?.accent || "#2563eb") : "#e5e7eb"
                                        }`,
                                      borderLeft: `6px solid ${isActive ? (effectiveTheme?.accent || "#2563eb") : "#3333ff"
                                        }`,
                                      borderRadius: 10,
                                      padding: "10px 12px",
                                      background: isActive ? "rgba(37,99,235,0.07)" : "#fff",
                                      color: isActive ? "#0f172a" : "#334155",
                                      boxShadow: isActive ? "0 2px 8px rgba(37,99,235,.15)" : "none",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: 700,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {l.title}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      });
                  })()}
                </div>

              </aside>

              {zoomSrc ? (
                <ImageMagnifierOverlay
                  src={zoomSrc}
                  onClose={() => setZoomSrc("")}
                  initialScale={1}
                />
              ) : null}
            </>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "transform 0.3s ease",
              transformOrigin: "center top",
            }}
          >
            <DocView
              pages={pages}
              fontSize={16}
              deviceDimensions={{ width: 720, height: 520 }}
              theme={effectiveTheme}
              onPageInView={setCurrentPage}
              editable={showEditorPanel}
              imageUrl={topImageUrl}
              onImageClick={(src) => setZoomSrc(src)}
              bgScope={bgScope}
              selectedPage={selectedPage}
              onSelectPage={setSelectedPage}
              bgDisabledPages={bgDisabledPages}
              collectEditedHTMLRef={collectEditedHTMLRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}




function createWatermarkedBackgroundSVG({
  imageUrl,               // data URL of uploaded image (required)
  text = "TBM+",
  opacity = 0.12,
  gap = 220,              // distance between repeats
  size = 56,              // font size
  angle = -30,            // rotation in degrees
  fontFamily = "Inter,system-ui,Arial",
}) {
  const W = 2480, H = 3508;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
   <g transform="translate(${W / 2}, ${H / 2}) rotate(${angle})">
   <text
     x="0" y="0"
     text-anchor="middle" dominant-baseline="middle"
     font-family="${fontFamily}" font-size="${size * 6}"
     fill="#000" opacity="${opacity}" font-weight="700">
     ${escapeXml(text)}
   </text>
 </g>
    <clipPath id="full"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath>
  </defs>

  <!-- Base uploaded image -->
  <image href="${imageUrl}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" clip-path="url(#full)"/>
  <!-- Watermark layer (diagonal, repeated) -->
</svg>`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
