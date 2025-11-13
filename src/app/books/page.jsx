'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import BookGrid from '@/components/book/BookGrid';

const API = 'https://tbmplus-backend.ultimeet.io/api/books/';
const COVER_BASE = 'https://tbmplus-backend.ultimeet.io'; 

export default function BooksLibraryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusFromUrl = searchParams.get('status') || 'all';

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(API, { withCredentials: true });

        const statusMap = (s = '') => {
          const S = s.toUpperCase();
          if (S === 'PUBLISHED' || S === 'APPROVED') return 'published';
          if (S === 'IN_PROGRESS' || S === 'IN-PROGRESS') return 'in-progress';
          if (S === 'COMPLETED') return 'completed';
          return 'draft';
        };

        const chaptersFromUnits = (units) => {
          if (!Array.isArray(units)) return 0;
          return units.reduce((sum, u) => sum + (u.lessons?.length || 0), 0);
        };

        const toUi = (b) => ({
          id: b.id,
          title: b.title || 'Untitled',
          author: b.author_name || '',
          status: statusMap(b.status),
          createdAt: b.created_at,
          updated_at: b.updated_at,
          lastModified: b.updated_at,
          chapters: chaptersFromUnits(b.syllabus?.syllabus_json?.units),
          difficulty_level: b.difficulty_level,
          target_group: b.target_group,
          description: b.description,
          category: b.category,
          language: b.language,
          teaching_style: b.teaching_style,
          cover_url: b.cover_page ? `${COVER_BASE}${b.cover_page}` : null,
        });

        const list = Array.isArray(data?.data) ? data.data.map(toUi) : [];
        setBooks(list);
      } catch (e) {
        console.error('Failed to load books:', e);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelect = (book) => router.push(`/books/${book.id}`);

  const handleStatusChange = (status) => {
    const params = new URLSearchParams(searchParams.toString());

    if (status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }

    const query = params.toString();
    router.push(query ? `/books?${query}` : '/books', { scroll: false });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BookGrid
        books={books}
        loading={loading}
        onBookSelect={handleSelect}
        statusFromUrl={statusFromUrl}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}





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
                        className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${isActiveLink(item.href)
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
            </div> */}




             {/* {item.count && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                            {item.count}
                          </span>
                        )} */}