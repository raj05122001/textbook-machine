"use client";
import { Upload, FileText, X, Edit3, ChevronDown } from "lucide-react";
import { useDropzone } from "react-dropzone";
import SourceMixFlow from "./SourceMixFlow";
import { useCallback, useState, useEffect } from "react";
import { axiosInstance } from "@/axios/AxiosInstans"; // ✅ import API client

// Optional fallback (agar API se kuch na aaye)
const SUBJECT_FALLBACK = [
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Social Science",
  "Computer Science",
];

export function Step3SyllabusInput({
  subject,
  setSubject,
  bookId,
  inputMethod,
  setInputMethod,
  uploadedFiles,
  textContent,
  setTextContent,
  setUploadedFiles,
  formData,
  contentPrefsSaved,
  setContentPrefsSaved,
}) {
  const [sourceOption, setSourceOption] = useState("upload");
  const [sourceMix, setSourceMix] = useState({ primary: 80, trusted: 15, internet: 5 });
  const [subjectError, setSubjectError] = useState("");
  const [showSubjectOptions, setShowSubjectOptions] = useState(false);

  console.log("subject : ", subject)

  // ✅ subjects from API
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsErr, setSubjectsErr] = useState("");

  // ---------- fetch subjects from API ----------
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setSubjectsLoading(true);
        setSubjectsErr("");
        const { data } = await axiosInstance.get("/subject/?size=1000");
        const items = data?.data || data?.results || [];
        if (!alive) return;
        setSubjects(items);
      } catch (e) {
        console.error("[subjects] error", e);
        if (alive) {
          setSubjectsErr("Failed to load subjects.");
        }
      } finally {
        if (alive) setSubjectsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // ---------- typeahead filtering ----------
  const baseOptions =
    subjects && subjects.length > 0
      ? subjects
        .map((s) => s.subject_name)
        .filter(Boolean)
      : SUBJECT_FALLBACK;

  const trimmedSubject = subject.trim().toLowerCase();
  const filteredOptions =
    trimmedSubject === ""
      ? baseOptions
      : baseOptions.filter((opt) =>
        opt.toLowerCase().includes(trimmedSubject)
      );

  const shouldShowDropdown =
    showSubjectOptions && filteredOptions.length > 0;

  /* ---------- drag & drop ---------- */
  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newFile = {
            id: Date.now() + Math.random(),
            file,
            content: e.target?.result,
            size: file.size,
            type: file.type,
            status: "ready",
          };
          setUploadedFiles((prev) => [...prev, newFile]);
        };
        if (file.type.startsWith("text/")) reader.readAsText(file);
        else reader.readAsArrayBuffer(file);
      });
    },
    [setUploadedFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
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

  const removeFile = (fileId) =>
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));

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

      {/* ✅ SUBJECT FIELD WITH API-BASED TYPEAHEAD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>

          <div className="relative">
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (subjectError) setSubjectError("");
                setShowSubjectOptions(true);
              }}
              onFocus={() => setShowSubjectOptions(true)}
              onClick={() => setShowSubjectOptions(true)}
              onBlur={() => {
                setTimeout(() => setShowSubjectOptions(false), 150);
              }}
              placeholder={
                subjectsLoading
                  ? "Loading subjects…"
                  : "e.g., Mathematics"
              }
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowSubjectOptions((prev) => !prev);
              }}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showSubjectOptions ? "rotate-180" : ""
                  }`}
              />
            </button>


            {/* Dropdown options */}
            {shouldShowDropdown && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {filteredOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setSubject(opt);        // ✅ yahi se subject set hoga
                      if (subjectError) setSubjectError("");
                      setShowSubjectOptions(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${subject === opt ? "bg-blue-50 font-medium" : ""
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {subjectsErr && (
            <p className="mt-1 text-sm text-red-600">{subjectsErr}</p>
          )}

          {subjectError && (
            <p className="mt-1 text-sm text-red-600">{subjectError}</p>
          )}
        </div>
      </div>

      {/* ===== baaki tumhara existing code same ===== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setInputMethod("paste")}
          className={`p-6 rounded-lg border-2 transition-all ${inputMethod === "paste"
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
          className={`p-6 rounded-lg border-2 transition-all ${inputMethod === "upload"
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
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragActive
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
        </div>
      )}

      <SourceMixFlow
        option={sourceOption}
        onOptionChange={setSourceOption}
        value={sourceMix}
        onChange={setSourceMix}
        bookId={bookId}
        subject={subject}
        formData={formData}
        onSubjectError={setSubjectError}
        onSaved={(ok) => setContentPrefsSaved(!!ok)}
      />
    </div>
  );
}








// "use client";
// import { Upload, FileText, X, Edit3 } from "lucide-react";
// import { useDropzone } from "react-dropzone";
// import SourceMixFlow from "./SourceMixFlow";
// import { useCallback, useState, useEffect } from "react";
// import { axiosInstance } from "@/axios/AxiosInstans"; // ✅ import API client

// // Optional fallback (agar API se kuch na aaye)
// const SUBJECT_FALLBACK = [
//   "Mathematics",
//   "Science",
//   "Physics",
//   "Chemistry",
//   "Biology",
//   "English",
//   "Social Science",
//   "Computer Science",
// ];

// export function Step3SyllabusInput({
//   subject,
//   setSubject,
//   bookId,
//   inputMethod,
//   setInputMethod,
//   uploadedFiles,
//   textContent,
//   setTextContent,
//   setUploadedFiles,
//   formData,
//   contentPrefsSaved,
//   setContentPrefsSaved,
// }) {
//   const [sourceOption, setSourceOption] = useState("upload");
//   const [sourceMix, setSourceMix] = useState({ primary: 80, trusted: 15, internet: 5 });
//   const [subjectError, setSubjectError] = useState("");
//   const [showSubjectOptions, setShowSubjectOptions] = useState(false);

//   // ✅ subjects from API
//   const [subjects, setSubjects] = useState([]);
//   const [subjectsLoading, setSubjectsLoading] = useState(false);
//   const [subjectsErr, setSubjectsErr] = useState("");

//   // ---------- fetch subjects from API ----------
//   useEffect(() => {
//     let alive = true;

//     (async () => {
//       try {
//         setSubjectsLoading(true);
//         setSubjectsErr("");
//         const { data } = await axiosInstance.get("/subject/?size=1000");
//         const items = data?.data || data?.results || [];
//         if (!alive) return;
//         setSubjects(items);
//       } catch (e) {
//         console.error("[subjects] error", e);
//         if (alive) {
//           setSubjectsErr("Failed to load subjects.");
//         }
//       } finally {
//         if (alive) setSubjectsLoading(false);
//       }
//     })();

//     return () => {
//       alive = false;
//     };
//   }, []);

//   // ---------- typeahead filtering ----------
//   const baseOptions =
//     subjects && subjects.length > 0
//       ? subjects
//           .map((s) => s.subject_name)
//           .filter(Boolean)
//       : SUBJECT_FALLBACK;

//   const trimmedSubject = subject.trim().toLowerCase();
//   const filteredOptions =
//     trimmedSubject === ""
//       ? baseOptions
//       : baseOptions.filter((opt) =>
//           opt.toLowerCase().includes(trimmedSubject)
//         );

//   const shouldShowDropdown =
//     showSubjectOptions && filteredOptions.length > 0;

//   /* ---------- drag & drop ---------- */
//   const onDrop = useCallback(
//     (acceptedFiles) => {
//       acceptedFiles.forEach((file) => {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           const newFile = {
//             id: Date.now() + Math.random(),
//             file,
//             content: e.target?.result,
//             size: file.size,
//             type: file.type,
//             status: "ready",
//           };
//           setUploadedFiles((prev) => [...prev, newFile]);
//         };
//         if (file.type.startsWith("text/")) reader.readAsText(file);
//         else reader.readAsArrayBuffer(file);
//       });
//     },
//     [setUploadedFiles]
//   );

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       "application/msword": [".doc"],
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
//         ".docx",
//       ],
//       "application/vnd.ms-powerpoint": [".ppt"],
//       "application/vnd.openxmlformats-officedocument.presentationml.presentation":
//         [".pptx"],
//       "application/vnd.ms-excel": [".xls"],
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
//         ".xlsx",
//       ],
//       "application/zip": [".zip"],
//       "application/pdf": [".pdf"],
//       "text/plain": [".txt"],
//     },
//     maxSize: 50 * 1024 * 1024,
//     maxFiles: 10,
//   });

//   const formatFileSize = (bytes) => {
//     if (!bytes) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
//   };

//   const removeFile = (fileId) =>
//     setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));

//   return (
//     <div className="space-y-6">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">
//           How would you like to add content?
//         </h2>
//         <p className="text-gray-600">
//           Choose your preferred method (Upload or Paste)
//         </p>
//       </div>

//       {/* ✅ SUBJECT FIELD WITH API-BASED TYPEAHEAD */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Subject *
//           </label>

//           <div className="relative">
//             <input
//               type="text"
//               value={subject}
//               onChange={(e) => {
//                 setSubject(e.target.value);
//                 if (subjectError) setSubjectError("");
//                 setShowSubjectOptions(true);
//               }}
//               onFocus={() => setShowSubjectOptions(true)}
//               onClick={() => setShowSubjectOptions(true)}
//               onBlur={() => {
//                 setTimeout(() => setShowSubjectOptions(false), 150);
//               }}
//               placeholder={
//                 subjectsLoading
//                   ? "Loading subjects…"
//                   : "e.g., Mathematics"
//               }
//               className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />

//             {/* ▼ icon right side */}
//             <button
//               type="button"
//               onMouseDown={(e) => {
//                 e.preventDefault();
//                 setShowSubjectOptions((prev) => !prev);
//               }}
//               className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
//             >
//               <span className="text-xs">▼</span>
//             </button>

//             {/* Dropdown options */}
//             {shouldShowDropdown && (
//               <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
//                 {filteredOptions.map((opt) => (
//                   <button
//                     key={opt}
//                     type="button"
//                     onMouseDown={(e) => {
//                       e.preventDefault();
//                       setSubject(opt);        // ✅ yahi se subject set hoga
//                       if (subjectError) setSubjectError("");
//                       setShowSubjectOptions(false);
//                     }}
//                     className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${
//                       subject === opt ? "bg-blue-50 font-medium" : ""
//                     }`}
//                   >
//                     {opt}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {subjectsErr && (
//             <p className="mt-1 text-sm text-red-600">{subjectsErr}</p>
//           )}

//           {subjectError && (
//             <p className="mt-1 text-sm text-red-600">{subjectError}</p>
//           )}
//         </div>
//       </div>

//       {/* ===== baaki tumhara existing code same ===== */}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//         <button
//           onClick={() => setInputMethod("paste")}
//           className={`p-6 rounded-lg border-2 transition-all ${
//             inputMethod === "paste"
//               ? "border-blue-500 bg-blue-50"
//               : "border-gray-200 hover:border-gray-300"
//           }`}
//         >
//           <Edit3 className="h-8 w-8 mx-auto mb-3 text-green-600" />
//           <h3 className="font-semibold mb-2">Paste Content</h3>
//           <p className="text-sm text-gray-600">
//             Paste text directly into the editor
//           </p>
//         </button>

//         <button
//           onClick={() => setInputMethod("upload")}
//           className={`p-6 rounded-lg border-2 transition-all ${
//             inputMethod === "upload"
//               ? "border-blue-500 bg-blue-50"
//               : "border-gray-200 hover:border-gray-300"
//           }`}
//         >
//           <Upload className="h-8 w-8 mx-auto mb-3 text-blue-600" />
//           <h3 className="font-semibold mb-2">Upload Files</h3>
//           <p className="text-sm text-gray-600">
//             Upload PDF, DOCX, TXT, or MD files
//           </p>
//         </button>
//       </div>

//       {inputMethod === "upload" && (
//         <div className="space-y-4">
//           <div
//             {...getRootProps()}
//             className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
//               isDragActive
//                 ? "border-blue-500 bg-blue-50"
//                 : "border-gray-300 hover:border-gray-400"
//             }`}
//           >
//             <input {...getInputProps()} />
//             <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
//             <h3 className="text-lg font-semibold mb-2">
//               {isDragActive ? "Drop files here" : "Drag & drop files here"}
//             </h3>
//             <p className="text-gray-600 mb-4">
//               or <span className="text-blue-600 font-medium">browse files</span>
//             </p>
//             <p className="text-sm text-gray-500">
//               Supported: PDF, DOCX, TXT, MD • Max 50MB per file
//             </p>
//           </div>

//           {uploadedFiles.length > 0 && (
//             <div className="space-y-2">
//               <h4 className="font-medium text-gray-900">
//                 Uploaded Files ({uploadedFiles.length})
//               </h4>
//               {uploadedFiles.map((file) => (
//                 <div
//                   key={file.id}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <FileText className="h-5 w-5 text-blue-600" />
//                     <div>
//                       <div className="font-medium">{file.file.name}</div>
//                       <div className="text-sm text-gray-500">
//                         {formatFileSize(file.size)}
//                       </div>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => removeFile(file.id)}
//                     className="p-1 text-red-600 hover:bg-red-50 rounded"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {inputMethod === "paste" && (
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Paste your content here
//           </label>
//           <textarea
//             rows={12}
//             value={textContent}
//             onChange={(e) => setTextContent(e.target.value)}
//             placeholder="Paste your syllabus, notes, or any text content here..."
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       )}

//       <SourceMixFlow
//         option={sourceOption}
//         onOptionChange={setSourceOption}
//         value={sourceMix}
//         onChange={setSourceMix}
//         bookId={bookId}
//         subject={subject}
//         formData={formData}
//         onSubjectError={setSubjectError}
//         onSaved={(ok) => setContentPrefsSaved(!!ok)}
//       />
//     </div>
//   );
// }



