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
export function Step1BookDetails({ formData, setFormData }) {
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