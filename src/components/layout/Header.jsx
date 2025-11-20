"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Library,
  Plus,
  User,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  HelpCircle,
  CalendarClock,
  Languages,
  GraduationCap,
  Target,
} from "lucide-react";

/* ================== THEME / COVER HELPERS ================== */

const COVER_BASE = "https://tbmplus-backend.ultimeet.io";

const gradients = [
  "linear-gradient(135deg,#6EE7F9 0%,#7C3AED 100%)",
  "linear-gradient(135deg,#FDE68A 0%,#F59E0B 100%)",
  "linear-gradient(135deg,#A7F3D0 0%,#10B981 100%)",
  "linear-gradient(135deg,#93C5FD 0%,#3B82F6 100%)",
  "linear-gradient(135deg,#FCA5A5 0%,#EF4444 100%)",
  "linear-gradient(135deg,#FDBA74 0%,#FB923C 100%)",
];

const pickGradient = (seed = "") =>
  gradients[
  [...seed].reduce((s, c) => s + c.charCodeAt(0), 0) % gradients.length
  ];

/* status → colors */
const badgeColor = (status) => {
  switch (status) {
    case "published":
      return "bg-purple-100 text-purple-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "in-progress":
      return "bg-blue-100 text-blue-700";
    case "draft":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

/* tiny helper: Title Case */
const tc = (s) =>
  (s || "")
    .toString()
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());

/* pretty short date */
const prettyDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString() : "";

/* normalize status like UI me chahiye */
const statusMap = (s = "") => {
  const S = s.toUpperCase();
  if (S === "PUBLISHED" || S === "APPROVED") return "published";
  if (S === "IN_PROGRESS" || S === "IN-PROGRESS") return "in-progress";
  if (S === "COMPLETED") return "completed";
  return "draft";
};

/* ================== HEADER COMPONENT ================== */

const Header = ({ onSidebarToggle }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [booksError, setBooksError] = useState("");

  const pathname = usePathname();
  const router = useRouter();

  const navigationLinks = [
    { href: "/", label: "Home", icon: BookOpen },
    { href: "/create-book", label: "Create Book", icon: Plus },
    { href: "/books", label: "My Books", icon: Library },
    { href: "/library", label: "Library", icon: Library },
  ];

  const isActiveLink = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  /* 🔄 Books load from backend */
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoadingBooks(true);
        setBooksError("");

        const res = await fetch(
          "https://tbmplus-backend.ultimeet.io/api/books/",
          {
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        const rawList = Array.isArray(data?.data) ? data.data : [];
        const list = rawList.map((b) => ({
          id: b.id,
          uuid: b.book_uuid,
          title: b.title || "Untitled",
          author: b.author_name || "",
          status: statusMap(b.status),
          created_at: b.created_at,
          updated_at: b.updated_at,
          lastModified: b.updated_at,
          difficulty_level: b.difficulty_level,
          target_group: b.target_group,
          description: b.description,
          category: b.category,
          language: b.language,
          teaching_style: b.teaching_style,
          educational_level: b.educational_level,
          expected_pages: b.expected_pages,
          cover_page: b.cover_page,
          cover_url: b.cover_page ? `${COVER_BASE}${b.cover_page}` : null,
          theme_json: b.theme_json || null,
        }));

        setBooks(list);
      } catch (err) {
        console.error("Failed to load books:", err);
        setBooksError("Failed to load books");
        setBooks([]);
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchBooks();
  }, []);

  /* 🔍 3+ chars par hi filter */
  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 3) return [];

    return books.filter((book) => {
      const haystack = [
        book.title,
        book.author,
        book.category,
        book.language,
        book.educational_level,
        book.target_group,
        book.teaching_style,
        book.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [books, searchQuery]);

  const handleBookClick = (book) => {
    if (book.id) {
      router.push(`/books/${book.id}`);
    }
    setIsSearchModalOpen(false);
  };

  return (
    <header
      className="
        sticky top-0 z-50
        border-b border-slate-800/80
        bg-gradient-to-r from-[#050816]/95 via-[#020617]/95 to-[#050816]/95
        bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18)_0,_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(129,140,248,0.22)_0,_transparent_60%)]
        backdrop-blur-xl
      "
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* LEFT: menu + brand + nav */}
          <div className="flex items-center gap-4">
            {/* mobile sidebar toggle */}
            <button
              onClick={onSidebarToggle}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* logo + title */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative p-2 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-fuchsia-500 shadow-lg shadow-sky-500/50">
                <BookOpen className="h-6 w-6 text-white group-hover:scale-105 transition-transform" />
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col leading-tight">

                <span className="text-lg font-semibold text-slate-50">
                  TBM{" "}
                  <span className="bg-gradient-to-r from-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
                    PLUS
                  </span>
                </span>
              </div>
            </Link>


          </div>

          {/* CENTER: search trigger */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`
                relative w-full flex items-center px-3 py-2 rounded-full text-left text-sm
                bg-slate-900/70 text-slate-300 border
                border-slate-700/80 hover:border-sky-500/70
                transition-all
                ${isSearchFocused || isSearchModalOpen
                  ? "ring-2 ring-sky-500/80 border-sky-500/80"
                  : ""
                }
              `}
            >
              <Search className="h-4 w-4 text-slate-400 mr-2" />
              <span className="text-slate-400">
                Search books, chapters, lessons...
              </span>
              <span className="ml-auto hidden lg:inline-flex items-center text-[10px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5 bg-slate-900/80">
                Ctrl + K
              </span>
            </button>
          </div>

          {/* RIGHT: actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center shadow-sm shadow-rose-500/60">
                3
              </span>
            </button>

            {/* Help */}
            <button className="hidden sm:inline-flex p-2 rounded-lg text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors">
              <HelpCircle className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="
                  flex items-center space-x-3 p-1.5 rounded-full
                  text-slate-200 hover:text-white
                  bg-slate-900/80 border border-slate-700/80
                  hover:border-sky-500/70 hover:bg-slate-900
                  transition-all
                "
              >
                <div className="h-8 w-8 bg-gradient-to-r from-sky-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-md shadow-sky-500/50">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:flex flex-col items-start mr-1">
                  <span className="text-xs font-medium">John Doe</span>
                  <span className="text-[10px] text-slate-400">
                    Admin • Teacher
                  </span>
                </div>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div
                    className="
                      absolute right-0 mt-2 w-56 rounded-xl border border-slate-800/90
                      bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
                      shadow-[0_18px_45px_rgba(0,0,0,0.85)]
                      z-20 overflow-hidden
                    "
                  >
                    <div className="py-1">
                      <div className="px-4 py-3 text-sm text-slate-200 border-b border-slate-800/80 bg-slate-950/80">
                        <div className="font-medium">John Doe</div>
                        <div className="text-[11px] text-slate-400">
                          john@example.com
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-800/80"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" /> Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-800/80"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" /> Settings
                      </Link>
                      <div className="border-t border-slate-800/80">
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-rose-400 hover:bg-slate-800/80"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LogOut className="h-4 w-4 mr-3" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= Search Modal ================= */}
      {isSearchModalOpen && (
        <>
          {/* backdrop */}


          <div className="fixed inset-x-0 -top-[0px] z-50 flex justify-center px-4 sm:px-6 lg:px-8">
            <div
              className="
                w-full max-w-2xl
                rounded-2xl border border-slate-800/90
                bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
                overflow-hidden
              "
            >
              {/* Search input row */}
              <div className="relative px-4 py-3 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm group overflow-hidden">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-slate-900/80 via-transparent to-transparent" />

                <div
                  className="pointer-events-none absolute inset-x-4 bottom-0 h-px 
                    bg-gradient-to-r from-transparent via-sky-500/80 to-transparent
                    opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
                />

                <div className="flex items-center gap-3 relative z-10">
                  <div
                    className="
                      flex flex-1 items-center gap-2 rounded-full border border-slate-700 
                      bg-slate-900/80 px-3 py-1.5 shadow-[0_1px_6px_rgba(15,23,42,0.8)]
                      focus-within:bg-slate-900 focus-within:border-sky-500/80 focus-within:shadow-[0_0_0_1px_rgba(56,189,248,0.6)]
                      transition-all duration-200
                    "
                  >
                    {/* left icon */}
                    <div
                      className="
                        flex h-7 w-7 items-center justify-center rounded-full 
                        bg-slate-950 text-slate-100 shadow-sm
                        transform transition-transform duration-200
                        group-focus-within:scale-105
                      "
                    >
                      <Search className="h-4 w-4" />
                    </div>

                    {/* input */}
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search books, chapters, lessons, topics..."
                      className="flex-1 bg-transparent outline-none text-sm text-slate-100 placeholder-slate-500"
                    />

                    {/* close button */}
                    <button
                      onClick={() => {
                        setIsSearchModalOpen(false);
                        setSearchQuery("");
                      }}
                      className="
                        relative flex h-7 w-7 items-center justify-center rounded-full 
                        border border-slate-700 bg-slate-900 text-slate-300
                        hover:border-rose-400 hover:text-rose-400
                        shadow-[0_1px_4px_rgba(15,23,42,0.9)]
                        transition-all duration-200 hover:shadow-md hover:rotate-90 active:scale-95
                        flex-shrink-0 ml-1
                      "
                      aria-label="Close search"
                    >
                      <X className="h-3 w-3" />
                      <span className="pointer-events-none absolute inset-0 rounded-full bg-rose-500/10 opacity-0 hover:opacity-100 transition-opacity duration-200" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="max-height-[24rem] max-h-96 overflow-y-auto p-3">
                {loadingBooks && (
                  <p className="text-xs text-slate-400 px-1 py-2">
                    Loading books...
                  </p>
                )}

                {booksError && !loadingBooks && (
                  <p className="text-xs text-rose-400 px-1 py-2">
                    {booksError}
                  </p>
                )}

                {!loadingBooks && !booksError && (
                  <>
                    {searchQuery.trim().length < 3 ? (
                      <p className="text-xs text-slate-500 px-1 py-2">
                        Type at least{" "}
                        <span className="font-semibold text-slate-300">3</span>{" "}
                        characters to search.
                      </p>
                    ) : filteredBooks.length === 0 ? (
                      <p className="text-sm text-slate-300 px-1 py-2">
                        No books found for{" "}
                        <span className="font-semibold text-slate-100">
                          &quot;{searchQuery.trim()}&quot;
                        </span>
                        .
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {filteredBooks.map((book, idx) => {
                          const coverPath =
                            book.cover_url || book.cover_page || null;
                          const coverUrl = coverPath
                            ? String(coverPath).startsWith("http")
                              ? coverPath
                              : `${COVER_BASE}${coverPath}`
                            : null;

                          const gradient = pickGradient(
                            book.title || book.category || ""
                          );

                          const frontCoverStyle = coverUrl
                            ? {
                              backgroundImage: `url(${coverUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }
                            : {
                              background: gradient,
                            };

                          return (
                            <div
                              key={book.uuid || book.id || idx}
                              className="group"
                            >
                              <button
                                type="button"
                                onClick={() => handleBookClick(book)}
                                className="
                                  w-full flex items-stretch gap-3 px-3 py-3 rounded-xl 
                                  border border-slate-800 bg-slate-950/90 backdrop-blur
                                  shadow-[0_10px_30px_rgba(0,0,0,0.85)]
                                  hover:border-sky-500/70 hover:shadow-[0_16px_38px_rgba(8,47,73,0.95)]
                                  transition-all duration-200 ease-out
                                "
                              >
                                <div
                                  className="
                                    relative h-16 w-16 flex-shrink-0 rounded-lg shadow-md overflow-hidden
                                    transform transition-transform duration-200 ease-out
                                    group-hover:-translate-y-0.5 group-hover:rotate-[-2deg]
                                  "
                                  style={frontCoverStyle}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                                  <div
                                    className="
                                      pointer-events-none absolute inset-0 opacity-0 
                                      group-hover:opacity-100 transition-opacity duration-200
                                      bg-[radial-gradient(circle_at_15%_0,rgba(255,255,255,0.7),transparent_55%)]
                                    "
                                  />
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="font-semibold text-slate-50 truncate">
                                      {book.title || "Untitled"}
                                    </p>
                                    <span
                                      className={`
                                        text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap 
                                        ${badgeColor(book.status)}
                                      `}
                                    >
                                      {tc(book.status)}
                                    </span>
                                  </div>

                                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                                    {book.educational_level && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5">
                                        <GraduationCap className="h-3 w-3" />
                                        {tc(book.educational_level)}
                                      </span>
                                    )}
                                    {book.language && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5">
                                        <Languages className="h-3 w-3" />
                                        {tc(book.language)}
                                      </span>
                                    )}
                                    {book.target_group && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5">
                                        <Target className="h-3 w-3" />
                                        {tc(book.target_group)}
                                      </span>
                                    )}
                                    {book.updated_at && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5">
                                        <CalendarClock className="h-3 w-3" />
                                        {prettyDate(book.updated_at)}
                                      </span>
                                    )}
                                  </div>

                                  {/* author + category line */}
                                  <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                                    {book.author && <span>by {book.author}</span>}
                                    {book.author && book.category && " • "}
                                    {book.category && tc(book.category || "")}
                                  </p>
                                </div>
                              </button>

                              {/* subtle divider */}
                              <div
                                className="
                                  mt-2 h-px bg-gradient-to-r from-transparent via-slate-700/80 to-transparent 
                                  group-hover:via-sky-500/70 transition-colors duration-200
                                "
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
