import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('agsws_admin', 'true');
        localStorage.setItem('agsws_admin_token', data.access_token);
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
    <div className="min-h-screen bg-teal-dark flex items-center justify-center px-4">
      <motion.div
        animate={shake ? { x: [0, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="bg-card rounded-xl shadow-lg p-12 w-full max-w-[400px]"
      >
        <div className="text-center mb-8">
          <span className="font-bold text-2xl text-teal">AGSWS</span>
          <p className="label-text text-text-light mt-2">Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-text-dark mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-teal focus:ring-2 focus:ring-teal/15 transition-all"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-dark mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 pr-12 border border-border rounded-lg bg-card outline-none focus:border-teal focus:ring-2 focus:ring-teal/15 transition-all"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-text-mid">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-teal text-primary-foreground font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
