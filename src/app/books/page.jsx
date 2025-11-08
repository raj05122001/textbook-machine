'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import BookGrid from '@/components/book/BookGrid';

const API = 'https://tbmplus-backend.ultimeet.io/api/books/';
const COVER_BASE = 'https://tbmplus-backend.ultimeet.io'; // base for relative cover paths

export default function BooksLibraryPage() {
  const router = useRouter();
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
          educational_level: b.educational_level,
          difficulty_level: b.difficulty_level,
          target_group: b.target_group,
          description: b.description,
          category: b.category,
          language: b.language,
          teaching_style: b.teaching_style,
          // 👇 build absolute cover url if present
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BookGrid books={books} loading={loading} onBookSelect={handleSelect} />
    </div>
  );
}
