"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Settings, BookOpen, Layout, Eye } from "lucide-react";
import { OriginalFlipBookCSS } from "@/components/ViewBook/OriginalFlipBook";
import { DocView } from "@/components/ViewBook/DocView";

/* ============== API ============== */
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

/* ========== helpers ========== */
function normalizeQuestions(q) {
  if (!q) return "";
  if (Array.isArray(q)) return q.map((x, i) => `${i + 1}. ${String(x ?? "").trim()}`).join("\n");
  if (typeof q === "object") {
    const vals = Object.values(q).map(v => String(v ?? "").trim()).filter(Boolean);
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

/* ========= build blocks for each lesson =========
   REQUIRED ORDER (as per your request):
   1) Text
   2) Content Summary
   3) Questions
*/
function addOptionSpacing(s) {
  if (!s) return "";
  const lines = String(s).split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    out.push(line);
    // If this line is an option like "A) ..." or "- A) ...", add a blank line after it
    if (/^\s*-?\s*[A-D]\)\s/i.test(line)) {
      // don't double-insert if next line is already blank
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
    const textVal    = pickFirst(it, ["text", "body", "content.text"]);
    const summaryVal = pickFirst(it, ["content_summary", "summary", "content.content_summary"]);
    const quesVal    = pickFirst(it, ["questions", "content.questions"]);

    // 1) Text
    const text = textVal ? `${String(textVal).trim()}` : "";

    // 2) Content Summary
    const summary = summaryVal ? `#### Content Summary\n\n${String(summaryVal).trim()}` : "";

    // 3) Questions — keep original markdown, just add blank line between options
    const qRaw = normalizeQuestions(quesVal);
    const qSpaced = addOptionSpacing(qRaw);
    const questions = qSpaced ? `#### Questions\n\n${qSpaced}` : "";

    // Compose: Text → Summary → Questions
    let block = [text, summary, questions].filter(Boolean).join("\n\n");

    // Fallbacks at lesson-level
    if (!block && items.length === 1) {
      const lText = pickFirst(lesson, ["text", "generated_prompt"]);
      const lSum  = pickFirst(lesson, ["content_summary", "lesson_description"]);
      const lQ    = addOptionSpacing(normalizeQuestions(pickFirst(lesson, ["questions"])));

      const t = lText ? `${String(lText).trim()}` : "";
      const s = lSum  ? `#### Content Summary\n\n${String(lSum).trim()}` : "";
      const q = lQ    ? `#### Questions\n\n${lQ}` : "";
      block = [t, s, q].filter(Boolean).join("\n\n");
    }

    if (block) blocks.push(block);
  });

  return blocks;
}

function _escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function bookToPages(book) {
  const pages = [];

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

  /* ---------- CONTENTS PAGE (HTML table, book-like) ---------- */
  const tocRows = units.map((u, ui) => {
    const uTitle = u.title || `Unit ${ui + 1}`;
    const uPages = u.number_of_pages ?? "—";
    const lessonChips = (u.lessons || [])
      .map((l, li) => {
        const num = `${ui + 1}.${li + 1}`;
        const title = l.title || `Lesson ${li + 1}`;
        return `<span style="
          display:inline-block;
          padding:4px 8px;
          margin:2px 6px 2px 0;
          border:1px solid #e5e7eb;
          border-radius:9999px;
          font-size:12px;
          line-height:1.1;
          white-space:nowrap;
        ">${num} ${_escapeHtml(title)}</span>`;
      })
      .join("");


    return `
      <tr >
        <td style="padding:10px 12px; width:42px; color:#64748b; font-weight:600;">${ui + 1}.</td>
        <td style="padding:10px 12px; font-weight:700; color:#0f172a;">
          ${_escapeHtml(uTitle)}
        </td>
        <td style="padding:10px 12px; width:120px; text-align:right; color:#334155;">
          ${uPages} pages
        </td>
      </tr>
      ${lessonChips
        ? `<tr >
            <td></td>
            <td colspan="2" style="padding:0 12px 12px 12px;">${lessonChips}</td>
          </tr>`
        : ""}
    `;
  }).join("");

  pages.push(
    [
      `<div style="padding:8px 0 4px 0;"><h1 style="margin:0; font-size:2.25rem; font-weight:800; color:#0f172a;">Contents</h1></div>`,
      `<table style="
        width:100%;
        border-collapse:separate;
        border-spacing:0;
        margin-top:10px;
        border:1px solid #e5e7eb;
        border-radius:12px;
        overflow:hidden;
      ">
        <thead>
          <tr>
            <th style="text-align:left; padding:12px 12px; width:42px; color:#334155; font-weight:600; border-bottom:1px solid #e5e7eb;">#</th>
            <th style="text-align:left; padding:12px 12px; color:#334155; font-weight:600; border-bottom:1px solid #e5e7eb;">Unit</th>
            <th style="text-align:right; padding:12px 12px; color:#334155; font-weight:600; border-bottom:1px solid #e5e7eb; width:120px;">Pages</th>
          </tr>
        </thead>
        <tbody>
          ${tocRows || `<tr><td colspan="3" style="padding:16px 12px; color:#64748b;">No units available</td></tr>`}
        </tbody>
      </table>`
    ].join("\n\n")
  );

  /* ---------- UNIT INTRO PAGES (centered hero + 2-col lessons) ---------- */
  units.forEach((u, ui) => {
    const uTitle = u.title || `Unit ${ui + 1}`;
    const uPages = u.number_of_pages ?? "—";
    const uDesc = u.description || "";

    const lessonsHTML = (u.lessons || [])
      .map((l, li) => {
        const num = `${ui + 1}.${li + 1}`;
        const title = l.title || `Lesson ${li + 1}`;
        return `<li style="break-inside:avoid; margin:0 0 10px 0;">${num} ${_escapeHtml(title)}</li>`;
      })
      .join("");

    pages.push(
      [
        // Hero (vertically centered)
        `<section style="
          min-height:58vh;
          display:flex;
          align-items:center;
          justify-content:center;
          text-align:center;
          border-radius:12px;
        ">
          <div style="padding:20px 16px; max-width:820px;">
            <h1 style="margin:0 0 10px 0; font-size:2.5rem; font-weight:800; letter-spacing:.2px; color:#0f172a;">
              ${_escapeHtml(uTitle)}
            </h1>
            <p style="margin:0; color:#475569; font-size:14px;">Estimated pages: ${uPages}</p>
            ${
              uDesc
                ? `<p style="margin:14px auto 0; max-width:720px; color:#334155; line-height:1.7;">
                     ${_escapeHtml(uDesc)}
                   </p>`
                : ``
            }
          </div>
        </section>`,

        // Lessons header + two-column list
        `<div style="margin-top:18px;">
          <h3 style="margin:0 0 10px 0; font-size:1.125rem; font-weight:700; color:#0f172a;">Lessons</h3>
          ${
            lessonsHTML
              ? `<ul style="columns:2; column-gap:28px; margin:0; padding-left:1.25rem; list-style:disc;">
                   ${lessonsHTML}
                 </ul>`
              : `<p style="margin:0; color:#64748b;">No lessons</p>`
          }
        </div>`
      ].join("\n\n")
    );

    /* ---------- LESSON PAGES (your existing logic) ---------- */
    const blocks = blocksFromLesson(u); // if your blocks function takes lesson, call for each lesson below

    (u.lessons || []).forEach((l, li) => {
      const lTitle = l.title || `Lesson ${li + 1}`;
      const lPages = l.number_of_pages ?? "—";
      const blocks = blocksFromLesson(l);

      if (blocks.length) {
        blocks.forEach((b, bi) => {
          if (bi === 0) {
            pages.push(
              `### ${uTitle} • ${ui + 1}.${li + 1} ${lTitle}\n\n(Estimated pages: ${lPages})\n\n${b}`
            );
          } else {
            pages.push(`### ${lTitle} — Page ${bi + 1}\n\n${b}`);
          }
        });
      } else {
        pages.push(
          `### ${uTitle} • ${ui + 1}.${li + 1} ${lTitle}\n\n(Estimated pages: ${lPages})\n\n_No content available yet._`
        );
      }
    });
  });

  return pages;
}



// ...rest of component unchanged...


/* ================== Component (no TS) ================== */
export default function BookDetailsPage() {
  const { id } = useParams();
  const bookId = Number(id);

  const [book, setBook] = React.useState(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const [viewMode, setViewMode] = React.useState("doc"); // "doc" | "slide"
  const [zoom, setZoom] = React.useState(100);
  const [showSettings, setShowSettings] = React.useState(false);

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
    return () => { mounted = false; };
  }, [bookId]);

  const pages = React.useMemo(() => bookToPages(book), [book]);

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
    color: "#000",
    background: "#f8fafc",
    transition: "all 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/books" style={{ opacity: 0.85, display: "flex", alignItems: "center", gap: 8 }}>
              <ArrowLeft size={20} />
              Back
            </Link>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>{book.title}</h1>
              <p style={{ opacity: 0.8, marginTop: 4, fontSize: 14 }}>{book.description}</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 8, padding: 4 }}>
              <button
                onClick={() => setViewMode("flipbook")}
                style={{
                  padding: "6px 12px",
                  borderRadius: 4,
                  border: "none",
                  background: viewMode === "flipbook" ? "#2563eb" : "transparent",
                  color: viewMode === "flipbook" ? "#fff" : "#64748b",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <BookOpen size={14} />
                Flip Book
              </button>
              <button
                onClick={() => setViewMode("doc")}
                style={{
                  padding: "6px 12px",
                  borderRadius: 4,
                  border: "none",
                  background: viewMode === "doc" ? "#2563eb" : "transparent",
                  color: viewMode === "doc" ? "#fff" : "#64748b",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Layout size={14} />
                Doc
              </button>
              <button
                onClick={() => setViewMode("slide")}
                style={{
                  padding: "6px 12px",
                  borderRadius: 4,
                  border: "none",
                  background: viewMode === "slide" ? "#2563eb" : "transparent",
                  color: viewMode === "slide" ? "#fff" : "#64748b",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Eye size={14} />
                Slide
              </button>
            </div>

            <button
              onClick={() => setShowSettings((s) => !s)}
              style={{
                padding: "8px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: "#64748b",
                cursor: "pointer",
              }}
              title="Reading settings"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Settings */}
        {showSettings && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 20,
              marginBottom: 24,
              boxShadow: "0 4px 6px -1px rgba(0,0,0,.1)",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "#1f2937" }}>Reading Settings</h3>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(200px, 1fr) 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 14, fontWeight: 500, color: "#64748b", display: "block", marginBottom: 8 }}>
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

        {/* Reader */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${zoom / 100})`,
            transition: "transform 0.3s ease",
            transformOrigin: "center top",
          }}
        >
          {viewMode === "flipbook" && <OriginalFlipBookCSS pages={pages} soundEnabled={false} />}
          {viewMode === "doc" && (
            <DocView pages={pages} fontSize={16} deviceDimensions={{ width: 720, height: 520 }} />
          )}
          {viewMode === "slide" && (
            <SlideView pages={pages} fontSize={18} deviceDimensions={{ width: 720, height: 520 }} />
          )}
        </div>
      </div>
    </div>
  );
}
