'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Library, 
  Plus, 
  Edit3, 
  FileText, 
  Download,
  TrendingUp,
  Clock,
  Star,
  Archive,
  Settings,
  X,
  ChevronDown,
  ChevronRight,
  Book,
  Bookmark
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    books: true,
    library: false,
    recent: false
  });
  const pathname = usePathname();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActiveLink = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const mainMenuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: TrendingUp,
    },
    {
      title: 'Create New Book',
      href: '/create-book',
      icon: Plus,
      highlight: true
    }
  ];

  const bookMenuItems = [
    {
      title: 'All Books',
      href: '/books',
      icon: BookOpen,
      count: 12
    },
    {
      title: 'In Progress',
      href: '/books?status=progress',
      icon: Edit3,
      count: 5
    },
    {
      title: 'Completed',
      href: '/books?status=completed',
      icon: FileText,
      count: 7
    },
    {
      title: 'Drafts',
      href: '/books?status=draft',
      icon: Archive,
      count: 3
    }
  ];

  const libraryItems = [
    {
      title: 'Primary Library',
      href: '/library/primary',
      icon: Library,
      count: 156
    },
    {
      title: 'Secondary Library',
      href: '/library/secondary',
      icon: Bookmark,
      count: 89
    },
    {
      title: 'Favorites',
      href: '/library/favorites',
      icon: Star,
      count: 23
    }
  ];

  const recentBooks = [
    { title: 'Advanced Mathematics', progress: 85, id: 1 },
    { title: 'Physics Fundamentals', progress: 60, id: 2 },
    { title: 'Chemistry Basics', progress: 40, id: 3 },
    { title: 'Biology Introduction', progress: 95, id: 4 }
  ];

  return (
    <>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 lg:py-6">
            {/* Main Menu */}
            <div className="space-y-2 mb-8">
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onClose?.()}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActiveLink(item.href)
                        ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${
                      item.highlight 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' 
                        : ''
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>

            {/* Books Section */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('books')}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Book className="h-4 w-4" />
                  <span>My Books</span>
                </div>
                {expandedSections.books ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              
              {expandedSections.books && (
                <div className="mt-2 space-y-1 pl-6">
                  {bookMenuItems.map((item) => {
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

            {/* Library Section */}
            <div className="mb-6">
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
            </div>

            {/* Recent Books Section */}
            <div className="mb-6">
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
                        <span className="text-xs text-gray-400 ml-2">{book.progress}%</span>
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
            </div>
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