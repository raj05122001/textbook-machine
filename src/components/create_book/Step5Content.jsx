'use client';

import { useState, useMemo } from 'react';
import { Clock } from 'lucide-react';
import GeneratedPayloadModal from '@/components/GeneratedPayloadModal';
import SuccessRow from "@/components/SuccessRow";
import FailedRow from "@/components/FailedRow";

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.2s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.1s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" />
    </span>
  );
}

export function Step5Content({ isStreaming, processingStep, contentPhase = {}, lessonProgress, contentJson }) {
  const [openPayload, setOpenPayload] = useState(null);

  const norm = (s) => String(s || '').toLowerCase().trim().replace(/\s+/g, '_');

  const lessonsArr = useMemo(
    () => Object.values(lessonProgress || {}).sort(
      (a, b) => (a.startedAt ?? 0) - (b.startedAt ?? 0)
    ),
    [lessonProgress]
  );

  const { total, done, failed, started, active } = useMemo(() => {
    let t = 0, d = 0, f = 0, s = 0, a = 0;
    for (const r of lessonsArr) {
      t += 1;
      const st = norm(r?.status);
      if (st === 'completed') d += 1;
      else if (st === 'failed') f += 1;
      else if (st === 'started') s += 1;

      if (!['completed', 'failed', 'idle', ''].includes(st)) a += 1;
    }
    return { total: t, done: d, failed: f, started: s, active: a };
  }, [lessonsArr]);

  // 👇 Moved here: total/failed now exist
  const showFailed = total === 1 && failed === 1;

  const pillClass =
    contentPhase?.status === 'completed'
      ? 'bg-emerald-100 text-emerald-700'
      : contentPhase?.status === 'failed'
        ? 'bg-red-100 text-red-700'
        : contentPhase?.status === 'started'
          ? 'bg-blue-100 text-blue-700'
          : 'bg-gray-100 text-gray-700';

  const showSuccess =
    contentPhase?.status === 'completed' &&
    started === 0 &&
    active === 0 &&
    failed === 0 &&
    (total === 0 || done === total) &&
    Boolean((contentPhase?.message || '').trim());

  const SkeletonRow = () => (
    <div className="px-4 py-3">
      <div className="animate-pulse">
        <div className="h-3 w-40 bg-gray-200 rounded mb-2" />
        <div className="h-2.5 w-5/6 bg-gray-200 rounded mb-1.5" />
        <div className="h-2.5 w-3/5 bg-gray-200 rounded" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Generated Content</h2>
        <p className="text-gray-600">Live updates via content websocket</p>
      </div>

      {showFailed ? (
        <FailedRow
          title="Generation failed"
          subtitle={contentPhase?.message || "Something went wrong. Please try again."}
        />
      ) : showSuccess ? (
        <SuccessRow
          title="Dynamic Prompt ready!"
          subtitle={contentPhase?.message || "Dynamic Prompt generation completed."}
          confetti
        />
      ) : (
        <div className="w-full max-w-5xl mx-auto border rounded-2xl bg-white p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white grid place-items-center">
              <svg viewBox="0 0 24 24" className={`h-5 w-5 ${isStreaming ? 'animate-spin' : ''}`}>
                <path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Z" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm text-gray-600">
                  {isStreaming ? (
                    <span className="inline-flex items-center gap-2">
                      Generating content <TypingDots />
                    </span>
                  ) : (
                    'Updates received'
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${pillClass}`}>
                  {contentPhase?.status || 'IDLE'}
                </span>
              </div>

              <div className="text-gray-900 font-medium truncate">
                {contentPhase?.message || processingStep || (isStreaming ? 'Preparing…' : 'Ready')}
              </div>

              {isStreaming && (
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>ETA ~30–40 min</span>
                </div>
              )}

              {total > 0 && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-1.5 bg-gray-200 rounded w-48 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                      style={{ width: `${Math.round((done / Math.max(total, 1)) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {done}/{total} done{failed ? ` • ${failed} failed` : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lesson progress */}
      <div className="w-full max-w-5xl mx-auto rounded-2xl border bg-white overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 font-semibold">Lesson progress</div>
        <div className="divide-y">
          {lessonsArr.length === 0 && (<><SkeletonRow /><SkeletonRow /><SkeletonRow /></>)}

          {lessonsArr.map((l, idx) => (
            <div key={idx} className="px-4 py-3 flex items-start gap-3">
              <div className={`mt-1 shrink-0 w-2 h-2 rounded-full
                ${norm(l.status) === 'completed' ? 'bg-emerald-500' :
                  norm(l.status) === 'failed' ? 'bg-red-500' : 'bg-blue-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{l.unit} — {l.lesson}</div>
                <div className="text-sm text-gray-600">{l.message || (norm(l.status) === 'started' ? 'Generating…' : '')}</div>

                {norm(l.status) === "completed" && l.data && (
                  <button
                    onClick={() => setOpenPayload(l.data)}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    View generated payload
                  </button>
                )}
              </div>
              <span className="text-xs uppercase tracking-wide text-gray-500">{l.status}</span>
            </div>
          ))}
        </div>
      </div>

      <GeneratedPayloadModal
        open={!!openPayload}
        onClose={() => setOpenPayload(null)}
        payload={openPayload}
      />
    </div>
  );
}
