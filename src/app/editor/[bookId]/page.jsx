'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Save, 
  Undo, 
  Redo, 
  Eye, 
  EyeOff, 
  Settings, 
  Download, 
  Share2,
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Move,
  Copy,
  FileText,
  Hash,
  Bold,
  Italic,
  Underline,
  Link,
  Image,
  Code,
  Quote,
  List,
  ListOrdered,
  Table,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  Target,
  Clock,
  User,
  Calendar,
  Tag,
  Star,
  MessageSquare,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Upload,
  X,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Maximize2,
  Minimize2
} from 'lucide-react';

// Sample book data with comprehensive structure
const sampleBookData = {
  'ds-fundamentals': {
    id: 'ds-fundamentals',
    title: 'Data Science Fundamentals',
    subtitle: 'Complete Guide to Data Analysis and Machine Learning',
    author: 'Dr. Sarah Chen',
    description: 'Comprehensive introduction to data science covering statistics, programming, and machine learning fundamentals.',
    status: 'editing',
    language: 'English',
    difficulty: 'intermediate',
    estimatedReadTime: '8 hours',
    tags: ['data science', 'machine learning', 'python', 'statistics'],
    metadata: {
      created: '2024-08-15T09:00:00Z',
      lastModified: '2024-08-20T10:30:00Z',
      version: '1.2.0',
      totalPages: 234,
      totalWords: 45680,
      progress: 78
    },
    settings: {
      autoSave: true,
      autoSaveInterval: 30,
      showPreview: true,
      previewMode: 'side',
      fontSize: 16,
      fontFamily: 'Inter',
      theme: 'light',
      showWordCount: true,
      showReadingTime: true,
      enableCollaboration: false
    },
    outline: [
      {
        id: 'intro',
        type: 'chapter',
        title: 'Introduction to Data Science',
        description: 'Overview of data science field and applications',
        order: 1,
        status: 'completed',
        estimatedTime: '45 min',
        wordCount: 3200,
        expanded: true,
        children: [
          {
            id: 'intro-what-is',
            type: 'section',
            title: 'What is Data Science?',
            description: 'Definition and core concepts',
            order: 1,
            status: 'completed',
            wordCount: 800,
            children: []
          },
          {
            id: 'intro-process',
            type: 'section',
            title: 'The Data Science Process',
            description: 'Step-by-step methodology',
            order: 2,
            status: 'completed',
            wordCount: 1200,
            children: []
          },
          {
            id: 'intro-applications',
            type: 'section',
            title: 'Applications and Use Cases',
            description: 'Real-world examples',
            order: 3,
            status: 'completed',
            wordCount: 1200,
            children: []
          }
        ]
      },
      {
        id: 'python-basics',
        type: 'chapter',
        title: 'Python Programming Basics',
        description: 'Essential Python skills for data science',
        order: 2,
        status: 'editing',
        estimatedTime: '90 min',
        wordCount: 5800,
        expanded: false,
        children: [
          {
            id: 'python-fundamentals',
            type: 'section',
            title: 'Python Fundamentals',
            description: 'Variables, data types, and control flow',
            order: 1,
            status: 'completed',
            wordCount: 2000,
            children: []
          },
          {
            id: 'python-libraries',
            type: 'section',
            title: 'Essential Libraries',
            description: 'NumPy, Pandas, and Matplotlib',
            order: 2,
            status: 'editing',
            wordCount: 2400,
            children: []
          },
          {
            id: 'python-exercises',
            type: 'section',
            title: 'Practice Exercises',
            description: 'Hands-on coding challenges',
            order: 3,
            status: 'draft',
            wordCount: 1400,
            children: []
          }
        ]
      },
      {
        id: 'data-preprocessing',
        type: 'chapter',
        title: 'Data Preprocessing and Feature Engineering',
        description: 'Cleaning and preparing data for analysis',
        order: 3,
        status: 'draft',
        estimatedTime: '120 min',
        wordCount: 6200,
        expanded: false,
        children: []
      },
      {
        id: 'visualization',
        type: 'chapter',
        title: 'Data Visualization',
        description: 'Creating effective charts and graphs',
        order: 4,
        status: 'draft',
        estimatedTime: '75 min',
        wordCount: 4100,
        expanded: false,
        children: []
      },
      {
        id: 'machine-learning',
        type: 'chapter',
        title: 'Introduction to Machine Learning',
        description: 'Supervised and unsupervised learning algorithms',
        order: 5,
        status: 'planning',
        estimatedTime: '150 min',
        wordCount: 0,
        expanded: false,
        children: []
      },
      {
        id: 'projects',
        type: 'chapter',
        title: 'Real-world Projects',
        description: 'Complete data science project walkthroughs',
        order: 6,
        status: 'planning',
        estimatedTime: '200 min',
        wordCount: 0,
        expanded: false,
        children: []
      }
    ],
    content: {
      'intro': `# Introduction to Data Science

Data science has emerged as one of the most exciting and impactful fields of the 21st century. It combines statistical analysis, computer programming, and domain expertise to extract meaningful insights from data.

## What is Data Science?

Data science is an interdisciplinary field that uses scientific methods, processes, algorithms, and systems to extract knowledge and insights from structured and unstructured data. It combines:

- **Statistics & Mathematics**: Foundation for understanding patterns and relationships
- **Computer Science**: Programming skills for data manipulation and analysis  
- **Domain Expertise**: Subject matter knowledge to interpret results meaningfully

## The Data Science Process

### 1. Problem Definition
Every data science project begins with a clear understanding of the business problem or research question. This involves:
- Identifying stakeholders and their needs
- Defining success metrics
- Understanding constraints and limitations

### 2. Data Collection
Gathering relevant data from various sources:
- Databases and data warehouses
- APIs and web scraping
- Surveys and experiments
- External data sources

### 3. Data Exploration & Cleaning
Understanding the data through:
- Descriptive statistics
- Data visualization
- Identifying missing values and outliers
- Data quality assessment

## Applications of Data Science

Data science applications span across industries:

**Healthcare**: Predictive modeling for disease diagnosis, drug discovery, and personalized treatment plans.

**Finance**: Fraud detection, algorithmic trading, risk assessment, and credit scoring.

**Technology**: Recommendation systems, search algorithms, and user behavior analysis.

**Transportation**: Route optimization, autonomous vehicles, and traffic management.

**Retail**: Customer segmentation, demand forecasting, and price optimization.`,
      'python-fundamentals': `# Python Fundamentals

Python has become the de facto programming language for data science due to its simplicity, readability, and extensive ecosystem of libraries.

## Variables and Data Types

\`\`\`python
# Numbers
age = 25
height = 5.9
complex_num = 3 + 4j

# Strings
name = "Alice"
description = '''Multi-line
string example'''

# Boolean
is_student = True

# None type
result = None
\`\`\`

## Data Structures

### Lists
\`\`\`python
# Creating lists
numbers = [1, 2, 3, 4, 5]
mixed_list = [1, "hello", 3.14, True]

# List operations
numbers.append(6)        # Add element
numbers.extend([7, 8])   # Add multiple elements
numbers.insert(0, 0)     # Insert at position
\`\`\`

### Dictionaries
\`\`\`python
# Creating dictionaries
person = {
    "name": "John",
    "age": 30,
    "city": "New York"
}

# Accessing values
name = person["name"]
age = person.get("age", 0)  # With default value
\`\`\`

## Control Flow

### Conditional Statements
\`\`\`python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
\`\`\`

### Loops
\`\`\`python
# For loops
for i in range(5):
    print(f"Iteration {i}")

for item in ["apple", "banana", "cherry"]:
    print(item)

# While loops
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\``
    }
  }
};

const statusConfig = {
  planning: { 
    label: 'Planning', 
    color: 'bg-gray-100 text-gray-800', 
    icon: Target,
    description: 'Content planning phase'
  },
  draft: { 
    label: 'Draft', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Edit3,
    description: 'Initial draft'
  },
  editing: { 
    label: 'Editing', 
    color: 'bg-blue-100 text-blue-800', 
    icon: Edit3,
    description: 'Currently being edited'
  },
  review: { 
    label: 'Review', 
    color: 'bg-purple-100 text-purple-800', 
    icon: Eye,
    description: 'Under review'
  },
  completed: { 
    label: 'Completed', 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle,
    description: 'Content complete'
  }
};

const BookEditorPage = () => {
  const params = useParams();
  const router = useRouter();
  const { bookId } = params;
  
  // Core state
  const [book, setBook] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  // UI state
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState('side'); // 'side', 'overlay', 'fullscreen'
  const [showOutline, setShowOutline] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [editorFontSize, setEditorFontSize] = useState(16);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  
  // Toolbar state
  const [activeToolbar, setActiveToolbar] = useState('formatting');
  const [showToolbarDropdown, setShowToolbarDropdown] = useState(null);
  
  // Outline state
  const [expandedNodes, setExpandedNodes] = useState(new Set(['intro']));
  const [draggedNode, setDraggedNode] = useState(null);
  
  // Search and filter
  const [outlineSearch, setOutlineSearch] = useState('');
  const [outlineFilter, setOutlineFilter] = useState('all');
  
  // Refs
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const autoSaveTimer = useRef(null);
  const sidebarResizeRef = useRef(null);

  // Load book data
  useEffect(() => {
    const loadBook = async () => {
      setIsLoading(true);
      try {
        // In real app, fetch from API
        const bookData = sampleBookData[bookId];
        if (bookData) {
          setBook(bookData);
          // Set initial selected node to first chapter
          const firstChapter = bookData.outline.find(node => node.type === 'chapter');
          if (firstChapter) {
            setSelectedNode(firstChapter);
            setEditorContent(bookData.content[firstChapter.id] || '');
          }
          setLastSaved(new Date());
        } else {
          router.push('/editor');
        }
      } catch (error) {
        console.error('Error loading book:', error);
        router.push('/editor');
      } finally {
        setIsLoading(false);
      }
    };

    loadBook();
  }, [bookId, router]);

  // Auto-save functionality
  useEffect(() => {
    if (!book?.settings.autoSave || !hasUnsavedChanges) return;

    const saveInterval = book.settings.autoSaveInterval * 1000;
    autoSaveTimer.current = setTimeout(async () => {
      await handleSave();
    }, saveInterval);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [editorContent, hasUnsavedChanges, book?.settings]);

  // Update word count and reading time
  useEffect(() => {
    if (editorContent) {
      const words = editorContent.trim().split(/\s+/).filter(word => word.length > 0).length;
      setWordCount(words);
      setReadingTime(Math.ceil(words / 200)); // Average reading speed: 200 WPM
    } else {
      setWordCount(0);
      setReadingTime(0);
    }
  }, [editorContent]);

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'b':
            e.preventDefault();
            insertFormatting('**', '**', 'bold text');
            break;
          case 'i':
            e.preventDefault();
            insertFormatting('*', '*', 'italic text');
            break;
          case 'k':
            e.preventDefault();
            insertFormatting('[', '](url)', 'link text');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);

  // Action handlers
  const handleSave = useCallback(async () => {
    try {
      // In real app, save to backend
      const updatedBook = {
        ...book,
        content: {
          ...book.content,
          [selectedNode?.id]: editorContent
        },
        metadata: {
          ...book.metadata,
          lastModified: new Date().toISOString()
        }
      };
      setBook(updatedBook);
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      
      // Show success notification (you can implement toast notifications)
      console.log('Book saved successfully');
    } catch (error) {
      console.error('Error saving book:', error);
      // Show error notification
    }
  }, [book, selectedNode, editorContent]);

  const handleUndo = () => {
    // Implement undo functionality
    console.log('Undo');
  };

  const handleRedo = () => {
    // Implement redo functionality
    console.log('Redo');
  };

  const handleNodeSelect = (node) => {
    // Save current content before switching
    if (selectedNode && hasUnsavedChanges) {
      setBook(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [selectedNode.id]: editorContent
        }
      }));
    }
    
    setSelectedNode(node);
    setEditorContent(book.content[node.id] || '');
    setHasUnsavedChanges(false);
  };

  const handleContentChange = (content) => {
    setEditorContent(content);
    setHasUnsavedChanges(true);
  };

  const insertFormatting = (prefix, suffix, placeholder) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    const replacement = selectedText || placeholder;
    const newContent = 
      editorContent.substring(0, start) + 
      prefix + replacement + suffix + 
      editorContent.substring(end);
    
    setEditorContent(newContent);
    setHasUnsavedChanges(true);
    
    // Set cursor position
    setTimeout(() => {
      const newCursorPos = start + prefix.length + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const toggleNodeExpansion = (nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const addNewNode = (parentId, type) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type,
      title: `New ${type}`,
      description: '',
      order: 1,
      status: 'planning',
      wordCount: 0,
      children: []
    };

    // Implementation for adding nodes to outline
    console.log('Adding new node:', newNode, 'to parent:', parentId);
  };

  const deleteNode = (nodeId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      // Implementation for deleting nodes
      console.log('Deleting node:', nodeId);
    }
  };

  const handleExport = (format) => {
    console.log(`Exporting book as ${format}`);
    // Implementation for export functionality
  };

  // Render functions
  const renderOutlineNode = (node, level = 0) => {
    const isSelected = selectedNode?.id === node.id;
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const StatusIcon = statusConfig[node.status]?.icon || FileText;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-colors group ${
            isSelected 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
              : 'hover:bg-gray-50'
          }`}
          style={{ paddingLeft: `${12 + level * 20}px` }}
          onClick={() => handleNodeSelect(node)}
        >
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNodeExpansion(node.id);
              }}
              className="flex-shrink-0 p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          
          {/* Node Icon */}
          <div className="flex-shrink-0">
            {node.type === 'chapter' ? (
              <BookOpen className="h-4 w-4 text-emerald-600" />
            ) : (
              <FileText className="h-4 w-4 text-gray-500" />
            )}
          </div>

          {/* Node Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium truncate">
                {node.title}
              </span>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className={`px-1.5 py-0.5 rounded text-xs ${statusConfig[node.status]?.color}`}>
                  {statusConfig[node.status]?.label}
                </span>
              </div>
            </div>
            {node.description && (
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {node.description}
              </p>
            )}
            <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
              {node.wordCount > 0 && (
                <span>{node.wordCount} words</span>
              )}
              {node.estimatedTime && (
                <span>{node.estimatedTime}</span>
              )}
            </div>
          </div>

          {/* Actions Menu */}
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowToolbarDropdown(showToolbarDropdown === `outline-${node.id}` ? null : `outline-${node.id}`);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <MoreVertical className="h-3 w-3" />
            </button>
            
            {showToolbarDropdown === `outline-${node.id}` && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <div className="py-1">
                  <button
                    onClick={() => addNewNode(node.id, 'section')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Section</span>
                  </button>
                  <button
                    onClick={() => console.log('Duplicate node:', node.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={() => console.log('Move node:', node.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Move className="h-4 w-4" />
                    <span>Move</span>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => deleteNode(node.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Render Children */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node.children.map(child => renderOutlineNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading book editor...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Book not found</h3>
          <p className="text-gray-500 mb-6">The book you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/editor')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Editor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/editor')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                    {book.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>by {book.author}</span>
                    {lastSaved && (
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {hasUnsavedChanges ? 'Unsaved changes' : `Saved ${lastSaved.toLocaleTimeString()}`}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Center Section - Current Node Info */}
            {selectedNode && (
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <Type className="h-4 w-4" />
                  <span>{wordCount} words</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${statusConfig[selectedNode.status]?.color}`}>
                  {statusConfig[selectedNode.status]?.label}
                </span>
              </div>
            )}

            {/* Right Section */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`p-2 rounded-lg transition-colors ${
                  showPreview ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'
                }`}
                title="Toggle Preview"
              >
                {showPreview ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors ${
                  showSettings ? 'bg-gray-100' : 'hover:bg-gray-100'
                }`}
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>

              <div className="h-6 w-px bg-gray-300"></div>

              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  hasUnsavedChanges
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowToolbarDropdown(showToolbarDropdown === 'export' ? null : 'export')}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showToolbarDropdown === 'export' && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                    <div className="py-1">
                      <button
                        onClick={() => handleExport('pdf')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        📄 Export as PDF
                      </button>
                      <button
                        onClick={() => handleExport('docx')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        📝 Export as DOCX
                      </button>
                      <button
                        onClick={() => handleExport('epub')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        📚 Export as EPUB
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Outline Sidebar */}
        {showOutline && (
          <div 
            className="bg-white border-r border-gray-200 flex flex-col"
            style={{ width: `${sidebarWidth}px` }}
          >
            {/* Outline Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Book Outline</h2>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => addNewNode(null, 'chapter')}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    title="Add Chapter"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowOutline(false)}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search outline..."
                    value={outlineSearch}
                    onChange={(e) => setOutlineSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <select
                  value={outlineFilter}
                  onChange={(e) => setOutlineFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Items</option>
                  <option value="planning">Planning</option>
                  <option value="draft">Draft</option>
                  <option value="editing">Editing</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Outline Tree */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {book.outline
                  .filter(node => {
                    if (outlineFilter !== 'all' && node.status !== outlineFilter) return false;
                    if (outlineSearch && !node.title.toLowerCase().includes(outlineSearch.toLowerCase())) return false;
                    return true;
                  })
                  .map(node => renderOutlineNode(node))}
              </div>
            </div>

            {/* Outline Stats */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Total Chapters:</span>
                  <span>{book.outline.filter(n => n.type === 'chapter').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span>{book.outline.filter(n => n.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Word Count:</span>
                  <span>{book.metadata.totalWords.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Resize Handle */}
            <div 
              className="absolute right-0 top-0 bottom-0 w-1 bg-gray-300 cursor-col-resize hover:bg-gray-400 transition-colors"
              onMouseDown={(e) => {
                const startX = e.clientX;
                const startWidth = sidebarWidth;
                
                const handleMouseMove = (e) => {
                  const newWidth = Math.max(250, Math.min(500, startWidth + (e.clientX - startX)));
                  setSidebarWidth(newWidth);
                };
                
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            />
          </div>
        )}

        {/* Editor and Preview Container */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left Toolbar */}
              <div className="flex items-center space-x-1">
                {/* Formatting Tools */}
                <div className="flex items-center space-x-1 mr-4">
                  <button
                    onClick={() => insertFormatting('**', '**', 'bold text')}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Bold (Ctrl+B)"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertFormatting('*', '*', 'italic text')}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Italic (Ctrl+I)"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertFormatting('<u>', '</u>', 'underlined text')}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Underline"
                  >
                    <Underline className="h-4 w-4" />
                  </button>
                </div>

                <div className="h-6 w-px bg-gray-300 mr-4"></div>

                {/* Heading Tools */}
                <div className="flex items-center space-x-1 mr-4">
                  <button
                    onClick={() => insertFormatting('# ', '', 'Heading 1')}
                    className="px-3 py-2 hover:bg-gray-100 rounded transition-colors text-sm font-medium"
                    title="Heading 1"
                  >
                    H1
                  </button>
                  <button
                    onClick={() => insertFormatting('## ', '', 'Heading 2')}
                    className="px-3 py-2 hover:bg-gray-100 rounded transition-colors text-sm font-medium"
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    onClick={() => insertFormatting('### ', '', 'Heading 3')}
                    className="px-3 py-2 hover:bg-gray-100 rounded transition-colors text-sm font-medium"
                    title="Heading 3"
                  >
                    H3
                  </button>
                </div>

                <div className="h-6 w-px bg-gray-300 mr-4"></div>

                {/* List and Quote Tools */}
                <div className="flex items-center space-x-1 mr-4">
                  <button
                    onClick={() => insertFormatting('- ', '', 'list item')}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Bullet List"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertFormatting('1. ', '', 'numbered item')}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Numbered List"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertFormatting('> ', '', 'quoted text')}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Quote"
                  >
                    <Quote className="h-4 w-4" />
                  </button>
                </div>

                <div className="h-6 w-px bg-gray-300 mr-4"></div>

                {/* Insert Tools */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => insertFormatting('[', '](url)', 'link text')}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Link (Ctrl+K)"
                  >
                    <Link className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertFormatting('![', '](url)', 'alt text')}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Image"
                  >
                    <Image className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertFormatting('```\n', '\n```', 'code')}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Code Block"
                  >
                    <Code className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertFormatting('| ', ' | |\n|---|---|\n| ', ' | |')}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Table"
                  >
                    <Table className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Right Toolbar */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleUndo}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo className="h-4 w-4" />
                </button>
                <button
                  onClick={handleRedo}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <Redo className="h-4 w-4" />
                </button>

                <div className="h-6 w-px bg-gray-300"></div>

                {/* Font Size Controls */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setEditorFontSize(Math.max(12, editorFontSize - 1))}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Decrease Font Size"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                    {editorFontSize}px
                  </span>
                  <button
                    onClick={() => setEditorFontSize(Math.min(24, editorFontSize + 1))}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Increase Font Size"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>

                <div className="h-6 w-px bg-gray-300"></div>

                {/* View Mode */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setShowOutline(!showOutline)}
                    className={`p-2 rounded transition-colors ${
                      showOutline ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'
                    }`}
                    title="Toggle Outline"
                  >
                    <Folder className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode(previewMode === 'fullscreen' ? 'side' : 'fullscreen')}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Fullscreen Preview"
                  >
                    {previewMode === 'fullscreen' ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Editor and Preview */}
          <div className="flex-1 flex overflow-hidden">
            {/* Editor Panel */}
            {previewMode !== 'fullscreen' && (
              <div className={`flex flex-col ${showPreview ? 'w-1/2' : 'w-full'}`}>
                {/* Editor Header */}
                {selectedNode && (
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedNode.title}</h3>
                        <p className="text-sm text-gray-500">{selectedNode.description}</p>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span>{wordCount} words</span>
                        <span>{readingTime} min</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Editor Textarea */}
                <div className="flex-1 relative">
                  <textarea
                    ref={editorRef}
                    value={editorContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder={selectedNode ? `Start writing "${selectedNode.title}"...` : 'Select a chapter or section to start editing...'}
                    className="w-full h-full p-6 border-none outline-none resize-none font-mono leading-relaxed"
                    style={{ fontSize: `${editorFontSize}px` }}
                    disabled={!selectedNode}
                  />
                  
                  {/* Editor Overlay for Empty State */}
                  {!selectedNode && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
                      <div className="text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select content to edit</h3>
                        <p className="text-gray-500">Choose a chapter or section from the outline to start editing.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preview Panel */}
            {showPreview && (
              <div className={`flex flex-col bg-white border-l border-gray-200 ${
                previewMode === 'fullscreen' ? 'w-full' : 'w-1/2'
              }`}>
                {/* Preview Header */}
                <div className="border-b border-gray-200 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Preview</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPreviewMode('side')}
                        className={`p-1.5 rounded transition-colors ${
                          previewMode === 'side' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'
                        }`}
                        title="Side by Side"
                      >
                        <Monitor className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setPreviewMode('fullscreen')}
                        className={`p-1.5 rounded transition-colors ${
                          previewMode === 'fullscreen' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'
                        }`}
                        title="Fullscreen Preview"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                <div 
                  ref={previewRef}
                  className="flex-1 overflow-y-auto p-6"
                >
                  {editorContent ? (
                    <div 
                      className="prose prose-lg max-w-none prose-emerald"
                      dangerouslySetInnerHTML={{ 
                        __html: editorContent
                          .replace(/\n/g, '<br/>')
                          .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code>$2</code></pre>')
                          .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
                          .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
                          .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
                          .replace(/^\> (.*$)/gm, '<blockquote class="border-l-4 border-emerald-500 pl-4 italic">$1</blockquote>')
                          .replace(/^\- (.*$)/gm, '<li>$1</li>')
                          .replace(/^(\d+)\. (.*$)/gm, '<li>$1. $2</li>')
                          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-emerald-600 hover:text-emerald-700">$1</a>')
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <Eye className="h-12 w-12 mx-auto mb-4" />
                        <p>Start typing to see the preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Settings Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Editor Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Settings Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-6">
                {/* Auto-save Settings */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Auto-save</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">Enable auto-save</label>
                      <button
                        onClick={() => setBook(prev => ({
                          ...prev,
                          settings: { ...prev.settings, autoSave: !prev.settings.autoSave }
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          book.settings.autoSave ? 'bg-emerald-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            book.settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    {book.settings.autoSave && (
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Auto-save interval: {book.settings.autoSaveInterval}s
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="300"
                          step="10"
                          value={book.settings.autoSaveInterval}
                          onChange={(e) => setBook(prev => ({
                            ...prev,
                            settings: { ...prev.settings, autoSaveInterval: parseInt(e.target.value) }
                          }))}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Editor Preferences */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Editor Preferences</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Font Size</label>
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={editorFontSize}
                        onChange={(e) => setEditorFontSize(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500 mt-1">{editorFontSize}px</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Font Family</label>
                      <select
                        value={book.settings.fontFamily}
                        onChange={(e) => setBook(prev => ({
                          ...prev,
                          settings: { ...prev.settings, fontFamily: e.target.value }
                        }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times">Times New Roman</option>
                        <option value="Arial">Arial</option>
                        <option value="Roboto">Roboto</option>
                        <option value="JetBrains Mono">JetBrains Mono</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Display Options */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Display Options</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">Show word count</label>
                      <button
                        onClick={() => setBook(prev => ({
                          ...prev,
                          settings: { ...prev.settings, showWordCount: !prev.settings.showWordCount }
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          book.settings.showWordCount ? 'bg-emerald-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            book.settings.showWordCount ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">Show reading time</label>
                      <button
                        onClick={() => setBook(prev => ({
                          ...prev,
                          settings: { ...prev.settings, showReadingTime: !prev.settings.showReadingTime }
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          book.settings.showReadingTime ? 'bg-emerald-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            book.settings.showReadingTime ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Save settings
                  setShowSettings(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookEditorPage;

