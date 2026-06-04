import { useRef, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Award, AlertCircle, ArrowRight, User, Lock, Loader2, X, Printer } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { useCMSSection } from "@/hooks/useCMSSection";
import { dedupedJsonFetch } from "@/lib/request-dedupe";

const defaultVol = {
  card_heading: "Find Your Profile",
  card_subheading: "Enter your Volunteer ID from your welcome email",
  input_placeholder: "e.g. VOL-2025-0042",
  helper_text: "Use the ID issued to you by AGSWS (welcome email).",
  error_text: "Volunteer not registered. Check your welcome email for the correct ID or contact AGSWS.",
  cert_heading: "Request Certificate",
  cert_body: "Download a certificate confirming your volunteer service with AGSWS.",
  cert_button: "Request Certificate",
};

const VolunteerPortal = () => {
  useSEO("Volunteer Portal", "Track your AGSWS volunteer hours and request certificates.");
  const { data: cms } = useCMSSection<typeof defaultVol>('volunteer_portal', defaultVol);
  const [volId, setVolId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);
  const [searched, setSearched] = useState(false);

  const [loading, setLoading] = useState(false);
  const lookupInFlight = useRef<string | null>(null);

  // ── Certificate request flow ────────────────────────────────
  const [certOpen, setCertOpen] = useState(false);
  const [certPwd, setCertPwd] = useState("");
  const [certError, setCertError] = useState<string | null>(null);
  const [certLoading, setCertLoading] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);

  const handleSearch = async () => {
    const id = volId.trim().toUpperCase();
    if (!id || lookupInFlight.current === id) return;
    lookupInFlight.current = id;
    setSearched(true);
    setLoading(true);
    setError(false);
    setResult(null);
    setCertificate(null);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/data-api?action=track-volunteer&id=${encodeURIComponent(id)}`;
      const data = await dedupedJsonFetch<any>(`track-volunteer:${id}`, url, {
        headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      }, { ttlMs: 12000 });
      if (data?.error) setError(true);
      else setResult(data);
    } catch {
      setError(true);
    } finally {
      lookupInFlight.current = null;
      setLoading(false);
    }
  };

  const openCertModal = () => {
    if (!result?.hasCertificatePassword) {
      setCertOpen(true);
      setCertError("A certificate password has not been set for your account yet. Please contact AGSWS to enable certificate downloads.");
      return;
    }
    setCertPwd("");
    setCertError(null);
    setCertificate(null);
    setCertOpen(true);
  };

  const submitCertRequest = async () => {
    if (!result || !certPwd) return;
    setCertLoading(true);
    setCertError(null);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/data-api?action=request-certificate`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ id: result.ref, password: certPwd }),
      });
      const data = await res.json().catch(() => ({}));
      if (!data?.ok) {
        setCertError(data?.error || 'Could not verify certificate password.');
      } else {
        setCertificate(data.certificate);
      }
    } catch {
      setCertError('Network error. Please try again.');
    } finally {
      setCertLoading(false);
    }
  };

  const printCertificate = () => {
    if (!certificate) return;
    const issued = new Date(certificate.issuedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Certificate · ${certificate.name}</title>
      <style>
        @page { size: A4 landscape; margin: 0; }
        html,body{margin:0;padding:0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;background:#f6f4ef;color:#1a2c3a}
        .cert{box-sizing:border-box;width:297mm;height:210mm;padding:22mm;background:#fffdf7;background-image:radial-gradient(circle at 12% 18%,rgba(31,154,168,.08),transparent 40%),radial-gradient(circle at 88% 80%,rgba(242,183,5,.1),transparent 45%);border:14px double #1F9AA8;position:relative}
        .corner{position:absolute;width:80px;height:80px;border:3px solid #F2B705}
        .c1{top:18mm;left:18mm;border-right:0;border-bottom:0}
        .c2{top:18mm;right:18mm;border-left:0;border-bottom:0}
        .c3{bottom:18mm;left:18mm;border-right:0;border-top:0}
        .c4{bottom:18mm;right:18mm;border-left:0;border-top:0}
        .eyebrow{font-size:11px;letter-spacing:.4em;text-transform:uppercase;color:#1F9AA8;font-weight:700;text-align:center;margin-bottom:8mm}
        h1{font-size:42px;margin:0;text-align:center;letter-spacing:-.01em;font-weight:800}
        .sub{text-align:center;color:#3a5060;margin-top:4mm;font-size:14px}
        .name{text-align:center;font-size:54px;font-weight:800;color:#1F9AA8;margin:14mm 0 6mm;font-family:'Cormorant Garamond','Times New Roman',serif;letter-spacing:.01em}
        .body{text-align:center;max-width:200mm;margin:0 auto;font-size:15px;line-height:1.7;color:#23384a}
        .pills{display:flex;justify-content:center;gap:8mm;margin-top:10mm;flex-wrap:wrap}
        .pill{padding:8px 18px;border-radius:999px;background:#1F9AA8;color:#fff;font-weight:700;font-size:13px;letter-spacing:.02em}
        .pill.alt{background:#F2B705;color:#1a2c3a}
        .meta{display:flex;justify-content:space-between;align-items:end;margin-top:18mm}
        .sig{flex:1;text-align:center;font-size:12px;color:#3a5060}
        .sig .line{border-top:1px solid #1a2c3a;margin:0 14mm 6px;padding-top:6px;font-weight:700;color:#1a2c3a;letter-spacing:.04em}
        .ref{position:absolute;bottom:10mm;left:0;right:0;text-align:center;font-size:10px;color:#7a8a99;letter-spacing:.2em;text-transform:uppercase}
      </style></head><body>
      <div class="cert">
        <div class="corner c1"></div><div class="corner c2"></div><div class="corner c3"></div><div class="corner c4"></div>
        <div class="eyebrow">Akhil Garhmondal Social Welfare Society</div>
        <h1>Certificate of Volunteer Service</h1>
        <p class="sub">This certificate is proudly presented to</p>
        <div class="name">${certificate.name}</div>
        <p class="body">In sincere recognition of dedicated service as a <strong>${certificate.role}</strong> with AGSWS since <strong>${certificate.since}</strong>, contributing <strong>${certificate.totalHours} hours</strong> across our community programmes in healthcare, education and elder care across West Bengal.</p>
        <div class="pills">
          <span class="pill">${certificate.totalHours} verified hours</span>
          <span class="pill alt">Volunteer ID · ${certificate.ref}</span>
        </div>
        <div class="meta">
          <div class="sig"><div class="line">Programme Director</div>AGSWS</div>
          <div class="sig"><div class="line">Issued On</div>${issued}</div>
        </div>
        <div class="ref">Verify at agsws.lovable.app/volunteer-portal · ${certificate.ref}</div>
      </div>
      <script>window.onload=()=>setTimeout(()=>window.print(),300)</script>
      </body></html>`;
    const w = window.open('', '_blank', 'width=1200,height=820');
    if (!w) return;
    w.document.open(); w.document.write(html); w.document.close();
  };

  return (
    <main id="main-content">
      <PageHero title="Volunteer Portal" size="sm" breadcrumb={[{ label: "Home", href: "/" }, { label: "Volunteer Portal" }]} />

      <section className="bg-[var(--bg)] py-12 sm:py-16 lg:py-20">
        <div className="max-w-[520px] mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-[16px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--teal-light)] flex items-center justify-center">
                <User size={18} className="text-[var(--teal)]" />
              </div>
              <div>
                <h3 className="text-[16px] font-[700] text-[var(--dark)] leading-tight">{cms.card_heading}</h3>
                <p className="text-[11px] text-[var(--light)]">{cms.card_subheading}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--light)]" />
                <input
                  value={volId}
                  onChange={(e) => setVolId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={cms.input_placeholder}
                  className="w-full h-[48px] pl-11 pr-4 text-[14px] text-[var(--dark)] bg-[var(--bg)] border border-[var(--border-color)] rounded-[12px] outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10 transition-all placeholder:text-[var(--light)]"
                />
              </div>
              <motion.button
                onClick={handleSearch}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-[48px] px-6 bg-[var(--teal)] text-white font-[600] rounded-[12px] flex items-center justify-center gap-2 text-[13px] hover:bg-[var(--teal-dark)] transition-colors"
              >
                <ArrowRight size={16} /> View
              </motion.button>
            </div>
            <p className="text-[11px] text-[var(--light)] mt-2">{cms.helper_text}</p>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {searched && error && (
            <motion.div key="err" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-[520px] mx-auto mt-6 px-6">
              <div className="bg-[var(--yellow-light)] border border-[var(--yellow)]/40 rounded-[14px] p-5 flex gap-3">
                <AlertCircle className="text-[var(--yellow)] flex-shrink-0" size={20} />
                <p className="text-[13px] text-[var(--mid)]">{cms.error_text}</p>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div key="res" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-[520px] mx-auto mt-6 px-6">
              <div className="bg-white rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[var(--teal)] to-[var(--teal-dark)] p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-[800] text-[20px]">{result.name[0]}</div>
                  <div>
                    <p className="font-[700] text-[18px] text-white">{result.name}</p>
                    <span className="text-[11px] font-[600] text-white/70">{result.role} · Since {result.since} · {volId.toUpperCase()}</span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Hours */}
                  <div className="bg-[var(--teal-light)] rounded-[14px] p-5 mb-6">
                    <p className="text-[36px] font-[800] text-[var(--teal)] leading-none">{result.totalHours} <span className="text-[16px] font-[500]">hours</span></p>
                    <p className="text-[13px] text-[var(--mid)] mt-1">contributed to AGSWS</p>
                    <div className="flex h-2 rounded-full overflow-hidden mt-3 gap-0.5">
                      {Object.entries(result.categories).map(([key, val]: any) => {
                        const colors: Record<string, string> = { field: "bg-[var(--teal)]", medical: "bg-[var(--teal-dark)]", education: "bg-[var(--purple)]", admin: "bg-[var(--beige)]" };
                        return <div key={key} className={`${colors[key]} h-full rounded-full`} style={{ width: `${(val / result.totalHours) * 100}%` }} />;
                      })}
                    </div>
                    <div className="flex gap-4 mt-3 flex-wrap">
                      {Object.entries(result.categories).map(([key, val]: any) => {
                        const colors: Record<string, string> = { field: "bg-[var(--teal)]", medical: "bg-[var(--teal-dark)]", education: "bg-[var(--purple)]", admin: "bg-[var(--beige)]" };
                        return (
                          <div key={key} className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${colors[key]}`} />
                            <span className="text-[10px] text-[var(--light)] capitalize">{key} ({val}h)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Activities */}
                  <h4 className="font-[600] text-[13px] text-[var(--dark)] mb-3 uppercase tracking-[0.06em]">Recent Activities</h4>
                  <div className="space-y-3 mb-6">
                    {result.activities.map((a: any, i: number) => (
                      <div key={i} className="flex gap-3 text-[13px] py-2 border-b border-[var(--border-color)] last:border-0">
                        <span className="text-[11px] text-[var(--teal)] font-[600] w-20 flex-shrink-0">{a.date}</span>
                        <span className="text-[var(--mid)] flex-1">{a.desc}</span>
                        <span className="text-[11px] text-[var(--light)] flex-shrink-0 font-[600]">{a.hours}h</span>
                      </div>
                    ))}
                  </div>

                  {/* Certificate */}
                  <div className="bg-[var(--yellow-light)] rounded-[14px] p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Award size={18} className="text-[var(--yellow)]" />
                      <span className="font-[600] text-[14px] text-[var(--dark)]">{cms.cert_heading}</span>
                    </div>
                    <p className="text-[12px] text-[var(--mid)] mb-3">{cms.cert_body}</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={openCertModal}
                      className="w-full bg-[var(--yellow)] text-[var(--dark)] font-[700] py-3 rounded-full flex items-center justify-center gap-2 text-[13px] shadow-[var(--shadow-yellow)]"
                    >
                      <Award size={14} /> {cms.cert_button}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Certificate password modal ───────────────────────── */}
      <AnimatePresence>
        {certOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => !certLoading && setCertOpen(false)}
          >
            <motion.div
              initial={{ y: 16, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 10, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[440px] bg-white rounded-[20px] shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[var(--teal)] to-[var(--teal-dark)] px-6 py-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Award size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-[700] text-[15px] leading-tight">Request Certificate</h3>
                  <p className="text-white/70 text-[11px]">Enter the password issued to you by AGSWS</p>
                </div>
                <button onClick={() => !certLoading && setCertOpen(false)} className="text-white/70 hover:text-white" aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                {!certificate ? (
                  <>
                    <label className="block text-[11px] uppercase tracking-[0.08em] font-[700] text-[var(--light)] mb-2">Certificate password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--light)]" />
                      <input
                        type="password"
                        autoFocus
                        value={certPwd}
                        onChange={(e) => setCertPwd(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && submitCertRequest()}
                        placeholder="Enter the password from your email"
                        className="w-full h-[46px] pl-10 pr-3 text-[14px] text-[var(--dark)] bg-[var(--bg)] border border-[var(--border-color)] rounded-[12px] outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10"
                      />
                    </div>
                    {certError && (
                      <div className="mt-3 flex gap-2 text-[12px] text-[var(--mid)] bg-[var(--yellow-light)] border border-[var(--yellow)]/40 rounded-[10px] p-3">
                        <AlertCircle size={14} className="text-[var(--yellow)] flex-shrink-0 mt-0.5" />
                        <span>{certError}</span>
                      </div>
                    )}
                    <button
                      disabled={!certPwd || certLoading}
                      onClick={submitCertRequest}
                      className="mt-5 w-full h-[46px] bg-[var(--teal)] text-white font-[700] rounded-[12px] flex items-center justify-center gap-2 text-[13px] disabled:opacity-50 hover:bg-[var(--teal-dark)] transition-colors"
                    >
                      {certLoading ? <Loader2 size={15} className="animate-spin" /> : <Award size={15} />}
                      {certLoading ? 'Verifying…' : 'Verify & Generate'}
                    </button>
                    <p className="text-[11px] text-[var(--light)] mt-3 text-center">
                      Don't have a password? Email <a href="mailto:volunteers@agsws.org" className="text-[var(--teal)] font-[600]">volunteers@agsws.org</a>
                    </p>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-[var(--teal-light)] flex items-center justify-center mb-3">
                      <Award size={22} className="text-[var(--teal)]" />
                    </div>
                    <h4 className="font-[800] text-[16px] text-[var(--dark)]">Certificate ready</h4>
                    <p className="text-[12px] text-[var(--mid)] mt-1">Issued to <strong>{certificate.name}</strong> ({certificate.ref}).</p>
                    <button
                      onClick={printCertificate}
                      className="mt-5 w-full h-[46px] bg-[var(--yellow)] text-[var(--dark)] font-[700] rounded-[12px] flex items-center justify-center gap-2 text-[13px] shadow-[var(--shadow-yellow)]"
                    >
                      <Printer size={15} /> Open & Print Certificate
                    </button>
                    <button
                      onClick={() => setCertOpen(false)}
                      className="mt-2 w-full text-[12px] text-[var(--light)] hover:text-[var(--mid)]"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default VolunteerPortal;
