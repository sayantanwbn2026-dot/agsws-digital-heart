import { ReactNode } from "react";

interface DonateButtonProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

const DonateButton = ({ className = "", children, onClick }: DonateButtonProps) => (
  <div className="relative group p-[2px] rounded-full overflow-hidden inline-block">
    <div className="absolute inset-[-1000%] animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,#F2B705_0%,#FFFFFF_50%,#F2B705_100%)]" />
    <button
      onClick={onClick}
      className={`relative bg-yellow text-text-dark font-semibold rounded-full transition-all duration-300 active:scale-95 hover:shadow-yellow ${className}`}
    >
      {children}
    </button>
  </div>
);

export default DonateButton;
