'use client';

import { BookOpen, CalendarClock, Layers, Gauge, GraduationCap, Languages, Target, FileText } from 'lucide-react';
import { useMemo, useState } from 'react';

/* status → colors */
const badgeColor = (status) => {
  switch (status) {
    case 'published':  return 'bg-purple-100 text-purple-700';
    case 'completed':  return 'bg-green-100 text-green-700';
    case 'in-progress':return 'bg-blue-100 text-blue-700';
    case 'draft':
    default:           return 'bg-yellow-100 text-yellow-700';
  }
};

/* gradient by seed (title/category) so every book looks consistent */
const gradients = [
  'linear-gradient(135deg,#6EE7F9 0%,#7C3AED 100%)',
  'linear-gradient(135deg,#FDE68A 0%,#F59E0B 100%)',
  'linear-gradient(135deg,#A7F3D0 0%,#10B981 100%)',
  'linear-gradient(135deg,#93C5FD 0%,#3B82F6 100%)',
  'linear-gradient(135deg,#FCA5A5 0%,#EF4444 100%)',
  'linear-gradient(135deg,#FDBA74 0%,#FB923C 100%)',
];
const pickGradient = (seed = '') =>
  gradients[[...seed].reduce((s, c) => s + c.charCodeAt(0), 0) % gradients.length];

/* tiny helper: Title Case */
const tc = (s) => (s || '').toString().toLowerCase().replace(/\b\w/g, m => m.toUpperCase());

/* pretty short date */
const d = (iso) => iso ? new Date(iso).toLocaleDateString() : '';

const COVER_BASE = 'https://tbmplus-backend.ultimeet.io';

export default function BookTile({ book, onClick }) {
  const [hover, setHover] = useState(false);
  const gradient = useMemo(() => pickGradient(book?.title || book?.category || ''), [book?.title, book?.category]);

  // Build absolute cover URL from any known field
  const coverPath = book?.cover_url || book?.cover_page || book?.coverPage || null;
  const coverUrl = coverPath
    ? (String(coverPath).startsWith('http') ? coverPath : `${COVER_BASE}${coverPath}`)
    : null;

  // normalize fields coming from API
  const status =
    (book?.status || '').toUpperCase() === 'PUBLISHED' ? 'published' :
    (book?.status || '').toUpperCase() === 'APPROVED'  ? 'published' :
    (book?.status || '').toUpperCase() === 'COMPLETED' ? 'completed' :
    (book?.status || '').toUpperCase().includes('PROGRESS') ? 'in-progress' :
    'draft';

  const expectedPages = book?.expected_pages ?? 0;
  const estWords = expectedPages * 250;            // rough words/page
  const estReadMins = Math.max(1, Math.round(estWords / 200)); // 200 wpm

  // Front cover style: image if present, else gradient
  const frontCoverStyle = coverUrl
    ? {
        backgroundImage: `url(${coverUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
      }
    : {
        background: gradient,
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
      };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl"
      aria-label={`Open ${book?.title || 'book'}`}
    >
      {/* “Book” */}
      <div className="relative h-72 group">
        <div
          className={`book3d relative h-full rounded-lg shadow-lg transition-transform duration-300 will-change-transform ${
            hover ? 'translate-y-[-2px] rotate-y-6' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front cover */}
          <div
            className="absolute inset-0 rounded-lg overflow-hidden"
            style={frontCoverStyle}
          >
            {/* subtle pattern */}
            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-4 left-4 w-14 h-14 border-2 border-white/50 rounded-full" />
              <div className="absolute bottom-4 right-6 w-10 h-10 border-2 border-white/40 rotate-45" />
              <BookOpen className="absolute inset-0 m-auto h-16 w-16 text-white/30" />
            </div>

            {/* shine */}
            <div className={`absolute inset-0 pointer-events-none book-shine ${hover ? 'animate-shine' : ''}`} />

            {/* dark-to-clear gradient for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

            {/* top chips: category, language */}
            <div className="absolute top-2 left-2 right-2 flex items-center gap-2 flex-wrap">
              {book?.category && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                  {tc(book.category)}
                </span>
              )}
              {book?.language && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm flex items-center gap-1">
                  <Languages className="h-3 w-3" /> {tc(book.language)}
                </span>
              )}
              {book?.educational_level && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" /> {tc(book.educational_level)}
                </span>
              )}
            </div>

            {/* main text */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="font-bold text-[17px] leading-tight line-clamp-2 drop-shadow-sm">
                {book.title || 'Untitled'}
              </h3>

              {/* meta row */}
              <div className="mt-2 text-[11px] opacity-95 flex flex-wrap items-center gap-x-4 gap-y-1">
                {book.author && <span>by {book.author}</span>}
                {book.educational_level && 
                  <span className="flex items-center gap-1">
                    <Gauge className="h-3 w-3" /> {book.educational_level}
                  </span>
                }
                {book.teaching_style && (
                  <span className="flex items-center gap-1">
                    <Layers className="h-3 w-3" /> {tc(book.teaching_style)}
                  </span>
                )}
                {book.target_group && (
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" /> {tc(book.target_group)}
                  </span>
                )}
              </div>

              {/* footer stats */}
              <div className="mt-2 text-[11px] opacity-95 flex flex-wrap items-center gap-x-4 gap-y-1">
                {book.updated_at || book.lastModified ? (
                  <span className="flex items-center gap-1">
                    <CalendarClock className="h-3 w-3" /> {d(book.updated_at || book.lastModified)}
                  </span>
                ) : null}
              </div>
            </div>

            {/* status badge */}
            <span
              className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-medium ${badgeColor(
                status
              )} shadow-sm`}
            >
              {status}
            </span>
          </div>

          {/* spine */}
          <div
            className="absolute top-0 right-0 h-full w-[12px] bg-gradient-to-b from-gray-900 to-gray-700"
            style={{ transform: 'rotateY(90deg)', transformOrigin: 'right center' }}
          >
            <div className="h-full flex items-center justify-center">
              <span className="text-[9px] text-white/90 font-semibold tracking-wide -rotate-90 whitespace-nowrap">
                {(book.title || 'Book').slice(0, 26)}
              </span>
            </div>
          </div>

          {/* page edge */}
          <div
            className="absolute inset-y-1 right-[12px] w-[12px] bg-[repeating-linear-gradient(to_bottom,#f8fafc_0_2px,#e5e7eb_2px_3px)] rounded-r-sm"
            style={{ transform: 'translateZ(-1px)', boxShadow: 'inset 0 0 2px rgba(0,0,0,0.08)' }}
          />
        </div>
      </div>

      {/* base plate shadow */}
      <div className="mt-3 h-2 rounded-full bg-gray-200/70 group-hover:bg-gray-300 transition-colors" />

      {/* CSS for 3D & shine */}
      <style jsx>{`
        .book3d { perspective: 1000px; }
        .rotate-y-6 { transform: perspective(1000px) rotateY(6deg); }
        .book-shine {
          background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,.45) 45%, transparent 60%);
          transform: skewX(-18deg) translateX(-120%);
          opacity: 0;
        }
        .animate-shine { animation: shine 1.2s ease-in-out forwards; }
        @keyframes shine {
          0%   { transform: skewX(-18deg) translateX(-120%); opacity: 0; }
          25%  { opacity: .25; }
          60%  { opacity: .15; }
          100% { transform: skewX(-18deg) translateX(120%); opacity: 0; }
        }
      `}</style>
    </button>
  );
}
