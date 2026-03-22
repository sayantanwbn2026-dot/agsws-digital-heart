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
    { icon: UserPlus, label: "Register", path: "/register-parent" },
    { icon: Info, label: "About", path: "/about" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-50 flex items-center justify-around md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
      {items.map((item) => {
        const isActive = item.path ? pathname === item.path : false;
        if (item.center) {
          return (
            <button
              key="donate"
              onClick={() => { if (navigator.vibrate) navigator.vibrate(8); item.action?.(); }}
              className="flex flex-col items-center -mt-6"
            >
              <div className="w-14 h-14 rounded-full bg-yellow flex items-center justify-center shadow-yellow">
                <Heart size={22} className="text-text-dark" />
              </div>
              <span className="text-[10px] font-medium text-text-dark mt-0.5">{item.label}</span>
            </button>
          );
        }
        return (
          <Link key={item.path} to={item.path!} className="flex flex-col items-center gap-0.5">
            <item.icon size={20} className={isActive ? "text-teal" : "text-text-light"} />
            <span className={`text-[10px] font-medium ${isActive ? "text-teal" : "text-text-light"}`}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
