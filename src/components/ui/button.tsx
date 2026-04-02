import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-semibold ring-offset-background transition-[color,background-color,border-color,text-decoration-color,fill,stroke,opacity,transform,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden select-none outline-none group text-[14px]",
  {
    variants: {
      variant: {
        primary: "bg-[var(--yellow)] text-[var(--dark)] border-none hover:shadow-[var(--shadow-yellow)] hover:scale-[1.03] active:scale-[0.97]",
        secondary: "bg-transparent text-[var(--teal)] border-[1.5px] border-[var(--teal)] hover:bg-[var(--teal-light)] hover:scale-[1.02] active:scale-[0.98]",
        ghost: "bg-transparent text-[var(--teal)] border-none hover:opacity-75 !p-0",
        icon: "bg-[var(--bg)] hover:bg-[var(--teal-light)] text-[var(--mid)] hover:text-[var(--teal)] rounded-[50%]",
        link: "text-primary underline-offset-4 hover:underline",
        default: "bg-[var(--teal)] text-white hover:bg-[var(--teal-dark)] hover:scale-[1.02] active:scale-[0.98]",
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
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild) {
      return <Slot className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>{children}</Slot>
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
