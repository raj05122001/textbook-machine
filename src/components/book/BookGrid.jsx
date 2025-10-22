'use client';

import { useMemo, useState, useEffect } from 'react';
import { Search, BookOpen, CheckSquare, Activity, Edit3, FileText, SortAsc, SortDesc } from 'lucide-react';
import BookTile from './BookCard';

export default function BookGrid({ books = [], loading = false, onBookSelect }) {
  /* ---------------- state ---------------- */
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | published | completed | in-progress | draft
  const [sortBy, setSortBy] = useState('lastModified');    // lastModified | createdAt | title | chapters
  const [sortOrder, setSortOrder] = useState('desc');      // asc | desc

  /* ------------- debounce search ---------- */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [q]);

  /* ------------- analytics/stats ---------- */
  const stats = useMemo(() => {
    const total = books.length;
    const by = (s) => books.filter(b => b.status === s).length;
    const published = by('published');
    const completed = by('completed');
    const inProgress = by('in-progress');
    const draft = by('draft');
    const totalChapters = books.reduce((sum, b) => sum + (b.chapters || 0), 0);
    return { total, published, completed, inProgress, draft, totalChapters };
  }, [books]);

  /* ------------- filtering + sorting ------ */
  const filtered = useMemo(() => {
    let list = [...books];

    // search on title/author
    if (debouncedQ) {
      list = list.filter(b =>
        (b.title || '').toLowerCase().includes(debouncedQ) ||
        (b.author || '').toLowerCase().includes(debouncedQ)
      );
    }

    // status filter
    if (statusFilter !== 'all') {
      list = list.filter(b => (b.status || 'draft') === statusFilter);
    }

    // sorting
    list.sort((a, b) => {
      const get = (bk) => {
        switch (sortBy) {
          case 'title': return (bk.title || '').toLowerCase();
          case 'chapters': return bk.chapters || 0;
          case 'createdAt': return new Date(bk.createdAt || 0).getTime();
          case 'lastModified':
          default: return new Date(bk.lastModified || bk.createdAt || 0).getTime();
        }
      };
      let av = get(a), bv = get(b);
      if (typeof av === 'string' && typeof bv === 'string') {
        const cmp = av.localeCompare(bv);
        return sortOrder === 'asc' ? cmp : -cmp;
      }
      const cmp = av - bv;
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [books, debouncedQ, statusFilter, sortBy, sortOrder]);

  /* ------------- loading ------------------ */
  if (loading) {
    return (
      <>
        {/* skeleton stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="h-6 w-16 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* skeleton grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      </>
    );
  }

  /* ------------- empty -------------------- */
  if (!books.length) {
    return (
      <div className="text-center text-gray-600 border border-dashed border-gray-300 rounded-xl p-10">
        No books found.
      </div>
    );
  }

  /* ------------- ui ----------------------- */
  return (
    <div className="w-full">
      {/* ---- top analytics ---- */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        <StatCard icon={<BookOpen className="h-5 w-5" />} label="Total Books" value={stats.total} tone="blue" />
        <StatCard icon={<CheckSquare className="h-5 w-5" />} label="Completed" value={stats.completed} tone="green" />
        <StatCard icon={<Activity className="h-5 w-5" />} label="In Progress" value={stats.inProgress} tone="indigo" />
        <StatCard icon={<Edit3 className="h-5 w-5" />} label="Drafts" value={stats.draft} tone="yellow" />
        <StatCard icon={<FileText className="h-5 w-5" />} label="Chapters" value={stats.totalChapters} tone="purple" />
      </div>

      {/* ---- controls (search + filters + sort) ---- */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        {/* search */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title or author…"
            className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {q && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              onClick={() => setQ('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* right side: quick status + sort */}
        <div className="flex flex-wrap items-center gap-2">
          {/* quick status chips */}
          <Chip label="All" active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
          <Chip label="Published" active={statusFilter === 'published'} onClick={() => setStatusFilter('published')} />
          <Chip label="Completed" active={statusFilter === 'completed'} onClick={() => setStatusFilter('completed')} />
          <Chip label="In Progress" active={statusFilter === 'in-progress'} onClick={() => setStatusFilter('in-progress')} />
          <Chip label="Draft" active={statusFilter === 'draft'} onClick={() => setStatusFilter('draft')} />

          {/* sort */}
          <div className="flex items-center gap-2 ml-auto">
            <select
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="lastModified">Last Modified</option>
              <option value="createdAt">Created Date</option>
              <option value="title">Title</option>
              <option value="chapters">Chapters</option>
            </select>
            <button
              onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
              className="px-2.5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ---- results count ---- */}
      <div className="text-sm text-gray-500 mb-3">
        Showing <span className="font-medium text-gray-700">{filtered.length}</span> of{' '}
        <span className="font-medium text-gray-700">{books.length}</span> books
      </div>

      {/* ---- grid ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((b) => (
          <BookTile key={b.id} book={b} onClick={() => onBookSelect?.(b)} />
        ))}
      </div>
    </div>
  );
}

/* ========= small UI atoms ========= */

function StatCard({ icon, label, value, tone = 'blue' }) {
  const tones = {
    blue:    'text-blue-600 bg-blue-50 border-blue-100',
    green:   'text-green-600 bg-green-50 border-green-100',
    indigo:  'text-indigo-600 bg-indigo-50 border-indigo-100',
    yellow:  'text-yellow-700 bg-yellow-50 border-yellow-100',
    purple:  'text-purple-600 bg-purple-50 border-purple-100',
    orange:  'text-orange-600 bg-orange-50 border-orange-100',
  };
  const t = tones[tone] || tones.blue;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-2xl font-bold text-gray-900`}>{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
        <div className={`h-9 w-9 flex items-center justify-center rounded-lg border ${t}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
        active
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}
