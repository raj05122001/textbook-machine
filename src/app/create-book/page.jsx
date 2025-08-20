"use client"
import React, { useState, useCallback, useMemo, useRef } from "react";
import { 
  Upload, Mic, Paperclip, ChevronDown, Loader2, FileText, Sparkles,
  BookOpen, ChevronRight, ArrowLeft, Settings, Download, Edit,
  Plus, Trash2, Eye, Users, Clock, Star
} from "lucide-react";

// Main App Component with Router-like navigation
export default function TextbookMachine() {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentBookId, setCurrentBookId] = useState(null);

  const navigate = (page, bookId = null) => {
    setCurrentPage(page);
    setCurrentBookId(bookId);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <LandingUpload navigate={navigate} />;
      case "books":
        return <BooksPage navigate={navigate} />;
      case "book-details":
        return <BookDetailsPage bookId={currentBookId} navigate={navigate} />;
      case "editor":
        return <BookEditor navigate={navigate} />;
      default:
        return <LandingUpload navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D10]">
      {renderPage()}
    </div>
  );
}

// Landing/Upload Page Component
function LandingUpload({ navigate }) {
  const [model, setModel] = useState("GPT-5");
  const [openModelMenu, setOpenModelMenu] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [processingStage, setProcessingStage] = useState("");

  const inputRef = useRef(null);

  const models = useMemo(() => ["GPT-5", "Gemini", "Claude"], []);

  const onFilePick = useCallback((e) => {
    if (!e.target.files) return;
    const picked = Array.from(e.target.files);
    setFiles(prev => [...prev, ...picked]);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    if (dropped.length) setFiles(prev => [...prev, ...dropped]);
  }, []);

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const simulateProcessing = async () => {
    const stages = [
      "Analyzing document structure...",
      "Extracting key topics...", 
      "Generating chapter outline...",
      "Creating chapter content...",
      "Adding summaries and Q&A...",
      "Finalizing book structure..."
    ];

    for (let i = 0; i < stages.length; i++) {
      setProcessingStage(stages[i]);
      await new Promise(res => setTimeout(res, 1500));
    }
    
    setProcessingStage("Complete! Redirecting to editor...");
    await new Promise(res => setTimeout(res, 1000));
    navigate("editor");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    await simulateProcessing();
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-white relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="relative">
          <button
            onClick={() => setOpenModelMenu(v => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 text-sm backdrop-blur-md transition"
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">{model}</span>
            <ChevronDown className="w-4 h-4 opacity-70" />
          </button>
          {openModelMenu && (
            <div className="absolute z-20 mt-2 w-44 rounded-xl border border-white/10 bg-[#111318] shadow-xl overflow-hidden">
              {models.map(m => (
                <button
                  key={m}
                  onClick={() => { setModel(m); setOpenModelMenu(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 ${m === model ? "bg-white/5" : ""}`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("books")}
            className="text-xs sm:text-sm text-white/60 hover:text-white/90 transition"
          >
            My Library
          </button>
          <div className="text-xs sm:text-sm text-white/60 select-none">Textbook Machine</div>
        </div>
      </div>

      {/* Center Content */}
      <div className="max-w-3xl mx-auto pt-[8vh] pb-24 px-4 sm:px-6">
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white/90 mb-2">
          Hey, Dheeraj. Ready to dive in?
        </h1>
        <p className="text-center text-white/60 mb-10">
          Transform your syllabus or documents into professional textbooks with AI
        </p>

        {/* Upload Area */}
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-2xl p-4 sm:p-6"
        >
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="shrink-0 p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
              title="Upload file"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              multiple
              className="hidden"
              onChange={onFilePick}
            />

            <input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Paste your syllabus or describe your textbook..."
              className="flex-1 bg-transparent focus:outline-none placeholder:text-white/40 text-base sm:text-lg px-2"
            />

            <button
              type="button"
              className="shrink-0 p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
              title="Voice input"
            >
              <Mic className="w-5 h-5" />
            </button>

            <button
              type="submit"
              disabled={uploading || (!files.length && !prompt.trim())}
              className="shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white text-black font-medium hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{uploading ? "Processing..." : "Generate Book"}</span>
            </button>
          </form>

          {/* Processing Status */}
          {uploading && processingStage && (
            <div className="mt-4 p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{processingStage}</span>
              </div>
            </div>
          )}

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {files.map((f, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{f.name}</p>
                    <p className="text-xs text-white/50">{(f.size/1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={() => removeFile(idx)}
                    className="text-xs text-white/60 hover:text-white/90 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 text-xs text-white/45">
            Supported: PDF, DOC/DOCX, TXT • Drag & drop anywhere on this card
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid sm:grid-cols-3 gap-3 text-sm">
          <FeatureTip 
            icon={<Upload className="w-4 h-4" />}
            text="Upload syllabus or paste content directly" 
          />
          <FeatureTip 
            icon={<BookOpen className="w-4 h-4" />}
            text="AI creates structured chapters with Q&A" 
          />
          <FeatureTip 
            icon={<Download className="w-4 h-4" />}
            text="Export as PDF, DOCX, or EPUB formats" 
          />
        </div>
      </div>

      {/* Ambient gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px]" />
      </div>
    </div>
  );
}

// Books Library Page
function BooksPage({ navigate }) {
  const [books] = useState([
    {
      id: 1,
      title: "Mathematics for Class 10",
      subtitle: "Algebra • Geometry • Trigonometry • Statistics",
      author: "AI Generated",
      color: "from-emerald-500 to-teal-600",
      chapters: ["Algebra", "Geometry", "Trigonometry", "Statistics"],
      createdAt: "2024-12-15",
      status: "completed",
      pages: 45
    },
    {
      id: 2,
      title: "Physics Essentials",
      subtitle: "Motion • Force • Energy • Electricity • Magnetism",
      author: "AI Generated",
      color: "from-indigo-500 to-blue-600", 
      chapters: ["Motion", "Force", "Work & Energy", "Electricity", "Magnetism"],
      createdAt: "2024-12-10",
      status: "completed",
      pages: 38
    },
    {
      id: 3,
      title: "Chemistry Basics",
      subtitle: "Atoms • Molecules • Reactions • Acids & Bases",
      author: "AI Generated", 
      color: "from-rose-500 to-orange-500",
      chapters: ["Atoms & Molecules", "Chemical Reactions", "Acids & Bases", "Salts"],
      createdAt: "2024-12-08",
      status: "draft",
      pages: 22
    },
    {
      id: 4,
      title: "English Literature Guide",
      subtitle: "Poetry • Drama • Prose • Writing Skills",
      author: "AI Generated",
      color: "from-purple-500 to-pink-500",
      chapters: ["Poetry Analysis", "Drama Studies", "Prose Techniques", "Essay Writing"],
      createdAt: "2024-12-12",
      status: "completed",
      pages: 52
    }
  ]);

  return (
    <div className="min-h-screen bg-[#0B0D10] text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-emerald-400" />
              My Library
            </h1>
            <p className="text-white/60 mt-1">{books.length} textbooks created</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => navigate("home")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition"
            >
              <Plus className="w-4 h-4" />
              Create New Book
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<BookOpen />} label="Total Books" value={books.length} />
          <StatCard icon={<FileText />} label="Total Pages" value={books.reduce((sum, book) => sum + book.pages, 0)} />
          <StatCard icon={<Clock />} label="Recent" value={books.filter(b => b.status === "completed").length} />
          <StatCard icon={<Star />} label="Drafts" value={books.filter(b => b.status === "draft").length} />
        </div>

        {/* Books Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} navigate={navigate} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Individual Book Card Component  
function BookCard({ book, navigate }) {
  return (
    <div className="group relative mx-auto w-full max-w-72 [perspective:1200px]">
      <div className="relative h-80 w-full rounded-lg shadow-xl transition-transform duration-500 ease-out group-hover:[transform:rotateY(-8deg) translateZ(0)]">
        {/* Cover */}
        <div className={`absolute inset-0 rounded-lg overflow-hidden bg-gradient-to-br ${book.color} ring-1 ring-black/10`}>
          {/* Pattern overlay */}
          <div 
            className="absolute inset-0 opacity-15 mix-blend-overlay"
            style={{
              backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35) 0 1px, transparent 2px)",
              backgroundSize: "12px 12px",
            }}
          />
          
          {/* Cover content */}
          <div className="absolute inset-0 p-4 flex flex-col">
            <div className="flex justify-between items-start">
              <div className="text-[10px] uppercase tracking-widest opacity-80">
                {book.author}
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                book.status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                {book.status}
              </div>
            </div>
            
            <h3 className="mt-3 text-lg font-bold leading-snug">{book.title}</h3>
            <p className="mt-2 text-sm/5 text-white/85">{book.subtitle}</p>

            <div className="mt-auto space-y-2">
              <div className="text-xs text-white/70">
                {book.chapters.length} chapters • {book.pages} pages
              </div>
              <div className="text-xs text-white/60">
                Created {new Date(book.createdAt).toLocaleDateString()}
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => navigate("book-details", book.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium text-white bg-white/20 hover:bg-white/30 rounded-md py-1.5 transition"
                >
                  <Eye className="w-3 h-3" />
                  View
                </button>
                <button
                  onClick={() => navigate("editor", book.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium text-white bg-white/20 hover:bg-white/30 rounded-md py-1.5 transition"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Book spine and edge effects */}
        <div className="absolute -left-2 top-0 h-full w-4 rounded-l bg-neutral-900/80 shadow-lg shadow-black/30">
          <div className="absolute inset-y-0 left-1 w-px bg-white/10" />
          <div className="absolute inset-y-0 left-2.5 w-px bg-white/10" />
        </div>
        
        <div 
          className="absolute -right-1 top-1 bottom-1 w-1.5 rounded-r bg-gradient-to-b from-white to-neutral-200 shadow-md"
          style={{
            backgroundImage: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.08) 0 1px, transparent 1px 3px)",
          }}
        />
        
        <div className="absolute -bottom-2 left-6 right-0 h-3 blur-md bg-black/40 rounded-full" />
      </div>
    </div>
  );
}

// Book Details/Reader Page
function BookDetailsPage({ bookId, navigate }) {
  // Sample book data
  const bookData = {
    1: {
      title: "Mathematics for Class 10",
      subtitle: "Algebra • Geometry • Trigonometry • Statistics",
      pages: [
        "Welcome to Mathematics for Class 10! This comprehensive textbook covers all essential topics including Algebra, Geometry, Trigonometry, and Statistics with solved examples and practice exercises.",
        <>
          <h3 className="text-lg font-bold mb-3">Chapter 1: Algebra Foundations</h3>
          <p className="mb-3">In this chapter, we explore variables, constants, expressions, and linear equations.</p>
          <p className="mb-3">A linear equation has the general form: <code className="bg-gray-100 px-2 py-1 rounded">ax + b = 0</code></p>
          <p>Where 'a' and 'b' are constants, and 'x' is the variable we need to solve for.</p>
        </>,
        <>
          <h3 className="text-lg font-bold mb-3">Linear Equations - Solved Examples</h3>
          <div className="space-y-2">
            <p><strong>Example 1:</strong> 3x + 5 = 20</p>
            <p className="ml-4">Solution: 3x = 15, therefore x = 5</p>
            <p><strong>Example 2:</strong> 2(x - 3) = 10</p>
            <p className="ml-4">Solution: 2x - 6 = 10, 2x = 16, therefore x = 8</p>
            <p><strong>Example 3:</strong> 7 - 2x = -9</p>
            <p className="ml-4">Solution: -2x = -16, therefore x = 8</p>
          </div>
        </>,
        <>
          <h3 className="text-lg font-bold mb-3">Graphing Linear Equations</h3>
          <p className="mb-3">The slope-intercept form of a line is: <code className="bg-gray-100 px-2 py-1 rounded">y = mx + c</code></p>
          <p className="mb-3">Where 'm' is the slope and 'c' is the y-intercept.</p>
          <img src="https://picsum.photos/seed/math-graph/600/300" alt="Linear graph example" className="rounded-lg shadow-md" />
        </>,
        <>
          <h3 className="text-lg font-bold mb-3">Practice Problems</h3>
          <div className="space-y-3">
            <p><strong>Problem 1:</strong> Solve for x: 4x - 9 = 23</p>
            <p><strong>Problem 2:</strong> Find the zeros of x² - 7x + 12</p>
            <p><strong>Problem 3:</strong> Graph the equation y = 2x + 3</p>
            <p><strong>Problem 4:</strong> Factorize: 2x² - 5x - 3</p>
          </div>
        </>,
        "Chapter Summary: We've covered the fundamentals of algebra including linear equations, graphing, and factorization. These concepts form the foundation for more advanced mathematical topics."
      ]
    }
  };

  const book = bookData[bookId];

  if (!book) {
    return (
      <div className="min-h-screen bg-[#0B0D10] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold mb-4">Book not found</p>
          <button 
            onClick={() => navigate("books")}
            className="text-emerald-400 hover:text-emerald-300 underline"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate("books")}
            className="flex items-center gap-2 text-white/70 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </button>
          <div className="flex gap-3">
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
        <p className="text-white/70 mb-8">{book.subtitle}</p>

        <FlipBookReader pages={book.pages} />
      </div>
    </div>
  );
}

// Book Editor Component (Placeholder)
function BookEditor({ navigate }) {
  return (
    <div className="min-h-screen bg-[#0B0D10] text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate("books")}
            className="flex items-center gap-2 text-white/70 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition">
              Save Changes
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
              Preview Book
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8">Book Editor</h1>
        
        <div className="bg-white/5 rounded-xl p-8 text-center">
          <Edit className="w-16 h-16 mx-auto mb-4 text-white/50" />
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-white/70">
            The book editor with chapter management, content editing, and real-time preview will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}

// Flip Book Reader Component
function FlipBookReader({ pages }) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = pages.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Book Container */}
      <div className="relative bg-white rounded-lg shadow-2xl p-8 w-full max-w-4xl min-h-[500px] text-black">
        {/* Page Content */}
        <div className="prose prose-lg max-w-none">
          {typeof pages[currentPage] === 'string' ? (
            <p className="text-gray-800 leading-relaxed">{pages[currentPage]}</p>
          ) : (
            pages[currentPage]
          )}
        </div>

        {/* Page Number */}
        <div className="absolute bottom-4 right-4 text-gray-500 text-sm">
          {currentPage + 1} / {totalPages}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Previous
        </button>

        <span className="text-white/70 px-4">
          Page {currentPage + 1} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Helper Components
function FeatureTip({ icon, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 flex items-center gap-3 text-white/60">
      <div className="text-emerald-400">{icon}</div>
      <span className="text-sm">{text}</span>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center gap-3">
        <div className="text-emerald-400">{icon}</div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-white/60 text-sm">{label}</p>
        </div>
      </div>
    </div>
  );
}