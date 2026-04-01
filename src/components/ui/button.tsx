import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-semibold ring-offset-background transition-[color,background-color,border-color,text-decoration-color,fill,stroke,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden select-none outline-none group text-[14px]",
  {
    variants: {
      variant: {
        primary: "bg-[var(--yellow)] text-[var(--dark)] border-none",
        secondary: "bg-transparent text-[var(--teal)] border-[1.5px] border-[var(--teal)] hover:bg-[var(--teal-light)]",
        ghost: "bg-transparent text-[var(--teal)] border-none hover:opacity-75 !p-0",
        icon: "bg-[var(--bg)] hover:bg-[var(--teal-light)] text-[var(--mid)] hover:text-[var(--teal)] rounded-[50%]",
        link: "text-primary underline-offset-4 hover:underline",
        default: "bg-[var(--teal)] text-white hover:bg-[var(--teal-dark)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-[44px] lg:h-[48px] px-[28px] rounded-[var(--radius-full)]",
        sm: "h-9 px-3 text-xs rounded-full",
        lg: "h-11 px-8 rounded-full",
        icon: "w-[40px] h-[40px] rounded-[50%] p-0 flex-shrink-0",
        ghost: "h-auto p-0", 
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, onMouseDown, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<{ x: number; y: number; id: number }[]>([]);

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { x, y, id }]);
      
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);

      if (onMouseDown) onMouseDown(e);
    };

    const rippleColor = variant === "primary" || variant === "default" ? "bg-white" : "bg-[var(--teal)]";

    if (asChild) {
      return <Slot className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>{children}</Slot>
    }

    const Comp = motion.button;

    const isPrimary = variant === "primary";
    const isGhost = variant === "ghost";
    const isIcon = variant === "icon";
    const isSecondary = variant === "secondary";

    const hoverScale = isGhost ? 1 : isIcon ? 1 : isPrimary ? 1.03 : 1;
    const activeScale = isGhost ? 1 : isIcon ? 1 : isPrimary ? 0.97 : isSecondary ? 0.98 : 0.98;
    const hoverShadow = isPrimary ? "var(--shadow-yellow)" : "none";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref as any}
        onMouseDown={handleMouseDown}
        whileHover={{ scale: hoverScale, boxShadow: hoverShadow }}
        whileTap={{ scale: activeScale }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        
        {isGhost && (
           <style dangerouslySetInnerHTML={{__html: `
             .group:hover svg { transform: translateX(4px); transition: transform 200ms; }
             .group svg { transition: transform 200ms; }
           `}} />
        )}

        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.3 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`absolute rounded-full pointer-events-none z-0 ${rippleColor}`}
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 100,
                height: 100,
                transformOrigin: "center",
                marginTop: -50,
                marginLeft: -50,
              }}
            />
          ))}
        </AnimatePresence>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
