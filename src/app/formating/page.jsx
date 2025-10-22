"use client";
import React, { useEffect, useMemo } from "react";
import Script from "next/script";

function _escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function markdownToHtml(src) {
  let s = src.replace(/\r\n?/g, "\n");

  const codeBlocks = [];
  s = s.replace(/```([\w-]+)?\n([\s\S]*?)```/g, (_, lang = "", code) => {
    const i = codeBlocks.push({ lang, code }) - 1;
    return `\uE000CODEBLOCK${i}\uE000`;
  });

  s = _escapeHtml(s);

  s = s
    .replace(/&lt;(strong)&gt;(.*?)&lt;\/strong&gt;/g, "<strong>$2</strong>")
    .replace(/&lt;(em)&gt;(.*?)&lt;\/em&gt;/g, "<em>$2</em>")
    .replace(/&lt;br\s*\/?&gt;/g, "<br>")
    .replace(/&lt;sub&gt;(.*?)&lt;\/sub&gt;/g, "<sub>$1</sub>")
    .replace(/&lt;sup&gt;(.*?)&lt;\/sup&gt;/g, "<sup>$1</sup>")
    .replace(
      /&lt;span\s+style="text-decoration:underline;"&gt;(.*?)&lt;\/span&gt;/g,
      '<span style="text-decoration:underline;">$1</span>'
    );

  s = s.replace(/^(?:[ \t]*)([-*_])\1\1(?:\1+)?[ \t]*$/gm, "<hr>");

  s = s.replace(/^[ \t]{0,3}(#{1,6})[ \t]+(.+?)\s*#*\s*$/gm, (_, H, t) => {
    const n = H.length;
    return `<h${n}>${t}</h${n}>`;
  });

  s = s.replace(
    /(^|\n)([^\n]+)\n[ \t]*(=+|-+)[ \t]*\n/g,
    (_m, lead, title, bar) => {
      const n = bar.trim().startsWith("=") ? 1 : 2;
      return `${lead}<h${n}>${title.trim()}</h${n}>\n`;
    }
  );

  s = s.replace(/^[ \t]*&gt;[ \t]?(.*)$/gm, "<blockquote>$1</blockquote>");

  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img alt="$1" src="$2" />');
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");

  s = s
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/_([^_]+)_|\*([^*]+)\*/g, (_m, a, b) => `<em>${a || b}</em>`)
    .replace(/~~([^~]+)~~/g, "<del>$1</del>");

  s = s
    .replace(/\$\$([\s\S]*?)\$\$/g, '<div class="math-block">$1</div>')
    .replace(/\$(.+?)\$/g, '<span class="math-inline">$1</span>');

  s = s.replace(
    /(^[ \t]*\d+\.\s+.*(?:\n(?!\n)(?![ \t]*\d+\. ).+)*)/gm,
    (block) => {
      const items = block
        .split("\n")
        .map((l) => l.replace(/^[ \t]*\d+\.\s+/, "").trim())
        .filter(Boolean);
      return `<ol>${items.map((i) => `<li>${i}</li>`).join("")}</ol>`;
    }
  );
  s = s.replace(
    /(^[ \t]*[-*+]\s+.*(?:\n(?!\n)(?![ \t]*[-*+]\s).+)*)/gm,
    (block) => {
      const items = block
        .split("\n")
        .map((l) => l.replace(/^[ \t]*[-*+]\s+/, "").trim())
        .filter(Boolean);
      return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
    }
  );

  s = s.replace(
    /(^\|.+\|\s*\n\|(?:[-: ]+\|)+\s*\n(?:\|.*\|\s*\n?)+)/gm,
    (tbl) => {
      const lines = tbl.trim().split("\n");
      const header = lines[0].slice(1, -1).split("|").map((c) => c.trim());
      const rows = lines
        .slice(2)
        .map((ln) => ln.slice(1, -1).split("|").map((c) => c.trim()));
      const thead = `<thead><tr>${header
        .map((h) => `<th>${h}</th>`)
        .join("")}</tr></thead>`;
      const tbody = `<tbody>${rows
        .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
        .join("")}</tbody>`;
      return `<table>${thead}${tbody}</table>`;
    }
  );

  s = s
    .split(/\n{2,}/)
    .map((block) => {
      if (
        /^(<h\d|<ul>|<ol>|<table>|<blockquote>|<hr>|<div class="math-block">|<pre>|<img|<p>|<code>)/.test(
          block.trim()
        )
      )
        return block;
      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");

  s = s.replace(/\uE000CODEBLOCK(\d+)\uE000/g, (_, i) => {
    const { lang, code } = codeBlocks[Number(i)];
    return `<pre><code class="language-${lang}">${_escapeHtml(code)}</code></pre>`;
  });

  s = s
    .replace(
      /<h1>(.*?)<\/h1>/g,
      '<h1 class="text-4xl md:text-5xl font-extrabold mt-6 mb-3">$1</h1>'
    )
    .replace(
      /<h2>(.*?)<\/h2>/g,
      '<h2 class="text-3xl md:text-4xl font-extrabold mt-6 mb-3">$1</h2>'
    )
    .replace(
      /<h3>(.*?)<\/h3>/g,
      '<h3 class="text-2xl font-bold mt-5 mb-2.5">$1</h3>'
    )
    .replace(
      /<h4>(.*?)<\/h4>/g,
      '<h4 class="text-xl font-bold mt-4 mb-2">$1</h4>'
    )
    .replace(
      /<h5>(.*?)<\/h5>/g,
      '<h5 class="text-lg font-semibold mt-3.5 mb-1.5">$1</h5>'
    )
    .replace(
      /<h6>(.*?)<\/h6>/g,
      '<h6 class="text-base font-semibold tracking-wide mt-3 mb-1">$1</h6>'
    )
    .replace(
      /<pre>/g,
      '<pre class="bg-slate-900 text-slate-200 p-3 rounded-lg overflow-auto my-4">'
    )
    .replace(
      /<code>(.*?)<\/code>/g,
      '<code class="bg-slate-100 dark:bg-slate-800 text-slate-200 rounded px-1 py-0.5 font-mono">$1</code>'
    )
    .replace(
      /<table>/g,
      '<table class="w-full border-collapse my-4 text-sm">'
    )
    .replace(
      /<th>/g,
      '<th class="border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 dark:text-slate-200 text-left font-semibold">'
    )
    .replace(
      /<td>/g,
      '<td class="border border-slate-200 dark:border-slate-700 p-2 align-top">'
    )
    .replace(
      /<blockquote>/g,
      '<blockquote class="border-l-4 border-slate-200 dark:border-slate-700 ps-4 py-2 my-4 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 rounded">'
    )
    .replace(
      /<hr>/g,
      '<hr class="my-6 border-t border-slate-200 dark:border-slate-700">'
    )
    .replace(
      /<a /g,
      '<a class="text-blue-600 underline hover:no-underline" '
    )
    .replace(
      /<p>/g,
      '<p class="my-3 leading-7 text-[var(--foreground)]">'
    )
    .replace(/<ul>/g, '<ul class="my-3 list-disc ps-6">')
    .replace(/<ol>/g, '<ol class="my-3 list-decimal ps-6">')
    .replace(/<img /g, '<img class="max-w-full h-auto rounded" ');

  return s;
}

const data = [
  "# 🧩 Math/Markdown Demo",
  "",
  "**Bold**, *Italic*, ~~Strikethrough~~, and `inlineCode()`",
  "",
  "> 💡 **Note:** Ye demo string hai jisme saare formats ek saath dikhaye gaye hain.",
  "",
  "---",
  "",
  "## 🔗 Links & Images",
  "- Link: [OpenAI](https://openai.com)",
  "- Image: ![Alt text](https://example.com/image.png)",
  "",
  "## 🔢 Lists",
  "- Bullet 1",
  "- Bullet 2",
  "  - Nested",
  "1. Step one",
  "2. Step two",
  "",
  "## 🧱 Table",
  "| Key | Value |",
  "|-----|-------|",
  "| OS  | Linux |",
  "| App | FastAPI |",
  "",
  "## 💻 Code Block",
  "```js",
  "export const hello = (name) => console.log(`Hello, ${name}!`);",
  "```",
  "",
  "## 🧮 Math (LaTeX)",
  "Inline: $E = mc^2$  ",
  "Block:",
  "$$",
  "\\int_{0}^{\\pi} \\sin(x)\\,dx = 2",
  "$$",
  "",
  "## 🧷 HTML Emphasis",
  "<strong>Strong via HTML</strong>, <em>emphasis via HTML</em><br>",
  '<span style="text-decoration:underline;">Underlined</span> & H₂O with <sub>sub</sub>/<sup>sup</sup>.',
  "",
  "## 🏷️ Special Control-ish Tags (as plain text)",
  "Automation VEVENT:",
  "BEGIN:VEVENT",
  "SUMMARY:Demo Reminder",
  "DTSTART:20251008T093000",
  "RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR;BYHOUR=9;BYMINUTE=30;BYSECOND=0",
  "END:VEVENT",
  "",
  "---",
  "",
  "## 🎯 Mixed Example",
  "**Task:** Parse `<strong>HTML</strong>` + Markdown _together_ → then run:",
  "```bash",
  'pip install "fastapi[all]" uvicorn',
  "```",
  "> ✅ Success! and see [Docs](https://fastapi.tiangolo.com).",
  "",
  "_The End_ ✨",
].join("\n");

export default function MarkdownDemoPage() {
  const html = useMemo(() => markdownToHtml(data), []);

  useEffect(() => {
    const k = (globalThis /** @type {any} */).katex;
    if (!k) return;
    document.querySelectorAll(".math-inline").forEach((el) => {
      const tex = el.textContent || "";
      el.innerHTML = k.renderToString(tex, {
        throwOnError: false,
        displayMode: false,
      });
    });
    document.querySelectorAll(".math-block").forEach((el) => {
      const tex = el.textContent || "";
      el.innerHTML = k.renderToString(tex, {
        throwOnError: false,
        displayMode: true,
      });
    });
  }, [html]);

  return (
    <main className="px-6 py-6 math-scope">
      {/* <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
        crossOrigin="anonymous"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      /> */}
      <style>{`
        .katex-display { overflow-x: auto; padding: .25rem 0; }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
