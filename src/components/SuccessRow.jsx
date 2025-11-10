"use client";

import React from "react";
import { motion } from "framer-motion";


const rnd = (min = 0, max = 1) => Math.random() * (max - min) + min;

function useConfetti(count = 18) {
    const [pieces, setPieces] = React.useState([]);
    React.useEffect(() => {
        setPieces(
            Array.from({ length: count }).map((_, i) => ({
                id: i,
                x: rnd(5, 95),
                size: rnd(6, 10),
                delay: rnd(0, 0.25),
                dur: rnd(0.9, 1.3),
                hue: Math.floor(rnd(0, 360)),
                rot: rnd(-120, 120),
                fall: rnd(30, 60),
            }))
        );
    }, [count]);
    return pieces;
}

function Confetti({ active = true }) {
    const pieces = useConfetti(22);
    if (!active) return null;
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {pieces.map((p) => (
                <motion.span
                    key={p.id}
                    initial={{ x: `${p.x}%`, y: -16, opacity: 0, rotate: p.rot }}
                    animate={{ y: `${p.fall}%`, opacity: [0, 1, 1, 0], rotate: p.rot + 360 }}
                    transition={{ duration: p.dur, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-0 block rounded"
                    style={{ width: p.size, height: p.size * 0.35, background: `hsl(${p.hue} 90% 55%)` }}
                />
            ))}
        </div>
    );
}

/* ------------------------------ CheckBadge (animated) ------------------------------ */
function CheckBadge({ size = 80 }) {
    const R = 36; // inner circle radius used for path calc
    const C = 2 * Math.PI * R;
    return (
        <div className="relative" style={{ width: size, height: size }}>
            {/* pulse halo */}
            <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full bg-emerald-500/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.9, 1.15, 1], opacity: [0, 1, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.8 }}
            />
            <svg viewBox="0 0 100 100" className="relative drop-shadow">
                {/* outer ring */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="#22c55e"
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
                    fill="#22c55e"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.05 }}
                />
                {/* check path (draw) */}
                <motion.path
                    d="M30 52 L45 66 L71 36"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={C}
                    strokeDashoffset={C}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
                />
            </svg>
        </div>
    );
}

function SuccessRow({
title="Book generated successfully!",
  subtitle="You can view updates below and download when ready.",
    confetti = true,
}) {
    return (
        <div className="relative w-full max-w-5xl mx-auto overflow-hidden border rounded-2xl bg-white p-4 sm:p-5">
            {confetti && <Confetti active />}
            <div className="flex items-center gap-4">
                <CheckBadge size={84} />
                <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">{title}</h2>
                    <p className="mt-1 text-sm sm:text-base text-neutral-600">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}


export default function SuccessPreview() {
    return (
        <SuccessRow />
    );
}
