import { Home, Layers, Heart, UserPlus, Info } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";

const MobileBottomNav = () => {
  const { pathname } = useLocation();
  const { openOverlay } = useDonateOverlay();

  const items = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Layers, label: "Initiatives", path: "/initiatives" },
    { icon: Heart, label: "Donate", action: openOverlay, center: true },
    { icon: UserPlus, label: "GoldenAge", path: "/register-parent" },
    { icon: Info, label: "About", path: "/about" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[64px] z-[996] flex items-center justify-around md:hidden bg-white border-t border-[var(--border-color)] shadow-[0_-2px_12px_rgba(0,0,0,0.06)] px-2">
      {items.map((item) => {
        const isActive = item.path ? pathname === item.path : false;
        if (item.center) {
          return (
            <button
              key="donate"
              onClick={() => { if (navigator.vibrate) navigator.vibrate(8); item.action?.(); }}
              className="flex flex-col items-center mt-[-14px]"
            >
              <div className="w-[52px] h-[52px] rounded-full bg-[var(--yellow)] flex items-center justify-center shadow-[var(--shadow-yellow)] border-4 border-white">
                <Heart size={22} className="text-[var(--dark)]" />
              </div>
              <span className="text-[10px] font-['Inter'] font-[500] text-[var(--dark)] mt-[2px]">{item.label}</span>
            </button>
          );
        }
        return (
          <Link key={item.path} to={item.path!} className="flex flex-col items-center gap-[2px]">
            <item.icon size={20} className={isActive ? "text-[var(--teal)]" : "text-[var(--light)]"} />
            <span className={`text-[10px] font-['Inter'] font-[500] ${isActive ? "text-[var(--teal)]" : "text-[var(--light)]"}`}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
