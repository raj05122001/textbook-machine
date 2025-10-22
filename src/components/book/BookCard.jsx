'use client';

import { BookOpen, Bookmark } from 'lucide-react';
import { useMemo, useState } from 'react';

const badgeColor = (status) => {
  switch (status) {
    case 'published': return 'bg-purple-100 text-purple-700';
    case 'completed': return 'bg-green-100 text-green-700';
    case 'in-progress': return 'bg-blue-100 text-blue-700';
    default: return 'bg-yellow-100 text-yellow-700';
  }
};

/* simple deterministic gradient from title */
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

export default function BookTile({ book, onClick }) {
  const [hover, setHover] = useState(false);
  const cover = useMemo(() => pickGradient(book?.title || ''), [book?.title]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl"
      aria-label={`Open ${book?.title || 'book'}`}
    >
      {/* Book wrapper */}
      <div className="relative h-64 sm:h-72 group">
        {/* 3D book body */}
        <div
          className={`book3d relative h-full rounded-lg shadow-lg transition-transform duration-300 will-change-transform ${
            hover ? 'translate-y-[-2px] rotate-y-6' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front cover */}
          <div
            className="absolute inset-0 rounded-lg overflow-hidden"
            style={{
              background: cover,
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* decorative pattern */}
            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-4 left-4 w-14 h-14 border-2 border-white/50 rounded-full" />
              <div className="absolute bottom-4 right-6 w-10 h-10 border-2 border-white/40 rotate-45" />
              <BookOpen className="absolute inset-0 m-auto h-16 w-16 text-white/30" />
            </div>

            {/* glossy shine */}
            <div
              className={`absolute inset-0 pointer-events-none book-shine ${hover ? 'animate-shine' : ''}`}
            />

            {/* cover text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="font-bold text-base leading-tight line-clamp-2 drop-shadow-sm">
                {book.title}
              </h3>
              {book.author ? (
                <p className="mt-1 text-xs opacity-90">by {book.author}</p>
              ) : null}
              <div className="mt-2 text-[11px] opacity-90 flex items-center gap-3">
                <span>{book.chapters || 0} chapters</span>
                {book.lastModified && (
                  <span title={book.lastModified}>
                    updated {new Date(book.lastModified).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* status sticker */}
            <span
              className={`absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full font-medium ${badgeColor(
                book.status
              )} shadow-sm`}
            >
              {book.status}
            </span>

            {/* bookmark ribbon */}
            <div className="absolute top-0 right-6 translate-x-1/2">
              <div className="w-0 h-0 border-l-6 border-r-6 border-b-[14px] border-l-transparent border-r-transparent border-b-yellow-400 drop-shadow" />
            </div>
          </div>

          {/* spine */}
          <div
            className="absolute top-0 right-0 h-full w-[12px] bg-gradient-to-b from-gray-900 to-gray-700"
            style={{
              transform: 'rotateY(90deg)',
              transformOrigin: 'right center',
            }}
          >
            <div className="h-full flex items-center justify-center">
              <span className="text-[9px] text-white/90 font-semibold tracking-wide -rotate-90 whitespace-nowrap">
                {book.title?.slice(0, 26) || 'Book'}
              </span>
            </div>
          </div>

          {/* page edge */}
          <div
            className="absolute inset-y-1 right-[12px] w-[12px] bg-[repeating-linear-gradient( to bottom, #f8fafc 0 2px, #e5e7eb 2px 3px )] rounded-r-sm"
            style={{
              transform: 'translateZ(-1px)',
              boxShadow: 'inset 0 0 2px rgba(0,0,0,0.08)',
            }}
          />
        </div>
      </div>

      {/* subtle base plate */}
      <div className="mt-3 h-2 rounded-full bg-gray-200/70 group-hover:bg-gray-300 transition-colors" />

      {/* custom CSS for 3D + shine */}
      <style jsx>{`
        .book3d {
          perspective: 1000px;
        }
        .rotate-y-6 {
          transform: perspective(1000px) rotateY(6deg);
        }
        .book-shine {
          background: linear-gradient(
            105deg,
            transparent 20%,
            rgba(255, 255, 255, 0.45) 45%,
            transparent 60%
          );
          transform: skewX(-18deg) translateX(-120%);
          opacity: 0;
        }
        .animate-shine {
          animation: shine 1.2s ease-in-out forwards;
        }
        @keyframes shine {
          0% {
            transform: skewX(-18deg) translateX(-120%);
            opacity: 0.0;
          }
          25% {
            opacity: 0.25;
          }
          60% {
            opacity: 0.15;
          }
          100% {
            transform: skewX(-18deg) translateX(120%);
            opacity: 0.0;
          }
        }
      `}</style>
    </button>
  );
}
