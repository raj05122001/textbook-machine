'use client';

import {
  BookOpen,
  CalendarClock,
  Layers,
  Gauge,
  GraduationCap,
  Languages,
  Target,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const badgeColor = (status) => {
  switch (status) {
    case 'published':
      return 'bg-purple-100 text-purple-700';
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'in-progress':
      return 'bg-blue-100 text-blue-700';
    case 'draft':
    default:
      return 'bg-yellow-100 text-yellow-700';
  }
};

function hashSeed(seed = '') {
  if (!seed) return 42;
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h;
}

function getColorTheme(seed = '') {
  const themes = [
    // Blues
    { primary: 'hsl(210, 80%, 60%)', secondary: 'hsl(210, 70%, 45%)', accent: 'hsl(210, 90%, 75%)' },
    { primary: 'hsl(220, 85%, 65%)', secondary: 'hsl(220, 75%, 50%)', accent: 'hsl(220, 95%, 80%)' },
    { primary: 'hsl(190, 75%, 55%)', secondary: 'hsl(190, 65%, 40%)', accent: 'hsl(190, 85%, 70%)' },

    // Greens
    { primary: 'hsl(145, 70%, 50%)', secondary: 'hsl(145, 60%, 35%)', accent: 'hsl(145, 80%, 65%)' },
    { primary: 'hsl(160, 75%, 45%)', secondary: 'hsl(160, 65%, 30%)', accent: 'hsl(160, 85%, 60%)' },
    { primary: 'hsl(120, 65%, 55%)', secondary: 'hsl(120, 55%, 40%)', accent: 'hsl(120, 75%, 70%)' },

    // Purples
    { primary: 'hsl(270, 70%, 60%)', secondary: 'hsl(270, 60%, 45%)', accent: 'hsl(270, 80%, 75%)' },
    { primary: 'hsl(280, 75%, 65%)', secondary: 'hsl(280, 65%, 50%)', accent: 'hsl(280, 85%, 80%)' },
    { primary: 'hsl(300, 65%, 55%)', secondary: 'hsl(300, 55%, 40%)', accent: 'hsl(300, 75%, 70%)' },

    // Oranges/Reds
    { primary: 'hsl(0, 75%, 60%)', secondary: 'hsl(0, 65%, 45%)', accent: 'hsl(0, 85%, 75%)' },
    { primary: 'hsl(20, 80%, 55%)', secondary: 'hsl(20, 70%, 40%)', accent: 'hsl(20, 90%, 70%)' },
    { primary: 'hsl(35, 75%, 50%)', secondary: 'hsl(35, 65%, 35%)', accent: 'hsl(35, 85%, 65%)' },

    // Pinks
    { primary: 'hsl(330, 75%, 65%)', secondary: 'hsl(330, 65%, 50%)', accent: 'hsl(330, 85%, 80%)' },
    { primary: 'hsl(340, 70%, 60%)', secondary: 'hsl(340, 60%, 45%)', accent: 'hsl(340, 80%, 75%)' },

    // Teals
    { primary: 'hsl(175, 70%, 45%)', secondary: 'hsl(175, 60%, 30%)', accent: 'hsl(175, 80%, 60%)' },
    { primary: 'hsl(195, 75%, 50%)', secondary: 'hsl(195, 65%, 35%)', accent: 'hsl(195, 85%, 65%)' },
  ];

  const index = hashSeed(seed) % themes.length;
  return themes[index];
}

function getSVGPattern(seed = '') {
  const patterns = [
    {
      type: 'waves',
      svg: (theme) => `
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="waveGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="${theme.primary}" stop-opacity="0.6"/>
            </linearGradient>
            <linearGradient id="waveGrad2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${theme.primary}" stop-opacity="0.5"/>
              <stop offset="100%" stop-color="${theme.secondary}" stop-opacity="0.7"/>
            </linearGradient>
          </defs>
          <path d="M0,280 C150,240 300,280 450,260 C500,250 550,230 600,240 L600,400 L0,400 Z" fill="url(#waveGrad1)"/>
          <path d="M0,260 C120,220 280,250 400,240 C500,230 550,210 600,220 L600,400 L0,400 Z" fill="url(#waveGrad2)"/>
        </svg>
      `
    },
    {
      type: 'gentle-waves',
      svg: (theme) => `
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="waveGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.7"/>
              <stop offset="100%" stop-color="${theme.primary}" stop-opacity="0.4"/>
            </linearGradient>
          </defs>
          <path d="M0,300 C100,280 200,290 300,280 C400,270 500,260 600,270 L600,400 L0,400 Z" fill="url(#waveGrad1)"/>
        </svg>
      `
    },
    {
      type: 'sharp-waves',
      svg: (theme) => `
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="waveGrad1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="${theme.primary}" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="${theme.secondary}" stop-opacity="0.6"/>
            </linearGradient>
          </defs>
          <path d="M0,320 L100,280 L200,320 L300,280 L400,320 L500,280 L600,320 L600,400 L0,400 Z" fill="url(#waveGrad1)"/>
        </svg>
      `
    },
    {
      type: 'circles',
      svg: (theme) => `
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="circleGrad1">
              <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="${theme.primary}" stop-opacity="0.1"/>
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="url(#circleGrad1)"/>
          <circle cx="400" cy="150" r="60" fill="url(#circleGrad1)"/>
          <circle cx="250" cy="300" r="90" fill="url(#circleGrad1)"/>
        </svg>
      `
    },
    {
      type: 'triangles',
      svg: (theme) => `
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="triGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${theme.primary}" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="${theme.secondary}" stop-opacity="0.2"/>
            </linearGradient>
          </defs>
          <polygon points="50,400 150,200 250,400" fill="url(#triGrad1)"/>
          <polygon points="300,400 400,250 500,400" fill="url(#triGrad1)"/>
          <polygon points="200,400 250,300 300,400" fill="url(#triGrad1)"/>
        </svg>
      `
    },
    {
      type: 'hexagons',
      svg: (theme) => `
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="hexGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="${theme.primary}" stop-opacity="0.1"/>
            </linearGradient>
          </defs>
          <path d="M100,200 L150,170 L250,170 L300,200 L250,230 L150,230 Z" fill="url(#hexGrad1)"/>
          <path d="M350,300 L400,270 L500,270 L550,300 L500,330 L400,330 Z" fill="url(#hexGrad1)"/>
        </svg>
      `
    },
    {
      type: 'diagonal-lines',
      svg: (theme) => `
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="lineGrad1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="${theme.primary}" stop-opacity="0.1"/>
              <stop offset="100%" stop-color="${theme.secondary}" stop-opacity="0.3"/>
            </linearGradient>
          </defs>
          ${Array.from({ length: 12 }, (_, i) =>
        `<line x1="${i * 50}" y1="400" x2="${i * 50 + 200}" y2="0" stroke="url(#lineGrad1)" stroke-width="2"/>`
      ).join('')}
        </svg>
      `
    },
    {
      type: 'concentric-circles',
      svg: (theme) => `
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="concentricGrad1">
              <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.2"/>
              <stop offset="100%" stop-color="${theme.primary}" stop-opacity="0.05"/>
            </radialGradient>
          </defs>
          <circle cx="300" cy="200" r="180" fill="none" stroke="url(#concentricGrad1)" stroke-width="8"/>
          <circle cx="300" cy="200" r="120" fill="none" stroke="url(#concentricGrad1)" stroke-width="6"/>
          <circle cx="300" cy="200" r="60" fill="none" stroke="url(#concentricGrad1)" stroke-width="4"/>
        </svg>
      `
    },
    {
      type: 'blob-1',
      svg: (theme) => `
    <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="blobGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${theme.primary}" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="${theme.secondary}" stop-opacity="0.3"/>
        </linearGradient>
      </defs>
      <!-- bottom poora 0 se 600 tak cover -->
      <path
        d="
          M0,260
          C80,220 180,210 260,190
          C340,170 430,180 500,205
          C560,225 600,240 600,270
          L600,400
          L0,400
          Z
        "
        fill="url(#blobGrad1)"
      />
    </svg>
  `
    },

    {
      type: 'mountain',
      svg: (theme) => `
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="mountainGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${theme.primary}" stop-opacity="0.7"/>
              <stop offset="100%" stop-color="${theme.secondary}" stop-opacity="0.4"/>
            </linearGradient>
          </defs>
          <path d="M0,400 L150,200 L300,300 L450,150 L600,350 L600,400 Z" fill="url(#mountainGrad1)"/>
        </svg>
      `
    },
    {
      type: 'clouds',
      svg: (theme) => `
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="cloudGrad1">
              <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.5"/>
              <stop offset="100%" stop-color="${theme.primary}" stop-opacity="0.2"/>
            </radialGradient>
          </defs>
          <ellipse cx="150" cy="250" rx="80" ry="40" fill="url(#cloudGrad1)"/>
          <ellipse cx="400" cy="280" rx="100" ry="50" fill="url(#cloudGrad1)"/>
          <ellipse cx="300" cy="320" rx="70" ry="35" fill="url(#cloudGrad1)"/>
        </svg>
      `
    },
    {
      type: 'ripple',
      svg: (theme) => `
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="rippleGrad1">
              <stop offset="0%" stop-color="${theme.primary}" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="${theme.secondary}" stop-opacity="0.1"/>
            </radialGradient>
          </defs>
          <circle cx="300" cy="300" r="120" fill="url(#rippleGrad1)"/>
          <circle cx="100" cy="200" r="80" fill="url(#rippleGrad1)"/>
          <circle cx="500" cy="150" r="60" fill="url(#rippleGrad1)"/>
        </svg>
      `
    },
    {
      type: 'zigzag',
      svg: (theme) => `
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="zigzagGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${theme.primary}" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0.3"/>
            </linearGradient>
          </defs>
          <path d="M0,300 L100,250 L200,300 L300,250 L400,300 L500,250 L600,300 L600,400 L0,400 Z" fill="url(#zigzagGrad1)"/>
        </svg>
      `
    }
  ];

  const index = hashSeed(seed) % patterns.length;
  return patterns[index];
}

function waveThemeFromSeed(seed = '') {
  const colorTheme = getColorTheme(seed);
  const pattern = getSVGPattern(seed);

  return {
    accentLight: colorTheme.accent,
    accentMid: colorTheme.primary,
    accentDark: colorTheme.secondary,
    patternSVG: pattern.svg(colorTheme),
    patternType: pattern.type
  };
}

const tc = (s) =>
  (s || '')
    .toString()
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());

const d = (iso) => {
  if (!iso) return '';

  const date = new Date(iso);

  const day = String(date.getDate()).padStart(2, '0'); 
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const mon = months[date.getMonth()]; 
  const year = date.getFullYear();

  return `${day}/${mon}/${year}`;
};


const COVER_BASE = 'https://tbmplus-backend.ultimeet.io';

export default function BookTile({ book, onClick }) {
  const [hover, setHover] = useState(false);

  const seed = book?.title || book?.category || '';
  const waveTheme = useMemo(() => waveThemeFromSeed(seed), [seed]);

  const coverPath =
    book?.cover_url || book?.cover_page || book?.coverPage || null;
  const coverUrl = coverPath
    ? String(coverPath).startsWith('http')
      ? coverPath
      : `${COVER_BASE}${coverPath}`
    : null;

  const status =
    (book?.status || '').toUpperCase() === 'PUBLISHED'
      ? 'published'
      : (book?.status || '').toUpperCase() === 'APPROVED'
        ? 'published'
        : (book?.status || '').toUpperCase() === 'COMPLETED'
          ? 'completed'
          : (book?.status || '').toUpperCase().includes('PROGRESS')
            ? 'in-progress'
            : 'draft';

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
      backgroundImage:
        'linear-gradient(to bottom, #f9fafb 0%, #ffffff 40%, #ffffff 100%)',
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
      <div className="relative h-72 group">
        <div
          className={`relative h-full rounded-lg shadow-lg transition-transform duration-300 will-change-transform `}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className="absolute inset-0 rounded-lg overflow-hidden"
            style={frontCoverStyle}
          >
            {!coverUrl && (
              <>
                <div
                  className="absolute -bottom-10 left-0 w-[140%] h-[80%] pointer-events-none"
                  dangerouslySetInnerHTML={{ __html: waveTheme.patternSVG }}
                />
                <svg
                  className="absolute -top-10 right-0 w-[80%] h-[50%] opacity-40 pointer-events-none"
                  viewBox="0 0 400 200"
                >
                  <defs>
                    <linearGradient
                      id="lineGrad"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop
                        offset="0%"
                        stopColor="#d4d4d4"
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stopColor={waveTheme.accentDark}
                        stopOpacity="0.4"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M-40,180 L200,-10"
                    stroke="url(#lineGrad)"
                    strokeWidth="0.6"
                  />
                  <path
                    d="M0,200 L240,0"
                    stroke="url(#lineGrad)"
                    strokeWidth="0.6"
                  />
                  <path
                    d="M40,210 L280,10"
                    stroke="url(#lineGrad)"
                    strokeWidth="0.6"
                  />
                  <path
                    d="M80,220 L320,20"
                    stroke="url(#lineGrad)"
                    strokeWidth="0.6"
                  />
                </svg>
              </>
            )}
            <div
              className={`absolute inset-0 pointer-events-none book-shine ${hover ? 'animate-shine' : ''
                }`}
            />
            <div className="absolute top-2 left-2 right-2 flex items-center gap-2 flex-wrap z-10">
              {book?.category && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-black/10 text-gray-800 border border-black/10 backdrop-blur-sm">
                  {tc(book.category)}
                </span>
              )}
              {book?.language && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-black/10 text-gray-800 border border-black/10 backdrop-blur-sm flex items-center gap-1">
                  <Languages className="h-3 w-3" /> {tc(book.language)}
                </span>
              )}
              {book?.educational_level && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-black/10 text-gray-800 border border-black/10 backdrop-blur-sm flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />{' '}
                  {tc(book.educational_level)}
                </span>
              )}
            </div>
            <div className="absolute inset-0 flex flex-col text-gray-800">
              <div className="flex-1 flex items-center justify-center px-6 text-center">
                <h3 className="font-bold text-[20px] sm:text-[22px] leading-tight tracking-wide">
                  {book.title || 'Untitled Book'}
                </h3>
              </div>
              <div className="px-4 pb-4 text-[11px] space-y-1">
                {book.author && (
                  <div className="text-center font-semibold tracking-[0.18em] text-xs text-gray-700">
                    {(book.author || '').toUpperCase()}
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 opacity-95 text-gray-600">
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
                  {book.educational_level && (
                    <span className="flex items-center gap-1">
                      <Gauge className="h-3 w-3" /> {book.educational_level}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 opacity-90 text-gray-500">
                  {book.updated_at || book.lastModified ? (
                    <span className="flex items-center gap-1">
                      <CalendarClock className="h-3 w-3" />{' '}
                      {d(book.updated_at || book.lastModified)}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <span
              className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-medium ${badgeColor(
                status
              )} shadow-sm z-10`}
            >
              {status}
            </span>
          </div>
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
          <div
            className="absolute inset-y-1 right-[12px] w-[12px] bg-[repeating-linear-gradient(to_bottom,#f8fafc_0_2px,#e5e7eb_2px_3px)] rounded-r-sm"
            style={{
              transform: 'translateZ(-1px)',
              boxShadow: 'inset 0 0 2px rgba(0,0,0,0.08)',
            }}
          />
        </div>
      </div>
      <div className="mt-3 h-2 rounded-full bg-gray-200/70 group-hover:bg-gray-300 transition-colors" />
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
            opacity: 0;
          }
          25% {
            opacity: 0.25;
          }
          60% {
            opacity: 0.15;
          }
          100% {
            transform: skewX(-18deg) translateX(120%);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
}