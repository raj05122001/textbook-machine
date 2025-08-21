'use client';

import { useState } from 'react';
import { 
  Book, 
  Clock, 
  User, 
  Calendar, 
  Star, 
  Download, 
  Edit3, 
  Trash2, 
  Share2, 
  MoreHorizontal,
  Eye,
  FileText,
  BookOpen,
  Play,
  Bookmark,
  Tag
} from 'lucide-react';

const BookCard = ({ 
  book, 
  onEdit, 
  onDelete, 
  onView, 
  onDownload, 
  onShare,
  onRead,
  onBookmark,
  size = 'medium', // 'small', 'medium', 'large'
  view = '3d', // '3d', 'flat', 'compact'
  showActions = true,
  showProgress = true,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(book.isBookmarked || false);

  const sizeClasses = {
    small: 'w-48 h-64',
    medium: 'w-56 h-72',
    large: 'w-64 h-80'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'draft':
        return 'bg-yellow-500';
      case 'published':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'draft':
        return 'Draft';
      case 'published':
        return 'Published';
      default:
        return 'Unknown';
    }
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.(book.id, !isBookmarked);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const readingProgress = book.readingProgress || 0;
  const completionProgress = book.completionProgress || 0;

  if (view === 'compact') {
    return (
      <div 
        className={`flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer ${className}`}
        onClick={() => onView?.(book)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Compact Book Cover */}
        <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold mr-4 flex-shrink-0">
          <BookOpen className="h-6 w-6" />
        </div>

        {/* Book Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
          <p className="text-sm text-gray-600 truncate">{book.description}</p>
          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
            <span>{book.chapters || 0} chapters</span>
            <span>{book.wordCount?.toLocaleString() || 0} words</span>
            <span className={`px-2 py-1 rounded-full text-white ${getStatusColor(book.status)}`}>
              {getStatusText(book.status)}
            </span>
          </div>
        </div>

        {/* Actions */}
        {showActions && isHovered && (
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRead?.(book);
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Read"
            >
              <Play className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(book);
              }}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`group relative ${sizeClasses[size]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Book Container */}
      <div 
        className={`relative w-full h-full cursor-pointer transition-all duration-300 transform-gpu ${
          view === '3d' ? 'preserve-3d' : ''
        } ${
          isHovered && view === '3d' 
            ? 'rotate-y-12 scale-105' 
            : 'hover:scale-102'
        }`}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
        onClick={() => onView?.(book)}
      >
        {/* Book Front Cover */}
        <div 
          className={`absolute inset-0 rounded-lg shadow-lg overflow-hidden ${
            view === '3d' ? 'transform-gpu' : ''
          }`}
          style={{
            background: book.coverColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Cover Image or Gradient */}
          {book.coverImage ? (
            <img 
              src={book.coverImage} 
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 relative overflow-hidden">
              {/* Decorative Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white transform rotate-45"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <BookOpen className="h-16 w-16 text-white opacity-30" />
                </div>
              </div>
              
              {/* Shine Effect */}
              <div 
                className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-opacity duration-500 ${
                  isHovered ? 'opacity-20' : ''
                }`}
                style={{
                  transform: 'skewX(-20deg) translateX(-100%)',
                  animation: isHovered ? 'shine 1.5s ease-in-out' : 'none'
                }}
              />
            </div>
          )}

          {/* Book Content Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-2">
                {book.title}
              </h3>
              <p className="text-sm opacity-90 mb-2 line-clamp-1">
                {book.subtitle || book.description}
              </p>
              
              {/* Book Stats */}
              <div className="flex items-center justify-between text-xs opacity-75">
                <div className="flex items-center space-x-2">
                  <FileText className="h-3 w-3" />
                  <span>{book.chapters || 0} chapters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3" />
                  <span>{Math.ceil((book.wordCount || 0) / 200)}m read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(book.status)}`}>
              {getStatusText(book.status)}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
              isBookmarked 
                ? 'bg-yellow-500 text-white' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Rating Stars */}
          {book.rating && (
            <div className="absolute top-14 right-3 flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`h-3 w-3 ${
                    i < book.rating ? 'text-yellow-400 fill-current' : 'text-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Book Spine (3D Effect) */}
        {view === '3d' && (
          <div 
            className="absolute top-0 right-0 w-3 h-full bg-gradient-to-b from-gray-700 to-gray-900 transform origin-right"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'rotateY(90deg)',
              transformOrigin: 'right center'
            }}
          >
            <div className="h-full flex items-center justify-center">
              <span className="text-white text-xs transform -rotate-90 whitespace-nowrap font-semibold">
                {book.title.substring(0, 20)}
              </span>
            </div>
          </div>
        )}
      </div>



      {/* Hover Actions */}
      {showActions && isHovered && (
        <div className="absolute inset-x-0 bottom-2 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRead?.(book);
            }}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            title="Read Book"
          >
            <Play className="h-4 w-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(book);
            }}
            className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
            title="Edit Book"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload?.(book);
            }}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors shadow-lg"
              title="More Actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            
            {/* More Actions Menu */}
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute bottom-full right-0 mb-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare?.(book);
                        setShowMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Share2 className="h-4 w-4 mr-3" />
                      Share
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onView?.(book);
                        setShowMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4 mr-3" />
                      View Details
                    </button>
                    
                    <div className="border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(book);
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}



      {/* CSS for 3D Effects and Animations */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: skewX(-20deg) translateX(-100%); }
          50% { transform: skewX(-20deg) translateX(0%); }
          100% { transform: skewX(-20deg) translateX(100%); }
        }
        
        .rotate-y-12 {
          transform: perspective(1000px) rotateY(12deg);
        }
        
        .scale-102 {
          transform: scale(1.02);
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default BookCard;