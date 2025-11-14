"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Book,
  Users,
  TrendingUp,
  Star,
  Clock,
  Download,
  Edit3,
  Plus,
  Eye,
  Share2,
  Archive,
  CheckCircle,
  BookOpen,
  Target,
  Calendar,
  Activity,
  Filter,
  Search,
  MoreHorizontal,
  ChevronRight,
  Bookmark,
  FileText,
  BarChart3,
} from "lucide-react";

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [searchTerm, setSearchTerm] = useState("");
  const [activity, setActivity] = useState([]);

  // Sample dashboard data
  useEffect(() => {
    const loadDashboardData = () => {
      const sampleBooks = [
        {
          id: 1,
          title: "Mathematics for Class 10",
          subtitle: "Algebra • Geometry • Trigonometry • Statistics",
          status: "completed",
          wordCount: 45000,
          chapters: 21,
          rating: 4.8,
          reviewCount: 156,
          bookmarkCount: 234,
          shareCount: 89,
          downloadCount: 1245,
          readingProgress: 100,
          completionProgress: 100,
          createdAt: "2024-01-15T10:30:00Z",
          lastModified: "2024-08-20T14:22:00Z",
          coverColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          visibility: "public",
        },
        {
          id: 2,
          title: "Advanced Algorithms and Data Structures",
          subtitle: "Computer Science Fundamentals",
          status: "draft",
          wordCount: 32000,
          chapters: 15,
          rating: 4.6,
          reviewCount: 89,
          bookmarkCount: 156,
          shareCount: 45,
          downloadCount: 678,
          readingProgress: 65,
          completionProgress: 70,
          createdAt: "2024-03-10T09:15:00Z",
          lastModified: "2024-08-25T16:45:00Z",
          coverColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          visibility: "private",
        },
        {
          id: 3,
          title: "Physics Fundamentals",
          subtitle: "Mechanics • Thermodynamics • Electromagnetism",
          status: "review",
          wordCount: 38000,
          chapters: 18,
          rating: 4.7,
          reviewCount: 123,
          bookmarkCount: 198,
          shareCount: 67,
          downloadCount: 891,
          readingProgress: 45,
          completionProgress: 85,
          createdAt: "2024-02-28T11:20:00Z",
          lastModified: "2024-08-24T13:30:00Z",
          coverColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          visibility: "shared",
        },
      ];

      const sampleActivity = [
        {
          id: 1,
          type: "edit",
          book: "Mathematics for Class 10",
          action: "Modified Chapter 12: Statistics",
          timestamp: "2 hours ago",
          icon: Edit3,
        },
        [
          {
            id: 2,
            type: "share",
            book: "Physics Fundamentals",
            action: "Shared with Physics Department",
            timestamp: "5 hours ago",
            icon: Share2,
          },
        ],
        {
          id: 3,
          type: "create",
          book: "Advanced Algorithms",
          action: "Added new chapter on Graph Theory",
          timestamp: "1 day ago",
          icon: Plus,
        },
        {
          id: 4,
          type: "backup",
          book: "Mathematics for Class 10",
          action: "Automatic backup completed",
          timestamp: "2 days ago",
          icon: Archive,
        },
        {
          id: 5,
          type: "review",
          book: "Physics Fundamentals",
          action: "Received 5-star review from Dr. Smith",
          timestamp: "3 days ago",
          icon: Star,
        },
      ].flat();

      setBooks(sampleBooks);
      setActivity(sampleActivity);
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  // Calculate dashboard statistics
  const dashboardStats = useMemo(() => {
    const totalBooks = books.length;
    const completedBooks = books.filter((book) => book.status === "completed").length;
    const draftBooks = books.filter((book) => book.status === "draft").length;
    const reviewBooks = books.filter((book) => book.status === "review").length;
    const totalWords = books.reduce((sum, book) => sum + book.wordCount, 0);
    const totalChapters = books.reduce((sum, book) => sum + book.chapters, 0);
    const averageRating =
      books.length > 0
        ? books.reduce((sum, book) => sum + book.rating, 0) / books.length
        : 0;
    const totalDownloads = books.reduce((sum, book) => sum + book.downloadCount, 0);
    const totalBookmarks = books.reduce((sum, book) => sum + book.bookmarkCount, 0);
    const totalShares = books.reduce((sum, book) => sum + book.shareCount, 0);
    const completionRate = totalBooks > 0 ? (completedBooks / totalBooks) * 100 : 0;

    return {
      totalBooks,
      completedBooks,
      draftBooks,
      reviewBooks,
      totalWords,
      totalChapters,
      averageRating,
      totalDownloads,
      totalBookmarks,
      totalShares,
      completionRate,
    };
  }, [books]);

  const statusConfig = {
    draft: { label: "Draft", color: "bg-yellow-100 text-yellow-800", icon: Edit3 },
    completed: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle },
    review: { label: "In Review", color: "bg-purple-100 text-purple-800", icon: Eye },
    planning: { label: "Planning", color: "bg-gray-100 text-gray-800", icon: Target },
  };

  const visibilityConfig = {
    private: { label: "Private", color: "text-gray-600", icon: "🔒" },
    shared: { label: "Shared", color: "text-blue-600", icon: "👥" },
    public: { label: "Public", color: "text-green-600", icon: "🌍" },
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage your textbooks and track progress
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 🔁 REPLACED BUTTON WITH SIDEBAR-STYLE LINK */}
            <Link
              href="/create-book"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Book</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {dashboardStats.totalBooks}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Book className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+12%</span>
                <span className="ml-1">from last month</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Words</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatNumber(dashboardStats.totalWords)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <span>{dashboardStats.totalChapters} chapters total</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {dashboardStats.averageRating.toFixed(1)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <span>{formatNumber(dashboardStats.totalDownloads)} downloads</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {dashboardStats.completionRate.toFixed(0)}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${dashboardStats.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Books */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Books</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div
                      className="w-12 h-16 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ background: book.coverColor }}
                    >
                      <Book className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {book.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[book.status].color}`}
                          >
                            {statusConfig[book.status].label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {visibilityConfig[book.visibility].icon}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {book.subtitle}
                      </p>
                      <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          {formatNumber(book.wordCount)} words
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {book.chapters} chapters
                        </span>
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          {book.rating}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${book.completionProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit3 className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {activity.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={item.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <IconComponent className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{item.action}</p>
                        <p className="text-xs text-gray-500 truncate">{item.book}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.timestamp}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Status Overview</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {dashboardStats.completedBooks}
                </h3>
                <p className="text-sm text-gray-600">Completed Books</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Edit3 className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {dashboardStats.draftBooks}
                </h3>
                <p className="text-sm text-gray-600">Draft Books</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {dashboardStats.reviewBooks}
                </h3>
                <p className="text-sm text-gray-600">Under Review</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
