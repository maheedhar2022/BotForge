import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Upload, 
  Trash2, 
  PlusCircle, 
  FileText, 
  Check, 
  AlertCircle,
  Clock
} from 'lucide-react';

export default function KnowledgeBase({ chatbot }) {
  // FAQ Form States
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [faqLoading, setFaqLoading] = useState(false);
  const [faqSuccess, setFaqSuccess] = useState(false);

  // File Upload States
  const [file, setFile] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileSuccess, setFileSuccess] = useState(false);
  const [fileError, setFileError] = useState('');

  // Documents list states
  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(true);

  // Load knowledge documents list
  async function loadDocuments() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.warn('Could not load knowledge files list.');
    } finally {
      setDocsLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, [chatbot]);

  // Submit manual FAQ QA
  const handleFaqSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setFaqLoading(true);
    setFaqSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/upload-faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question, answer })
      });

      if (res.ok) {
        setQuestion('');
        setAnswer('');
        setFaqSuccess(true);
        setTimeout(() => setFaqSuccess(false), 3000);
        await loadDocuments(); // reload list
      }
    } catch (err) {
      alert('Failed to submit FAQ.');
    } finally {
      setFaqLoading(false);
    }
  };

  // Submit PDF File upload
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setFileError('');
    } else {
      setFileError('Please select a valid PDF file under 5MB.');
      setFile(null);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setFileLoading(true);
    setFileSuccess(false);
    setFileError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/upload-pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setFile(null);
        setFileSuccess(true);
        setTimeout(() => setFileSuccess(false), 3000);
        await loadDocuments(); // reload list
      } else {
        setFileError(data.error || 'Failed to process document.');
      }
    } catch (err) {
      setFileError('Server timeout. File processing failed.');
    } finally {
      setFileLoading(false);
    }
  };

  // Delete document
  const handleDeleteDoc = async (id) => {
    if (!confirm('Are you sure you want to remove this knowledge document? This will remove related vectors.')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/documents/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        await loadDocuments();
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-indigo-400" />
          Knowledge Base Hub
        </h2>
        <p className="text-slate-400 text-sm mt-1 font-medium">
          Feed your AI chatbot FAQs and training documents. Our RAG engine extracts and builds embeddings for real-time customer retrieval.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Adding training inputs */}
        <div className="space-y-6">
          
          {/* FAQ Manual Addition Box */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/60">
            <h3 className="font-bold text-base text-slate-200 flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              Add FAQ Question Pair
            </h3>
            
            <form onSubmit={handleFaqSubmit} className="space-y-4">
              
              {faqSuccess && (
                <div className="bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-xs px-4 py-3 rounded-xl font-medium flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  FAQ successfully compiled and indexed.
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Visitor Query Question
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What is your operating hours?"
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl outline-none text-slate-200 placeholder-slate-600 text-sm focus:border-indigo-500/80 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Intelligent Bot Answer
                </label>
                <textarea
                  rows="3"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="We are open Monday through Friday 9 AM to 9 PM, Saturday 10 AM to 6 PM..."
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl outline-none text-slate-200 placeholder-slate-600 text-sm focus:border-indigo-500/80 transition-all font-medium resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={faqLoading || !question.trim() || !answer.trim()}
                className="w-full py-3 rounded-xl gradient-indigo-violet text-white font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-lg active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {faqLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Index FAQ Pair
                  </>
                )}
              </button>

            </form>
          </div>

          {/* PDF Uploader Box */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/60">
            <h3 className="font-bold text-base text-slate-200 flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-cyan-400" />
              Upload PDF Business Files
            </h3>

            <form onSubmit={handleFileUpload} className="space-y-4">
              
              {fileSuccess && (
                <div className="bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-xs px-4 py-3 rounded-xl font-medium flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  PDF parsed successfully. Chunks are semantically vector indexed.
                </div>
              )}

              {fileError && (
                <div className="bg-red-950/20 border border-red-900/30 text-red-400 text-xs px-4 py-3 rounded-xl font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {fileError}
                </div>
              )}

              {/* Drag n drop box */}
              <div className="border border-dashed border-slate-800 bg-slate-950/40 rounded-xl p-8 flex flex-col items-center justify-center text-center relative hover:border-slate-700 transition-all">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <FileText className={`w-10 h-10 mb-3 ${file ? 'text-cyan-400' : 'text-slate-600'}`} />
                {file ? (
                  <div>
                    <span className="block text-xs font-semibold text-slate-200 truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-medium mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to Upload
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="block text-xs font-semibold text-slate-400">
                      Drag & Drop PDF or click to select
                    </span>
                    <span className="block text-[10px] text-slate-600 mt-1 font-medium">
                      Fits menus, pricing sheets, business documents (Max 5MB)
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={fileLoading || !file}
                className="w-full py-3 rounded-xl gradient-cyan-purple text-white font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-lg active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {fileLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Parsing text & generating vectors...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload & Extract Content
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

        {/* Right Side: Documents lists */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/60 flex flex-col h-[630px]">
          <div className="mb-4">
            <h3 className="font-bold text-base text-slate-200">
              Active Knowledge Files
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              List of indexed nodes matching currently parsed text sources.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {docsLoading ? (
              <div className="space-y-3 py-6">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-16 bg-slate-900/50 rounded-xl border border-slate-850 animate-pulse"></div>
                ))}
              </div>
            ) : documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-full text-slate-600 py-12">
                <FileText className="w-12 h-12 mb-3 text-slate-700" />
                <span className="text-xs font-semibold text-slate-400">Knowledge Base is Empty</span>
                <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                  Feed the chatbot FAQs or PDFs to enable contextual automated answering.
                </p>
              </div>
            ) : (
              documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className="p-4 bg-slate-900/40 rounded-xl border border-slate-850 flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-850 ${doc.type === 'pdf' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="block text-xs font-semibold text-slate-300 truncate">
                        {doc.filename}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-0.5">
                        <span className="uppercase bg-slate-950 px-1.5 py-0.5 rounded text-[8px] border border-slate-900">
                          {doc.type}
                        </span>
                        <span>•</span>
                        <span>{(doc.char_count / 1000).toFixed(1)}k chars</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="w-8 h-8 rounded-lg bg-red-950/20 text-red-400 border border-red-900/30 flex items-center justify-center hover:bg-red-950/40 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
