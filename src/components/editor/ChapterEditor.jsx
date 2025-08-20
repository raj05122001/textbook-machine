'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Quote,
  Link,
  Image,
  Code,
  Table,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Eye,
  Save,
  Plus,
  Trash2,
  Move,
  Settings
} from 'lucide-react';

const ChapterEditor = ({ 
  chapter, 
  onUpdate, 
  onSave, 
  isLoading = false,
  showPreview = false,
  onTogglePreview 
}) => {
  const [title, setTitle] = useState(chapter?.title || '');
  const [description, setDescription] = useState(chapter?.description || '');
  const [content, setContent] = useState(chapter?.content || '');
  const [wordCount, setWordCount] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });
  
  const editorRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity
    }
    return () => clearTimeout(saveTimeoutRef.current);
  }, [title, description, content, hasUnsavedChanges]);

  // Word count calculation
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  const handleAutoSave = () => {
    if (hasUnsavedChanges) {
      const updatedChapter = {
        ...chapter,
        title,
        description,
        content,
        wordCount,
        lastModified: new Date().toISOString()
      };
      onUpdate?.(updatedChapter);
      setHasUnsavedChanges(false);
    }
  };

  const handleManualSave = () => {
    const updatedChapter = {
      ...chapter,
      title,
      description,
      content,
      wordCount,
      lastModified: new Date().toISOString()
    };
    onSave?.(updatedChapter);
    setHasUnsavedChanges(false);
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    setHasUnsavedChanges(true);
  };

  const handleDescriptionChange = (newDescription) => {
    setDescription(newDescription);
    setHasUnsavedChanges(true);
  };

  // Text formatting functions
  const formatText = (format) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    let newCursorPos = end;

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        newCursorPos = end + 4;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        newCursorPos = end + 2;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        newCursorPos = end + 7;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        newCursorPos = end + 2;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        newCursorPos = end + 2;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        newCursorPos = end + 2;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        newCursorPos = end + 3;
        break;
      case 'h3':
        formattedText = `### ${selectedText}`;
        newCursorPos = end + 4;
        break;
      case 'list':
        formattedText = `- ${selectedText}`;
        newCursorPos = end + 2;
        break;
      case 'orderedList':
        formattedText = `1. ${selectedText}`;
        newCursorPos = end + 3;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        newCursorPos = end + 6;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    handleContentChange(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertTable = () => {
    const tableMarkdown = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const newContent = content.substring(0, start) + tableMarkdown + content.substring(start);
    handleContentChange(newContent);
  };

  const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/minute

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">Chapter Editor</h2>
          {hasUnsavedChanges && (
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              Unsaved changes
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">
            {wordCount} words • {readingTime} min read
          </div>
          <button
            onClick={onTogglePreview}
            className={`p-2 rounded-md transition-colors ${
              showPreview 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Toggle Preview"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={handleManualSave}
            disabled={!hasUnsavedChanges || isLoading}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Chapter Metadata */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chapter Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter chapter title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chapter Description
            </label>
            <textarea
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Brief description of this chapter..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-3 border-b border-gray-200 bg-gray-50 overflow-x-auto">
        {/* Text Formatting */}
        <div className="flex items-center space-x-1 pr-3 border-r border-gray-300">
          <button
            onClick={() => formatText('bold')}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => formatText('italic')}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            onClick={() => formatText('underline')}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </button>
          <button
            onClick={() => formatText('code')}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            title="Code"
          >
            <Code className="h-4 w-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center space-x-1 pr-3 border-r border-gray-300">
          <button
            onClick={() => formatText('h1')}
            className="px-2 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => formatText('h2')}
            className="px-2 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => formatText('h3')}
            className="px-2 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            title="Heading 3"
          >
            H3
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center space-x-1 pr-3 border-r border-gray-300">
          <button
            onClick={() => formatText('list')}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => formatText('orderedList')}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>

        {/* Insert */}
        <div className="flex items-center space-x-1 pr-3 border-r border-gray-300">
          <button
            onClick={() => formatText('quote')}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            onClick={() => formatText('link')}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            title="Link"
          >
            <Link className="h-4 w-4" />
          </button>
          <button
            onClick={insertTable}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            title="Table"
          >
            <Table className="h-4 w-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center space-x-1">
          <button
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-4">
        <textarea
          ref={editorRef}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start writing your chapter content here..."
          className="w-full h-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm leading-relaxed"
          style={{ minHeight: '400px' }}
          onSelect={(e) => {
            setCursorPosition({
              start: e.target.selectionStart,
              end: e.target.selectionEnd
            });
            setSelectedText(content.substring(e.target.selectionStart, e.target.selectionEnd));
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Line: {content.substring(0, cursorPosition.start).split('\n').length}</span>
          <span>Column: {cursorPosition.start - content.lastIndexOf('\n', cursorPosition.start - 1)}</span>
          <span>Selection: {selectedText.length} chars</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>Last saved: {chapter?.lastModified ? new Date(chapter.lastModified).toLocaleTimeString() : 'Never'}</span>
          {isLoading && <span className="text-blue-600">Saving...</span>}
        </div>
      </div>
    </div>
  );
};

export default ChapterEditor;