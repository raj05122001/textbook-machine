'use client';

import { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  FileText, 
  BookOpen, 
  Users, 
  Star, 
  Target, 
  Calendar, 
  Award, 
  Activity, 
  Eye,
  Download,
  Share2,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  Info,
  Zap,
  BookMarked,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Heart,
  MessageSquare
} from 'lucide-react';

const BookStats = ({
  book = {},
  chapters = [],
  readingHistory = [],
  goals = {},
  showComparison = false,
  timeframe = '30d', // '7d', '30d', '90d', '1y', 'all'
  onExport,
  onRefresh,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    const totalWords = book.wordCount || 0;
    const totalChapters = chapters.length;
    const completedChapters = chapters.filter(ch => ch.status === 'completed').length;
    const inProgressChapters = chapters.filter(ch => ch.status === 'in-progress').length;
    const draftChapters = chapters.filter(ch => ch.status === 'draft').length;
    
    // Reading statistics
    const estimatedReadingTime = Math.ceil(totalWords / 200); // 200 WPM
    const averageChapterLength = totalWords / totalChapters || 0;
    const completionPercentage = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
    
    // Writing progress
    const dailyWordCount = readingHistory
      .filter(entry => entry.type === 'writing')
      .reduce((sum, entry) => sum + (entry.wordsAdded || 0), 0);
    
    const weeklyProgress = readingHistory
      .filter(entry => {
        const entryDate = new Date(entry.date);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return entryDate >= weekAgo;
      })
      .reduce((sum, entry) => sum + (entry.wordsAdded || 0), 0);

    // Quality metrics
    const averageRating = book.rating || 0;
    const reviewCount = book.reviewCount || 0;
    const bookmarkCount = book.bookmarkCount || 0;
    const shareCount = book.shareCount || 0;
    
    // Productivity metrics
    const writingDays = new Set(
      readingHistory
        .filter(entry => entry.type === 'writing' && (entry.wordsAdded || 0) > 0)
        .map(entry => new Date(entry.date).toDateString())
    ).size;
    
    const averageSessionLength = readingHistory
      .filter(entry => entry.sessionLength)
      .reduce((sum, entry, _, arr) => sum + entry.sessionLength / arr.length, 0);

    return {
      // Core metrics
      totalWords,
      totalChapters,
      completedChapters,
      inProgressChapters,
      draftChapters,
      completionPercentage,
      
      // Reading metrics
      estimatedReadingTime,
      averageChapterLength,
      
      // Writing metrics
      dailyWordCount,
      weeklyProgress,
      writingDays,
      averageSessionLength,
      
      // Engagement metrics
      averageRating,
      reviewCount,
      bookmarkCount,
      shareCount,
      
      // Progress tracking
      wordsToday: readingHistory
        .filter(entry => {
          const today = new Date().toDateString();
          return new Date(entry.date).toDateString() === today;
        })
        .reduce((sum, entry) => sum + (entry.wordsAdded || 0), 0),
      
      // Goal progress
      goalProgress: goals.dailyWords ? 
        (dailyWordCount / goals.dailyWords) * 100 : 0
    };
  }, [book, chapters, readingHistory, goals]);

  // Chart data for visualizations
  const chartData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const wordsByDay = last30Days.map(date => {
      const dayEntries = readingHistory.filter(entry => 
        entry.date.split('T')[0] === date
      );
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        words: dayEntries.reduce((sum, entry) => sum + (entry.wordsAdded || 0), 0),
        sessions: dayEntries.length,
        time: dayEntries.reduce((sum, entry) => sum + (entry.sessionLength || 0), 0)
      };
    });

    return { wordsByDay };
  }, [readingHistory]);

  const statCards = [
    {
      id: 'words',
      title: 'Total Words',
      value: stats.totalWords.toLocaleString(),
      change: `+${stats.wordsToday.toLocaleString()} today`,
      icon: FileText,
      color: 'blue',
      description: 'Total word count across all chapters'
    },
    {
      id: 'chapters',
      title: 'Chapters',
      value: stats.totalChapters,
      change: `${stats.completedChapters} completed`,
      icon: BookOpen,
      color: 'green',
      description: 'Total number of chapters in the book'
    },
    {
      id: 'progress',
      title: 'Completion',
      value: `${Math.round(stats.completionPercentage)}%`,
      change: `${stats.inProgressChapters} in progress`,
      icon: Target,
      color: 'purple',
      description: 'Overall book completion percentage'
    },
    {
      id: 'reading',
      title: 'Reading Time',
      value: `${stats.estimatedReadingTime}h`,
      change: `~${Math.round(stats.averageChapterLength / 200)}m per chapter`,
      icon: Clock,
      color: 'orange',
      description: 'Estimated reading time at 200 WPM'
    },
    {
      id: 'rating',
      title: 'Rating',
      value: stats.averageRating.toFixed(1),
      change: `${stats.reviewCount} reviews`,
      icon: Star,
      color: 'yellow',
      description: 'Average reader rating'
    },
    {
      id: 'engagement',
      title: 'Engagement',
      value: stats.bookmarkCount + stats.shareCount,
      change: `${stats.bookmarkCount} bookmarks`,
      icon: Heart,
      color: 'pink',
      description: 'Total bookmarks and shares'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      pink: 'bg-pink-50 text-pink-700 border-pink-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      gray: 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[color] || colors.gray;
  };

  const getIconColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-500 bg-blue-100',
      green: 'text-green-500 bg-green-100',
      purple: 'text-purple-500 bg-purple-100',
      orange: 'text-orange-500 bg-orange-100',
      yellow: 'text-yellow-500 bg-yellow-100',
      pink: 'text-pink-500 bg-pink-100',
      red: 'text-red-500 bg-red-100',
      gray: 'text-gray-500 bg-gray-100'
    };
    return colors[color] || colors.gray;
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'quality', label: 'Quality', icon: Award },
    { id: 'timeline', label: 'Timeline', icon: Calendar }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Book Statistics</h2>
            <p className="text-gray-600 mt-1">Comprehensive analytics for "{book.title}"</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onRefresh}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            
            <button
              onClick={onExport}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export Report"
            >
              <Download className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Toggle Details"
            >
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4 bg-gray-100 rounded-lg p-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statCards.map(card => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                      selectedMetric === card.id ? getColorClasses(card.color) : 'bg-white border-gray-200'
                    }`}
                    onClick={() => setSelectedMetric(selectedMetric === card.id ? null : card.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getIconColorClasses(card.color)}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">{card.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-sm text-gray-500">{card.change}</p>
                          <Info className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    {selectedMetric === card.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">{card.description}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Quick Insights</h3>
                  <div className="text-sm text-blue-700 mt-1 space-y-1">
                    <p>• You've written {stats.wordsToday.toLocaleString()} words today</p>
                    <p>• {stats.writingDays} active writing days this month</p>
                    <p>• Average session: {formatDuration(stats.averageSessionLength)}</p>
                    {goals.dailyWords && (
                      <p>• Daily goal progress: {Math.round(stats.goalProgress)}%</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chapter Progress */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Chapter Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="font-medium text-green-600">{stats.completedChapters}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${stats.completionPercentage}%` }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{stats.completedChapters}</div>
                      <div className="text-gray-500">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{stats.inProgressChapters}</div>
                      <div className="text-gray-500">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-600">{stats.draftChapters}</div>
                      <div className="text-gray-500">Draft</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Writing Streak */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Writing Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">This Week</span>
                    <span className="font-medium text-blue-600">{stats.weeklyProgress.toLocaleString()} words</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Days</span>
                    <span className="font-medium text-purple-600">{stats.writingDays} days</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Session</span>
                    <span className="font-medium text-orange-600">{formatDuration(stats.averageSessionLength)}</span>
                  </div>
                  
                  {goals.dailyWords && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Daily Goal</span>
                        <span className="font-medium">{Math.round(stats.goalProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(100, stats.goalProgress)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mini Word Count Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Daily Word Count (Last 30 Days)</h3>
              <div className="h-32 flex items-end space-x-1">
                {chartData.wordsByDay.map((day, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-blue-200 rounded-t transition-all hover:bg-blue-300 relative group"
                    style={{ 
                      height: `${Math.max(4, (day.words / Math.max(...chartData.wordsByDay.map(d => d.words))) * 100)}%` 
                    }}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">
                      {day.date}: {day.words} words
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{chartData.wordsByDay[0]?.date}</span>
                <span>{chartData.wordsByDay[chartData.wordsByDay.length - 1]?.date}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="space-y-6">
            {/* Quality Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-3">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
                <div className="text-xs text-gray-500 mt-1">{stats.reviewCount} reviews</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg mx-auto mb-3">
                  <Bookmark className="h-6 w-6 text-pink-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.bookmarkCount}</div>
                <div className="text-sm text-gray-600">Bookmarks</div>
                <div className="text-xs text-gray-500 mt-1">Reader saves</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                  <Share2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.shareCount}</div>
                <div className="text-sm text-gray-600">Shares</div>
                <div className="text-xs text-gray-500 mt-1">Social engagement</div>
              </div>
            </div>

            {/* Quality Insights */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Quality Insights</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Readability Score</span>
                  </div>
                  <span className="font-medium text-green-600">Good</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <span className="text-sm">Average Chapter Length</span>
                  </div>
                  <span className="font-medium">{Math.round(stats.averageChapterLength).toLocaleString()} words</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">Engagement Rate</span>
                  </div>
                  <span className="font-medium text-blue-600">
                    {((stats.bookmarkCount + stats.shareCount) / Math.max(1, stats.reviewCount) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            {/* Timeline Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Creation Timeline</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Started</span>
                    <span className="font-medium">{formatDate(book.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="font-medium">{formatDate(book.lastModified)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Days Active</span>
                    <span className="font-medium">{stats.writingDays}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Milestones</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">First chapter completed</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">50% completion reached</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <Award className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Book completion (pending)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed View */}
      {showDetails && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4">Detailed Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Characters:</span>
              <span className="ml-2 font-medium">{(stats.totalWords * 5).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">Avg Words/Chapter:</span>
              <span className="ml-2 font-medium">{Math.round(stats.averageChapterLength).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">Estimated Pages:</span>
              <span className="ml-2 font-medium">{Math.ceil(stats.totalWords / 250)}</span>
            </div>
            <div>
              <span className="text-gray-600">Export Count:</span>
              <span className="ml-2 font-medium">{book.exportCount || 0}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

export default BookStats;