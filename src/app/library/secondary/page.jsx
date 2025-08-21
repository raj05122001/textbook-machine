
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
  CloudUpload,
  Globe,
  Shield,
  Lock,
  Unlock,
  Building,
  GraduationCap,
  Crown,
  Verified,
  School,
  Building2,
  MapPin,
  Languages,
  Calendar as CalendarIcon,
  Download as DownloadIcon,
  Import,
  UserPlus,
  GitFork
} from 'lucide-react';

// Sample data for Secondary Library
const secondaryLibraryData = {
  stats: {
    totalBooks: 1847,
    totalAuthors: 456,
    totalInstitutions: 89,
    totalCountries: 34,
    featuredBooks: 124,
    verifiedAuthors: 234,
    monthlyDownloads: 45670,
    totalDownloads: 1250000,
    averageRating: 4.7,
    thisMonth: {
      newBooks: 78,
      newAuthors: 23,
      downloads: 45670
    }
  },
  featuredCollections: [
    {
      id: 'stanford-cs',
      name: 'Stanford Computer Science Collection',
      description: 'Premium textbooks from Stanford University CS Department',
      institution: 'Stanford University',
      curator: 'Prof. Andrew Ng',
      bookCount: 45,
      totalDownloads: 125600,
      featured: true,
      verified: true,
      tags: ['computer science', 'ai', 'algorithms', 'stanford'],
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'mit-engineering',
      name: 'MIT Engineering Fundamentals',
      description: 'Core engineering principles from MIT faculty',
      institution: 'MIT',
      curator: 'Prof. Maria Santos',
      bookCount: 38,
      totalDownloads: 98400,
      featured: true,
      verified: true,
      tags: ['engineering', 'mathematics', 'physics', 'mit'],
      thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'harvard-medicine',
      name: 'Harvard Medical School Resources',
      description: 'Medical education materials from Harvard Medical School',
      institution: 'Harvard University',
      curator: 'Dr. Sarah Johnson',
      bookCount: 52,
      totalDownloads: 87300,
      featured: true,
      verified: true,
      tags: ['medicine', 'anatomy', 'physiology', 'harvard'],
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'oxford-literature',
      name: 'Oxford Literature Archive',
      description: 'Classic and contemporary literature studies',
      institution: 'Oxford University',
      curator: 'Prof. James Wilson',
      bookCount: 67,
      totalDownloads: 76200,
      featured: true,
      verified: true,
      tags: ['literature', 'english', 'classics', 'oxford'],
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
      color: 'from-purple-500 to-purple-600'
    }
  ],
  categories: [
    { id: 'computer-science', name: 'Computer Science', count: 234, icon: '💻', color: 'bg-blue-100 text-blue-800' },
    { id: 'mathematics', name: 'Mathematics', count: 189, icon: '🔢', color: 'bg-purple-100 text-purple-800' },
    { id: 'engineering', name: 'Engineering', count: 156, icon: '⚙️', color: 'bg-orange-100 text-orange-800' },
    { id: 'medicine', name: 'Medicine', count: 143, icon: '🏥', color: 'bg-red-100 text-red-800' },
    { id: 'physics', name: 'Physics', count: 128, icon: '⚛️', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'business', name: 'Business', count: 112, icon: '💼', color: 'bg-gray-100 text-gray-800' },
    { id: 'literature', name: 'Literature', count: 98, icon: '📚', color: 'bg-green-100 text-green-800' },
    { id: 'chemistry', name: 'Chemistry', count: 87, icon: '🧪', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'biology', name: 'Biology', count: 76, icon: '🧬', color: 'bg-emerald-100 text-emerald-800' },
    { id: 'psychology', name: 'Psychology', count: 65, icon: '🧠', color: 'bg-pink-100 text-pink-800' },
    { id: 'history', name: 'History', count: 54, icon: '🏛️', color: 'bg-amber-100 text-amber-800' },
    { id: 'philosophy', name: 'Philosophy', count: 43, icon: '🤔', color: 'bg-slate-100 text-slate-800' }
  ],
  institutions: [
    { id: 'stanford', name: 'Stanford University', country: 'USA', bookCount: 89, verified: true, tier: 'premium' },
    { id: 'mit', name: 'MIT', country: 'USA', bookCount: 76, verified: true, tier: 'premium' },
    { id: 'harvard', name: 'Harvard University', country: 'USA', bookCount: 67, verified: true, tier: 'premium' },
    { id: 'oxford', name: 'Oxford University', country: 'UK', bookCount: 54, verified: true, tier: 'premium' },
    { id: 'cambridge', name: 'Cambridge University', country: 'UK', bookCount: 48, verified: true, tier: 'premium' },
    { id: 'caltech', name: 'Caltech', country: 'USA', bookCount: 43, verified: true, tier: 'premium' },
    { id: 'berkeley', name: 'UC Berkeley', country: 'USA', bookCount: 39, verified: true, tier: 'standard' },
    { id: 'princeton', name: 'Princeton University', country: 'USA', bookCount: 35, verified: true, tier: 'premium' }
  ],
  books: [
    {
      id: 'advanced-quantum-mechanics',
      title: 'Advanced Quantum Mechanics',
      subtitle: 'Modern Approaches to Quantum Field Theory',
      author: 'Prof. Richard Feynman',
      coAuthors: ['Dr. Steven Weinberg', 'Prof. Murray Gell-Mann'],
      institution: 'Caltech',
      category: 'physics',
      difficulty: 'advanced',
      language: 'English',
      pages: 678,
      chapters: 18,
      estimatedReadTime: '24 hours',
      publishedDate: '2024-07-10',
      lastUpdated: '2024-08-15',
      version: '3.1.0',
      isbn: '978-0-123456-78-9',
      rating: 4.9,
      reviews: 456,
      downloads: 12450,
      views: 34560,
      bookmarks: 1892,
      likes: 2341,
      status: 'published',
      visibility: 'public',
      verified: true,
      premium: true,
      tags: ['quantum mechanics', 'physics', 'quantum field theory', 'advanced'],
      description: 'Comprehensive exploration of advanced quantum mechanical concepts including field theory, particle physics, and modern computational approaches. Essential reading for graduate physics students.',
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=300&h=400&fit=crop',
      formats: ['PDF', 'EPUB', 'Interactive'],
      fileSize: '45.2 MB',
      doi: '10.1000/182',
      license: 'CC BY-NC-SA',
      openAccess: false,
      peerReviewed: true,
      citationCount: 234,
      researchGate: 'https://researchgate.net/publication/123456',
      awards: ['Nobel Prize Reference', 'Outstanding Physics Textbook 2024']
    },
    {
      id: 'machine-learning-theory',
      title: 'Machine Learning: Theory and Practice',
      subtitle: 'Mathematical Foundations and Real-World Applications',
      author: 'Prof. Andrew Ng',
      coAuthors: ['Dr. Yann LeCun', 'Prof. Geoffrey Hinton'],
      institution: 'Stanford University',
      category: 'computer-science',
      difficulty: 'intermediate',
      language: 'English',
      pages: 524,
      chapters: 15,
      estimatedReadTime: '18 hours',
      publishedDate: '2024-06-20',
      lastUpdated: '2024-08-10',
      version: '2.3.0',
      isbn: '978-0-987654-32-1',
      rating: 4.8,
      reviews: 823,
      downloads: 28940,
      views: 78430,
      bookmarks: 3245,
      likes: 4567,
      status: 'published',
      visibility: 'public',
      verified: true,
      premium: false,
      tags: ['machine learning', 'ai', 'algorithms', 'data science', 'python'],
      description: 'Definitive guide to machine learning combining rigorous mathematical theory with practical implementation. Covers everything from basic algorithms to deep learning and neural networks.',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=400&fit=crop',
      formats: ['PDF', 'EPUB', 'MOBI', 'Interactive'],
      fileSize: '32.7 MB',
      doi: '10.1000/183',
      license: 'CC BY',
      openAccess: true,
      peerReviewed: true,
      citationCount: 1456,
      researchGate: 'https://researchgate.net/publication/789012',
      awards: ['Best AI Textbook 2024', 'ACM Outstanding Publication']
    },
    {
      id: 'organic-chemistry-complete',
      title: 'Complete Organic Chemistry',
      subtitle: 'Mechanisms, Synthesis, and Biological Applications',
      author: 'Prof. Linus Pauling',
      coAuthors: ['Dr. Robert Woodward'],
      institution: 'Harvard University',
      category: 'chemistry',
      difficulty: 'intermediate',
      language: 'English',
      pages: 892,
      chapters: 22,
      estimatedReadTime: '28 hours',
      publishedDate: '2024-05-15',
      lastUpdated: '2024-07-30',
      version: '4.0.0',
      isbn: '978-0-456789-01-2',
      rating: 4.7,
      reviews: 667,
      downloads: 19850,
      views: 45670,
      bookmarks: 2134,
      likes: 2987,
      status: 'published',
      visibility: 'public',
      verified: true,
      premium: true,
      tags: ['organic chemistry', 'chemistry', 'synthesis', 'mechanisms'],
      description: 'Comprehensive organic chemistry textbook covering reaction mechanisms, synthetic strategies, and biological applications. Includes 3D molecular models and interactive simulations.',
      thumbnail: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=300&h=400&fit=crop',
      formats: ['PDF', 'EPUB', '3D Interactive'],
      fileSize: '67.4 MB',
      doi: '10.1000/184',
      license: 'CC BY-NC',
      openAccess: false,
      peerReviewed: true,
      citationCount: 789,
      researchGate: 'https://researchgate.net/publication/345678',
      awards: ['Chemistry Education Excellence Award']
    },
    {
      id: 'data-structures-algorithms-mit',
      title: 'Data Structures and Algorithms',
      subtitle: 'MIT Computer Science Fundamentals',
      author: 'Prof. Erik Demaine',
      coAuthors: ['Prof. Charles Leiserson', 'Prof. Ronald Rivest'],
      institution: 'MIT',
      category: 'computer-science',
      difficulty: 'intermediate',
      language: 'English',
      pages: 756,
      chapters: 20,
      estimatedReadTime: '22 hours',
      publishedDate: '2024-04-25',
      lastUpdated: '2024-07-15',
      version: '3.2.0',
      isbn: '978-0-234567-89-0',
      rating: 4.9,
      reviews: 1234,
      downloads: 45670,
      views: 123400,
      bookmarks: 5678,
      likes: 7890,
      status: 'published',
      visibility: 'public',
      verified: true,
      premium: false,
      tags: ['data structures', 'algorithms', 'computer science', 'programming'],
      description: 'MIT\'s comprehensive guide to data structures and algorithms. Features rigorous analysis, practical implementations, and problem-solving techniques used in computer science.',
      thumbnail: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=300&h=400&fit=crop',
      formats: ['PDF', 'EPUB', 'MOBI'],
      fileSize: '28.9 MB',
      doi: '10.1000/185',
      license: 'CC BY',
      openAccess: true,
      peerReviewed: true,
      citationCount: 2345,
      researchGate: 'https://researchgate.net/publication/567890',
      awards: ['ACM Textbook of the Year', 'IEEE Computer Society Award']
    },
    {
      id: 'mathematical-analysis-oxford',
      title: 'Mathematical Analysis',
      subtitle: 'Real and Complex Analysis for Advanced Students',
      author: 'Prof. Andrew Wiles',
      coAuthors: ['Prof. Timothy Gowers'],
      institution: 'Oxford University',
      category: 'mathematics',
      difficulty: 'advanced',
      language: 'English',
      pages: 634,
      chapters: 16,
      estimatedReadTime: '26 hours',
      publishedDate: '2024-03-18',
      lastUpdated: '2024-06-20',
      version: '2.1.0',
      isbn: '978-0-345678-90-1',
      rating: 4.8,
      reviews: 445,
      downloads: 15670,
      views: 28930,
      bookmarks: 1567,
      likes: 2234,
      status: 'published',
      visibility: 'public',
      verified: true,
      premium: true,
      tags: ['mathematical analysis', 'real analysis', 'complex analysis', 'mathematics'],
      description: 'Rigorous treatment of real and complex analysis from Oxford University. Covers measure theory, functional analysis, and advanced topics in mathematical analysis.',
      thumbnail: 'https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=300&h=400&fit=crop',
      formats: ['PDF', 'EPUB'],
      fileSize: '23.6 MB',
      doi: '10.1000/186',
      license: 'CC BY-NC-SA',
      openAccess: false,
      peerReviewed: true,
      citationCount: 567,
      researchGate: 'https://researchgate.net/publication/234567',
      awards: ['Royal Society Mathematics Prize']
    },
    {
      id: 'cellular-biology-harvard',
      title: 'Cellular and Molecular Biology',
      subtitle: 'From Genes to Systems',
      author: 'Prof. James Watson',
      coAuthors: ['Dr. Jennifer Doudna', 'Prof. Craig Venter'],
      institution: 'Harvard University',
      category: 'biology',
      difficulty: 'intermediate',
      language: 'English',
      pages: 598,
      chapters: 18,
      estimatedReadTime: '20 hours',
      publishedDate: '2024-02-14',
      lastUpdated: '2024-05-30',
      version: '1.4.0',
      isbn: '978-0-567890-12-3',
      rating: 4.6,
      reviews: 556,
      downloads: 22340,
      views: 56780,
      bookmarks: 2345,
      likes: 3456,
      status: 'published',
      visibility: 'public',
      verified: true,
      premium: false,
      tags: ['cell biology', 'molecular biology', 'genetics', 'biology'],
      description: 'Comprehensive introduction to cellular and molecular biology from Harvard faculty. Covers gene expression, cell signaling, and modern biotechnology applications.',
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=400&fit=crop',
      formats: ['PDF', 'EPUB', 'Interactive'],
      fileSize: '41.3 MB',
      doi: '10.1000/187',
      license: 'CC BY',
      openAccess: true,
      peerReviewed: true,
      citationCount: 890,
      researchGate: 'https://researchgate.net/publication/123789',
      awards: ['Nature Education Excellence Award']
    }
  ],
  trendingTopics: [
    { name: 'Artificial Intelligence', growth: '+245%', books: 156 },
    { name: 'Quantum Computing', growth: '+189%', books: 67 },
    { name: 'Biotechnology', growth: '+134%', books: 89 },
    { name: 'Climate Science', growth: '+98%', books: 45 },
    { name: 'Data Science', growth: '+87%', books: 234 }
  ]
};

const difficultyConfig = {
  beginner: { label: 'Beginner', color: 'text-green-600', dots: 1 },
  intermediate: { label: 'Intermediate', color: 'text-yellow-600', dots: 2 },
  advanced: { label: 'Advanced', color: 'text-red-600', dots: 3 }
};

const institutionTiers = {
  premium: { label: 'Premium', color: 'text-purple-600', icon: Crown },
  standard: { label: 'Standard', color: 'text-blue-600', icon: School },
  community: { label: 'Community', color: 'text-green-600', icon: Users }
};

const sortOptions = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'downloads', label: 'Most Downloaded' },
  { key: 'rating', label: 'Highest Rated' },
  { key: 'publishedDate', label: 'Recently Published' },
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'citationCount', label: 'Most Cited' }
];

const SecondaryLibraryPage = () => {
  const router = useRouter();
  
  // Core state
  const [libraryData, setLibraryData] = useState(secondaryLibraryData);
  const [filteredBooks, setFilteredBooks] = useState(secondaryLibraryData.books);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentView, setCurrentView] = useState('featured'); // 'featured' | 'all' | 'categories' | 'institutions'
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [showOpenAccessOnly, setShowOpenAccessOnly] = useState(false);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
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
      const searchMatch = searchQuery === '' || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const categoryMatch = selectedCategory === 'all' || book.category === selectedCategory;
      const institutionMatch = selectedInstitution === 'all' || book.institution.toLowerCase().includes(selectedInstitution.toLowerCase());
      const difficultyMatch = selectedDifficulty === 'all' || book.difficulty === selectedDifficulty;
      const languageMatch = selectedLanguage === 'all' || book.language === selectedLanguage;
      const premiumMatch = !showPremiumOnly || book.premium;
      const openAccessMatch = !showOpenAccessOnly || book.openAccess;
      const verifiedMatch = !showVerifiedOnly || book.verified;
      
      return searchMatch && categoryMatch && institutionMatch && difficultyMatch && 
             languageMatch && premiumMatch && openAccessMatch && verifiedMatch;
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
  }, [libraryData.books, searchQuery, selectedCategory, selectedInstitution, selectedDifficulty, 
      selectedLanguage, showPremiumOnly, showOpenAccessOnly, showVerifiedOnly, sortBy, sortOrder]);

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
      
      console.log(`Downloading ${book.title} as ${format}`);
    }
  };

  const handleImportToPrimary = (bookId) => {
    const book = libraryData.books.find(b => b.id === bookId);
    if (book) {
      console.log(`Importing ${book.title} to Primary Library`);
      // In real app, this would copy the book to user's primary library
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

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedInstitution('all');
    setSelectedDifficulty('all');
    setSelectedLanguage('all');
    setShowPremiumOnly(false);
    setShowOpenAccessOnly(false);
    setShowVerifiedOnly(false);
    setSortBy('relevance');
    setSortOrder('desc');
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
              <Link href="/library" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Secondary Library</h1>
                  <p className="text-sm text-gray-500">Shared knowledge • {libraryData.stats.totalBooks.toLocaleString()} books</p>
                </div>
              </div>
            </div>

            {/* Center section - Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search global library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                href="/library/primary"
                className="text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg border border-blue-300 hover:bg-blue-50 transition-colors"
              >
                My Library
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <select
                  value={selectedInstitution}
                  onChange={(e) => setSelectedInstitution(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Institutions</option>
                  {libraryData.institutions.map(institution => (
                    <option key={institution.id} value={institution.name}>
                      {institution.name} ({institution.bookCount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Global Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{libraryData.stats.totalBooks.toLocaleString()}</p>
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
                <p className="text-sm text-gray-600">Institutions</p>
                <p className="text-2xl font-bold text-gray-900">{libraryData.stats.totalInstitutions}</p>
                <p className="text-xs text-blue-600">{libraryData.stats.totalCountries} countries</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(libraryData.stats.monthlyDownloads)}</p>
                <p className="text-xs text-emerald-600">{formatNumber(libraryData.stats.totalDownloads)} total</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Download className="h-6 w-6 text-emerald-600" />
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

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 mb-8 bg-white rounded-lg p-1 border border-gray-200">
          {[
            { id: 'featured', label: 'Featured Collections', icon: Star },
            { id: 'all', label: 'All Books', icon: BookOpen },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'institutions', label: 'Institutions', icon: Building2 }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentView(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Featured Collections View */}
        {currentView === 'featured' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Featured Collections</h2>
              <span className="text-sm text-gray-500">Curated by leading institutions</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {libraryData.featuredCollections.map((collection) => (
                <div
                  key={collection.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Collection Header */}
                  <div className={`h-32 bg-gradient-to-r ${collection.color} relative overflow-hidden`}>
                    <img
                      src={collection.thumbnail}
                      alt={collection.name}
                      className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Building2 className="h-8 w-8 mx-auto mb-2" />
                        <h3 className="font-bold text-lg">{collection.institution}</h3>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center space-x-1">
                      {collection.verified && <Verified className="h-5 w-5 text-white" />}
                      {collection.featured && <Crown className="h-5 w-5 text-yellow-300" />}
                    </div>
                  </div>

                  {/* Collection Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 text-lg mb-2">{collection.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{collection.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {collection.curator}
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {collection.bookCount} books
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">
                          {formatNumber(collection.totalDownloads)} downloads
                        </span>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">Popular</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {collection.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {collection.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{collection.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedInstitution(collection.institution);
                          setCurrentView('all');
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Explore Collection
                      </button>
                      <button
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Bookmark Collection"
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories View */}
        {currentView === 'categories' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Browse by Category</h2>
              <button
                onClick={() => setCurrentView('all')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All Books
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {libraryData.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setCurrentView('all');
                  }}
                  className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-md bg-white transition-all duration-200 group"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-blue-600">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500">{category.count} books</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Institutions View */}
        {currentView === 'institutions' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Leading Institutions</h2>
              <button
                onClick={() => setCurrentView('all')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All Books
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraryData.institutions.map((institution) => {
                const TierIcon = institutionTiers[institution.tier]?.icon || School;
                return (
                  <div
                    key={institution.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    onClick={() => {
                      setSelectedInstitution(institution.name);
                      setCurrentView('all');
                    }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <TierIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {institution.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span>{institution.country}</span>
                          {institution.verified && (
                            <>
                              <Verified className="h-3 w-3 text-blue-500" />
                              <span className="text-blue-600">Verified</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{institution.bookCount}</p>
                        <p className="text-sm text-gray-500">Books Published</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        institution.tier === 'premium' ? 'bg-purple-100 text-purple-800' :
                        institution.tier === 'standard' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {institutionTiers[institution.tier]?.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Trending Topics (shown in all views except institutions) */}
        {currentView !== 'institutions' && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Topics</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {libraryData.trendingTopics.map((topic, index) => (
                <div
                  key={topic.name}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSearchQuery(topic.name.toLowerCase())}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                    <span className="text-xs text-green-600 font-medium">{topic.growth}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{topic.name}</h4>
                  <p className="text-xs text-gray-500">{topic.books} books</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Books View - Only show when currentView is 'all' */}
        {currentView === 'all' && (
          <>
            {/* Filters and Controls */}
            <div className="flex items-center justify-between mb-6">
              {/* Left - Filters */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    showFilters 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>

                {/* Quick Filters */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      showVerifiedOnly
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Verified className="h-3 w-3 mr-1 inline" />
                    Verified Only
                  </button>
                  <button
                    onClick={() => setShowOpenAccessOnly(!showOpenAccessOnly)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      showOpenAccessOnly
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Unlock className="h-3 w-3 mr-1 inline" />
                    Open Access
                  </button>
                  <button
                    onClick={() => setShowPremiumOnly(!showPremiumOnly)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      showPremiumOnly
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Crown className="h-3 w-3 mr-1 inline" />
                    Premium
                  </button>
                </div>
              </div>

              {/* Right - View and Sort Controls */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {filteredBooks.length} books found
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
                              sortBy === key ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
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
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-r-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-blue-100 text-blue-700' 
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Languages</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Publication Year</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="all">All Years</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="older">Older</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="all">All Licenses</option>
                      <option value="cc-by">CC BY</option>
                      <option value="cc-by-nc">CC BY-NC</option>
                      <option value="cc-by-sa">CC BY-SA</option>
                      <option value="all-rights">All Rights Reserved</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Count</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="all">Any Length</option>
                      <option value="short">&lt; 200 pages</option>
                      <option value="medium">200-500 pages</option>
                      <option value="long">&gt; 500 pages</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="all">All Formats</option>
                      <option value="PDF">PDF</option>
                      <option value="EPUB">EPUB</option>
                      <option value="Interactive">Interactive</option>
                      <option value="3D">3D Models</option>
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
                  Try adjusting your search criteria or browse our featured collections.
                </p>
                <button
                  onClick={() => {
                    clearFilters();
                    setCurrentView('featured');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Browse Featured Collections
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
                        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-indigo-600 overflow-hidden">
                          <img
                            src={book.thumbnail}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                          
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                            {book.verified && (
                              <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center">
                                <Verified className="h-3 w-3 mr-1" />
                                Verified
                              </span>
                            )}
                            {book.premium && (
                              <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full flex items-center">
                                <Crown className="h-3 w-3 mr-1" />
                                Premium
                              </span>
                            )}
                            {book.openAccess && (
                              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center">
                                <Unlock className="h-3 w-3 mr-1" />
                                Open
                              </span>
                            )}
                          </div>

                          {/* Institution */}
                          <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full">
                            <span className="text-xs font-medium text-gray-700">{book.institution}</span>
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

                          {/* Academic Info */}
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                            <span className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {book.citationCount} citations
                            </span>
                            <span className="flex items-center">
                              <Download className="h-3 w-3 mr-1" />
                              {formatNumber(book.downloads)}
                            </span>
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {formatNumber(book.views)}
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

                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleBookView(book.id)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              View
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
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                  <div className="py-1">
                                    <button
                                      onClick={() => {
                                        handleImportToPrimary(book.id);
                                        setActiveDropdown(null);
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                    >
                                      <Import className="h-4 w-4" />
                                      <span>Import to My Library</span>
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
                                    {book.doi && (
                                      <button
                                        onClick={() => {
                                          window.open(`https://doi.org/${book.doi}`, '_blank');
                                          setActiveDropdown(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                        <span>View DOI</span>
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        console.log('Cite book:', book.id);
                                        setActiveDropdown(null);
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                    >
                                      <Quote className="h-4 w-4" />
                                      <span>Cite This Book</span>
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
                            <div className="flex-shrink-0 w-20 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg overflow-hidden">
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
                                      {book.verified && <Verified className="h-4 w-4 text-blue-500" />}
                                      {book.premium && <Crown className="h-4 w-4 text-purple-500" />}
                                      {book.openAccess && <Unlock className="h-4 w-4 text-green-500" />}
                                    </div>
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
                                      <Building2 className="h-4 w-4 mr-1" />
                                      {book.institution}
                                    </span>
                                    <span className="flex items-center">
                                      <BookOpen className="h-4 w-4 mr-1" />
                                      {book.pages} pages
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
                                  {/* Academic Stats */}
                                  <div className="text-center">
                                    <div className="flex items-center space-x-1 mb-1">
                                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                      <span className="text-sm font-medium">{book.rating}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">{book.reviews} reviews</div>
                                  </div>

                                  <div className="text-center">
                                    <div className="text-sm font-medium text-gray-900">{formatNumber(book.downloads)}</div>
                                    <div className="text-xs text-gray-500">downloads</div>
                                  </div>

                                  <div className="text-center">
                                    <div className="text-sm font-medium text-gray-900">{book.citationCount}</div>
                                    <div className="text-xs text-gray-500">citations</div>
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
                                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                      View
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
                                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                          <div className="py-1">
                                            <button
                                              onClick={() => {
                                                handleImportToPrimary(book.id);
                                                setActiveDropdown(null);
                                              }}
                                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                            >
                                              <Import className="h-4 w-4" />
                                              <span>Import to My Library</span>
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
                                            {book.doi && (
                                              <button
                                                onClick={() => {
                                                  window.open(`https://doi.org/${book.doi}`, '_blank');
                                                  setActiveDropdown(null);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                              >
                                                <ExternalLink className="h-4 w-4" />
                                                <span>View DOI</span>
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Tags and Awards */}
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex flex-wrap gap-1">
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
                                {book.awards && book.awards.length > 0 && (
                                  <div className="flex items-center space-x-1">
                                    <Award className="h-4 w-4 text-yellow-500" />
                                    <span className="text-xs text-yellow-600">Award Winner</span>
                                  </div>
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
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
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
          </>
        )}
      </div>
    </div>
  );
};

export default SecondaryLibraryPage;
