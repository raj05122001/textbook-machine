tbm-frontend/
├── src/
│   ├── app/
│   │   ├── layout.js                    # Root layout
│   │   ├── globals.css                  # Tailwind + global styles
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.jsx                 # Home page ✅
│   │   │
│   │   ├── create-book/
│   │   │   └── page.jsx                 # Upload/Landing page ✅
│   │   │
│   │   ├── books/
│   │   │   ├── page.jsx                 # Books library ✅
│   │   │   └── [id]/
│   │   │       └── page.jsx             # Book reader ✅
│   │   │
│   │   ├── editor/
│   │   │   ├── page.jsx                 # Book editor main
│   │   │   └── [bookId]/
│   │   │       └── page.jsx             # Edit specific book
│   │   │
│   │   └── library/
│   │       ├── page.jsx                 # Advanced library view
│   │       ├── primary/
│   │       │   └── page.jsx             # Primary library
│   │       └── secondary/
│   │           └── page.jsx             # Secondary library
│   │
│   ├── components/
│   │   ├── ui/                          # Basic UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── StatusBadge.jsx
│   │   │
│   │   ├── book/                        # Book components
│   │   │   ├── BookCard.jsx             # 3D book card ✅
│   │   │   ├── BookGrid.jsx             # Books grid ✅
│   │   │   ├── BookReader.jsx           # Flip book reader ✅
│   │   │   ├── ChapterList.jsx          # Chapter navigation
│   │   │   ├── BookStats.jsx            # Statistics ✅
│   │   │   └── BookPreview.jsx          # Preview modal
│   │   │
│   │   ├── editor/                      # Editor components
│   │   │   ├── ChapterEditor.jsx        # Chapter editing
│   │   │   ├── OutlineTree.jsx          # Chapter tree structure
│   │   │   ├── ToolBar.jsx              # Editor toolbar
│   │   │   ├── PreviewPanel.jsx         # Live preview
│   │   │   └── ExportPanel.jsx          # Export options
│   │   │
│   │   ├── upload/                      # Upload components
│   │   │   ├── FileDropzone.jsx         # Drag & drop ✅
│   │   │   ├── FilePreview.jsx          # File list ✅
│   │   │   ├── ModelSelector.jsx        # AI model chooser ✅
│   │   │   └── ProcessingStatus.jsx     # Progress display ✅
│   │   │
│   │   └── layout/                      # Layout components
│   │       ├── Header.jsx               # Top navigation
│   │       ├── Sidebar.jsx              # Side navigation
│   │       └── Footer.jsx               # Footer
│   │
│   ├── data/                           # 📊 STATIC DATA FILES
│   │   ├── books.js                    # All books data
│   │   ├── chapters.js                 # Chapter content
│   │   ├── users.js                    # User profiles
│   │   ├── settings.js                 # App settings
│   │   └── sampleContent.js            # Sample textbook content
│   │
│   ├── hooks/                          # Custom hooks
│   │   ├── useBooks.js                 # Books state management
│   │   ├── useEditor.js                # Editor state
│   │   ├── useUpload.js                # Upload handling
│   │   └── useNavigation.js            # Page navigation
│   │
│   ├── lib/                            # Utilities
│   │   ├── utils.js                    # Helper functions
│   │   ├── constants.js                # App constants
│   │   ├── formatters.js               # Data formatters
│   │   └── exportHelpers.js            # Export utilities
│   │
│   └── styles/                         # Additional styles
│       ├── components.css              # Component-specific styles
│       └── animations.css              # Custom animations
│
├── public/                             # Static assets
│   ├── icons/
│   ├── images/
│   └── samples/
│
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md