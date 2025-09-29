'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import BookGrid from '@/components/book/BookGrid';
import BookStats from '@/components/book/BookStats';
import { 
  Plus, 
  BookOpen, 
  Search, 
  Filter, 
  SortAsc, 
  Layout, 
  BarChart3, 
  Download, 
  Upload, 
  Settings, 
  Star, 
  Clock, 
  TrendingUp,
  Users,
  Target,
  Zap,
  Archive,
  Trash2,
  Edit3,
  Eye,
  Share2,
  MoreHorizontal,
  RefreshCw,
  HelpCircle,
  Bell,
  Bookmark,
  Heart,
  Activity,
  Calendar,
  FileText
} from 'lucide-react';
import axios from 'axios';

const BooksLibraryPage = () => {
  const router = useRouter();
  
  // State management
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Load sample data
  // BooksLibraryPage.jsx
useEffect(() => {
  const loadBooks = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "https://tbmplus-backend.ultimeet.io/api/books/",
        { withCredentials: true }
      );

      const toUi = (b) => {
        const statusMap = (s) => {
          switch ((s || "").toUpperCase()) {
            case "DRAFT": return "draft";
            case "PUBLISHED": 
            case "APPROVED": return "published";
            case "IN_PROGRESS":
            case "IN-PROGRESS": return "in-progress";
            case "COMPLETED": return "completed";
            default: return "draft";
          }
        };

        // count lessons as "chapters"
        const chapters =
          Array.isArray(b.units)
            ? b.units.reduce((acc, u) => acc + (u.lessons?.length || 0), 0)
            : 0;

        // quick tags from meta
        const tags = [b.category, b.language, b.educational_level].filter(Boolean);

        return {
          id: b.id,
          title: b.title,
          description: b.description || "",
          status: statusMap(b.status),
          author: b.author_name || "",
          language: b.language || "",
          category: b.category || "",
          createdAt: b.created_at,
          lastModified: b.updated_at,
          chapters,
          tags,
          // nice-to-haves for your grid:
          rating: 0,
          readingProgress: 0,
          wordCount: (b.expected_pages || 0) * 250, // rough estimate
          isBookmarked: false,
        };
      };

      const list = Array.isArray(data?.data) ? data.data.map(toUi) : [];
      setBooks(list);
    } catch (err) {
      console.error("books load failed:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  loadBooks();
}, []);


  // Sample notifications
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        type: 'success',
        title: 'Book Published',
        message: 'Advanced Mathematics Textbook has been published successfully',
        timestamp: '2 hours ago',
        read: false
      },
      {
        id: 2,
        type: 'info',
        title: 'New Review',
        message: 'Physics Fundamentals received a 5-star review',
        timestamp: '1 day ago',
        read: false
      },
      {
        id: 3,
        type: 'warning',
        title: 'Draft Reminder',
        message: 'Chemistry Basics has been in draft for 2 weeks',
        timestamp: '3 days ago',
        read: true
      }
    ]);
  }, []);

  // Event handlers
  const handleBookSelect = (book) => {
    router.push(`/books/${book.id}`);
  };

  const handleBookEdit = (book) => {
    router.push(`/editor/${book.id}`);
  };

  const handleBookDelete = (book) => {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      setBooks(prev => prev.filter(b => b.id !== book.id));
    }
  };

  const handleBookRead = (book) => {
    router.push(`/books/${book.id}/read`);
  };

  const handleBookDownload = (book) => {
    // Simulate download
    console.log('Downloading book:', book.title);
  };

  const handleBookShare = (book) => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: book.description,
        url: `${window.location.origin}/books/${book.id}`
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/books/${book.id}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleBookBookmark = (bookId, isBookmarked) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId ? { ...book, isBookmarked } : book
    ));
  };

  const handleBulkDelete = (bookIds) => {
    if (confirm(`Are you sure you want to delete ${bookIds.length} book(s)?`)) {
      setBooks(prev => prev.filter(book => !bookIds.includes(book.id)));
    }
  };

  const handleBulkDownload = (selectedBooks) => {
    console.log('Bulk downloading:', selectedBooks.map(b => b.title));
  };

  const handleBulkArchive = (bookIds) => {
    console.log('Bulk archiving:', bookIds);
  };

  const handleCreateNew = () => {
    router.push('/create-book');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
       <BookGrid
          books={books}
          loading={loading}
          onBookSelect={handleBookSelect}
          onBookEdit={handleBookEdit}
          onBookDelete={handleBookDelete}
          onBookDownload={handleBookDownload}
          onBookShare={handleBookShare}
          onBookRead={handleBookRead}
          onBookBookmark={handleBookBookmark}
          onCreateNew={handleCreateNew}
          onBulkDelete={handleBulkDelete}
          onBulkDownload={handleBulkDownload}
          onBulkArchive={handleBulkArchive}
          defaultView="grid"
          defaultSort="lastModified"
          showStats={true}
          showFilters={true}
          showBulkActions={true}
          className=""
        />
    </div>
  );
};

export default BooksLibraryPage;
