'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { axiosInstance, authAxiosInstance } from '@/axios/AxiosInstans';
import toast from 'react-hot-toast';
import { X, Plus, UploadCloud, Loader2 } from 'lucide-react';

/* ---------- helpers ---------- */
function ordinal(n) {
  const j = n % 10, k = n % 100;
  if (j === 1 && k !== 11) return `${n}st`;
  if (j === 2 && k !== 12) return `${n}nd`;
  if (j === 3 && k !== 13) return `${n}rd`;
  return `${n}th`;
}
const STANDARD_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const n = i + 1;
  return { value: String(n), label: ordinal(n) };
});
const BOOK_TYPE_OPTIONS = ['Textbook', 'Guidebook', 'Workbook', 'Reference'];
const LANGUAGE_OPTIONS = ['English', 'French'];

/**
 * Open WS, send the knowledge payload, wait for an ack or close.
 * Retries a couple of times if the socket can't be opened.
 */
function sendKnowledgeOverWS(url, knowledge, { timeoutMs = 12000, retries = 1 } = {}) {
  return new Promise((resolve, reject) => {
    let ws;
    let settled = false;
    let timer;

    const clean = () => {
      if (timer) clearTimeout(timer);
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        try { ws.close(); } catch {}
      }
    };

    const tryOnce = (attempt) => {
      ws = new WebSocket(url);

      ws.onopen = () => {
        try {
          ws.send(JSON.stringify(knowledge));
        } catch (e) {
          clean();
          if (!settled) {
            settled = true;
            reject(e);
          }
          return;
        }

        // timeout guard
        timer = setTimeout(() => {
          clean();
          if (!settled) {
            settled = true;
            reject(new Error('WebSocket timed out waiting for server response'));
          }
        }, timeoutMs);
      };

      ws.onmessage = (evt) => {
        // If the server sends a specific ack shape, handle it here.
        // We'll accept anything JSON that contains "ok" or "status":"ok"/"success"
        try {
          const data = JSON.parse(evt.data);
          const ok =
            data?.ok === true ||
            data?.status?.toString().toLowerCase?.() === 'ok' ||
            data?.status?.toString().toLowerCase?.() === 'success' ||
            data?.message?.toString().toLowerCase?.().includes('queued') ||
            data?.message?.toString().toLowerCase?.().includes('accepted');

          if (ok && !settled) {
            settled = true;
            clean();
            resolve(data);
          }
        } catch {
          // ignore non-JSON frames
        }
      };

      ws.onerror = () => {
        // Will likely also trigger onclose; let onclose handle retry logic.
      };

      ws.onclose = () => {
        if (settled) return;
        if (attempt < retries) {
          // retry after short delay
          setTimeout(() => tryOnce(attempt + 1), 600);
        } else {
          settled = true;
          clean();
          reject(new Error('WebSocket could not be established or closed unexpectedly'));
        }
      };
    };

    tryOnce(0);
  });
}

/* ============================= Component ============================= */
export default function CreatePrimaryBook({setUpdateState}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // form values
  const [file, setFile] = useState(null);
  const [subjectId, setSubjectId] = useState('');
  const [standard, setStandard] = useState('');
  const [bookType, setBookType] = useState('');
  const [bookLanguage, setBookLanguage] = useState('');

  // subjects
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsErr, setSubjectsErr] = useState('');

  // upload/presign
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [s3Key, setS3Key] = useState('');

  useEffect(() => setMounted(true), []);

  // load subjects when modal opens
  useEffect(() => {
    if (!open) return;
    let alive = true;

    (async () => {
      try {
        setSubjectsLoading(true);
        setSubjectsErr('');
        const all = [];
        let url = '/subject/';
        let guard = 0;
        while (url && guard < 25) {
          const { data } = await axiosInstance.get(url);
          const items = data?.data || data?.results || [];
          for (const it of items) {
            all.push({ id: String(it.id), subject_name: it.subject_name });
          }
          url = data?.next || null;
          guard += 1;
        }
        if (alive) setSubjects(all);
      } catch (e) {
        console.error('[subjects] error', e);
        if (alive) setSubjectsErr('Failed to load subjects.');
      } finally {
        if (alive) setSubjectsLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [open]);

  // esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, saving]);

  const canSubmit = useMemo(
    () => Boolean(s3Key && subjectId && standard && bookType && bookLanguage && !saving),
    [s3Key, subjectId, standard, bookType, bookLanguage, saving]
  );

  const resetForm = () => {
    setFile(null);
    setSubjectId('');
    setStandard('');
    setBookType('');
    setBookLanguage('');
    setIsDragging(false);
    setUploadPct(0);
    setS3Key('');
  };

  const handleClose = () => {
    if (saving) return;
    setOpen(false);
    resetForm();
  };

  async function getPresign({ fileName, fileType }) {
    const body = {
      file_name: fileName,
      file_type: fileType || 'application/pdf',
      operation: 'upload',
      folder: 'book',
    };
    const { data } = await axiosInstance.post('/get_presigned_url/', body);
    const wrapped = data?.data || {};
    return {
      s3_key: wrapped.s3_key,
      upload_url: wrapped.presigned_url,
      fields: null,
      headers: { 'Content-Type': fileType || 'application/pdf' },
    };
  }

  async function uploadToS3(presign, fileObj) {
    setUploadPct(1);

    if (presign.upload_url && !presign.fields) {
      const resp = await fetch(presign.upload_url, {
        method: 'PUT',
        headers: { ...(presign.headers || {}) },
        body: fileObj,
      });
      if (!resp.ok) {
        const text = await resp.text().catch(() => '(no body)');
        console.error('[upload] PUT failed', resp.status, text);
        throw new Error(`S3 PUT failed: ${resp.status}`);
      }
      setUploadPct(100);
      return;
    }

    if (presign.upload_url && presign.fields) {
      const fd = new FormData();
      Object.entries(presign.fields).forEach(([k, v]) => fd.append(k, v));
      fd.append('file', fileObj);
      const resp = await fetch(presign.upload_url, { method: 'POST', body: fd });
      if (!resp.ok) {
        const text = await resp.text().catch(() => '(no body)');
        console.error('[upload] POST failed', resp.status, text);
        throw new Error(`S3 POST failed: ${resp.status}`);
      }
      setUploadPct(100);
      return;
    }

    throw new Error('Invalid presign response');
  }

  const handleFilePicked = async (f) => {
    if (!f) return;
    try {
      setSaving(true);
      setFile(f);

      const presign = await getPresign({ fileName: f.name, fileType: f.type });
      await uploadToS3(presign, f);

      if (!presign.s3_key) throw new Error('s3_key missing from presign response');
      setS3Key(presign.s3_key);
      toast.success('File uploaded to S3');

      if (subjectId && standard && bookType && bookLanguage) {
        await postCreateRecord(presign.s3_key);
      }
    } catch (e) {
      console.error('[upload] failed', e);
      toast.error('Upload failed');
      setS3Key('');
    } finally {
      setSaving(false);
      setUploadPct(0);
    }
  };

  const onDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
    handleFilePicked(e.dataTransfer?.files?.[0] ?? null);
  };
  const onDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };

  function normalizeBookTypeForAPI(bt) {
    if (!bt) return bt;
    const s = String(bt).trim().toLowerCase();
    if (s === 'guide' || s === 'guidebook') return 'Guidebook';
    if (s === 'textbook') return 'Textbook';
    if (s === 'workbook') return 'Workbook';
    if (s === 'reference') return 'Reference';
    return bt;
  }
  function normalizeLanguageForAPI(lang) {
    if (!lang) return lang;
    const s = String(lang).trim().toLowerCase();
    const map = { english: 'ENGLISH', hindi: 'HINDI', marathi: 'MARATHI', gujarati: 'GUJARATI' };
    return map[s] || String(lang).toUpperCase();
  }
  function extractErrorMessage(err) {
    const body = err?.response?.data;
    if (Array.isArray(body)) {
      return body
        .map(e =>
          Object.entries(e)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join(' | ')
        )
        .join(' ; ');
    }
    return body?.detail || body?.message || err?.message || 'Unknown error';
  }

  async function postCreateRecord(key) {
    const subj = subjects.find(s => s.id === subjectId);
    const standardLabel = STANDARD_OPTIONS.find(s => s.value === standard)?.label || standard;
    const bookTypeExact = normalizeBookTypeForAPI(bookType);
    const languageExact = normalizeLanguageForAPI(bookLanguage);

    const row = {
      s3_path_key: key,
      subject: subj?.subject_name || '',
      standard: standardLabel,
      book_type: bookTypeExact,
      book_language: languageExact,
    };
    const payload = { records: [row] };

    try {
      const { data } = await authAxiosInstance.post('/primary_knowledge/', payload);
      toast.success('Primary knowledge record created');

      // --- WebSocket step: send knowledge object ---
      const knowledge = {
        type: 'vectorize_book',
        knowledge_ids: data?.knowledge_ids,
        while_book_generation: false,
      };

      try {
        await sendKnowledgeOverWS(
          'wss://tbmplus-backend.ultimeet.io/ws/vectorize/',
          knowledge,
          { timeoutMs: 15000, retries: 1 }
        );
        toast.success('Vectorization queued');
      } catch (wsErr) {
        console.error('[ws] send failed', wsErr);
        toast.error('Could not notify vectorizer (WS)');
      }

      setUpdateState((prev)=>prev+1)
      handleClose();
    } catch (err) {
      console.error('[create] failed', err?.response?.status, err?.response?.data || err);
      toast.error(extractErrorMessage(err));
      throw err;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      setSaving(true);
      await postCreateRecord(s3Key);
    } catch (e2) {
      console.error('[create] failed', e2);
      toast.error('Create failed');
    } finally {
      setSaving(false);
    }
  };

  const Button = (
    <button
      onClick={() => setOpen(true)}
      className="group relative inline-flex items-center gap-2 rounded-xl px-5 py-2.5
                 text-white active:scale-[0.98] transition-all
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
      style={{ backgroundImage: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
    >
      <Plus className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
      <span className="font-medium">Create Primary Book</span>
      <span className="absolute inset-0 rounded-xl ring-1 ring-white/10 pointer-events-none" />
    </button>
  );

  const Modal = (
    <div className="fixed inset-0 z-[99999]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-100 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="w-[92vw] sm:w-[88vw] md:w-[82vw] lg:w-[70vw] max-w-6xl
                     bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-black/5"
          onClick={(e) => e.stopPropagation()}
          style={{ transformOrigin: 'center' }}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl border-b">
            <div>
              <h3 className="text-lg font-semibold leading-tight">Create Primary Book</h3>
              <p className="text-xs text-gray-500">Upload file → get S3 key → POST /primary_knowledge/ → WS notify.</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5">
            <div className="space-y-6">
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`relative rounded-xl border-2 border-dashed px-5 py-6
                            transition-all cursor-pointer
                            ${isDragging ? 'border-violet-400 bg-violet-50/60' : 'border-gray-300 hover:bg-gray-50/60'}`}
                onClick={() => document.getElementById('pb-file-input')?.click()}
              >
                <input
                  id="pb-file-input"
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => handleFilePicked(e.target.files?.[0] ?? null)}
                />
                <div className="flex items-center gap-4">
                  <div className={`grid place-items-center rounded-xl p-3
                                   ${s3Key ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {saving && !s3Key ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    {!file ? (
                      <>
                        <div className="font-medium text-gray-900">
                          Drag & drop file here, or <span className="text-indigo-600 underline">browse</span>
                        </div>
                        <div className="text-xs text-gray-500">Accepted: PDF, DOC, DOCX, PNG, JPG, JPEG</div>
                      </>
                    ) : (
                      <>
                        <div className="font-medium text-gray-900">{file.name}</div>
                        <div className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'file'}
                        </div>
                        {!s3Key && saving ? (
                          <div className="mt-2 h-2 w-full rounded bg-gray-200 overflow-hidden">
                            <div
                              className="h-2 bg-indigo-500 transition-all"
                              style={{ width: `${Math.min(99, uploadPct)}%` }}
                            />
                          </div>
                        ) : null}
                        {s3Key ? <div className="mt-2 text-xs text-emerald-700">Uploaded ✓ — S3 Key: {s3Key}</div> : null}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Subject</label>
                  <div className="relative">
                    <select
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                      required
                      disabled={subjectsLoading || !!subjectsErr}
                    >
                      <option value="">
                        {subjectsLoading ? 'Loading subjects…' : (subjectsErr ? 'Failed to load subjects' : 'Select subject…')}
                      </option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.subject_name}</option>
                      ))}
                    </select>
                    {subjectsLoading && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                    )}
                  </div>
                  {subjectsErr ? <p className="text-xs text-red-600">{subjectsErr}</p> : null}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Standard</label>
                  <select
                    value={standard}
                    onChange={(e) => setStandard(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                    required
                  >
                    <option value="">Select standard…</option>
                    {STANDARD_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Book Type</label>
                  <select
                    value={bookType}
                    onChange={(e) => setBookType(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select book type…</option>
                    {BOOK_TYPE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Book Language</label>
                  <select
                    value={bookLanguage}
                    onChange={(e) => setBookLanguage(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select language…</option>
                    {LANGUAGE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 mt-6 -mx-6 px-6 py-4 bg-white/80 backdrop-blur-xl border-t">
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="group relative inline-flex items-center gap-2 rounded-xl px-5 py-2.5
                             text-white active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                  style={{ backgroundImage: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                  <span className="font-medium">{saving ? 'Creating…' : 'Create Book'}</span>
                  <span className="absolute inset-0 rounded-xl ring-1 ring-white/10 pointer-events-none" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {Button}
      {open && mounted ? createPortal(Modal, document.body) : null}
    </div>
  );
}
