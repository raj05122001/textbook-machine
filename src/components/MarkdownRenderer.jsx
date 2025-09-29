// components/MarkdownRenderer.jsx
"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw"; // keep only if backend may send HTML
import "katex/dist/katex.min.css";

// Normalize a bit (entities + double-escaped math)
function normalize(str = "") {
  const txt = str
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");

  return txt
    .replaceAll("\\\\(", "\\(")
    .replaceAll("\\\\)", "\\)")
    .replaceAll("\\\\[", "\\[")
    .replaceAll("\\\\]", "\\]");
}

export default function MarkdownRenderer({ content = "" }) {
  const safe = useMemo(() => normalize(content), [content]);

  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={{
          // open links in new tab (replacement for removed `linkTarget`)
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {safe}
      </ReactMarkdown>
    </div>
  );
}
