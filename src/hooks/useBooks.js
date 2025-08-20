// hooks/useBooks.js - Books state management hook

import { useState, useEffect, useCallback, useMemo } from 'react';
import { booksData } from '../data/books.js';
import { BOOK_STATUS, STORAGE_KEYS } from '../lib/constants.js';
import { formatBookStats, formatDate } from '../lib/formatters.js';
import { generateId, sortBy, groupBy, parseSearchQuery } from '../lib/utils.js';

/**
 * Custom hook for managing books state and operations
 * @returns {object} Books state and methods
 */
export function useBooks() {
  // State
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    subject: 'all',
    author: 'all',
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Load books from storage or static data
  useEffect(() => {
    loadBooks();
  }, []);

  // Save books to localStorage when books change
  useEffect(() => {
    if (books.length > 0) {
      saveBooks(books);
    }
  }, [books]);

  /**
   * Load books from localStorage or use static data
   */
  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load from localStorage first
      const savedBooks = localStorage.getItem(STORAGE_KEYS.DRAFT_BOOKS);
      
      if (savedBooks) {
        const parsedBooks = JSON.parse(savedBooks);
        setBooks(parsedBooks);
      } else {
        // Use static data as fallback
        setBooks(booksData);
      }
    } catch (err) {
      console.error('Error loading books:', err);
      setError('Failed to load books');
      // Fallback to static data
      setBooks(booksData);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Save books to localStorage
   */
  const saveBooks = useCallback((booksToSave) => {
    try {
      localStorage.setItem(STORAGE_KEYS.DRAFT_BOOKS, JSON.stringify(booksToSave));
    } catch (err) {
      console.error('Error saving books:', err);
    }
  }, []);

  /**
   * Create a new book
   */
  const createBook = useCallback((bookData) => {
    const newBook = {
      id: generateId('book'),
      title: bookData.title || 'Untitled Book',
      subtitle: bookData.subtitle || '',
      author: bookData.author || 'AI Generated',
      subject: bookData.subject || 'General',
      grade: bookData.grade || 'All Grades',
      language: bookData.language || 'English',
      aiModel: bookData.aiModel || 'gpt-5',
      status: BOOK_STATUS.DRAFT.value,
      color: bookData.color || 'from-blue-500 to-purple-600',
      chapters: bookData.chapters || [],
      pages: 0,
      wordCount: 0,
      tags: bookData.tags || [],
      difficulty: bookData.difficulty || 'intermediate',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0'
    };

    setBooks(prev => [newBook, ...prev]);
    return newBook;
  }, []);

  /**
   * Update an existing book
   */
  const updateBook = useCallback((bookId, updates) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? { 
            ...book, 
            ...updates, 
            updatedAt: new Date().toISOString() 
          }
        : book
    ));
  }, []);

  /**
   * Delete a book
   */
  const deleteBook = useCallback((bookId) => {
    setBooks(prev => prev.filter(book => book.id !== bookId));
    setSelectedBooks(prev => prev.filter(id => id !== bookId));
  }, []);

  /**
   * Duplicate a book
   */
  const duplicateBook = useCallback((bookId) => {
    const originalBook = books.find(book => book.id === bookId);
    if (!originalBook) return null;

    const duplicatedBook = {
      ...originalBook,
      id: generateId('book'),
      title: `${originalBook.title} (Copy)`,
      status: BOOK_STATUS.DRAFT.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBooks(prev => [duplicatedBook, ...prev]);
    return duplicatedBook;
  }, [books]);

  /**
   * Get a specific book by ID
   */
  const getBook = useCallback((bookId) => {
    return books.find(book => book.id === bookId);
  }, [books]);

  /**
   * Get books by status
   */
  const getBooksByStatus = useCallback((status) => {
    return books.filter(book => book.status === status);
  }, [books]);

  /**
   * Get books by subject
   */
  const getBooksBySubject = useCallback((subject) => {
    return books.filter(book => book.subject === subject);
  }, [books]);

  /**
   * Toggle book selection
   */
  const toggleBookSelection = useCallback((bookId) => {
    setSelectedBooks(prev => 
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  }, []);

  /**
   * Select all books
   */
  const selectAllBooks = useCallback(() => {
    setSelectedBooks(filteredBooks.map(book => book.id));
  }, []);

  /**
   * Clear book selection
   */
  const clearSelection = useCallback(() => {
    setSelectedBooks([]);
  }, []);

  /**
   * Delete selected books
   */
  const deleteSelectedBooks = useCallback(() => {
    setBooks(prev => prev.filter(book => !selectedBooks.includes(book.id)));
    setSelectedBooks([]);
  }, [selectedBooks]);

  /**
   * Export selected books
   */
  const exportSelectedBooks = useCallback((format) => {
    const booksToExport = books.filter(book => selectedBooks.includes(book.id));
    // Implementation would depend on export functionality
    console.log(`Exporting ${booksToExport.length} books to ${format}`);
    return booksToExport;
  }, [books, selectedBooks]);

  /**
   * Search and filter books
   */
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Apply search query
    if (searchQuery.trim()) {
      const { text, filters: searchFilters } = parseSearchQuery(searchQuery);
      
      result = result.filter(book => {
        // Text search
        const searchText = `${book.title} ${book.subtitle} ${book.author} ${book.subject}`.toLowerCase();
        const textMatch = !text || searchText.includes(text.toLowerCase());

        // Filter-based search
        const statusMatch = !searchFilters.status || book.status === searchFilters.status;
        const tagMatch = !searchFilters.tags || searchFilters.tags.some(tag => 
          book.tags?.includes(tag)
        );
        const authorMatch = !searchFilters.author || book.author.toLowerCase().includes(searchFilters.author.toLowerCase());

        return textMatch && statusMatch && tagMatch && authorMatch;
      });
    }

    // Apply filters
    if (filters.status !== 'all') {
      result = result.filter(book => book.status === filters.status);
    }

    if (filters.subject !== 'all') {
      result = result.filter(book => book.subject === filters.subject);
    }

    if (filters.author !== 'all') {
      result = result.filter(book => book.author === filters.author);
    }

    // Apply sorting
    if (filters.sortBy) {
      result = sortBy(result, filters.sortBy, filters.sortOrder);
    }

    return result;
  }, [books, searchQuery, filters]);

  /**
   * Get book statistics
   */
  const bookStats = useMemo(() => {
    const total = books.length;
    const completed = books.filter(book => book.status === BOOK_STATUS.COMPLETED.value).length;
    const drafts = books.filter(book => book.status === BOOK_STATUS.DRAFT.value).length;
    const processing = books.filter(book => book.status === BOOK_STATUS.PROCESSING.value).length;
    const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0);
    const totalWords = books.reduce((sum, book) => sum + (book.wordCount || 0), 0);

    // Group by subject
    const bySubject = groupBy(books, 'subject');
    
    // Group by creation date (this month, last month, etc.)
    const now = new Date();
    const thisMonth = books.filter(book => {
      const bookDate = new Date(book.createdAt);
      return bookDate.getMonth() === now.getMonth() && 
             bookDate.getFullYear() === now.getFullYear();
    }).length;

    const lastMonth = books.filter(book => {
      const bookDate = new Date(book.createdAt);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
      return bookDate.getMonth() === lastMonthDate.getMonth() && 
             bookDate.getFullYear() === lastMonthDate.getFullYear();
    }).length;

    return {
      total,
      completed,
      drafts,
      processing,
      totalPages,
      totalWords,
      bySubject,
      thisMonth,
      lastMonth,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  }, [books]);

  /**
   * Get unique values for filter dropdowns
   */
  const filterOptions = useMemo(() => {
    const subjects = [...new Set(books.map(book => book.subject))].filter(Boolean);
    const authors = [...new Set(books.map(book => book.author))].filter(Boolean);
    const statuses = Object.values(BOOK_STATUS);

    return {
      subjects: subjects.map(subject => ({ value: subject, label: subject })),
      authors: authors.map(author => ({ value: author, label: author })),
      statuses: statuses.map(status => ({ value: status.value, label: status.label }))
    };
  }, [books]);

  /**
   * Get recent books (last 7 days)
   */
  const recentBooks = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return books
      .filter(book => new Date(book.updatedAt) > sevenDaysAgo)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
  }, [books]);

  /**
   * Check if book exists by title
   */
  const bookExists = useCallback((title) => {
    return books.some(book => 
      book.title.toLowerCase() === title.toLowerCase()
    );
  }, [books]);

  /**
   * Import books from file
   */
  const importBooks = useCallback((importedBooks) => {
    try {
      const validBooks = importedBooks.filter(book => 
        book.title && typeof book.title === 'string'
      ).map(book => ({
        ...book,
        id: book.id || generateId('book'),
        createdAt: book.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      setBooks(prev => [...prev, ...validBooks]);
      return { success: true, imported: validBooks.length };
    } catch (err) {
      console.error('Error importing books:', err);
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Refresh books data
   */
  const refreshBooks = useCallback(() => {
    loadBooks();
  }, [loadBooks]);

  return {
    // State
    books: filteredBooks,
    allBooks: books,
    loading,
    error,
    searchQuery,
    filters,
    selectedBooks,
    viewMode,

    // Statistics
    bookStats,
    recentBooks,
    filterOptions,

    // Actions
    createBook,
    updateBook,
    deleteBook,
    duplicateBook,
    getBook,
    getBooksByStatus,
    getBooksBySubject,

    // Selection
    toggleBookSelection,
    selectAllBooks,
    clearSelection,
    deleteSelectedBooks,
    exportSelectedBooks,

    // Search & Filter
    setSearchQuery,
    setFilters,
    setViewMode,

    // Utilities
    bookExists,
    importBooks,
    refreshBooks,
    loadBooks,

    // Computed
    hasBooks: books.length > 0,
    hasSelectedBooks: selectedBooks.length > 0,
    selectedBooksCount: selectedBooks.length,
    filteredBooksCount: filteredBooks.length,
    totalBooksCount: books.length
  };
}