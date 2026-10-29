import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  Trash2,
  Sparkles,
  BookOpen,
  CheckCircle,
  HelpCircle,
  BrainCircuit,
  FileCheck2,
  Copy,
  Check,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { api } from '../api';
import { DocumentItem } from '../types';
import { Toast } from '../components/common/Toast';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';

export const PdfAnalyzerPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [selectedDocDetails, setSelectedDocDetails] = useState<DocumentItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisAction, setAnalysisAction] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fetchDocuments = async () => {
    try {
      const docs = await api.getDocuments();
      setDocuments(docs);
      if (docs.length > 0 && !selectedDoc) {
        handleSelectDocument(docs[0]);
      }
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSelectDocument = async (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setAnalysisResult(null);
    setError(null);
    try {
      const details = await api.getDocument(doc.id);
      setSelectedDocDetails(details);
    } catch (err: any) {
      setError('Failed to load document text preview.');
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('File exceeds maximum size limit of 25MB.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const newDoc = await api.uploadPdf(file);
      setSuccess(`"${file.name}" uploaded and extracted successfully (${newDoc.page_count} pages).`);
      await fetchDocuments();
      handleSelectDocument(newDoc);
    } catch (err: any) {
      setError(err.message || 'Failed to extract text from PDF. The document may be empty or scanned without OCR.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRunAnalysis = async (action: string) => {
    if (!selectedDoc) return;
    setAnalyzing(true);
    setAnalysisAction(action);
    setError(null);

    try {
      const res = await api.analyzeDocument(selectedDoc.id, {
        action,
        question_count: 5,
      });
      setAnalysisResult(res.data);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Check your Gemini API key in Settings.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (docId: number) => {
    if (!confirm('Are you sure you want to delete this document from your library?')) return;
    try {
      await api.deleteDocument(docId);
      if (selectedDoc?.id === docId) {
        setSelectedDoc(null);
        setSelectedDocDetails(null);
        setAnalysisResult(null);
      }
      await fetchDocuments();
    } catch (err: any) {
      setError(err.message || 'Failed to delete document.');
    }
  };

  const handleCopyResult = () => {
    if (!analysisResult) return;
    const text = typeof analysisResult === 'string'
      ? analysisResult
      : JSON.stringify(analysisResult, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`p-8 rounded-3xl border-2 border-dashed transition-all text-center ${
          dragActive
            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <UploadCloud className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Upload Syllabus or Study Material PDF
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
          Drag and drop your course syllabus, lecture slides, or textbook chapter (up to 25MB). PyMuPDF will extract text for deep AI examination grounding.
        </p>

        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm cursor-pointer transition-all">
          <FileText className="w-4 h-4" />
          <span>{uploading ? 'Extracting Text...' : 'Select PDF File'}</span>
          <input
            type="file"
            accept=".pdf"
            disabled={uploading}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
        </label>
      </div>

      {error && <Toast type="error" message={error} onClose={() => setError(null)} />}
      {success && <Toast type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Main Analysis Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document Library */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Uploaded Documents</span>
            </h4>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {documents.length}
            </span>
          </div>

          {documents.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No documents uploaded yet. Upload a PDF above to begin.
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
              {documents.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDocument(doc)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-300'
                    }`}
                  >
                    <div className="truncate flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {doc.filename}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {doc.page_count} pages • {(doc.file_size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Actions & Analysis Viewer */}
        <div className="lg:col-span-8 space-y-6">
          {selectedDoc ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {selectedDoc.filename}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedDoc.page_count} pages extracted • Ready for AI processing
                  </p>
                </div>

                {/* Analysis Action Pills */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleRunAnalysis('summarize')}
                    disabled={analyzing}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 transition-colors"
                  >
                    Summarize PDF
                  </button>
                  <button
                    onClick={() => handleRunAnalysis('generate_2mark')}
                    disabled={analyzing}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    2-Mark Q&A
                  </button>
                  <button
                    onClick={() => handleRunAnalysis('generate_5mark')}
                    disabled={analyzing}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    5-Mark Answers
                  </button>
                  <button
                    onClick={() => handleRunAnalysis('generate_10mark')}
                    disabled={analyzing}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    10-Mark Outlines
                  </button>
                  <button
                    onClick={() => handleRunAnalysis('generate_mcqs')}
                    disabled={analyzing}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 transition-colors"
                  >
                    Generate MCQs
                  </button>
                </div>
              </div>

              {/* Text Preview Collapse */}
              {selectedDocDetails?.extracted_text_preview && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
                  <span className="font-semibold text-slate-500 block mb-1">
                    Extracted Text Grounding Preview:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 line-clamp-3 font-mono text-[11px]">
                    {selectedDocDetails.extracted_text_preview}
                  </p>
                </div>
              )}

              {/* Analysis Loading State */}
              {analyzing && (
                <LoadingSpinner message={`Running grounded AI ${analysisAction.replace('_', ' ')}...`} />
              )}

              {/* Analysis Output Result */}
              {analysisResult && !analyzing && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Generated Result ({analysisAction.replace('_', ' ')})
                    </span>
                    <button
                      onClick={handleCopyResult}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Result'}</span>
                    </button>
                  </div>

                  {/* Render based on format: summary or question array */}
                  {analysisResult.summary_text ? (
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {analysisResult.title}
                      </h4>
                      <MarkdownRenderer content={analysisResult.summary_text} />
                      {analysisResult.key_points && (
                        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900">
                          <h5 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-2">
                            Key Revision Points:
                          </h5>
                          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                            {analysisResult.key_points.map((p: string, i: number) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : Array.isArray(analysisResult) ? (
                    <div className="space-y-4">
                      {analysisResult.map((q: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                              Question {idx + 1} {q.marks ? `• [${q.marks} Marks]` : ''}
                            </span>
                            {q.topic && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {q.topic}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {q.question}
                          </p>

                          {q.options && (
                            <div className="space-y-1.5 pl-2">
                              {q.options.map((opt: any) => (
                                <div key={opt.id} className="text-xs text-slate-600 dark:text-slate-300">
                                  <span className="font-bold mr-2">{opt.id}.</span>
                                  {opt.text}
                                </div>
                              ))}
                            </div>
                          )}

                          {q.model_answer && (
                            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                              <span className="font-semibold text-slate-500 block mb-1">
                                Model Answer:
                              </span>
                              <MarkdownRenderer content={q.model_answer} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <pre className="text-xs p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-x-auto">
                      {JSON.stringify(analysisResult, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                No Document Selected
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select a document from your library on the left or upload a syllabus PDF above to generate summaries and questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

