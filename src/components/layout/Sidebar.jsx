'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
  BookOpen,
  Plus,
  Edit3,
  FileText,
  Archive,
  ChevronDown,
  ChevronRight,
  Book,
  NotebookPen,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    books: true,
    library: false,
    recent: false,
  });

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentStatus = searchParams.get('status') || 'all';

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActiveLink = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const bookMenuItems = [
    {
      title: 'In Progress',
      href: '/books',
      status: 'in-progress',
      icon: Edit3,
    },
    {
      title: 'Completed',
      href: '/books',
      status: 'completed',
      icon: FileText,
    },
    {
      title: 'Drafts',
      href: '/books',
      status: 'draft',
      icon: Archive,
    },
  ];

  return (
    <>
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64
          border-r border-slate-800/80
          bg-gradient-to-b from-[#050816] via-[#050816] to-[#020617]
          bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22)_0,_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(129,140,248,0.25)_0,_transparent_55%)]
          shadow-xl shadow-black/50
          transform transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Top bar: logo + brand */}
        

          {/* Divider */}
          <div className="px-4 pb-1">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600/60 to-transparent" />
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto px-3 pb-5 pt-2 lg:pt-3 space-y-6">
            {/* TOP: Main actions */}
            <div className="space-y-1">
              <div className="px-2 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Overview
                </span>
              </div>

              {/* Dashboard */}
              <Link
                href="/dashboard"
                onClick={() => onClose?.()}
                className={`
                  group relative flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${isActiveLink('/dashboard')
                    ? 'bg-sky-500/15 text-sky-100 border border-sky-400/60 shadow-md shadow-sky-500/40'
                    : 'text-slate-200 hover:bg-slate-800/80 hover:text-white'
                  }
                `}
              >
                <span className="absolute inset-y-1 left-1 w-1 rounded-full bg-gradient-to-b from-sky-400 to-fuchsia-400 opacity-0 group-hover:opacity-80 transition-opacity" />
                <BookOpen className="h-5 w-5 flex-shrink-0 group-hover:scale-105 transition-transform" />
                <span>Dashboard</span>
              </Link>

              {/* All Books */}
              <button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete('status');
                  const query = params.toString();
                  router.push(query ? `/books?${query}` : '/books', {
                    scroll: false,
                  });
                  onClose?.();
                }}
                className={`
                  group relative w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${isActiveLink('/books') && currentStatus === 'all'
                    ? 'bg-sky-500/15 text-sky-100 border border-sky-400/60 shadow-md shadow-sky-500/40'
                    : 'text-slate-200 hover:bg-slate-800/80 hover:text-white'
                  }
                `}
              >
                <span className="absolute inset-y-1 left-1 w-1 rounded-full bg-gradient-to-b from-sky-400 to-fuchsia-400 opacity-0 group-hover:opacity-80 transition-opacity" />
                <Book className="h-5 w-5 flex-shrink-0 group-hover:scale-105 transition-transform" />
                <span>All Books</span>
              </button>

              {/* Create New Book */}
              <Link
                href="/create-book"
                onClick={() => onClose?.()}
                className="
                  mt-2 w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500
                  text-white shadow-lg shadow-sky-500/50
                  hover:shadow-xl hover:shadow-fuchsia-500/50
                  hover:translate-y-0.5 hover:brightness-110
                  transition-all duration-200
                "
              >
                <Plus className="h-5 w-5 flex-shrink-0" />
                <div className="flex flex-col items-start">
                  <span>Create New Book</span>
                  <span className="text-[10px] opacity-90">
                    Start fresh with AI assist
                  </span>
                </div>
              </Link>
            </div>

            {/* My Books Section */}
            <div className="pt-2 border-t border-slate-800/80">
              <button
                onClick={() => toggleSection('books')}
                className="
                  flex items-center justify-between w-full px-3 py-2.5
                  text-sm font-semibold text-slate-100
                  hover:bg-slate-900/80
                  rounded-xl transition-colors
                "
              >
                <div className="flex items-center space-x-2">
                  <div className="h-7 w-7 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-700/80">
                    <Book className="h-4 w-4 text-slate-300" />
                  </div>
                  <span>My Books</span>
                </div>
                {expandedSections.books ? (
                  <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-200" />
                )}
              </button>

              {/* Accordion body */}
              <div
                className={`
                  overflow-hidden transition-[max-height,opacity,transform]
                  duration-250 ease-out
                  ${expandedSections.books ? 'max-h-64 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-1'}
                `}
              >
                {expandedSections.books && (
                  <div className="mt-2 space-y-1 pl-4 pr-1 pb-1">
                    {bookMenuItems.map((item) => {
                      const Icon = item.icon;

                      const isBooksPage = pathname === '/books';
                      const isFilterItem = !!item.status;
                      const isActiveFilter =
                        isBooksPage &&
                        isFilterItem &&
                        currentStatus === (item.status || 'all');

                      const handleClick = (e) => {
                        if (!isFilterItem) {
                          onClose?.();
                          return;
                        }

                        e.preventDefault();

                        const params = new URLSearchParams(
                          searchParams.toString()
                        );
                        if (item.status === 'all') {
                          params.delete('status');
                        } else {
                          params.set('status', item.status);
                        }

                        const query = params.toString();
                        router.push(
                          query ? `/books?${query}` : '/books',
                          { scroll: false }
                        );
                        onClose?.();
                      };

                      const href = item.href || '/books';

                      return (
                        <Link
                          key={item.title}
                          href={href}
                          onClick={handleClick}
                          className={`
                            group flex items-center justify-between px-3 py-2 rounded-lg text-sm
                            transition-all duration-200
                            ${isActiveFilter
                              ? 'bg-sky-500/15 text-sky-100 border border-sky-400/60'
                              : 'text-slate-300 hover:text-white hover:bg-slate-900/70'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-6 w-6 rounded-md bg-slate-900 flex items-center justify-center border border-slate-700/80 group-hover:scale-105 transition-transform">
                              <Icon className="h-4 w-4" />
                            </div>
                            <span>{item.title}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ✅ Primary Book button: -20px from top + same active style as Create Book */}
            <button
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete('status');
                router.push('/create-primary-book');
                onClose?.();
              }}
              className={`
                group w-full -mt-5 flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${isActiveLink('/create-primary-book')
                  ? 'bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/50 hover:shadow-xl hover:brightness-110'
                  : 'bg-slate-900/50 text-slate-200 border border-slate-700/80 hover:bg-slate-900/80 hover:text-white'
                }
              `}
            >
              <NotebookPen className="h-5 w-5 flex-shrink-0 group-hover:scale-105 transition-transform" />
              <div className="flex flex-col items-start">
                <span>Primary Book</span>
              </div>
            </button>
          </div>

          {/* Bottom subtle footer */}
          <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
            <p className="leading-snug">
              Crafted for{' '}
              <span className="font-semibold text-slate-300">
                teachers & authors
              </span>
              .
              <br />
              <span className="opacity-80">
                You write. TBM+ shapes the book.
              </span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
