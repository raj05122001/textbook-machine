// data/settings.js - Application settings and configuration

/**
 * Default application settings for TBM
 */
export const defaultSettings = {
  // UI & Appearance Settings
  appearance: {
    theme: "dark", // "light" | "dark" | "system" | "auto"
    accentColor: "#10b981", // Primary brand color
    fontSize: "medium", // "small" | "medium" | "large" | "extra-large"
    fontFamily: "Inter", // "Inter" | "Georgia" | "Times" | "Arial" | "Roboto"
    compactMode: false, // Reduce spacing for more content
    showAnimations: true, // Enable/disable animations
    reducedMotion: false, // Accessibility: reduce motion
    highContrast: false, // Accessibility: high contrast mode
    colorBlindFriendly: false, // Accessibility: colorblind support
    rtlSupport: false, // Right-to-left text support
    customCss: "", // Custom CSS overrides
    layout: "sidebar", // "sidebar" | "topbar" | "minimal"
    density: "comfortable" // "compact" | "comfortable" | "spacious"
  },

  // Editor Configuration
  editor: {
    // Auto-save settings
    autoSave: true,
    autoSaveInterval: 30, // seconds
    backupFrequency: 300, // seconds (5 minutes)
    maxBackups: 10, // Number of backup versions to keep
    
    // Text editing
    showWordCount: true,
    showCharacterCount: false,
    showReadingTime: true,
    spellCheck: true,
    autoCorrect: false,
    smartQuotes: true, // Convert straight quotes to curly quotes
    
    // Code and formatting
    syntaxHighlighting: true,
    lineNumbers: false,
    showWhitespace: false,
    wrapText: true,
    tabSize: 2,
    indentWithTabs: false,
    
    // Editor behavior
    autoPairBrackets: true,
    autoIndent: true,
    selectAll: true, // Select all on triple-click
    dragAndDrop: true,
    undoLimit: 50, // Maximum undo steps
    
    // Preview settings
    livePreview: true,
    previewMode: "side", // "side" | "bottom" | "overlay" | "tab"
    mathRendering: true, // Render LaTeX math expressions
    diagramRendering: true, // Render mermaid diagrams
    
    // Toolbar customization
    toolbarVisible: true,
    toolbarPosition: "top", // "top" | "bottom" | "floating"
    customToolbar: [
      "bold", "italic", "underline", "|",
      "heading1", "heading2", "heading3", "|", 
      "bulletList", "orderedList", "blockquote", "|",
      "link", "image", "table", "|",
      "undo", "redo"
    ]
  },

  // AI & Content Generation
  generation: {
    defaultAiModel: "gpt-5", // "gpt-5" | "claude" | "gemini"
    fallbackModel: "claude", // Backup model if primary fails
    maxTokens: 4000, // Maximum tokens per generation
    temperature: 0.7, // Creativity level (0-1)
    maxChaptersPerBook: 20,
    defaultLanguage: "English",
    
    // Content inclusion settings
    includeImages: true,
    includeQuestions: true,
    includeSummaries: true,
    includeReferences: true,
    includeExamples: true,
    includeDiagrams: false,
    
    // Generation preferences
    generateTOC: true,
    generateIndex: false,
    generateGlossary: true,
    generateBibliography: true,
    
    // Quality controls
    contentLength: "medium", // "short" | "medium" | "long" | "detailed"
    academicLevel: "intermediate", // "beginner" | "intermediate" | "advanced" | "expert"
    writingStyle: "educational", // "casual" | "educational" | "academic" | "professional"
    citationStyle: "APA", // "APA" | "MLA" | "Chicago" | "Harvard"
    
    // Advanced AI settings
    useContextHistory: true, // Use previous chapters as context
    adaptiveDifficulty: true, // Adjust difficulty based on grade
    personalizedContent: false, // Customize for specific users
    factChecking: true, // Attempt to verify facts
    plagiarismCheck: false, // Check for potential plagiarism
    
    // Rate limiting
    requestDelay: 1000, // Milliseconds between requests
    maxConcurrentRequests: 3,
    retryAttempts: 3,
    timeoutDuration: 30000 // Request timeout in milliseconds
  },

  // Export & Publishing
  export: {
    defaultFormat: "pdf", // "pdf" | "docx" | "epub" | "html" | "markdown"
    
    // Document settings
    paperSize: "A4", // "A4" | "Letter" | "Legal" | "A3" | "Custom"
    orientation: "portrait", // "portrait" | "landscape"
    margins: "normal", // "narrow" | "normal" | "wide" | "custom"
    customMargins: { top: 1, right: 1, bottom: 1, left: 1 }, // inches
    
    // Content inclusion
    includeMetadata: true,
    includePageNumbers: true,
    includeCoverPage: true,
    includeTableOfContents: true,
    includeHeader: true,
    includeFooter: true,
    includeWatermark: false,
    
    // Quality & optimization
    quality: "high", // "low" | "medium" | "high" | "ultra"
    compression: "balanced", // "none" | "fast" | "balanced" | "maximum"
    imageQuality: 90, // 1-100 for JPEG quality
    embedFonts: true,
    optimizeForPrint: false,
    optimizeForWeb: false,
    
    // Security & permissions
    passwordProtect: false,
    allowCopying: true,
    allowPrinting: true,
    allowModifying: true,
    allowAnnotations: true,
    
    // Batch export
    batchExportFormat: "zip", // "zip" | "folder"
    includeSourceFiles: false,
    separateChapters: false,
    customNaming: "{title} - {date}", // Template for file names
    
    // Publishing
    enableSharing: true,
    sharePermissions: "view", // "view" | "comment" | "edit"
    publicAccess: false,
    licenseType: "all-rights-reserved", // "creative-commons" | "all-rights-reserved"
    
    // Cloud storage
    autoUploadToCloud: false,
    cloudProvider: "none", // "none" | "gdrive" | "onedrive" | "dropbox"
    syncEnabled: false
  },

  // Notifications & Alerts
  notifications: {
    enabled: true,
    
    // System notifications
    systemUpdates: true,
    securityAlerts: true,
    maintenanceNotices: true,
    
    // Content notifications
    bookGeneration: true,
    chapterCompletion: true,
    exportReady: true,
    saveConfirmation: false,
    autoSaveIndicator: true,
    
    // Collaboration notifications
    shareInvitations: true,
    commentNotifications: true,
    editConflicts: true,
    
    // Email notifications
    emailNotifications: false,
    emailFrequency: "daily", // "immediate" | "hourly" | "daily" | "weekly"
    emailTypes: ["generation", "sharing", "updates"],
    
    // Push notifications
    pushNotifications: true,
    pushOnMobile: true,
    pushOnDesktop: false,
    
    // Notification behavior
    playSound: false,
    showBadges: true,
    autoHide: true,
    hideDelay: 5000, // milliseconds
    
    // Do not disturb
    quietHours: false,
    quietStart: "22:00",
    quietEnd: "08:00",
    timezone: "auto" // "auto" | specific timezone
  },

  // Language & Localization
  localization: {
    language: "en", // Primary language code
    region: "US", // Region for formatting
    fallbackLanguage: "en",
    
    // Supported languages
    availableLanguages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "hi", name: "Hindi", nativeName: "हिंदी" },
      { code: "es", name: "Spanish", nativeName: "Español" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "de", name: "German", nativeName: "Deutsch" },
      { code: "zh", name: "Chinese", nativeName: "中文" },
      { code: "ja", name: "Japanese", nativeName: "日本語" },
      { code: "ar", name: "Arabic", nativeName: "العربية" }
    ],
    
    // Formatting preferences
    dateFormat: "MM/DD/YYYY", // "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD"
    timeFormat: "12", // "12" | "24"
    numberFormat: "en-US", // Locale for number formatting
    currencyFormat: "USD",
    
    // Text direction
    textDirection: "ltr", // "ltr" | "rtl"
    
    // Translation settings
    autoTranslate: false,
    translateProvider: "google", // "google" | "microsoft" | "deepl"
    showTranslationUI: false
  },

  // Privacy & Security
  privacy: {
    // Data collection
    analytics: true,
    crashReporting: true,
    usageStatistics: true,
    performanceMetrics: false,
    
    // Data sharing
    shareAnonymousData: false,
    shareWithEducators: false,
    shareWithResearchers: false,
    
    // Content privacy
    saveLocally: true,
    cloudBackup: false,
    encryptData: true,
    dataRetention: "1year", // "30days" | "1year" | "forever"
    
    // Account security
    twoFactorAuth: false,
    sessionTimeout: 480, // minutes
    autoLogout: true,
    rememberDevice: false,
    
    // Content security
    contentScanning: true, // Scan for inappropriate content
    plagiarismDetection: false,
    copyrightCheck: false,
    
    // Compliance
    gdprCompliant: true,
    coppaCompliant: true,
    ferpaCompliant: true
  },

  // Performance & Storage
  performance: {
    // Caching
    enableCaching: true,
    cacheSize: "100MB", // Maximum cache size
    cacheDuration: "7days", // How long to keep cached data
    
    // Auto-optimization
    autoOptimize: true,
    optimizeImages: true,
    compressData: true,
    lazyLoading: true,
    
    // Resource limits
    maxFileSize: "10MB", // Maximum upload file size
    maxBookSize: "100MB", // Maximum book size
    maxChapters: 50,
    maxImages: 100,
    
    // Background processing
    backgroundSync: true,
    backgroundExport: true,
    backgroundBackup: false,
    
    // Memory management
    clearUnusedData: true,
    memoryThreshold: "500MB",
    garbageCollection: "auto"
  },

  // Accessibility
  accessibility: {
    // Visual accessibility
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    colorBlindSupport: false,
    
    // Keyboard navigation
    keyboardShortcuts: true,
    focusIndicators: true,
    skipLinks: true,
    tabOrder: "logical",
    
    // Screen reader support
    screenReaderOptimized: false,
    altTextRequired: false,
    headingStructure: true,
    landmarkRegions: true,
    
    // Motor accessibility
    clickTargetSize: "normal", // "small" | "normal" | "large"
    hoverTimeout: 500, // milliseconds
    clickDelay: 0, // milliseconds
    
    // Cognitive accessibility
    simplifiedInterface: false,
    readingGuide: false,
    progressIndicators: true,
    breadcrumbs: true
  },

  // Advanced & Developer
  advanced: {
    // Feature flags
    experimentalFeatures: false,
    betaAccess: false,
    alphaFeatures: false,
    
    // Development
    developerMode: false,
    debugLogging: false,
    verboseLogging: false,
    showPerformanceMetrics: false,
    
    // API settings
    apiTimeout: 30000, // milliseconds
    retryAttempts: 3,
    rateLimiting: true,
    cacheResponses: true,
    
    // Customization
    customPlugins: false,
    customThemes: false,
    customTemplates: false,
    customIntegrations: false,
    
    // Data export
    enableDataExport: true,
    exportFormat: "json", // "json" | "csv" | "xml"
    includeMetadata: true,
    
    // Backup & restore
    autoBackup: true,
    backupLocation: "local", // "local" | "cloud" | "both"
    backupEncryption: true,
    restoreEnabled: true
  }
};

/**
 * User preference schema for validation
 */
export const settingsSchema = {
  appearance: {
    theme: ["light", "dark", "system", "auto"],
    fontSize: ["small", "medium", "large", "extra-large"],
    fontFamily: ["Inter", "Georgia", "Times", "Arial", "Roboto"],
    layout: ["sidebar", "topbar", "minimal"],
    density: ["compact", "comfortable", "spacious"]
  },
  
  editor: {
    autoSaveInterval: { min: 10, max: 300 }, // seconds
    tabSize: { min: 1, max: 8 },
    undoLimit: { min: 10, max: 100 },
    previewMode: ["side", "bottom", "overlay", "tab"],
    toolbarPosition: ["top", "bottom", "floating"]
  },
  
  generation: {
    defaultAiModel: ["gpt-5", "claude", "gemini"],
    maxTokens: { min: 100, max: 8000 },
    temperature: { min: 0, max: 1 },
    maxChaptersPerBook: { min: 1, max: 50 },
    contentLength: ["short", "medium", "long", "detailed"],
    academicLevel: ["beginner", "intermediate", "advanced", "expert"],
    writingStyle: ["casual", "educational", "academic", "professional"],
    citationStyle: ["APA", "MLA", "Chicago", "Harvard"]
  },
  
  export: {
    defaultFormat: ["pdf", "docx", "epub", "html", "markdown"],
    paperSize: ["A4", "Letter", "Legal", "A3", "Custom"],
    orientation: ["portrait", "landscape"],
    margins: ["narrow", "normal", "wide", "custom"],
    quality: ["low", "medium", "high", "ultra"],
    compression: ["none", "fast", "balanced", "maximum"]
  }
};

/**
 * Feature flags for controlling application features
 */
export const featureFlags = {
  // Core features
  bookCreation: true,
  chapterEditing: true,
  aiGeneration: true,
  fileUpload: true,
  export: true,
  
  // Content features
  richTextEditor: true,
  mathSupport: true,
  imageSupport: true,
  tableSupport: true,
  diagramSupport: false,
  
  // AI features
  aiReviewEngine: true,
  contentSuggestions: true,
  autoCorrection: false,
  smartFormatting: true,
  contextualHelp: true,
  
  // Collaboration features
  realTimeCollaboration: false,
  commenting: false,
  shareableLinks: true,
  versionHistory: true,
  permissions: false,
  
  // Advanced features
  customTemplates: false,
  apiAccess: false,
  webhooks: false,
  ssoIntegration: false,
  bulkOperations: true,
  
  // Integration features
  lmsIntegration: false,
  googleClassroom: false,
  microsoftTeams: false,
  canvas: false,
  moodle: false,
  
  // Storage features
  cloudSync: false,
  googleDrive: false,
  oneDrive: false,
  dropbox: false,
  
  // Analytics features
  usageAnalytics: true,
  performanceMetrics: false,
  userBehavior: false,
  contentAnalytics: true,
  
  // Mobile features
  mobileApp: false,
  offlineMode: false,
  pushNotifications: true,
  mobileEditor: false,
  
  // Experimental features
  voiceInput: false,
  aiTutor: false,
  adaptiveLearning: false,
  gamification: false,
  virtualReality: false
};

/**
 * System limits and constraints
 */
export const systemLimits = {
  files: {
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    allowedTypes: ['.pdf', '.doc', '.docx', '.txt', '.md']
  },
  
  content: {
    maxBooks: 100,
    maxChaptersPerBook: 50,
    maxWordsPerChapter: 10000,
    maxImagesPerChapter: 20,
    maxTablesPerChapter: 10
  },
  
  performance: {
    maxCacheSize: 500 * 1024 * 1024, // 500MB
    maxBackups: 10,
    maxUndoSteps: 50,
    apiTimeout: 30000, // 30 seconds
    maxConcurrentRequests: 3
  },
  
  storage: {
    localStorage: 10 * 1024 * 1024, // 10MB
    sessionStorage: 5 * 1024 * 1024, // 5MB
    indexedDB: 50 * 1024 * 1024 // 50MB
  }
};

/**
 * Keyboard shortcuts configuration
 */
export const keyboardShortcuts = {
  // File operations
  'Ctrl+N': 'New Book',
  'Ctrl+O': 'Open Book',
  'Ctrl+S': 'Save',
  'Ctrl+Shift+S': 'Save As',
  'Ctrl+E': 'Export',
  
  // Editing
  'Ctrl+Z': 'Undo',
  'Ctrl+Y': 'Redo',
  'Ctrl+C': 'Copy',
  'Ctrl+V': 'Paste',
  'Ctrl+X': 'Cut',
  'Ctrl+A': 'Select All',
  'Ctrl+F': 'Find',
  'Ctrl+H': 'Replace',
  
  // Formatting
  'Ctrl+B': 'Bold',
  'Ctrl+I': 'Italic',
  'Ctrl+U': 'Underline',
  'Ctrl+1': 'Heading 1',
  'Ctrl+2': 'Heading 2',
  'Ctrl+3': 'Heading 3',
  
  // Navigation
  'Ctrl+K': 'Quick Search',
  'Ctrl+P': 'Preview',
  'Ctrl+\\': 'Toggle Sidebar',
  'F11': 'Fullscreen',
  'Escape': 'Exit Modal',
  
  // Custom
  'Ctrl+G': 'Generate Content',
  'Ctrl+R': 'Review Content',
  'Ctrl+T': 'New Chapter',
  'Ctrl+D': 'Duplicate Chapter'
};

/**
 * Default content templates
 */
export const defaultTemplates = {
  book: {
    title: "New Textbook",
    subtitle: "A comprehensive guide",
    structure: ["Introduction", "Core Concepts", "Applications", "Summary"]
  },
  
  chapter: {
    title: "New Chapter",
    sections: ["Learning Objectives", "Introduction", "Content", "Examples", "Summary", "Questions"]
  },
  
  exercise: {
    types: ["Multiple Choice", "Short Answer", "Essay", "Problem Solving"],
    difficulties: ["Easy", "Medium", "Hard"]
  }
};

/**
 * Error messages and user feedback
 */
export const errorMessages = {
  upload: {
    fileTooBig: "File size exceeds the maximum limit of {maxSize}",
    invalidType: "File type '{type}' is not supported",
    uploadFailed: "Failed to upload file. Please try again.",
    networkError: "Network error occurred during upload"
  },
  
  generation: {
    failed: "Content generation failed. Please try again.",
    timeout: "Generation took too long. Please try with shorter content.",
    quotaExceeded: "AI service quota exceeded. Please try again later.",
    invalidPrompt: "Please provide a valid prompt for content generation"
  },
  
  export: {
    failed: "Export failed. Please check your content and try again.",
    formatNotSupported: "Export format '{format}' is not supported",
    contentTooLarge: "Content is too large for export. Please reduce size.",
    permissionDenied: "Permission denied. Unable to save file."
  },
  
  general: {
    unknownError: "An unknown error occurred. Please try again.",
    networkError: "Network connection error. Please check your internet.",
    serverError: "Server error occurred. Please try again later.",
    validationError: "Please check your input and try again."
  }
};

/**
 * Success messages
 */
export const successMessages = {
  save: "Content saved successfully",
  export: "File exported successfully",
  upload: "File uploaded successfully",
  generation: "Content generated successfully",
  share: "Content shared successfully",
  copy: "Copied to clipboard"
};