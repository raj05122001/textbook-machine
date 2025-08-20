// hooks/useUpload.js - File upload handling hook

import { useState, useCallback, useRef } from 'react';
import { FILE_CONFIG, PROCESSING_STAGES, ERROR_MESSAGES } from '../lib/constants.js';
import { generateId, isFileTypeSupported, getFileExtension } from '../lib/utils.js';
import { formatFileSize } from '../lib/formatters.js';

/**
 * Custom hook for handling file uploads and processing
 * @returns {object} Upload state and methods
 */
export function useUpload() {
  // State
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [extractedContent, setExtractedContent] = useState('');
  const [parsedData, setParsedData] = useState(null);

  // Refs
  const fileInputRef = useRef(null);

  /**
   * Validate file before upload
   */
  const validateFile = useCallback((file) => {
    const errors = [];

    // Check file size
    if (file.size > FILE_CONFIG.maxSize) {
      errors.push(`File size exceeds ${formatFileSize(FILE_CONFIG.maxSize)} limit`);
    }

    // Check file type
    if (!isFileTypeSupported(file.name)) {
      errors.push(`File type "${getFileExtension(file.name)}" is not supported`);
    }

    // Check file name
    if (file.name.length > 255) {
      errors.push('Filename is too long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  /**
   * Add files to upload queue
   */
  const addFiles = useCallback((newFiles) => {
    const fileArray = Array.from(newFiles);
    const validFiles = [];
    const invalidFiles = [];

    fileArray.forEach(file => {
      const validation = validateFile(file);
      const fileData = {
        id: generateId('file'),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        extension: getFileExtension(file.name),
        status: 'pending',
        progress: 0,
        errors: validation.errors,
        uploadedAt: null
      };

      if (validation.isValid) {
        validFiles.push(fileData);
      } else {
        invalidFiles.push(fileData);
      }
    });

    // Check total file count
    if (files.length + validFiles.length > FILE_CONFIG.maxFiles) {
      setError(`Maximum ${FILE_CONFIG.maxFiles} files allowed`);
      return;
    }

    setFiles(prev => [...prev, ...validFiles]);

    if (invalidFiles.length > 0) {
      console.warn('Invalid files:', invalidFiles);
    }

    setError(null);
  }, [files.length, validateFile]);

  /**
   * Remove file from queue
   */
  const removeFile = useCallback((fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  /**
   * Clear all files
   */
  const clearFiles = useCallback(() => {
    setFiles([]);
    setExtractedContent('');
    setParsedData(null);
    setError(null);
  }, []);

  /**
   * Handle file input change
   */
  const handleFileInput = useCallback((event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  }, [addFiles]);

  /**
   * Handle drag and drop events
   */
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setDragActive(false);

    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }, [addFiles]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setDragActive(false);
  }, []);

  /**
   * Trigger file input dialog
   */
  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Simulate file content extraction
   */
  const extractFileContent = useCallback(async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const content = event.target.result;
        
        // Simulate different file type processing
        switch (file.extension) {
          case 'txt':
            resolve(content);
            break;
          case 'pdf':
            // Simulate PDF text extraction
            resolve(`Extracted text from PDF: ${file.name}\n\nThis is simulated content from a PDF file. In a real implementation, this would use a PDF parsing library to extract actual text content.`);
            break;
          case 'doc':
          case 'docx':
            // Simulate Word document processing
            resolve(`Extracted text from Word document: ${file.name}\n\nThis is simulated content from a Word document. In a real implementation, this would use a library like mammoth.js to extract text content.`);
            break;
          default:
            resolve(`Content from ${file.name}\n\nUnsupported file type for content extraction.`);
        }
      };

      reader.onerror = () => {
        resolve('Error reading file content.');
      };

      if (file.extension === 'txt') {
        reader.readAsText(file.file);
      } else {
        reader.readAsArrayBuffer(file.file);
      }
    });
  }, []);

  /**
   * Process uploaded files
   */
  const processFiles = useCallback(async () => {
    if (files.length === 0) {
      setError('No files to process');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      let allContent = '';
      const processedFiles = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Update file status
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'processing' }
            : f
        ));

        // Simulate processing stages
        for (let stageIndex = 0; stageIndex < PROCESSING_STAGES.length; stageIndex++) {
          const stage = PROCESSING_STAGES[stageIndex];
          setCurrentStage(stage);

          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 800));

          // Update progress
          const fileProgress = ((i + (stageIndex + 1) / PROCESSING_STAGES.length) / files.length) * 100;
          setProgress(Math.round(fileProgress));
        }

        // Extract content from file
        const content = await extractFileContent(file);
        allContent += content + '\n\n';

        // Mark file as completed
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { 
                ...f, 
                status: 'completed',
                progress: 100,
                uploadedAt: new Date().toISOString()
              }
            : f
        ));

        processedFiles.push({
          ...file,
          content,
          extractedAt: new Date().toISOString()
        });
      }

      // Set extracted content
      setExtractedContent(allContent.trim());

      // Parse content into structured data
      const parsedStructure = parseContentStructure(allContent);
      setParsedData(parsedStructure);

      setCurrentStage({
        id: 'complete',
        name: 'Processing Complete',
        description: 'All files processed successfully',
        icon: '✅'
      });

    } catch (err) {
      console.error('Error processing files:', err);
      setError('Failed to process files. Please try again.');
      
      // Mark files as error
      setFiles(prev => prev.map(f => ({ ...f, status: 'error' })));
    } finally {
      setProcessing(false);
    }
  }, [files, extractFileContent]);

  /**
   * Parse content into structured format
   */
  const parseContentStructure = useCallback((content) => {
    // Simple content parsing - in real app, this would be more sophisticated
    const lines = content.split('\n').filter(line => line.trim());
    const structure = {
      title: '',
      chapters: [],
      topics: [],
      wordCount: 0
    };

    // Extract potential title (first significant line)
    if (lines.length > 0) {
      structure.title = lines[0].replace(/^[#\s]+/, '').trim();
    }

    // Look for chapter indicators
    const chapterPatterns = [
      /chapter\s+\d+/i,
      /^#\s+/,
      /^\d+\./,
      /unit\s+\d+/i
    ];

    let currentChapter = null;
    const chapters = [];
    const topics = new Set();

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Check if line looks like a chapter title
      const isChapterTitle = chapterPatterns.some(pattern => pattern.test(trimmedLine));
      
      if (isChapterTitle && trimmedLine.length > 3) {
        if (currentChapter) {
          chapters.push(currentChapter);
        }
        
        currentChapter = {
          id: generateId('chapter'),
          title: trimmedLine.replace(/^[#\d\.\s]+/, '').trim(),
          content: '',
          order: chapters.length + 1,
          topics: []
        };
      } else if (currentChapter && trimmedLine) {
        currentChapter.content += line + '\n';
        
        // Extract potential topics (lines that look like subtopics)
        if (trimmedLine.length < 100 && !trimmedLine.endsWith('.')) {
          topics.add(trimmedLine);
          currentChapter.topics.push(trimmedLine);
        }
      }
    });

    if (currentChapter) {
      chapters.push(currentChapter);
    }

    structure.chapters = chapters;
    structure.topics = Array.from(topics);
    structure.wordCount = content.split(/\s+/).length;

    return structure;
  }, []);

  /**
   * Generate book from uploaded content
   */
  const generateBookFromUpload = useCallback((additionalData = {}) => {
    if (!parsedData) {
      setError('No parsed data available');
      return null;
    }

    const bookData = {
      title: parsedData.title || additionalData.title || 'Untitled Book',
      subtitle: additionalData.subtitle || '',
      subject: additionalData.subject || 'General',
      grade: additionalData.grade || 'All Grades',
      language: additionalData.language || 'English',
      aiModel: additionalData.aiModel || 'gpt-5',
      chapters: parsedData.chapters.map(chapter => ({
        ...chapter,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })),
      wordCount: parsedData.wordCount,
      pages: Math.ceil(parsedData.wordCount / 250), // Estimate pages
      tags: parsedData.topics.slice(0, 5), // Use first 5 topics as tags
      sourceFiles: files.map(f => f.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return bookData;
  }, [parsedData, files]);

  /**
   * Reset upload state
   */
  const resetUpload = useCallback(() => {
    setFiles([]);
    setUploading(false);
    setProcessing(false);
    setCurrentStage(null);
    setProgress(0);
    setError(null);
    setDragActive(false);
    setExtractedContent('');
    setParsedData(null);
  }, []);

  /**
   * Get upload statistics
   */
  const uploadStats = {
    totalFiles: files.length,
    completedFiles: files.filter(f => f.status === 'completed').length,
    failedFiles: files.filter(f => f.status === 'error').length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0),
    hasFiles: files.length > 0,
    canProcess: files.length > 0 && !processing,
    isComplete: files.length > 0 && files.every(f => f.status === 'completed')
  };

  return {
    // State
    files,
    uploading,
    processing,
    currentStage,
    progress,
    error,
    dragActive,
    extractedContent,
    parsedData,
    uploadStats,

    // File management
    addFiles,
    removeFile,
    clearFiles,
    validateFile,

    // File input
    fileInputRef,
    handleFileInput,
    openFileDialog,

    // Drag and drop
    handleDrop,
    handleDragOver,
    handleDragLeave,

    // Processing
    processFiles,
    generateBookFromUpload,

    // Utilities
    resetUpload,

    // Computed
    hasFiles: files.length > 0,
    canUpload: files.length > 0 && files.some(f => f.status === 'pending'),
    isProcessing: processing,
    hasError: !!error,
    hasContent: !!extractedContent,
    hasParsedData: !!parsedData
  };
}