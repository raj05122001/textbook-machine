"use client";

import React from "react";

const btnStyle = {
    height: 36,
    padding: "0 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
};

export default function ImageMagnifierOverlay({
    src,
    onClose,
    minScale = 0.5,
    maxScale = 8,
    initialScale = 1,
}) {
    const wrapRef = React.useRef(null);
    const imgRef = React.useRef(null);
    const [scale, setScale] = React.useState(initialScale);
    const [tx, setTx] = React.useState(0);
    const [ty, setTy] = React.useState(0);
    const [panning, setPanning] = React.useState(false);
    const panStart = React.useRef({ x: 0, y: 0, tx0: 0, ty0: 0 });

    const pinchRef = React.useRef({
        active: false,
        startDist: 0,
        startScale: initialScale,
        centerX: 0,
        centerY: 0,
    });

    React.useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    React.useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose?.();
            if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
                e.preventDefault();
                zoomAtCenter(1.15);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === "-") {
                e.preventDefault();
                zoomAtCenter(1 / 1.15);
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "0") {
                e.preventDefault();
                resetView();
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    function resetView() {
        setScale(1);
        setTx(0);
        setTy(0);
    }

    function zoomAtCenter(factor) {
        const box = wrapRef.current?.getBoundingClientRect();
        const cx = box ? box.left + box.width / 2 : window.innerWidth / 2;
        const cy = box ? box.top + box.height / 2 : window.innerHeight / 2;
        zoomAtPoint(factor, cx, cy);
    }

    function zoomAtPoint(factor, clientX, clientY) {
        const img = imgRef.current;
        const wrap = wrapRef.current;
        if (!img || !wrap) return;

        const rect = wrap.getBoundingClientRect();
        const px = clientX - rect.left;
        const py = clientY - rect.top;

        const newScale = clamp(scale * factor, minScale, maxScale);

        const dx = px - (px - tx) * (newScale / scale);
        const dy = py - (py - ty) * (newScale / scale);
        setScale(newScale);
        setTx(dx);
        setTy(dy);
    }

    function onWheel(e) {
        e.preventDefault();
        const direction = e.deltaY > 0 ? 1 / 1.1 : 1.1;
        zoomAtPoint(direction, e.clientX, e.clientY);
    }

    function onMouseDown(e) {
        if (e.button !== 0) return;
        setPanning(true);
        panStart.current = { x: e.clientX, y: e.clientY, tx0: tx, ty0: ty };
    }
    function onMouseMove(e) {
        if (!panning) return;
        const dx = e.clientX - panStart.current.x;
        const dy = e.clientY - panStart.current.y;
        setTx(panStart.current.tx0 + dx);
        setTy(panStart.current.ty0 + dy);
    }
    function onMouseUp() {
        setPanning(false);
    }

    function onDoubleClick(e) {
        e.preventDefault();
        const targetScale = scale < 2 ? 2 : 1;
        const factor = targetScale / scale;
        zoomAtPoint(factor, e.clientX, e.clientY);
    }

    function getTouches(e) {
        return Array.from(e.touches || []);
    }
    function dist(a, b) {
        const dx = a.clientX - b.clientX,
            dy = a.clientY - b.clientY;
        return Math.hypot(dx, dy);
    }
    function center(a, b) {
        return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
    }

    function onTouchStart(e) {
        if (e.touches.length === 2) {
            const [t1, t2] = getTouches(e);
            pinchRef.current.active = true;
            pinchRef.current.startDist = dist(t1, t2);
            pinchRef.current.startScale = scale;
            const c = center(t1, t2);
            pinchRef.current.centerX = c.x;
            pinchRef.current.centerY = c.y;
        } else if (e.touches.length === 1) {
            setPanning(true);
            const t = e.touches[0];
            panStart.current = { x: t.clientX, y: t.clientY, tx0: tx, ty0: ty };
        }
    }
    function onTouchMove(e) {
        if (pinchRef.current.active && e.touches.length === 2) {
            e.preventDefault();
            const [t1, t2] = getTouches(e);
            const d = dist(t1, t2);
            const factor = d / (pinchRef.current.startDist || d);
            const target = clamp(
                pinchRef.current.startScale * factor,
                minScale,
                maxScale
            );
            const f = target / scale;
            zoomAtPoint(f, pinchRef.current.centerX, pinchRef.current.centerY);
        } else if (panning && e.touches.length === 1) {
            const t = e.touches[0];
            const dx = t.clientX - panStart.current.x;
            const dy = t.clientY - panStart.current.y;
            setTx(panStart.current.tx0 + dx);
            setTy(panStart.current.ty0 + dy);
        }
    }
    function onTouchEnd() {
        if (pinchRef.current.active) {
            pinchRef.current.active = false;
        }
        setPanning(false);
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose?.();
            }}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15,23,42,.7)",
                zIndex: 9999,
                display: "grid",
                placeItems: "center",
                cursor: panning ? "grabbing" : "default",
            }}
        >
            <div
                style={{
                    position: "fixed",
                    top: 12,
                    right: 12,
                    display: "flex",
                    gap: 8,
                    zIndex: 10000,
                }}
            >
                <button onClick={() => zoomAtCenter(1 / 1.15)} style={btnStyle} title="Zoom out (Ctrl/Cmd -)">–</button>
                <button onClick={() => zoomAtCenter(1.15)} style={btnStyle} title="Zoom in (Ctrl/Cmd +)">+</button>
                <button onClick={resetView} style={btnStyle} title="Reset (Ctrl/Cmd 0)">Reset</button>
                <button
                    onClick={onClose}
                    style={{ ...btnStyle, background: "#ef4444", color: "#fff" }}
                    title="Close (Esc)"
                >
                    Close
                </button>
            </div>

            <div
                ref={wrapRef}
                onWheel={onWheel}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onDoubleClick={onDoubleClick}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{
                    position: "relative",
                    width: "min(92vw, 1200px)",
                    height: "min(88vh, 90vh)",
                    background: "#0b0d10",
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid #334155",
                    touchAction: "none",
                    userSelect: "none",
                    cursor: panning ? "grabbing" : "grab",
                }}
            >
                <img
                    ref={imgRef}
                    src={src}
                    alt="Zoom"
                    draggable={false}
                    style={{
                        transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
                        transformOrigin: "0 0",
                        willChange: "transform",
                        maxWidth: "unset",
                        maxHeight: "unset",
                        pointerEvents: "none",
                        userSelect: "none",
                    }}
                />
            </div>
        </div>
    );
}
