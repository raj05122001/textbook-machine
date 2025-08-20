// data/books.js - Static books data for TBM

/**
 * Static books data for demonstration and development
 */
export const booksData = [
  {
    id: 1,
    title: "Mathematics for Class 10",
    subtitle: "Algebra • Geometry • Trigonometry • Statistics",
    author: "AI Generated",
    subject: "Mathematics",
    grade: "Class 10",
    language: "English",
    aiModel: "gpt-5",
    status: "completed",
    color: "from-emerald-500 to-teal-600",
    createdAt: "2024-12-15T10:30:00Z",
    updatedAt: "2024-12-16T14:45:00Z",
    pages: 45,
    wordCount: 12500,
    difficulty: "intermediate",
    tags: ["mathematics", "algebra", "geometry", "trigonometry", "statistics", "class-10"],
    estimatedReadTime: "3 hours",
    version: "1.2",
    chapters: [
      {
        id: 101,
        title: "Algebra Foundations",
        description: "Introduction to variables, constants, expressions, and linear equations",
        content: "In this chapter, we explore the fundamental concepts of algebra...",
        status: "completed",
        order: 1,
        pages: 8,
        wordCount: 2200,
        createdAt: "2024-12-15T10:30:00Z",
        updatedAt: "2024-12-15T16:20:00Z",
        sections: [
          { title: "Variables and Constants", pages: 2 },
          { title: "Linear Equations", pages: 3 },
          { title: "Solving Systems", pages: 3 }
        ],
        summary: "This chapter covers the basics of algebraic thinking, including variables, constants, and solving linear equations.",
        questions: [
          "What is the difference between a variable and a constant?",
          "Solve for x: 3x + 5 = 20",
          "How do you solve a system of linear equations?"
        ],
        references: [
          "Algebra Textbook by Smith, J. (2023)",
          "Khan Academy Algebra Course"
        ]
      },
      {
        id: 102,
        title: "Geometry Basics",
        description: "Points, lines, angles, triangles, and circle properties",
        content: "Geometry is the study of shapes, sizes, and spatial relationships...",
        status: "completed",
        order: 2,
        pages: 12,
        wordCount: 3400,
        createdAt: "2024-12-15T11:00:00Z",
        updatedAt: "2024-12-15T17:30:00Z",
        sections: [
          { title: "Points and Lines", pages: 3 },
          { title: "Angles and Triangles", pages: 5 },
          { title: "Circles", pages: 4 }
        ],
        summary: "Understanding basic geometric shapes and their properties, including triangles, circles, and coordinate geometry.",
        questions: [
          "What is the Pythagorean theorem?",
          "Calculate the area of a circle with radius 5cm",
          "What are the properties of an isosceles triangle?"
        ],
        references: [
          "Geometry Fundamentals by Davis, M. (2023)",
          "Euclidean Geometry Principles"
        ]
      },
      {
        id: 103,
        title: "Trigonometry",
        description: "Trigonometric ratios, identities, and real-world applications",
        content: "Trigonometry deals with the relationships between angles and sides in triangles...",
        status: "completed",
        order: 3,
        pages: 15,
        wordCount: 4200,
        createdAt: "2024-12-15T12:00:00Z",
        updatedAt: "2024-12-16T09:15:00Z",
        sections: [
          { title: "Trigonometric Ratios", pages: 5 },
          { title: "Identities and Formulas", pages: 6 },
          { title: "Applications", pages: 4 }
        ],
        summary: "Comprehensive coverage of trigonometric concepts including ratios, identities, and practical applications.",
        questions: [
          "What are the six trigonometric ratios?",
          "Prove that sin²θ + cos²θ = 1",
          "Find the height of a building using trigonometry"
        ],
        references: [
          "Trigonometry Made Easy by Wilson, R. (2023)",
          "Advanced Trigonometry Applications"
        ]
      },
      {
        id: 104,
        title: "Statistics",
        description: "Data analysis, measures of central tendency, and probability",
        content: "Statistics helps us collect, analyze, and interpret data to make informed decisions...",
        status: "completed",
        order: 4,
        pages: 10,
        wordCount: 2700,
        createdAt: "2024-12-15T13:00:00Z",
        updatedAt: "2024-12-16T11:30:00Z",
        sections: [
          { title: "Data Collection", pages: 2 },
          { title: "Central Tendency", pages: 4 },
          { title: "Probability Basics", pages: 4 }
        ],
        summary: "Introduction to statistical concepts including data collection, analysis, and basic probability theory.",
        questions: [
          "What is the difference between mean, median, and mode?",
          "Calculate the probability of getting heads in a coin toss",
          "How do you create a frequency distribution?"
        ],
        references: [
          "Statistics for Beginners by Taylor, K. (2023)",
          "Probability Theory Basics"
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Physics Essentials",
    subtitle: "Motion • Force • Energy • Electricity • Magnetism",
    author: "AI Generated",
    subject: "Physics",
    grade: "Class 11",
    language: "English",
    aiModel: "claude",
    status: "completed",
    color: "from-indigo-500 to-blue-600",
    createdAt: "2024-12-10T09:15:00Z",
    updatedAt: "2024-12-12T16:20:00Z",
    pages: 38,
    wordCount: 11200,
    difficulty: "advanced",
    tags: ["physics", "motion", "force", "energy", "electricity", "magnetism"],
    estimatedReadTime: "2.5 hours",
    version: "1.1",
    chapters: [
      {
        id: 201,
        title: "Laws of Motion",
        description: "Newton's laws and their applications in everyday life",
        content: "Sir Isaac Newton's laws of motion form the foundation of classical mechanics...",
        status: "completed",
        order: 1,
        pages: 10,
        wordCount: 2800,
        createdAt: "2024-12-10T09:15:00Z",
        updatedAt: "2024-12-10T15:45:00Z",
        sections: [
          { title: "First Law of Motion", pages: 3 },
          { title: "Second Law of Motion", pages: 4 },
          { title: "Third Law of Motion", pages: 3 }
        ],
        summary: "Understanding Newton's three laws of motion and their practical applications in solving physics problems.",
        questions: [
          "State Newton's first law of motion",
          "Calculate force using F = ma",
          "Give examples of action-reaction pairs"
        ],
        references: [
          "Classical Mechanics by Goldstein, H. (2023)",
          "Physics Principles by Halliday & Resnick"
        ]
      },
      {
        id: 202,
        title: "Work and Energy",
        description: "Understanding work, energy, and power in physical systems",
        content: "Work and energy are fundamental concepts that help us understand how forces affect motion...",
        status: "completed",
        order: 2,
        pages: 12,
        wordCount: 3200,
        createdAt: "2024-12-10T10:30:00Z",
        updatedAt: "2024-12-11T14:20:00Z",
        sections: [
          { title: "Work and Power", pages: 4 },
          { title: "Kinetic Energy", pages: 4 },
          { title: "Potential Energy", pages: 4 }
        ],
        summary: "Comprehensive study of work-energy theorem, conservation of energy, and power calculations.",
        questions: [
          "What is the relationship between work and energy?",
          "Calculate kinetic energy of a moving object",
          "Explain conservation of mechanical energy"
        ],
        references: [
          "Energy Physics by Johnson, L. (2023)",
          "Thermodynamics and Energy Systems"
        ]
      },
      {
        id: 203,
        title: "Electricity",
        description: "Electric current, circuits, and electromagnetic phenomena",
        content: "Electricity is one of the most important forms of energy in modern life...",
        status: "completed",
        order: 3,
        pages: 16,
        wordCount: 5200,
        createdAt: "2024-12-10T11:45:00Z",
        updatedAt: "2024-12-12T16:20:00Z",
        sections: [
          { title: "Electric Current", pages: 5 },
          { title: "Ohm's Law", pages: 6 },
          { title: "Electric Circuits", pages: 5 }
        ],
        summary: "Detailed exploration of electric current, voltage, resistance, and circuit analysis using Ohm's law.",
        questions: [
          "What is electric current and how is it measured?",
          "Apply Ohm's law to solve circuit problems",
          "Calculate total resistance in series and parallel circuits"
        ],
        references: [
          "Electrical Engineering Fundamentals by Brown, P. (2023)",
          "Circuit Analysis Textbook"
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Chemistry Basics",
    subtitle: "Atoms • Molecules • Reactions • Acids & Bases",
    author: "AI Generated",
    subject: "Chemistry",
    grade: "Class 10",
    language: "English",
    aiModel: "gemini",
    status: "draft",
    color: "from-rose-500 to-orange-500",
    createdAt: "2024-12-08T14:20:00Z",
    updatedAt: "2024-12-08T18:30:00Z",
    pages: 22,
    wordCount: 6800,
    difficulty: "intermediate",
    tags: ["chemistry", "atoms", "molecules", "reactions", "acids", "bases"],
    estimatedReadTime: "2 hours",
    version: "1.0",
    chapters: [
      {
        id: 301,
        title: "Atoms and Molecules",
        description: "Basic structure of matter and atomic theory",
        content: "Everything around us is made up of tiny particles called atoms...",
        status: "completed",
        order: 1,
        pages: 8,
        wordCount: 2400,
        createdAt: "2024-12-08T14:20:00Z",
        updatedAt: "2024-12-08T16:45:00Z",
        sections: [
          { title: "Atomic Structure", pages: 3 },
          { title: "Molecular Formation", pages: 3 },
          { title: "Chemical Bonding", pages: 2 }
        ],
        summary: "Understanding the basic building blocks of matter, from atoms to molecules and chemical bonds.",
        questions: [
          "What are the components of an atom?",
          "How do atoms form molecules?",
          "Explain ionic and covalent bonding"
        ],
        references: [
          "Atomic Theory by Lewis, C. (2023)",
          "Modern Chemistry Principles"
        ]
      },
      {
        id: 302,
        title: "Chemical Reactions",
        description: "Types of reactions and balancing chemical equations",
        content: "Chemical reactions involve the rearrangement of atoms to form new substances...",
        status: "draft",
        order: 2,
        pages: 10,
        wordCount: 2800,
        createdAt: "2024-12-08T15:30:00Z",
        updatedAt: "2024-12-08T17:15:00Z",
        sections: [
          { title: "Types of Reactions", pages: 4 },
          { title: "Balancing Equations", pages: 3 },
          { title: "Reaction Rates", pages: 3 }
        ],
        summary: "Comprehensive guide to chemical reactions, equation balancing, and factors affecting reaction rates.",
        questions: [
          "What are the main types of chemical reactions?",
          "How do you balance a chemical equation?",
          "What factors affect the rate of a reaction?"
        ],
        references: [
          "Chemical Reactions Guide by Martinez, A. (2023)",
          "Organic Chemistry Basics"
        ]
      },
      {
        id: 303,
        title: "Acids and Bases",
        description: "Properties, indicators, and pH scale",
        content: "Acids and bases are important classes of compounds with distinct properties...",
        status: "pending",
        order: 3,
        pages: 4,
        wordCount: 1600,
        createdAt: "2024-12-08T16:45:00Z",
        updatedAt: "2024-12-08T18:30:00Z",
        sections: [
          { title: "Acid Properties", pages: 1 },
          { title: "Base Properties", pages: 1 },
          { title: "pH Scale", pages: 2 }
        ],
        summary: "Introduction to acids, bases, their properties, and the pH scale for measuring acidity.",
        questions: [
          "What are the properties of acids and bases?",
          "How is pH measured?",
          "What happens when acids and bases react?"
        ],
        references: [
          "Acid-Base Chemistry by Thompson, R. (2023)",
          "pH and Chemical Indicators"
        ]
      }
    ]
  },
  {
    id: 4,
    title: "English Literature Guide",
    subtitle: "Poetry • Drama • Prose • Writing Skills",
    author: "AI Generated",
    subject: "English",
    grade: "Class 12",
    language: "English",
    aiModel: "gpt-5",
    status: "completed",
    color: "from-purple-500 to-pink-500",
    createdAt: "2024-12-12T08:00:00Z",
    updatedAt: "2024-12-14T12:30:00Z",
    pages: 52,
    wordCount: 15600,
    difficulty: "advanced",
    tags: ["english", "literature", "poetry", "drama", "prose", "writing"],
    estimatedReadTime: "4 hours",
    version: "1.3",
    chapters: [
      {
        id: 401,
        title: "Poetry Analysis",
        description: "Understanding poetic devices, themes, and interpretation",
        content: "Poetry is the art of expressing emotions and ideas through carefully chosen words...",
        status: "completed",
        order: 1,
        pages: 15,
        wordCount: 4500,
        createdAt: "2024-12-12T08:00:00Z",
        updatedAt: "2024-12-12T14:20:00Z",
        sections: [
          { title: "Poetic Devices", pages: 5 },
          { title: "Themes and Motifs", pages: 5 },
          { title: "Analysis Techniques", pages: 5 }
        ],
        summary: "Comprehensive guide to analyzing poetry, including literary devices, themes, and interpretation methods.",
        questions: [
          "What are the main poetic devices?",
          "How do you identify themes in poetry?",
          "What is the difference between metaphor and simile?"
        ],
        references: [
          "Poetry Analysis Handbook by Greene, S. (2023)",
          "Classical and Modern Poetry"
        ]
      },
      {
        id: 402,
        title: "Drama Studies",
        description: "Elements of drama, character analysis, and theatrical techniques",
        content: "Drama combines literature with performance to tell stories through dialogue and action...",
        status: "completed",
        order: 2,
        pages: 18,
        wordCount: 5400,
        createdAt: "2024-12-12T09:30:00Z",
        updatedAt: "2024-12-13T16:45:00Z",
        sections: [
          { title: "Elements of Drama", pages: 6 },
          { title: "Character Development", pages: 6 },
          { title: "Dramatic Techniques", pages: 6 }
        ],
        summary: "In-depth study of dramatic literature, including character analysis and theatrical conventions.",
        questions: [
          "What are the key elements of drama?",
          "How do you analyze character development?",
          "What is the role of conflict in drama?"
        ],
        references: [
          "Drama and Theatre Studies by Collins, M. (2023)",
          "Shakespeare and Modern Drama"
        ]
      },
      {
        id: 403,
        title: "Prose Techniques",
        description: "Narrative techniques, character development, and thematic analysis",
        content: "Prose fiction uses narrative techniques to create compelling stories and complex characters...",
        status: "completed",
        order: 3,
        pages: 12,
        wordCount: 3600,
        createdAt: "2024-12-12T11:00:00Z",
        updatedAt: "2024-12-13T18:20:00Z",
        sections: [
          { title: "Narrative Voice", pages: 4 },
          { title: "Plot Structure", pages: 4 },
          { title: "Setting and Atmosphere", pages: 4 }
        ],
        summary: "Analysis of prose fiction focusing on narrative techniques, plot development, and literary themes.",
        questions: [
          "What are different types of narrative voice?",
          "How does setting influence a story?",
          "What is the role of symbolism in prose?"
        ],
        references: [
          "Prose Fiction Analysis by Roberts, J. (2023)",
          "Modern Literary Techniques"
        ]
      },
      {
        id: 404,
        title: "Essay Writing",
        description: "Structure, argumentation, and academic writing skills",
        content: "Effective essay writing requires clear structure, strong arguments, and proper evidence...",
        status: "completed",
        order: 4,
        pages: 7,
        wordCount: 2100,
        createdAt: "2024-12-12T12:30:00Z",
        updatedAt: "2024-12-14T12:30:00Z",
        sections: [
          { title: "Essay Structure", pages: 2 },
          { title: "Argumentation", pages: 3 },
          { title: "Citation and References", pages: 2 }
        ],
        summary: "Practical guide to writing effective essays, including structure, argumentation, and academic conventions.",
        questions: [
          "What is the standard essay structure?",
          "How do you develop a strong thesis statement?",
          "What are the rules for academic citation?"
        ],
        references: [
          "Academic Writing Guide by Anderson, K. (2023)",
          "Essay Writing Techniques"
        ]
      }
    ]
  },
  {
    id: 5,
    title: "History of India",
    subtitle: "Ancient • Medieval • Modern • Independence Movement",
    author: "AI Generated",
    subject: "History",
    grade: "Class 8",
    language: "English",
    aiModel: "claude",
    status: "processing",
    color: "from-amber-500 to-orange-600",
    createdAt: "2024-12-14T10:15:00Z",
    updatedAt: "2024-12-14T15:30:00Z",
    pages: 35,
    wordCount: 9800,
    difficulty: "intermediate",
    tags: ["history", "india", "ancient", "medieval", "modern", "independence"],
    estimatedReadTime: "3 hours",
    version: "1.0",
    chapters: [
      {
        id: 501,
        title: "Ancient India",
        description: "Indus Valley Civilization to Gupta Empire",
        content: "Ancient India witnessed the rise of great civilizations and empires...",
        status: "completed",
        order: 1,
        pages: 12,
        wordCount: 3500,
        createdAt: "2024-12-14T10:15:00Z",
        updatedAt: "2024-12-14T13:20:00Z",
        sections: [
          { title: "Indus Valley Civilization", pages: 4 },
          { title: "Vedic Period", pages: 4 },
          { title: "Mauryan Empire", pages: 4 }
        ],
        summary: "Journey through ancient Indian history from the Harappan civilization to the golden age of the Guptas.",
        questions: [
          "What were the main features of Indus Valley Civilization?",
          "Who was Chandragupta Maurya?",
          "What were the achievements of the Gupta period?"
        ],
        references: [
          "Ancient Indian History by Sharma, R. (2023)",
          "Harappan Civilization Studies"
        ]
      },
      {
        id: 502,
        title: "Medieval India",
        description: "Delhi Sultanate to Mughal Empire",
        content: "Medieval India saw the establishment of Islamic empires and cultural synthesis...",
        status: "generating",
        order: 2,
        pages: 10,
        wordCount: 2800,
        createdAt: "2024-12-14T11:30:00Z",
        updatedAt: "2024-12-14T14:45:00Z",
        sections: [
          { title: "Delhi Sultanate", pages: 4 },
          { title: "Mughal Empire", pages: 4 },
          { title: "Regional Kingdoms", pages: 2 }
        ],
        summary: "Exploration of medieval Indian history focusing on Islamic rulers and cultural developments.",
        questions: [
          "Who founded the Delhi Sultanate?",
          "What were Akbar's policies?",
          "How did regional kingdoms maintain independence?"
        ],
        references: [
          "Medieval Indian History by Patel, A. (2023)",
          "Mughal Empire Chronicles"
        ]
      },
      {
        id: 503,
        title: "Modern India",
        description: "British Colonial Period and Independence Movement",
        content: "Modern India's history is marked by colonial rule and the struggle for independence...",
        status: "pending",
        order: 3,
        pages: 13,
        wordCount: 3500,
        createdAt: "2024-12-14T12:45:00Z",
        updatedAt: "2024-12-14T15:30:00Z",
        sections: [
          { title: "British East India Company", pages: 4 },
          { title: "Freedom Struggle", pages: 6 },
          { title: "Independence and Partition", pages: 3 }
        ],
        summary: "Comprehensive study of colonial period and India's journey to independence in 1947.",
        questions: [
          "How did the British establish control over India?",
          "What role did Gandhi play in independence?",
          "What were the consequences of partition?"
        ],
        references: [
          "Modern Indian History by Gupta, V. (2023)",
          "Freedom Struggle Documents"
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Computer Science Fundamentals",
    subtitle: "Programming • Data Structures • Algorithms • Web Development",
    author: "AI Generated",
    subject: "Computer Science",
    grade: "Class 12",
    language: "English",
    aiModel: "gpt-5",
    status: "completed",
    color: "from-gray-500 to-slate-600",
    createdAt: "2024-12-05T09:00:00Z",
    updatedAt: "2024-12-07T17:45:00Z",
    pages: 48,
    wordCount: 14200,
    difficulty: "advanced",
    tags: ["computer-science", "programming", "algorithms", "data-structures", "web-development"],
    estimatedReadTime: "3.5 hours",
    version: "2.0",
    chapters: [
      {
        id: 601,
        title: "Introduction to Programming",
        description: "Basic programming concepts and Python fundamentals",
        content: "Programming is the art of giving instructions to computers to solve problems...",
        status: "completed",
        order: 1,
        pages: 12,
        wordCount: 3600,
        createdAt: "2024-12-05T09:00:00Z",
        updatedAt: "2024-12-05T15:30:00Z",
        sections: [
          { title: "Programming Logic", pages: 4 },
          { title: "Python Basics", pages: 4 },
          { title: "Control Structures", pages: 4 }
        ],
        summary: "Foundation course in programming covering logic, syntax, and basic Python programming concepts.",
        questions: [
          "What is an algorithm?",
          "How do you write a simple Python program?",
          "What are loops and when do you use them?"
        ],
        references: [
          "Python Programming by Van Rossum, G. (2023)",
          "Introduction to Computer Science"
        ]
      },
      {
        id: 602,
        title: "Data Structures",
        description: "Arrays, lists, stacks, queues, and trees",
        content: "Data structures are ways of organizing and storing data efficiently...",
        status: "completed",
        order: 2,
        pages: 15,
        wordCount: 4500,
        createdAt: "2024-12-05T10:30:00Z",
        updatedAt: "2024-12-06T14:20:00Z",
        sections: [
          { title: "Linear Data Structures", pages: 6 },
          { title: "Trees and Graphs", pages: 6 },
          { title: "Hash Tables", pages: 3 }
        ],
        summary: "Comprehensive study of data structures including arrays, linked lists, trees, and their applications.",
        questions: [
          "What is the difference between array and linked list?",
          "How do you implement a binary tree?",
          "What are the advantages of hash tables?"
        ],
        references: [
          "Data Structures and Algorithms by Cormen, T. (2023)",
          "Computer Science Theory"
        ]
      },
      {
        id: 603,
        title: "Algorithms",
        description: "Sorting, searching, and optimization algorithms",
        content: "Algorithms are step-by-step procedures for solving computational problems...",
        status: "completed",
        order: 3,
        pages: 13,
        wordCount: 3900,
        createdAt: "2024-12-05T12:00:00Z",
        updatedAt: "2024-12-06T16:45:00Z",
        sections: [
          { title: "Sorting Algorithms", pages: 5 },
          { title: "Searching Algorithms", pages: 4 },
          { title: "Dynamic Programming", pages: 4 }
        ],
        summary: "Study of fundamental algorithms including sorting, searching, and dynamic programming techniques.",
        questions: [
          "What is the time complexity of quicksort?",
          "How does binary search work?",
          "What is dynamic programming?"
        ],
        references: [
          "Algorithm Design by Kleinberg, J. (2023)",
          "Computational Complexity Theory"
        ]
      },
      {
        id: 604,
        title: "Web Development",
        description: "HTML, CSS, JavaScript, and modern web technologies",
        content: "Web development involves creating websites and web applications...",
        status: "completed",
        order: 4,
        pages: 8,
        wordCount: 2200,
        createdAt: "2024-12-05T14:00:00Z",
        updatedAt: "2024-12-07T17:45:00Z",
        sections: [
          { title: "Frontend Technologies", pages: 4 },
          { title: "Backend Basics", pages: 2 },
          { title: "Full Stack Development", pages: 2 }
        ],
        summary: "Introduction to web development covering frontend and backend technologies for modern applications.",
        questions: [
          "What are the building blocks of a webpage?",
          "How does JavaScript make web pages interactive?",
          "What is the difference between frontend and backend?"
        ],
        references: [
          "Web Development Guide by Mozilla Foundation (2023)",
          "Modern JavaScript Frameworks"
        ]
      }
    ]
  }
];