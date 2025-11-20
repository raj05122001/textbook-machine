'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, X, Check, AlertCircle, Loader2, BookOpen,
  Plus, Sparkles, Zap, Clock, Target, ChevronRight, ChevronLeft, Edit3,
  Save, MessageSquare, CheckCircle2, Trash2, HelpCircle, ArrowRight,
  ChevronDown,        
} from 'lucide-react';


export function Step1BookDetails({
  formData,
  setFormData,
  fieldErrors = {},
  setFieldErrors,
}) {
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((p) => ({ ...p, [field]: value }));
    if (setFieldErrors && fieldErrors?.[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Book Information
        </h2>
        <p className="text-gray-600">Provide details about your book</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FieldInput
          label="Book Title"
          required
          value={formData.title}
          onChange={handleChange("title")}
          placeholder="Enter your book title"
          error={fieldErrors?.title}
        />

        <FieldInput
          label="Author name"
          required
          value={formData.author}
          onChange={handleChange("author")}
          placeholder="Your name"
          error={fieldErrors?.author}
        />

        <div className="md:col-span-2">
          <FieldTextarea
            label="Description"
            value={formData.description}
            onChange={handleChange("description")}
            placeholder="Brief description of your book"
            error={fieldErrors?.description}
          />
        </div>

        <FieldSelect
          label="Category"
          value={formData.category}
          onChange={handleChange("category")}
          placeholder="Select Category"
          error={fieldErrors?.category}
        >
          <option value="ACADEMICS">ACADEMICS</option>
          <option value="TRAINING">TRAINING</option>
        </FieldSelect>

        <FieldSelect
          label="Language"
          value={formData.language}
          onChange={handleChange("language")}
          placeholder="Select Language"
          error={fieldErrors?.language}
        >
          <option value="ENGLISH">ENGLISH</option>
          <option value="FRENCH">FRENCH</option>
        </FieldSelect>

        <FieldInput
          label="Educational Level"
          value={formData.educational_level}
          onChange={handleChange("educational_level")}
          placeholder="e.g., 12TH, UG, PG"
          error={fieldErrors?.educational_level}
        />

        <FieldSelect
          label="Difficulty"
          value={formData.difficulty_level}
          onChange={handleChange("difficulty_level")}
          placeholder="Select Difficulty"
          error={fieldErrors?.difficulty_level}
        >
          <option value="EASY">EASY</option>
          <option value="MODERATE">MODERATE</option>
          <option value="HARD">HARD</option>
        </FieldSelect>

        <FieldSelect
          label="Teaching Style"
          value={formData.teaching_style}
          onChange={handleChange("teaching_style")}
          placeholder="Select Teaching Style"
          error={fieldErrors?.teaching_style}
        >
          <option value="PRACTICAL">PRACTICAL</option>
          <option value="THEORITICAL">THEORITICAL</option>
        </FieldSelect>

        <FieldInput
          label="Expected Pages"
          type="number"
          value={formData.expected_pages}
          onChange={handleChange("expected_pages")}
          placeholder="Approx. page count"
          error={fieldErrors?.expected_pages}
        />

        <FieldSelect
          label="Target Group"
          value={formData.target_group}
          onChange={handleChange("target_group")}
          placeholder="Select Target Group"
          error={fieldErrors?.target_group}
        >
          <option value="STUDENTS">STUDENTS</option>
          <option value="PROFESSIONAL">PROFESSIONAL</option>
        </FieldSelect>
      </div>
    </div>
  );
}

function FieldWrapper({ label, required = false, error, children }) {
  const hasError = Boolean(error);
  const content =
    typeof children === "function" ? children({ hasError }) : children;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        <span className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      </label>

      <div
        className={`
          relative group
          rounded-xl border bg-white shadow-sm
          transition-all duration-150
          ${
            hasError
              ? "border-red-400 ring-2 ring-red-200"
              : "border-gray-200 hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/25"
          }
        `}
      >
        {content}
      </div>

      {hasError && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function FieldInput({
  label,
  required = false,
  error,
  type = "text",
  ...inputProps
}) {
  return (
    <FieldWrapper label={label} required={required} error={error}>
      <input
        type={type}
        className="
          w-full bg-transparent
          px-4 py-2.5
          text-sm text-gray-900
          focus:outline-none
        "
        {...inputProps}
      />
    </FieldWrapper>
  );
}

function FieldTextarea({
  label,
  required = false,
  error,
  rows = 4,
  ...textareaProps
}) {
  return (
    <FieldWrapper label={label} required={required} error={error}>
      <textarea
        rows={rows}
        className="
          w-full bg-transparent
          px-4 py-2.5
          text-sm text-gray-900
          resize-y
          focus:outline-none
        "
        {...textareaProps}
      />
    </FieldWrapper>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  placeholder = "Select an option",
  children,
  required = false,
  error,
}) {
  return (
    <FieldWrapper label={label} required={required} error={error}>
      {({ hasError }) => (
        <>
          <select
            value={value || ""}
            onChange={onChange}
            className="
              w-full appearance-none bg-transparent
              px-4 pr-10 py-2.5
              text-sm text-gray-900
              focus:outline-none
              cursor-pointer
            "
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {children}
          </select>

          <ChevronDown
            className={`
              pointer-events-none absolute right-3 top-1/2 -translate-y-1/2
              h-4 w-4
              ${
                hasError
                  ? "text-red-400"
                  : "text-gray-400 group-hover:text-gray-500"
              }
              transition-colors duration-150
            `}
          />
        </>
      )}
    </FieldWrapper>
  );
}


