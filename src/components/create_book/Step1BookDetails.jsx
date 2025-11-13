'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, X, Check, AlertCircle, Loader2, BookOpen,
  Plus, Sparkles, Zap, Clock, Target, ChevronRight, ChevronLeft, Edit3,
  Save, MessageSquare, CheckCircle2, Trash2, HelpCircle, ArrowRight
} from 'lucide-react';

/* ================== STEP SUB-COMPONENTS ================== */
/* ================== STEP SUB-COMPONENTS ================== */
export function Step1BookDetails({
  formData,
  setFormData,
  fieldErrors = {},
  setFieldErrors,
}) {
  // helper: update value + clear field-specific error
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((p) => ({ ...p, [field]: value }));
    if (setFieldErrors && fieldErrors?.[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const errorText = (field) =>
    fieldErrors?.[field] ? (
      <p className="mt-1 text-xs text-red-600">{fieldErrors[field]}</p>
    ) : null;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Book Information
        </h2>
        <p className="text-gray-600">Provide details about your book</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Book Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Book Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={handleChange("title")}
            placeholder="Enter your book title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errorText("title")}
        </div>

        {/* Name / Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author name *
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={handleChange("author")}
            placeholder="Your name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errorText("author")}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={handleChange("description")}
            placeholder="Brief description of your book"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={formData.category || ""}
            onChange={handleChange("category")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="ACADEMICS">ACADEMICS</option>
            <option value="TRAINING">TRAINING</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={formData.language || ""}
            onChange={handleChange("language")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Language
            </option>
            <option value="ENGLISH">ENGLISH</option>
            <option value="FRENCH">FRENCH</option>
          </select>
        </div>

        {/* Educational Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Educational Level
          </label>
          <input
            type="text"
            value={formData.educational_level}
            onChange={handleChange("educational_level")}
            placeholder="e.g., 12TH, UG, PG"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={formData.difficulty_level || ""}
            onChange={handleChange("difficulty_level")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Difficulty
            </option>
            <option value="EASY">EASY</option>
            <option value="MODERATE">MODERATE</option>
            <option value="HARD">HARD</option>
          </select>
        </div>

        {/* Teaching Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teaching Style
          </label>
          <select
            value={formData.teaching_style || ""}
            onChange={handleChange("teaching_style")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Teaching Style
            </option>
            <option value="PRACTICAL">PRACTICAL</option>
            <option value="THEORITICAL">THEORITICAL</option>
          </select>
        </div>

        {/* Expected Pages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Pages
          </label>
          <input
            type="number"
            min={1}
            value={formData.expected_pages}
            onChange={handleChange("expected_pages")}
            placeholder="Approx. page count"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Target Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Group
          </label>
          <select
            value={formData.target_group || ""}
            onChange={handleChange("target_group")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Target Group
            </option>
            <option value="STUDENTS">STUDENTS</option>
            <option value="PROFESSIONAL">PROFESSIONAL</option>
          </select>
        </div>
      </div>
    </div>
  );
}
