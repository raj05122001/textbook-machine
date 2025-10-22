"use client";
import { Upload, FileText, X, Edit3 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import SourceMixFlow from "./SourceMixFlow";
import { useCallback, useState } from "react";

export function Step3SyllabusInput({
  subject,
  setSubject,
  bookId,
  inputMethod,
  setInputMethod,
  uploadedFiles,
  textContent,
  setTextContent,
  setUploadedFiles
}) {
  const [sourceOption, setSourceOption] = useState("upload"); // "upload" | "primary" | "mixture"
const [sourceMix, setSourceMix] = useState({ primary: 80, trusted: 15, internet: 5 });

    /* ---------- drag & drop ---------- */
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile = {
          id: Date.now() + Math.random(),
          file,
          content: e.target?.result,
          size: file.size,
          type: file.type,
          status: 'ready',
        };
        setUploadedFiles((prev) => [...prev, newFile]);
      };
      if (file.type.startsWith('text/')) reader.readAsText(file);
      else reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/zip": [".zip"],
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
    maxSize: 50 * 1024 * 1024,
    maxFiles: 10,
  });

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const removeFile = (fileId) => setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          How would you like to add content?
        </h2>
        <p className="text-gray-600">
          Choose your preferred method (Upload or Paste)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Mathematics"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Book ID (created)
          </label>
          <input
            disabled
            value={bookId ?? "—"}
            className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setInputMethod("paste")}
          className={`p-6 rounded-lg border-2 transition-all ${
            inputMethod === "paste"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <Edit3 className="h-8 w-8 mx-auto mb-3 text-green-600" />
          <h3 className="font-semibold mb-2">Paste Content</h3>
          <p className="text-sm text-gray-600">
            Paste text directly into the editor
          </p>
        </button>

        <button
          onClick={() => setInputMethod("upload")}
          className={`p-6 rounded-lg border-2 transition-all ${
            inputMethod === "upload"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <Upload className="h-8 w-8 mx-auto mb-3 text-blue-600" />
          <h3 className="font-semibold mb-2">Upload Files</h3>
          <p className="text-sm text-gray-600">
            Upload PDF, DOCX, TXT, or MD files
          </p>
        </button>
      </div>

      {inputMethod === "upload" && (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? "Drop files here" : "Drag & drop files here"}
            </h3>
            <p className="text-gray-600 mb-4">
              or <span className="text-blue-600 font-medium">browse files</span>
            </p>
            <p className="text-sm text-gray-500">
              Supported: PDF, DOCX, TXT, MD • Max 50MB per file
            </p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">
                Uploaded Files ({uploadedFiles.length})
              </h4>
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{file.file.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </div>
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

      {inputMethod === "paste" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste your content here
          </label>
          <textarea
            rows={12}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Paste your syllabus, notes, or any text content here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2 text-sm text-gray-500">
            {textContent.length.toLocaleString()} characters •{" "}
            {Math.ceil((textContent.split(" ").length || 0) / 250)} estimated
            pages
          </div>
        </div>
      )}
      <SourceMixFlow
      option={sourceOption}
  onOptionChange={setSourceOption}
  value={sourceMix}
  onChange={setSourceMix}
/>
    </div>
  );
}
