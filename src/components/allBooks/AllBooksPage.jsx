'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import BookGrid from '@/components/book/BookGrid';

const API = 'https://tbmplus-backend.ultimeet.io/api/books/';
const COVER_BASE = 'https://tbmplus-backend.ultimeet.io'; 

export default function AllBooksPage() {
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

