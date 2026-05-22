import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await supabase.functions.invoke('cms-auth', {
        body: { email, password },
      });
      
      if (res.data?.success) {
        localStorage.setItem('agsws_admin', 'true');
        localStorage.setItem('agsws_admin_token', res.data.token);
        navigate('/admin');
      } else {
        setShake(true);
        setError('Invalid email or password.');
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setShake(true);
      setError('Connection error. Please try again.');
      setTimeout(() => setShake(false), 500);
    }
    setLoading(false);
  };

  return (
    <div
      className="cms-shell min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(1200px 600px at 20% 0%, rgba(31,154,168,0.10), transparent 60%), radial-gradient(900px 500px at 100% 100%, rgba(31,29,26,0.06), transparent 60%), #F5F3EE',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px]"
      >
        <motion.div
          animate={shake ? { x: [0, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-2xl border border-border p-8 sm:p-10 w-full"
          style={{ boxShadow: '0 24px 60px -24px rgba(31,29,26,0.20), 0 2px 6px rgba(31,29,26,0.05)' }}
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 border border-primary/20">
              <Shield className="text-primary" size={22} />
            </div>
            <h1 className="text-[22px] font-semibold text-foreground tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
              AGSWS CMS
            </h1>
            <p className="text-[13px] text-muted-foreground mt-2">Sign in to manage your website content</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@agsws.org"
                className="w-full h-12 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-border bg-background text-sm focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-destructive text-center bg-destructive/5 rounded-lg py-2"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-60 text-sm shadow-sm active:scale-[0.99]"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-[10px] text-muted-foreground mt-7 tracking-wider uppercase">
            Secure admin access · AGSWS CMS
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
