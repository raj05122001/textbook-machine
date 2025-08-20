'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  File, 
  Image, 
  X, 
  Check, 
  AlertCircle, 
  Loader2, 
  BookOpen, 
  Plus, 
  Sparkles, 
  Zap, 
  Clock, 
  Target, 
  ChevronRight,
  ChevronLeft,
  Eye,
  Settings,
  HelpCircle,
  ArrowRight,
  Download,
  Copy,
  Edit3
} from 'lucide-react';

const CreateBookPage = () => {
  const router = useRouter();
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    author: '',
    description: '',
    genre: '',
    language: 'en',
    visibility: 'private',
    aiModel: 'gpt-4',
    processingOptions: {
      autoChapterize: true,
      generateSummaries: true,
      createQuestions: true,
      addReferences: true,
      improveContent: false
    }
  });
  
  // File handling
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [textContent, setTextContent] = useState('');
  const [inputMethod, setInputMethod] = useState('upload'); // 'upload', 'paste', 'template'
  
  // Processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);

  // File upload with drag & drop
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejectedErrors = rejectedFiles.map(file => 
        `${file.file.name}: ${file.errors.map(e => e.message).join(', ')}`
      );
      setErrors(prev => [...prev, ...rejectedErrors]);
    }

    // Process accepted files
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile = {
          id: Date.now() + Math.random(),
          file,
          content: e.target.result,
          size: file.size,
          type: file.type,
          status: 'ready'
        };
        setUploadedFiles(prev => [...prev, newFile]);
      };
      
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
      'text/rtf': ['.rtf']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 10
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Step validation
  const validateStep = (step) => {
    const newErrors = [];
    
    switch (step) {
      case 1:
        if (inputMethod === 'upload' && uploadedFiles.length === 0) {
          newErrors.push('Please upload at least one file');
        }
        if (inputMethod === 'paste' && !textContent.trim()) {
          newErrors.push('Please paste some content');
        }
        break;
      case 2:
        if (!formData.title.trim()) {
          newErrors.push('Book title is required');
        }
        if (!formData.author.trim()) {
          newErrors.push('Author name is required');
        }
        break;
      case 3:
        // AI settings validation if needed
        break;
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Sample templates
  const templates = [
    {
      id: 'academic',
      title: 'Academic Paper',
      description: 'Research paper with methodology, results, and conclusions',
      icon: FileText,
      content: `# Research Paper Template

## Abstract
[Brief summary of your research]

## Introduction
[Background and research question]

## Methodology
[How you conducted your research]

## Results
[Your findings]

## Discussion
[Analysis and interpretation]

## Conclusion
[Summary and implications]

## References
[Citation list]`
    },
    {
      id: 'novel',
      title: 'Novel Structure',
      description: 'Fiction book with character development and plot structure',
      icon: BookOpen,
      content: `# Novel Template

## Chapter 1: The Beginning
[Set the scene, introduce main character]

## Chapter 2: The Inciting Incident
[The event that starts the main conflict]

## Chapter 3: Rising Action
[Building tension and complications]

## Chapter 4: Climax
[The turning point of the story]

## Chapter 5: Falling Action
[Consequences of the climax]

## Chapter 6: Resolution
[Conclusion and character growth]`
    },
    {
      id: 'manual',
      title: 'User Manual',
      description: 'Technical documentation with step-by-step instructions',
      icon: Settings,
      content: `# User Manual Template

## Getting Started
[Initial setup and requirements]

## Basic Features
[Core functionality overview]

## Step-by-Step Guides
[Detailed instructions]

## Advanced Features
[Complex operations]

## Troubleshooting
[Common issues and solutions]

## FAQ
[Frequently asked questions]

## Appendix
[Additional resources]`
    }
  ];

  // Processing simulation
  const simulateProcessing = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    const steps = [
      { name: 'Analyzing content', duration: 2000 },
      { name: 'Extracting text', duration: 1500 },
      { name: 'AI processing', duration: 3000 },
      { name: 'Creating chapters', duration: 2500 },
      { name: 'Generating summaries', duration: 2000 },
      { name: 'Finalizing book', duration: 1000 }
    ];
    
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(steps[i].name);
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      setProcessingProgress(((i + 1) / steps.length) * 100);
    }
    
    // Simulate success
    setTimeout(() => {
      router.push('/books/new-book-id');
    }, 500);
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      simulateProcessing();
    }
  };

  const steps = [
    { id: 1, title: 'Content Input', description: 'Upload files or paste content' },
    { id: 2, title: 'Book Details', description: 'Add title, author, and description' },
    { id: 3, title: 'AI Settings', description: 'Configure processing options' },
    { id: 4, title: 'Processing', description: 'AI creates your book' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Book</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your content into a professionally structured book with AI-powered automation
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-3 ${
                  currentStep === step.id ? 'text-blue-600' : 
                  completedSteps.has(step.id) ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    currentStep === step.id ? 'border-blue-600 bg-blue-50' :
                    completedSteps.has(step.id) ? 'border-green-600 bg-green-50' : 'border-gray-300'
                  }`}>
                    {completedSteps.has(step.id) ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="font-semibold">{step.id}</span>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-sm opacity-75">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h3 className="font-medium text-red-800">Please fix the following errors:</h3>
            </div>
            <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Content Input */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">How would you like to add content?</h2>
                <p className="text-gray-600">Choose your preferred method to input content for your book</p>
              </div>

              {/* Input Method Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button
                  onClick={() => setInputMethod('upload')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    inputMethod === 'upload' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Upload className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold mb-2">Upload Files</h3>
                  <p className="text-sm text-gray-600">Upload PDF, DOCX, TXT, or MD files</p>
                </button>

                <button
                  onClick={() => setInputMethod('paste')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    inputMethod === 'paste' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Edit3 className="h-8 w-8 mx-auto mb-3 text-green-600" />
                  <h3 className="font-semibold mb-2">Paste Content</h3>
                  <p className="text-sm text-gray-600">Paste text directly into the editor</p>
                </button>

                <button
                  onClick={() => setInputMethod('template')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    inputMethod === 'template' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                  <h3 className="font-semibold mb-2">Use Template</h3>
                  <p className="text-sm text-gray-600">Start with a pre-made structure</p>
                </button>
              </div>

              {/* File Upload */}
              {inputMethod === 'upload' && (
                <div className="space-y-4">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                      isDragActive 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">
                      {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      or <span className="text-blue-600 font-medium">browse files</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Supported: PDF, DOCX, TXT, MD • Max 50MB per file
                    </p>
                  </div>

                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Uploaded Files ({uploadedFiles.length})</h4>
                      {uploadedFiles.map(file => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium">{file.file.name}</div>
                              <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(file.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Paste Content */}
              {inputMethod === 'paste' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste your content here
                  </label>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Paste your syllabus, notes, or any text content here..."
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    {textContent.length.toLocaleString()} characters • 
                    {Math.ceil(textContent.split(' ').length / 250)} estimated pages
                  </div>
                </div>
              )}

              {/* Templates */}
              {inputMethod === 'template' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Choose a template to get started</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {templates.map(template => {
                      const Icon = template.icon;
                      return (
                        <button
                          key={template.id}
                          onClick={() => setTextContent(template.content)}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                        >
                          <Icon className="h-8 w-8 text-blue-600 mb-3" />
                          <h5 className="font-semibold mb-2">{template.title}</h5>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </button>
                      );
                    })}
                  </div>
                  
                  {textContent && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template Content (you can edit this)
                      </label>
                      <textarea
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Book Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Information</h2>
                <p className="text-gray-600">Provide details about your book</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter your book title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Book subtitle"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your book"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre/Category
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a genre</option>
                    <option value="academic">Academic</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-Fiction</option>
                    <option value="technical">Technical</option>
                    <option value="educational">Educational</option>
                    <option value="business">Business</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibility
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={formData.visibility === 'private'}
                        onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Private</div>
                        <div className="text-sm text-gray-600">Only you can see this book</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="visibility"
                        value="unlisted"
                        checked={formData.visibility === 'unlisted'}
                        onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Unlisted</div>
                        <div className="text-sm text-gray-600">Anyone with the link can view</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={formData.visibility === 'public'}
                        onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Public</div>
                        <div className="text-sm text-gray-600">Anyone can discover and read</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: AI Settings */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Processing Options</h2>
                <p className="text-gray-600">Configure how AI will process and enhance your content</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Model
                  </label>
                  <select
                    value={formData.aiModel}
                    onChange={(e) => setFormData(prev => ({ ...prev, aiModel: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="gpt-4">GPT-4 (Recommended)</option>
                    <option value="claude">Claude</option>
                    <option value="gemini">Gemini</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    GPT-4 provides the best balance of quality and speed
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Processing Features</h4>
                  
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.processingOptions.autoChapterize}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        processingOptions: {
                          ...prev.processingOptions,
                          createQuestions: e.target.checked
                        }
                      }))}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">Create Q&A</div>
                      <div className="text-sm text-gray-600">Generate review questions and answers for each chapter</div>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.processingOptions.addReferences}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        processingOptions: {
                          ...prev.processingOptions,
                          addReferences: e.target.checked
                        }
                      }))}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">Add References</div>
                      <div className="text-sm text-gray-600">Include relevant citations and reference materials</div>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.processingOptions.improveContent}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        processingOptions: {
                          ...prev.processingOptions,
                          improveContent: e.target.checked
                        }
                      }))}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">Improve Content</div>
                      <div className="text-sm text-gray-600">Enhance readability and fix grammar issues</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Processing Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Processing Preview
                </h4>
                <div className="text-sm text-blue-800 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>Estimated processing time: 2-5 minutes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Expected chapters: {Math.ceil((textContent?.length || uploadedFiles.reduce((acc, file) => acc + (file.content?.length || 0), 0)) / 2000)} chapters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Reading time: {Math.ceil((textContent?.split(' ').length || 0) / 200)} minutes</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Processing */}
          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Creating Your Book</h2>
                <p className="text-gray-600">Our AI is processing your content and building your book structure</p>
              </div>

              {/* Processing Animation */}
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Loader2 className="h-16 w-16 text-white animate-spin" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {Math.round(processingProgress)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto mb-6">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
              </div>

              {/* Current Step */}
              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  <span className="font-medium text-gray-900">{processingStep}</span>
                </div>
                
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center justify-between">
                    <span>✓ Content uploaded</span>
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>✓ AI model selected</span>
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>⏳ Processing content</span>
                    <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                  </div>
                </div>
              </div>

              {/* Processing Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h4 className="font-semibold text-blue-900 mb-3">What's happening behind the scenes?</h4>
                <div className="text-sm text-blue-800 space-y-2 text-left">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>Our AI is analyzing your content structure and identifying main topics</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>Creating logical chapter divisions based on content flow</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>Generating professional titles and organizing information</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>Adding summaries, questions, and reference materials</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="text-sm text-gray-600">
                Step {currentStep} of {steps.length}
              </div>

              {currentStep === 3 ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Create Book</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1 mx-auto">
            <HelpCircle className="h-4 w-4" />
            <span>Need help? Check our documentation</span>
          </button>
        </div>

        {/* Features Highlight */}
        {currentStep === 1 && (
          <div className="mt-12 bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-center mb-8">Why Choose TBM?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">80% Time Reduction</h4>
                <p className="text-sm text-gray-600">Automate the tedious work of structuring and formatting your content</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Professional Quality</h4>
                <p className="text-sm text-gray-600">AI-powered content enhancement ensures publication-ready results</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Multiple Formats</h4>
                <p className="text-sm text-gray-600">Export to PDF, DOCX, EPUB, and more with one click</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBookPage;
