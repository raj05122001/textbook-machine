// hooks/useNavigation.js - Navigation state management hook

import { useState, useCallback, useEffect } from 'react';
import { STORAGE_KEYS } from '../lib/constants.js';

/**
 * Custom hook for managing application navigation and routing
 * @returns {object} Navigation state and methods
 */
export function useNavigation() {
  // State
  const [currentPage, setCurrentPage] = useState('home');
  const [currentBookId, setCurrentBookId] = useState(null);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [navigationHistory, setNavigationHistory] = useState(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load navigation state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (savedState) {
      try {
        const preferences = JSON.parse(savedState);
        if (preferences.lastPage) {
          setCurrentPage(preferences.lastPage);
        }
        if (preferences.sidebarOpen !== undefined) {
          setSidebarOpen(preferences.sidebarOpen);
        }
      } catch (error) {
        console.error('Error loading navigation state:', error);
      }
    }
  }, []);

  // Save navigation state to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    let preferences = {};
    
    try {
      preferences = savedState ? JSON.parse(savedState) : {};
    } catch (error) {
      console.error('Error parsing saved preferences:', error);
    }

    const updatedPreferences = {
      ...preferences,
      lastPage: currentPage,
      sidebarOpen,
      lastVisited: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updatedPreferences));
  }, [currentPage, sidebarOpen]);

  // Update breadcrumbs when navigation changes
  useEffect(() => {
    updateBreadcrumbs();
  }, [currentPage, currentBookId, currentChapterId]);

  /**
   * Navigate to a specific page
   */
  const navigateTo = useCallback((page, bookId = null, chapterId = null) => {
    // Add to history if it's a new page
    if (page !== currentPage || bookId !== currentBookId || chapterId !== currentChapterId) {
      setNavigationHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        const navigationState = chapterId 
          ? `${page}/${bookId}/${chapterId}`
          : bookId 
            ? `${page}/${bookId}`
            : page;
        
        newHistory.push(navigationState);
        
        // Limit history size
        if (newHistory.length > 20) {
          newHistory.shift();
        }
        
        return newHistory;
      });
      setHistoryIndex(prev => Math.min(prev + 1, 19));
    }

    setCurrentPage(page);
    setCurrentBookId(bookId);
    setCurrentChapterId(chapterId);
    
    // Close mobile menu when navigating
    setMobileMenuOpen(false);
  }, [currentPage, currentBookId, currentChapterId, historyIndex]);

  /**
   * Navigate back in history
   */
  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = navigationHistory[newIndex];
      
      if (previousState) {
        const parts = previousState.split('/');
        const page = parts[0];
        const bookId = parts[1] || null;
        const chapterId = parts[2] || null;
        
        setHistoryIndex(newIndex);
        setCurrentPage(page);
        setCurrentBookId(bookId);
        setCurrentChapterId(chapterId);
      }
    }
  }, [historyIndex, navigationHistory]);

  /**
   * Navigate forward in history
   */
  const goForward = useCallback(() => {
    if (historyIndex < navigationHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = navigationHistory[newIndex];
      
      if (nextState) {
        const parts = nextState.split('/');
        const page = parts[0];
        const bookId = parts[1] || null;
        const chapterId = parts[2] || null;
        
        setHistoryIndex(newIndex);
        setCurrentPage(page);
        setCurrentBookId(bookId);
        setCurrentChapterId(chapterId);
      }
    }
  }, [historyIndex, navigationHistory]);

  /**
   * Update breadcrumbs based on current navigation state
   */
  const updateBreadcrumbs = useCallback(() => {
    const crumbs = [];

    // Home crumb
    crumbs.push({
      label: 'Home',
      path: 'home',
      isActive: currentPage === 'home'
    });

    // Page-specific breadcrumbs
    switch (currentPage) {
      case 'books':
        crumbs.push({
          label: 'Library',
          path: 'books',
          isActive: !currentBookId
        });
        break;

      case 'book-details':
        crumbs.push({
          label: 'Library',
          path: 'books',
          isActive: false
        });
        if (currentBookId) {
          crumbs.push({
            label: 'Book Details',
            path: `book-details/${currentBookId}`,
            isActive: true
          });
        }
        break;

      case 'editor':
        crumbs.push({
          label: 'Library',
          path: 'books',
          isActive: false
        });
        if (currentBookId) {
          crumbs.push({
            label: 'Editor',
            path: `editor/${currentBookId}`,
            isActive: !currentChapterId
          });
          if (currentChapterId) {
            crumbs.push({
              label: 'Chapter',
              path: `editor/${currentBookId}/${currentChapterId}`,
              isActive: true
            });
          }
        }
        break;

      case 'create-book':
        crumbs.push({
          label: 'Create Book',
          path: 'create-book',
          isActive: true
        });
        break;

      case 'library':
        crumbs.push({
          label: 'Advanced Library',
          path: 'library',
          isActive: true
        });
        break;

      default:
        if (currentPage !== 'home') {
          crumbs.push({
            label: currentPage.charAt(0).toUpperCase() + currentPage.slice(1),
            path: currentPage,
            isActive: true
          });
        }
    }

    setBreadcrumbs(crumbs);
  }, [currentPage, currentBookId, currentChapterId]);

  /**
   * Navigate to book details
   */
  const navigateToBook = useCallback((bookId) => {
    navigateTo('book-details', bookId);
  }, [navigateTo]);

  /**
   * Navigate to book editor
   */
  const navigateToEditor = useCallback((bookId, chapterId = null) => {
    navigateTo('editor', bookId, chapterId);
  }, [navigateTo]);

  /**
   * Navigate to library
   */
  const navigateToLibrary = useCallback(() => {
    navigateTo('books');
  }, [navigateTo]);

  /**
   * Navigate to create book
   */
  const navigateToCreateBook = useCallback(() => {
    navigateTo('create-book');
  }, [navigateTo]);

  /**
   * Navigate to home
   */
  const navigateToHome = useCallback(() => {
    navigateTo('home');
  }, [navigateTo]);

  /**
   * Toggle sidebar
   */
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  /**
   * Toggle mobile menu
   */
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  /**
   * Close mobile menu
   */
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  /**
   * Get navigation items for menu
   */
  const getNavigationItems = useCallback(() => {
    return [
      {
        id: 'home',
        label: 'Home',
        icon: '🏠',
        path: 'home',
        isActive: currentPage === 'home'
      },
      {
        id: 'create-book',
        label: 'Create Book',
        icon: '✨',
        path: 'create-book',
        isActive: currentPage === 'create-book'
      },
      {
        id: 'books',
        label: 'My Library',
        icon: '📚',
        path: 'books',
        isActive: currentPage === 'books' || currentPage === 'book-details'
      },
      {
        id: 'library',
        label: 'Advanced Library',
        icon: '🏛️',
        path: 'library',
        isActive: currentPage === 'library'
      }
    ];
  }, [currentPage]);

  /**
   * Get page title for document.title
   */
  const getPageTitle = useCallback(() => {
    const baseTitle = 'Textbook Machine';
    
    switch (currentPage) {
      case 'home':
        return baseTitle;
      case 'create-book':
        return `Create Book - ${baseTitle}`;
      case 'books':
        return `Library - ${baseTitle}`;
      case 'book-details':
        return `Book Details - ${baseTitle}`;
      case 'editor':
        return `Editor - ${baseTitle}`;
      case 'library':
        return `Advanced Library - ${baseTitle}`;
      default:
        return `${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} - ${baseTitle}`;
    }
  }, [currentPage]);

  /**
   * Check if we can go back
   */
  const canGoBack = historyIndex > 0;

  /**
   * Check if we can go forward
   */
  const canGoForward = historyIndex < navigationHistory.length - 1;

  /**
   * Get current route information
   */
  const getCurrentRoute = useCallback(() => {
    return {
      page: currentPage,
      bookId: currentBookId,
      chapterId: currentChapterId,
      fullPath: currentChapterId 
        ? `${currentPage}/${currentBookId}/${currentChapterId}`
        : currentBookId 
          ? `${currentPage}/${currentBookId}`
          : currentPage
    };
  }, [currentPage, currentBookId, currentChapterId]);

  /**
   * Check if a specific route is active
   */
  const isRouteActive = useCallback((page, bookId = null, chapterId = null) => {
    return currentPage === page && 
           currentBookId === bookId && 
           currentChapterId === chapterId;
  }, [currentPage, currentBookId, currentChapterId]);

  return {
    // Current state
    currentPage,
    currentBookId,
    currentChapterId,
    breadcrumbs,
    sidebarOpen,
    mobileMenuOpen,

    // Navigation methods
    navigateTo,
    navigateToBook,
    navigateToEditor,
    navigateToLibrary,
    navigateToCreateBook,
    navigateToHome,

    // History navigation
    goBack,
    goForward,
    canGoBack,
    canGoForward,

    // UI controls
    toggleSidebar,
    toggleMobileMenu,
    closeMobileMenu,
    setSidebarOpen,

    // Utilities
    getNavigationItems,
    getPageTitle,
    getCurrentRoute,
    isRouteActive,

    // State checkers
    isHome: currentPage === 'home',
    isLibrary: currentPage === 'books',
    isEditor: currentPage === 'editor',
    isCreateBook: currentPage === 'create-book',
    hasBook: !!currentBookId,
    hasChapter: !!currentChapterId
  };
}