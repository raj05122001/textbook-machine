"use client";

import React from "react";
import { motion } from "framer-motion";

function XBadge({ size = 80 }) {
  const R = 36; 
  const C = 2 * Math.PI * R;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full bg-red-500/20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.9, 1.15, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.8 }}
      />
      <svg viewBox="0 0 100 100" className="relative drop-shadow">
        <motion.circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#ef4444"
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        {/* filled circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="#ef4444"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.05 }}
        />
        {/* X path (two strokes draw-in) */}
        <motion.path
          d="M34 34 L66 66"
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={C}
          strokeDashoffset={C}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut", delay: 0.25 }}
        />
        <motion.path
          d="M66 34 L34 66"
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={C}
          strokeDashoffset={C}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut", delay: 0.45 }}
        />
      </svg>
    </div>
  );
}

function FailedRow({
  title = "Generation failed",
  subtitle = "Something went wrong. Please check inputs and try again.",
}) {
  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden border rounded-2xl bg-white p-4 sm:p-5">
      {/* No confetti for failed state */}
      <div className="flex items-center gap-4">
        <XBadge size={84} />
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">{title}</h2>
          <p className="mt-1 text-sm sm:text-base text-neutral-600">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default function FailedPreview() {
  return <FailedRow />;
}
