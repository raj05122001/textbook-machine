// hooks/useEditor.js - Editor state management hook

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CHAPTER_STATUS, STORAGE_KEYS } from '../lib/constants.js';
import { generateId, debounce, deepClone } from '../lib/utils.js';
import { formatChapterInfo } from '../lib/formatters.js';

/**
 * Custom hook for managing book editor state and operations
 * @param {string} bookId - ID of the book being edited
 * @returns {object} Editor state and methods
 */
export function useEditor(bookId) {
  // State
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [chapterOutline, setChapterOutline] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editorHistory, setEditorHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [wordCount, setWordCount] = useState(0);
  const [selectedText, setSelectedText] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);

  // Refs
  const editorRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Load book data when bookId changes
  useEffect(() => {
    if (bookId) {
      loadBookForEditing(bookId);
    }
  }, [bookId]);

  // Auto-save functionality
  const debouncedSave = useMemo(
    () => debounce(() => {
      if (autoSave && isDirty) {
        saveChapter();
      }
    }, 2000),
    [autoSave, isDirty]
  );

  // Trigger auto-save when content changes
  useEffect(() => {
    if (isDirty && autoSave) {
      debouncedSave();
    }
  }, [editorContent, isDirty, autoSave, debouncedSave]);

  // Update word count when content changes
  useEffect(() => {
    const words = editorContent.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [editorContent]);

  /**
   * Load book data for editing
   */
  const loadBookForEditing = useCallback(async (id) => {
    try {
      // In a real app, this would fetch from API
      // For now, load from localStorage or static data
      const savedBooks = localStorage.getItem(STORAGE_KEYS.DRAFT_BOOKS);
      const books = savedBooks ? JSON.parse(savedBooks) : [];
      const bookToEdit = books.find(b => b.id === id);

      if (bookToEdit) {
        setBook(bookToEdit);
        setChapters(bookToEdit.chapters || []);
        setChapterOutline(generateChapterOutline(bookToEdit.chapters || []));
        
        // Load first chapter if available
        if (bookToEdit.chapters && bookToEdit.chapters.length > 0) {
          loadChapter(bookToEdit.chapters[0]);
        }
      }
    } catch (error) {
      console.error('Error loading book for editing:', error);
    }
  }, []);

  /**
   * Generate chapter outline for navigation
   */
  const generateChapterOutline = useCallback((chaptersData) => {
    return chaptersData.map((chapter, index) => ({
      id: chapter.id,
      title: chapter.title,
      order: index + 1,
      status: chapter.status || CHAPTER_STATUS.PENDING.value,
      wordCount: chapter.wordCount || 0,
      isExpanded: false,
      sections: chapter.sections || []
    }));
  }, []);

  /**
   * Load a specific chapter for editing
   */
  const loadChapter = useCallback((chapter) => {
    // Save current chapter before switching
    if (currentChapter && isDirty) {
      saveChapter();
    }

    setCurrentChapter(chapter);
    setEditorContent(chapter.content || '');
    setIsDirty(false);
    addToHistory(chapter.content || '');
  }, [currentChapter, isDirty]);

  /**
   * Create a new chapter
   */
  const createChapter = useCallback((chapterData = {}) => {
    const newChapter = {
      id: generateId('chapter'),
      title: chapterData.title || 'New Chapter',
      description: chapterData.description || '',
      content: chapterData.content || '',
      status: CHAPTER_STATUS.PENDING.value,
      order: chapters.length + 1,
      wordCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [],
      summary: '',
      questions: [],
      references: []
    };

    setChapters(prev => [...prev, newChapter]);
    setChapterOutline(prev => [...prev, {
      id: newChapter.id,
      title: newChapter.title,
      order: newChapter.order,
      status: newChapter.status,
      wordCount: 0,
      isExpanded: false,
      sections: []
    }]);

    return newChapter;
  }, [chapters]);

  /**
   * Update chapter data
   */
  const updateChapter = useCallback((chapterId, updates) => {
    setChapters(prev => prev.map(chapter =>
      chapter.id === chapterId
        ? { ...chapter, ...updates, updatedAt: new Date().toISOString() }
        : chapter
    ));

    // Update outline
    setChapterOutline(prev => prev.map(item =>
      item.id === chapterId
        ? { ...item, ...updates }
        : item
    ));

    // Update current chapter if it's the one being edited
    if (currentChapter && currentChapter.id === chapterId) {
      setCurrentChapter(prev => ({ ...prev, ...updates }));
    }
  }, [currentChapter]);

  /**
   * Delete a chapter
   */
  const deleteChapter = useCallback((chapterId) => {
    setChapters(prev => prev.filter(chapter => chapter.id !== chapterId));
    setChapterOutline(prev => prev.filter(item => item.id !== chapterId));

    // If deleting current chapter, clear editor
    if (currentChapter && currentChapter.id === chapterId) {
      setCurrentChapter(null);
      setEditorContent('');
      setIsDirty(false);
    }
  }, [currentChapter]);

  /**
   * Reorder chapters
   */
  const reorderChapters = useCallback((dragIndex, hoverIndex) => {
    setChapters(prev => {
      const newChapters = [...prev];
      const draggedChapter = newChapters[dragIndex];
      newChapters.splice(dragIndex, 1);
      newChapters.splice(hoverIndex, 0, draggedChapter);
      
      // Update order numbers
      return newChapters.map((chapter, index) => ({
        ...chapter,
        order: index + 1
      }));
    });

    setChapterOutline(prev => {
      const newOutline = [...prev];
      const draggedItem = newOutline[dragIndex];
      newOutline.splice(dragIndex, 1);
      newOutline.splice(hoverIndex, 0, draggedItem);
      
      return newOutline.map((item, index) => ({
        ...item,
        order: index + 1
      }));
    });
  }, []);

  /**
   * Update editor content
   */
  const updateEditorContent = useCallback((content) => {
    setEditorContent(content);
    setIsDirty(true);

    // Update current chapter
    if (currentChapter) {
      const words = content.trim().split(/\s+/).filter(word => word.length > 0);
      updateChapter(currentChapter.id, {
        content,
        wordCount: words.length
      });
    }
  }, [currentChapter, updateChapter]);

  /**
   * Save current chapter
   */
  const saveChapter = useCallback(async () => {
    if (!currentChapter || !isDirty) return;

    setIsSaving(true);
    try {
      // Update chapter with current content
      const updatedChapter = {
        ...currentChapter,
        content: editorContent,
        wordCount,
        updatedAt: new Date().toISOString()
      };

      updateChapter(currentChapter.id, updatedChapter);

      // Save to localStorage (in real app, save to API)
      const savedBooks = localStorage.getItem(STORAGE_KEYS.DRAFT_BOOKS);
      const books = savedBooks ? JSON.parse(savedBooks) : [];
      const bookIndex = books.findIndex(b => b.id === book.id);

      if (bookIndex !== -1) {
        books[bookIndex] = {
          ...book,
          chapters,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.DRAFT_BOOKS, JSON.stringify(books));
      }

      setIsDirty(false);
    } catch (error) {
      console.error('Error saving chapter:', error);
    } finally {
      setIsSaving(false);
    }
  }, [currentChapter, isDirty, editorContent, wordCount, updateChapter, book, chapters]);

  /**
   * Add content to editor history for undo/redo
   */
  const addToHistory = useCallback((content) => {
    setEditorHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(content);
      
      // Limit history size
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  /**
   * Undo last change
   */
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setEditorContent(editorHistory[newIndex]);
      setIsDirty(true);
    }
  }, [historyIndex, editorHistory]);

  /**
   * Redo last undone change
   */
  const redo = useCallback(() => {
    if (historyIndex < editorHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setEditorContent(editorHistory[newIndex]);
      setIsDirty(true);
    }
  }, [historyIndex, editorHistory]);

  /**
   * Insert text at cursor position
   */
  const insertText = useCallback((text) => {
    const before = editorContent.substring(0, cursorPosition);
    const after = editorContent.substring(cursorPosition);
    const newContent = before + text + after;
    
    updateEditorContent(newContent);
    setCursorPosition(cursorPosition + text.length);
  }, [editorContent, cursorPosition, updateEditorContent]);

  /**
   * Format selected text
   */
  const formatText = useCallback((format) => {
    if (!selectedText) return;

    let formattedText = selectedText;
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'heading1':
        formattedText = `# ${selectedText}`;
        break;
      case 'heading2':
        formattedText = `## ${selectedText}`;
        break;
      case 'heading3':
        formattedText = `### ${selectedText}`;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      default:
        return;
    }

    // Replace selected text with formatted text
    const selectionStart = editorContent.indexOf(selectedText);
    if (selectionStart !== -1) {
      const before = editorContent.substring(0, selectionStart);
      const after = editorContent.substring(selectionStart + selectedText.length);
      const newContent = before + formattedText + after;
      updateEditorContent(newContent);
    }
  }, [selectedText, editorContent, updateEditorContent]);

  /**
   * Generate AI content for chapter
   */
  const generateAIContent = useCallback(async (prompt, chapterId) => {
    // Simulate AI generation
    try {
      updateChapter(chapterId, { status: CHAPTER_STATUS.GENERATING.value });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const generatedContent = `# Generated Content\n\nThis is AI-generated content based on the prompt: "${prompt}"\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n## Key Points\n\n- Point 1: Important concept\n- Point 2: Another key idea\n- Point 3: Summary thought\n\n## Practice Questions\n\n1. What is the main concept discussed?\n2. How does this relate to previous chapters?\n3. Can you provide an example?`;
      
      updateChapter(chapterId, {
        content: generatedContent,
        status: CHAPTER_STATUS.COMPLETED.value,
        wordCount: generatedContent.split(/\s+/).length
      });

      if (currentChapter && currentChapter.id === chapterId) {
        setEditorContent(generatedContent);
        setIsDirty(true);
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      updateChapter(chapterId, { status: CHAPTER_STATUS.ERROR.value });
    }
  }, [currentChapter, updateChapter]);

  /**
   * Export chapter content
   */
  const exportChapter = useCallback((format) => {
    if (!currentChapter) return null;

    const chapterData = {
      title: currentChapter.title,
      content: editorContent,
      wordCount,
      exportedAt: new Date().toISOString()
    };

    switch (format) {
      case 'md':
        return {
          filename: `${currentChapter.title.replace(/\s+/g, '-').toLowerCase()}.md`,
          content: editorContent,
          mimeType: 'text/markdown'
        };
      case 'txt':
        return {
          filename: `${currentChapter.title.replace(/\s+/g, '-').toLowerCase()}.txt`,
          content: editorContent.replace(/[#*>`]/g, ''),
          mimeType: 'text/plain'
        };
      case 'json':
        return {
          filename: `${currentChapter.title.replace(/\s+/g, '-').toLowerCase()}.json`,
          content: JSON.stringify(chapterData, null, 2),
          mimeType: 'application/json'
        };
      default:
        return null;
    }
  }, [currentChapter, editorContent, wordCount]);

  /**
   * Get editor statistics
   */
  const editorStats = useMemo(() => {
    const totalWords = chapters.reduce((sum, chapter) => sum + (chapter.wordCount || 0), 0);
    const completedChapters = chapters.filter(chapter => 
      chapter.status === CHAPTER_STATUS.COMPLETED.value
    ).length;
    
    return {
      totalChapters: chapters.length,
      completedChapters,
      totalWords,
      currentChapterWords: wordCount,
      progress: chapters.length > 0 ? (completedChapters / chapters.length) * 100 : 0
    };
  }, [chapters, wordCount]);

  return {
    // State
    book,
    chapters,
    currentChapter,
    editorContent,
    chapterOutline,
    isDirty,
    isSaving,
    autoSave,
    previewMode,
    sidebarOpen,
    wordCount,
    selectedText,
    cursorPosition,
    editorStats,

    // Editor actions
    updateEditorContent,
    insertText,
    formatText,
    setSelectedText,
    setCursorPosition,

    // Chapter management
    loadChapter,
    createChapter,
    updateChapter,
    deleteChapter,
    reorderChapters,
    saveChapter,

    // History management
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < editorHistory.length - 1,

    // UI controls
    setPreviewMode,
    setSidebarOpen,
    setAutoSave,

    // AI features
    generateAIContent,

    // Export
    exportChapter,

    // Refs
    editorRef,

    // Computed
    hasChanges: isDirty,
    hasCurrentChapter: !!currentChapter,
    canSave: isDirty && currentChapter,
    isGenerating: currentChapter?.status === CHAPTER_STATUS.GENERATING.value
  };
}