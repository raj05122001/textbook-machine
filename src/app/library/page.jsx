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
  Globe,
  Lock,
  Unlock,
  FolderOpen,
  FileText,
  Image,
  Video,
  Database,
  HardDrive,
  Cloud,
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
  Flag
} from 'lucide-react';

// Enhanced sample data for library
const sampleLibraryData = {
  stats: {
    totalBooks: 247,
    totalAuthors: 89,
    totalCategories: 12,
    totalDownloads: 15420,
    totalViews: 89340,
    averageRating: 4.7,
    thisMonth: {
      newBooks: 23,
      downloads: 2830,
      views: 12450
    }
  },
  categories: [
    { id: 'computer-science', name: 'Computer Science', count: 45, icon: '💻', color: 'bg-blue-100 text-blue-800' },
    { id: 'data-science', name: 'Data Science', count: 38, icon: '📊', color: 'bg-emerald-100 text-emerald-800' },
    { id: 'mathematics', name: 'Mathematics', count: 32, icon: '🔢', color: 'bg-purple-100 text-purple-800' },
    { id: 'physics', name: 'Physics', count: 28, icon: '⚛️', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'engineering', name: 'Engineering', count: 25, icon: '⚙️', color: 'bg-orange-100 text-orange-800' },
    { id: 'business', name: 'Business', count: 22, icon: '💼', color: 'bg-gray-100 text-gray-800' },
    { id: 'biology', name: 'Biology', count: 18, icon: '🧬', color: 'bg-green-100 text-green-800' },
    { id: 'chemistry', name: 'Chemistry', count: 15, icon: '🧪', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'psychology', name: 'Psychology', count: 12, icon: '🧠', color: 'bg-pink-100 text-pink-800' },
    { id: 'literature', name: 'Literature', count: 8, icon: '📚', color: 'bg-red-100 text-red-800' },
    { id: 'history', name: 'History', count: 6, icon: '🏛️', color: 'bg-amber-100 text-amber-800' },
    { id: 'philosophy', name: 'Philosophy', count: 4, icon: '🤔', color: 'bg-slate-100 text-slate-800' }
  ],
  books: [
    {
      id: 'advanced-ml-techniques',
      title: 'Advanced Machine Learning Techniques',
      subtitle: 'Deep Learning, Neural Networks, and Beyond',
      author: 'Dr. Emily Chen',
      coAuthors: ['Prof. Michael Rodriguez', 'Dr. Sarah Kim'],
      category: 'data-science',
      difficulty: 'advanced',
      language: 'English',
      pages: 456,
      chapters: 12,
      estimatedReadTime: '15 hours',
      publishedDate: '2024-08-15',
      lastUpdated: '2024-08-18',
      version: '2.1.0',
      isbn: '978-0-123456-78-9',
      publisher: 'TechBooks Publishing',
      rating: 4.8,
      reviews: 234,
      downloads: 5420,
      views: 18750,
      bookmarks: 892,
      likes: 1245,
      status: 'published',
      visibility: 'public',
      premium: false,
      tags: ['machine learning', 'deep learning', 'neural networks', 'ai', 'python', 'tensorflow'],
      description: 'Comprehensive guide to advanced machine learning techniques including deep learning architectures, optimization methods, and real-world applications. Features hands-on examples with Python and TensorFlow.',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=400&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=800&fit=crop',
      formats: ['PDF', 'EPUB', 'MOBI', 'HTML'],
      fileSize: '12.5 MB',
      tableOfContents: [
        'Introduction to Advanced ML',
        'Neural Network Fundamentals',
        'Deep Learning Architectures',
        'Convolutional Neural Networks',
        'Recurrent Neural Networks',
        'Transformer Models',
        'Optimization Techniques',
        'Regularization Methods',
        'Transfer Learning',
        'Generative Models',
        'Reinforcement Learning',
        'Real-world Applications'
      ],
      prerequisites: ['Basic Machine Learning', 'Python Programming', 'Linear Algebra'],
      learningOutcomes: [
        'Master advanced neural network architectures',
        'Implement deep learning models from scratch',
        'Apply optimization and regularization techniques',
        'Build end-to-end ML applications'
      ],
      awards: ['Best Technical Book 2024', 'Editor\'s Choice'],
      citations: 45,
      featured: true,
      trending: true
    },
    {
      id: 'quantum-computing-intro',
      title: 'Introduction to Quantum Computing',
      subtitle: 'Principles, Algorithms, and Applications',
      author: 'Prof. David Wilson',
      coAuthors: ['Dr. Lisa Zhang'],
      category: 'physics',
      difficulty: 'intermediate',
      language: 'English',
      pages: 324,
      chapters: 10,
      estimatedReadTime: '11 hours',
      publishedDate: '2024-07-22',
      lastUpdated: '2024-08-10',
      version: '1.3.0',
      isbn: '978-0-987654-32-1',
      publisher: 'Quantum Press',
      rating: 4.6,
      reviews: 156,
      downloads: 3280,
      views: 12430,
      bookmarks: 567,
      likes: 823,
      status: 'published',
      visibility: 'public',
      premium: true,
      tags: ['quantum computing', 'physics', 'algorithms', 'qubits', 'quantum mechanics'],
      description: 'Accessible introduction to quantum computing covering fundamental principles, key algorithms, and practical applications. Perfect for students and professionals entering the quantum era.',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=400&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=800&fit=crop',
      formats: ['PDF', 'EPUB', 'Interactive'],
      fileSize: '8.7 MB',
      tableOfContents: [
        'Quantum Mechanics Basics',
        'Qubits and Quantum States',
        'Quantum Gates and Circuits',
        'Quantum Algorithms',
        'Shor\'s Algorithm',
        'Grover\'s Algorithm',
        'Quantum Error Correction',
        'Quantum Hardware',
        'Programming Quantum Computers',
        'Future Applications'
      ],
      prerequisites: ['Linear Algebra', 'Basic Physics'],
      learningOutcomes: [
        'Understand quantum computing principles',
        'Implement basic quantum algorithms',
        'Work with quantum programming languages',
        'Evaluate quantum computing applications'
      ],
      featured: false,
      trending: true
    },
    {
      id: 'web-development-complete',
      title: 'Complete Web Development Guide',
      subtitle: 'From Frontend to Backend with Modern Technologies',
      author: 'Alex Rodriguez',
      coAuthors: ['Jessica Park', 'Tom Anderson'],
      category: 'computer-science',
      difficulty: 'beginner',
      language: 'English',
      pages: 578,
      chapters: 16,
      estimatedReadTime: '20 hours',
      publishedDate: '2024-06-10',
      lastUpdated: '2024-08-05',
      version: '3.2.1',
      isbn: '978-0-456789-01-2',
      publisher: 'WebTech Publications',
      rating: 4.9,
      reviews: 445,
      downloads: 8930,
      views: 34560,
      bookmarks: 1234,
      likes: 1876,
      status: 'published',
      visibility: 'public',
      premium: false,
      tags: ['web development', 'javascript', 'react', 'node.js', 'html', 'css', 'full-stack'],
      description: 'The ultimate guide to modern web development covering everything from HTML/CSS basics to advanced React applications and backend development with Node.js.',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=400&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=800&fit=crop',
      formats: ['PDF', 'EPUB', 'Interactive', 'Video'],
      fileSize: '25.3 MB',
      tableOfContents: [
        'HTML Fundamentals',
        'CSS Styling',
        'JavaScript Basics',
        'DOM Manipulation',
        'Responsive Design',
        'Version Control with Git',
        'React Fundamentals',
        'State Management',
        'API Integration',
        'Node.js Backend',
        'Database Integration',
        'Authentication',
        'Testing',
        'Deployment',
        'Performance Optimization',
        'Best Practices'
      ],
      prerequisites: ['Basic Computer Skills'],
      learningOutcomes: [
        'Build responsive web applications',
        'Master React and modern JavaScript',
        'Develop full-stack applications',
        'Deploy applications to production'
      ],
      featured: true,
      trending: false
    },
    {
      id: 'data-structures-algorithms',
      title: 'Data Structures and Algorithms',
      subtitle: 'Comprehensive Guide with Python Implementation',
      author: 'Dr. Maria Santos',
      category: 'computer-science',
      difficulty: 'intermediate',
      language: 'English',
      pages: 425,
      chapters: 14,
      estimatedReadTime: '14 hours',
      publishedDate: '2024-05-18',
      lastUpdated: '2024-07-30',
      version: '2.0.0',
      isbn: '978-0-234567-89-0',
      publisher: 'Algorithm Press',
      rating: 4.7,
      reviews: 312,
      downloads: 6450,
      views: 23890,
      bookmarks: 789,
      likes: 1123,
      status: 'published',
      visibility: 'public',
      premium: false,
      tags: ['data structures', 'algorithms', 'python', 'computer science', 'programming'],
      description: 'Essential data structures and algorithms every programmer should know, with clear explanations and Python implementations. Perfect for interviews and academic study.',
      thumbnail: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=300&h=400&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&h=800&fit=crop',
      formats: ['PDF', 'EPUB', 'MOBI'],
      fileSize: '15.8 MB',
      featured: false,
      trending: false
    },
    {
      id: 'ai-ethics-society',
      title: 'AI Ethics and Society',
      subtitle: 'Responsible Development in the Digital Age',
      author: 'Dr. Robert Kim',
      coAuthors: ['Prof. Anna Mueller'],
      category: 'computer-science',
      difficulty: 'advanced',
      language: 'English',
      pages: 298,
      chapters: 9,
      estimatedReadTime: '10 hours',
      publishedDate: '2024-04-12',
      lastUpdated: '2024-06-22',
      version: '1.5.0',
      isbn: '978-0-345678-90-1',
      publisher: 'Ethics Publishing',
      rating: 4.5,
      reviews: 198,
      downloads: 4120,
      views: 15670,
      bookmarks: 456,
      likes: 734,
      status: 'published',
      visibility: 'public',
      premium: true,
      tags: ['ai ethics', 'artificial intelligence', 'society', 'philosophy', 'technology'],
      description: 'Critical examination of ethical issues in AI development and deployment, exploring bias, fairness, transparency, and the societal impact of artificial intelligence.',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=400&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=800&fit=crop',
      formats: ['PDF', 'EPUB'],
      fileSize: '9.2 MB',
      featured: false,
      trending: false
    },
    {
      id: 'mobile-ui-design',
      title: 'Mobile UI/UX Design Principles',
      subtitle: 'Creating Intuitive Mobile Experiences',
      author: 'Jessica Kim',
      category: 'computer-science',
      difficulty: 'intermediate',
      language: 'English',
      pages: 189,
      chapters: 8,
      estimatedReadTime: '6 hours',
      publishedDate: '2024-03-08',
      lastUpdated: '2024-05-15',
      version: '1.2.0',
      isbn: '978-0-567890-12-3',
      publisher: 'Design Books Inc',
      rating: 4.4,
      reviews: 167,
      downloads: 3890,
      views: 14230,
      bookmarks: 567,
      likes: 678,
      status: 'published',
      visibility: 'public',
      premium: false,
      tags: ['ui design', 'ux design', 'mobile', 'app design', 'user interface'],
      description: 'Comprehensive guide to mobile UI/UX design covering design principles, user research, prototyping, and best practices for creating engaging mobile applications.',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=400&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=800&fit=crop',
      formats: ['PDF', 'Interactive'],
      fileSize: '18.5 MB',
      featured: false,
      trending: false
    }
  ],
  collections: [
    {
      id: 'featured-books',
      name: 'Featured Books',
      description: 'Editor\'s picks and award-winning textbooks',
      bookIds: ['advanced-ml-techniques', 'web-development-complete'],
      icon: '⭐',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'trending-now',
      name: 'Trending Now',
      description: 'Most popular books this month',
      bookIds: ['advanced-ml-techniques', 'quantum-computing-intro'],
      icon: '🔥',
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 'new-releases',
      name: 'New Releases',
      description: 'Recently published books',
      bookIds: ['advanced-ml-techniques', 'quantum-computing-intro', 'web-development-complete'],
      icon: '🆕',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'most-downloaded',
      name: 'Most Downloaded',
      description: 'Popular downloads of all time',
      bookIds: ['web-development-complete', 'data-structures-algorithms', 'advanced-ml-techniques'],
      icon: '📈',
      color: 'bg-blue-100 text-blue-800'
    }
  ]
};

const difficultyConfig = {
  beginner: { label: 'Beginner', color: 'text-green-600', dots: 1 },
  intermediate: { label: 'Intermediate', color: 'text-yellow-600', dots: 2 },
  advanced: { label: 'Advanced', color: 'text-red-600', dots: 3 }
};

const sortOptions = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'publishedDate', label: 'Published Date' },
  { key: 'rating', label: 'Rating' },
  { key: 'downloads', label: 'Downloads' },
  { key: 'views', label: 'Views' }
];

const LibraryMainPage = () => {
  const router = useRouter();
  
  // Core state
  const [libraryData, setLibraryData] = useState(sampleLibraryData);
  const [filteredBooks, setFilteredBooks] = useState(sampleLibraryData.books);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;
  
  // Refs
  const dropdownRef = useRef(null);

  // Filter and search books
  useEffect(() => {
    let filtered = libraryData.books.filter(book => {
      // Search filter
      const searchMatch = searchQuery === '' || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Category filter
      const categoryMatch = selectedCategory === 'all' || book.category === selectedCategory;
      
      // Difficulty filter
      const difficultyMatch = selectedDifficulty === 'all' || book.difficulty === selectedDifficulty;
      
      // Language filter
      const languageMatch = selectedLanguage === 'all' || book.language === selectedLanguage;
      
      // Premium filter
      const premiumMatch = !showPremiumOnly || book.premium;
      
      // Featured filter
      const featuredMatch = !showFeaturedOnly || book.featured;
      
      return searchMatch && categoryMatch && difficultyMatch && languageMatch && premiumMatch && featuredMatch;
    });

    // Sort books
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'publishedDate') {
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
  }, [libraryData.books, searchQuery, selectedCategory, selectedDifficulty, selectedLanguage, showPremiumOnly, showFeaturedOnly, sortBy, sortOrder]);

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
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Action handlers
  const handleBookView = (bookId) => {
    router.push(`/books/${bookId}`);
  };

  const handleBookDownload = (bookId, format = 'PDF') => {
    const book = libraryData.books.find(b => b.id === bookId);
    if (book) {
      // Update download count
      setLibraryData(prev => ({
        ...prev,
        books: prev.books.map(b => 
          b.id === bookId ? { ...b, downloads: b.downloads + 1 } : b
        )
      }));
      
      // Trigger download (in real app, this would download the file)
      console.log(`Downloading ${book.title} as ${format}`);
    }
  };

  const handleBookmark = (bookId) => {
    setLibraryData(prev => ({
      ...prev,
      books: prev.books.map(book => 
        book.id === bookId 
          ? { ...book, bookmarks: book.bookmarks + 1 }
          : book
      )
    }));
  };

  const handleLike = (bookId) => {
    setLibraryData(prev => ({
      ...prev,
      books: prev.books.map(book => 
        book.id === bookId 
          ? { ...book, likes: book.likes + 1 }
          : book
      )
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedLanguage('all');
    setShowPremiumOnly(false);
    setShowFeaturedOnly(false);
    setSortBy('relevance');
    setSortOrder('desc');
  };

  const toggleBookSelection = (bookId) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-2 rounded-lg">
                  <Library className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Book Library</h1>
                  <p className="text-sm text-gray-500">Discover and access educational content</p>
                </div>
              </div>
            </div>

            {/* Center section - Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books, authors, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Advanced Search"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-3">
              <Link 
                href="/create-book"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create Book</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Advanced Search Panel */}
      {showAdvancedSearch && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Categories</option>
                  {libraryData.categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Languages</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>

              <div className="flex items-end space-x-2">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowAdvancedSearch(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{libraryData.stats.totalBooks}</p>
                <p className="text-xs text-green-600">+{libraryData.stats.thisMonth.newBooks} this month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(libraryData.stats.totalDownloads)}</p>
                <p className="text-xs text-green-600">+{formatNumber(libraryData.stats.thisMonth.downloads)} this month</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Download className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(libraryData.stats.totalViews)}</p>
                <p className="text-xs text-green-600">+{formatNumber(libraryData.stats.thisMonth.views)} this month</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{libraryData.stats.averageRating}</p>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-3 w-3 ${star <= Math.floor(libraryData.stats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Browse by Category</h2>
            <Link href="/library/categories" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              View All Categories
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {libraryData.categories.slice(0, 6).map((category) => (
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

        {/* Featured Collections */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Collections</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {libraryData.collections.map((collection) => (
              <div key={collection.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${collection.color}`}>
                    <span className="text-lg">{collection.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{collection.name}</h3>
                    <p className="text-sm text-gray-500">{collection.bookIds.length} books</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{collection.description}</p>
                <button 
                  onClick={() => {
                    const collectionBookIds = collection.bookIds;
                    setFilteredBooks(libraryData.books.filter(book => collectionBookIds.includes(book.id)));
                  }}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  Explore Collection →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex items-center justify-between mb-6">
          {/* Left - Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
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
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    showFeaturedOnly
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ⭐ Featured
                </button>
                <button
                  onClick={() => setShowPremiumOnly(!showPremiumOnly)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    showPremiumOnly
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  👑 Premium
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || selectedLanguage !== 'all' || searchQuery) && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {libraryData.categories.find(c => c.id === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:text-blue-900">×</button>
                  </span>
                )}
                {selectedDifficulty !== 'all' && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {selectedDifficulty}
                    <button onClick={() => setSelectedDifficulty('all')} className="ml-1 hover:text-green-900">×</button>
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
            {/* Results Count */}
            <span className="text-sm text-gray-600">
              {filteredBooks.length} books found
            </span>

            {/* Sort */}
            <div className="relative" ref={dropdownRef}>
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                <input
                  type="text"
                  placeholder="Search authors..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Published Year</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="all">All Years</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="older">Older</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="all">All Formats</option>
                  <option value="PDF">PDF</option>
                  <option value="EPUB">EPUB</option>
                  <option value="MOBI">MOBI</option>
                  <option value="Interactive">Interactive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Count</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="all">Any Length</option>
                  <option value="short">&lt; 200 pages</option>
                  <option value="medium">200-400 pages</option>
                  <option value="long">&gt; 400 pages</option>
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
              {searchQuery ? 'Try adjusting your search or filters.' : 'Check back later for new content.'}
            </p>
            <button
              onClick={clearFilters}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
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
                        {book.featured && (
                          <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                            ⭐ Featured
                          </span>
                        )}
                        {book.premium && (
                          <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                            👑 Premium
                          </span>
                        )}
                        {book.trending && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                            🔥 Trending
                          </span>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col space-y-1">
                        <button
                          onClick={() => handleBookmark(book.id)}
                          className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-sm transition-all"
                        >
                          <Bookmark className="h-4 w-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleLike(book.id)}
                          className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-sm transition-all"
                        >
                          <Heart className="h-4 w-4 text-gray-700" />
                        </button>
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
                        {book.coAuthors && book.coAuthors.length > 0 && (
                          <span className="text-xs">+{book.coAuthors.length}</span>
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

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {book.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {book.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{book.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {formatNumber(book.views)}
                        </span>
                        <span className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {formatNumber(book.downloads)}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {book.reviews}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleBookView(book.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Read
                        </button>
                        <button
                          onClick={() => handleBookDownload(book.id)}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
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
                                    console.log('View details:', book.id);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                >
                                  <Info className="h-4 w-4" />
                                  <span>View Details</span>
                                </button>
                                <button
                                  onClick={() => {
                                    navigator.share({
                                      title: book.title,
                                      text: book.description,
                                      url: window.location.href
                                    });
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                >
                                  <Share2 className="h-4 w-4" />
                                  <span>Share</span>
                                </button>
                                <button
                                  onClick={() => {
                                    console.log('Add to collection:', book.id);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                >
                                  <BookmarkPlus className="h-4 w-4" />
                                  <span>Add to Collection</span>
                                </button>
                                <button
                                  onClick={() => {
                                    console.log('Report book:', book.id);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                >
                                  <Flag className="h-4 w-4" />
                                  <span>Report</span>
                                </button>
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
                        <div className="flex-shrink-0 w-20 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg overflow-hidden">
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
                                <div className="flex space-x-1">
                                  {book.featured && <span className="text-yellow-500">⭐</span>}
                                  {book.premium && <span className="text-purple-500">👑</span>}
                                  {book.trending && <span className="text-red-500">🔥</span>}
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm mb-2 truncate">
                                {book.subtitle}
                              </p>
                              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-2">
                                <span className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  {book.author}
                                  {book.coAuthors && book.coAuthors.length > 0 && ` +${book.coAuthors.length}`}
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
                                  {formatDate(book.publishedDate)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {book.description}
                              </p>
                            </div>

                            {/* Right Section - Stats and Actions */}
                            <div className="flex items-center space-x-6 ml-4">
                              {/* Rating */}
                              <div className="text-center">
                                <div className="flex items-center space-x-1 mb-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="text-sm font-medium">{book.rating}</span>
                                </div>
                                <div className="text-xs text-gray-500">{book.reviews} reviews</div>
                              </div>

                              {/* Stats */}
                              <div className="text-center">
                                <div className="text-sm font-medium text-gray-900">{formatNumber(book.downloads)}</div>
                                <div className="text-xs text-gray-500">downloads</div>
                              </div>

                              <div className="text-center">
                                <div className="text-sm font-medium text-gray-900">{formatNumber(book.views)}</div>
                                <div className="text-xs text-gray-500">views</div>
                              </div>

                              {/* Difficulty */}
                              <div className="flex items-center space-x-1">
                                {Array.from({ length: 3 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i < difficultyConfig[book.difficulty].dots
                                        ? difficultyConfig[book.difficulty].color.replace('text-', 'bg-')
                                        : 'bg-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleBookView(book.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                  Read
                                </button>
                                <button
                                  onClick={() => handleBookDownload(book.id)}
                                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                  title="Download"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
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
                                            console.log('View details:', book.id);
                                            setActiveDropdown(null);
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                        >
                                          <Info className="h-4 w-4" />
                                          <span>View Details</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleBookmark(book.id);
                                            setActiveDropdown(null);
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                        >
                                          <Bookmark className="h-4 w-4" />
                                          <span>Bookmark</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            navigator.share({
                                              title: book.title,
                                              text: book.description,
                                              url: window.location.href
                                            });
                                            setActiveDropdown(null);
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                        >
                                          <Share2 className="h-4 w-4" />
                                          <span>Share</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            console.log('Add to collection:', book.id);
                                            setActiveDropdown(null);
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                        >
                                          <BookmarkPlus className="h-4 w-4" />
                                          <span>Add to Collection</span>
                                        </button>
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

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-2 text-gray-500">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

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
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Link 
          href="/create-book"
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg transition-colors"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>

      {/* Quick Stats Sidebar (Hidden on small screens) */}
      <div className="fixed bottom-6 left-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 hidden xl:block">
        <h3 className="font-semibold text-gray-900 mb-3">Library Stats</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Books Viewed Today</span>
            <span className="font-medium">127</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Popular Category</span>
            <span className="font-medium">Data Science</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">New This Week</span>
            <span className="font-medium">8 books</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Authors</span>
            <span className="font-medium">{libraryData.stats.totalAuthors}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">Most Downloaded Today</div>
          <div className="space-y-1">
            {libraryData.books.slice(0, 3).map((book, index) => (
              <div key={book.id} className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-400">#{index + 1}</span>
                <span className="text-xs text-gray-700 truncate">{book.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryMainPage;