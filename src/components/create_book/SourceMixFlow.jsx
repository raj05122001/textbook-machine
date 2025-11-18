"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  TriangleAlert,
  Plus,
  Trash2,
  Upload as UploadIcon,
  Save,
  Loader2,
} from "lucide-react";
import { axiosInstance } from "@/axios/AxiosInstans";
import toast from "react-hot-toast";

/* ------------------------------- constants ------------------------------- */
const WS_URL = "wss://tbmplus-backend.ultimeet.io/ws/vectorize/";
const clamp = (n) => Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));

function normalize3(a, b, c) {
  const A = clamp(a),
    B = clamp(b),
    C = clamp(c);
  const sum = A + B + C || 1;
  const primary = Math.round((A * 100) / sum);
  const trusted = Math.round((B * 100) / sum);
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

/* ----------------------------- helper: upload ---------------------------- */
async function getPresign({ fileName, fileType }) {
  const { data } = await axiosInstance.post("/get_presigned_url/", {
    file_name: fileName,
    file_type: fileType || "application/pdf",
    operation: "upload",
    folder: "book",
  });
  const wrapped = data?.data || {};
  return {
    s3_key: wrapped.s3_key,
    upload_url: wrapped.presigned_url,
    fields: null,
    headers: { "Content-Type": fileType || "application/pdf" },
  };
}

async function uploadToS3(presign, fileObj, onProgress) {
  if (presign.upload_url && !presign.fields) {
    const resp = await fetch(presign.upload_url, {
      method: "PUT",
      headers: { ...(presign.headers || {}) },
      body: fileObj,
    });
    if (!resp.ok) throw new Error(`S3 PUT failed: ${resp.status}`);
    onProgress?.(100);
    return;
  }
  if (presign.upload_url && presign.fields) {
    const fd = new FormData();
    Object.entries(presign.fields).forEach(([k, v]) => fd.append(k, v));
    fd.append("file", fileObj);
    const resp = await fetch(presign.upload_url, { method: "POST", body: fd });
    if (!resp.ok) throw new Error(`S3 POST failed: ${resp.status}`);
    onProgress?.(100);
    return;
  }
  throw new Error("Invalid presign response");
}

/* --------------------------- helper: primary_knowledge -------------------------- */
async function createPrimaryKnowledgeRecords({ records }) {
  const { data } = await axiosInstance.post(
    "/primary_knowledge/",
    { records },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  const ids = data?.knowledge_ids || [];
  if (!Array.isArray(ids) || !ids.length)
    throw new Error("No knowledge_ids returned");
  return ids;
}

/* ------------------------------- helper: WS ------------------------------ */
function vectorizeOverWS(
  knowledgeIds,
  book_id,
  { timeoutMs = 90_000, onStatus } = {}
) {
  return new Promise((resolve) => {
    const ws = new WebSocket(WS_URL);
    let done = false;

    const taggedStatus = (payload) => {
      const ts = new Date().toLocaleTimeString();
      const base =
        payload && typeof payload === "object" ? payload : { raw: payload };
      onStatus?.({ ts, ...base });
    };

    const finish = (ok = true) => {
      if (done) return;
      done = true;
      try {
        ws.close();
      } catch { }
      resolve(ok);
    };

    const timer = setTimeout(() => {
      console.warn("[WS] vectorize timed out; continuing optimistically.");
      taggedStatus({
        status: "timeout",
        message: "Vectorization timed out (continuing).",
      });
      finish(true);
    }, timeoutMs);

    const clearAll = () => clearTimeout(timer);

    ws.onopen = () => {
      const msg = {
        type: "vectorize_book",
        knowledge_ids: knowledgeIds,
        while_book_generation: true,
        book_id: book_id,
      };
      try {
        taggedStatus({
          status: "connecting",
          message: "Connecting to vectorization service…",
        });
        ws.send(JSON.stringify(msg));
      } catch {
        clearAll();
        taggedStatus({
          status: "send_error",
          message: "Failed to send vectorization request.",
        });
        finish(false);
      }
    };

    ws.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data || "{}");
        taggedStatus(payload);
        const status = String(payload?.status || "").toLowerCase();
        if (status === "completed" || status === "all_completed") {
          clearAll();
          finish(true);
        }
      } catch {
        // ignore parse errors
      }
    };

    ws.onerror = () => {
      clearAll();
      taggedStatus({
        status: "error",
        message: "WebSocket error (continuing).",
      });
      finish(true);
    };

    ws.onclose = () => {
      clearAll();
      taggedStatus({
        status: "closed",
        message: "Vectorization channel closed.",
      });
      finish(true);
    };
  });
}

export default function SourceMixFlow({
  option,
  onOptionChange,
  value,
  onChange,
  title = "Content Preferences",
  bookId,
  subject,
  formData,
  onSubjectError,
  onSaved,
}) {
  const defaultMix = { primary: 80, trusted: 15, internet: 5, urls: ["", ""] };
  const fileInputRef = useRef(null);

  const [dirty, setDirty] = useState(false);
  const [hasSavedOnce, setHasSavedOnce] = useState(false);

  const isMixture = option === "mixture";
  const isUpload = option === "upload";
  const isPrimaryOnly = option === "primary";

  const [urls, setUrls] = useState(() =>
    Array.isArray(value?.urls) && value.urls.length ? [...value.urls] : ["", ""]
  );
  const [files, setFiles] = useState([]);
  const [uploadPct, setUploadPct] = useState(0);
  const [busy, setBusy] = useState(false);
  const [wsStatus, setWsStatus] = useState(null);
  const [locked, setLocked] = useState(false); // success ke baad lock

  const onPickFiles = (e) => setFiles(Array.from(e.target.files || []));

  useEffect(() => {
    if (Array.isArray(value?.urls)) setUrls(value.urls);
  }, [value?.urls]);

  useEffect(() => {
    setDirty(true);
  }, [
    option,
    value?.primary,
    value?.trusted,
    value?.internet,
    urls.length,
    files.length,
  ]);

  const mix = useMemo(() => {
    if (isMixture) {
      const v = value || defaultMix;
      return normalize3(v.primary ?? 0, v.trusted ?? 0, v.internet ?? 0);
    }
    if (isPrimaryOnly) return { primary: 100, trusted: 0, internet: 0 };
    return { primary: 0, trusted: 0, internet: 0 };
  }, [option, value, isMixture, isPrimaryOnly]);

  const total = mix.primary + mix.trusted + mix.internet;

  const emitChange = (next) => {
    if (isMixture) {
      onChange?.({
        ...next,
        urls: Array.isArray(urls) ? urls : [],
      });
    } else {
      onChange?.(next);
    }
  };

  const updateOne = (which, nextVal) => {
    if (!isMixture) return;
    nextVal = clamp(nextVal);
    if (which === "primary") {
      const rest = 100 - nextVal;
      const t = mix.trusted,
        i = mix.internet,
        sum = t + i || 1;
      const trusted = Math.round((t / sum) * rest);
      const internet = clamp(rest - trusted);
      emitChange({ primary: nextVal, trusted, internet });
    } else if (which === "trusted") {
      const rest = 100 - nextVal;
      const p = mix.primary,
        i = mix.internet,
        sum = p + i || 1;
      const primary = Math.round((p / sum) * rest);
      const internet = clamp(rest - primary);
      emitChange({ primary, trusted: nextVal, internet });
    } else {
      const rest = 100 - nextVal;
      const p = mix.primary,
        t = mix.trusted,
        sum = p + t || 1;
      const primary = Math.round((p / sum) * rest);
      const trusted = clamp(rest - primary);
      emitChange({ primary, trusted, internet: nextVal });
    }
  };

  const handleChoose = (opt) => {
    onOptionChange?.(opt);
    if (opt === "mixture" && !value) onChange?.(defaultMix);
    if (opt === "upload") setTimeout(() => fileInputRef.current?.click(), 0);
  };

  useEffect(() => {
    if (!isMixture) return;
    setUrls((prev) => {
      const arr = Array.isArray(prev) ? [...prev] : [];
      if (arr.length >= 2) return arr;
      if (arr.length === 0) return ["", ""];
      if (arr.length === 1) return [arr[0], ""];
      return arr;
    });
  }, [isMixture]);

  const handleUrlsChange = (nextUrls) => {
    setUrls(nextUrls);

    if (isMixture) {
      onChange?.({
        primary: mix.primary,
        trusted: mix.trusted,
        internet: mix.internet,
        urls: nextUrls,
      });
    }
  };


  const buildPreferencesPayload = ({ mode, knowledgeIds = [] }) => {
    const payload = {
      book: Number(bookId) || bookId,
      preferences: "UPLOADED",
      primary_metadata: [],
      mix_ratio: {
        primary_knowledge_percent: 0,
        trusted_url_percent: 0,
        internet_percent: 0,
      },
      trusted_source_links: [],
    };

    if (mode === "upload") {
      payload.preferences = "UPLOADED";
      payload.primary_metadata = knowledgeIds;
      return payload;
    }

    payload.preferences = "MIX";

    if (mode === "primary") {
      payload.mix_ratio.primary_knowledge_percent = 100;
      payload.mix_ratio.trusted_url_percent = 0;
      payload.mix_ratio.internet_percent = 0;
      return payload;
    }

    payload.mix_ratio.primary_knowledge_percent = clamp(mix.primary);
    payload.mix_ratio.trusted_url_percent = clamp(mix.trusted);
    payload.mix_ratio.internet_percent = clamp(mix.internet);

    if (payload.mix_ratio.trusted_url_percent > 0) {
      payload.trusted_source_links = (Array.isArray(urls) ? urls : [])
        .map((u) => String(u || "").trim())
        .filter((u) => u.length > 0 && isHttpUrl(u));
    }
    return payload;
  };

  const safeUrls = Array.isArray(urls) ? urls : [];
  const canSave =
    dirty &&
    ((isUpload && true) ||
      (isPrimaryOnly && true) ||
      (isMixture &&
        (mix.trusted === 0 ||
          (mix.trusted > 0 &&
            safeUrls.some((u) => isHttpUrl(String(u || "").trim()))))));

  const onClickSave = async () => {
    if (!bookId) {
      toast.error("bookId is required for saving preferences.");
      return;
    }
    if (!String(subject || "").trim()) {
      onSubjectError?.("Subject is required.");
      toast.error("Please enter Subject.");
      return;
    }
    try {
      setBusy(true);
      setWsStatus(null);

      if (isUpload) {
        if (!files.length) {
          fileInputRef.current?.click();
          toast("Select files to upload to continue.", { icon: "📄" });
          return;
        }

        // 1) upload files -> s3 keys (multi-file progress -> circle)
        const keys = [];
        const totalFiles = files.length;

        for (let idx = 0; idx < files.length; idx++) {
          const file = files[idx];
          const startShare = (idx / totalFiles) * 100;

          setUploadPct(Math.round(startShare));

          const presign = await getPresign({
            fileName: file.name,
            fileType: file.type,
          });

          await uploadToS3(presign, file, (p) => {
            const perFileShare = 100 / totalFiles;
            const overall =
              startShare + Math.min(100, Math.max(0, p)) * (perFileShare / 100);
            setUploadPct(Math.min(99, Math.round(overall)));
          });

          if (!presign.s3_key)
            throw new Error("s3_key missing from presign response");
          keys.push(presign.s3_key);
        }

        // 2) create primary_knowledge for keys
        const records = keys.map((k) => ({
          s3_path_key: k,
          subject: String(subject || "").trim() || undefined,
          standard:
            String(formData?.educational_level || "").trim() || undefined,
          book_type: String(formData?.category || "").trim() || undefined,
          book_language:
            String(formData?.language || "").trim().toUpperCase() || undefined,
        }));
        const knowledgeIds = await createPrimaryKnowledgeRecords({ records });

        // 3) vectorize (real-time status -> wsStatus)
        setWsStatus({
          status: "queued",
          message: "Queued for vectorization…",
          ts: new Date().toLocaleTimeString(),
        });
        await vectorizeOverWS(knowledgeIds, bookId, {
          timeoutMs: 90_000,
          onStatus: setWsStatus,
        });

        // 4) save content preferences with UPLOADED
        const payload = buildPreferencesPayload({
          mode: "upload",
          knowledgeIds,
        });
        await axiosInstance.post("/content_preferences/", payload, {
          headers: { "Content-Type": "application/json" },
        });

        setFiles([]);
        setUploadPct(0);
        setHasSavedOnce(true);
        setDirty(false);
        onSaved?.(true);
        setLocked(true); // lock after success

        toast.success("Uploaded, vectorized and preferences saved.");
        return;
      }

      if (isPrimaryOnly) {
        const payload = buildPreferencesPayload({ mode: "primary" });
        await axiosInstance.post("/content_preferences/", payload, {
          headers: { "Content-Type": "application/json" },
        });
        setHasSavedOnce(true);
        setDirty(false);
        onSaved?.(true);
        setLocked(true);
        toast.success("Preferences saved (Primary 100%).");
        return;
      }

      // mixture
      const payload = buildPreferencesPayload({ mode: "mixture" });
      await axiosInstance.post("/content_preferences/", payload, {
        headers: { "Content-Type": "application/json" },
      });
      setHasSavedOnce(true);
      setDirty(false);
      onSaved?.(true);
      setLocked(true);
      toast.success("Preferences saved (Mixture).");
    } catch (err) {
      console.error(err);
      toast.error(
        typeof err?.message === "string" ? err.message : "Failed to save."
      );
    } finally {
      setBusy(false);
      setUploadPct(0);
    }
  };

  const progressPct = Math.max(0, Math.min(100, uploadPct || 0));
  const progressDeg = progressPct * 3.6; // 0–100 -> 0–360

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      {/* Options */}
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <OptionTile
          active={isUpload}
          subtitle="Upload all Materials"
          onClick={() => handleChoose("upload")}
        />
        <OptionTile
          active={isPrimaryOnly}
          subtitle="Primary DB"
          onClick={() => handleChoose("primary")}
        />
        <OptionTile
          active={isMixture}
          subtitle="Mixture of all"
          onClick={() => handleChoose("mixture")}
        />
      </div>

      {/* Upload UI */}
      {isUpload && (
        <div className="mb-6 rounded-xl border bg-slate-50 p-4">
          <div className="mb-2 font-semibold">Upload your files</div>
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed px-4 py-3 hover:bg-white">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8">
                {busy && files.length > 0 && (
                  <>
                    {/* outer ring */}
                    <div className="absolute inset-0 rounded-full border border-slate-300/70" />

                    {/* progress arc */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(
                          #2563eb 0deg,
                          #2563eb ${progressDeg}deg,
                          transparent ${progressDeg}deg,
                          transparent 360deg
                        )`,
                        transform: "rotate(-90deg)",
                        transition: "background 0.2s ease-out",
                      }}
                    />

                    {/* inner cutout */}
                    <div className="absolute inset-[3px] rounded-full bg-slate-50" />
                  </>
                )}
              </div>

              <UploadIcon className="h-5 w-5" />
              <div className="text-sm text-gray-700">
                Choose files (PDF, DOCX, Images, etc.)
              </div>
            </div>
            <input
              type="file"
              multiple
              onChange={onPickFiles}
              className="hidden"
              ref={fileInputRef}
            />
            <span className="rounded-md border bg-white px-3 py-1 text-sm">
              Browse
            </span>
          </label>

          {/* WebSocket live status row (vectorization) */}
          {wsStatus && (
            <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">
                {wsStatus.ts ? `${wsStatus.ts} – ` : ""}
                {wsStatus.status || ""}
              </span>
              {wsStatus.message && (
                <span className="max-w-[55%] truncate text-slate-500">
                  {wsStatus.message}
                </span>
              )}
            </div>
          )}

          {files.length > 0 && (
            <ul className="mt-3 list-disc pl-5 text-sm text-gray-600">
              {files.map((f, i) => (
                <li key={i}>
                  {f.name}{" "}
                  <span className="text-xs text-gray-400">
                    ({f.size} bytes)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Sliders */}
      {isMixture && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <SliderCard
            title="Primary DB (Reviewed Books)"
            value={mix.primary}
            disabled={!isMixture || busy}
            onChange={(v) => updateOne("primary", v)}
          />
          <SliderCard
            title="Trusted Sources (URLs)"
            value={mix.trusted}
            disabled={!isMixture || busy}
            onChange={(v) => updateOne("trusted", v)}
          />
          <SliderCard
            title="Internet"
            value={mix.internet}
            disabled={!isMixture || busy}
            onChange={(v) => updateOne("internet", v)}
          />
        </div>
      )}

      {isMixture && mix.trusted > 0 && (
        <div className="mt-6 rounded-xl border bg-slate-50 p-4">
          <UrlFields
            urls={urls}
            onChange={handleUrlsChange}
            minCount={2}
            disabled={busy}
          />
        </div>
      )}


      {isMixture && total !== 100 && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-amber-800">
          <TriangleAlert className="h-4 w-4" />
          <span>Total is auto-normalized to 100%. Current: {total}%</span>
        </div>
      )}

      {/* Save */}
      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClickSave}
          disabled={locked || !canSave || busy}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          title="Save content preferences"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {busy
            ? "Working…"
            : locked || (hasSavedOnce && !dirty)
              ? "Saved ✓"
              : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- subcomponents ------------------------------- */
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
          "grid h-5 w-5 place-items-center rounded-full border",
          active
            ? "border-blue-600 text-blue-600"
            : "border-gray-300 text-transparent",
        ].join(" ")}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-current" />
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

function UrlFields({ urls, onChange, minCount = 2, disabled }) {
  const rawList = Array.isArray(urls) ? urls : [];

  // Hamesha kam se kam minCount rows ensure karega
  const ensureMin = (arr) => {
    if (arr.length >= minCount) return arr;
    return [
      ...arr,
      ...Array.from({ length: minCount - arr.length }, () => ""),
    ];
  };

  // UI me jo list dikh rahi hai
  const list = ensureMin(rawList);

  const handleAdd = () => {
    // naya item actual data (rawList) me add karo
    const nextRaw = [...rawList, ""];
    onChange(ensureMin(nextRaw));
  };

  const handleUpdate = (idx, val) => {
    const nextRaw = [...rawList];

    // agar index rawList se bahar chala gaya ho (blank rows ki wajah se)
    if (idx >= nextRaw.length) {
      // missing blank rows ko fill karo
      while (nextRaw.length <= idx) nextRaw.push("");
    }

    nextRaw[idx] = val;
    onChange(ensureMin(nextRaw));
  };

  const handleRemove = (idx) => {
    // agar already minCount ya usse kam rows hain toh remove mat karo
    if (rawList.length <= minCount) return;

    const nextRaw = [...rawList];

    // ✅ jis index pe click hua hai wahi remove hoga
    nextRaw.splice(idx, 1);

    onChange(ensureMin(nextRaw));
  };

  return (
    <div className="space-y-3">
      {list.map((u, i) => {
        const trimmed = String(u || "").trim();
        const valid = trimmed === "" ? true : isHttpUrl(trimmed);

        return (
          <div key={i} className="flex items-start gap-2">
            <input
              type="url"
              placeholder={`https://example.com/resource #${i + 1}`}
              value={u}
              disabled={disabled}
              onChange={(e) => handleUpdate(i, e.target.value)}
              className={[
                "w-full rounded-lg border px-3 py-2 text-sm outline-none",
                valid
                  ? "border-gray-300 focus:border-blue-500"
                  : "border-red-500 focus:border-red-600",
              ].join(" ")}
            />

            <button
              type="button"
              onClick={handleAdd}
              disabled={disabled}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm hover:bg-gray-100 disabled:opacity-50"
              aria-label="Add URL"
              title="Add URL"
            >
              <Plus className="h-4 w-4" /> Add
            </button>

            <button
              type="button"
              onClick={() => handleRemove(i)}
              disabled={disabled || rawList.length <= minCount}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm hover:bg-gray-100 disabled:opacity-50"
              aria-label="Remove URL"
              title={
                rawList.length <= minCount
                  ? `Minimum ${minCount} URLs required`
                  : "Remove URL"
              }
            >
              <Trash2 className="h-4 w-4" /> Remove
            </button>
          </div>
        );
      })}
      <div className="text-xs text-gray-500">
        Hint: http/https links only. Invalid links will be highlighted in red.
      </div>
    </div>
  );
}

