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
  Settings,
  ChevronDown,
  ChevronRight,
  Book,
  NotebookPen,
  Library,
  Clock,
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

  // Filters inside "My Books"
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
    }
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 lg:py-6 space-y-6">
            {/* TOP: Main actions */}
            <div className="space-y-1">
              <div className="px-3 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Overview
                </span>
              </div>

              {/* Dashboard */}
              <Link
                href="/dashboard"
                onClick={() => onClose?.()}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActiveLink('/dashboard')
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="h-5 w-5 flex-shrink-0" />
                <span>Dashboard</span>
              </Link>

              {/* All Books */}
              <Link
                href="/books"
                onClick={() => {
                  // clear status filter when going to All Books
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete('status');
                  const query = params.toString();
                  router.push(query ? `/books?${query}` : '/books', {
                    scroll: false,
                  });
                  onClose?.();
                }}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActiveLink('/books') && currentStatus === 'all'
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Book className="h-5 w-5 flex-shrink-0" />
                <span>All Books</span>
              </Link>

              {/* Create New Book */}
              <Link
                href="/create-book"
                onClick={() => onClose?.()}
                className="mt-2 flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-sm"
              >
                <Plus className="h-5 w-5 flex-shrink-0" />
                <span>Create New Book</span>
              </Link>
            </div>

            {/* My Books Section */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => toggleSection('books')}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Book className="h-4 w-4 text-gray-500" />
                  <span>My Books</span>
                </div>
                {expandedSections.books ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {expandedSections.books && (
                <div className="mt-2 space-y-1 pl-6">
                  {bookMenuItems.map((item) => {
                    const Icon = item.icon;

                    const isBooksPage = pathname === '/books';
                    const isFilterItem = !!item.status; // items with status filter /books
                    const isActiveFilter =
                      isBooksPage &&
                      isFilterItem &&
                      currentStatus === (item.status || 'all');

                    const handleClick = (e) => {
                      // Primary Book is just a normal link (no status)
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
                        className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                          isActiveFilter
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        {/* {item.count && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                            {item.count}
                          </span>
                        )} */}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
                href="/create-primary-book"
                onClick={() => {
                  // clear status filter when going to All Books
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete('status');
                  const query = params.toString();
                  router.push("/create-primary-book");
                  onClose?.();
                }}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActiveLink('/create-primary-book')
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <NotebookPen className="h-5 w-5 flex-shrink-0" />
                <span>Primary Book</span>
              </Link>

            {/* Library Section */}
            {/* <div className="mb-6">
              <button
                onClick={() => toggleSection('library')}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Library className="h-4 w-4" />
                  <span>Library</span>
                </div>
                {expandedSections.library ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {expandedSections.library && (
                <div className="mt-2 space-y-1 pl-6">
                  {libraryItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => onClose?.()}
                        className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                          isActiveLink(item.href)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        {item.count && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                            {item.count}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div> */}

            {/* Recent Books Section */}
            {/* <div className="mb-6">
              <button
                onClick={() => toggleSection('recent')}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Recent</span>
                </div>
                {expandedSections.recent ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {expandedSections.recent && (
                <div className="mt-2 space-y-2 pl-6">
                  {recentBooks.map((book) => (
                    <Link
                      key={book.id}
                      href={`/books/${book.id}`}
                      onClick={() => onClose?.()}
                      className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{book.title}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          {book.progress}%
                        </span>
                      </div>
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-blue-500 h-1 rounded-full transition-all"
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div> */}
          </div>

          {/* Bottom Settings */}
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/settings"
              onClick={() => onClose?.()}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActiveLink('/settings')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
