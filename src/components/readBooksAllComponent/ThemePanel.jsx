"use client";

import React from "react";
import toast from "react-hot-toast";

// Utils (यदि ये आपके प्रोजेक्ट में किसी shared util में हैं, तो वहीं से import कर लें)
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const hexToRgb = (hex) => {
    const h = (hex || "").replace("#", "").trim();
    const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.padEnd(6, "0").slice(0, 6);
    const n = parseInt(v, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};
const rgbToHex = ({ r, g, b }) => {
    const to = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
    return `#${to(r)}${to(g)}${to(b)}`;
};
const mix = (c1, c2, t) => {
    const a = hexToRgb(c1);
    const b = hexToRgb(c2);
    const m = { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t };
    return rgbToHex(m);
};
const lighten = (hex, t = 0.1) => mix(hex, "#ffffff", clamp01(t));
const darken = (hex, t = 0.1) => mix(hex, "#000000", clamp01(t));
const relativeLuminance = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    const srgb = [r, g, b].map((v) => v / 255).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
};
const contrastRatio = (h1, h2) => {
    const L1 = relativeLuminance(h1);
    const L2 = relativeLuminance(h2);
    const hi = Math.max(L1, L2), lo = Math.min(L1, L2);
    return (hi + 0.05) / (lo + 0.05);
};
const encodeSVG = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
const escapeXml = (s = "") =>
    String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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
    const a1 = accent || "#2563eb";
    const a2 = accent2 || lighten(a1, 0.35);

    const watermarkDef = `
    <defs>
      <pattern id="wm" width="${wmGap}" height="${wmGap}" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
        <text x="0" y="${wmSize}" font-family="Inter,system-ui,Arial" font-size="${wmSize}"
              fill="${darken(a1, 0.5)}" opacity="${wmOpacity}" font-weight="700">
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
    </defs>
  `;

    const baseRect = `<rect x="0" y="0" width="${W}" height="${H}" fill="${p0}"/>`;

    let overlay = "";
    if (style === "diagonal") {
        overlay = `
      <path d="M0,0 L${W},0 L${W},${Math.round(H * 0.26)} Q ${Math.round(W * 0.55)},${Math.round(H * 0.36)} ${Math.round(
            W * 0.35
        )},${Math.round(H * 0.24)} T 0,${Math.round(H * 0.34)} Z" fill="url(#gA)" opacity="0.95"/>
      <path d="M0,${Math.round(H * 0.70)} Q ${Math.round(W * 0.25)},${Math.round(H * 0.60)} ${Math.round(
            W * 0.55
        )},${Math.round(H * 0.72)} T ${W},${Math.round(H * 0.60)} L${W},${H} L0,${H} Z" fill="url(#gB)" opacity="0.90"/>
    `;
    } else if (style === "mesh") {
        overlay = `
      <rect x="0" y="0" width="${W}" height="${H}" fill="url(#gA)" opacity="0.08"/>
      <rect x="0" y="0" width="${W}" height="${H}" fill="url(#gB)" opacity="0.10"/>
    `;
    } else if (style === "soft-arcs") {
        overlay = `
      <path d="M0,${Math.round(H * 0.16)} Q ${Math.round(W * 0.26)},${Math.round(H * 0.04)} ${Math.round(
            W * 0.52
        )},${Math.round(H * 0.10)} T ${W},${Math.round(H * 0.07)} L${W},0 L0,0 Z" fill="${a2}" opacity="0.85"/>
      <path d="M0,${Math.round(H * 0.22)} Q ${Math.round(W * 0.30)},${Math.round(H * 0.10)} ${Math.round(
            W * 0.60
        )},${Math.round(H * 0.16)} T ${W},${Math.round(H * 0.12)} L${W},${Math.round(H * 0.07)} Q ${Math.round(
            W * 0.70
        )},${Math.round(H * 0.18)} ${Math.round(W * 0.35)},${Math.round(H * 0.11)} T 0,${Math.round(H * 0.16)} Z" fill="${a1}" opacity="0.92"/>
    `;
    } else {
        overlay = `
      <path d="M0,0 L${W},0 L${W},${Math.round(H * 0.18)} Q ${Math.round(W * 0.66)},${Math.round(H * 0.28)} ${Math.round(
            W * 0.35
        )},${Math.round(H * 0.16)} T 0,${Math.round(H * 0.22)} Z" fill="${a1}" opacity="0.95"/>
      <path d="M0,${Math.round(H * 0.20)} Q ${Math.round(W * 0.26)},${Math.round(H * 0.08)} ${Math.round(
            W * 0.52
        )},${Math.round(H * 0.16)} T ${W},${Math.round(H * 0.10)} L${W},${Math.round(H * 0.0)} L0,0 Z" fill="${a2}" opacity="0.85"/>
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

function generateBackgroundCandidates({ pageBG, accent, accent2, watermark, wmOpacity }) {
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
        .map((it) => ({
            ...it,
            score: contrastRatio(pageBG, accent) + contrastRatio(pageBG, accent2),
        }))
        .sort((a, b) => b.score - a.score);
    return ranked.slice(0, 8);
}

export default function ThemePanel({
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
    bookId,
    coverFile = null,
    savingCover = false,
    onSaveCover = () => { },
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
    const [saving, setSaving] = React.useState(false);

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

    function replaceColors(html, map) {
        if (!html || !map) return html;
        let out = html;
        const entries = Object.entries(map).sort((a, b) => b[0].length - a[0].length);
        for (const [orig, current] of entries) {
            if (!current || current.toLowerCase() === String(orig).toLowerCase()) continue;
            const safe = String(orig).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const re = new RegExp(safe, "gi");
            out = out.replace(re, current);
        }
        return out;
    }

    function buildThemeJSON() {
        const base = pageThemes?.[selectedThemeKey] || {};
        const pick = (key, def) => (apply?.[key] ? (custom?.[key] || base?.[key] || def) : base?.[key] ?? def);

        const finalAccent = pick("accent", "#2563eb");
        const finalAccent2 = pick("accent2", "#60a5fa");
        const finalText = pick("text", "#0f172a");
        const finalBG = pick("page_bg", "#ffffff");

        let header = (base?.header || "")
            .replaceAll("{{ACCENT}}", finalAccent)
            .replaceAll("{{ACCENT2}}", finalAccent2);
        let footer = (base?.footer || "")
            .replaceAll("{{ACCENT}}", finalAccent)
            .replaceAll("{{ACCENT2}}", finalAccent2);

        header = replaceColors(header, svgColorMap);
        footer = replaceColors(footer, svgColorMap);

        return {
            id: base?.id || selectedThemeKey || "untitled-theme",
            page_bg: finalBG,
            text: finalText,
            accent: finalAccent,
            accent2: finalAccent2,
            header,
            footer,
        };
    }

    async function handleSaveTheme() {
        try {
            setSaving(true);
            const theme_json = buildThemeJSON();

            // NOTE: यहां अपने API helper का इस्तेमाल करें (उदाहरण के लिए fetch/jfetch)
            const resp = await fetch(`/api/books/${bookId}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ theme_json }),
                credentials: "include",
            });

            const text = await resp.text();
            if (!resp.ok) throw new Error(text || "Save failed");
            toast.success("Theme saved to book ✅");
        } catch (err) {
            toast.error(err?.message || "Save failed");
        } finally {
            setSaving(false);
        }
    }

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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>Theme settings</div>
                <button onClick={onClose} style={smallBtn} title="Close theme panel">Close</button>
            </div>

            <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                <button
                    type="button"
                    onClick={handleSaveTheme}
                    disabled={saving}
                    style={{
                        height: 38,
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        padding: "8px 12px",
                        background: saving ? "#f1f5f9" : "#0ea5e9",
                        color: saving ? "#64748b" : "#fff",
                        cursor: saving ? "not-allowed" : "pointer",
                        fontWeight: 700,
                        justifySelf: "start",
                        minWidth: 160,
                        boxShadow: "0 1px 2px rgba(0,0,0,.06)",
                    }}
                    title="Save current theme to book"
                >
                    {saving ? "Saving..." : "Save Theme"}
                </button>
            </div>

            {/* Background uploader (all pages) */}
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
                            const wmDataUrl = buildA4Background({
                                pageBG,
                                accent: a1,
                                accent2: a2,
                                style: "waves",
                                watermark: wmText || "TBM+",
                                wmOpacity,
                                wmSize,
                                wmGap,
                            });
                            // अगर watermark disable करना हो तो dataUrl सीधे pass करें।
                            onApplyBackgroundUrl?.(wmDataUrl || dataUrl);
                        };
                        reader.readAsDataURL(file);
                        e.target.value = "";
                    }}
                    style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 }}
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
                        marginTop: 8,
                    }}
                >
                    Choose Background (all pages)
                </button>

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
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

                <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>
                    Tip: 2480×3508 (A4 @ 300 DPI) best रहेगा. SVG/data URL भी चलेगा.
                </div>
            </div>

            {/* Theme pickers */}
            <label style={{ display: "grid", gap: 6, marginBottom: 12, fontSize: 12, color: "#334155" }}>
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

            {/* Simple toggles (page_bg, text, accent, accent2) */}
            <div style={{ fontSize: 12, color: "#334155", display: "grid", gap: 12 }}>
                {["page_bg", "text", "accent", "accent2"].map((key) => {
                    const label = key.replace("_", " ");
                    const value =
                        key === "page_bg"
                            ? custom.page_bg || effectiveTheme?.page_bg || "#ffffff"
                            : key === "text"
                                ? custom.text || effectiveTheme?.text || "#0f172a"
                                : key === "accent"
                                    ? custom.accent || effectiveTheme?.accent || "#2563eb"
                                    : custom.accent2 || effectiveTheme?.accent2 || "#60a5fa";

                    return (
                        <label key={key} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <input
                                type="checkbox"
                                checked={!!apply[key]}
                                onChange={(e) => setApply((s) => ({ ...s, [key]: e.target.checked }))}
                            />
                            <span style={{ fontWeight: 700, minWidth: 140 }}>Apply {label}</span>
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
                                        background: value,
                                    }}
                                />
                                <input
                                    type="color"
                                    value={value}
                                    onChange={(e) =>
                                        setCustom((c) => ({
                                            ...c,
                                            [key]: e.target.value,
                                        }))
                                    }
                                    style={{ width: 32, height: 20, border: "none", background: "transparent", cursor: "pointer" }}
                                />
                                <button
                                    onClick={() => setCustom((c) => ({ ...c, [key]: "" }))}
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
                    )
                })}
            </div>
        </aside>
    );
}
