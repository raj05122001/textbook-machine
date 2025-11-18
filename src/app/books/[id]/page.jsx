"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import pageThemes from "./pageThemes.json";
import DocView from "@/components/readBooksAllComponent/DocView";
import EditorPanel from "@/components/readBooksAllComponent/EditorPanel";
import ImageMagnifierOverlay from "@/components/readBooksAllComponent/ImageMagnifierOverlay";
import TextFormat from "@/components/format/TextFormat";

const API_BASE = "https://tbmplus-backend.ultimeet.io";

/* ===========================
   Utils
=========================== */

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
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.padEnd(6, "0").slice(0, 6);
  const n = parseInt(v, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHex({ r, g, b }) {
  const to = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
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

function normalizeQuestions(q) {
  if (!q) return "";
  if (Array.isArray(q)) return q.map((x, i) => `${i + 1}. ${String(x ?? "").trim()}`).join("\n");
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
    const val = p.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
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
    const text = textVal ? `\n${String(textVal).trim()}` : "";
    const summary = summaryVal ? `\n#### Content Summary\n\n${String(summaryVal).trim()}` : "";
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
function stripScripts(html = "") {
  return String(html).replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}
function readMeta(html) {
  const unit = (String(html).match(/data-unit="([^"]*)"/i)?.[1] || "").trim();
  const title = (String(html).match(/data-title="([^"]*)"/i)?.[1] || "").trim();
  const klass = (String(html).match(/data-class="([^"]*)"/i)?.[1] || "").trim();
  return { unit, title, className: klass };
}
function extractHexColorsFromHTML(html) {
  if (!html) return [];
  const colors = new Set();
  const re = /(?:fill|stroke|stop-color)\s*[:=]\s*["']?\s*(#[0-9a-fA-F]{3,6})\b/gi;
  let m;
  while ((m = re.exec(html))) colors.add(m[1].toLowerCase());
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

function splitHtmlByParagraphs(html = "", maxCharsPerPage = 1800) {
  const P = String(html || "")
    .replace(/\r\n/g, "\n")
    .replace(/<\/p>\s*<p/gi, "</p>\n<p")
    .split(/\n{2,}|\n(?=<p\b)/);

  const pages = [];
  let current = "";

  const push = () => {
    const s = current.trim();
    if (s) pages.push(s);
    current = "";
  };

  for (const chunk of P) {
    const c = chunk.trim();
    if (!c) continue;

    if (c.length > maxCharsPerPage * 1.1) {
      const sentences = c.split(/(?<=[.!?])\s+/);
      for (const s of sentences) {
        if ((current + "\n\n" + s).length > maxCharsPerPage) push();
        current += (current ? "\n\n" : "") + s;
      }
      continue;
    }

    if ((current + "\n\n" + c).length > maxCharsPerPage) push();
    current += (current ? "\n\n" : "") + c;
  }
  push();
  return pages;
}


function legacyHtmlToMarkdown(html = "") {
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

function bookToPagesWithTheme(book, theme) {
  const tempPages = [];
  const page_bg = theme?.page_bg || "#ffffff";
  const text = theme?.text || "#0f172a";
  const accent = theme?.accent || "#2563eb";
  const accent2 = theme?.accent2 || "#60a5fa";
  const hasBgImg = !!theme?.page_bg_image;
  const blockBg = hasBgImg ? "transparent" : page_bg;
  const tableBd = hasBgImg ? "rgba(255,255,255,.25)" : "#e5e7eb";


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

  const className = pickFirst(book, ["class_name", "class", "grade", "standard"]) || "";


  function wrap(bodyHtml, ctx = {}) {
    const PAGE_SIDE_PAD = 28;
    const metaProbe = `
      <span style="display:none"
        data-unit="${_escapeHtml(ctx.unit || "")}"
       data-class="${_escapeHtml(className)}"
        data-title="${_escapeHtml(ctx.title || "")}">
      </span>`;
    tempPages.push(
      `${metaProbe}<div style="padding: 0 ${PAGE_SIDE_PAD}px">${bodyHtml}</div>`
    );
  }


  function estimateLessonPages(lesson) {
    const blocks = blocksFromLesson(lesson);
    if (!blocks || !blocks.length) return 1;
    let pages = 0;
    for (const b of blocks) {
      const parts = splitHtmlByParagraphs(b, 1800);
      pages += Math.max(1, (parts?.length ?? 1));
    }
    return Math.max(1, pages);
  }

  function estimateUnitPages(unit) {
    const lessons = Array.isArray(unit?.lessons) ? unit.lessons : [];
    if (!lessons.length) return 1;
    let total = 0;
    for (const l of lessons) total += estimateLessonPages(l);
    return Math.max(1, total + 1);
  }

  const tocRows = (units || [])
    .map((u, ui) => {
      const uTitle = u.title || `Unit ${ui + 1}`;
      const uPages = Number.isFinite(u?.number_of_pages)
        ? u.number_of_pages
        : estimateUnitPages(u);

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
  ${hasBgImg ? `background:transparent;border:1px solid ${tableBd};color:${text};` : `background:${accent};color:#fff;`}
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
      </span>`;
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
          <div style="font-weight:800;color:${text};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%">
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
      </tr>`;
    })
    .join("");

  const contentsBody = `
  <div style="padding:8px 0 4px 0; background:${blockBg};">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin:0 0 8px 0;">
      <h1 style="margin:0 auto;font-size:2.25rem;font-weight:800;color:${text};text-align:center;width:100%;">Contents</h1>
    </div>

    <table style="width:100%;border-collapse:separate;border-spacing:0;margin-top:10px;border:1px solid ${tableBd};border-radius:12px;overflow:hidden;background-color:${blockBg};box-shadow:${hasBgImg ? "none" : "0 2px 10px rgba(0,0,0,.03)"}">
      <thead>
        <tr>
          <th style="text-align:left;padding:12px 12px;width:42px;color:${accent};font-weight:800;border-bottom:1px solid ${tableBd};background:${hasBgImg ? "transparent" : "rgba(37,99,235,.06)"}">#</th>
          <th style="text-align:left;padding:12px 12px;color:${accent};font-weight:800;border-bottom:1px solid ${tableBd};background:${hasBgImg ? "transparent" : "rgba(37,99,235,.06)"}">Unit</th>
          <th style="text-align:right;padding:12px 12px;color:${accent};font-weight:800;width:120px;border-bottom:1px solid ${tableBd};background:${hasBgImg ? "transparent" : "rgba(37,99,235,.06)"}">Pages</th>
        </tr>
      </thead>
      <tbody style="background:${blockBg};">
        ${tocRows ||
    `<tr style="background:${blockBg};">
            <td colspan="3" style="padding:16px 12px;color:#64748b;text-align:center;border-top:1px dashed ${tableBd};background:${blockBg};">
              No units available
            </td>
          </tr>`}
      </tbody>
    </table>
  </div>`;
  wrap(contentsBody, { unit: "Contents" });

  (units || []).forEach((u, ui) => {
    const uTitle = u.title || `Unit ${ui + 1}`;
    const uPages = u.number_of_pages ?? "—";
    const uDesc = u.description || "";

    const lessonChipBase = `
  display:inline-flex;align-items:center;gap:8px;
  padding:10px 12px;border-radius:12px;background:${hasBgImg ? "transparent" : "#fff"};
  border:1px solid ${tableBd};box-shadow:${hasBgImg ? "none" : "0 2px 8px rgba(0,0,0,.03)"};
  max-width:100%; box-sizing:border-box; margin:6px 8px 0 0
`;
    const lessonNumBadge = `
  display:inline-grid;place-items:center;min-width:24px;height:24px;
  padding:0 6px;border-radius:8px;background:${hasBgImg ? "transparent" : (accent || text)};color:${hasBgImg ? text : "#fff"};
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
      </div>`;
      })
      .join("");

    const lessonsBlock =
      u.lessons && u.lessons.length
        ? `<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start;width:100%;box-sizing:border-box;max-width:100%;overflow:hidden">${lessonsChipsHTML}</div>`
        : `<p style="margin:0;color:#64748b;">No lessons</p>`;

    const unitHeroBody = [
      `<section style="min-height:58vh;display:flex;align-items:center;justify-content:center;text-align:center;border-radius:12px;background-color:${hasBgImg ? "transparent" : page_bg};">
        <div style="padding:20px 16px;max-width:820px;">
          <h1 style="margin:0 0 10px 0;font-size:2.5rem;font-weight:800;letter-spacing:.2px;color:${text};">${_escapeHtml(uTitle)}</h1>
          ${uDesc ? `<p style="margin:14px auto 0;max-width:720px;color:${text};line-height:1.7;">${_escapeHtml(uDesc)}</p>` : ``}
        </div>
      </section>`,
      `<div style="margin-top:18px;background:${hasBgImg ? "transparent" : page_bg};">
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
              ? `<h3 style="margin:0 0 8px 0;color:${accent};">${_escapeHtml(uTitle)} • ${ui + 1}.${li + 1} ${_escapeHtml(
                lTitle
              )}</h3>
                                 `
              : `<h3 style="margin:0 0 8px 0;color:${accent2};">${_escapeHtml(lTitle)} — Page ${bi + 1}</h3>`;
          {/* <div style="color:#64748b;font-size:12px;margin-bottom:10px">(Estimated pages: ${lPages})</div> */ }
          const safeHtml = stripScripts(b);
          const body = `${titleTop}<div style="line-height:1.6;color:${text}">${safeHtml}</div>`;

          const parts = splitHtmlByParagraphs(body, 1800);
          parts.forEach((part, pi) => {
            const numbered =
              parts.length > 1
                ? part.replace(
                  /(<h3[^>]*>)([\s\S]*?)(<\/h3>)/i,
                  `$1$2 — Part ${pi + 1}/${parts.length}$3`
                )
                : part;
            wrap(numbered, { unit: uTitle, title: lTitle });
          });
        });
      } else {
        const body = `
      <h3 style="margin:0 0 8px 0;color:${accent2};">${_escapeHtml(uTitle)} • ${ui + 1}.${li + 1} ${_escapeHtml(
          lTitle
        )}</h3>
      <div style="color:#64748b;font-size:12px;margin-bottom:10px">(Estimated pages: ${lPages})</div>
      <div style="color:${text}"><em>No content available yet.</em></div>`;
        wrap(body, { unit: uTitle, title: lTitle });
      }
    });

  });

  const total = tempPages.length;
  return tempPages.map((html) => html.replace(/\{\{\s*total\s*\}\}/g, String(total)));
}
async function ensureImagesLoaded(rootEl) {
  const imgs = Array.from(rootEl.querySelectorAll('img[src]'));
  await Promise.all(
    imgs.map(img => {
      // eager + no lazy swap during capture
      try { img.loading = 'eager'; img.decoding = 'sync'; } catch { }
      return new Promise(res => {
        if (img.complete && img.naturalWidth > 0) return res();
        const onDone = () => { img.removeEventListener('load', onDone); img.removeEventListener('error', onDone); res(); };
        img.addEventListener('load', onDone);
        img.addEventListener('error', onDone);
      });
    })
  );
}



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
  const [showBgInfo, setShowBgInfo] = useState(false);
  // component ke top par:
  const [panelReady, setPanelReady] = useState(false);

  useEffect(() => {
    setPanelReady(true);
  }, []);


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
    const pick = (key, def) => {
      if (apply?.[key]) {
        return (custom?.[key] || base?.[key] || def);
      }
      return (base?.[key] ?? def);
    };

    const finalAccent = pick("accent", "#2563eb");
    const finalAccent2 = pick("accent2", "#60a5fa");
    const finalText = pick("text", "#0f172a");
    const finalBG = pick("page_bg", "#ffffff");

    const rawHeader = base?.header || "";
    const rawFooter = base?.footer || "";


    let header = rawHeader
      .replaceAll("{{ACCENT}}", finalAccent)
      .replaceAll("{{ACCENT2}}", finalAccent2);
    let footer = rawFooter
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

      const res = await jfetch(`/api/books/${bookId}/`, {
        method: "PATCH",
        body: { theme_json },
      });

      console.groupCollapsed(`[SAVE THEME] PATCH /api/books/${bookId}/ → response`);
      console.log("raw response:", res);
      const payload = res?.data ?? res;
      console.log("unwrapped payload:", payload);
      if (payload?.theme_json) {
        console.log("saved theme_json:");
        console.dir(payload.theme_json, { depth: null });
      }
      if (payload?.id || payload?.pk) {
        console.log("book id:", payload.id ?? payload.pk);
      }
      console.groupEnd();

      const ok =
        (typeof res?.ok === "boolean" ? res.ok : true) &&
        !(typeof res?.status === "number" && res.status >= 400) &&
        !payload?.error;

      if (!ok) {
        const msg =
          payload?.detail ||
          payload?.message ||
          res?.statusText ||
          "Save failed";
        throw new Error(msg);
      }

      toast.success("Theme saved to book ✅");
    } catch (err) {
      const msg = err?.message || "Save failed";
      console.error("[SAVE THEME] error:", err);
      toast.error(msg);
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
        height: "calc(90vh - 32px)",
        // Outer shell with glow + slide-in animation
        padding: 1,
        borderRadius: 18,
        background:
          "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(129,140,248,0.22))",
        opacity: panelReady ? 1 : 0,
        transform: panelReady ? "translateX(0)" : "translateX(28px)",
        transition: "opacity 220ms ease-out, transform 220ms ease-out",
      }}
    >
      {/* Inner content card */}
      <div
        style={{
          height: "100%",
          borderRadius: 16,

          border: "1px solid rgba(148,163,184,0.2)",
          padding: 14,
          overflow: "auto",
          color: "#e5e7eb",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            gap: 8,
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: 0.4,
                textTransform: "uppercase",
                color: "#000000ff",
              }}
            >
              Theme settings
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#000000ff",
                marginTop: 2,
              }}
            >
              Live preview updates instantly while you experiment.
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              ...smallBtn,
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.6)",
              background:
                "#fff",
              color: "#010101ff",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              paddingInline: 10,
              transition: "transform 140ms ease-out, box-shadow 140ms ease-out",
            }}
            title="Close theme panel"
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            ✕ <span>Close</span>
          </button>
        </div>

        {/* TOP ACTIONS */}
        <div
          style={{
            display: "grid",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <button
            type="button"
            onClick={handleSaveTheme}
            disabled={saving}
            style={{
              height: 40,
              borderRadius: 999,
              border: "1px solid rgba(56,189,248,0.6)",
              padding: "8px 14px",
               background:
              "radial-gradient(circle at top left, rgba(148,163,184,0.18), rgba(15,23,42,0.9))",
              color: saving ? "#9ca3af" : "#f9fafb",
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: 700,
              justifySelf: "stretch",
              minWidth: 160,
              boxShadow: saving
                ? "0 0 0 rgba(0,0,0,0)"
                : "0 12px 30px rgba(59,130,246,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 13,
              letterSpacing: 0.3,
              textTransform: "uppercase",
              transition:
                "transform 140ms ease-out, box-shadow 140ms ease-out, background 160ms ease-out",
            }}
            title="Save current theme to book"
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {saving ? (
              <>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "999px",
                    border: "2px solid rgba(148,163,184,0.6)",
                    
                    borderTopColor: "#e5e7eb",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Saving…
              </>
            ) : (
              <>
                💾 Save Theme
              </>
            )}
          </button>
          <div
            style={{
              fontSize: 11,
              color: "#000000ff",
            }}
          >
            Tip: Theme is saved with this book and reused on export.
          </div>
        </div>

        {/* ========== BG IMAGE SECTION ========== */}
        <div
          style={{
            border: "1px solid rgba(148,163,184,0.45)",
            borderRadius: 14,
            padding: 10,
            marginBottom: 12,
            background:
              "radial-gradient(circle at top left, rgba(148,163,184,0.18), rgba(15,23,42,0.9))",
          }}
        >
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.18,
              color: "#000000ff",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Page background
          </div>

          <div
            style={{
              display: "grid",
              gap: 8,
              fontSize: 12,
              color: "#cbd5f5",
              position: "relative",
            }}
          >
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

            {/* Button + Info icon row */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => document.getElementById("bg-file")?.click()}
                style={{
                  height: 38,
                  borderRadius: 10,
                  border: "1px solid rgba(148,163,184,0.6)",
                  padding: "6px 12px",
                  background:
                    "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,64,175,0.85))",
                  color: "#e5e7eb",
                  cursor: "pointer",
                  fontWeight: 600,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  textAlign: "left",
                  boxShadow: "0 10px 25px rgba(30,64,175,0.45)",
                  transition:
                    "transform 140ms ease-out, box-shadow 140ms ease-out, background 140ms ease-out",
                }}
                aria-label="Choose page background"
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <span>Choose Background (all pages)</span>

                {/* Info icon with hover tooltip */}
                <span
                  onMouseEnter={() => setShowBgInfo(true)}
                  onMouseLeave={() => setShowBgInfo(false)}
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                    borderRadius: "999px",
                    border: "1px solid rgba(191,219,254,0.9)",
                    background: "radial-gradient(circle,#eff6ff,#dbeafe)",
                    color: "#1d4ed8",
                    flexShrink: 0,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                  aria-label="Background info"
                  onClick={(e) => e.stopPropagation()}
                >
                  i
                  {showBgInfo && (
                    <div
                      style={{
                        position: "absolute",
                        top: "120%",
                        right: 0,
                        zIndex: 200,
                        width: 260,
                        padding: 10,
                        borderRadius: 10,
                        background:
                          "radial-gradient(circle at top,#020617,#020617 80%)",
                        color: "#e5e7eb",
                        boxShadow: "0 18px 40px rgba(15,23,42,0.75)",
                        fontSize: 12,
                        opacity: showBgInfo ? 1 : 0,
                        transform: showBgInfo
                          ? "translateY(0)"
                          : "translateY(4px)",
                        transition:
                          "opacity 120ms ease-out, transform 120ms ease-out",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          marginBottom: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 18,
                            height: 18,
                            borderRadius: "999px",
                            background: "#1d4ed8",
                            fontSize: 11,
                          }}
                        >
                          i
                        </span>
                        Choose Background (all pages)
                      </div>

                      <div style={{ color: "#cbd5f5", lineHeight: 1.5,zIndex:1000 }}>
                        Tip: 2480×3508 (A4 @ 300 DPI) best rahega. SVG/data URL bhi
                        chalega. Agar “Add watermark” on hai, to upload hote hi
                        diagonal repeated text embed ho jayega.
                      </div>
                    </div>
                  )}
                </span>
              </button>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => onApplyBackgroundUrl?.("")}
                style={{
                  height: 32,
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.6)",
                  padding: "0 12px",
                  background: "rgba(15,23,42,0.85)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 12,
                  color: "#ffffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  transition:
                    "transform 120ms ease-out, box-shadow 120ms ease-out, background 120ms ease-out",
                }}
                title="Remove background"
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                🧹 Remove background
              </button>
            </div>
          </div>
        </div>

        {/* ========== COVER SECTION ========== */}
        <div
          style={{
            border: "1px solid rgba(148,163,184,0.45)",
            borderRadius: 14,
            padding: 10,
            marginBottom: 12,
            background:
              "radial-gradient(circle at top right, rgba(96,165,250,0.18), rgba(15,23,42,0.9))",
          }}
        >
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.18,
              color: "#a5b4fc",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Cover image
          </div>

          <label
            style={{
              display: "grid",
              gap: 6,
              fontSize: 12,
              color: "#cbd5f5",
            }}
          >
            <span>Upload a cover (2480 × 3508)</span>

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
                borderRadius: 10,
                border: "1px solid rgba(148,163,184,0.6)",
                padding: "6px 12px",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,64,175,0.9))",
                color: "#e5e7eb",
                cursor: "pointer",
                fontWeight: 600,
                width: "100%",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition:
                  "transform 140ms ease-out, box-shadow 140ms ease-out, background 140ms ease-out",
              }}
              aria-label="Choose cover page"
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              📂 Choose Cover page
            </button>

            <button
              type="button"
              onClick={onSaveCover}
              disabled={!coverFile || savingCover}
              style={{
                height: 36,
                borderRadius: 999,
                border: savingCover
                  ? "1px solid #93c5fd"
                  : "1px solid rgba(96,165,250,0.9)",
                padding: "6px 12px",
                background: savingCover
                  ? "linear-gradient(90deg,#1f2937,#111827)"
                  : "linear-gradient(135deg,#3b82f6,#22d3ee)",
                color: "#f9fafb",
                cursor: !coverFile || savingCover ? "not-allowed" : "pointer",
                fontWeight: 700,
                width: "100%",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: savingCover
                  ? "0 0 0 rgba(0,0,0,0)"
                  : "0 14px 30px rgba(37,99,235,0.4)",
                transition:
                  "transform 140ms ease-out, box-shadow 140ms ease-out, background 140ms ease-out",
              }}
              aria-label="Save cover page"
              title={
                coverFile
                  ? "Upload this image as cover_page"
                  : "Choose an image first"
              }
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {savingCover ? (
                <>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "999px",
                      border: "2px solid rgba(191,219,254,0.6)",
                      borderTopColor: "#f9fafb",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Saving…
                </>
              ) : (
                <>🚀 Save Cover</>
              )}
            </button>
          </label>
        </div>

        {/* ========== THEME DROPDOWN ========== */}
        <div
          style={{
            border: "1px solid rgba(148,163,184,0.45)",
            borderRadius: 14,
            padding: 10,
            marginBottom: 12,
            background:
              "radial-gradient(circle at bottom left, rgba(59,130,246,0.18), rgba(15,23,42,0.9))",
          }}
        >
          <label
            style={{
              display: "grid",
              gap: 6,
              fontSize: 12,
              color: "#cbd5f5",
            }}
          >
            <span style={{ fontWeight: 700, color: "#e5e7eb" }}>Choose theme</span>
            <select
              value={selectedThemeKey}
              onChange={(e) => setSelectedThemeKey(e.target.value)}
              style={{
                width: "100%",
                height: 36,
                borderRadius: 10,
                border: "1px solid rgba(148,163,184,0.7)",
                padding: "0 10px",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,1), rgba(30,64,175,0.9))",
                color: "#f9fafb",
                fontSize: 13,
                outline: "none",
              }}
              title="Choose page theme"
            >
              {themeKeys.map((k) => {
                const t = pageThemes[k];
                return (
                  <option
                    key={k}
                    value={k}
                    style={{ backgroundColor: "#020617", color: "#e5e7eb" }}
                  >
                    {k} — {t?.id || "untitled"}
                  </option>
                );
              })}
            </select>
          </label>
        </div>

        {/* ========== COLORS SECTION ========== */}
        <div
          style={{
            border: "1px solid rgba(148,163,184,0.45)",
            borderRadius: 14,
            padding: 10,
            marginBottom: 12,
            background:
              "radial-gradient(circle at top, rgba(37,99,235,0.16), rgba(15,23,42,0.96))",
            fontSize: 12,
            color: "#e5e7eb",
            display: "grid",
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.18,
              color: "#ffffffff",
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            Base colors
          </div>

          {/* PAGE BG */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <input
              type="checkbox"
              checked={apply.page_bg}
              onChange={(e) =>
                setApply((s) => ({ ...s, page_bg: e.target.checked }))
              }
            />
            <span style={{ fontWeight: 700, minWidth: 120 }}>Apply page_bg</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 8px",
                border: "1px solid rgba(148,163,184,0.6)",
                borderRadius: 999,
                background: "rgba(15,23,42,0.95)",
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.6)",
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
                  border: "1px solid rgba(148,163,184,0.7)",
                  background: "rgba(15,23,42,0.8)",
                  borderRadius: 999,
                  padding: "2px 8px",
                  cursor: "pointer",
                  fontSize: 11,
                  color: "#e5e7eb",
                }}
              >
                Reset
              </button>
            </span>
            <span style={{ color: "#ffffffff" }}>
              Body background is always same as page background.
            </span>
          </label>

          {/* TEXT COLOR */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <input
              type="checkbox"
              checked={apply.text}
              onChange={(e) =>
                setApply((s) => ({ ...s, text: e.target.checked }))
              }
            />
            <span style={{ fontWeight: 700, minWidth: 120 }}>Apply text</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 8px",
                border: "1px solid rgba(148,163,184,0.6)",
                borderRadius: 999,
                background: "rgba(15,23,42,0.95)",
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.6)",
                  background: custom.text || effectiveTheme?.text || "#0f172a",
                }}
              />
              <input
                type="color"
                value={custom.text || effectiveTheme?.text || "#0f172a"}
                onChange={(e) =>
                  setCustom((c) => ({ ...c, text: e.target.value }))
                }
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
                  border: "1px solid rgba(148,163,184,0.7)",
                  background: "rgba(15,23,42,0.8)",
                  borderRadius: 999,
                  padding: "2px 8px",
                  cursor: "pointer",
                  fontSize: 11,
                  color: "#e5e7eb",
                }}
              >
                Reset
              </button>
            </span>
          </label>

          {/* ACCENT 1 */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <input
              type="checkbox"
              checked={apply.accent}
              onChange={(e) =>
                setApply((s) => ({ ...s, accent: e.target.checked }))
              }
            />
            <span style={{ fontWeight: 700, minWidth: 120 }}>Apply accent</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 8px",
                border: "1px solid rgba(148,163,184,0.6)",
                borderRadius: 999,
                background: "rgba(15,23,42,0.95)",
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.6)",
                  background:
                    custom.accent || effectiveTheme?.accent || "#2563eb",
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
                  border: "1px solid rgba(148,163,184,0.7)",
                  background: "rgba(15,23,42,0.8)",
                  borderRadius: 999,
                  padding: "2px 8px",
                  cursor: "pointer",
                  fontSize: 11,
                  color: "#e5e7eb",
                }}
              >
                Reset
              </button>
            </span>
          </label>

          {/* ACCENT 2 */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <input
              type="checkbox"
              checked={apply.accent2}
              onChange={(e) =>
                setApply((s) => ({ ...s, accent2: e.target.checked }))
              }
            />
            <span style={{ fontWeight: 700, minWidth: 120 }}>Apply accent2</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 8px",
                border: "1px solid rgba(148,163,184,0.6)",
                borderRadius: 999,
                background: "rgba(15,23,42,0.95)",
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.6)",
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
                  border: "1px solid rgba(148,163,184,0.7)",
                  background: "rgba(15,23,42,0.8)",
                  borderRadius: 999,
                  padding: "2px 8px",
                  cursor: "pointer",
                  fontSize: 11,
                  color: "#e5e7eb",
                }}
              >
                Reset
              </button>
            </span>
          </label>
        </div>

        {/* ========== SVG COLOR SECTION ========== */}
        <div
          style={{
            border: "1px solid rgba(148,163,184,0.45)",
            borderRadius: 14,
            padding: 10,
            marginBottom: 10,
            background:
              "radial-gradient(circle at bottom right, rgba(15,23,42,0.96), rgba(30,64,175,0.8))",
            fontSize: 12,
            color: "#e5e7eb",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: "#e5e7eb",
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: "rgba(59,130,246,0.2)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
              }}
            >
              SVG
            </span>
            SVG colors
          </div>
          {Object.keys(svgColorMap).length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: 12 }}>
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
                      fontSize: 11,
                      color: "#cbd5f5",
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
                      border: "1px solid rgba(148,163,184,0.6)",
                      borderRadius: 999,
                      background: "rgba(15,23,42,0.95)",
                    }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 999,
                        border: "1px solid rgba(148,163,184,0.6)",
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
                        border: "1px solid rgba(148,163,184,0.7)",
                        background: "rgba(15,23,42,0.8)",
                        borderRadius: 999,
                        padding: "2px 8px",
                        cursor: "pointer",
                        fontSize: 11,
                        color: "#e5e7eb",
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

          <div
            style={{
              marginTop: 8,
              color: "#9ca3af",
              fontSize: 11,
            }}
          >
            Toggle which theme parts apply. Unchecked values fall back to safe
            defaults.
          </div>
        </div>
      </div>

      {/* Tiny inline keyframes for loader spin */}
      <style>{`
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `}</style>
    </aside>

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
  const [coverFile, setCoverFile] = React.useState(null);
  const [savingCover, setSavingCover] = React.useState(false);
  const [selectedThemeKey, setSelectedThemeKey] = React.useState("");

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

  // Export state
  const [exporting, setExporting] = React.useState(false);
  const [exportNote, setExportNote] = React.useState("");
  const [fastMode, setFastMode] = React.useState(true);

  function freezeForExport() { document.body.classList.add("tbm-printing", "tbm-exporting"); try { window.scrollTo({ top: 0, behavior: "instant" }); } catch { } }
  function unfreezeAfterExport() { document.body.classList.remove("tbm-printing", "tbm-exporting"); }
  async function waitForFonts() { try { if (document?.fonts?.ready) await document.fonts.ready; } catch { } }
  const [tocReady, setTocReady] = React.useState(false);

  React.useEffect(() => {
    setTocReady(true);
  }, []);
  const [toolbarReady, setToolbarReady] = React.useState(false);
  React.useEffect(() => {
    setToolbarReady(true);
  }, []);


  let _libOnce;
  function loadScriptOnce(url) { return new Promise((res, rej) => { const s = document.createElement("script"); s.src = url; s.async = true; s.crossOrigin = "anonymous"; s.onload = () => res(true); s.onerror = () => rej(new Error("load failed: " + url)); document.head.appendChild(s); }); }
  async function ensureCanvasAndPdfLibs() {
    if (_libOnce) return _libOnce;
    _libOnce = (async () => {
      if (window.html2canvas && window.jspdf?.jsPDF) return;
      const plans = [
        async () => { await loadScriptOnce("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"); await loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"); },
        async () => { await loadScriptOnce("https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js"); await loadScriptOnce("https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js"); },
        async () => { await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"); await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"); },
      ];
      let err = null; for (const p of plans) { try { await p(); if (window.html2canvas && window.jspdf?.jsPDF) return; } catch (e) { err = e; } }
      throw err || new Error("Libraries could not be loaded");
    })();
    return _libOnce;
  }
  function collectAssetUrls(rootNode) {
    const urls = new Set();

    rootNode.querySelectorAll("img[src]").forEach(img => {
      const src = (img.getAttribute("src") || "").trim();
      if (src && /^https?:\/\//i.test(src) && !src.startsWith("data:") && !src.startsWith("blob:")) {
        urls.add(src);
      }
    });

    const all = Array.from(rootNode.querySelectorAll("*"));
    all.forEach(node => {
      const bg = getComputedStyle(node).backgroundImage || "";
      const m = /url\((['"]?)(https?:\/\/[^'")]+)\1\)/i.exec(bg);
      if (m && m[2] && !m[2].startsWith("data:") && !m[2].startsWith("blob:")) {
        urls.add(m[2]);
      }
    });

    return Array.from(urls);
  }
  React.useEffect(() => {
    const style = document.createElement('style');
    style.setAttribute('data-tbm-global', '1');
    style.textContent = `
    body.tbm-fixed, body.tbm-printing, body.tbm-exporting { overflow: hidden !important; }
  `;
    document.head.appendChild(style);
    document.body.classList.add('tbm-fixed');
    return () => {
      document.body.classList.remove('tbm-fixed');
      try { document.head.removeChild(style); } catch { }
    };
  }, []);

  async function prefetchAssetsToBlob(urls) {
    const map = new Map();
    const revokers = [];

    await Promise.all(urls.map(async (u) => {
      try {
        const r = await fetch(u + (u.includes("?") ? "&" : "?") + "_cachebust=" + Date.now(), {
          mode: "cors",
          credentials: "omit",
          cache: "force-cache",
          referrerPolicy: "no-referrer",
        });
        if (!r.ok) throw new Error("HTTP " + r.status);
        const b = await r.blob();
        const objUrl = URL.createObjectURL(b);
        map.set(u, objUrl);
        revokers.push(() => { try { URL.revokeObjectURL(objUrl); } catch { } });
      } catch (e) {
        console.warn("[prefetch] failed", u, e?.message || e);
      }
    }));

    return { urlMap: map, revokeAll: () => revokers.forEach(fn => fn()) };
  }

  function loadScriptOnce(url) {
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = url; s.async = true; s.crossOrigin = "anonymous";
      s.onload = () => res(true);
      s.onerror = () => rej(new Error("load failed: " + url));
      document.head.appendChild(s);
    });
  }
  async function ensureCanvasAndPdfLibs() {
    if (_libOnce) return _libOnce;
    _libOnce = (async () => {
      if (window.html2canvas && window.jspdf?.jsPDF) return;
      const plans = [
        async () => { await loadScriptOnce("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"); await loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"); },
        async () => { await loadScriptOnce("https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js"); await loadScriptOnce("https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js"); },
        async () => { await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"); await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"); },
      ];
      let err = null;
      for (const p of plans) { try { await p(); if (window.html2canvas && window.jspdf?.jsPDF) return; } catch (e) { err = e; } }
      throw err || new Error("Libraries could not be loaded");
    })();
    return _libOnce;
  }



  async function handleExportPDFDirect() {
    if (exporting) return;
    const useFast = false;
    setFastMode(useFast);
    const root = document.querySelector('[data-docview]');
    if (!root) { alert("Document not found"); return; }

    setExporting(true);
    setExportNote("Loading export libraries…");
    await ensureCanvasAndPdfLibs();

    const html2canvas = window.html2canvas;
    const jsPDF = window.jspdf.jsPDF;

    setExportNote("Prefetching images…");
    const urls = collectAssetUrls(root);
    const { urlMap, revokeAll } = await prefetchAssetsToBlob(urls);

    const jpegQuality = fastMode ? 0.82 : 0.92;

    const getOrientation = (w, h) => (w >= h ? "landscape" : "portrait");


    let pdf = null;

    try {
      setExportNote("Preparing pages…");
      freezeForExport();

      const pagesEls = Array.from(root.querySelectorAll(".doc-sheet"));
      if (!pagesEls.length) throw new Error("No pages found");

      if (!useFast) await waitForFonts()
      const baseScale =
        pagesEls.length > 150 ? 0.9 :
          pagesEls.length > 120 ? 1.0 :
            pagesEls.length > 80 ? 1.2 :
              pagesEls.length > 40 ? 1.4 : 1.8;

      const isHeavy = (el) => {
        const textLen = (el.innerText || "").length;
        const media = el.querySelectorAll("img,svg,canvas,video").length;
        return textLen > 2500 || media > 6;
      };

      let firstPageSize = null;
      for (let i = 0; i < pagesEls.length; i++) {
        setExportNote(`Rendering page ${i + 1} / ${pagesEls.length}…`);
        await new Promise((r) => setTimeout(r, 0));

        const el = pagesEls[i];
        const scale = (useFast && isHeavy(el)) ? Math.max(0.8, Math.min(baseScale, 1.1)) : baseScale;

        const canvas = await html2canvas(el, {
          scale,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#fff",
          letterRendering: false,
          scrollX: 0,
          scrollY: 0,
          imageTimeout: 0,
          removeContainer: true,
          onclone: (doc) => {

            doc.documentElement.style.background = '#ffffff';
            doc.body.style.background = '#ffffff';
            doc.body.style.overflow = 'hidden';

            doc.querySelectorAll('img[src]').forEach((img) => {
              const raw = (img.getAttribute('src') || '').trim();
              img.loading = 'eager';
              img.decoding = 'sync';
              img.crossOrigin = 'anonymous';
              img.setAttribute('crossorigin', 'anonymous');

              if (urlMap.has(raw)) {
                img.setAttribute('data-old-src', raw);
                img.src = urlMap.get(raw);
              }
            });

            const all = Array.from(doc.querySelectorAll('*'));
            all.forEach((node) => {
              const cs = doc.defaultView.getComputedStyle(node);
              const bg = cs.backgroundImage || '';
              const m = /url\((['"]?)(https?:\/\/[^'")]+)\1\)/i.exec(bg);
              if (m && urlMap.has(m[2])) {
                node.setAttribute('data-old-bg', node.style.backgroundImage || '');
                node.style.backgroundImage = `url("${urlMap.get(m[2])}")`;
              }
            });
          },
        });


        const cW = canvas.width;
        const cH = canvas.height;
        const orientation = getOrientation(cW, cH);
        if (!firstPageSize) firstPageSize = { w: cW, h: cH, orientation };
        if (!pdf) {
          pdf = new jsPDF({
            unit: "px",
            format: [cW, cH],
            orientation,
          });
        } else {
          pdf.addPage([cW, cH], orientation);
        }

        const imgData = canvas.toDataURL("image/jpeg", jpegQuality);
        pdf.addImage(imgData, "JPEG", 0, 0, cW, cH);

        if (pagesEls.length > 60) {
          try { canvas.width = canvas.height = 0; } catch { }
        }
      }

      if (finalCoverSrc && firstPageSize) {
        setExportNote("Adding cover…");
        const { w: cW, h: cH, orientation } = firstPageSize;
        const imgEl = await new Promise((resolve, reject) => {
          const img = new Image();
          try { img.crossOrigin = "anonymous"; } catch { }
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("Cover image load failed"));
          img.src = finalCoverSrc;
        });
        const can = document.createElement("canvas");
        can.width = cW;
        can.height = cH;
        const ctx = can.getContext("2d");

        const scale = Math.min(cW / imgEl.width, cH / imgEl.height);
        const w = Math.round(imgEl.width * scale);
        const h = Math.round(imgEl.height * scale);
        const x = Math.round((cW - w) / 2);
        const y = Math.round((cH - h) / 2);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, cW, cH);
        ctx.drawImage(imgEl, x, y, w, h);
        const coverData = can.toDataURL("image/jpeg", jpegQuality);

        pdf.addPage([cW, cH], orientation);
        const last = pdf.getNumberOfPages();
        pdf.setPage(last);
        pdf.addImage(coverData, "JPEG", 0, 0, cW, cH);
        if (typeof pdf.movePage === "function") {
          pdf.movePage(last, 1);
          pdf.setPage(pdf.getNumberOfPages());
        }
      }

      const filename = `${(book?.title || "book").replace(/[^\w\d\-]+/g, "_")}.pdf`;
      setExportNote("Finalizing…");
      pdf.save(filename);
    } catch (e) {
      console.error("PDF export failed:", e);
      alert("PDF export failed: " + (e?.message || "Unknown error"));
    } finally {
      try { revokeAll(); } catch { }
      unfreezeAfterExport();
      setExportNote("");
      setExporting(false);
    }
  }



  const [apply, setApply] = React.useState({ page_bg: true, text: true, accent: true, accent2: true });
  const [custom, setCustom] = React.useState({ page_bg: "", text: "", accent: "", accent2: "" });
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

    const pageBG = apply.page_bg ? custom.page_bg || currentTheme.page_bg : defaults.page_bg;
    const text = apply.text ? custom.text || currentTheme.text : defaults.text;
    const accent = apply.accent ? custom.accent || currentTheme.accent : defaults.accent;
    const accent2 = apply.accent2 ? custom.accent2 || currentTheme.accent2 : defaults.accent2;

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
      if (prev && prev.startsWith("blob:")) { try { URL.revokeObjectURL(prev); } catch { } }
      return url;
    });
    setCoverFile(file);
  }, []);
  const handlePickImageUrl = React.useCallback((url) => {
    setTopImageUrl((prev) => {
      if (prev && prev.startsWith("blob:")) { try { URL.revokeObjectURL(prev); } catch { } }
      return url;
    });
    setCoverFile(null);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch { }
  }, []);

  const pages = React.useMemo(() => bookToPagesWithTheme(book, effectiveTheme), [book, effectiveTheme]);

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
        setContentIds(all);
      } catch (e) {
        if (!mounted) return;
        console.error("Book load failed:", e);
        setError(e?.message || "Failed to load book");
        setBook(null);
        setContentIds([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [bookId]);

  React.useEffect(() => {
    userPickedRef.current = false;
    setSelectedThemeKey("");
  }, [bookId]);

  React.useEffect(() => {
    const apiThemeId = book?.theme_json?.id ? String(book.theme_json.id).trim() : "";
    const available = themeKeys || [];
    if (!available.length) return;
    const matchKey = findKeyByThemeId(pageThemes, apiThemeId);
    setSelectedThemeKey((prev) => {
      if (userPickedRef.current) return prev;
      if (matchKey) return matchKey;
      if (apiThemeId && available.includes(apiThemeId)) return apiThemeId;
      if (!prev) return available[0] || "theme1";
      return prev;
    });
  }, [book?.theme_json?.id, themeKeys]);

  const userPickedRef = React.useRef(false);
  function findKeyByThemeId(pageThemesObj, apiId) {
    if (!apiId) return null;
    for (const k of Object.keys(pageThemesObj || {})) {
      const innerId = String(pageThemesObj?.[k]?.id || "").trim();
      if (innerId && innerId === String(apiId).trim()) return k;
    }
    return null;
  }

  React.useEffect(() => {
    (async () => {
      if (!book) return;
      if (Array.isArray(contentIds) && contentIds.length) return;
      try {
        const ids = await resolveAllContentIds({ bookId, book });
        setContentIds(ids);
      } catch (e) {
        console.warn("Could not resolve content ids:", e?.message || e);
      }
    })();
  }, [book, contentIds?.length, bookId]);

  const pageIndex = React.useMemo(() => {
    return (pages || []).map((p, i) => ({ page: i + 1, ...readMeta(p) }));
  }, [pages]);
  function estimateUnitPages(u) {
    let count = 0;
    const lessons = Array.isArray(u?.lessons) ? u.lessons : [];
    for (const l of lessons) {
      const blocks = blocksFromLesson(l);              // you already have this
      for (const b of blocks) {
        const parts = splitHtmlByParagraphs(b, 1800);  // same limit you use later
        count += Math.max(1, parts.length);
      }
    }
    return count || "—";
  }

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
      lessons: Array.from(lessonsMap.entries()).map(([title, firstPage]) => ({ title, firstPage })),
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

  const LoadingScreen = () => (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc" }}>
      <div style={{ color: "#1f2937", fontWeight: 600 }}>Loading book…</div>
    </div>
  );
  const ErrorScreen = ({ error }) => (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0B0D10", color: "#fff" }}>
      <div>
        <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{error || "Book not found"}</p>
        <Link href="/books" style={{ color: "#34d399", textDecoration: "underline" }}>
          Back to all books
        </Link>
      </div>
    </div>
  );

  const containerStyle = {
    // layout
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box",

    // sirf bottom padding (no left/right/top)
    padding: "0 0 1px 0",

    // outer shell
    borderRadius: 18,

  };



  function pickId(v) {
    if (v == null) return null;
    if (typeof v === "string" || typeof v === "number") return String(v);
    if (typeof v === "object") return v?.id ?? v?.content?.id ?? v?.pk ?? v?.uuid ?? null;
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
    push(book?.content);
    push(book?.content?.id);
    push(book?.content_id);
    push(book?.primary_content_id);
    if (Array.isArray(book?.contents)) book.contents.forEach(push);
    push(book?.syllabus?.content);
    if (Array.isArray(book?.syllabus?.units)) {
      for (const u of book.syllabus.units) {
        const lessons = Array.isArray(u?.lessons) ? u.lessons : [];
        for (const l of lessons) {
          const c = l?.contents;
          if (Array.isArray(c)) c.forEach(push); else push(c);
        }
      }
    }
    if (Array.isArray(book?.units)) {
      for (const u of book.units) {
        const lessons = Array.isArray(u?.lessons) ? u.lessons : [];
        for (const l of lessons) {
          const c = l?.contents;
          if (Array.isArray(c)) c.forEach(push); else push(c);
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
      console.warn("[bulk fetchExisting] failed, will try sequential.", e?.message || e);
    }

    const BATCH = 10;
    for (let i = 0; i < ids.length; i += BATCH) {
      const slice = ids.slice(i, i + BATCH);
      await Promise.all(
        slice.map(async (id) => {
          try {
            const r = await jfetch(`${API_BASE}/api/contents/${encodeURIComponent(String(id))}/`);
            const c = r?.data ?? r ?? {};
            const text = c?.text ?? c?.content_text ?? c?.body ?? c?.markdown ?? "";
            const lesson = c?.lesson ?? c?.lesson_id ?? c?.lessonId;
            out[String(id)] = { text: String(text || ""), lesson };
          } catch (e) {
            console.warn("[fetch content] id", id, "failed:", e?.message || e);
          }
        })
      );
    }
    return out;
  }

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
    try { json = text ? JSON.parse(text) : null; } catch { }

    const headObj = {};
    try { for (const [k, v] of resp.headers.entries()) headObj[k] = v; } catch { }

    const logPayload = {
      method, url, status: resp.status, ok: resp.ok, duration_ms: ms, response_headers: headObj, response_body: json ?? text,
    };
    if (resp.ok) console.log("[HTTP] ✅ response", logPayload);
    else console.warn("[HTTP] ⚠️ response (non-2xx)", logPayload);

    return { ok: resp.ok, status: resp.status, headers: headObj, json, text, duration_ms: ms };
  }

  async function handleSaveEditedPages() {
    const WANT_MARKDOWN = true;

    let ids = Array.isArray(contentIds) ? contentIds.slice() : [];
    if (!ids.length) ids = await resolveAllContentIds({ bookId, book });
    ids = Array.from(new Set(ids.filter(Boolean))).map(String);
    if (!ids.length) { alert("No content ids available to save."); return; }

    const rawPages = typeof collectEditedHTMLRef?.current === "function"
      ? collectEditedHTMLRef.current()
      : (pages || []);
    if (!Array.isArray(rawPages) || !rawPages.length) { alert("No edited pages found."); return; }

    const editedHTML = Array.isArray(rawPages) ? rawPages : [];
    const baselineHTML =
      (collectEditedHTMLRef?.current && collectEditedHTMLRef.current.__initial) ||
      (pages || []);

    // ✅ Prefer TextFormat.htmlToMarkdown; fallback to legacy
    const toMarkdown = (html) =>
    (TextFormat && typeof TextFormat.htmlToMarkdown === "function"
      ? TextFormat.htmlToMarkdown(html)
      : legacyHtmlToMarkdown(html));

    const normalizeText = (s = "") =>
      String(s || "")
        .replace(/\r\n/g, "\n")
        .replace(/\u00A0/g, " ")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    const toNorm = (h) => normalizeText(WANT_MARKDOWN ? toMarkdown(String(h || "")) : String(h || ""));

    let dirtyIdx = [];
    if (Array.isArray(editedHTML) && Array.isArray(baselineHTML) && baselineHTML.length) {
      const N = Math.min(editedHTML.length, baselineHTML.length, ids.length);
      for (let i = 0; i < N; i++) {
        if (toNorm(editedHTML[i]) !== toNorm(baselineHTML[i])) dirtyIdx.push(i);
      }
    } else {
      dirtyIdx = editedHTML.map((_, i) => i).slice(0, ids.length);
    }

    if (!dirtyIdx.length) { alert("Nothing changed — no updates needed."); return; }

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
      if (afterUser !== beforeApi) changes.push({ id, payload: { text: afterUser } });
    }

    if (!changes.length) { alert("Nothing changed — already up to date."); return; }

    const patchResults = [];
    const errors = [];
    for (const { id, payload } of changes) {
      const path = `/api/contents/${encodeURIComponent(String(id))}/`;
      const url = joinUrl(ABS_API_BASE, path);
      try {
        const resp = await requestWithLog(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          bodyObj: payload,
        });
        const server = (resp && (resp.json ?? resp.text)) ?? null;
        if (!resp.ok) throw new Error(`[${resp.status}] ${JSON.stringify(server)}`);
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
      }
    }

    if (errors.length) {
      alert(`Saved with some errors ❗\n` + errors.map(e => `id=${e.id}: ${e.error}`).join("\n"));
    } else {
      if (collectEditedHTMLRef?.current) {
        try { collectEditedHTMLRef.current.__initial = editedHTML.slice(); } catch { }
      }
      alert(`Saved successfully ✅ (${changes.length} item${changes.length > 1 ? "s" : ""} updated)`);
    }
  }

  function extractBookContentTextMap(book) {
    const map = {};
    const push = (cid, obj) => {
      const id = pickId(cid);
      if (!id) return;
      const text = obj?.text ?? obj?.content_text ?? obj?.body ?? obj?.markdown ?? "";
      const lesson = obj?.lesson ?? obj?.lesson_id ?? obj?.lessonId;
      if (map[id] == null) map[id] = { text: String(text || ""), lesson };
    };

    if (book?.content) push(book.content?.id ?? book.content, book.content);
    if (Array.isArray(book?.contents)) for (const c of book.contents) push(c?.id ?? c, c);

    const units = Array.isArray(book?.syllabus?.units) ? book.syllabus.units : [];
    for (const u of units) {
      const lessons = Array.isArray(u?.lessons) ? u.lessons : [];
      for (const l of lessons) {
        const cs = Array.isArray(l?.contents) ? l.contents : (l?.contents ? [l?.contents] : []);
        for (const c of cs) push(c?.id ?? c, { ...c, lesson: l?.id ?? l?.lesson_id });
      }
    }

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

  function isAbsoluteUrl(u = "") { return /^https?:\/\//i.test(u); }
  function normalizeBase(base) {
    let b = String(base || "").trim();
    b = b.replace(/^https\/\//i, "https://").replace(/^http\/\//i, "http://");
    if (!/^https?:\/\//i.test(b)) b = "https://" + b.replace(/^\/+/, "");
    b = b.replace(/\/+$/, "");
    return b;
  }
  const RAW_API_BASE =
    (typeof API_BASE !== "undefined" && API_BASE) ||
    (typeof process !== "undefined" && process?.env?.NEXT_PUBLIC_API_BASE) ||
    "";
  const ABS_API_BASE = normalizeBase(RAW_API_BASE);
  function joinUrl(base, path) {
    const b = String(base || "").replace(/\/+$/, "");
    const p = String(path || "").trim();
    if (!p) return b;
    if (isAbsoluteUrl(p)) return p;
    if (!p.startsWith("/")) return `${b}/${p}`;
    return `${b}${p}`;
  }

  async function handleSaveCover() {
    if (!coverFile) { alert("Please choose a cover image first."); return; }
    const endpoint = joinUrl(ABS_API_BASE, `/api/books/${encodeURIComponent(bookId)}/`);
    const fd = new FormData();
    fd.append("cover_page", coverFile);
    setSavingCover(true);
    try {
      const resp = await fetch(endpoint, { method: "PATCH", body: fd, credentials: "include" });
      const text = await resp.text();
      let json = null; try { json = text ? JSON.parse(text) : null; } catch { }
      if (!resp.ok) throw new Error(`[${resp.status}] ${text || "Upload failed"}`);
      if (json && typeof json === "object") setBook((prev) => ({ ...(prev || {}), ...json }));
      alert("Cover saved ✅");
    } catch (e) {
      console.error("[COVER] ❌ Upload failed:", e?.message || e);
      alert("Cover save failed: " + (e?.message || "Unknown error"));
    } finally {
      setSavingCover(false);
    }
  }

  const apiCoverSrc = React.useMemo(() => {
    const p = book?.cover_page;
    return p ? joinUrl(ABS_API_BASE, String(p)) : null;
  }, [book?.cover_page]);

  const finalCoverSrc = topImageUrl || apiCoverSrc;

  if (loading) return <LoadingScreen />;
  if (error || !book) return <ErrorScreen error={error} />;

  return (
    <div style={containerStyle}>
      <div
        className="w-full h-full"
        style={{
          borderRadius: 16,

          padding: 16,
          color: "#e5e7eb",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            opacity: toolbarReady ? 1 : 0,
            transform: toolbarReady ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 220ms ease-out, transform 220ms ease-out",
          }}
        >
          {/* LEFT: Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  margin: 0,
                  letterSpacing: 0.3,
                  color: "#000000ff",
                }}
              >
                {book.title}
              </h1>

            </div>
          </div>

          {/* RIGHT: Actions pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: 4,
              borderRadius: 999,

              border: "1px solid rgba(148,163,184,0.5)",
            }}
          >
            {/* Download PDF */}
            <button
              onClick={handleExportPDFDirect}
              disabled={exporting}
              className="no-print"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 36,
                borderRadius: 999,
                border: "1px solid rgba(56,189,248,0.8)",
                padding: "0 14px",
                background: exporting
                  ? "linear-gradient(90deg,#1f2937,#111827)"
                  : "linear-gradient(135deg,#0ea5e9,#6366f1)",
                color: exporting ? "#9ca3af" : "#f9fafb",
                cursor: exporting ? "not-allowed" : "pointer",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: 0.3,
                textTransform: "uppercase",
                boxShadow: exporting
                  ? "0 0 0 rgba(0,0,0,0)"
                  : "0 12px 30px rgba(59,130,246,0.4)",
                transition:
                  "transform 120ms ease-out, box-shadow 120ms ease-out, background 140ms ease-out",
              }}
              title={exporting ? exportNote || "Exporting…" : "Download as PDF"}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {exporting ? (
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid #94a3b8",
                    borderTopColor: "#f9fafb",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "tbmSpin 0.8s linear infinite",
                  }}
                />
              ) : (
                "⬇️"
              )}
              <span>{exporting ? exportNote || "Exporting…" : "Download PDF"}</span>
            </button>

            {/* Theme toggle */}
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
                gap: 6,
                height: 34,
                borderRadius: 999,
                border: "1px solid rgba(129,140,248,0.9)",
                padding: "0 12px",
                background:
                  "linear-gradient(135deg, rgba(30,64,175,0.95), rgba(56,189,248,0.9))",
                color: "#f9fafb",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 12,
                boxShadow: "0 8px 22px rgba(37,99,235,0.5)",
                transition:
                  "transform 120ms ease-out, box-shadow 120ms ease-out, background 140ms ease-out",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span role="img" aria-label="palette">
                🎨
              </span>
              <span style={{ whiteSpace: "nowrap" }}>
                {selectedThemeKey} — {effectiveTheme?.id || "theme"}
              </span>
            </button>

            {/* Editor toggle */}
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
                gap: 6,
                height: 34,
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.8)",
                padding: "0 12px",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(55,65,81,0.95))",
                color: "#e5e7eb",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 12,
                boxShadow: "0 6px 18px rgba(15,23,42,0.8)",
                transition:
                  "transform 120ms ease-out, box-shadow 120ms ease-out, background 140ms ease-out",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span role="img" aria-label="edit">
                ✏️
              </span>
              <span>{showEditorPanel ? "Close Edit" : "Edit"}</span>
            </button>

            {/* Editor-only buttons */}
            {showEditorPanel ? (
              <>
                <button
                  onClick={() => {
                    if (selectedPage == null) return;
                    setBgDisabledPages((prev) => {
                      const s = new Set(prev);
                      s.add(selectedPage - 1);
                      return s;
                    });
                  }}
                  disabled={selectedPage == null}
                  style={{
                    height: 32,
                    padding: "0 12px",
                    borderRadius: 999,
                    border: "1px solid rgba(148,163,184,0.8)",
                    background: "rgba(15,23,42,0.9)",
                    fontWeight: 600,
                    fontSize: 11,
                    color:
                      selectedPage == null ? "#6b7280" : "#e5e7eb",
                    cursor: selectedPage != null ? "pointer" : "not-allowed",
                    transition:
                      "transform 120ms ease-out, box-shadow 120ms ease-out, background 140ms ease-out",
                  }}
                  title="Remove background image on this page only"
                  onMouseDown={(e) =>
                    selectedPage != null &&
                    (e.currentTarget.style.transform = "scale(0.97)")
                  }
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  Remove BG (this page)
                </button>

                <button
                  onClick={handleSaveEditedPages}
                  style={{
                    height: 32,
                    padding: "0 12px",
                    borderRadius: 999,
                    border: "1px solid #10b981",
                    background:
                      "linear-gradient(135deg,#059669,#22c55e)",
                    color: "#f9fafb",
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: "pointer",
                    boxShadow: "0 8px 22px rgba(22,163,74,0.6)",
                    transition:
                      "transform 120ms ease-out, box-shadow 120ms ease-out, background 140ms ease-out",
                  }}
                  title="Save edited pages"
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                    borderRadius: 999,
                    border: "1px solid rgba(148,163,184,0.8)",
                    background: "rgba(15,23,42,0.9)",
                    fontWeight: 600,
                    fontSize: 11,
                    color:
                      selectedPage == null ? "#6b7280" : "#e5e7eb",
                    cursor: selectedPage != null ? "pointer" : "not-allowed",
                    transition:
                      "transform 120ms ease-out, box-shadow 120ms ease-out, background 140ms ease-out",
                  }}
                  title="Restore background image on this page"
                  onMouseDown={(e) =>
                    selectedPage != null &&
                    (e.currentTarget.style.transform = "scale(0.97)")
                  }
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  Restore BG (this page)
                </button>
              </>
            ) : null}
          </div>
        </div>


        <div style={{
          display: "grid",
          gridTemplateColumns: "360px 1fr",
          gap: 16,
          alignItems: "stretch",            // 👈 row ko full height tak khinch do
          minHeight: "calc(100vh - 140px)", // 👈 header ki height ke hisaab se adjust (120/130 bhi kar sakte ho)
        }}>
          {showEditorPanel ? (
            <EditorPanel onClose={() => setShowEditorPanel(false)} />
          ) : showThemePanel ? (
            <ThemePanel
              selectedThemeKey={selectedThemeKey}
              setSelectedThemeKey={setSelectedThemeKey}
              themeKeys={themeKeys}
              pageThemes={pageThemes}
              effectiveTheme={effectiveTheme}
              currentThemeId={book?.theme_json?.id}
              onApplyBackgroundUrl={handleApplyBgUrl}
              apply={apply}
              setApply={setApply}
              custom={custom}
              setCustom={setCustom}
              svgColorMap={svgColorMap}
              setSvgColorMap={setSvgColorMap}
              onClose={() => setShowThemePanel(false)}
              onPickImage={handlePickImage}
              onPickImageUrl={handlePickImageUrl}
              coverFile={coverFile}
              savingCover={savingCover}
              onSaveCover={handleSaveCover}
              wmDefault={(book?.title || "TBM+").toUpperCase()}
              bgScope={bgScope}
              setBgScope={setBgScope}
              bookId={bookId}
            />
          ) : (
            <>
              <aside
                ref={tocRef}
                style={{
                  position: "sticky",
                  top: 16,
                  alignSelf: "stretch",

                  maxHeight: "calc(100vh - 140px)",
                  background:
                    "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(129,140,248,0.22))",
                  // outer shell + animation
                  padding: 1,
                  borderRadius: 18,

                  opacity: tocReady ? 1 : 0,
                  transform: tocReady ? "translateX(0)" : "translateX(-24px)",
                  transition: "opacity 220ms ease-out, transform 220ms ease-out",

                  overflow: "hidden",
                }}
              >
                {/* inner dark card */}
                <div
                  style={{
                    height: "100%",
                    borderRadius: 16,

                    border: "3px solid rgba(148,163,184,0.2)",
                    padding: 12,
                    overflowY: "auto",
                    overflowX: "hidden",
                    color: "#e5e7eb",
                  }}
                >
                  {/* header */}
                  <div
                    style={{
                      marginBottom: 10,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 13,
                        letterSpacing: 0.25,
                        textTransform: "uppercase",
                        color: "#000000ff",
                      }}
                    >
                      Contents
                    </div>
                    <div style={{ fontSize: 11, color: "#000000ff" }}>
                      Jump quickly to any unit or lesson.
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
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

                      const grouped = Array.from(map.entries()).map(
                        ([unitTitle, lessonsMap]) => ({
                          unit: unitTitle,
                          lessons: Array.from(lessonsMap.entries()).map(
                            ([title, firstPage]) => ({
                              title,
                              firstPage,
                            })
                          ),
                        })
                      );

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
                        .filter(
                          (u) =>
                            String(u.unit || "").trim().toLowerCase() !== "contents"
                        )
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
                            <div
                              key={u.unit}
                              style={{
                                padding: 8,
                                borderRadius: 12,
                                background:
                                  " #ffffffff",
                                border: "1px solid rgba(148,163,184,0.4)",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: 700,
                                  fontSize: 12,
                                  color: "#000000ff",
                                  marginBottom: 6,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  gap: 8,
                                }}
                              >
                                <span
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {u.unit || "Unit"}
                                </span>

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
                                      title={
                                        l.title ? l.title : `Go to page ${l.firstPage}`
                                      }
                                      style={{
                                        textAlign: "left",
                                        cursor: "pointer",
                                        fontSize: 12,
                                        border: `1px solid ${isActive
                                          ? effectiveTheme?.accent || "#38bdf8"
                                          : "rgba(0, 0, 0, 0.6)"
                                          }`,
                                        borderLeft: `6px solid ${isActive
                                          ? effectiveTheme?.accent || "#38bdf8"
                                          : "#4f46e5"
                                          }`,
                                        borderRadius: 10,
                                        padding: "8px 10px",
                                        background: isActive
                                          ? "rgba(255, 255, 255, 0.15)"
                                          : "rgba(0, 0, 0, 0)",
                                        color: isActive ? "#000000ff" : "#050505ff",
                                        boxShadow: isActive
                                          ? "0 4px 12px rgba(56,189,248,.35)"
                                          : "none",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 8,
                                        transition:
                                          "transform 120ms ease-out, box-shadow 120ms ease-out, background 120ms ease-out, border-color 120ms ease-out",
                                      }}
                                      onMouseDown={(e) =>
                                        (e.currentTarget.style.transform = "scale(0.98)")
                                      }
                                      onMouseUp={(e) =>
                                        (e.currentTarget.style.transform = "scale(1)")
                                      }
                                      onMouseLeave={(e) =>
                                        (e.currentTarget.style.transform = "scale(1)")
                                      }
                                    >
                                      <div
                                        style={{
                                          fontWeight: 600,
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                        }}
                                      >
                                        {l.title}
                                      </div>
                                      <span
                                        style={{
                                          fontSize: 11,
                                          color: isActive ? "#000000ff" : "#9ca3af",
                                          flexShrink: 0,
                                        }}
                                      >
                                        p. {l.firstPage}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        });
                    })()}
                  </div>
                </div>
              </aside>


              {zoomSrc ? (
                <ImageMagnifierOverlay src={zoomSrc} onClose={() => setZoomSrc("")} initialScale={1} />
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
              fontSize={14}
              deviceDimensions={{ width: 794 }}
              theme={effectiveTheme}
              onPageInView={setCurrentPage}
              editable={showEditorPanel}
              imageUrl={finalCoverSrc}
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

