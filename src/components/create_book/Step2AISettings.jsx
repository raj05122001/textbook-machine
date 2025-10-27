"use client";
import { BookOpen, Zap, Clock, Target } from "lucide-react";

export function Step2AISettings({
  formData,
  setFormData,
  uploadedFiles,
  textContent,
}) {
  const toggleProc = (key) =>
    setFormData((prev) => ({
      ...prev,
      processingOptions: {
        ...prev.processingOptions,
        [key]: !prev.processingOptions?.[key],
      },
    }));
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          AI Processing Options
        </h2>
        <p className="text-gray-600">
          Configure how AI will process and enhance your content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Model
          </label>
          <select
            value={formData.model_preference}
            onChange={(e) =>
              setFormData((p) => ({ ...p, model_preference: e.target.value }))
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="OPENAI">OPENAI 4o (Recommended)</option>
            <option value="CLAUDE">CLAUDE</option>
            <option value="GEMINI">GEMINI</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            OPENAI provides a great balance of quality and speed
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            Processing Features (UI only)
          </h4>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={!!formData.processingOptions?.createQuestions}
              onChange={() => toggleProc("createQuestions")}
              className="mt-1"
            />
            <div>
              <div className="font-medium">Create Q&A</div>
              <div className="text-sm text-gray-600">
                Generate review questions and answers for each chapter
              </div>
            </div>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={!!formData.processingOptions?.addReferences}
              onChange={() => toggleProc("addReferences")}
              className="mt-1"
            />
            <div>
              <div className="font-medium">Add References</div>
              <div className="text-sm text-gray-600">
                Include relevant citations and reference materials
              </div>
            </div>
          </label>

          {/* <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={!!formData.processingOptions?.improveContent}
              onChange={() => toggleProc("improveContent")}
              className="mt-1"
            />
            <div>
              <div className="font-medium">Improve Content</div>
              <div className="text-sm text-gray-600">
                Enhance readability and fix grammar issues
              </div>
            </div>
          </label> */}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Processing Preview
        </h4>
        <div className="text-sm text-blue-800 space-y-2">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Estimated processing time: 2–5 minutes</span>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>
              Expected chapters:{" "}
              {Math.ceil(
                (textContent?.length ||
                  uploadedFiles.reduce(
                    (acc, f) => acc + (f.content?.length || 0),
                    0
                  )) / 2000
              ) || 1}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>
              Reading time:{" "}
              {Math.ceil((textContent?.split(" ").length || 0) / 200) || 1}{" "}
              minutes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
