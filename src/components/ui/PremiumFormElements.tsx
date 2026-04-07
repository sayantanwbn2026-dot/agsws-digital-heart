import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const PremiumInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; icon?: React.ReactNode }
>(({ label, error, icon, className, ...props }, ref) => (
  <div className="group">
    <label className="text-[11px] font-[600] uppercase tracking-[0.1em] text-[var(--mid)] mb-2 block transition-colors group-focus-within:text-[var(--teal)]">
      {label}
      {props.required && <span className="text-[#DC2626] ml-0.5">*</span>}
    </label>
    <div className="relative">
      {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--light)] group-focus-within:text-[var(--teal)] transition-colors">{icon}</span>}
      <input
        ref={ref}
        {...props}
        className={cn(
          "w-full h-[52px] px-4 text-[14px] text-[var(--dark)] bg-[var(--white)] border-[1.5px] rounded-[14px] outline-none transition-all duration-300",
          "border-[var(--border-color)] hover:border-[var(--mid)]/30",
          "focus:border-[var(--teal)] focus:shadow-[0_0_0_4px_rgba(31,154,168,0.08)]",
          "placeholder:text-[var(--light)]/60",
          error && "border-[#DC2626] focus:border-[#DC2626] focus:shadow-[0_0_0_4px_rgba(220,38,38,0.08)]",
          icon && "pl-11",
          className
        )}
      />
    </div>
    {error && (
      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-[#DC2626] mt-1.5 font-[500]">
        {error}
      </motion.p>
    )}
  </div>
));
PremiumInput.displayName = "PremiumInput";

export const PremiumTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }
>(({ label, error, className, ...props }, ref) => (
  <div className="group">
    <label className="text-[11px] font-[600] uppercase tracking-[0.1em] text-[var(--mid)] mb-2 block transition-colors group-focus-within:text-[var(--teal)]">
      {label}
      {props.required && <span className="text-[#DC2626] ml-0.5">*</span>}
    </label>
    <textarea
      ref={ref}
      {...props}
      className={cn(
        "w-full px-4 py-3.5 text-[14px] text-[var(--dark)] bg-[var(--white)] border-[1.5px] rounded-[14px] outline-none transition-all duration-300 resize-none",
        "border-[var(--border-color)] hover:border-[var(--mid)]/30",
        "focus:border-[var(--teal)] focus:shadow-[0_0_0_4px_rgba(31,154,168,0.08)]",
        "placeholder:text-[var(--light)]/60",
        error && "border-[#DC2626]",
        className
      )}
    />
    {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-[#DC2626] mt-1.5 font-[500]">{error}</motion.p>}
  </div>
));
PremiumTextarea.displayName = "PremiumTextarea";

export const PremiumSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }
>(({ label, error, children, className, ...props }, ref) => (
  <div className="group">
    <label className="text-[11px] font-[600] uppercase tracking-[0.1em] text-[var(--mid)] mb-2 block transition-colors group-focus-within:text-[var(--teal)]">
      {label}
      {props.required && <span className="text-[#DC2626] ml-0.5">*</span>}
    </label>
    <select
      ref={ref}
      {...props}
      className={cn(
        "w-full h-[52px] px-4 text-[14px] text-[var(--dark)] bg-[var(--white)] border-[1.5px] rounded-[14px] outline-none transition-all duration-300 appearance-none cursor-pointer",
        "border-[var(--border-color)] hover:border-[var(--mid)]/30",
        "focus:border-[var(--teal)] focus:shadow-[0_0_0_4px_rgba(31,154,168,0.08)]",
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23888%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[position:right_16px_center] bg-no-repeat",
        error && "border-[#DC2626]",
        className
      )}
    >
      {children}
    </select>
    {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-[#DC2626] mt-1.5 font-[500]">{error}</motion.p>}
  </div>
));
PremiumSelect.displayName = "PremiumSelect";

export const PremiumCard = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-[var(--white)] rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-8 lg:p-10", className)} {...props}>
    {children}
  </div>
);

export const PremiumButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost"; loading?: boolean; icon?: React.ReactNode }
>(({ variant = "primary", loading, icon, children, className, ...props }, ref) => {
  const base = "relative font-[600] text-[14px] rounded-full transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden";
  const variants = {
    primary: "h-[52px] px-10 bg-[var(--teal)] text-white hover:bg-[var(--teal-dark)] hover:shadow-[var(--shadow-md)] active:scale-[0.98]",
    secondary: "h-[48px] px-8 border-[1.5px] border-[var(--border-color)] text-[var(--mid)] hover:border-[var(--teal)] hover:text-[var(--teal)] hover:bg-[var(--teal-light)] active:scale-[0.98]",
    ghost: "h-[44px] px-6 text-[var(--teal)] hover:bg-[var(--teal-light)]",
  };
  return (
    <motion.button ref={ref} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className={cn(base, variants[variant], className)} {...props}>
      {loading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>{icon}{children}</>
      )}
    </motion.button>
  );
});
PremiumButton.displayName = "PremiumButton";
