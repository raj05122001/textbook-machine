"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import pageThemes from "./pageThemes.json";
import TextFormat from "@/components/format/TextFormat";

const API_BASE = "https://tbmplus-backend.ultimeet.io";

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
    const summaryVal = pickFirst(it, ["content_summary", "summary", "content.content_summary"]);
    const quesVal = pickFirst(it, ["questions", "content.questions"]);
    const text = textVal ? `${String(textVal).trim()}` : "";
    const summary = summaryVal ? `#### Content Summary\n\n${String(summaryVal).trim()}` : "";

    const qRaw = normalizeQuestions(quesVal);
    const qSpaced = addOptionSpacing(qRaw);
    const questions = qSpaced ? `#### Questions\n\n${qSpaced}` : "";

    let block = [text, summary, questions].filter(Boolean).join("\n\n");

    if (!block && items.length === 1) {
      const lText = pickFirst(lesson, ["text", "generated_prompt"]);
      const lSum = pickFirst(lesson, ["content_summary", "lesson_description"]);
      const lQ = addOptionSpacing(normalizeQuestions(pickFirst(lesson, ["questions"])));
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
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
  const re = /(?:fill|stroke|stop-color)\s*[:=]\s*["']?\s*(#[0-9a-fA-F]{3,6})\b/gi;
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

  const className = pickFirst(book, ["class_name", "class", "grade", "standard"]) || "";

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

  const tocRows = units
    .map((u, ui) => {
      const uTitle = u.title || `Unit ${ui + 1}`;
      const uPages = u.number_of_pages ?? "—";
      const lessonChips = (u.lessons || [])
        .map((l, li) => {
          const num = `${ui + 1}.${li + 1}`;
          const title = l.title || `Lesson ${li + 1}`;
          return `<span style="
          display:inline-block;padding:4px 8px;margin:2px 6px 2px 0;
          border:1px solid #e5e7eb;border-radius:9999px;font-size:12px;line-height:1.1;white-space:nowrap;color:${text}
        ">${num} ${_escapeHtml(title)}</span>`;
        })
        .join("");
      return `
      <tr>
        <td style="padding:10px 12px;width:42px;color:#64748b;font-weight:600;">${ui + 1}.</td>
        <td style="padding:10px 12px;font-weight:700;color:${text};">${_escapeHtml(uTitle)}</td>
        <td style="padding:10px 12px;width:120px;text-align:right;color:#334155;">${uPages} pages</td>
      </tr>
      ${lessonChips ? `<tr><td></td><td colspan="2" style="padding:0 12px 12px 12px;">${lessonChips}</td></tr>` : ``}
    `;
    })
    .join("");

  const contentsBody = `
    <div style="padding:8px 0 4px 0;">
      <h1 style="margin:0;font-size:2.25rem;font-weight:800;color:${text};">Contents</h1>
    </div>
    <table style="width:100%;border-collapse:separate;border-spacing:0;margin-top:10px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background-color:${page_bg};">
      <thead>
        <tr>
          <th style="text-align:left;padding:12px 12px;width:42px;color:${accent};font-weight:700;border-bottom:1px solid #e5e7eb;">#</th>
          <th style="text-align:left;padding:12px 12px;color:${accent};font-weight:700;border-bottom:1px solid #e5e7eb;">Unit</th>
          <th style="text-align:right;padding:12px 12px;color:${accent};font-weight:700;border-bottom:1px solid #e5e7eb;width:120px;">Pages</th>
        </tr>
      </thead>
      <tbody>${tocRows || `<tr><td colspan="3" style="padding:16px 12px;color:#64748b;">No units available</td></tr>`}</tbody>
    </table>
  `;
  wrap(contentsBody, { unit: "Contents" });

  units.forEach((u, ui) => {
    const uTitle = u.title || `Unit ${ui + 1}`;
    const uPages = u.number_of_pages ?? "—";
    const uDesc = u.description || "";

    const lessonsHTML = (u.lessons || [])
      .map((l, li) => {
        const num = `${ui + 1}.${li + 1}`;
        const title = l.title || `Lesson ${li + 1}`;
        return `<li style="break-inside:avoid;margin:0 0 10px 0;color:${text}">${num} ${_escapeHtml(
          title
        )}</li>`;
      })
      .join("");

    const unitHeroBody = [
      `<section style="min-height:58vh;display:flex;align-items:center;justify-content:center;text-align:center;border-radius:12px;background-color:${page_bg};">
        <div style="padding:20px 16px;max-width:820px;">
          <h1 style="margin:0 0 10px 0;font-size:2.5rem;font-weight:800;letter-spacing:.2px;color:${text};">${_escapeHtml(
        uTitle
      )}</h1>
          <p style="margin:0;color:${accent};font-size:14px;">Estimated pages: ${uPages}</p>
          ${uDesc
        ? `<p style="margin:14px auto 0;max-width:720px;color:${text};line-height:1.7;">${_escapeHtml(
          uDesc
        )}</p>`
        : ``
      }
        </div>
      </section>`,
      `<div style="margin-top:18px;">
        <h3 style="margin:0 0 10px 0;font-size:1.125rem;font-weight:700;color:${text};">Lessons</h3>
        ${lessonsHTML
        ? `<ul style="columns:2;column-gap:28px;margin:0;padding-left:1.25rem;list-style:disc;">${lessonsHTML}</ul>`
        : `<p style="margin:0;color:#64748b;">No lessons</p>`
      }
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
              ? `<h3 style="margin:0 0 8px 0;color:${accent};">${_escapeHtml(uTitle)} • ${ui + 1
              }.${li + 1} ${_escapeHtml(lTitle)}</h3>
                 <div style="color:#64748b;font-size:12px;margin-bottom:10px">(Estimated pages: ${lPages})</div>`
              : `<h3 style="margin:0 0 8px 0;color:${accent2};">${_escapeHtml(lTitle)} — Page ${bi + 1}</h3>`;

          const body = `${titleTop}
            <div style="white-space:pre-wrap;line-height:1.6;color:${text}">${_escapeHtml(b)}</div>`;
          wrap(body, { unit: uTitle, title: lTitle });
        });
      } else {
        const body = `
          <h3 style="margin:0 0 8px 0;color:${accent2};">${_escapeHtml(uTitle)} • ${ui + 1
          }.${li + 1} ${_escapeHtml(lTitle)}</h3>
          <div style="color:#64748b;font-size:12px;margin-bottom:10px">(Estimated pages: ${lPages})</div>
          <div style="color:${text}"><em>No content available yet.</em></div>`;
        wrap(body, { unit: uTitle, title: lTitle });
      }
    });
  });

  const total = tempPages.length;
  return tempPages.map((html) => html.replace(/\{\{\s*total\s*\}\}/g, String(total)));
}

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
}) {
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
        <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>
          Theme settings
        </div>
        <button
          onClick={onClose}
          style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}
          title="Close theme panel"
        >
          Close
        </button>
      </div>

      <label style={{ display: "grid", gap: 6, marginBottom: 12, fontSize: 12, color: "#334155" }}>
        <span style={{ fontWeight: 700 }}>Choose theme</span>
        <select
          value={selectedThemeKey}
          onChange={(e) => setSelectedThemeKey(e.target.value)}
          style={{
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
        {/* page_bg */}
        <label style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
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
                background: custom.page_bg || effectiveTheme?.page_bg || "#ffffff",
              }}
            />
            <input
              type="color"
              value={custom.page_bg || effectiveTheme?.page_bg || "#ffffff"}
              onChange={(e) => setCustom((c) => ({ ...c, page_bg: e.target.value }))}
              style={{ width: 32, height: 20, border: "none", background: "transparent", cursor: "pointer" }}
              title="Pick page/body background"
            />
            <button
              onClick={() => setCustom((c) => ({ ...c, page_bg: "" }))}
              style={{ border: "1px solid #e2e8f0", background: "#fff", borderRadius: 6, padding: "2px 6px", cursor: "pointer" }}
            >
              Reset
            </button>
          </span>
          <span style={{ color: "#64748b" }}>Body background is always same as page background.</span>
        </label>

        {/* text */}
        <label style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
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
              style={{ width: 32, height: 20, border: "none", background: "transparent", cursor: "pointer" }}
              title="Pick text color"
            />
            <button
              onClick={() => setCustom((c) => ({ ...c, text: "" }))}
              style={{ border: "1px solid #e2e8f0", background: "#fff", borderRadius: 6, padding: "2px 6px", cursor: "pointer" }}
            >
              Reset
            </button>
          </span>
        </label>

        {/* accent */}
        <label style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
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
              onChange={(e) => setCustom((c) => ({ ...c, accent: e.target.value }))}
              style={{ width: 32, height: 20, border: "none", background: "transparent", cursor: "pointer" }}
              title="Pick accent color"
            />
            <button
              onClick={() => setCustom((c) => ({ ...c, accent: "" }))}
              style={{ border: "1px solid #e2e8f0", background: "#fff", borderRadius: 6, padding: "2px 6px", cursor: "pointer" }}
            >
              Reset
            </button>
          </span>
        </label>

        {/* accent2 */}
        <label style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <input
            type="checkbox"
            checked={apply.accent2}
            onChange={(e) => setApply((s) => ({ ...s, accent2: e.target.checked }))}
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
                background: custom.accent2 || effectiveTheme?.accent2 || "#60a5fa",
              }}
            />
            <input
              type="color"
              value={custom.accent2 || effectiveTheme?.accent2 || "#60a5fa"}
              onChange={(e) => setCustom((c) => ({ ...c, accent2: e.target.value }))}
              style={{ width: 32, height: 20, border: "none", background: "transparent", cursor: "pointer" }}
              title="Pick accent2 color"
            />
            <button
              onClick={() => setCustom((c) => ({ ...c, accent2: "" }))}
              style={{ border: "1px solid #e2e8f0", background: "#fff", borderRadius: 6, padding: "2px 6px", cursor: "pointer" }}
            >
              Reset
            </button>
          </span>
        </label>

        {/* SVG Colors */}
        <div style={{ marginTop: 6, paddingTop: 8, borderTop: "1px solid #e2e8f0" }}>
          <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>SVG colors</div>
          {Object.keys(svgColorMap).length === 0 ? (
            <div style={{ color: "#64748b", fontSize: 12 }}>No SVG colors detected in this theme.</div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {Object.entries(svgColorMap).map(([orig, current]) => (
                <label key={orig} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ minWidth: 120, fontFamily: "monospace", fontSize: 12 }}>
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
                      style={{ width: 32, height: 20, border: "none", background: "transparent", cursor: "pointer" }}
                      title={`Replace ${orig}`}
                    />
                    <button
                      onClick={() => setSvgColorMap((m) => ({ ...m, [orig]: orig }))}
                      style={{ border: "1px solid #e2e8f0", background: "#fff", borderRadius: 6, padding: "2px 6px", cursor: "pointer" }}
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
          Toggle which theme parts apply. Unchecked values fall back to safe defaults.
        </div>
      </div>
    </aside>
  );
}

/* ================= DOC VIEW ================= */
function DocView({
  pages,
  fontSize = 16,
  deviceDimensions = { width: 720, height: 520 },
  theme = null,
  onPageInView = () => { },
}) {
  const pageWidth = Math.min(deviceDimensions.width, 860);
  const pageMinHeight = Math.max(deviceDimensions.height, 980);

  const pageBg = theme?.page_bg ?? "#ffffff";
  const bodyBg = theme?.body_bg ?? pageBg;
  const textCol = theme?.text ?? "#1f2937";
  const accent = theme?.accent ?? null;
  const accent2 = theme?.accent2 ?? null;
  const headHTML = theme?.header || "";
  const footHTML = theme?.footer || "";

  function getMetaFromPage(html, key) {
    const m = new RegExp(`data-${key}="([^"]*)"`, "i").exec(String(html || ""));
    return m && m[1] ? m[1] : "";
  }

  const pageRefs = React.useRef([]);
  pageRefs.current = [];

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

  return (
    <div data-docview style={{ padding: "12px 0 24px", background: "transparent" }}>
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
              backgroundColor: pageBg,
              color: textCol,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 10px rgba(0,0,0,.06), 0 20px 40px rgba(0,0,0,.04)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", backgroundColor: pageBg }}>
              {accent ? <div style={{ height: 4, background: accent }} /> : null}
              {accent2 ? <div style={{ height: 4, background: accent2 }} /> : null}

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
              style={{
                flex: 1,
                padding: "22px 28px",
                fontSize,
                lineHeight: 1.7,
                color: textCol,
                backgroundColor: bodyBg,
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(0,0,0,0.02) 31px, rgba(0,0,0,0.02) 32px)",
              }}
            >
              <TextFormat data={page} />
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
                    backgroundColor: pageBg,
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
        @media (max-width: 1020px) {
        }
        @media (max-width: 768px) {
          div[data-docview] { padding: 8px 0 16px; }
        }
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
            background: #ffffff !important;
            color: #000000 !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ================= PAGE ================= */
export default function BookDetailsPage() {
  const { id } = useParams();
  const bookId = Number(id);

  const [book, setBook] = React.useState(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const themeKeys = React.useMemo(() => Object.keys(pageThemes || {}), []);
  const [selectedThemeKey, setSelectedThemeKey] = React.useState(themeKeys[0] || "theme1");
  const currentTheme = pageThemes?.[selectedThemeKey] || null;

  // this controls whether the sidebar shows TOC or ThemePanel
  const [showThemePanel, setShowThemePanel] = React.useState(false);

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
    const defaults = { page_bg: "#f8fafc", text: "#0f172a", accent: undefined, accent2: undefined };

    const pageBG = apply.page_bg ? (custom.page_bg || currentTheme.page_bg) : defaults.page_bg;
    const text = apply.text ? (custom.text || currentTheme.text) : defaults.text;
    const accent = apply.accent ? (custom.accent || currentTheme.accent) : defaults.accent;
    const accent2 = apply.accent2 ? (custom.accent2 || currentTheme.accent2) : defaults.accent2;

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
    };
  }, [currentTheme, apply, custom, svgColorMap]);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    jfetch(`/api/books/${bookId}/`)
      .then((res) => {
        if (!mounted) return;
        setBook(res?.data ?? null);
        setError("");
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e.message || "Failed to load book");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [bookId]);

  const pages = React.useMemo(
    () => bookToPagesWithTheme(book, effectiveTheme),
    [book, effectiveTheme]
  );

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

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
        {/* ====== top bar ====== */}
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
          </div>
        </div>

        {/* ====== main grid ====== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: 16,
            alignItems: "start",
          }}
        >
          {showThemePanel ? (
            <ThemePanel
              selectedThemeKey={selectedThemeKey}
              setSelectedThemeKey={setSelectedThemeKey}
              themeKeys={themeKeys}
              pageThemes={pageThemes}
              effectiveTheme={effectiveTheme}
              apply={apply}
              setApply={setApply}
              custom={custom}
              setCustom={setCustom}
              svgColorMap={svgColorMap}
              setSvgColorMap={setSvgColorMap}
              onClose={() => setShowThemePanel(false)}
            />
          ) : (
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
              <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a", marginBottom: 8 }}>
                In this book
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {groupedTOC.map((u) => (
                  <div key={u.unit}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 6 }}>
                      {u.unit || "Unit"}
                    </div>
                    <div style={{ display: "grid", gap: 4 }}>
                      {u.lessons.map((l) => {
                        const isActive = activePointer.unit === u.unit && activePointer.title === l.title;
                        return (
                          <button
                            key={u.unit + "::" + l.title}
                            onClick={() => {
                              const el = document.getElementById(`page-${l.firstPage}`);
                              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}
                            title={`Go to page ${l.firstPage}`}
                            style={{
                              textAlign: "left",
                              border: "1px solid " + (isActive ? "#2563eb" : "#e5e7eb"),
                              background: isActive ? "rgba(37, 99, 235, 0.07)" : "#fff",
                              color: isActive ? "#1f2937" : "#334155",
                              borderRadius: 8,
                              fontSize: 12,
                              padding: "6px 8px",
                              cursor: "pointer",
                            }}
                          >
                            <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {l.title || "Lesson"}
                            </div>
                            <div style={{ fontSize: 11, opacity: 0.7 }}>Page {l.firstPage}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
