// data/users.js - User profiles and data

/**
 * Sample user profiles for development and testing
 */
export const usersData = [
  {
    id: 1,
    name: "Dheeraj Kumar",
    email: "dheeraj@example.com",
    role: "teacher",
    avatar: "https://ui-avatars.com/api/?name=Dheeraj+Kumar&background=10b981&color=fff",
    institution: "Modern Public School",
    subject: "Mathematics",
    experience: "5 years",
    createdAt: "2024-01-15T08:30:00Z",
    lastLogin: "2024-12-16T09:15:00Z",
    preferences: {
      theme: "dark",
      language: "English",
      aiModel: "gpt-5",
      notifications: true,
      autoSave: true,
      defaultExportFormat: "pdf"
    },
    stats: {
      booksCreated: 12,
      chaptersWritten: 87,
      totalWords: 125000,
      studentsReached: 450
    },
    recentActivity: [
      {
        action: "created",
        type: "book",
        title: "Advanced Calculus Guide",
        timestamp: "2024-12-16T08:30:00Z"
      },
      {
        action: "updated",
        type: "chapter",
        title: "Derivatives and Applications",
        timestamp: "2024-12-15T14:20:00Z"
      },
      {
        action: "exported",
        type: "book",
        title: "Linear Algebra Basics",
        format: "pdf",
        timestamp: "2024-12-14T16:45:00Z"
      }
    ]
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@university.edu",
    role: "teacher",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff",
    institution: "State University",
    subject: "Physics",
    experience: "8 years",
    createdAt: "2024-02-20T10:00:00Z",
    lastLogin: "2024-12-15T15:30:00Z",
    preferences: {
      theme: "light",
      language: "English",
      aiModel: "claude",
      notifications: true,
      autoSave: false,
      defaultExportFormat: "docx"
    },
    stats: {
      booksCreated: 8,
      chaptersWritten: 64,
      totalWords: 89000,
      studentsReached: 320
    }
  },
  {
    id: 3,
    name: "Raj Patel",
    email: "raj.patel@school.in",
    role: "teacher",
    avatar: "https://ui-avatars.com/api/?name=Raj+Patel&background=f59e0b&color=fff",
    institution: "Delhi Public School",
    subject: "Chemistry",
    experience: "3 years",
    createdAt: "2024-03-10T12:30:00Z",
    lastLogin: "2024-12-16T11:20:00Z",
    preferences: {
      theme: "dark",
      language: "Hindi",
      aiModel: "gemini",
      notifications: true,
      autoSave: true,
      defaultExportFormat: "epub"
    },
    stats: {
      booksCreated: 6,
      chaptersWritten: 42,
      totalWords: 67000,
      studentsReached: 280
    }
  }
];

// data/settings.js - Application settings and configuration

/**
 * Default application settings
 */
export const defaultSettings = {
  appearance: {
    theme: "dark", // "light" | "dark" | "system"
    fontSize: "medium", // "small" | "medium" | "large"
    fontFamily: "Inter", // "Inter" | "Georgia" | "Times"
    compactMode: false,
    showAnimations: true,
    reducedMotion: false
  },
  
  editor: {
    autoSave: true,
    autoSaveInterval: 30, // seconds
    showWordCount: true,
    showCharacterCount: false,
    spellCheck: true,
    syntaxHighlighting: true,
    lineNumbers: false,
    wrapText: true,
    tabSize: 2
  },
  
  generation: {
    defaultAiModel: "gpt-5", // "gpt-5" | "claude" | "gemini"
    maxChaptersPerBook: 20,
    defaultLanguage: "English",
    includeImages: true,
    includeQuestions: true,
    includeSummaries: true,
    includeReferences: true,
    generateTOC: true
  },
  
  export: {
    defaultFormat: "pdf", // "pdf" | "docx" | "epub" | "html"
    includeMetadata: true,
    includePageNumbers: true,
    includeCoverPage: true,
    includeTableOfContents: true,
    paperSize: "A4", // "A4" | "Letter" | "Legal"
    margins: "normal", // "narrow" | "normal" | "wide"
    quality: "high" // "low" | "medium" | "high"
  },
  
  notifications: {
    enabled: true,
    bookGeneration: true,
    chapterCompletion: true,
    exportReady: true,
    systemUpdates: true,
    emailNotifications: false,
    pushNotifications: true
  },
  
  privacy: {
    analytics: true,
    crashReporting: true,
    usageStatistics: true,
    shareAnonymousData: false
  },
  
  advanced: {
    experimentalFeatures: false,
    betaAccess: false,
    developerMode: false,
    debugLogging: false,
    apiTimeout: 30000 // milliseconds
  }
};

/**
 * Feature flags for controlling application features
 */
export const featureFlags = {
  // Core features
  bookGeneration: true,
  chapterEditing: true,
  aiIntegration: true,
  
  // Advanced features
  collaborativeEditing: false,
  realTimePreview: true,
  voiceInput: false,
  offlineMode: false,
  
  // AI features
  aiReviewEngine: true,
  contentSuggestions: true,
  autoCorrection: false,
  smartFormatting: true,
  
  // Export features
  advancedExport: true,
  batchExport: true,
  customTemplates: false,
  watermarks: false,
  
  // Integration features
  lmsIntegration: false,
  googleDriveSync: false,
  dropboxSync: false,
  oneNoteSync: false,
  
  // Social features
  sharing: true,
  comments: false,
  ratings: false,
  publicLibrary: false
};

// data/sampleContent.js - Sample textbook content for demonstrations

/**
 * Sample textbook content for testing and demonstrations
 */
export const sampleTextbooks = [
  {
    title: "Introduction to Machine Learning",
    subject: "Computer Science",
    chapters: [
      {
        title: "What is Machine Learning?",
        content: `Machine Learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.

## Types of Machine Learning

### 1. Supervised Learning
- Uses labeled training data
- Examples: Classification, Regression
- Algorithms: Linear Regression, Decision Trees, SVM

### 2. Unsupervised Learning  
- Finds patterns in unlabeled data
- Examples: Clustering, Association Rules
- Algorithms: K-Means, Hierarchical Clustering

### 3. Reinforcement Learning
- Learns through interaction and feedback
- Examples: Game playing, Robotics
- Key concepts: Rewards, Actions, States

## Applications
- Image Recognition
- Natural Language Processing
- Recommendation Systems
- Autonomous Vehicles`
      },
      {
        title: "Data Preprocessing",
        content: `Data preprocessing is crucial for successful machine learning. Raw data often contains noise, missing values, and inconsistencies.

## Steps in Data Preprocessing

### 1. Data Cleaning
- Handle missing values
- Remove duplicates
- Fix inconsistencies

### 2. Data Transformation
- Normalization
- Standardization
- Encoding categorical variables

### 3. Feature Selection
- Identify relevant features
- Remove redundant information
- Reduce dimensionality

## Example: Handling Missing Data

\`\`\`python
# Fill missing values with mean
df['age'].fillna(df['age'].mean(), inplace=True)

# Drop rows with missing target values
df.dropna(subset=['target'], inplace=True)
\`\`\`

Quality data preprocessing often determines the success of machine learning projects.`
      }
    ]
  },
  
  {
    title: "Organic Chemistry Fundamentals",
    subject: "Chemistry", 
    chapters: [
      {
        title: "Carbon and Its Compounds",
        content: `Carbon is unique among elements due to its ability to form four covalent bonds and create long chains and rings.

## Properties of Carbon

### Tetravalency
- Carbon has 4 valence electrons
- Forms 4 covalent bonds
- Can bond with other carbons and different elements

### Catenation
- Ability to form long chains
- Creates backbone of organic molecules
- Allows for molecular diversity

## Types of Carbon Compounds

### Alkanes (Saturated Hydrocarbons)
- Single bonds only
- General formula: CₙH₂ₙ₊₂
- Examples: Methane (CH₄), Ethane (C₂H₆)

### Alkenes (Unsaturated Hydrocarbons)
- Contains double bonds
- General formula: CₙH₂ₙ
- Examples: Ethene (C₂H₄), Propene (C₃H₆)

### Alkynes
- Contains triple bonds
- General formula: CₙH₂ₙ₋₂
- Examples: Ethyne (C₂H₂), Propyne (C₃H₄)

## Functional Groups
Functional groups determine the chemical properties of organic compounds:
- Alcohol (-OH)
- Carboxylic acid (-COOH)
- Aldehyde (-CHO)
- Ketone (C=O)`
      }
    ]
  }
];

/**
 * Template content for different subjects
 */
export const contentTemplates = {
  mathematics: {
    chapterStructure: [
      "Introduction",
      "Key Concepts",
      "Formulas and Theorems", 
      "Worked Examples",
      "Practice Problems",
      "Summary"
    ],
    commonSections: [
      "Definition",
      "Properties",
      "Applications",
      "Problem Solving Steps",
      "Common Mistakes"
    ]
  },
  
  science: {
    chapterStructure: [
      "Learning Objectives",
      "Introduction",
      "Theory and Concepts",
      "Experiments and Observations",
      "Real-world Applications", 
      "Summary and Key Points",
      "Review Questions"
    ],
    commonSections: [
      "Scientific Method",
      "Hypothesis",
      "Observation",
      "Analysis",
      "Conclusion"
    ]
  },
  
  literature: {
    chapterStructure: [
      "Background and Context",
      "Literary Analysis",
      "Themes and Motifs",
      "Character Analysis",
      "Literary Devices",
      "Critical Interpretation",
      "Discussion Questions"
    ],
    commonSections: [
      "Author Biography",
      "Historical Context",
      "Plot Summary", 
      "Character Development",
      "Symbolism"
    ]
  },
  
  history: {
    chapterStructure: [
      "Timeline Overview",
      "Historical Context",
      "Key Events and Figures",
      "Causes and Effects",
      "Primary Sources",
      "Historical Significance",
      "Review and Analysis"
    ],
    commonSections: [
      "Chronology",
      "Important Dates",
      "Key Personalities",
      "Social Impact",
      "Economic Factors"
    ]
  }
};

/**
 * Sample questions bank for different subjects
 */
export const questionBank = {
  mathematics: {
    multiple_choice: [
      {
        question: "What is the value of π (pi) approximately?",
        options: ["3.14", "2.71", "1.41", "2.24"],
        correct: 0,
        difficulty: "easy",
        topic: "geometry"
      },
      {
        question: "Solve for x: 2x + 5 = 13",
        options: ["x = 4", "x = 6", "x = 8", "x = 9"],
        correct: 0,
        difficulty: "medium", 
        topic: "algebra"
      }
    ],
    
    short_answer: [
      {
        question: "State the Pythagorean theorem",
        answer: "In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c²",
        difficulty: "easy",
        topic: "geometry"
      },
      {
        question: "What is the derivative of x²?",
        answer: "2x",
        difficulty: "medium",
        topic: "calculus"
      }
    ],
    
    problem_solving: [
      {
        question: "A rectangle has length 12 cm and width 8 cm. Find its area and perimeter.",
        solution: "Area = length × width = 12 × 8 = 96 cm²\nPerimeter = 2(length + width) = 2(12 + 8) = 40 cm",
        difficulty: "easy",
        topic: "geometry"
      }
    ]
  },
  
  science: {
    multiple_choice: [
      {
        question: "What is the chemical symbol for water?",
        options: ["H₂O", "CO₂", "NaCl", "O₂"],
        correct: 0,
        difficulty: "easy",
        topic: "chemistry"
      },
      {
        question: "What is Newton's first law of motion also called?",
        options: ["Law of Action", "Law of Inertia", "Law of Force", "Law of Acceleration"],
        correct: 1,
        difficulty: "medium",
        topic: "physics"
      }
    ]
  }
};

/**
 * Sample rubrics for assessment
 */
export const assessmentRubrics = {
  mathematics: {
    problem_solving: {
      excellent: "Correctly identifies the problem, uses appropriate method, shows all work clearly, arrives at correct answer",
      good: "Identifies problem correctly, uses mostly appropriate method, shows most work, minor errors in calculation",
      satisfactory: "Shows understanding of problem, method has some issues, work shown but incomplete, some errors",
      needs_improvement: "Unclear problem identification, inappropriate method, little work shown, major errors"
    }
  },
  
  writing: {
    essay: {
      excellent: "Clear thesis, well-organized, strong evidence, excellent grammar and style",
      good: "Good thesis, mostly organized, adequate evidence, good grammar with minor errors", 
      satisfactory: "Thesis present, some organization, limited evidence, grammar errors that don't impede understanding",
      needs_improvement: "Unclear or missing thesis, poor organization, insufficient evidence, frequent grammar errors"
    }
  }
};

/**
 * Learning objectives templates
 */
export const learningObjectives = {
  mathematics: {
    algebra: [
      "Solve linear equations in one variable",
      "Graph linear functions and identify key features",
      "Solve systems of linear equations",
      "Factor polynomials and solve quadratic equations"
    ],
    geometry: [
      "Apply properties of triangles and quadrilaterals",
      "Calculate area and perimeter of 2D shapes", 
      "Use the Pythagorean theorem",
      "Understand similarity and congruence"
    ]
  },
  
  science: {
    physics: [
      "Apply Newton's laws of motion to solve problems",
      "Calculate work, energy, and power",
      "Understand wave properties and behavior",
      "Analyze electric circuits using Ohm's law"
    ],
    chemistry: [
      "Balance chemical equations",
      "Predict products of chemical reactions",
      "Calculate molar mass and stoichiometry",
      "Understand atomic structure and periodic trends"
    ]
  }
};