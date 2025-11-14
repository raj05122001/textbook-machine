"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Plus, Save, MessageSquare, CheckCircle2, Trash2 } from "lucide-react";

/* ================== SHARED UTILS ================== */
const clone = (o) =>
  typeof structuredClone === "function" ? structuredClone(o) : JSON.parse(JSON.stringify(o));

/* ---- Editable ---- */
function Editable({ value, placeholder = "", className = "", onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && ref.current.innerText !== (value || "")) {
      ref.current.innerText = value || "";
    }
  }, [value]);
  return (
    <div
      ref={ref}
      role="textbox"
      contentEditable
      suppressContentEditableWarning
      spellCheck
      onInput={(e) => onChange(e.target.innerText)}
      onBlur={(e) => onChange(e.target.innerText.trim())}
      data-placeholder={placeholder}
      className={`outline-none whitespace-pre-wrap empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)] ${className}`}
    />
  );
}

export function Step4SyllabusReview({
  isStreaming,
  processingStep,
  bookId,
  syllabusId,
  syllabusDoc,
  setSyllabusDoc,
  onSave,
  onFeedback,
  onApprove,
  feedbackError, // 🔹 NEW: error from parent
}) {
  const [feedback, setFeedback] = useState("");
  const [hasChanges, setHasChanges] = useState(false); // 🔹 track unsaved edits
  const [saving, setSaving] = useState(false); // 🔹 small UX for save click

  // 🔹 Helper wrapper for save – handles async/sync onSave & resets flag
  const handleSaveClick = async () => {
    if (!onSave || saving || !hasChanges) return;
    try {
      setSaving(true);
      const res = onSave();
      if (res && typeof res.then === "function") {
        await res;
      }
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  };

  if (isStreaming) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-28 h-28 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-2">
          <Loader2 className="h-14 w-14 text-white animate-spin" />
        </div>
        <div className="text-gray-700 font-medium">{processingStep || "Processing..."}</div>
        <div className="text-xs text-gray-500">
          Book ID: {bookId ?? "—"} • Syllabus ID: {syllabusId ?? "—"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Syllabus Review & Refinement</h2>
        <p className="text-gray-600">Edit the generated syllabus or regenerate using feedback</p>
      </div>

      <div className="flex justify-center">
        <div className="bg-white w-[816px] min-h-[1056px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-[12px] border border-zinc-200">
          <div className="px-[72px] py-[64px]">
            <Editable
              value={syllabusDoc.subject_name || ""}
              placeholder="Untitled document"
              onChange={(v) => {
                setHasChanges(true);
                setSyllabusDoc((p) => ({ ...p, subject_name: v }));
              }}
              className="text-[28px] leading-tight font-semibold text-zinc-900 mb-1"
            />

            <Editable
              value={syllabusDoc.subject_description || ""}
              placeholder="Add a short description…"
              onChange={(v) => {
                setHasChanges(true);
                setSyllabusDoc((p) => ({ ...p, subject_description: v }));
              }}
              className="text-[15px] text-zinc-600 leading-relaxed mb-8"
            />

            <div className="space-y-8">
              {(syllabusDoc.units ?? []).map((u, ui) => (
                <div key={ui} className="group">
                  <div className="flex items-baseline gap-3">
                    <div className="text-[18px] font-semibold text-zinc-900">
                      <Editable
                        value={u.unit_name}
                        placeholder={`Unit ${ui + 1}`}
                        onChange={(v) => {
                          setHasChanges(true);
                          setSyllabusDoc((p) => {
                            const c = clone(p);
                            c.units[ui].unit_name = v;
                            return c;
                          });
                        }}
                        className="inline-block"
                      />
                    </div>
                    <div className="ml-auto">
                      <button
                        onClick={() => {
                          setHasChanges(true);
                          setSyllabusDoc((p) => {
                            const c = clone(p);
                            c.units.splice(ui, 1);
                            return c;
                          });
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:bg-red-50 border border-red-200 px-2 py-1 rounded-md inline-flex items-center gap-1"
                        title="Remove unit"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>

                  <ol className="mt-3 list-decimal pl-6 space-y-2">
                    {(u.lessons ?? []).map((l, li) => (
                      <li key={li} className="relative pr-28">
                        <div className="text-[15px] text-zinc-900 font-medium">
                          <Editable
                            value={l.lesson_name}
                            placeholder={`Lesson ${li + 1}`}
                            onChange={(v) => {
                              setHasChanges(true);
                              setSyllabusDoc((p) => {
                                const c = clone(p);
                                c.units[ui].lessons[li].lesson_name = v;
                                return c;
                              });
                            }}
                          />
                        </div>
                        <div className="text-[14px] text-zinc-600">
                          <Editable
                            value={l.lesson_description ?? ""}
                            placeholder="Add a short lesson description…"
                            onChange={(v) => {
                              setHasChanges(true);
                              setSyllabusDoc((p) => {
                                const c = clone(p);
                                c.units[ui].lessons[li].lesson_description = v;
                                return c;
                              });
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ol>

                  <button
                    onClick={() =>
                      setSyllabusDoc((p) => {
                        setHasChanges(true);
                        const c = clone(p);
                        const nextId = (u.lessons?.length ?? 0) + 1;
                        c.units[ui].lessons.push({
                          lesson_id: nextId,
                          lesson_name: "New lesson",
                          number_of_pages: 2,
                          lesson_description: "",
                        });
                        return c;
                      })
                    }
                    className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-md border hover:bg-zinc-50 text-sm"
                  >
                    <Plus className="w-4 h-4" /> Add lesson
                  </button>
                </div>
              ))}

              <div>
                <button
                  onClick={() =>
                    setSyllabusDoc((p) => {
                      setHasChanges(true);
                      const c = clone(p);
                      const nextId = (p.units?.length ?? 0) + 1;
                      c.units.push({
                        unit_id: nextId,
                        unit_name: `Unit ${nextId}`,
                        number_of_pages: 10,
                        lessons: [],
                      });
                      return c;
                    })
                  }
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border hover:bg-zinc-50 text-sm"
                >
                  <Plus className="w-4 h-4" /> Add unit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bottom status + approve/save  */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="text-xs text-gray-500">
          Book: {bookId ?? "—"} • Syllabus: {syllabusId ?? "—"}{" "}
          {hasChanges ? (
            <span className="ml-2 text-amber-600 font-medium">• Unsaved changes</span>
          ) : (
            <span className="ml-2 text-emerald-600 font-medium">• All changes saved</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <button
              onClick={handleSaveClick}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving…" : "Save edited syllabus"}
            </button>
          )}

          <button
            onClick={onApprove}
            disabled={hasChanges || saving}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all
              ${
                hasChanges || saving
                  ? "border-emerald-300 text-emerald-400 bg-emerald-50/40 cursor-not-allowed"
                  : "border-emerald-600 text-emerald-700 bg-white hover:bg-emerald-50 hover:shadow-sm"
              }`}
            title={hasChanges ? "Please save changes before approving" : "Approve this syllabus"}
          >
            <CheckCircle2 className="h-4 w-4" />
            Approve
          </button>
        </div>
      </div>

      {/* feedback box */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60">
        <div className="flex items-center justify-between px-4 py-3 border-b border-blue-200 rounded-t-xl">
          <h4 className="font-semibold text-blue-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Regenerate based on feedback
          </h4>
          <span className="text-xs text-blue-700 opacity-80">
            Tips: Be specific (e.g. “Add 2 units on Calculus with solved examples”)
          </span>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-3 items-start">
            <div>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => {
                  const val = e.target.value;
                  setFeedback(val);
                  onFeedback(val); // live text upwards
                }}
                placeholder='e.g., "Increase the number of units, add more calculus examples"'
                className="w-full min-h-[96px] px-3 py-2 rounded-lg border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-blue-700/80">
                <span>{feedback.trim().length.toLocaleString()} characters</span>
                <span>Maximize clarity for best results</span>
              </div>

              {/* 🔴 Error yahi pe show hoga */}
              {feedbackError && (
                <div className="mt-1 text-xs text-red-600">
                  {feedbackError}
                </div>
              )}
            </div>

            <div className="flex md:flex-col gap-2 md:gap-3">
              <button
                onClick={() => onFeedback({ type: "SEND", text: feedback })}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send feedback & regenerate"
              >
                Send feedback & regenerate
              </button>
              <button
                onClick={() => setFeedback("")}
                className="px-4 py-2 rounded-lg border border-blue-200 text-blue-700 hover:bg-white"
                title="Clear"
                type="button"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
