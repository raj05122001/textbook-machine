'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, X, Check, AlertCircle, Loader2, BookOpen,
  Plus, Sparkles, Zap, Clock, Target, ChevronRight, ChevronLeft, Edit3,
  Save, MessageSquare, CheckCircle2, Trash2, HelpCircle, ArrowRight
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import GeneratedPayloadModal from '@/components/GeneratedPayloadModal';

/* ================== API & WS CONFIG ================== */
const API_BASE = 'https://tbmplus-backend.ultimeet.io';
const WS_BASE = API_BASE.replace(/^https/i, 'wss'); // => wss://tbmplus-backend.ultimeet.io

/* ================== SHARED UTILS ================== */
const clone = (o) =>
  typeof structuredClone === 'function' ? structuredClone(o) : JSON.parse(JSON.stringify(o));

const pickSyllabusPayload = (raw) => raw?.syllabus_json ?? raw?.syllabus ?? null;
const pickContentPayload  = (raw) => raw?.content_json  ?? raw?.content  ?? null;

async function jfetch(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json().catch(() => ({}));
}


/* ---- Editable ---- */
function Editable({ value, placeholder = '', className = '', onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && ref.current.innerText !== (value || '')) {
      ref.current.innerText = value || '';
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

/* ---- Syllabus normalize/denormalize ---- */
function normalizeSyllabus(raw) {
  const s = pickSyllabusPayload(raw);
  if (!s) return { subject_name: '', subject_description: '', units: [] };
  return {
    subject_name: s.subject_name ?? '',
    subject_description: s.subject_description ?? '',
    units: Array.isArray(s.units)
      ? s.units.map((u, ui) => ({
          unit_id: u?.unit_id ?? ui + 1,
          unit_name: u?.unit_name ?? `Unit ${ui + 1}`,
          number_of_pages: u?.number_of_pages ?? undefined,
          lessons: Array.isArray(u?.lessons)
            ? u.lessons.map((l, li) => ({
                lesson_id: l?.lesson_id ?? li + 1,
                lesson_name: l?.lesson_name ?? `Lesson ${li + 1}`,
                number_of_pages: l?.number_of_pages ?? undefined,
                lesson_description: l?.lesson_description ?? '',
              }))
            : [],
        }))
      : [],
  };
}
function denormalizeSyllabus(doc) {
  return {
    subject_name: doc?.subject_name ?? '',
    subject_description: doc?.subject_description ?? '',
    units: (doc?.units ?? []).map((u, ui) => ({
      unit_id: u?.unit_id ?? ui + 1,
      unit_name: u?.unit_name ?? `Unit ${ui + 1}`,
      number_of_pages: u?.number_of_pages ?? undefined,
      lessons: (u?.lessons ?? []).map((l, li) => ({
        lesson_id: l?.lesson_id ?? li + 1,
        lesson_name: l?.lesson_name ?? `Lesson ${li + 1}`,
        number_of_pages: l?.number_of_pages ?? undefined,
        lesson_description: l?.lesson_description ?? '',
      })),
    })),
  };
}

/* ================== STEP SUB-COMPONENTS ================== */
function Step1BookDetails({ formData, setFormData }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Information</h2>
        <p className="text-gray-600">Provide details about your book</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Book Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            placeholder="Enter your book title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Author Name *</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData((p) => ({ ...p, author: e.target.value }))}
            placeholder="Your name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            placeholder="Brief description of your book"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ACADEMICS">ACADEMICS</option>
            <option value="TRAINING">TRAINING</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={formData.language}
            onChange={(e) => setFormData((p) => ({ ...p, language: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ENGLISH">ENGLISH</option>
            <option value="FRENCH">FRENCH</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Educational Level</label>
          <input
            type="text"
            value={formData.educational_level}
            onChange={(e) => setFormData((p) => ({ ...p, educational_level: e.target.value }))}
            placeholder="e.g., 12TH, UG, PG"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
          <select
            value={formData.difficulty_level}
            onChange={(e) => setFormData((p) => ({ ...p, difficulty_level: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="EASY">EASY</option>
            <option value="MODERATE">MODERATE</option>
            <option value="HARD">HARD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Style</label>
          <select
            value={formData.teaching_style}
            onChange={(e) => setFormData((p) => ({ ...p, teaching_style: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PRACTICAL">PRACTICAL</option>
            <option value="THEORITICAL">THEORITICAL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Pages</label>
          <input
            type="number"
            min={1}
            value={formData.expected_pages}
            onChange={(e) => setFormData((p) => ({ ...p, expected_pages: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Group</label>
           <select
            value={formData.teaching_style}
            onChange={(e) => setFormData((p) => ({ ...p, target_group: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="STUDENTS">STUDENTS</option>
            <option value="PROFESSIONAL">PROFESSIONAL</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function Step2AISettings({ formData, setFormData, uploadedFiles, textContent, toggleProc }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Processing Options</h2>
        <p className="text-gray-600">Configure how AI will process and enhance your content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">AI Model</label>
          <select
            value={formData.model_preference}
            onChange={(e) => setFormData((p) => ({ ...p, model_preference: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="OPENAI">OPENAI 4o (Recommended)</option>
            <option value="CLAUDE">CLAUDE</option>
            <option value="GEMINI">GEMINI</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">OPENAI provides a great balance of quality and speed</p>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Processing Features (UI only)</h4>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={!!formData.processingOptions?.createQuestions}
              onChange={() => toggleProc('createQuestions')}
              className="mt-1"
            />
            <div>
              <div className="font-medium">Create Q&A</div>
              <div className="text-sm text-gray-600">Generate review questions and answers for each chapter</div>
            </div>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={!!formData.processingOptions?.addReferences}
              onChange={() => toggleProc('addReferences')}
              className="mt-1"
            />
            <div>
              <div className="font-medium">Add References</div>
              <div className="text-sm text-gray-600">Include relevant citations and reference materials</div>
            </div>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={!!formData.processingOptions?.improveContent}
              onChange={() => toggleProc('improveContent')}
              className="mt-1"
            />
            <div>
              <div className="font-medium">Improve Content</div>
              <div className="text-sm text-gray-600">Enhance readability and fix grammar issues</div>
            </div>
          </label>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Processing Preview
        </h4>
        <div className="text-sm text-blue-800 space-y-2">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Estimated processing time: 2–5 minutes</span>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>
              Expected chapters:{' '}
              {Math.ceil(
                (textContent?.length ||
                  uploadedFiles.reduce((acc, f) => acc + (f.content?.length || 0), 0)) / 2000
              ) || 1}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Reading time: {Math.ceil((textContent?.split(' ').length || 0) / 200) || 1} minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3SyllabusInput({
  subject, setSubject, bookId,
  inputMethod, setInputMethod,
  getRootProps, getInputProps, isDragActive,
  uploadedFiles, removeFile, formatFileSize,
  textContent, setTextContent,
  onCreateSyllabus
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">How would you like to add content?</h2>
        <p className="text-gray-600">Choose your preferred method (Upload or Paste)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Mathematics"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Book ID (created)</label>
          <input
            disabled
            value={bookId ?? '—'}
            className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setInputMethod('paste')}
          className={`p-6 rounded-lg border-2 transition-all ${
            inputMethod === 'paste' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Edit3 className="h-8 w-8 mx-auto mb-3 text-green-600" />
          <h3 className="font-semibold mb-2">Paste Content</h3>
          <p className="text-sm text-gray-600">Paste text directly into the editor</p>
        </button>

        <button
          onClick={() => setInputMethod('upload')}
          className={`p-6 rounded-lg border-2 transition-all ${
            inputMethod === 'upload' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Upload className="h-8 w-8 mx-auto mb-3 text-blue-600" />
          <h3 className="font-semibold mb-2">Upload Files</h3>
          <p className="text-sm text-gray-600">Upload PDF, DOCX, TXT, or MD files</p>
        </button>
      </div>

      {inputMethod === 'upload' && (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </h3>
            <p className="text-gray-600 mb-4">or <span className="text-blue-600 font-medium">browse files</span></p>
            <p className="text-sm text-gray-500">Supported: PDF, DOCX, TXT, MD • Max 50MB per file</p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Uploaded Files ({uploadedFiles.length})</h4>
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{file.file.name}</div>
                      <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                    </div>
                  </div>
                  <button onClick={() => removeFile(file.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {inputMethod === 'paste' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Paste your content here</label>
          <textarea
            rows={12}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Paste your syllabus, notes, or any text content here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2 text-sm text-gray-500">
            {textContent.length.toLocaleString()} characters • {Math.ceil((textContent.split(' ').length || 0) / 250)} estimated pages
          </div>
        </div>
      )}

      {/* <div className="flex items-center justify-end">
        <button
          onClick={onCreateSyllabus}
          className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
        >
          <Sparkles className="h-4 w-4" />
          <span>Create Syllabus</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div> */}
    </div>
  );
}

function Step4SyllabusReview({
  isStreaming, processingStep, bookId, syllabusId,
  syllabusDoc, setSyllabusDoc,
  onSave, onFeedback, onApprove
}) {
  if (isStreaming) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <Loader2 className="h-16 w-16 text-white animate-spin" />
        </div>
        <div className="text-gray-700 font-medium">{processingStep || 'Processing...'}</div>
        <div className="text-xs text-gray-500 mt-1">Book ID: {bookId ?? '—'} • Syllabus ID: {syllabusId ?? '—'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Syllabus Review & Refinement</h2>
        <p className="text-gray-600">Edit the generated syllabus or regenerate using feedback</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Save className="h-4 w-4" />
          Save edited syllabus
        </button>
        <div className="ml-auto text-xs text-gray-500">
          Book: {bookId ?? '—'} • Syllabus: {syllabusId ?? '—'}
        </div>
      </div>

      {/* DOC-like editor */}
      <div className="flex justify-center">
        <div className="bg-white w-[816px] min-h-[1056px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-[12px] border border-zinc-200">
          <div className="px-[72px] py-[72px]">
            <Editable
              value={syllabusDoc.subject_name || ''}
              placeholder="Untitled document"
              onChange={(v) => setSyllabusDoc((p) => ({ ...p, subject_name: v }))}
              className="text-[28px] leading-tight font-semibold text-zinc-900 mb-1"
            />
            <Editable
              value={syllabusDoc.subject_description || ''}
              placeholder="Add a short description…"
              onChange={(v) => setSyllabusDoc((p) => ({ ...p, subject_description: v }))}
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
                      <div className="flex items-center gap-2">
                        {/* <span className="text-xs text-zinc-500">Pages</span>
                        <input
                          type="number"
                          value={u.number_of_pages ?? ''}
                          onChange={(e) => {
                            const v = e.target.value ? Number(e.target.value) : undefined;
                            setSyllabusDoc((p) => {
                              const c = clone(p);
                              c.units[ui].number_of_pages = v;
                              return c;
                            });
                          }}
                          className="w-16 px-2 py-1 rounded-md border text-sm"
                        /> */}
                        <button
                          onClick={() => {
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
                  </div>

                  <ol className="mt-3 list-decimal pl-6 space-y-2">
                    {(u.lessons ?? []).map((l, li) => (
                      <li key={li} className="relative pr-28">
                        <div className="text-[15px] text-zinc-900 font-medium">
                          <Editable
                            value={l.lesson_name}
                            placeholder={`Lesson ${li + 1}`}
                            onChange={(v) => {
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
                            value={l.lesson_description ?? ''}
                            placeholder="Add a short lesson description…"
                            onChange={(v) => {
                              setSyllabusDoc((p) => {
                                const c = clone(p);
                                c.units[ui].lessons[li].lesson_description = v;
                                return c;
                              });
                            }}
                          />
                        </div>

                        <div className="absolute top-0 right-0 flex items-center gap-2">
                          {/* <input
                            type="number"
                            value={l.number_of_pages ?? ''}
                            onChange={(e) => {
                              const v = e.target.value ? Number(e.target.value) : undefined;
                              setSyllabusDoc((p) => {
                                const c = clone(p);
                                c.units[ui].lessons[li].number_of_pages = v;
                                return c;
                              });
                            }}
                            className="w-14 px-2 py-1 rounded-md border text-sm"
                            placeholder="pg"
                            title="Pages"
                          />
                          <button
                            onClick={() => {
                              setSyllabusDoc((p) => {
                                const c = clone(p);
                                c.units[ui].lessons.splice(li, 1);
                                return c;
                              });
                            }}
                            className="text-red-600 hover:bg-red-50 border border-red-200 px-2 py-1 rounded-md"
                            title="Remove lesson"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button> */}
                        </div>
                      </li>
                    ))}
                  </ol>

                  <button
                    onClick={() =>
                      setSyllabusDoc((p) => {
                        const c = clone(p);
                        const nextId = (u.lessons?.length ?? 0) + 1;
                        c.units[ui].lessons.push({
                          lesson_id: nextId,
                          lesson_name: 'New lesson',
                          number_of_pages: 2,
                          lesson_description: '',
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

      {/* Feedback + Approve */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Regenerate based on feedback
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <textarea
              rows={3}
              placeholder='e.g., "Increase the number of units, add more calculus examples"'
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => onFeedback(e.target.value)}
            />
          </div>
          <div className="md:col-span-1 flex items-start gap-2">
            <button
              onClick={() => onFeedback('SEND')}
              className="w-full h-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Send feedback & regenerate
            </button>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={onApprove}
            className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- helper: animated typing dots like ChatGPT --- */
/* --- helper: animated typing dots like ChatGPT --- */
function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.2s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.1s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" />
    </span>
  );
}

function Step5Content({ isStreaming, processingStep, contentPhase, lessonProgress, contentJson }) {
  const [openPayload, setOpenPayload] = useState(null);
  // stable ordering by first-seen time
  const lessonsArr = Object.values(lessonProgress || {}).sort(
    (a, b) => (a.startedAt ?? 0) - (b.startedAt ?? 0)
  );
  const done   = lessonsArr.filter((l) => l.status === 'completed').length;
  const failed = lessonsArr.filter((l) => l.status === 'failed').length;
  const total  = lessonsArr.length;

  const pillClass =
    contentPhase.status === 'completed'
      ? 'bg-emerald-100 text-emerald-700'
      : contentPhase.status === 'failed'
      ? 'bg-red-100 text-red-700'
      : contentPhase.status === 'started'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-gray-100 text-gray-700';

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

      {/* Header card */}
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
                {contentPhase.status || 'IDLE'}
              </span>
            </div>

            <div className="text-gray-900 font-medium truncate">
              {contentPhase.message || processingStep || (isStreaming ? 'Preparing…' : 'Ready')}
            </div>

            {total > 0 && (
              <div className="mt-2 flex items-center gap-3">
                <div className="h-1.5 bg-gray-200 rounded w-48 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ width: `${Math.round((done / Math.max(total, 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{done}/{total} done{failed ? ` • ${failed} failed` : ''}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lesson progress */}
      <div className="w-full max-w-5xl mx-auto rounded-2xl border bg-white overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 font-semibold">Lesson progress</div>
        <div className="divide-y">
          {lessonsArr.length === 0 && (<><SkeletonRow /><SkeletonRow /><SkeletonRow /></>)}

          {lessonsArr.map((l, idx) => (
            <div key={idx} className="px-4 py-3 flex items-start gap-3">
              <div className={`mt-1 shrink-0 w-2 h-2 rounded-full
                ${l.status === 'completed' ? 'bg-emerald-500' :
                  l.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{l.unit} — {l.lesson}</div>
                <div className="text-sm text-gray-600">{l.message || (l.status === 'started' ? 'Generating…' : '')}</div>

                {l.status === "completed" && l.data && (
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



/* ================== MAIN PAGE ================== */
export default function CreateBookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ---------- steps ---------- */
  const steps = [
    { id: 1, title: 'Book Details',    description: 'Add title, author, and description' },
    { id: 2, title: 'AI Settings',     description: 'Configure processing options' },
    { id: 3, title: 'Syllabus Input',  description: 'Choose input & create syllabus' },
    { id: 4, title: 'Syllabus Review', description: 'Edit or regenerate via feedback' },
    { id: 5, title: 'Content',         description: 'Live generated book content' },
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // derive completed steps from URL/state
const syncCompletedFromFlags = (bId, sId, approved) => {
  const s = new Set();
  if (bId) { s.add(1); s.add(2); }     // Book created ⇒ step 1 & 2 done
  if (sId) { s.add(3); }               // Syllabus exists ⇒ step 3 done
  if (approved) { s.add(4); }          // Approved ⇒ step 4 done
  setCompletedSteps(s);
};

  /* ---------- ids ---------- */
  const [bookId, setBookId] = useState(null);
  const [syllabusId, setSyllabusId] = useState(null);
  const [contentId, setContentId] = useState(null); // from approve API or fallback

  /* ---------- book form ---------- */
  const [formData, setFormData] = useState({
    title: '', author: '', description: '',
    category: 'ACADEMICS', language: 'ENGLISH', educational_level: '12TH',
    difficulty_level: 'MODERATE', teaching_style: 'PRACTICAL',
    model_preference: 'OPENAI', country_region: 'INDIA',
    expected_pages: 200, target_group: 'STUDENTS',
    visibility: 'private', processingOptions: {},
  });

  /* ---------- syllabus state ---------- */
  const [subject, setSubject] = useState('Mathematics');
  const [feedbackText, setFeedbackText] = useState('');
  const [syllabusDoc, setSyllabusDoc] = useState({ subject_name: '', subject_description: '', units: [] });

  /* ---------- content state ---------- */
  const [contentJson, setContentJson] = useState(null);

  /* ---------- UI/control ---------- */
  const [errors, setErrors] = useState([]);
  const [processingStep, setProcessingStep] = useState('');
  const [isSyllabusStreaming, setIsSyllabusStreaming] = useState(false);
  const [isContentStreaming, setIsContentStreaming] = useState(false);

  /* ---------- files / pasted ---------- */
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [textContent, setTextContent] = useState('');
  const [inputMethod, setInputMethod] = useState('paste');

  /* ---------- websockets ---------- */
  const syllabusWsRef = useRef(null);
  const contentWsRef  = useRef(null);
  const wsBackoffRef  = useRef(1000);
  const syllabusExpectingRef = useRef(false);

  // ----- Step 5 state -----
const [contentPhase, setContentPhase] = useState({   // prompt_generation phase status
  status: 'idle',   // idle | started | completed | failed
  message: '',
});
const [lessonProgress, setLessonProgress] = useState({}); // { [lesson_id]: { unit, lesson, status, message, data? } }
const [contentLog, setContentLog] = useState([]);         // array of { ts, status, type, message }


  const isOpen = (ws) => ws && ws.readyState === WebSocket.OPEN;
const reconnectLater = (fn, delayRef, id) => {
  const delay = Math.min(delayRef.current || 1000, 8000);
  setTimeout(() => fn(id), delay);
  delayRef.current = (delayRef.current || 1000) * 2;
};

useEffect(() => {
  return () => {
    syllabusExpectingRef.current = false;   // <— add this
    try { syllabusWsRef.current?.close(); } catch {}
    try { contentWsRef.current?.close(); } catch {}
  };
}, []);


  const openSyllabusSocket = useCallback((id) => {
  if (!id) return;

  // if already open for this id, keep it
  if (isOpen(syllabusWsRef.current) && syllabusWsRef.current.__sid === id) return;

  try { syllabusWsRef.current?.close(); } catch {}
  syllabusWsRef.current = null;

  const ws = new WebSocket(`${WS_BASE}/ws/syllabus/${id}/`);
  ws.__sid = id;
  syllabusWsRef.current = ws;

  ws.onopen = () => {
    wsBackoffRef.current = 1000;
    // if we triggered this reconnect because we expect updates (feedback), show spinner
    if (syllabusExpectingRef.current) {
      setIsSyllabusStreaming(true);
      setProcessingStep('Regenerating...');
    }
  };

  ws.onmessage = (evt) => {
    try {
      const msg = JSON.parse(evt.data || '{}');
      const json = msg.syllabus ?? msg.syllabus_json ?? null;

      if (msg.status === 'started') {
        syllabusExpectingRef.current = true;
        setIsSyllabusStreaming(true);
        setProcessingStep('Generating syllabus...');
      }

      if (json) {
        setSyllabusDoc(normalizeSyllabus({ syllabus_json: json }));
        setIsSyllabusStreaming(false);
        syllabusExpectingRef.current = false;
        toast.success('Syllabus updated');
      }

      if (msg.status === 'completed') {
        setIsSyllabusStreaming(false);
        syllabusExpectingRef.current = false;
      }
    } catch (e) {
      console.debug('syllabus WS parse error:', e?.message);
    }
  };

  ws.onclose = () => {
    // reconnect only if we are expecting more messages (e.g., just sent feedback)
    if (syllabusExpectingRef.current && document.visibilityState === 'visible') {
      reconnectLater(openSyllabusSocket, wsBackoffRef, id);
    }
  };

  ws.onerror = () => {
    try { ws.close(); } catch {}
  };
}, []);

  const openContentSocket = useCallback((syllId) => {
  if (!syllId) return;
  if (contentWsRef.current) { try { contentWsRef.current.close(); } catch {} contentWsRef.current = null; }

  const ws = new WebSocket(`${WS_BASE}/ws/content/${syllId}/`);
  contentWsRef.current = ws;

  setIsContentStreaming(true);
  setProcessingStep('Generating content...');

  ws.onopen = () => {
    wsBackoffRef.current = 1000;
  };

 ws.onmessage = (evt) => {
  let msg = {};
  try { msg = JSON.parse(evt.data || '{}'); } catch {}

  const { status, type, message } = msg;

  // show last message in the header
  setProcessingStep(message || '');

  // prompt phase
  if (type === 'prompt_generation') {
    if (status === 'started')   setContentPhase({ status: 'started',   message: message || 'Dynamic Prompt generation started' });
    if (status === 'completed') setContentPhase({ status: 'completed', message: message || 'Dynamic Prompt generation completed' });
    if (status === 'failed')    setContentPhase({ status: 'failed',    message: message || 'Prompt generation failed' });
    return; // nothing else to do on this frame
  }

  // per-lesson frames
  if (type === 'content_generation') {
    const unitName   = msg.Unit_name ?? msg.unit_name ?? '';
    const lessonName = msg.lesson_name ?? '';
    const lessonId   = msg.lesson_id ?? msg.lesson?.id;

    // >>> unique key across units/lessons – DO NOT use lesson_id alone
    const key = `${unitName}::${lessonName}::${lessonId ?? ''}`;

    const entry = {
      unit: unitName,
      lesson: lessonName,
      status,
      message: message || '',
      data: msg.data || null,
      updatedAt: Date.now(),
      // preserve the first start time for ordering
      startedAt: undefined,
    };

    setLessonProgress((prev) => {
      const existing = prev[key];
      return {
        ...prev,
        [key]: {
          ...existing,
          ...entry,
          startedAt: existing?.startedAt ?? (status === 'started' ? Date.now() : Date.now()),
        },
      };
    });

    if (status === 'completed' && msg.data) {
      setContentJson((prev) => ({
        ...(prev || {}),
        [key]: msg.data,
      }));
    }
  }

  // stop spinner when backend says all lessons are done
  if (status === 'completed' && type === 'content_generation' && /for all lessons/i.test(message || '')) {
    setIsContentStreaming(false);
  }
  if (status === 'failed') setIsContentStreaming(false);
};

  ws.onclose = () => {
    setIsContentStreaming(false);
  };
  ws.onerror = () => {
    try { ws.close(); } catch {}
  };
}, []);


  useEffect(() => {
    return () => {
      try { syllabusWsRef.current?.close(); } catch {}
      try { contentWsRef.current?.close(); } catch {}
    };
  }, []);

  /* ---------- URL ids on first load ---------- */
  /* ---------- URL ids on first load ---------- */
useEffect(() => {
  const qBook = searchParams.get('bookId');
  const qSyl  = searchParams.get('syllabusId');
  const qApproved = (searchParams.get('approved') || '').toLowerCase() === 'true';

  if (qBook) setBookId(Number(qBook));
  if (qSyl)  setSyllabusId(Number(qSyl));

  // set completed steps based on URL flags
  syncCompletedFromFlags(qBook ? Number(qBook) : null, qSyl ? Number(qSyl) : null, qApproved);

  if (qSyl) {
    if (qApproved) {
      openContentSocket(Number(qSyl));
      setCurrentStep(5);
    } else {
      // existing syllabus review bootstrap...
      (async () => {
        try {
          const data = await jfetch(`/api/syllabi/${Number(qSyl)}/`, { method: 'GET' });
          const json = pickSyllabusPayload(data);
          if (json) setSyllabusDoc(normalizeSyllabus({ syllabus_json: json }));
          else { setIsSyllabusStreaming(true); setProcessingStep('Generating syllabus...'); }
        } catch {}
      })();
      openSyllabusSocket(Number(qSyl));
      setCurrentStep(4);
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  /* ---------- drag & drop ---------- */
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile = {
          id: Date.now() + Math.random(),
          file,
          content: e.target?.result,
          size: file.size,
          type: file.type,
          status: 'ready',
        };
        setUploadedFiles((prev) => [...prev, newFile]);
      };
      if (file.type.startsWith('text/')) reader.readAsText(file);
      else reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
      'text/rtf': ['.rtf'],
    },
    maxSize: 50 * 1024 * 1024,
    maxFiles: 10,
  });
  const removeFile = (fileId) => setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  /* ================== VALIDATION & NAV ================== */
  const validateStep = (step) => {
    const newErrors = [];
    if (step === 1) {
      if (!formData.title.trim()) newErrors.push('Book title is required');
      if (!formData.author.trim()) newErrors.push('Author name is required');
    }
    if (step === 2) {
      if (!formData.category) newErrors.push('Category is required');
      if (!formData.language) newErrors.push('Language is required');
      if (!formData.model_preference) newErrors.push('Model preference is required');
    }
    if (step === 3) {
      if (!bookId) newErrors.push('Book is not created yet.');
      if (!subject.trim()) newErrors.push('Subject is required for syllabus.');
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const markDoneAndNext = (step) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  // replace the old version
const pushIdsToUrl = (bId, sId, extra = {}) => {
  const p = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  if (bId) p.set('bookId', String(bId));
  if (sId) p.set('syllabusId', String(sId));
  Object.entries(extra).forEach(([k, v]) => v != null && p.set(k, String(v)));
  router.replace(`?${p.toString()}`);

  // also update completedSteps immediately
  const approved = (extra.approved ?? (p.get('approved')?.toLowerCase() === 'true'));
  syncCompletedFromFlags(bId ?? bookId, sId ?? syllabusId, approved);
};


  const nextStep = async () => {
    if (currentStep === 1) {
      if (!validateStep(1)) return;
      markDoneAndNext(1);
      return;
    }
    if (currentStep === 2) {
      if (!validateStep(2)) return;
      const ok = await createBook();
      if (ok) markDoneAndNext(2);
      return;
    }
  };
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1));

  /* ================== BACKEND CALLS ================== */
  const createBook = async () => {
    const payload = {
      title: formData.title,
      description: formData.description || '',
      category: formData.category,
      language: formData.language,
      educational_level: formData.educational_level || '',
      difficulty_level: formData.difficulty_level,
      teaching_style: formData.teaching_style,
      model_preference: formData.model_preference,
      author_name: formData.author || '',
      country_region: formData.country_region || 'INDIA',
      expected_pages: Number(formData.expected_pages) || 200,
      target_group: formData.target_group || 'STUDENTS',
    };
    try {
      const data = await jfetch('/api/books/', { method: 'POST', body: payload });
      if (!data?.id) throw new Error('Missing book id in response');
      setBookId(data.id);
      pushIdsToUrl(data.id, syllabusId);
      toast.success('Book created');
      return true;
    } catch (e) {
      setErrors([`Book creation failed: ${e.message}`]);
      return false;
    }
  };

  const createSyllabus = async () => {
    if (!validateStep(3)) return;
    try {
      const data = await jfetch('/api/syllabi/', {
        method: 'POST',
        body: { book: Number(bookId), syllabus_type: 'TEXT', subject: subject || 'Subject' },
      });
      const newId = data?.data?.id;
      if (!newId) throw new Error('Missing syllabus id in response');
      setSyllabusId(newId);
      pushIdsToUrl(bookId, newId);

      // Bootstrap: check current state once
      try {
        const d = await jfetch(`/api/syllabi/${newId}/`, { method: 'GET' });
        const json = pickSyllabusPayload(d);
        if (json) setSyllabusDoc(normalizeSyllabus(d));
        else setIsSyllabusStreaming(true);
      } catch {}

      // Live
      openSyllabusSocket(newId);
      toast.success('Syllabus creation started');
      setCurrentStep(4);
      setCompletedSteps((prev) => new Set([...prev, 3]));
    } catch (e) {
      setErrors([`Syllabus creation failed: ${e.message}`]);
    }
  };

  const saveEditedSyllabus = async () => {
    if (!syllabusId) return setErrors(['No syllabus to update.']);
    try {
      await jfetch(`/api/syllabi/${syllabusId}/`, {
        method: 'PATCH',
        body: { syllabus_json: denormalizeSyllabus(syllabusDoc) },
      });
      toast.success('Syllabus saved');
    } catch (e) {
      setErrors([`Save failed: ${e.message}`]);
    }
  };

  const sendFeedback = async (valueOrSend) => {
  if (!syllabusId) return setErrors(['No syllabus to send feedback for.']);
  const text = valueOrSend === 'SEND' ? feedbackText : valueOrSend;

  // typing path – just store text
  if (valueOrSend !== 'SEND') { setFeedbackText(text); return; }

  if (!text.trim()) return setErrors(['Feedback cannot be empty.']);

  try {
    // we expect the backend to start a new generation and push via WS
    syllabusExpectingRef.current = true;
    setIsSyllabusStreaming(true);
    setProcessingStep('Regenerating...');

    // (re)open the socket right before sending feedback, in case it was closed after first completion
    openSyllabusSocket(syllabusId);

    await jfetch(`/api/syllabi/${syllabusId}/feedback/`, {
      method: 'POST',
      body: { feedback: text.trim() },
    });
    toast.success('Feedback sent');
    // results will arrive on the websocket we just opened
  } catch (e) {
    syllabusExpectingRef.current = false;
    setIsSyllabusStreaming(false);
    setErrors([`Feedback failed: ${e.message}`]);
  }
};

  const approveSyllabus = async () => {
  if (!syllabusId) return setErrors(['No syllabus to approve.']);
  try {
    await jfetch(`/api/syllabi/${syllabusId}/approve/`, { method: 'POST' });
    toast.success('Syllabus approved');
    pushIdsToUrl(bookId, syllabusId, { approved: true });
    openContentSocket(syllabusId);      // <— use syllabusId for WS
    setCurrentStep(5);
    setCompletedSteps((prev) => new Set([...prev, 4]));
  } catch (e) {
    setErrors([`Approve failed: ${e.message}`]);
  }
};

  const toggleProc = (key) =>
    setFormData((prev) => ({
      ...prev,
      processingOptions: { ...prev.processingOptions, [key]: !prev.processingOptions?.[key] },
    }));

  /* ================== RENDER ================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-y-auto">
      <Toaster position="bottom-center" />
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Book</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your content into a professionally structured book with AI-powered automation
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center space-x-3 ${
                    currentStep === step.id
                      ? 'text-blue-600'
                      : completedSteps.has(step.id)
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      currentStep === step.id
                        ? 'border-blue-600 bg-blue-50'
                        : completedSteps.has(step.id)
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {completedSteps.has(step.id) ? <Check className="h-5 w-5" /> : <span className="font-semibold">{step.id}</span>}
                  </div>
                  <div className="hidden md:block">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-sm opacity-75">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && <ChevronRight className="h-5 w-5 text-gray-400 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h3 className="font-medium text-red-800">Please fix the following:</h3>
            </div>
            <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
              {errors.map((error, i) => <li key={i}>{error}</li>)}
            </ul>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep === 1 && (
            <Step1BookDetails formData={formData} setFormData={setFormData} />
          )}

          {currentStep === 2 && (
            <Step2AISettings
              formData={formData}
              setFormData={setFormData}
              uploadedFiles={uploadedFiles}
              textContent={textContent}
              toggleProc={toggleProc}
            />
          )}

          {currentStep === 3 && (
            <Step3SyllabusInput
              subject={subject} setSubject={setSubject} bookId={bookId}
              inputMethod={inputMethod} setInputMethod={setInputMethod}
              getRootProps={getRootProps} getInputProps={getInputProps} isDragActive={isDragActive}
              uploadedFiles={uploadedFiles} removeFile={removeFile} formatFileSize={formatFileSize}
              textContent={textContent} setTextContent={setTextContent}
              onCreateSyllabus={createSyllabus}
            />
          )}

          {currentStep === 4 && (
            <Step4SyllabusReview
              isStreaming={isSyllabusStreaming}
              processingStep={processingStep}
              bookId={bookId} syllabusId={syllabusId}
              syllabusDoc={syllabusDoc} setSyllabusDoc={setSyllabusDoc}
              onSave={saveEditedSyllabus}
              onFeedback={(v) => sendFeedback(v)}
              onApprove={approveSyllabus}
            />
          )}

          {currentStep === 5 && (
            <Step5Content
              isStreaming={isContentStreaming}
              processingStep={processingStep}
              contentPhase={contentPhase}
              lessonProgress={lessonProgress}
              contentLog={contentLog}
              contentJson={contentJson}
            />
          )}


          {/* Footer Nav */}
          {currentStep < 4 && (
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="text-sm text-gray-600">Step {currentStep} of {steps.length}</div>

              {currentStep === 3 ? (
                <button
                  onClick={createSyllabus}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                  title="Use the Create Syllabus button above"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Create Syllabus</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Help */}
        <div className="mt-8 text-center">
          <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1 mx-auto">
            <HelpCircle className="h-4 w-4" />
            <span>Need help? Check our documentation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
