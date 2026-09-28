import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const PremiumInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; icon?: React.ReactNode }
>(({ label, error, icon, className, id, ...props }, ref) => {
  // Labels must be programmatically tied to their control, otherwise screen
  // readers announce an unlabelled field and clicking the label does nothing.
  const autoId = React.useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
  <div className="group">
    <label
      htmlFor={inputId}
      className="text-[11px] font-[600] uppercase tracking-[0.12em] text-[var(--mid)] mb-2 flex items-center gap-1.5 transition-colors group-focus-within:text-[var(--teal)]"
    >
      {label}
      {props.required && <span className="text-[#DC2626] ml-0.5" aria-hidden>*</span>}
    </label>
    <div className="relative">
      {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--light)] group-focus-within:text-[var(--teal)] transition-colors duration-200 pointer-events-none z-10">{icon}</span>}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
        style={{ ...(icon ? { paddingLeft: 44 } : null), ...(props.style || {}) }}
        className={cn(
          // Slightly tighter height + softer inner shadow for a more
          // refined, premium feel without changing layout sizing.
          "no-float w-full h-[50px] px-4 text-[14px] text-[var(--dark)] bg-[var(--white)] border-[1.5px] rounded-[10px] outline-none transition-all duration-300",
          "shadow-[inset_0_1px_0_rgba(0,0,0,0.02)]",
          "border-[var(--border-color)] hover:border-[var(--mid)]/40 hover:shadow-[inset_0_1px_0_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)]",
          "focus:border-[var(--teal)] focus:shadow-[0_0_0_4px_rgba(31,154,168,0.10),inset_0_1px_0_rgba(0,0,0,0.02)]",
          "placeholder:text-[var(--light)]/60",
          error && "border-[#DC2626] focus:border-[#DC2626] focus:shadow-[0_0_0_4px_rgba(220,38,38,0.10)]",
          className
        )}
      />
    </div>
    {error && (
      <motion.p id={errorId} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-[#DC2626] mt-1.5 font-[500] flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-[#DC2626]" aria-hidden />{error}
      </motion.p>
    )}
  </div>
  );
});
PremiumInput.displayName = "PremiumInput";

export const PremiumTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }
>(({ label, error, className, id, ...props }, ref) => {
  const autoId = React.useId();
  const fieldId = id ?? autoId;
  const errorId = `${fieldId}-error`;

  return (
  <div className="group">
    <label
      htmlFor={fieldId}
      className="text-[11px] font-[600] uppercase tracking-[0.12em] text-[var(--mid)] mb-2 flex items-center gap-1.5 transition-colors group-focus-within:text-[var(--teal)]"
    >
      {label}
      {props.required && <span className="text-[#DC2626] ml-0.5" aria-hidden>*</span>}
    </label>
    <textarea
      ref={ref}
      id={fieldId}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      {...props}
      className={cn(
        "no-float w-full px-4 py-3.5 text-[14px] text-[var(--dark)] bg-[var(--white)] border-[1.5px] rounded-[10px] outline-none transition-all duration-300 resize-none leading-[1.55]",
        "shadow-[inset_0_1px_0_rgba(0,0,0,0.02)]",
        "border-[var(--border-color)] hover:border-[var(--mid)]/40",
        "focus:border-[var(--teal)] focus:shadow-[0_0_0_4px_rgba(31,154,168,0.10),inset_0_1px_0_rgba(0,0,0,0.02)]",
        "placeholder:text-[var(--light)]/60",
        error && "border-[#DC2626]",
        className
      )}
    />
    {error && <motion.p id={errorId} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-[#DC2626] mt-1.5 font-[500] flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-[#DC2626]" aria-hidden />{error}</motion.p>}
  </div>
  );
});
PremiumTextarea.displayName = "PremiumTextarea";

export const PremiumSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }
>(({ label, error, children, className, id, ...props }, ref) => {
  const autoId = React.useId();
  const fieldId = id ?? autoId;
  const errorId = `${fieldId}-error`;

  return (
  <div className="group">
    <label
      htmlFor={fieldId}
      className="text-[11px] font-[600] uppercase tracking-[0.12em] text-[var(--mid)] mb-2 flex items-center gap-1.5 transition-colors group-focus-within:text-[var(--teal)]"
    >
      {label}
      {props.required && <span className="text-[#DC2626] ml-0.5" aria-hidden>*</span>}
    </label>
    <select
      ref={ref}
      id={fieldId}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      {...props}
      className={cn(
        "no-float w-full h-[50px] px-4 pr-10 text-[14px] text-[var(--dark)] bg-[var(--white)] border-[1.5px] rounded-[10px] outline-none transition-all duration-300 appearance-none cursor-pointer",
        "shadow-[inset_0_1px_0_rgba(0,0,0,0.02)]",
        "border-[var(--border-color)] hover:border-[var(--mid)]/40",
        "focus:border-[var(--teal)] focus:shadow-[0_0_0_4px_rgba(31,154,168,0.10),inset_0_1px_0_rgba(0,0,0,0.02)]",
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23888%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[position:right_16px_center] bg-no-repeat",
        error && "border-[#DC2626]",
        className
      )}
    >
      {children}
    </select>
    {error && <motion.p id={errorId} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-[#DC2626] mt-1.5 font-[500] flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-[#DC2626]" aria-hidden />{error}</motion.p>}
  </div>
  );
});
PremiumSelect.displayName = "PremiumSelect";

export const PremiumCard = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-[var(--white)] rounded-[12px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-8 lg:p-10", className)} {...props}>
    {children}
  </div>
);

export const PremiumButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost"; loading?: boolean; icon?: React.ReactNode }
>(({ variant = "primary", loading, icon, children, className, onClick, type, disabled, ...props }, ref) => {
  const base = "relative font-[600] text-[14px] rounded-full transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--teal)]/20 group";
  const variants = {
    primary: "h-[52px] px-10 bg-[var(--teal)] text-white hover:bg-[var(--teal-dark)] hover:shadow-[0_10px_24px_-8px_rgba(31,154,168,0.45)] active:scale-[0.98]",
    secondary: "h-[48px] px-8 border-[1.5px] border-[var(--border-color)] text-[var(--mid)] hover:border-[var(--teal)] hover:text-[var(--teal)] hover:bg-[var(--teal-light)] active:scale-[0.98]",
    ghost: "h-[44px] px-6 text-[var(--teal)] hover:bg-[var(--teal-light)]",
  };
  return (
    <button ref={ref} onClick={onClick} type={type} disabled={disabled} className={cn(base, variants[variant], className)} {...props}>
      {/* Diagonal sheen sweep on hover (primary only) */}
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform [transition-duration:900ms] ease-out"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%)",
          }}
        />
      )}
      {loading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <span className="relative flex items-center gap-2">{icon}{children}</span>
      )}
    </button>
  );
});
PremiumButton.displayName = "PremiumButton";
