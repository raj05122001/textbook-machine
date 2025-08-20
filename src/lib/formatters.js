// lib/formatters.js - Data formatting utilities for TBM

/**
 * Format date in various formats
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type ('relative', 'short', 'long', 'time')
 * @returns {string} - Formatted date string
 */
export function formatDate(date, format = 'relative') {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diff = now - dateObj;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  switch (format) {
    case 'relative':
      if (days === 0) return 'Today';
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days} days ago`;
      if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
      if (days < 365) return `${Math.floor(days / 30)} months ago`;
      return `${Math.floor(days / 365)} years ago`;
      
    case 'short':
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
    case 'time':
      return dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
    case 'datetime':
      return dateObj.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
    default:
      return dateObj.toLocaleDateString();
  }
}

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted file size
 */
export function formatFileSize(bytes, decimals = 1) {
  if (bytes === 0) return '0 B';
  if (!bytes || bytes < 0) return 'Unknown';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Format number with commas and appropriate units
 * @param {number} num - Number to format
 * @param {object} options - Formatting options
 * @returns {string} - Formatted number
 */
export function formatNumber(num, options = {}) {
  const {
    compact = false,
    currency = false,
    percentage = false,
    decimals = 0
  } = options;
  
  if (num === null || num === undefined || isNaN(num)) return '0';
  
  if (percentage) {
    return `${(num * 100).toFixed(decimals)}%`;
  }
  
  if (currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  }
  
  if (compact && num >= 1000) {
    const units = ['', 'K', 'M', 'B', 'T'];
    const order = Math.floor(Math.log10(num) / 3);
    const unitName = units[order];
    const unitValue = num / Math.pow(1000, order);
    
    return `${unitValue.toFixed(decimals)}${unitName}`;
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}

/**
 * Format duration in human readable format
 * @param {number} milliseconds - Duration in milliseconds
 * @param {string} format - Format type ('short', 'long')
 * @returns {string} - Formatted duration
 */
export function formatDuration(milliseconds, format = 'short') {
  if (!milliseconds || milliseconds < 0) return '0s';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (format === 'long') {
    const parts = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours % 24 > 0) parts.push(`${hours % 24} hour${hours % 24 !== 1 ? 's' : ''}`);
    if (minutes % 60 > 0) parts.push(`${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`);
    if (seconds % 60 > 0) parts.push(`${seconds % 60} second${seconds % 60 !== 1 ? 's' : ''}`);
    
    return parts.length > 0 ? parts.join(', ') : '0 seconds';
  }
  
  // Short format
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Format progress percentage
 * @param {number} current - Current progress
 * @param {number} total - Total progress
 * @param {number} decimals - Decimal places
 * @returns {string} - Formatted percentage
 */
export function formatProgress(current, total, decimals = 0) {
  if (!total || total <= 0) return '0%';
  if (!current || current < 0) return '0%';
  if (current > total) return '100%';
  
  const percentage = (current / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Format book statistics
 * @param {object} book - Book object
 * @returns {object} - Formatted statistics
 */
export function formatBookStats(book) {
  if (!book) return {};
  
  const stats = {
    chapters: book.chapters?.length || 0,
    pages: book.pages || 0,
    words: book.wordCount || 0,
    readingTime: '',
    createdDate: '',
    updatedDate: '',
    status: '',
    progress: ''
  };
  
  // Reading time calculation (200 words per minute average)
  if (stats.words > 0) {
    const minutes = Math.ceil(stats.words / 200);
    if (minutes < 60) {
      stats.readingTime = `${minutes} min read`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      stats.readingTime = remainingMinutes > 0 
        ? `${hours}h ${remainingMinutes}m read`
        : `${hours}h read`;
    }
  }
  
  // Format dates
  stats.createdDate = formatDate(book.createdAt, 'short');
  stats.updatedDate = formatDate(book.updatedAt, 'relative');
  
  // Format status
  stats.status = book.status ? 
    book.status.charAt(0).toUpperCase() + book.status.slice(1) : 
    'Unknown';
  
  // Calculate progress
  if (book.chapters && book.chapters.length > 0) {
    const completedChapters = book.chapters.filter(ch => ch.status === 'completed').length;
    stats.progress = formatProgress(completedChapters, book.chapters.length);
  }
  
  return stats;
}

/**
 * Format chapter information
 * @param {object} chapter - Chapter object
 * @returns {object} - Formatted chapter info
 */
export function formatChapterInfo(chapter) {
  if (!chapter) return {};
  
  return {
    title: chapter.title || 'Untitled Chapter',
    description: chapter.description || '',
    pages: chapter.pages || 0,
    words: chapter.wordCount || 0,
    status: chapter.status ? 
      chapter.status.charAt(0).toUpperCase() + chapter.status.slice(1) : 
      'Draft',
    order: chapter.order || 0,
    readingTime: chapter.wordCount ? 
      `${Math.ceil(chapter.wordCount / 200)} min` : 
      '0 min',
    lastModified: formatDate(chapter.updatedAt, 'relative')
  };
}

/**
 * Format AI model information
 * @param {string} modelId - AI model ID
 * @returns {object} - Formatted model info
 */
export function formatAIModelInfo(modelId) {
  const models = {
    'gpt-5': {
      name: 'GPT-5',
      badge: 'Premium',
      color: 'bg-purple-500',
      icon: '🤖'
    },
    'claude': {
      name: 'Claude',
      badge: 'Educational',
      color: 'bg-blue-500',
      icon: '🧠'
    },
    'gemini': {
      name: 'Gemini',
      badge: 'Technical',
      color: 'bg-green-500',
      icon: '💎'
    }
  };
  
  return models[modelId] || {
    name: 'Unknown',
    badge: 'Standard',
    color: 'bg-gray-500',
    icon: '🤖'
  };
}

/**
 * Format search results with highlighting
 * @param {string} text - Text to format
 * @param {string} query - Search query
 * @param {number} maxLength - Maximum text length
 * @returns {string} - Formatted text with highlights
 */
export function formatSearchResult(text, query, maxLength = 150) {
  if (!text) return '';
  if (!query) return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  
  // Create regex for case-insensitive search
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  
  // Find the first match to center the excerpt around it
  const match = text.match(regex);
  let excerpt = text;
  
  if (match && text.length > maxLength) {
    const matchIndex = text.indexOf(match[0]);
    const start = Math.max(0, matchIndex - Math.floor(maxLength / 2));
    const end = Math.min(text.length, start + maxLength);
    excerpt = text.substring(start, end);
    
    if (start > 0) excerpt = '...' + excerpt;
    if (end < text.length) excerpt = excerpt + '...';
  }
  
  // Highlight matches
  return excerpt.replace(regex, '<mark class="bg-yellow-200 text-black px-1 rounded">$1</mark>');
}

/**
 * Format file type with icon
 * @param {string} filename - Filename
 * @returns {object} - File type info with icon
 */
export function formatFileType(filename) {
  if (!filename) return { type: 'unknown', icon: '📄', color: 'text-gray-500' };
  
  const extension = filename.split('.').pop().toLowerCase();
  const types = {
    pdf: { type: 'PDF Document', icon: '📄', color: 'text-red-500' },
    doc: { type: 'Word Document', icon: '📝', color: 'text-blue-500' },
    docx: { type: 'Word Document', icon: '📝', color: 'text-blue-500' },
    txt: { type: 'Text File', icon: '📃', color: 'text-gray-500' },
    rtf: { type: 'Rich Text', icon: '📄', color: 'text-orange-500' }
  };
  
  return types[extension] || { type: 'Document', icon: '📄', color: 'text-gray-500' };
}

/**
 * Format content excerpt for preview
 * @param {string} content - Full content
 * @param {number} length - Excerpt length
 * @returns {string} - Content excerpt
 */
export function formatContentExcerpt(content, length = 200) {
  if (!content) return '';
  
  // Remove HTML tags if present
  const textContent = content.replace(/<[^>]*>/g, '');
  
  // Clean up extra whitespace
  const cleanText = textContent.replace(/\s+/g, ' ').trim();
  
  if (cleanText.length <= length) return cleanText;
  
  // Find the last complete word within the length limit
  const truncated = cleanText.substring(0, length);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > length * 0.8 ? 
    truncated.substring(0, lastSpace) + '...' : 
    truncated + '...';
}

/**
 * Format validation errors
 * @param {object} errors - Validation errors object
 * @returns {Array} - Formatted error messages
 */
export function formatValidationErrors(errors) {
  if (!errors || typeof errors !== 'object') return [];
  
  return Object.entries(errors).map(([field, messages]) => {
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
    const errorList = Array.isArray(messages) ? messages : [messages];
    
    return errorList.map(message => `${fieldName}: ${message}`);
  }).flat();
}

/**
 * Format table of contents
 * @param {Array} chapters - Array of chapter objects
 * @returns {Array} - Formatted TOC entries
 */
export function formatTableOfContents(chapters) {
  if (!Array.isArray(chapters)) return [];
  
  return chapters.map((chapter, index) => ({
    number: index + 1,
    title: chapter.title || `Chapter ${index + 1}`,
    page: chapter.startPage || (index * 10) + 1,
    sections: chapter.sections || [],
    status: chapter.status || 'pending'
  }));
}

/**
 * Format export metadata
 * @param {object} book - Book object
 * @param {string} format - Export format
 * @returns {object} - Export metadata
 */
export function formatExportMetadata(book, format) {
  if (!book) return {};
  
  const stats = formatBookStats(book);
  
  return {
    title: book.title || 'Untitled Book',
    author: book.author || 'Textbook Machine',
    subject: book.subject || 'General',
    grade: book.grade || 'All Grades',
    createdDate: stats.createdDate,
    exportDate: formatDate(new Date(), 'short'),
    format: format.toUpperCase(),
    pages: stats.pages,
    chapters: stats.chapters,
    version: book.version || '1.0',
    language: book.language || 'English',
    aiModel: formatAIModelInfo(book.aiModel).name
  };
}