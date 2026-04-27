import { useState, useRef, useEffect, useCallback } from "react";
import { useSEO } from "@/hooks/useSEO";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, GraduationCap, CheckCircle, Phone, ArrowRight, Upload, X, FileText, Mail, Clock, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import FadeInUp from "@/components/ui/FadeInUp";
import { supabase } from "@/integrations/supabase/client";
import toast from "react-hot-toast";

const medicalSchema = z.object({
  patientName: z.string().min(2, "Required"),
  patientAge: z.string().min(1, "Required"),
  condition: z.string().min(5, "Please describe the condition"),
  hospitalName: z.string().optional(),
  income: z.string().min(1, "Required"),
  address: z.string().min(5, "Required"),
  contactName: z.string().optional(),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Valid email required"),
});

const educationSchema = z.object({
  childName: z.string().min(2, "Required"),
  childAge: z.string().min(1, "Required"),
  grade: z.string().min(1, "Required"),
  schoolName: z.string().min(2, "Required"),
  needFees: z.boolean().default(false),
  needBooks: z.boolean().default(false),
  needMeals: z.boolean().default(false),
  needUniform: z.boolean().default(false),
  needExamFees: z.boolean().default(false),
  parentName: z.string().min(2, "Required"),
  parentPhone: z.string().min(10, "Valid phone required"),
  parentEmail: z.string().email("Valid email required"),
  income: z.string().min(1, "Required"),
  reason: z.string().max(300).optional(),
});

const incomeOptions = ["Below ₹5,000", "₹5,000–₹15,000", "₹15,000–₹30,000", "Above ₹30,000"];

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

const formatBytes = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

const FormField = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="text-[12px] font-[600] text-[var(--dark)] mb-2 block uppercase tracking-[0.06em]">{label}</label>
    {children}
    {error && <p className="text-[12px] text-[#DC2626] mt-1">{error}</p>}
  </div>
);

type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';
type Attachment = {
  file: File;
  id: string;
  status: UploadStatus;
  progress: number; // 0-100
  error?: string;
  remotePath?: string;
};

const DocumentUploader = ({
  files,
  onChange,
  accentColor,
  helperText,
  onRetry,
}: {
  files: Attachment[];
  onChange: (files: Attachment[]) => void;
  accentColor: string;
  helperText: string;
  onRetry?: (id: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleAdd = (incoming: FileList | null) => {
    if (!incoming) return;
    const next: Attachment[] = [...files];
    for (const f of Array.from(incoming)) {
      if (next.length >= MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} files allowed`);
        break;
      }
      if (!ALLOWED_TYPES.includes(f.type)) {
        toast.error(`${f.name}: only PDF, JPG, PNG, or WEBP allowed`);
        continue;
      }
      if (f.size > MAX_FILE_BYTES) {
        toast.error(`${f.name} is larger than 5 MB`);
        continue;
      }
      if (next.some(a => a.file.name === f.name && a.file.size === f.size)) continue;
      next.push({
        file: f,
        id: `${f.name}-${f.size}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        status: 'idle',
        progress: 0,
      });
    }
    onChange(next);
    if (inputRef.current) inputRef.current.value = '';
  };

  const remove = (id: string) => {
    const a = files.find(x => x.id === id);
    if (a?.status === 'uploading') {
      toast.error('Wait for the upload to finish before removing');
      return;
    }
    onChange(files.filter(x => x.id !== id));
  };

  return (
    <div>
      <label className="text-[12px] font-[600] text-[var(--dark)] mb-2 block uppercase tracking-[0.06em]">Supporting Documents <span className="text-[var(--light)] normal-case tracking-normal font-[400]">(optional)</span></label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleAdd(e.dataTransfer.files); }}
        className={`cursor-pointer rounded-[var(--radius-xl)] border-2 border-dashed transition-all p-6 text-center ${dragOver ? 'scale-[1.01]' : ''}`}
        style={{
          borderColor: dragOver ? accentColor : files.length ? accentColor + '55' : 'var(--border-color)',
          background: dragOver ? `color-mix(in srgb, ${accentColor} 6%, white)` : 'color-mix(in srgb, var(--bg) 40%, transparent)',
        }}
      >
        <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 12%, white)` }}>
          <Upload size={18} style={{ color: accentColor }} />
        </div>
        <p className="text-[13px] font-[600] text-[var(--dark)] mb-1">{dragOver ? 'Drop to upload' : 'Click or drop files to upload'}</p>
        <p className="text-[11px] text-[var(--light)]">{helperText}</p>
        <p className="text-[11px] text-[var(--light)] mt-1">PDF, JPG, PNG, WEBP · max 5 MB each · up to {MAX_FILES} files</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(',')}
          className="hidden"
          onChange={(e) => handleAdd(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((a) => (
            <li key={a.id} className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] bg-white border border-[var(--border-color)] relative overflow-hidden">
              {a.status === 'uploading' && (
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--bg)]">
                  <div className="h-full transition-[width] duration-200" style={{ width: `${a.progress}%`, backgroundColor: accentColor }} />
                </div>
              )}
              <div className="shrink-0">
                {a.status === 'done' ? <CheckCircle size={16} className="text-emerald-500" />
                  : a.status === 'error' ? <AlertCircle size={16} className="text-red-500" />
                  : a.status === 'uploading' ? <Loader2 size={16} className="animate-spin" style={{ color: accentColor }} />
                  : <FileText size={16} style={{ color: accentColor }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-[500] text-[var(--dark)] truncate">{a.file.name}</p>
                <p className="text-[11px] text-[var(--light)]">
                  {a.status === 'uploading' ? `Uploading… ${a.progress}%`
                    : a.status === 'done' ? `Uploaded · ${formatBytes(a.file.size)}`
                    : a.status === 'error' ? <span className="text-red-500">{a.error || 'Upload failed'}</span>
                    : formatBytes(a.file.size)}
                </p>
              </div>
              {a.status === 'error' && onRetry && (
                <button type="button" onClick={() => onRetry(a.id)} className="text-[11px] font-[600] px-2 py-1 rounded-full border border-[var(--border-color)] text-[var(--mid)] hover:bg-[var(--bg)] transition-colors flex items-center gap-1" aria-label={`Retry ${a.file.name}`}>
                  <RefreshCw size={11} /> Retry
                </button>
              )}
              <button type="button" onClick={() => remove(a.id)} disabled={a.status === 'uploading'} className="p-1 hover:bg-[var(--bg)] rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed" aria-label={`Remove ${a.file.name}`}>
                <X size={14} className="text-[var(--mid)]" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// XHR-based upload to data-api with progress callback
const uploadOne = (a: Attachment, refKey: string, onProgress: (pct: number) => void): Promise<{ path: string; name: string; size: number; type: string }> => {
  return new Promise((resolve, reject) => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/data-api?action=upload-application-doc`;
    const fd = new FormData();
    fd.append('file', a.file);
    fd.append('ref', refKey);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('apikey', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.min(99, Math.round((e.loaded / e.total) * 100)));
    };
    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300) resolve(body);
        else reject(new Error(body?.error || `Upload failed (${xhr.status})`));
      } catch {
        reject(new Error('Upload failed'));
      }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(fd);
  });
};

const ApplyForSupport = () => {
  useSEO("Apply for Support", "Apply for AGSWS medical or education support. Free and confidential.");
  const [activeForm, setActiveForm] = useState<"medical" | "education" | null>(null);
  const [submitted, setSubmitted] = useState<{ ref: string; type: 'medical' | 'education'; email: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<Attachment[]>([]);
  const [statusData, setStatusData] = useState<any>(null);
  const [refreshingStatus, setRefreshingStatus] = useState(false);

  const med = useForm({ resolver: zodResolver(medicalSchema) });
  const edu = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: { needFees: false, needBooks: false, needMeals: false, needUniform: false, needExamFees: false },
  });

  // Upload a single attachment into the private bucket via data-api.
  // Updates the file list with status / progress, and resolves with the
  // server-recorded metadata (path/name/size/type) on success.
  const runUpload = useCallback(async (id: string, refKey: string) => {
    let target: Attachment | undefined;
    setFiles(prev => {
      const next = prev.map(f => {
        if (f.id !== id) return f;
        target = { ...f, status: 'uploading', progress: 0, error: undefined };
        return target!;
      });
      return next;
    });
    if (!target) return null;
    try {
      const meta = await uploadOne(target, refKey, (pct) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: pct } : f));
      });
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'done', progress: 100, remotePath: meta.path } : f));
      return meta;
    } catch (e: any) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', error: e.message } : f));
      return null;
    }
  }, []);

  const handleRetry = useCallback((id: string) => {
    const refKey = `retry-${Date.now()}`;
    runUpload(id, refKey);
  }, [runUpload]);

  const uploadFiles = async (refKey: string): Promise<{ name: string; path: string; size: number; type: string }[]> => {
    const pending = files.filter(f => f.status !== 'done');
    const results = await Promise.all(pending.map(f => runUpload(f.id, refKey)));
    const allMeta: { name: string; path: string; size: number; type: string }[] = [];
    files.forEach((f) => {
      if (f.status === 'done' && f.remotePath) {
        allMeta.push({ name: f.file.name, path: f.remotePath, size: f.file.size, type: f.file.type });
      }
    });
    results.forEach((r, i) => {
      if (r) allMeta.push({ name: pending[i].file.name, path: r.path, size: r.size, type: r.type });
    });
    return allMeta;
  };

  const submitApplication = async (params: {
    type: 'medical' | 'education';
    applicant_name: string;
    email: string;
    phone: string;
    form: any;
  }) => {
    setSubmitting(true);
    try {
      const refKey = `${params.type}-${Date.now()}`;
      const documents = await uploadFiles(refKey);
      // If any file is in error state, ask the user to retry/remove first.
      const stillFailing = files.some(f => f.status === 'error');
      if (stillFailing) {
        toast.error('Please retry or remove failed uploads before submitting');
        setSubmitting(false);
        return;
      }
      const { data: inserted, error } = await (supabase.from('support_applications' as any) as any)
        .insert({
          type: params.type,
          applicant_name: params.applicant_name,
          email: params.email,
          phone: params.phone,
          form_data: { ...params.form, documents },
        })
        .select('application_ref')
        .single();
      if (error) throw error;
      const ref = inserted?.application_ref || `APP-${Date.now()}`;
      try { localStorage.setItem('agsws_last_application_ref', ref); } catch {}

      // Fire-and-forget: applicant + admin notifications
      supabase.functions.invoke('send-email', {
        body: {
          type: 'application-confirmation',
          to: params.email,
          data: {
            application_ref: ref,
            applicant_name: params.applicant_name,
            type: params.type,
            phone: params.phone,
            documents,
          },
        },
      }).catch((e) => console.error('[applicant email]', e));

      supabase.functions.invoke('send-email', {
        body: {
          type: 'admin-application',
          to: 'admin',
          data: {
            application_ref: ref,
            applicant_name: params.applicant_name,
            email: params.email,
            phone: params.phone,
            type: params.type,
          },
        },
      }).catch((e) => console.error('[admin email]', e));

      setSubmitted({ ref, type: params.type, email: params.email });
      toast.success('Application submitted — check your email');
    } catch (err: any) {
      console.error('[apply submit]', err);
      toast.error(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onMedicalSubmit = (data: any) =>
    submitApplication({ type: 'medical', applicant_name: data.patientName, email: data.email, phone: data.phone, form: data });

  const onEducationSubmit = (data: any) =>
    submitApplication({ type: 'education', applicant_name: data.childName, email: data.parentEmail, phone: data.parentPhone, form: data });

  // Fetch live status timeline once submitted, and on demand.
  const refreshStatus = useCallback(async (ref: string) => {
    setRefreshingStatus(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/data-api?action=track-application&id=${encodeURIComponent(ref)}`;
      const r = await fetch(url, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } });
      const body = await r.json();
      if (r.ok) setStatusData(body);
    } catch (e) { console.error('[status]', e); }
    finally { setRefreshingStatus(false); }
  }, []);

  useEffect(() => {
    if (submitted?.ref) refreshStatus(submitted.ref);
  }, [submitted?.ref, refreshStatus]);

  if (submitted) {
    const stages: { label: string; completed: boolean; date: string | null; note: string }[] = statusData?.stages || [
      { label: 'Application Received', completed: true, date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), note: 'We have your application and reference number.' },
      { label: 'Under Review', completed: false, date: null, note: 'Our team is reviewing your details.' },
      { label: 'Decision Pending', completed: false, date: null, note: 'You will receive an email once a decision is made.' },
    ];
    const statusLabel = statusData?.status ? String(statusData.status).replace(/^./, c => c.toUpperCase()) : 'Pending';
    return (
      <main id="main-content" className="min-h-screen bg-[var(--bg)] py-10 lg:py-16">
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="max-w-[640px] w-full mx-auto px-5"
        >
          <div className="bg-white rounded-[var(--radius-2xl)] border border-[var(--border-color)] shadow-[var(--shadow-lg)] overflow-hidden">
            <div className="bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)] px-8 py-10 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 250, damping: 16, delay: 0.15 }} className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-5 border border-white/25">
                <CheckCircle size={42} className="text-white" />
              </motion.div>
              <p className="text-[10px] font-[700] text-white/70 uppercase tracking-[0.14em] mb-2">Application Received</p>
              <h2 className="text-[26px] font-[800] text-white tracking-[-0.01em]">Thank you</h2>
            </div>
            <div className="p-7 sm:p-8">
              <div className="bg-[var(--teal)]/5 rounded-[var(--radius-xl)] p-5 mb-6 border border-[var(--teal)]/15 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] text-[var(--light)] uppercase tracking-[0.1em] font-[600]">Reference</p>
                  <p className="text-[20px] font-[800] text-[var(--teal)] mt-0.5 font-mono tracking-tight">{submitted.ref}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[var(--light)] uppercase tracking-[0.1em] font-[600]">Status</p>
                  <p className="text-[14px] font-[700] text-[var(--dark)] mt-0.5 capitalize">{statusLabel}</p>
                </div>
              </div>

              {/* Status timeline */}
              <div className="mb-7">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-[700] text-[var(--dark)] uppercase tracking-[0.08em]">Application Timeline</p>
                  <button onClick={() => refreshStatus(submitted.ref)} disabled={refreshingStatus} className="text-[11px] text-[var(--teal)] font-[600] hover:underline flex items-center gap-1 disabled:opacity-50">
                    <RefreshCw size={11} className={refreshingStatus ? 'animate-spin' : ''} /> Refresh
                  </button>
                </div>
                <ol className="relative ml-2 border-l-2 border-[var(--border-color)] space-y-4 pl-5">
                  {stages.map((s, i) => (
                    <li key={i} className="relative">
                      <span className={`absolute -left-[27px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 ${s.completed ? 'bg-[var(--teal)] border-[var(--teal)]' : 'bg-white border-[var(--border-color)]'}`}>
                        {s.completed && <CheckCircle size={12} className="text-white" />}
                      </span>
                      <p className={`text-[13.5px] font-[700] ${s.completed ? 'text-[var(--dark)]' : 'text-[var(--light)]'}`}>{s.label}</p>
                      <p className="text-[12px] text-[var(--mid)] leading-[1.55] mt-0.5">{s.note}</p>
                      {s.date && <p className="text-[11px] text-[var(--light)] mt-1">{s.date}</p>}
                    </li>
                  ))}
                </ol>
              </div>

              <ul className="space-y-3 mb-7">
                <li className="flex gap-3 items-start">
                  <Mail size={16} className="text-[var(--teal)] mt-0.5 shrink-0" />
                  <span className="text-[13px] text-[var(--mid)] leading-[1.6]">A confirmation has been emailed to <strong className="text-[var(--dark)]">{submitted.email}</strong>.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <Clock size={16} className="text-[var(--teal)] mt-0.5 shrink-0" />
                  <span className="text-[13px] text-[var(--mid)] leading-[1.6]">We respond within <strong className="text-[var(--dark)]">3 working days</strong>.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <Phone size={16} className="text-[var(--teal)] mt-0.5 shrink-0" />
                  <span className="text-[13px] text-[var(--mid)] leading-[1.6]">For urgent help, call <strong className="text-[var(--dark)]">+91 98765 43210</strong>.</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="/" className="flex-1 text-center px-5 py-3 rounded-full bg-[var(--teal)] text-white font-[600] text-[14px] hover:bg-[var(--teal-dark)] transition-colors">Back to Home</a>
                <button onClick={() => { setSubmitted(null); setStatusData(null); setActiveForm(null); setFiles([]); med.reset(); edu.reset(); }} className="flex-1 px-5 py-3 rounded-full border border-[var(--border-color)] text-[var(--mid)] font-[600] text-[14px] hover:bg-[var(--bg)] transition-colors">
                  Submit another
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main id="main-content">
      <PageHero title="We're Here to Help" label="Apply for Support" subtitle="Applying for support is simple, private, and free. We respond within 3 working days." bgVariant="warm" size="md" breadcrumb={[{ label: "Home", href: "/" }, { label: "Apply for Support" }]} />

      <section className="bg-[var(--bg)] py-[64px] lg:py-[96px]">
        <div className="max-w-[900px] mx-auto px-[var(--container-px)]">
          {!activeForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { type: "medical" as const, icon: Heart, title: "Medical Aid", desc: "For patients and families who cannot afford treatment, medicines, surgery, or hospital costs.", color: "var(--teal)", colorLight: "var(--teal-light)" },
                { type: "education" as const, icon: GraduationCap, title: "Education Support", desc: "For students who need school fees, books, meals, or educational materials.", color: "var(--purple)", colorLight: "var(--purple-light)" },
              ].map((card, i) => (
                <FadeInUp key={card.type} delay={i * 0.1}>
                  <motion.button
                    onClick={() => setActiveForm(card.type)}
                    whileHover={{ y: -6, boxShadow: "var(--shadow-lg)" }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full text-left bg-white rounded-[var(--radius-2xl)] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-8 transition-shadow"
                  >
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: `color-mix(in srgb, ${card.color} 10%, white)` }}>
                      <card.icon size={26} style={{ color: card.color }} />
                    </div>
                    <h3 className="text-[20px] font-[700] text-[var(--dark)] mb-2">{card.title}</h3>
                    <p className="text-[14px] text-[var(--mid)] leading-[1.7] mb-5">{card.desc}</p>
                    <span className="inline-flex items-center gap-2 text-[14px] font-[600]" style={{ color: card.color }}>
                      Apply Now <ArrowRight size={16} />
                    </span>
                  </motion.button>
                </FadeInUp>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeForm === "medical" && (
              <motion.div key="med" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <button onClick={() => { setActiveForm(null); setFiles([]); }} className="text-[var(--teal)] font-[600] text-[14px] mb-6 hover:underline">← Choose a different category</button>
                <div className="bg-white rounded-[var(--radius-2xl)] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[var(--teal)]/10 flex items-center justify-center">
                      <Heart size={18} className="text-[var(--teal)]" />
                    </div>
                    <h3 className="text-[20px] font-[700] text-[var(--dark)]">Medical Aid Application</h3>
                  </div>
                  <form onSubmit={med.handleSubmit(onMedicalSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField label="Patient Name" error={med.formState.errors.patientName?.message as string}>
                        <input {...med.register("patientName")} placeholder="Full name" className="no-float" />
                      </FormField>
                      <FormField label="Patient Age" error={med.formState.errors.patientAge?.message as string}>
                        <input {...med.register("patientAge")} type="number" placeholder="Age" className="no-float" />
                      </FormField>
                    </div>
                    <FormField label="Medical Condition" error={med.formState.errors.condition?.message as string}>
                      <textarea {...med.register("condition")} placeholder="Describe the condition" rows={3} className="no-float" />
                    </FormField>
                    <FormField label="Hospital Name (if admitted)">
                      <input {...med.register("hospitalName")} placeholder="Hospital name" className="no-float" />
                    </FormField>
                    <FormField label="Monthly Family Income" error={med.formState.errors.income?.message as string}>
                      <select {...med.register("income")} className="no-float">
                        <option value="">Select</option>
                        {incomeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Kolkata Address" error={med.formState.errors.address?.message as string}>
                      <textarea {...med.register("address")} placeholder="Full address" rows={2} className="no-float" />
                    </FormField>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField label="Your Phone" error={med.formState.errors.phone?.message as string}>
                        <input {...med.register("phone")} type="tel" placeholder="Phone number" className="no-float" />
                      </FormField>
                      <FormField label="Your Email" error={med.formState.errors.email?.message as string}>
                        <input {...med.register("email")} type="email" placeholder="Email" className="no-float" />
                      </FormField>
                    </div>
                    <DocumentUploader
                      files={files}
                      onChange={setFiles}
                      accentColor="#1F9AA8"
                      helperText="Attach medical reports, prescriptions, hospital bills, or any supporting documents."
                    />
                    <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-[48px] bg-[var(--teal)] text-white font-[600] rounded-full text-[14px] hover:bg-[var(--teal-dark)] transition-colors mt-2 disabled:opacity-50">
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}

            {activeForm === "education" && (
              <motion.div key="edu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <button onClick={() => { setActiveForm(null); setFiles([]); }} className="text-[var(--purple)] font-[600] text-[14px] mb-6 hover:underline">← Choose a different category</button>
                <div className="bg-white rounded-[var(--radius-2xl)] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[var(--purple)]/10 flex items-center justify-center">
                      <GraduationCap size={18} className="text-[var(--purple)]" />
                    </div>
                    <h3 className="text-[20px] font-[700] text-[var(--dark)]">Education Support Application</h3>
                  </div>
                  <form onSubmit={edu.handleSubmit(onEducationSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField label="Child's Name" error={edu.formState.errors.childName?.message as string}>
                        <input {...edu.register("childName")} placeholder="Full name" className="no-float" />
                      </FormField>
                      <FormField label="Child's Age" error={edu.formState.errors.childAge?.message as string}>
                        <input {...edu.register("childAge")} type="number" placeholder="Age" className="no-float" />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField label="Class / Grade" error={edu.formState.errors.grade?.message as string}>
                        <input {...edu.register("grade")} placeholder="e.g. Class 5" className="no-float" />
                      </FormField>
                      <FormField label="School Name" error={edu.formState.errors.schoolName?.message as string}>
                        <input {...edu.register("schoolName")} placeholder="School name" className="no-float" />
                      </FormField>
                    </div>
                    <div>
                      <p className="text-[12px] font-[600] text-[var(--dark)] mb-3 uppercase tracking-[0.06em]">Specific Needs</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { name: "needFees" as const, label: "School fees" },
                          { name: "needBooks" as const, label: "Books" },
                          { name: "needMeals" as const, label: "Meals" },
                          { name: "needUniform" as const, label: "Uniform" },
                          { name: "needExamFees" as const, label: "Exam fees" },
                        ].map(c => (
                          <label key={c.name} className="flex items-center gap-2 p-3 rounded-[var(--radius-md)] border border-[var(--border-color)] cursor-pointer hover:bg-[var(--bg)] transition-colors">
                            <input {...edu.register(c.name)} type="checkbox" className="w-4 h-4 accent-[var(--purple)]" />
                            <span className="text-[13px] text-[var(--mid)]">{c.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField label="Parent/Guardian Name" error={edu.formState.errors.parentName?.message as string}>
                        <input {...edu.register("parentName")} placeholder="Name" className="no-float" />
                      </FormField>
                      <FormField label="Parent Phone" error={edu.formState.errors.parentPhone?.message as string}>
                        <input {...edu.register("parentPhone")} type="tel" placeholder="Phone" className="no-float" />
                      </FormField>
                    </div>
                    <FormField label="Parent Email" error={edu.formState.errors.parentEmail?.message as string}>
                      <input {...edu.register("parentEmail")} type="email" placeholder="Email" className="no-float" />
                    </FormField>
                    <FormField label="Monthly Family Income" error={edu.formState.errors.income?.message as string}>
                      <select {...edu.register("income")} className="no-float">
                        <option value="">Select</option>
                        {incomeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Brief reason (optional)">
                      <textarea {...edu.register("reason")} placeholder="Why is support needed?" rows={2} maxLength={300} className="no-float" />
                    </FormField>
                    <DocumentUploader
                      files={files}
                      onChange={setFiles}
                      accentColor="#5C5AB8"
                      helperText="Attach school ID, marksheets, fee receipts, or income proof."
                    />
                    <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-[48px] bg-[var(--purple)] text-white font-[600] rounded-full text-[14px] hover:opacity-90 transition-opacity mt-2 disabled:opacity-50">
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <FadeInUp className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-white rounded-full border border-[var(--border-color)] px-6 py-3 shadow-[var(--shadow-card)]">
              <Phone size={16} className="text-[var(--teal)]" />
              <span className="text-[14px] text-[var(--mid)]">Need urgent help? Call <strong className="text-[var(--teal)]">+91 98765 43210</strong></span>
            </div>
          </FadeInUp>
        </div>
      </section>
    </main>
  );
};

export default ApplyForSupport;
