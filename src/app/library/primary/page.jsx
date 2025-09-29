'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Library, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star, 
  Clock, 
  User, 
  Calendar,
  Tag,
  Eye,
  Download,
  Share2,
  Heart,
  Bookmark,
  MoreVertical,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Archive,
  RefreshCw,
  SortAsc,
  SortDesc,
  TrendingUp,
  Award,
  Users,
  Upload,
  FolderOpen,
  FileText,
  Settings,
  ChevronRight,
  ChevronDown,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  BookmarkPlus,
  ExternalLink,
  Layers,
  Target,
  Zap,
  Lightbulb,
  MessageSquare,
  ThumbsUp,
  Flag,
  PieChart,
  BarChart3,
  ArrowLeft,
  Folder,
  Move,
  HardDrive,
  CloudUpload
} from 'lucide-react';

// Sample data for Primary Library
const primaryLibraryData = {
  user: {
    id: 'user-123',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@university.edu',
    role: 'teacher',
    department: 'Computer Science',
    institution: 'Stanford University'
  },
  stats: {
    totalBooks: 45,
    myBooks: 28,
    sharedBooks: 17,
    favoriteBooks: 12,
    totalPages: 8470,
    totalWords: 1285600,
    averageRating: 4.6,
    thisMonth: {
      booksCreated: 3,
      booksModified: 8,
      pageViews: 1250
    },
    storage: {
      used: 2.8, // GB
      total: 10, // GB
      percentage: 28
    }
  },
  categories: [
    { id: 'my-textbooks', name: 'My Textbooks', count: 15, icon: '📚', color: 'bg-emerald-100 text-emerald-800' },
    { id: 'lecture-notes', name: 'Lecture Notes', count: 8, icon: '📝', color: 'bg-blue-100 text-blue-800' },
    { id: 'research-papers', name: 'Research Papers', count: 5, icon: '🔬', color: 'bg-purple-100 text-purple-800' },
    { id: 'course-materials', name: 'Course Materials', count: 12, icon: '🎓', color: 'bg-orange-100 text-orange-800' },
    { id: 'collaborations', name: 'Collaborations', count: 7, icon: '🤝', color: 'bg-pink-100 text-pink-800' },
    { id: 'drafts', name: 'Drafts', count: 6, icon: '✏️', color: 'bg-yellow-100 text-yellow-800' }
  ],
  folders: [
    {
      id: 'cs-fundamentals',
      name: 'Computer Science Fundamentals',
      type: 'folder',
      bookCount: 8,
      lastModified: '2024-08-20',
      color: 'blue',
      description: 'Core computer science curriculum materials'
    },
    {
      id: 'ai-ml-course',
      name: 'AI & Machine Learning Course',
      type: 'folder',
      bookCount: 12,
      lastModified: '2024-08-18',
      color: 'emerald',
      description: 'Complete AI/ML course materials and resources'
    },
    {
      id: 'research-projects',
      name: 'Research Projects',
      type: 'folder',
      bookCount: 5,
      lastModified: '2024-08-15',
      color: 'purple',
      description: 'Ongoing and completed research documentation'
    },
    {
      id: 'student-resources',
      name: 'Student Resources',
      type: 'folder',
      bookCount: 9,
      lastModified: '2024-08-12',
      color: 'orange',
      description: 'Study guides and supplementary materials'
    }
  ],
  books: [
    {
      id: 'advanced-algorithms-textbook',
      title: 'Advanced Algorithms and Data Structures',
      subtitle: 'Comprehensive Guide for Graduate Students',
      author: 'Dr. Sarah Chen',
      category: 'my-textbooks',
      folder: 'cs-fundamentals',
      difficulty: 'advanced',
      language: 'English',
      pages: 486,
      chapters: 15,
      estimatedReadTime: '18 hours',
      createdDate: '2024-07-15',
      lastModified: '2024-08-20',
      status: 'published',
      visibility: 'private',
      version: '3.2.0',
      rating: 4.9,
      downloads: 245,
      views: 1850,
      bookmarks: 67,
      likes: 89,
      tags: ['algorithms', 'data structures', 'computer science', 'graduate level'],
      description: 'In-depth exploration of advanced algorithmic concepts including graph algorithms, dynamic programming, and complexity analysis. Designed for graduate-level computer science students.',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=400&fit=crop',
      fileSize: '18.5 MB',
      lastAccessed: '2024-08-19',
      collaborators: ['Prof. Michael Zhang', 'Dr. Lisa Rodriguez'],
      isOwner: true,
      permissions: ['read', 'write', 'share', 'delete'],
      backup: true,
      synced: true
    },
    {
      id: 'machine-learning-basics',
      title: 'Machine Learning Fundamentals',
      subtitle: 'From Theory to Practice',
      author: 'Dr. Sarah Chen',
      category: 'my-textbooks',
      folder: 'ai-ml-course',
      difficulty: 'intermediate',
      language: 'English',
      pages: 324,
      chapters: 12,
      estimatedReadTime: '12 hours',
      createdDate: '2024-06-20',
      lastModified: '2024-08-18',
      status: 'published',
      visibility: 'shared',
      version: '2.1.0',
      rating: 4.7,
      downloads: 189,
      views: 1420,
      bookmarks: 54,
      likes: 76,
      tags: ['machine learning', 'python', 'data science', 'ai'],
      description: 'Practical introduction to machine learning concepts with hands-on Python examples and real-world applications.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=400&fit=crop',
      fileSize: '14.2 MB',
      lastAccessed: '2024-08-18',
      collaborators: ['Dr. Alex Kumar'],
      isOwner: true,
      permissions: ['read', 'write', 'share', 'delete'],
      backup: true,
      synced: true
    },
    {
      id: 'quantum-computing-research',
      title: 'Quantum Computing Applications',
      subtitle: 'Research and Development Progress',
      author: 'Dr. Sarah Chen',
      category: 'research-papers',
      folder: 'research-projects',
      difficulty: 'advanced',
      language: 'English',
      pages: 156,
      chapters: 8,
      estimatedReadTime: '6 hours',
      createdDate: '2024-05-10',
      lastModified: '2024-08-15',
      status: 'draft',
      visibility: 'private',
      version: '1.5.0',
      rating: 4.5,
      downloads: 45,
      views: 280,
      bookmarks: 12,
      likes: 18,
      tags: ['quantum computing', 'research', 'applications', 'future tech'],
      description: 'Current research findings on quantum computing applications in cryptography, optimization, and machine learning.',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=400&fit=crop',
      fileSize: '8.7 MB',
      lastAccessed: '2024-08-14',
      collaborators: ['Prof. David Wilson', 'Dr. Emma Zhang'],
      isOwner: true,
      permissions: ['read', 'write', 'share', 'delete'],
      backup: true,
      synced: false
    },
    {
      id: 'intro-programming-notes',
      title: 'Introduction to Programming',
      subtitle: 'Lecture Notes and Examples',
      author: 'Dr. Sarah Chen',
      category: 'lecture-notes',
      folder: 'cs-fundamentals',
      difficulty: 'beginner',
      language: 'English',
      pages: 198,
      chapters: 10,
      estimatedReadTime: '8 hours',
      createdDate: '2024-08-01',
      lastModified: '2024-08-12',
      status: 'completed',
      visibility: 'shared',
      version: '1.0.0',
      rating: 4.8,
      downloads: 156,
      views: 890,
      bookmarks: 34,
      likes: 42,
      tags: ['programming', 'python', 'beginner', 'lecture notes'],
      description: 'Comprehensive lecture notes for introductory programming course covering Python basics, algorithms, and problem-solving.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=400&fit=crop',
      fileSize: '12.1 MB',
      lastAccessed: '2024-08-12',
      collaborators: [],
      isOwner: true,
      permissions: ['read', 'write', 'share', 'delete'],
      backup: true,
      synced: true
    },
    {
      id: 'data-visualization-guide',
      title: 'Data Visualization Best Practices',
      subtitle: 'Creating Effective Charts and Graphs',
      author: 'Dr. Sarah Chen',
      category: 'course-materials',
      folder: 'student-resources',
      difficulty: 'intermediate',
      language: 'English',
      pages: 145,
      chapters: 7,
      estimatedReadTime: '5 hours',
      createdDate: '2024-07-28',
      lastModified: '2024-08-10',
      status: 'published',
      visibility: 'public',
      version: '1.3.0',
      rating: 4.6,
      downloads: 298,
      views: 1650,
      bookmarks: 78,
      likes: 94,
      tags: ['data visualization', 'charts', 'design', 'analytics'],
      description: 'Guide to creating effective data visualizations using modern tools and design principles.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=400&fit=crop',
      fileSize: '22.8 MB',
      lastAccessed: '2024-08-09',
      collaborators: ['Dr. Maria Santos'],
      isOwner: true,
      permissions: ['read', 'write', 'share', 'delete'],
      backup: true,
      synced: true
    },
    {
      id: 'web-security-handbook',
      title: 'Web Application Security Handbook',
      subtitle: 'Protecting Modern Web Applications',
      author: 'Dr. Sarah Chen',
      category: 'collaborations',
      folder: 'research-projects',
      difficulty: 'advanced',
      language: 'English',
      pages: 267,
      chapters: 11,
      estimatedReadTime: '10 hours',
      createdDate: '2024-06-15',
      lastModified: '2024-08-08',
      status: 'review',
      visibility: 'shared',
      version: '2.0.0',
      rating: 4.4,
      downloads: 134,
      views: 785,
      bookmarks: 45,
      likes: 58,
      tags: ['web security', 'cybersecurity', 'applications', 'best practices'],
      description: 'Comprehensive guide to securing web applications against common vulnerabilities and attacks.',
      thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=400&fit=crop',
      fileSize: '16.3 MB',
      lastAccessed: '2024-08-07',
      collaborators: ['Dr. James Wilson', 'Prof. Anna Mueller', 'Dr. Tom Anderson'],
      isOwner: false,
      permissions: ['read', 'write', 'share'],
      backup: true,
      synced: true
    }
  ],
  recentActivity: [
    {
      id: 1,
      type: 'edit',
      book: 'Advanced Algorithms and Data Structures',
      action: 'Modified Chapter 12: Graph Algorithms',
      timestamp: '2 hours ago',
      icon: Edit3
    },
    {
      id: 2,
      type: 'share',
      book: 'Machine Learning Fundamentals',
      action: 'Shared with CS 229 students',
      timestamp: '1 day ago',
      icon: Share2
    },
    {
      id: 3,
      type: 'create',
      book: 'Data Visualization Guide',
      action: 'Added new chapter on interactive charts',
      timestamp: '3 days ago',
      icon: Plus
    },
    {
      id: 4,
      type: 'backup',
      book: 'Quantum Computing Research',
      action: 'Automatic backup completed',
      timestamp: '1 week ago',
      icon: Archive
    }
  ]
};

const difficultyConfig = {
  beginner: { label: 'Beginner', color: 'text-green-600', dots: 1 },
  intermediate: { label: 'Intermediate', color: 'text-yellow-600', dots: 2 },
  advanced: { label: 'Advanced', color: 'text-red-600', dots: 3 }
};

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: Edit3 },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  published: { label: 'Published', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  review: { label: 'In Review', color: 'bg-yellow-100 text-yellow-800', icon: Eye }
};

const visibilityConfig = {
  private: { label: 'Private', color: 'text-gray-600', icon: '🔒' },
  shared: { label: 'Shared', color: 'text-blue-600', icon: '👥' },
  public: { label: 'Public', color: 'text-green-600', icon: '🌐' }
};

const sortOptions = [
  { key: 'lastModified', label: 'Last Modified' },
  { key: 'title', label: 'Title' },
  { key: 'createdDate', label: 'Created Date' },
  { key: 'views', label: 'Views' },
  { key: 'rating', label: 'Rating' }
];

const PrimaryLibraryPage = () => {
  const router = useRouter();
  
  // Core state
  const [libraryData, setLibraryData] = useState(primaryLibraryData);
  const [filteredBooks, setFilteredBooks] = useState(primaryLibraryData.books);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'folder'
  const [currentView, setCurrentView] = useState('all'); // 'all' | 'folders' | folder-id
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVisibility, setSelectedVisibility] = useState('all');
  const [showMyBooksOnly, setShowMyBooksOnly] = useState(false);
  const [sortBy, setSortBy] = useState('lastModified');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;
  
  // Refs
  const dropdownRef = useRef(null);

  // Filter and search books
  useEffect(() => {
    let filtered = libraryData.books;

    // Filter by current view
    if (currentView !== 'all' && currentView !== 'folders') {
      filtered = filtered.filter(book => book.folder === currentView);
    }

    // Apply other filters
    filtered = filtered.filter(book => {
      const searchMatch = searchQuery === '' || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const categoryMatch = selectedCategory === 'all' || book.category === selectedCategory;
      const folderMatch = selectedFolder === 'all' || book.folder === selectedFolder;
      const statusMatch = selectedStatus === 'all' || book.status === selectedStatus;
      const visibilityMatch = selectedVisibility === 'all' || book.visibility === selectedVisibility;
      const ownerMatch = !showMyBooksOnly || book.isOwner;
      
      return searchMatch && categoryMatch && folderMatch && statusMatch && visibilityMatch && ownerMatch;
    });

    // Sort books
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'lastModified' || sortBy === 'createdDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredBooks(filtered);
    setCurrentPage(1);
  }, [libraryData.books, currentView, searchQuery, selectedCategory, selectedFolder, selectedStatus, selectedVisibility, showMyBooksOnly, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setShowCreateOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Action handlers
  const handleBookView = (bookId) => {
    router.push(`/books/${bookId}`);
  };

  const handleBookEdit = (bookId) => {
    router.push(`/editor/${bookId}`);
  };

  const handleBookDownload = (bookId, format = 'PDF') => {
    const book = libraryData.books.find(b => b.id === bookId);
    if (book) {
      console.log(`Downloading ${book.title} as ${format}`);
      // In real app, trigger download
    }
  };

  const handleBookDelete = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setLibraryData(prev => ({
        ...prev,
        books: prev.books.filter(b => b.id !== bookId)
      }));
    }
  };

  const handleFolderView = (folderId) => {
    setCurrentView(folderId);
    setSelectedFolder(folderId);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFolder('all');
    setSelectedStatus('all');
    setSelectedVisibility('all');
    setShowMyBooksOnly(false);
    setSortBy('lastModified');
    setSortOrder('desc');
    setCurrentView('all');
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (mb) => {
    if (mb >= 1024) return (mb / 1024).toFixed(1) + ' GB';
    return mb + ' MB';
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Books Created</p>
                <p className="text-2xl font-bold text-gray-900">{libraryData.stats.myBooks}</p>
<p className="text-xs text-green-600">+{libraryData.stats.thisMonth.booksCreated} this month</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shared Books</p>
                <p className="text-2xl font-bold text-gray-900">{libraryData.stats.sharedBooks}</p>
                <p className="text-xs text-blue-600">Collaborative work</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(libraryData.stats.thisMonth.pageViews)}</p>
                <p className="text-xs text-purple-600">This month</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Favorites</p>
                <p className="text-2xl font-bold text-gray-900">{libraryData.stats.favoriteBooks}</p>
                <p className="text-xs text-yellow-600">Bookmarked</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Categories & Folders */}
        {currentView === 'all' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Browse by Category</h2>
              <button
                onClick={() => setCurrentView('folders')}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                View Folders
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {libraryData.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-all hover:border-emerald-300 hover:shadow-md ${
                    selectedCategory === category.id 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.count} books</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Folders View */}
        {currentView === 'folders' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Folders</h2>
              <button
                onClick={() => setCurrentView('all')}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                View All Books
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraryData.folders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => handleFolderView(folder.id)}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-3 rounded-lg bg-${folder.color}-100`}>
                      <FolderOpen className={`h-6 w-6 text-${folder.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {folder.name}
                      </h3>
                      <p className="text-sm text-gray-500">{folder.bookCount} books</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{folder.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Modified {formatDate(folder.lastModified)}</span>
                    <ChevronRight className="h-4 w-4 group-hover:text-emerald-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Breadcrumb for folder views */}
        {currentView !== 'all' && currentView !== 'folders' && (
          <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600">
            <button onClick={() => setCurrentView('all')} className="hover:text-emerald-600">
              Library
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-gray-900">
              {libraryData.folders.find(f => f.id === currentView)?.name}
            </span>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="flex items-center justify-between mb-6">
          {/* Left - Filters */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                showFilters 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>

            {/* Quick Filters */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowMyBooksOnly(!showMyBooksOnly)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  showMyBooksOnly
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📚 My Books Only
              </button>
              <button
                onClick={() => setSelectedStatus('draft')}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedStatus === 'draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ✏️ Drafts
              </button>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'all' || selectedStatus !== 'all' || selectedVisibility !== 'all' || searchQuery) && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {libraryData.categories.find(c => c.id === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:text-blue-900">×</button>
                  </span>
                )}
                {selectedStatus !== 'all' && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {statusConfig[selectedStatus]?.label}
                    <button onClick={() => setSelectedStatus('all')} className="ml-1 hover:text-green-900">×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-gray-900">×</button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-xs text-red-600 hover:text-red-700">
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Right - View and Sort Controls */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {filteredBooks.length} books
            </span>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <span className="text-sm">Sort: {sortOptions.find(opt => opt.key === sortBy)?.label}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {activeDropdown === 'sort' && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    {sortOptions.map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSortBy(key);
                          setActiveDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          sortBy === key ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 flex items-center space-x-2"
                    >
                      {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                      <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* View Mode */}
            <div className="flex items-center bg-white border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Extended Filters Panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Status</option>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <option key={status} value={status}>{config.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                <select
                  value={selectedVisibility}
                  onChange={(e) => setSelectedVisibility(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Visibility</option>
                  {Object.entries(visibilityConfig).map(([visibility, config]) => (
                    <option key={visibility} value={visibility}>{config.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Folder</label>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Folders</option>
                  {libraryData.folders.map(folder => (
                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Books Display */}
        {currentBooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'Try adjusting your search or filters.' : 'Create your first book to get started.'}
            </p>
            <Link
              href="/create-book"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Book</span>
            </Link>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {currentBooks.map((book) => (
                viewMode === 'grid' ? (
                  // Grid View
                  <div
                    key={book.id}
                    className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    {/* Book Cover */}
                    <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-teal-600 overflow-hidden">
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[book.status].color}`}>
                          {statusConfig[book.status].label}
                        </span>
                        {book.isOwner && (
                          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                            Owner
                          </span>
                        )}
                      </div>

                      {/* Visibility & Sync Status */}
                      <div className="absolute top-3 right-3 flex flex-col space-y-1">
                        <span className={`text-lg ${visibilityConfig[book.visibility].color}`}>
                          {visibilityConfig[book.visibility].icon}
                        </span>
                        {book.synced ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>

                      {/* Rating */}
                      <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white bg-opacity-90 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium text-gray-700">{book.rating}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2 leading-tight">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {book.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {book.author}
                        </span>
                        {book.collaborators && book.collaborators.length > 0 && (
                          <span className="text-xs">+{book.collaborators.length}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span>{book.pages} pages</span>
                        <span>{book.estimatedReadTime}</span>
                        <span className="flex items-center space-x-1">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                i < difficultyConfig[book.difficulty].dots
                                  ? difficultyConfig[book.difficulty].color.replace('text-', 'bg-')
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </span>
                      </div>

                      {/* File Info */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>v{book.version}</span>
                        <span>{book.fileSize}</span>
                        <span>Modified {formatDate(book.lastModified)}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleBookView(book.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Open
                        </button>
                        {book.permissions.includes('write') && (
                          <button
                            onClick={() => handleBookEdit(book.id)}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        )}
                        <div className="relative">
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === `book-${book.id}` ? null : `book-${book.id}`)}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          
                          {activeDropdown === `book-${book.id}` && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    handleBookDownload(book.id);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                >
                                  <Download className="h-4 w-4" />
                                  <span>Download</span>
                                </button>
                                <button
                                  onClick={() => {
                                    console.log('Duplicate book:', book.id);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                >
                                  <Copy className="h-4 w-4" />
                                  <span>Duplicate</span>
                                </button>
                                <button
                                  onClick={() => {
                                    console.log('Move to folder:', book.id);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                >
                                  <Move className="h-4 w-4" />
                                  <span>Move to Folder</span>
                                </button>
                                {book.permissions.includes('share') && (
                                  <button
                                    onClick={() => {
                                      console.log('Share book:', book.id);
                                      setActiveDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                  >
                                    <Share2 className="h-4 w-4" />
                                    <span>Share</span>
                                  </button>
                                )}
                                <div className="border-t border-gray-100 my-1"></div>
                                {book.permissions.includes('delete') && (
                                  <button
                                    onClick={() => {
                                      handleBookDelete(book.id);
                                      setActiveDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div
                    key={book.id}
                    className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Book Thumbnail */}
                        <div className="flex-shrink-0 w-16 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg overflow-hidden">
                          <img
                            src={book.thumbnail}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Book Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                  {book.title}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[book.status].color}`}>
                                  {statusConfig[book.status].label}
                                </span>
                                <span className={`text-sm ${visibilityConfig[book.visibility].color}`}>
                                  {visibilityConfig[book.visibility].icon}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-2 truncate">
                                {book.subtitle}
                              </p>
                              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-2">
                                <span className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  {book.author}
                                </span>
                                <span className="flex items-center">
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  {book.pages} pages
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {book.estimatedReadTime}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Modified {formatDate(book.lastModified)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {book.description}
                              </p>
                            </div>

                            {/* Right Section - Stats and Actions */}
                            <div className="flex items-center space-x-6 ml-4">
                              {/* Stats */}
                              <div className="text-center">
                                <div className="flex items-center space-x-1 mb-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="text-sm font-medium">{book.rating}</span>
                                </div>
                                <div className="text-xs text-gray-500">v{book.version}</div>
                              </div>

                              <div className="text-center">
                                <div className="text-sm font-medium text-gray-900">{book.fileSize}</div>
                                <div className="text-xs text-gray-500">size</div>
                              </div>

                              {/* Sync Status */}
                              <div className="flex items-center">
                                {book.synced ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" title="Synced" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-yellow-500" title="Sync pending" />
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleBookView(book.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                  Open
                                </button>
                                {book.permissions.includes('write') && (
                                  <button
                                    onClick={() => handleBookEdit(book.id)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    title="Edit"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                )}
                                <div className="relative">
                                  <button
                                    onClick={() => setActiveDropdown(activeDropdown === `book-list-${book.id}` ? null : `book-list-${book.id}`)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                  
                                  {activeDropdown === `book-list-${book.id}` && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                      <div className="py-1">
                                        <button
                                          onClick={() => {
                                            handleBookDownload(book.id);
                                            setActiveDropdown(null);
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                        >
                                          <Download className="h-4 w-4" />
                                          <span>Download</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            console.log('View details:', book.id);
                                            setActiveDropdown(null);
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                        >
                                          <Info className="h-4 w-4" />
                                          <span>Details</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            console.log('Duplicate book:', book.id);
                                            setActiveDropdown(null);
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                        >
                                          <Copy className="h-4 w-4" />
                                          <span>Duplicate</span>
                                        </button>
                                        {book.permissions.includes('share') && (
                                          <button
                                            onClick={() => {
                                              console.log('Share book:', book.id);
                                              setActiveDropdown(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                          >
                                            <Share2 className="h-4 w-4" />
                                            <span>Share</span>
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mt-3">
                            {book.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {book.tags.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{book.tags.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    currentPage === 1
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg border transition-colors ${
                        currentPage === pageNum
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    currentPage === totalPages
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Recent Activity Sidebar */}
        <div className="mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                {libraryData.recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Icon className="h-4 w-4 text-emerald-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.book}</p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Stats */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <Link
                    href="/create-book"
                    className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium">Create New Book</span>
                  </Link>
                  <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Upload className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Upload Files</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <FolderOpen className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">Create Folder</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Archive className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium">Backup Library</span>
                  </button>
                </div>
              </div>

              {/* Library Health */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Library Health</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Backup Status</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">Up to date</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sync Status</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">Synced</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Storage Used</span>
                    <span className="text-sm font-medium">{libraryData.stats.storage.percentage}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Books Shared</span>
                    <span className="text-sm font-medium">{libraryData.stats.sharedBooks}</span>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">This Month</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Books Created</span>
                    <span className="text-sm font-medium">{libraryData.stats.thisMonth.booksCreated}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Books Modified</span>
                    <span className="text-sm font-medium">{libraryData.stats.thisMonth.booksModified}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Page Views</span>
                    <span className="text-sm font-medium">{formatNumber(libraryData.stats.thisMonth.pageViews)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimaryLibraryPage;

