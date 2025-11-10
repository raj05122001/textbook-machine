"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Upload,
  FileText,
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
  Edit3,
  Save,
  MessageSquare,
  CheckCircle2,
  Trash2,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Step1BookDetails } from "@/components/create_book/Step1BookDetails";
import { Step2AISettings } from "@/components/create_book/Step2AISettings";
import { Step3SyllabusInput } from "@/components/create_book/Step3SyllabusInput";
import { Step4SyllabusReview } from "@/components/create_book/Step4SyllabusReview";
import { Step5Content } from "@/components/create_book/Step5Content";
/* ================== API & WS CONFIG ================== */
const API_BASE = "https://tbmplus-backend.ultimeet.io";
const WS_BASE = API_BASE.replace(/^https/i, "wss"); // => wss://tbmplus-backend.ultimeet.io

const pickSyllabusPayload = (raw) =>
  raw?.syllabus_json ?? raw?.syllabus ?? null;

async function jfetch(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json().catch(() => ({}));
}

/* ---- Syllabus normalize/denormalize ---- */
function normalizeSyllabus(raw) {
  const s = pickSyllabusPayload(raw);
  if (!s) return { subject_name: "", subject_description: "", units: [] };
  return {
    subject_name: s.subject_name ?? "",
    subject_description: s.subject_description ?? "",
    units: Array.isArray(s.units)
      ? s.units.map((u, ui) => ({
        unit_id: u?.unit_id ?? ui + 1,
        unit_name: u?.unit_name ?? `Unit ${ui + 1}`,
        number_of_pages: u?.number_of_pages ?? undefined,
        lessons: Array.isArray(u?.lessons)
          ? u.lessons.map((l, li) => ({
            lesson_id: l?.lesson_id ?? li + 1,
            lesson_name: l?.lesson_name ?? `Lesson ${li + 1}`,
            number_of_pages: l?.number_of_pages ?? undefined,
            lesson_description: l?.lesson_description ?? "",
          }))
          : [],
      }))
      : [],
  };
}
function denormalizeSyllabus(doc) {
  return {
    subject_name: doc?.subject_name ?? "",
    subject_description: doc?.subject_description ?? "",
    units: (doc?.units ?? []).map((u, ui) => ({
      unit_id: u?.unit_id ?? ui + 1,
      unit_name: u?.unit_name ?? `Unit ${ui + 1}`,
      number_of_pages: u?.number_of_pages ?? undefined,
      lessons: (u?.lessons ?? []).map((l, li) => ({
        lesson_id: l?.lesson_id ?? li + 1,
        lesson_name: l?.lesson_name ?? `Lesson ${li + 1}`,
        number_of_pages: l?.number_of_pages ?? undefined,
        lesson_description: l?.lesson_description ?? "",
      })),
    })),
  };
}

/* ================== MAIN PAGE ================== */
export default function CreateBookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ---------- steps ---------- */
  const steps = [
    {
      id: 1,
      title: "Book Details",
      description: "Add title, author, and description",
    },
    {
      id: 2,
      title: "AI Settings",
      description: "Configure processing options",
    },
    {
      id: 3,
      title: "Syllabus Input",
      description: "Choose input & create syllabus",
    },
    {
      id: 4,
      title: "Syllabus Review",
      description: "Edit or regenerate via feedback",
    },
    { id: 5, title: "Content", description: "Live generated book content" },
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // derive completed steps from URL/state
  const syncCompletedFromFlags = (bId, sId, approved) => {
    const s = new Set();
    if (bId) {
      s.add(1);
      s.add(2);
    } // Book created ⇒ step 1 & 2 done
    if (sId) {
      s.add(3);
    } // Syllabus exists ⇒ step 3 done
    if (approved) {
      s.add(4);
    } // Approved ⇒ step 4 done
    setCompletedSteps(s);
  };

  /* ---------- ids ---------- */
  const [bookId, setBookId] = useState(null);
  const [syllabusId, setSyllabusId] = useState(null);

  /* ---------- book form ---------- */
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "ACADEMICS",
    language: "ENGLISH",
    educational_level: "12TH",
    difficulty_level: "MODERATE",
    teaching_style: "PRACTICAL",
    model_preference: "OPENAI",
    country_region: "INDIA",
    expected_pages: 200,
    target_group: "STUDENTS",
    visibility: "private",
    processingOptions: {},
  });

  /* ---------- syllabus state ---------- */
  const [subject, setSubject] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [syllabusDoc, setSyllabusDoc] = useState({
    subject_name: "",
    subject_description: "",
    units: [],
  });

  /* ---------- content state ---------- */
  const [contentJson, setContentJson] = useState(null);
  const [contentPrefsSaved, setContentPrefsSaved] = useState(false);
  /* ---------- UI/control ---------- */
  const [errors, setErrors] = useState([]);
  const [processingStep, setProcessingStep] = useState("");
  const [isSyllabusStreaming, setIsSyllabusStreaming] = useState(false);
  const [isContentStreaming, setIsContentStreaming] = useState(false);

  /* ---------- files / pasted ---------- */
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [textContent, setTextContent] = useState("");
  const [inputMethod, setInputMethod] = useState("paste");

  /* ---------- websockets ---------- */
  const syllabusWsRef = useRef(null);
  const contentWsRef = useRef(null);
  const wsBackoffRef = useRef(1000);
  const syllabusExpectingRef = useRef(false);

  // ----- Step 5 state -----
  const [contentPhase, setContentPhase] = useState({
    // prompt_generation phase status
    status: "idle", // idle | started | completed | failed
    message: "",
  });
  const [lessonProgress, setLessonProgress] = useState({}); // { [lesson_id]: { unit, lesson, status, message, data? } }
  const [contentLog, setContentLog] = useState([]); // array of { ts, status, type, message }

  const isOpen = (ws) => ws && ws.readyState === WebSocket.OPEN;
  const reconnectLater = (fn, delayRef, id) => {
    const delay = Math.min(delayRef.current || 1000, 8000);
    setTimeout(() => fn(id), delay);
    delayRef.current = (delayRef.current || 1000) * 2;
  };

  useEffect(() => {
    return () => {
      syllabusExpectingRef.current = false; // <— add this
      try {
        syllabusWsRef.current?.close();
      } catch { }
      try {
        contentWsRef.current?.close();
      } catch { }
    };
  }, []);

  const openSyllabusSocket = useCallback((id) => {
    if (!id) return;

    // if already open for this id, keep it
    if (isOpen(syllabusWsRef.current) && syllabusWsRef.current.__sid === id)
      return;

    try {
      syllabusWsRef.current?.close();
    } catch { }
    syllabusWsRef.current = null;

    const ws = new WebSocket(`${WS_BASE}/ws/syllabus/${id}/`);
    ws.__sid = id;
    syllabusWsRef.current = ws;

    ws.onopen = () => {
      wsBackoffRef.current = 1000;
      // if we triggered this reconnect because we expect updates (feedback), show spinner
      if (syllabusExpectingRef.current) {
        setIsSyllabusStreaming(true);
        setProcessingStep("Regenerating...");
      }
    };

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data || "{}");
        const json = msg.syllabus ?? msg.syllabus_json ?? null;

        if (msg.status === "started") {
          syllabusExpectingRef.current = true;
          setIsSyllabusStreaming(true);
          setProcessingStep("Generating syllabus...");
        }

        if (json) {
          setSyllabusDoc(normalizeSyllabus({ syllabus_json: json }));
          setIsSyllabusStreaming(false);
          syllabusExpectingRef.current = false;
          toast.success("Syllabus updated");
        }

        if (msg.status === "completed") {
          setIsSyllabusStreaming(false);
          syllabusExpectingRef.current = false;
        }
      } catch (e) {
        console.debug("syllabus WS parse error:", e?.message);
      }
    };

    ws.onclose = () => {
      // reconnect only if we are expecting more messages (e.g., just sent feedback)
      if (
        syllabusExpectingRef.current &&
        document.visibilityState === "visible"
      ) {
        reconnectLater(openSyllabusSocket, wsBackoffRef, id);
      }
    };

    ws.onerror = () => {
      try {
        ws.close();
      } catch { }
    };
  }, []);

  const openContentSocket = useCallback((syllId) => {
    if (!syllId) return;
    if (contentWsRef.current) {
      try {
        contentWsRef.current.close();
      } catch { }
      contentWsRef.current = null;
    }

    const ws = new WebSocket(`${WS_BASE}/ws/content/${syllId}/`);
    contentWsRef.current = ws;

    setIsContentStreaming(true);
    setProcessingStep("Generating content...");

    ws.onopen = () => {
      wsBackoffRef.current = 1000;
    };

    ws.onmessage = (evt) => {
      let msg = {};
      try {
        msg = JSON.parse(evt.data || "{}");
      } catch { }

      const { status, type, message } = msg;

      // show last message in the header
      setProcessingStep(message || "");

      // prompt phase
      if (type === "prompt_generation") {
        if (status === "started")
          setContentPhase({
            status: "started",
            message: message || "Dynamic Prompt generation started",
          });
        if (status === "completed")
          setContentPhase({
            status: "completed",
            message: message || "Dynamic Prompt generation completed",
          });
        if (status === "failed")
          setContentPhase({
            status: "failed",
            message: message || "Prompt generation failed",
          });
        return; // nothing else to do on this frame
      }

      // per-lesson frames
      if (type === "content_generation") {
        const unitName = msg.Unit_name ?? msg.unit_name ?? "";
        const lessonName = msg.lesson_name ?? "";
        const lessonId = msg.lesson_id ?? msg.lesson?.id;

        // >>> unique key across units/lessons – DO NOT use lesson_id alone
        const key = `${unitName}::${lessonName}::${lessonId ?? ""}`;

        const entry = {
          unit: unitName,
          lesson: lessonName,
          status,
          message: message || "",
          data: msg.data || null,
          updatedAt: Date.now(),
          // preserve the first start time for ordering
          startedAt: undefined,
        };

        setLessonProgress((prev) => {
          const existing = prev[key];
          return {
            ...prev,
            [key]: {
              ...existing,
              ...entry,
              startedAt:
                existing?.startedAt ??
                (status === "started" ? Date.now() : Date.now()),
            },
          };
        });

        if (status === "completed" && msg.data) {
          setContentJson((prev) => ({
            ...(prev || {}),
            [key]: msg.data,
          }));
        }
      }

      // stop spinner when backend says all lessons are done
      if (
        status === "completed" &&
        type === "content_generation" &&
        /for all lessons/i.test(message || "")
      ) {
        setIsContentStreaming(false);
      }
      if (status === "failed") setIsContentStreaming(false);
    };

    ws.onclose = () => {
      setIsContentStreaming(false);
    };
    ws.onerror = () => {
      try {
        ws.close();
      } catch { }
    };
  }, []);

  useEffect(() => {
    return () => {
      try {
        syllabusWsRef.current?.close();
      } catch { }
      try {
        contentWsRef.current?.close();
      } catch { }
    };
  }, []);

  /* ---------- URL ids on first load ---------- */
  /* ---------- URL ids on first load ---------- */
  useEffect(() => {
    const qBook = searchParams.get("bookId");
    const qSyl = searchParams.get("syllabusId");
    const qApproved =
      (searchParams.get("approved") || "").toLowerCase() === "true";

    if (qBook) setBookId(Number(qBook));
    if (qSyl) setSyllabusId(Number(qSyl));

    // set completed steps based on URL flags
    syncCompletedFromFlags(
      qBook ? Number(qBook) : null,
      qSyl ? Number(qSyl) : null,
      qApproved
    );

    if (qSyl) {
      if (qApproved) {
        openContentSocket(Number(qSyl));
        setCurrentStep(5);
      } else {
        // existing syllabus review bootstrap...
        (async () => {
          try {
            const data = await jfetch(`/api/syllabi/${Number(qSyl)}/`, {
              method: "GET",
            });
            const json = pickSyllabusPayload(data);
            if (json)
              setSyllabusDoc(normalizeSyllabus({ syllabus_json: json }));
            else {
              setIsSyllabusStreaming(true);
              setProcessingStep("Generating syllabus...");
            }
          } catch { }
        })();
        openSyllabusSocket(Number(qSyl));
        setCurrentStep(4);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================== VALIDATION & NAV ================== */
  const validateStep = (step) => {
    const newErrors = [];
    if (step === 1) {
      if (!formData.title.trim()) newErrors.push("Book title is required");
      if (!formData.author.trim()) newErrors.push("Author name is required");
    }
    if (step === 2) {
      if (!formData.category) newErrors.push("Category is required");
      if (!formData.language) newErrors.push("Language is required");
      if (!formData.model_preference)
        newErrors.push("Model preference is required");
    }
    if (step === 3) {
      if (!bookId) newErrors.push("Book is not created yet.");
      if (!subject.trim()) newErrors.push("Subject is required for syllabus.");
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const markDoneAndNext = (step) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  // replace the old version
  const pushIdsToUrl = (bId, sId, extra = {}) => {
    const p = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );
    if (bId) p.set("bookId", String(bId));
    if (sId) p.set("syllabusId", String(sId));
    Object.entries(extra).forEach(([k, v]) => v != null && p.set(k, String(v)));
    router.replace(`?${p.toString()}`);

    // also update completedSteps immediately
    const approved =
      extra.approved ?? p.get("approved")?.toLowerCase() === "true";
    syncCompletedFromFlags(bId ?? bookId, sId ?? syllabusId, approved);
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      if (!validateStep(1)) return;
      markDoneAndNext(1);
      return;
    }
    if (currentStep === 2) {
      if (!validateStep(2)) return;
      const ok = await createBook();
      if (ok) markDoneAndNext(2);
      return;
    }
  };
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1));

  /* ================== BACKEND CALLS ================== */
  const createBook = async () => {
    const payload = {
      title: formData.title,
      description: formData.description || "",
      category: formData.category,
      language: formData.language,
      educational_level: formData.educational_level || "",
      difficulty_level: formData.difficulty_level,
      teaching_style: formData.teaching_style,
      model_preference: formData.model_preference,
      author_name: formData.author || "",
      country_region: formData.country_region || "INDIA",
      expected_pages: Number(formData.expected_pages) || 200,
      target_group: formData.target_group || "STUDENTS",
    };
    try {
      const data = await jfetch("/api/books/", {
        method: "POST",
        body: payload,
      });
      if (!data?.id) throw new Error("Missing book id in response");
      setBookId(data.id);
      pushIdsToUrl(data.id, syllabusId);
      toast.success("Book created");
      return true;
    } catch (e) {
      setErrors([`Book creation failed: ${e.message}`]);
      return false;
    }
  };

  const createSyllabus = async () => {
    if (!validateStep(3)) return;

    try {
      // ----- Upload path -> multipart/form-data -----
      if (inputMethod === "upload" && uploadedFiles.length > 0) {
        if (uploadedFiles.length > 1) {
          toast((t) => (
            <span>Multiple files selected — uploading the first one only.</span>
          ));
        }

        const fd = new FormData();
        fd.append("book", String(bookId));
        fd.append("syllabus_type", "FILE");
        fd.append("subject", subject || "Subject");
        fd.append("input_syllabus_file", uploadedFiles[0].file); // <-- exact field name

        const res = await fetch(`${API_BASE}/api/syllabi/`, {
          method: "POST",
          body: fd, // <-- DO NOT set Content-Type; browser sets boundary
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status}: ${txt || res.statusText}`);
        }

        const data = await res.json().catch(() => ({}));
        const newId = data?.data?.id ?? data?.id;
        if (!newId) throw new Error("Missing syllabus id in response");

        setSyllabusId(newId);
        pushIdsToUrl(bookId, newId);

        // Bootstrap once
        try {
          const d = await jfetch(`/api/syllabi/${newId}/`, { method: "GET" });
          const json = pickSyllabusPayload(d);
          if (json) setSyllabusDoc(normalizeSyllabus(d));
          else setIsSyllabusStreaming(true);
        } catch { }

        openSyllabusSocket(newId);
        toast.success("Syllabus upload started");
        setCurrentStep(4);
        setCompletedSteps((prev) => new Set([...prev, 3]));
        return;
      }

      // ----- Paste path -> JSON -----
      const data = await jfetch("/api/syllabi/", {
        method: "POST",
        body: {
          book: Number(bookId),
          syllabus_type: "TEXT",
          subject: subject || "Subject",
          input_syllabus_text: textContent || "", // backend can read this if needed
        },
      });

      const newId = data?.data?.id ?? data?.id;
      if (!newId) throw new Error("Missing syllabus id in response");

      setSyllabusId(newId);
      pushIdsToUrl(bookId, newId);

      // Bootstrap once
      try {
        const d = await jfetch(`/api/syllabi/${newId}/`, { method: "GET" });
        const json = pickSyllabusPayload(d);
        if (json) setSyllabusDoc(normalizeSyllabus(d));
        else setIsSyllabusStreaming(true);
      } catch { }

      openSyllabusSocket(newId);
      toast.success("Syllabus creation started");
      setCurrentStep(4);
      setCompletedSteps((prev) => new Set([...prev, 3]));
    } catch (e) {
      setErrors([`Syllabus creation failed: ${e.message}`]);
    }
  };

  const saveEditedSyllabus = async () => {
    if (!syllabusId) return setErrors(["No syllabus to update."]);
    try {
      await jfetch(`/api/syllabi/${syllabusId}/`, {
        method: "PATCH",
        body: { syllabus_json: denormalizeSyllabus(syllabusDoc) },
      });
      toast.success("Syllabus saved");
    } catch (e) {
      setErrors([`Save failed: ${e.message}`]);
    }
  };
  const sendFeedback = async (valueOrSend) => {
    if (!syllabusId) {
      setErrors(["No syllabus to send feedback for."]);
      return;
    }

    // Is this a click on SEND, or just typing?
    const isSendClick =
      (typeof valueOrSend === "object" && valueOrSend?.type === "SEND") ||
      valueOrSend === "SEND";

    // Resolve the text
    const text = isSendClick
      ? (typeof valueOrSend === "object" ? valueOrSend.text : feedbackText)
      : valueOrSend;

    // --- Typing path: keep parent in sync and clear stale "empty" error if any
    if (!isSendClick) {
      const live = String(text ?? "");
      setFeedbackText(live);
      // clear ONLY the "Feedback cannot be empty." message if user has typed something
      if (live.trim()) {
        setErrors((prev) => prev.filter((e) => e !== "Feedback cannot be empty."));
      }
      console.log("typing feedback:", live);
      return;
    }

    // --- SEND path
    const toSend = String(text ?? "").trim();
    if (!toSend) {
      // ensure error is displayed only when actually empty at click time
      setErrors((prev) => {
        // avoid duplicates
        if (prev.includes("Feedback cannot be empty.")) return prev;
        return [...prev, "Feedback cannot be empty."];
      });
      return;
    }

    console.log("sending feedback:", toSend);

    try {
      // we do expect fresh WS frames after sending
      syllabusExpectingRef.current = true;
      setIsSyllabusStreaming(true);
      setProcessingStep("Regenerating...");

      // make sure the socket is open
      openSyllabusSocket(syllabusId);

      await jfetch(`/api/syllabi/${syllabusId}/feedback/`, {
        method: "POST",
        body: { feedback: toSend },
      });

      // clear the stale empty-error on success (if it was shown previously)
      setErrors((prev) => prev.filter((e) => e !== "Feedback cannot be empty."));

      toast.success("Feedback sent");
      // results will arrive via WS
    } catch (e) {
      syllabusExpectingRef.current = false;
      setIsSyllabusStreaming(false);
      setErrors([`Feedback failed: ${e.message}`]);
    }
  };



  const approveSyllabus = async () => {
    if (!syllabusId) return setErrors(["No syllabus to approve."]);
    try {
      await jfetch(`/api/syllabi/${syllabusId}/approve/`, { method: "POST" });
      toast.success("Syllabus approved");
      pushIdsToUrl(bookId, syllabusId, { approved: true });
      openContentSocket(syllabusId); // <— use syllabusId for WS
      setCurrentStep(5);
      setCompletedSteps((prev) => new Set([...prev, 4]));
    } catch (e) {
      setErrors([`Approve failed: ${e.message}`]);
    }
  };

  /* ================== RENDER ================== */
  return (
    <div className="min-h-screen overflow-y-auto">
      <Toaster position="bottom-center" />
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Book
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your content into a professionally structured book with
            AI-powered automation
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center space-x-2 ${currentStep === step.id
                    ? "text-blue-600"
                    : completedSteps.has(step.id)
                      ? "text-green-600"
                      : "text-gray-400"
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${currentStep === step.id
                      ? "border-blue-600 bg-blue-50"
                      : completedSteps.has(step.id)
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300"
                      }`}
                  >
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
                  <ChevronRight className="h-5 w-5 text-gray-400 mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h3 className="font-medium text-red-800">
                Please fix the following:
              </h3>
            </div>
            <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
              {errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep === 1 && (
            <Step1BookDetails formData={formData} setFormData={setFormData} />
          )}

          {currentStep === 2 && (
            <Step2AISettings
              formData={formData}
              setFormData={setFormData}
              uploadedFiles={uploadedFiles}
              textContent={textContent}
            />
          )}

          {currentStep === 3 && (
            <Step3SyllabusInput
              subject={subject}
              setSubject={setSubject}
              bookId={bookId}
              inputMethod={inputMethod}
              setInputMethod={setInputMethod}
              uploadedFiles={uploadedFiles}
              textContent={textContent}
              setTextContent={setTextContent}
              setUploadedFiles={setUploadedFiles}
              formData={formData}
              contentPrefsSaved={contentPrefsSaved}
              setContentPrefsSaved={setContentPrefsSaved}
            />
          )}

          {currentStep === 4 && (
            <Step4SyllabusReview
              isStreaming={isSyllabusStreaming}
              processingStep={processingStep}
              bookId={bookId}
              syllabusId={syllabusId}
              syllabusDoc={syllabusDoc}
              setSyllabusDoc={setSyllabusDoc}
              onSave={saveEditedSyllabus}
              onFeedback={(v) => sendFeedback(v)}
              onApprove={approveSyllabus}
            />
          )}

          {currentStep === 5 && (
            <Step5Content
              isStreaming={isContentStreaming}
              processingStep={processingStep}
              contentPhase={contentPhase}
              lessonProgress={lessonProgress}
              contentLog={contentLog}
              contentJson={contentJson}
            />
          )}

          {/* Footer Nav */}
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
                  onClick={createSyllabus}
                  disabled={!contentPrefsSaved}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title={contentPrefsSaved ? "Create syllabus" : "First save Content Preferences"}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Create Syllabus</span>
                  <ChevronRight className="h-4 w-4" />
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

        {/* Help */}
        <div className="mt-8 text-center">
          <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1 mx-auto">
            <HelpCircle className="h-4 w-4" />
            <span>Need help? Check our documentation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
