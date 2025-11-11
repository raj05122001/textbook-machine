"use client";

import React from "react";
import TextFormat, { markdownToHtml } from "@/components/format/TextFormat";


function renderTemplate(html, ctx = {}) {
  if (!html) return "";
  return String(html)
    .replace(/\{\{\s*page\s*\}\}/g, String(ctx.page ?? ""))
    .replace(/\{\{\s*total\s*\}\}/g, String(ctx.total ?? ""))
    .replace(/\{\{\s*unit\s*\}\}/g, String(ctx.unit ?? ""))
    .replace(/\{\{\s*class\s*\}\}/g, String(ctx.className ?? ""))
    .replace(/\{\{\s*date\s*\}\}/g, String(ctx.date ?? ""))
    .replace(/\{\{\s*title\s*\}\}/g, String(ctx.title ?? ""))
    .replace(/\{\{\s*subtitle\s*\}\}/g, String(ctx.subtitle ?? ""));
}

export default function DocView({
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
  autoFixSparsePages = true,
  sparseThresholdPx = 820,
  fixedPageHeightPx,
}) {
  const pageWidth = Math.min(deviceDimensions.width, 860);
  const pageMinHeight = Math.max(deviceDimensions.height, 980);
  const a4Height = Math.round(pageWidth * (297 / 210));
  const targetFixedHeight = fixedPageHeightPx || a4Height;
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
  const [sparseSet, setSparseSet] = React.useState(new Set());
  React.useLayoutEffect(() => {
    if (!pages?.length) return;
    const next = new Set();
    // Total page height infer karna: sheet div ka scrollHeight best signal hai
    pageRefs.current.forEach((el, idx) => {
      if (!el) return;
      const h = el.scrollHeight || el.getBoundingClientRect().height || 0;
      if (h < sparseThresholdPx) next.add(idx);
    });
    setSparseSet(next);
  }, [
    pages,
    fontSize,
    pageWidth,
    sparseThresholdPx,
    theme?.page_bg_image,
    theme?.header,
    theme?.footer,
    editable,
  ]);
  const hydratedOnceRef = React.useRef(new Set());
  const dirtyRef = React.useRef(new Set());
  const dirtyHandlersRef = React.useRef(new WeakMap());

  function bindDirtyGuards(el, idx) {
    if (!el) return;
    if (dirtyHandlersRef.current.has(el)) return;
    const handler = () => dirtyRef.current.add(idx);
    ["input", "blur", "paste", "keydown"].forEach((evt) =>
      el.addEventListener(evt, handler)
    );
    dirtyHandlersRef.current.set(el, handler);
  }

  function unbindDirtyGuards(el) {
    if (!el) return;
    const handler = dirtyHandlersRef.current.get(el);
    if (!handler) return;
    ["input", "blur", "paste", "keydown"].forEach((evt) =>
      el.removeEventListener(evt, handler)
    );
    dirtyHandlersRef.current.delete(el);
  }

  // Observe visible page (disabled while editing)
  React.useEffect(() => {
    if (!pages?.length) return;
    const opts = {
      root: null,
      rootMargin: "0px 0px -50% 0px",
      threshold: [0.33, 0.66, 1],
    };
    const io = new IntersectionObserver((entries) => {
      if (editable) return; // key guard
      let best = null;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
      }
      if (best?.target?.dataset?.page) {
        onPageInView(Number(best.target.dataset.page));
      }
    }, opts);

    pageRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [pages, onPageInView, editable]);

  // Hydrate editable HTML (track “dirty”)
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

      if (el.innerHTML !== nextHtml) el.innerHTML = nextHtml;
    });

    return () => {
      contentRefs.current.forEach((el) => unbindDirtyGuards(el));
    };
  }, [editable, pages]);

  // Collector for edited HTML
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

    try {
      if (collectEditedHTMLRef.current && !collectEditedHTMLRef.current.__initial) {
        if (editable && contentRefs.current?.length) {
          collectEditedHTMLRef.current.__initial = contentRefs.current.map((el) =>
            el ? el.innerHTML || "" : ""
          );
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

      {/* Optional cover image */}
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
              alt="Book Cover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "fill",
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
              // sirf sparse pages par height fix:
              height: autoFixSparsePages && sparseSet.has(i) ? targetFixedHeight : "auto",
              backgroundColor: theme?.page_bg_image ? "transparent" : pageBg,
              outline: editable && selectedPage === i + 1 ? "2px solid #2563eb" : "none",
              outlineOffset: 0,
              ...(theme?.page_bg_image && (bgScope === "all" || i === 0)
                ? bgDisabledPages?.has?.(i)
                  ? { backgroundImage: "none" }
                  : {
                    backgroundImage: `url("${theme.page_bg_image}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }
                : { backgroundImage: "none" }),
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: bgImg ? "transparent" : pageBg,
              }}
            >
              {accent ? <div style={{ height: 4, background: accent }} /> : null}
              {accent2 ? <div style={{ height: 4, background: accent2 }} /> : null}

              {editable && selectedPage === i + 1 ? (
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 10,
                    zIndex: 1,
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "2px 8px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
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
                padding: "18px 12px",
                fontSize,
                lineHeight: 1.7,
                color: textCol,
                backgroundColor: theme?.page_bg_image ? "transparent" : bodyBg,
                ...(theme?.page_bg_image
                  ? {}
                  : {
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(0,0,0,0.02) 31px, rgba(0,0,0,0.02) 32px)",
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
    </div>
  );
}
