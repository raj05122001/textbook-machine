"use client";

import React from "react";
import {
  Download,
  FileText,
  BookOpen,
  Languages,
  GraduationCap,
} from "lucide-react";
import { axiosInstance } from "@/axios/AxiosInstans";
import usePresignedUrl from "@/axios/apiHelper";
import toast from "react-hot-toast";

/* ---------- helpers ---------- */
function toNiceDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso || "-";
  }
}
function fileNameFromKey(key = "") {
  const parts = String(key).split("/");
  return parts[parts.length - 1] || "download";
}
function splitS3Key(key = "") {
  const s = String(key);
  const i = s.lastIndexOf("/");
  if (i === -1) return { folder: "", file_name: s };
  return { folder: s.slice(0, i + 1), file_name: s.slice(i + 1) };
}
function guessMimeByExt(name = "") {
  const n = name.toLowerCase();
  if (n.endsWith(".pdf")) return "application/pdf";
  if (n.endsWith(".mp4")) return "video/mp4";
  if (n.endsWith(".png")) return "image/png";
  if (n.endsWith(".jpg") || n.endsWith(".jpeg")) return "image/jpeg";
  if (n.endsWith(".csv")) return "text/csv";
  if (n.endsWith(".xlsx"))
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  return "application/octet-stream";
}

/* ---------- tiny UI bits ---------- */
function MetaRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-lg bg-gray-100 p-2 text-gray-700">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide text-gray-500">
          {label}
        </div>
        <div className="truncate font-medium text-gray-900">{value ?? "-"}</div>
      </div>
    </div>
  );
}
function Chip({ children, tone = "indigo" }) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    violet: "bg-violet-50 text-violet-700 ring-violet-200",
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    amber: "bg-amber-50 text-amber-800 ring-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export default function PrimaryKnowledgePage({updateState}) {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const [downloadingId, setDownloadingId] = React.useState(null);

  const { fetchPresignedUrl } = usePresignedUrl();

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await axiosInstance.get("/primary_knowledge/");
        const list = data?.data || [];
        if (alive) setItems(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error(e);
        if (alive) setError("Failed to load data");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [updateState]);

  async function handleDownload(item) {
    setDownloadingId(item.id);
    try {
      const { folder, file_name } = splitS3Key(item.s3_path_key);
      const file_type = guessMimeByExt(file_name);

      const r = await fetchPresignedUrl({
        file_name,
        file_type,
        operation: "download",
        folder,
      });

      const presignedUrl = r?.presigned_url || r?.download_url;
      if (!presignedUrl) {
        toast.error("Failed to get download link.");
        return;
      }

      const res = await fetch(presignedUrl, { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const cd = res.headers.get("content-disposition") || "";
      const mUtf8 = cd.match(/filename\*\s*=\s*[^']*''([^;]+)/i);
      const mBasic = cd.match(/filename\s*=\s*"?([^";]+)"?/i);
      const finalName = mUtf8?.[1]
        ? decodeURIComponent(mUtf8[1])
        : mBasic?.[1] || file_name;

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = finalName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);

      toast.success("Download started");
    } catch (err) {
      toast.error("Could not start download");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="min-h-[100dvh] w-full py-10">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl border border-gray-200 bg-white/60"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item) => {
            const fileName = fileNameFromKey(item.s3_path_key);
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip tone="amber">{item.standard}</Chip>
                        <Chip tone="sky">{item.book_type}</Chip>
                        <Chip tone="emerald">{item.book_language}</Chip>
                      </div>
                      <h2 className="mt-2 truncate text-base font-semibold">
                        {fileName}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
                  <MetaRow
                    icon={FileText}
                    label="Type"
                    value={item.book_type}
                  />
                  <MetaRow
                    icon={BookOpen}
                    label="Subject"
                    value={item.subject?.subject_name}
                  />
                  <MetaRow
                    icon={GraduationCap}
                    label="Standard"
                    value={item.standard}
                  />
                  <MetaRow
                    icon={Languages}
                    label="Language"
                    value={item.book_language}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-gray-50/60 px-6 py-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">
                      {toNiceDate(item.created_at)}
                    </span>
                    <span className="ml-2 text-gray-500">• ID #{item.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(item)}
                      disabled={downloadingId === item.id}
                      className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white shadow hover:bg-black disabled:opacity-60"
                    >
                      <Download className="h-4 w-4" />
                      {downloadingId === item.id ? "Preparing…" : "Download"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
