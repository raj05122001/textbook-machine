// components/GeneratedPayloadModal.jsx
"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import TextFormat from "./format/TextFormat";

export default function GeneratedPayloadModal({ open, onClose, payload }) {
  if (!open) return null;

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const summary  = payload?.content_summary ?? "";
  const content  = payload?.text ?? "";
  const question = payload?.questions ?? "";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Generated Content</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {summary ? <TextFormat data={summary} /> : <p>—</p>}
          {content ? <TextFormat data={content} /> : <p>—</p>}
          {question ? <TextFormat data={question} /> : <p>—</p>}

          {/* <section>
            <div className="prose prose-slate max-w-none">
              {summary ? <TextFormat data={summary} /> : <p>—</p>}
            </div>
          </section>

          <section>
            <div className="prose prose-slate max-w-none">
              {content ? <TextFormat data={content} /> : <p>—</p>}
            </div>
          </section>
          
          <section>
            <div className="prose prose-slate max-w-none">
              {question ? <TextFormat data={question} /> : <p>—</p>}
            </div>
          </section> */}
        </div>
      </div>
    </div>
  );
}
