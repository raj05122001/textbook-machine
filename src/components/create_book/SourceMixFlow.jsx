"use client";

import React, { useEffect, useMemo, useState } from "react";
import { TriangleAlert, Check, Plus, Trash2 } from "lucide-react";

/* ---------- utils ---------- */
const clamp = (n) => Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));
function normalize3(a, b, c) {
  const A = clamp(a), B = clamp(b), C = clamp(c);
  const sum = A + B + C || 1;
  const primary  = Math.round((A * 100) / sum);
  const trusted  = Math.round((B * 100) / sum);
  const internet = clamp(100 - primary - trusted);
  return { primary, trusted, internet };
}
const isHttpUrl = (s) => {
  if (!s || typeof s !== "string") return false;
  try {
    const u = new URL(s.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

export default function SourceMixFlow({
  option,
  onOptionChange,
  value,
  onChange,
  title = "Content Preferences",
}) {
  const defaultMix = { primary: 80, trusted: 15, internet: 5, urls: ["", ""] };

  const isMixture = option === "mixture";

  // Keep local urls state, sync with value?.urls
  const [urls, setUrls] = useState(() => Array.isArray(value?.urls) ? value.urls : []);

  useEffect(() => {
    if (Array.isArray(value?.urls)) setUrls(value.urls);
  }, [value?.urls]);

  const mix = useMemo(() => {
    const v = isMixture ? (value || defaultMix) : { primary: 100, trusted: 0, internet: 0, urls: [] };
    return normalize3(v.primary ?? 0, v.trusted ?? 0, v.internet ?? 0);
  }, [option, value, isMixture]);

  const total = mix.primary + mix.trusted + mix.internet;

  const emitChange = (next) => {
    // Always include urls when emitting in mixture mode for upstream consumers
    if (isMixture) {
      onChange?.({ ...next, urls });
    } else {
      onChange?.(next);
    }
  };

  /** keep total 100 while sliding in mixture mode */
  const updateOne = (which, nextVal) => {
    if (!isMixture) return;
    nextVal = clamp(nextVal);

    if (which === "primary") {
      const rest = 100 - nextVal;
      const t = mix.trusted, i = mix.internet, sum = t + i || 1;
      const trusted  = Math.round((t / sum) * rest);
      const internet = clamp(rest - trusted);
      emitChange({ primary: nextVal, trusted, internet });
    } else if (which === "trusted") {
      const rest = 100 - nextVal;
      const p = mix.primary, i = mix.internet, sum = p + i || 1;
      const primary  = Math.round((p / sum) * rest);
      const internet = clamp(rest - primary);
      emitChange({ primary, trusted: nextVal, internet });
    } else {
      const rest = 100 - nextVal;
      const p = mix.primary, t = mix.trusted, sum = p + t || 1;
      const primary = Math.round((p / sum) * rest);
      const trusted = clamp(rest - primary);
      emitChange({ primary, trusted, internet: nextVal });
    }
  };

  const handleChoose = (opt) => {
    onOptionChange?.(opt);
    if (opt === "mixture" && !value) onChange?.(defaultMix);
  };

  // Ensure at least two URL inputs whenever trusted > 0
  useEffect(() => {
    if (!isMixture) return;
    if (mix.trusted > 0) {
      setUrls((prev) => {
        const arr = Array.isArray(prev) ? [...prev] : [];
        if (arr.length >= 2) return arr;
        if (arr.length === 0) return ["", ""];
        if (arr.length === 1) return [arr[0], ""];
        return arr;
      });
    }
  }, [mix.trusted, isMixture]);

  // Push URL changes upstream together with weights
  const handleUrlsChange = (nextUrls) => {
    setUrls(nextUrls);
    if (isMixture) {
      emitChange({ primary: mix.primary, trusted: mix.trusted, internet: mix.internet });
    }
  };

  return (
    <div className="w-full rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-gray-500">Total: {total}%</span>
      </div>

      {/* Top: three option tiles (checkbox look, but mutually exclusive) */}
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <OptionTile
          active={option === "upload"}
          subtitle="Upload all Materials"
          onClick={() => handleChoose("upload")}
        />
        <OptionTile
          active={option === "primary"}
          subtitle="Refer to Primary DB"
          onClick={() => handleChoose("primary")}
        />
        <OptionTile
          active={option === "mixture"}
          subtitle="Mixture of all"
          onClick={() => handleChoose("mixture")}
        />
      </div>

      {/* Sliders */}
      {option === "mixture" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <SliderCard
            title="Primary DB (Reviewed Books)"
            value={mix.primary}
            disabled={!isMixture}
            onChange={(v) => updateOne("primary", v)}
          />
          <SliderCard
            title="Trusted Sources (URLs)"
            value={mix.trusted}
            disabled={!isMixture}
            onChange={(v) => updateOne("trusted", v)}
          />
          <SliderCard
            title="Internet"
            value={mix.internet}
            disabled={!isMixture}
            onChange={(v) => updateOne("internet", v)}
          />
        </div>
      )}

      {/* URL Inputs (only when Trusted > 0) */}
      {isMixture && mix.trusted > 0 && (
        <div className="mt-6 rounded-xl border bg-slate-50 p-4">
          <UrlFields
            urls={urls}
            onChange={handleUrlsChange}
            minCount={1}
          />
        </div>
      )}

      {/* note: auto-normalize info */}
      {isMixture && total !== 100 && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-amber-800">
          <TriangleAlert className="h-4 w-4" />
          <span>Total is auto-normalized to 100%. Current: {total}%</span>
        </div>
      )}
    </div>
  );
}

/* ---------- small subcomponents ---------- */
function OptionTile({ active, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition",
        active ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:bg-gray-50",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-5 w-5 place-items-center rounded border",
          active ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white",
        ].join(" ")}
      >
        {active && <Check className="h-3.5 w-3.5" />}
      </span>
      <div>
        <div className="text-sm font-semibold">{subtitle}</div>
      </div>
    </button>
  );
}

function SliderCard({ title, value, disabled, onChange }) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <div className="mb-2 font-semibold">{title}</div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="w-full disabled:opacity-50"
      />
      <div className="mt-1 flex items-center justify-between text-sm text-gray-600">
        <span>Weight</span>
        <span className="font-medium">{value}%</span>
      </div>
    </div>
  );
}

/* ---------- URL Fields (dynamic) ---------- */
function UrlFields({ urls, onChange, minCount = 1 }) {
  const addRow = () => onChange([...(urls || []), ""]);
  const updateRow = (idx, val) => {
    const next = [...(urls || [])];
    next[idx] = val;
    onChange(next);
  };
  const removeRow = (idx) => {
    const next = [...(urls || [])];
    next.splice(idx, 1);
    onChange(next.length ? next : ["", ""]);
  };

  // Guarantee minimum rows
  useEffect(() => {
    const arr = Array.isArray(urls) ? urls : [];
    if (arr.length < minCount) {
      onChange([...arr, ...Array.from({ length: minCount - arr.length }, () => "")]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minCount]);

  const list = Array.isArray(urls) ? urls : [];

  return (
    <div className="space-y-3">
      {list.map((u, i) => {
        const valid = u.trim() === "" ? true : isHttpUrl(u);
        return (
          <div key={i} className="flex items-start gap-2">
            <input
              type="url"
              placeholder={`https://example.com/resource #${i + 1}`}
              value={u}
              onChange={(e) => updateRow(i, e.target.value)}
              className={[
                "w-full rounded-lg border px-3 py-2 text-sm outline-none",
                valid ? "border-gray-300 focus:border-blue-500" : "border-red-500 focus:border-red-600",
              ].join(" ")}
            />
            <button
              type="button"
              onClick={() => addRow()}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm hover:bg-gray-100"
              aria-label="Add URL"
              title="Add URL"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
            <button
              type="button"
              onClick={() => i >= minCount ? removeRow(i) : null}
              disabled={list.length <= minCount}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm hover:bg-gray-100 disabled:opacity-50"
              aria-label="Remove URL"
              title={list.length <= minCount ? `Minimum ${minCount} URLs required` : "Remove URL"}
            >
              <Trash2 className="h-4 w-4" /> Remove
            </button>
          </div>
        );
      })}

      {/* quick hint + invalid note */}
      <div className="text-xs text-gray-500">
        Hint: http/https links only. Invalid links will be highlighted in red.
      </div>
    </div>
  );
}
