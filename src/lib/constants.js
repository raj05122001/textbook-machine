// lib/constants.js - App constants for TBM

/**
 * Application Configuration
 */
export const APP_CONFIG = {
  name: 'Textbook Machine',
  version: '1.0.0',
  description: 'AI-powered textbook generator',
  author: 'TBM Team',
  homepage: 'https://textbookmachine.com',
  supportEmail: 'support@textbookmachine.com'
};

/**
 * AI Models Configuration
 */
export const AI_MODELS = {
  GPT5: {
    id: 'gpt-5',
    name: 'GPT-5',
    description: 'Most advanced language model with superior content generation',
    icon: '🤖',
    maxTokens: 32000,
    pricing: 'Premium',
    features: ['Advanced reasoning', 'Long context', 'Multimodal'],
    estimatedTime: '2-3 minutes per chapter'
  },
  CLAUDE: {
    id: 'claude',
    name: 'Claude',
    description: 'Excellent for educational content and detailed explanations',
    icon: '🧠',
    maxTokens: 200000,
    pricing: 'Standard',
    features: ['Educational focus', 'Detailed analysis', 'Safety-first'],
    estimatedTime: '3-4 minutes per chapter'
  },
  GEMINI: {
    id: 'gemini',
    name: 'Gemini',
    description: 'Great for technical subjects and mathematical content',
    icon: '💎',
    maxTokens: 30000,
    pricing: 'Standard',
    features: ['Technical expertise', 'Code generation', 'Math focus'],
    estimatedTime: '2-3 minutes per chapter'
  }
};

/**
 * File Upload Configuration
 */
export const FILE_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  supportedTypes: {
    pdf: {
      extension: 'pdf',
      mimeType: 'application/pdf',
      icon: '📄',
      color: 'text-red-500'
    },
    doc: {
      extension: 'doc',
      mimeType: 'application/msword',
      icon: '📝',
      color: 'text-blue-500'
    },
    docx: {
      extension: 'docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      icon: '📝',
      color: 'text-blue-500'
    },
    txt: {
      extension: 'txt',
      mimeType: 'text/plain',
      icon: '📃',
      color: 'text-gray-500'
    }
  },
  acceptString: '.pdf,.doc,.docx,.txt'
};

/**
 * Book Status Configuration
 */
export const BOOK_STATUS = {
  DRAFT: {
    value: 'draft',
    label: 'Draft',
    color: 'bg-yellow-500/20 text-yellow-300',
    icon: '✏️',
    description: 'Book is in editing phase'
  },
  PROCESSING: {
    value: 'processing',
    label: 'Processing',
    color: 'bg-blue-500/20 text-blue-300',
    icon: '⚙️',
    description: 'AI is generating content'
  },
  COMPLETED: {
    value: 'completed',
    label: 'Completed',
    color: 'bg-green-500/20 text-green-300',
    icon: '✅',
    description: 'Book is ready for use'
  },
  ERROR: {
    value: 'error',
    label: 'Error',
    color: 'bg-red-500/20 text-red-300',
    icon: '❌',
    description: 'Generation failed'
  }
};

/**
 * Chapter Status Configuration
 */
export const CHAPTER_STATUS = {
  PENDING: {
    value: 'pending',
    label: 'Pending',
    color: 'bg-gray-500/20 text-gray-300',
    icon: '⏳'
  },
  GENERATING: {
    value: 'generating',
    label: 'Generating',
    color: 'bg-blue-500/20 text-blue-300',
    icon: '🔄'
  },
  REVIEWING: {
    value: 'reviewing',
    label: 'Reviewing',
    color: 'bg-purple-500/20 text-purple-300',
    icon: '🔍'
  },
  COMPLETED: {
    value: 'completed',
    label: 'Completed',
    color: 'bg-green-500/20 text-green-300',
    icon: '✅'
  },
  ERROR: {
    value: 'error',
    label: 'Error',
    color: 'bg-red-500/20 text-red-300',
    icon: '❌'
  }
};

/**
 * Subject Categories
 */
export const SUBJECTS = {
  MATHEMATICS: {
    id: 'mathematics',
    name: 'Mathematics',
    icon: '🔢',
    color: 'from-blue-500 to-purple-600',
    grades: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
  },
  SCIENCE: {
    id: 'science',
    name: 'Science',
    icon: '🧪',
    color: 'from-green-500 to-teal-600',
    grades: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
  },
  PHYSICS: {
    id: 'physics',
    name: 'Physics',
    icon: '⚛️',
    color: 'from-indigo-500 to-blue-600',
    grades: ['Class 11', 'Class 12']
  },
  CHEMISTRY: {
    id: 'chemistry',
    name: 'Chemistry',
    icon: '⚗️',
    color: 'from-rose-500 to-orange-500',
    grades: ['Class 11', 'Class 12']
  },
  BIOLOGY: {
    id: 'biology',
    name: 'Biology',
    icon: '🧬',
    color: 'from-emerald-500 to-green-600',
    grades: ['Class 11', 'Class 12']
  },
  ENGLISH: {
    id: 'english',
    name: 'English',
    icon: '📚',
    color: 'from-purple-500 to-pink-500',
    grades: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
  },
  HISTORY: {
    id: 'history',
    name: 'History',
    icon: '🏛️',
    color: 'from-amber-500 to-orange-600',
    grades: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
  },
  GEOGRAPHY: {
    id: 'geography',
    name: 'Geography',
    icon: '🌍',
    color: 'from-cyan-500 to-blue-600',
    grades: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
  },
  COMPUTER_SCIENCE: {
    id: 'computer-science',
    name: 'Computer Science',
    icon: '💻',
    color: 'from-gray-500 to-slate-600',
    grades: ['Class 11', 'Class 12']
  }
};

/**
 * Export Formats
 */
export const EXPORT_FORMATS = {
  PDF: {
    id: 'pdf',
    name: 'PDF',
    extension: '.pdf',
    mimeType: 'application/pdf',
    icon: '📄',
    description: 'Portable Document Format - Best for sharing and printing',
    features: ['Preserves formatting', 'Universal compatibility', 'Print-ready']
  },
  DOCX: {
    id: 'docx',
    name: 'Word Document',
    extension: '.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    icon: '📝',
    description: 'Microsoft Word format - Best for further editing',
    features: ['Editable', 'Comments support', 'Track changes']
  },
  EPUB: {
    id: 'epub',
    name: 'EPUB',
    extension: '.epub',
    mimeType: 'application/epub+zip',
    icon: '📖',
    description: 'E-book format - Best for digital reading',
    features: ['Responsive text', 'E-reader compatible', 'Interactive elements']
  },
  HTML: {
    id: 'html',
    name: 'HTML',
    extension: '.html',
    mimeType: 'text/html',
    icon: '🌐',
    description: 'Web format - Best for online viewing',
    features: ['Interactive elements', 'Search-friendly', 'Responsive design']
  }
};

/**
 * Processing Stages
 */
export const PROCESSING_STAGES = [
  {
    id: 'upload',
    name: 'Document Upload',
    description: 'Uploading and validating files',
    icon: '📤',
    estimatedTime: '5-10 seconds'
  },
  {
    id: 'parse',
    name: 'Content Analysis',
    description: 'Analyzing document structure and content',
    icon: '🔍',
    estimatedTime: '30-60 seconds'
  },
  {
    id: 'outline',
    name: 'Chapter Outline',
    description: 'Creating chapter structure and topics',
    icon: '📋',
    estimatedTime: '1-2 minutes'
  },
  {
    id: 'generate',
    name: 'Content Generation',
    description: 'AI generating chapter content',
    icon: '✨',
    estimatedTime: '3-5 minutes per chapter'
  },
  {
    id: 'review',
    name: 'Quality Review',
    description: 'AI reviewing and improving content',
    icon: '🔎',
    estimatedTime: '1-2 minutes per chapter'
  },
  {
    id: 'enhance',
    name: 'Content Enhancement',
    description: 'Adding summaries, Q&A, and references',
    icon: '⭐',
    estimatedTime: '2-3 minutes'
  },
  {
    id: 'finalize',
    name: 'Book Assembly',
    description: 'Compiling final book with formatting',
    icon: '📚',
    estimatedTime: '30-60 seconds'
  }
];

/**
 * Library Types
 */
export const LIBRARY_TYPES = {
  PRIMARY: {
    id: 'primary',
    name: 'Primary Library',
    description: 'Your main collection of textbooks',
    icon: '📚',
    color: 'from-emerald-500 to-teal-600'
  },
  SECONDARY: {
    id: 'secondary',
    name: 'Secondary Library',
    description: 'Shared and template textbooks',
    icon: '🏛️',
    color: 'from-blue-500 to-indigo-600'
  }
};

/**
 * Difficulty Levels
 */
export const DIFFICULTY_LEVELS = {
  BEGINNER: {
    value: 'beginner',
    label: 'Beginner',
    color: 'bg-green-500',
    description: 'Basic concepts and simple explanations'
  },
  INTERMEDIATE: {
    value: 'intermediate',
    label: 'Intermediate',
    color: 'bg-yellow-500',
    description: 'Moderate complexity with examples'
  },
  ADVANCED: {
    value: 'advanced',
    label: 'Advanced',
    color: 'bg-red-500',
    description: 'Complex topics with detailed analysis'
  }
};

/**
 * Languages Supported
 */
export const LANGUAGES = {
  EN: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  HI: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳'
  },
  ES: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸'
  },
  FR: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷'
  },
  DE: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪'
  }
};

/**
 * User Roles
 */
export const USER_ROLES = {
  TEACHER: {
    id: 'teacher',
    name: 'Teacher',
    permissions: ['create', 'edit', 'delete', 'share', 'export'],
    icon: '👩‍🏫'
  },
  STUDENT: {
    id: 'student',
    name: 'Student',
    permissions: ['view', 'export'],
    icon: '👨‍🎓'
  },
  ADMIN: {
    id: 'admin',
    name: 'Administrator',
    permissions: ['all'],
    icon: '👑'
  }
};

/**
 * Theme Configuration
 */
export const THEMES = {
  DARK: {
    id: 'dark',
    name: 'Dark',
    background: '#0B0D10',
    foreground: '#FFFFFF',
    primary: '#10B981',
    secondary: '#374151'
  },
  LIGHT: {
    id: 'light',
    name: 'Light',
    background: '#FFFFFF',
    foreground: '#000000',
    primary: '#059669',
    secondary: '#F3F4F6'
  }
};

/**
 * Animation Durations (in milliseconds)
 */
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
  PAGE_FLIP: 800,
  BOOK_HOVER: 500
};

/**
 * API Endpoints (for future integration)
 */
export const API_ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  BOOKS: '/books',
  CHAPTERS: '/chapters',
  UPLOAD: '/upload',
  GENERATE: '/generate',
  EXPORT: '/export',
  USER: '/user',
  AUTH: '/auth'
};

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'tbm_user_preferences',
  DRAFT_BOOKS: 'tbm_draft_books',
  RECENT_FILES: 'tbm_recent_files',
  THEME: 'tbm_theme',
  LANGUAGE: 'tbm_language',
  AI_MODEL: 'tbm_selected_ai_model'
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds 10MB limit',
  UNSUPPORTED_FILE: 'File type not supported',
  UPLOAD_FAILED: 'Failed to upload file',
  GENERATION_FAILED: 'Content generation failed',
  NETWORK_ERROR: 'Network connection error',
  VALIDATION_ERROR: 'Please check your input',
  EXPORT_FAILED: 'Failed to export book',
  SAVE_FAILED: 'Failed to save changes'
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'File uploaded successfully',
  BOOK_CREATED: 'Book created successfully',
  BOOK_UPDATED: 'Book updated successfully',
  BOOK_DELETED: 'Book deleted successfully',
  EXPORTED: 'Book exported successfully',
  COPIED: 'Copied to clipboard',
  SAVED: 'Changes saved successfully'
};

/**
 * Validation Rules
 */
export const VALIDATION_RULES = {
  BOOK_TITLE: {
    minLength: 3,
    maxLength: 100,
    required: true
  },
  CHAPTER_TITLE: {
    minLength: 2,
    maxLength: 80,
    required: true
  },
  DESCRIPTION: {
    minLength: 10,
    maxLength: 500,
    required: false
  },
  CONTENT: {
    minLength: 50,
    maxLength: 50000,
    required: true
  }
};

/**
 * Pagination Configuration
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [6, 12, 24, 48],
  MAX_VISIBLE_PAGES: 5
};

/**
 * Search Configuration
 */
export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_DELAY: 300,
  MAX_RESULTS: 50,
  HIGHLIGHT_CLASS: 'bg-yellow-200 text-black px-1 rounded'
};

/**
 * Book Generation Limits
 */
export const GENERATION_LIMITS = {
  MIN_CHAPTERS: 1,
  MAX_CHAPTERS: 20,
  MIN_PAGES_PER_CHAPTER: 1,
  MAX_PAGES_PER_CHAPTER: 50,
  MAX_WORDS_PER_BOOK: 100000,
  MAX_CONCURRENT_GENERATIONS: 3
};

/**
 * Performance Metrics
 */
export const PERFORMANCE_TARGETS = {
  TIME_REDUCTION: 80, // 80% time reduction target
  COST_REDUCTION: 70, // 70% cost reduction target
  QUALITY_SCORE: 85, // Minimum quality score (out of 100)
  USER_SATISFACTION: 90 // Target user satisfaction percentage
};

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  COLLABORATIVE_EDITING: false,
  AI_REVIEW_ENGINE: true,
  ADVANCED_EXPORT: true,
  VOICE_INPUT: false,
  REAL_TIME_PREVIEW: true,
  LMS_INTEGRATION: false,
  MULTI_LANGUAGE: true,
  OFFLINE_MODE: false
};

/**
 * Social Sharing Configuration
 */
export const SOCIAL_SHARING = {
  TWITTER: {
    url: 'https://twitter.com/intent/tweet',
    text: 'I just created an amazing textbook with Textbook Machine!',
    hashtags: ['TextbookMachine', 'AI', 'Education']
  },
  FACEBOOK: {
    url: 'https://www.facebook.com/sharer/sharer.php',
    quote: 'Check out this textbook I created with AI!'
  },
  LINKEDIN: {
    url: 'https://www.linkedin.com/sharing/share-offsite/',
    title: 'AI-Generated Textbook',
    summary: 'Created with Textbook Machine'
  }
};

/**
 * Keyboard Shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  NEW_BOOK: 'Ctrl+N',
  SAVE: 'Ctrl+S',
  EXPORT: 'Ctrl+E',
  SEARCH: 'Ctrl+K',
  PREVIEW: 'Ctrl+P',
  UNDO: 'Ctrl+Z',
  REDO: 'Ctrl+Y',
  COPY: 'Ctrl+C',
  PASTE: 'Ctrl+V'
};

/**
 * Content Templates
 */
export const CONTENT_TEMPLATES = {
  WELCOME_MESSAGE: 'Welcome to your new textbook! This comprehensive guide will help you master the subject with clear explanations, examples, and practice exercises.',
  CHAPTER_SUMMARY_TEMPLATE: 'In this chapter, you learned about {topics}. The key concepts covered include {concepts}. Practice the exercises to reinforce your understanding.',
  PRACTICE_QUESTION_INTRO: 'Test your understanding with these practice questions:',
  REFERENCES_INTRO: 'For further reading and deeper understanding, refer to these sources:'
};

/**
 * Grade Level Mapping
 */
export const GRADE_LEVELS = {
  ELEMENTARY: {
    range: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    description: 'Elementary level (Ages 6-11)',
    complexity: 'basic'
  },
  MIDDLE: {
    range: ['Class 6', 'Class 7', 'Class 8'],
    description: 'Middle school level (Ages 11-14)',
    complexity: 'intermediate'
  },
  HIGH: {
    range: ['Class 9', 'Class 10'],
    description: 'High school level (Ages 14-16)',
    complexity: 'advanced'
  },
  SENIOR: {
    range: ['Class 11', 'Class 12'],
    description: 'Senior secondary level (Ages 16-18)',
    complexity: 'expert'
  }
};

/**
 * Default Settings
 */
export const DEFAULT_SETTINGS = {
  theme: 'dark',
  language: 'en',
  aiModel: 'gpt-5',
  autoSave: true,
  notifications: true,
  soundEffects: false,
  animationsEnabled: true,
  pageSize: 12,
  exportFormat: 'pdf'
};