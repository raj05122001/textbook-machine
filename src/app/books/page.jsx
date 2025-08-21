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

const BooksLibraryPage = () => {
  const router = useRouter();
  
  // State management
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooks, setSelectedBooks] = useState(new Set());
  const [showStats, setShowStats] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [notifications, setNotifications] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Load sample data
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sampleBooks = [
        {
          id: 1,
          title: "Advanced Mathematics Textbook",
          subtitle: "Calculus and Linear Algebra",
          author: "Dr. Sarah Chen",
          description: "A comprehensive guide to advanced mathematical concepts including calculus, linear algebra, and differential equations. Perfect for undergraduate students and professionals.",
          status: "completed",
          wordCount: 85000,
          chapters: 12,
          rating: 4.8,
          reviewCount: 245,
          bookmarkCount: 89,
          shareCount: 34,
          downloadCount: 567,
          readingProgress: 65,
          completionProgress: 100,
          createdAt: "2024-01-15T10:00:00Z",
          lastModified: "2024-02-20T15:30:00Z",
          lastReadDate: "2024-02-18T09:15:00Z",
          coverColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          tags: ["mathematics", "calculus", "textbook", "academic"],
          genre: "academic",
          language: "en",
          visibility: "public",
          isBookmarked: true,
          exportCount: 23,
          recentActivity: [
            { description: "Downloaded as PDF", date: "2024-02-19T14:22:00Z" },
            { description: "Shared with team", date: "2024-02-18T11:45:00Z" },
            { description: "Chapter 8 completed", date: "2024-02-17T16:30:00Z" }
          ]
        },
        {
          id: 2,
          title: "Physics Fundamentals",
          subtitle: "From Classical to Quantum",
          author: "Prof. Michael Rodriguez",
          description: "Explore the fascinating world of physics from Newton's laws to quantum mechanics. This comprehensive guide covers all fundamental concepts.",
          status: "in-progress",
          wordCount: 67500,
          chapters: 15,
          rating: 4.6,
          reviewCount: 189,
          bookmarkCount: 67,
          shareCount: 28,
          downloadCount: 445,
          readingProgress: 40,
          completionProgress: 75,
          createdAt: "2024-01-08T14:20:00Z",
          lastModified: "2024-02-19T11:45:00Z",
          lastReadDate: "2024-02-17T13:22:00Z",
          coverColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          tags: ["physics", "quantum", "classical", "science"],
          genre: "academic",
          language: "en",
          visibility: "public",
          isBookmarked: false,
          exportCount: 18
        },
        {
          id: 3,
          title: "Chemistry Basics",
          subtitle: "Organic and Inorganic Chemistry",
          author: "Dr. Emily Watson",
          description: "A beginner-friendly introduction to chemistry covering both organic and inorganic chemistry principles with practical examples.",
          status: "draft",
          wordCount: 42000,
          chapters: 8,
          rating: 4.3,
          reviewCount: 92,
          bookmarkCount: 34,
          shareCount: 12,
          downloadCount: 234,
          readingProgress: 15,
          completionProgress: 45,
          createdAt: "2024-01-22T09:30:00Z",
          lastModified: "2024-02-15T10:15:00Z",
          lastReadDate: "2024-02-14T16:45:00Z",
          coverColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          tags: ["chemistry", "organic", "inorganic", "basics"],
          genre: "academic",
          language: "en",
          visibility: "private",
          isBookmarked: true,
          exportCount: 7
        },
        {
          id: 4,
          title: "Biology Introduction",
          subtitle: "Cell Biology and Genetics",
          author: "Dr. James Liu",
          description: "Discover the building blocks of life through cell biology and genetics. Perfect for students beginning their biology journey.",
          status: "completed",
          wordCount: 72000,
          chapters: 10,
          rating: 4.9,
          reviewCount: 312,
          bookmarkCount: 128,
          shareCount: 56,
          downloadCount: 789,
          readingProgress: 90,
          completionProgress: 100,
          createdAt: "2023-12-10T12:00:00Z",
          lastModified: "2024-01-25T14:20:00Z",
          lastReadDate: "2024-02-16T08:30:00Z",
          coverColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          tags: ["biology", "cells", "genetics", "life-science"],
          genre: "academic",
          language: "en",
          visibility: "public",
          isBookmarked: false,
          exportCount: 45
        },
        {
          id: 5,
          title: "History of Science",
          subtitle: "From Ancient Times to Modern Day",
          author: "Prof. Anna Williams",
          description: "A fascinating journey through the history of scientific discovery, exploring how our understanding of the world has evolved.",
          status: "in-progress",
          wordCount: 58000,
          chapters: 14,
          rating: 4.4,
          reviewCount: 156,
          bookmarkCount: 73,
          shareCount: 29,
          downloadCount: 387,
          readingProgress: 25,
          completionProgress: 60,
          createdAt: "2024-01-05T16:45:00Z",
          lastModified: "2024-02-12T09:30:00Z",
          lastReadDate: "2024-02-10T20:15:00Z",
          coverColor: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
          tags: ["history", "science", "discovery", "timeline"],
          genre: "non-fiction",
          language: "en",
          visibility: "unlisted",
          isBookmarked: true,
          exportCount: 14
        },
        {
          id: 6,
          title: "Programming Fundamentals",
          subtitle: "Learn to Code with Python",
          author: "Alex Thompson",
          description: "Master the basics of programming with Python. This hands-on guide takes you from beginner to intermediate level with practical projects.",
          status: "draft",
          wordCount: 39000,
          chapters: 9,
          rating: 4.7,
          reviewCount: 203,
          bookmarkCount: 95,
          shareCount: 41,
          downloadCount: 612,
          readingProgress: 0,
          completionProgress: 30,
          createdAt: "2024-02-01T11:20:00Z",
          lastModified: "2024-02-18T17:45:00Z",
          lastReadDate: null,
          coverColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          tags: ["programming", "python", "coding", "software"],
          genre: "technical",
          language: "en",
          visibility: "private",
          isBookmarked: false,
          exportCount: 3
        }
      ];
      
      setBooks(sampleBooks);
      setLoading(false);
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

  // Calculate dashboard statistics
  const dashboardStats = useMemo(() => {
    const totalBooks = books.length;
    const completedBooks = books.filter(book => book.status === 'completed').length;
    const inProgressBooks = books.filter(book => book.status === 'in-progress').length;
    const draftBooks = books.filter(book => book.status === 'draft').length;
    const totalWords = books.reduce((sum, book) => sum + book.wordCount, 0);
    const totalChapters = books.reduce((sum, book) => sum + book.chapters, 0);
    const averageRating = books.reduce((sum, book) => sum + book.rating, 0) / books.length || 0;
    const totalDownloads = books.reduce((sum, book) => sum + book.downloadCount, 0);
    const totalBookmarks = books.reduce((sum, book) => sum + book.bookmarkCount, 0);
    const totalShares = books.reduce((sum, book) => sum + book.shareCount, 0);

    return {
      totalBooks,
      completedBooks,
      inProgressBooks,
      draftBooks,
      totalWords,
      totalChapters,
      averageRating,
      totalDownloads,
      totalBookmarks,
      totalShares,
      completionRate: totalBooks > 0 ? (completedBooks / totalBooks) * 100 : 0,
      productivity: Math.round(totalWords / 30), // Words per day estimate
      engagement: totalBookmarks + totalShares
    };
  }, [books]);

  // Quick actions
  const quickActions = [
    {
      id: 'create',
      title: 'Create New Book',
      description: 'Start a new book from scratch or template',
      icon: Plus,
      color: 'blue',
      action: () => router.push('/create-book')
    },
    {
      id: 'import',
      title: 'Import Content',
      description: 'Upload existing documents to convert',
      icon: Upload,
      color: 'green',
      action: () => router.push('/create-book?method=upload')
    },
    {
      id: 'templates',
      title: 'Browse Templates',
      description: 'Explore pre-made book structures',
      icon: FileText,
      color: 'purple',
      action: () => router.push('/templates')
    },
    {
      id: 'collaborate',
      title: 'Collaborate',
      description: 'Invite others to work on your books',
      icon: Users,
      color: 'orange',
      action: () => setShowCollaboration(true)
    }
  ];

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

  const handleStatsRefresh = () => {
    // Refresh statistics
    setBooks(prev => [...prev]);
  };

  const handleStatsExport = () => {
    // Export statistics
    console.log('Exporting stats...');
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
