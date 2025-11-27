'use client';

import { useMemo, useState, useEffect } from 'react';
import { Search, BookOpen, CheckSquare, Activity, Edit3, FileText, SortAsc, SortDesc } from 'lucide-react';
import BookTile from './BookCard';

export default function BookGrid({
  books = [],
  loading = false,
  onBookSelect,
  statusFromUrl,           // NEW: controlled status from URL
  onStatusChange,          // NEW: notify parent (page) when status changes
}) {
  /* ---------------- state ---------------- */
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | published | completed | in-progress | draft
  const [sortBy, setSortBy] = useState('lastModified');
  const [sortOrder, setSortOrder] = useState('desc');      // asc | desc

  /* ---- sync filter with URL param ---- */
  useEffect(() => {
    if (!statusFromUrl) return;
    setStatusFilter(statusFromUrl);
  }, [statusFromUrl]);

  /* ---- helper to change status everywhere ---- */
  const changeStatus = (status) => {
    setStatusFilter(status);
    onStatusChange?.(status);   // tell parent so it updates URL
  };

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
      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="
                bg-white border border-gray-100 rounded-3xl p-4
                shadow-sm
              "
            >
              <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div className="relative max-w-md w-full">
            <div className="h-10 rounded-2xl bg-gray-200/80 border border-gray-200 animate-pulse" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="
                  h-8 w-20
                  rounded-full
                  bg-gray-200
                  animate-pulse
                "
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="
                h-64
                rounded-2xl
                bg-gray-200
                animate-pulse
              "
            />
          ))}
        </div>
      </div>
    );
  }


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
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<BookOpen className="h-5 w-5" />} label="Total Books" value={stats.total} tone="blue" />
        <StatCard icon={<CheckSquare className="h-5 w-5" />} label="Completed" value={stats.completed} tone="green" />
        <StatCard icon={<Activity className="h-5 w-5" />} label="In Progress" value={stats.inProgress} tone="indigo" />
        <StatCard icon={<Edit3 className="h-5 w-5" />} label="Drafts" value={stats.draft} tone="yellow" />
        {/* <StatCard icon={<FileText className="h-5 w-5" />} label="Chapters" value={stats.totalChapters} tone="purple" /> */}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div className="relative max-w-md w-full group">
          {/* Icon */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
          </div>

          {/* Input */}
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title or author…"
            className="
      w-full pl-9 pr-10 py-2.5
      rounded-2xl
      border border-gray-200
      bg-white/80
      shadow-sm
      text-sm
      placeholder:text-gray-400
      focus:outline-none
      focus:ring-2 focus:ring-blue-500/60
      focus:border-blue-500
      transition-all duration-200
      group-hover:shadow-md
    "
          />

          {/* Clear button */}
          {q && (
            <button
              type="button"
              className="
        absolute right-2.5 top-1/2 -translate-y-1/2
        text-gray-400 hover:text-gray-700
        h-6 px-2 rounded-full
        text-xs font-medium
        bg-gray-100 hover:bg-gray-200
        transition-colors duration-150
      "
              onClick={() => setQ('')}
            >
              Clear
            </button>
          )}
        </div>


        <div className="flex flex-wrap items-center gap-2">
          <Chip label="All" active={statusFilter === 'all'} onClick={() => changeStatus('all')} />
          <Chip label="Published" active={statusFilter === 'published'} onClick={() => changeStatus('published')} />
          <Chip label="Completed" active={statusFilter === 'completed'} onClick={() => changeStatus('completed')} />
          <Chip label="In Progress" active={statusFilter === 'in-progress'} onClick={() => changeStatus('in-progress')} />
          <Chip label="Draft" active={statusFilter === 'draft'} onClick={() => changeStatus('draft')} />
        </div>
      </div>

      <div className="-mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-0 pb-4">
        {/* <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-xs sm:text-sm text-gray-500">
          <span>Showing</span>
          <span className="font-semibold text-gray-900">{filtered.length}</span>
          <span>of</span>
          <span className="font-semibold text-gray-900">{books.length}</span>
          <span>books</span>
        </div> */}


        {/* Right: controls */}
        {/* <div className="flex items-center gap-2 sm:ml-0 ml-auto">
          <select
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="lastModified">Last Modified</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
          </select>
          <button
            onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
            className="px-2.5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
            title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
          >
            {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </button>
        </div> */}
      </div>

      {/* ---- grid ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
        {filtered.map((b) => (
          <BookTile key={b.id} book={b} onClick={() => onBookSelect?.(b)} />
        ))}
      </div>
    </div>
  );
}


function StatCard({ icon, label, value, tone = 'blue' }) {
  const tones = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    green: 'text-green-600 bg-green-50 border-green-100',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    yellow: 'text-yellow-700 bg-yellow-50 border-yellow-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100',
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
  };

  const stripTones = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    indigo: 'bg-indigo-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  const t = tones[tone] || tones.blue;
  const strip = stripTones[tone] || stripTones.blue;

  return (
    <div
      className="
        group relative bg-white border border-gray-100 rounded-3xl p-4
        shadow-sm
        hover:shadow-xl hover:-translate-y-1
        hover:border-transparent
        hover:bg-gradient-to-br hover:from-slate-50 hover:to-white
        transition-all duration-200 ease-out
        overflow-hidden
      "
    >
      {/* bottom color strip ~5px */}
      <div className={`absolute left-0 bottom-0 h-1.5 w-full ${strip}`} />

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
            {label}
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-0.5">
            {value}
          </div>
        </div>

        <div
          className={`
                 h-10 w-10 flex items-center justify-center rounded-xl
                 border backdrop-blur-sm
                 transition-transform duration-200 ease-out
                 group-hover:scale-110 group-hover:rotate-3
                 ${t}  /* 👉 tone classes last rakho */
                `}
        >
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
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1.5 rounded-full
        text-xs sm:text-sm
        border transition-all duration-150
        ${active
          ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/30 scale-[1.02]'
          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        }
      `}
    >
      <span
        className={`
          h-1.5 w-1.5 rounded-full
          ${active ? 'bg-white' : 'bg-gray-300'}
        `}
      />
      <span>{label}</span>
    </button>
  );
}

