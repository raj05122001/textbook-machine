"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import "katex/dist/katex.min.css";

/* -------------------- helpers -------------------- */
function _escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function _injectClass(tagName, html, classToAdd) {
  const re = new RegExp(`<${tagName}\\b([^>]*)>`, "gi");
  return html.replace(re, (_m, attrsRaw) => {
    let attrs = attrsRaw || "";
    if (/class="/i.test(attrs)) {
      attrs = attrs.replace(/class="([^"]*)"/i, (_m2, v) => `class="${v} ${classToAdd}"`);
    } else {
      attrs = `${attrs} class="${classToAdd}"`;
    }
    return `<${tagName}${attrs}>`;
  });
}

function normalizeEscapes(input) {
  if (!input) return "";
  let s = String(input);

  // standardize EOL
  s = s.replace(/\r\n?/g, "\n");

  // Escaped CRLF and individual CR/LF (any number of backslashes before r/n)
  s = s.replace(/\\+r\\+n/gi, "\n"); // \r\n, \\r\\n, \\\r\\\n -> \n
  s = s.replace(/\\+r/gi, "\n");     // \r, \\r, \\\r -> \n
  s = s.replace(/\\+n/gi, "\n");     // \n, \\n, \\\n, \\\\n -> \n

  // Backslash + real newline (e.g. "...\\" + actual \n) -> newline
  s = s.replace(/\\+\s*\n/g, "\n");

  // Tabs (choose "\t" or spaces)
  s = s.replace(/\\+t/gi, "\t");

  // Escaped quotes (optional)
  s = s.replace(/\\"/g, '"').replace(/\\'/g, "'");

  // Stray backslashes at end-of-line -> remove
  s = s.replace(/\\+(?=\s*\n|$)/g, "");

  // Collapse too many blank lines but keep paragraph breaks
  s = s.replace(/\n{3,}/g, "\n\n");

  return s;
}

/* Literal escape decoder: turns "\\n" into real newlines etc. */
function softDecodeEscapes(s) {
  if (!s) return "";
  s = String(s);

  // 1) CRLF sequences first (any number of backslashes before r and n)
  //    e.g. \r\n, \\r\\n, \\\r\\\n  ->  \n
  s = s.replace(/\\+r\\+n/gi, "\n");

  // 2) Lone CR or LF (any number of backslashes before r OR n)
  //    e.g. \n, \\n, \\\n, \\\\n  ->  \n
  s = s.replace(/\\+r/gi, "\n");
  s = s.replace(/\\+n/gi, "\n");

  // 3) Tabs (any number of backslashes before t)
  //    e.g. \t, \\t, \\\t -> 4 spaces (adjust if you prefer)
  s = s.replace(/\\+t/gi, "    ");

  // 4) Common escaped quotes -> real quotes (optional)
  s = s.replace(/\\"/g, '"').replace(/\\'/g, "'");

  return s;
}


/* -------------------- Markdown + HTML parser -------------------- */
function markdownToHtml(src) {
  if (!src) return "";
  // 0) fix double-escaped input
  let s = softDecodeEscapes(String(src));

  // let s = String(src).replace(/\r\n?/g, "\n");

  // 1) protect fenced code first
  const codeBlocks = [];
  s = s.replace(/```([\w-]+)?\n([\s\S]*?)```/g, (_, lang = "", code) => {
    const i = codeBlocks.push({ lang, code }) - 1;
    return `\uE000CODEBLOCK${i}\uE000`;
  });

  // 2) ab mixed escapes ko saaf karo
  s = normalizeEscapes(s);

  // 0.5) normalize CRLF
  s = s.replace(/\r\n?/g, "\n");

  // pre-normalize inline headings / lists
  s = s.replace(/(\S)\s+(#{1,6}\s)/g, (_m, a, b) => `${a}\n${b}`);
  s = s.replace(/(?:^|\n)([-*]\s[^\n]+(?:\s[-*]\s[^\n]+)+)/g, (block) =>
    block.replace(/\s([-*])\s(?=[^\n])/g, "\n$1 ")
  );
  // s = s.replace(/([^\n])\s(\d+)\.\s/g, "$1\n$2. ");

  // protect allowed raw HTML tags using tokens (restore later)
  const ALLOWED_TAG = /<(\/?(?:div|span|p|h[1-6]|table|thead|tbody|tr|th|td|img|a|em|strong|blockquote|ul|ol|li|hr|br|section))(\s[^>]*)?>/gi;
  const tagTokens = [];
  s = s.replace(ALLOWED_TAG, (_m, name, attrs = "") => {
    const original = `<${name}${attrs || ""}>`;
    const i = tagTokens.push(original) - 1;
    return `\uE000TAG${i}\uE000`;
  });

  // escape everything, then unescape the tags we tokenized later
  s = _escapeHtml(s);

  // hr
  s = s.replace(/^(?:[ \t]*)([-*_])\1\1(?:\1+)?[ \t]*$/gm, "<hr>");

  // ATX headings
  s = s.replace(/^[ \t]{0,3}(#{1,6})[ \t]+(.+?)\s*#*\s*$/gm, (_, H, t) => `<h${H.length}>${t}</h${H.length}>\n`);
  // Setext headings
  s = s.replace(
    /(^|\n)([^\n]+)\n[ \t]*(=+|-+)[ \t]*\n/g,
    (_m, lead, title, bar) => `${lead}<h${bar.trim().startsWith("=") ? 1 : 2}>${title.trim()}</h${bar.trim().startsWith("=") ? 1 : 2}>\n`
  );

  // blockquotes
  s = s.replace(/^[ \t]*&gt;[ \t]?(.*)$/gm, "<blockquote>$1</blockquote>");

  // images / links / inline code
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img alt="$1" src="$2" />');
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");

  // emphasis / strong / strike
  s = s
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/_([^_]+)_|\*([^*]+)\*/g, (_m, a, b) => `<em>${a || b}</em>`)
    .replace(/~~([^~]+)~~/g, "<del>$1</del>");

  // math
  s = s
    .replace(/\$\$([\s\S]*?)\$\$/g, '<div class="math-block">$1</div>')
    .replace(/\$(.+?)\$/g, '<span class="math-inline">$1</span>')
    .replace(/\\\[((?:.|\n)*?)\\\]/g, '<div class="math-block">$1</div>')
    .replace(/\\\((.+?)\\\)/g, '<span class="math-inline">$1</span>');

  // ordered lists
  s = s.replace(/(^\s*\d+\.\s+.*(?:\n\s*\d+\.\s+.*)*)/gm, (block) => {
    const lines = block.split("\n").filter((l) => /^\s*\d+\.\s+/.test(l));
    if (!lines.length) return block;
    const start = parseInt((lines[0].match(/^\s*(\d+)\./) || [])[1] || "1", 10);
    const items = lines.map((l) => l.replace(/^\s*\d+\.\s+/, "").trim()).filter(Boolean);
    return `<ol start="${start}">${items.map((i) => `<li>${i}</li>`).join("")}</ol>`;
  });

  // unordered lists
  s = s.replace(/(^\s*[-*+]\s+.*(?:\n\s*[-*+]\s+.*)*)/gm, (block) => {
    const items = block
      .split("\n")
      .filter((l) => /^\s*[-*+]\s+/.test(l))
      .map((l) => l.replace(/^\s*[-*+]\s+/, "").trim())
      .filter(Boolean);
    return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
  });

  // pipe tables
  s = s.replace(/(^\|.+\|\s*\n\|(?:[-: ]+\|)+\s*\n(?:\|.*\|\s*\n?)+)/gm, (tbl) => {
    const lines = tbl.trim().split("\n");
    const header = lines[0].slice(1, -1).split("|").map((c) => c.trim());
    const rows = lines.slice(2).map((ln) => ln.slice(1, -1).split("|").map((c) => c.trim()));
    const thead = `<thead><tr>${header.map((h) => `<th>${h}</th>`).join("")}</tr></thead>`;
    const tbody = `<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>`;
    return `<table>${thead}${tbody}</table>`;
  });

  // paragraph wrapping (skip if block starts with element or token)
  s = s
    .split(/\n{2,}/)
    .map((block) => {
      const t = block.trim();
      if (/^(<h\d|<ul>|<ol\b|<table|<thead|<tbody|<tr|<th\b|<td\b|<blockquote>|<hr>|<div\b|<span\b|<pre>|<img|<p>|<code>|\uE000TAG\d+\uE000)/.test(t))
        return block;
      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");

  // restore protected HTML tags
  s = s.replace(/\uE000TAG(\d+)\uE000/g, (_m, i) => tagTokens[Number(i)] ?? "");

  // images: absolutize + sizing
  const IMG_MAX_W = "100%";
  const IMG_MAX_H = "420px";
  const BASE_IMG = "https://tbm-plus.s3.amazonaws.com/";
  function absolutizeSrc(url) {
    if (!url) return url;
    if (/^https?:\/\//i.test(url) || /^data:/i.test(url)) return url;
    return BASE_IMG + url.replace(/^\/+/, "");
  }
  s = s.replace(/<img\s+([^>]*?)>/gi, (_m, attrs) => {
    let a = (attrs || "").trim();
    a = a.replace(/src="([^"]*)"/i, (_m2, src) => `src="${absolutizeSrc(src)}"`);
    const styleAdd = `max-width:${IMG_MAX_W};height:auto;max-height:${IMG_MAX_H};object-fit:contain;display:block;margin:16px auto`;
    if (/style="/i.test(a)) a = a.replace(/style="([^"]*)"/i, (_m3, v) => `style="${v};${styleAdd}"`);
    else a += ` style="${styleAdd}"`;
    if (/class="/i.test(a)) a = a.replace(/class="([^"]*)"/i, (_m4, v) => `class="${v} max-w-full h-auto rounded"`);
    else a += ` class="max-w-full h-auto rounded"`;
    if (!/onerror="/i.test(a)) a += ` onerror="this.style.display='none'"`;
    return `<img ${a}>`;
  });

  // clean stray image fragments
  s = s.replace(/\n?images\/[^\s"]+\.(?:png|jpe?g|gif|webp)"?>/gi, "");

  // presentational classes
  s = _injectClass("table", s, "w-full border-collapse my-4 text-sm");
  s = _injectClass("th", s, "border border-slate-200 p-2 bg-slate-50 text-left font-semibold");
  s = _injectClass("td", s, "border border-slate-200 p-2 align-top");
  s = _injectClass("ol", s, "my-3 list-decimal ps-6");
  s = _injectClass("ul", s, "my-3 list-disc ps-6");

  s = s
    .replace(/<h1>(.*?)<\/h1>/g, '<h1 class="text-4xl md:text-5xl font-extrabold mt-6 mb-3">$1</h1>')
    .replace(/<h2>(.*?)<\/h2>/g, '<h2 class="text-3xl md:text-4xl font-extrabold mt-6 mb-3">$1</h2>')
    .replace(/<h3>(.*?)<\/h3>/g, '<h3 class="text-2xl font-bold mt-5 mb-2.5">$1</h3>')
    .replace(/<h4>(.*?)<\/h4>/g, '<h4 class="text-xl font-bold mt-4 mb-2">$1</h4>')
    .replace(/<h5>(.*?)<\/h5>/g, '<h5 class="text-lg font-semibold mt-3.5 mb-1.5">$1</h5>')
    .replace(/<h6>(.*?)<\/h6>/g, '<h6 class="text-base font-semibold tracking-wide mt-3 mb-1">$1</h6>')
    .replace(/<pre>/g, '<pre class="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-auto my-4">')
    .replace(/<code>(.*?)<\/code>/g, '<code class="bg-slate-100 text-slate-700 rounded px-1 py-0.5 font-mono">$1</code>')
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-slate-200 ps-4 py-2 my-4 text-slate-700 bg-slate-50 rounded">')
    .replace(/<hr>/g, '<hr class="my-6 border-t border-slate-200">')
    .replace(/<a /g, '<a class="text-blue-600 underline hover:no-underline" ')
    .replace(/<p>/g, '<p class="my-3 leading-7 text-slate-700">');

  return s;
}

/* -------------------- Component -------------------- */
export default function TextFormat({ data }) {
  const html = useMemo(() => markdownToHtml(data), [data]);
  const [katex, setKatex] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const mod = await import("katex");
      if (mounted) setKatex(mod.default ?? mod);
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!katex || !rootRef.current) return;
    rootRef.current.querySelectorAll(".math-inline").forEach((el) => {
      const tex = el.textContent || "";
      el.innerHTML = katex.renderToString(tex, { throwOnError: false, displayMode: false });
    });
    rootRef.current.querySelectorAll(".math-block").forEach((el) => {
      const tex = el.textContent || "";
      el.innerHTML = katex.renderToString(tex, { throwOnError: false, displayMode: true });
    });
  }, [html, katex]);

  return (
    <main className="px-6 py-6 math-scope">
      <style>{`
        .katex-display{overflow-x:auto;padding:.25rem 0;}
        .math-scope img{ border-radius:.5rem; }
        .math-scope ol li, .math-scope ul li { margin-bottom: 8px; }
        .math-scope table { border-collapse: collapse; width: 100%; }
      `}</style>
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
