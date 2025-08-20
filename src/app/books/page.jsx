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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span>My Library</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your books, track progress, and discover insights
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="h-5 w-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Quick Stats Toggle */}
              <button
                onClick={() => setShowStats(!showStats)}
                className={`p-2 rounded-lg transition-colors ${
                  showStats ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Toggle Statistics"
              >
                <BarChart3 className="h-5 w-5" />
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>

              {/* Help */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Books</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalBooks}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardStats.completedBooks}</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Words</p>
                  <p className="text-2xl font-bold text-purple-600">{dashboardStats.totalWords.toLocaleString()}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{dashboardStats.averageRating.toFixed(1)}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Downloads</p>
                  <p className="text-2xl font-bold text-blue-600">{dashboardStats.totalDownloads.toLocaleString()}</p>
                </div>
                <Download className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Engagement</p>
                  <p className="text-2xl font-bold text-pink-600">{dashboardStats.engagement}</p>
                </div>
                <Heart className="h-8 w-8 text-pink-500" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {quickActions.map(action => {
              const Icon = action.icon;
              const colorClasses = {
                blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
                green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
                purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
                orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
              };

              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${colorClasses[action.color]}`}
                >
                  <Icon className="h-6 w-6 mb-2" />
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="text-xs opacity-75 mt-1">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Statistics Panel */}
        {showStats && (
          <div className="mb-8">
            <BookStats
              book={{
                title: "Library Overview",
                ...dashboardStats
              }}
              chapters={books.flatMap(book => 
                Array.from({ length: book.chapters }, (_, i) => ({
                  id: `${book.id}-${i}`,
                  title: `Chapter ${i + 1}`,
                  wordCount: Math.floor(book.wordCount / book.chapters),
                  status: book.status
                }))
              )}
              readingHistory={[
                // Sample reading history data
                { date: '2024-02-19', type: 'writing', wordsAdded: 1200, sessionLength: 45 },
                { date: '2024-02-18', type: 'writing', wordsAdded: 800, sessionLength: 30 },
                { date: '2024-02-17', type: 'reading', sessionLength: 60 },
                { date: '2024-02-16', type: 'writing', wordsAdded: 1500, sessionLength: 75 }
              ]}
              goals={{
                dailyWords: 1000,
                weeklyChapters: 2
              }}
              onExport={handleStatsExport}
              onRefresh={handleStatsRefresh}
              className="mb-6"
            />
          </div>
        )}

        {/* Recent Activity */}
        {notifications.length > 0 && (
          <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span>Recent Activity</span>
              </h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 3).map(notification => (
                <div key={notification.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'success' ? 'bg-green-500' :
                    notification.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Books Grid */}
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
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        />
      </div>
    </div>
  );
};

export default BooksLibraryPage;
