import { Heart, BookOpen, Users, Building2, GraduationCap, Baby, HandHeart } from "lucide-react";

type Category = 'medical' | 'education' | 'elderly' | 'community' | 'child' | 'hospital' | 'classroom';

interface ImagePlaceholderProps {
  category: Category;
  className?: string;
  label?: string;
}

const config: Record<Category, { gradient: string; Icon: typeof Heart; defaultLabel: string }> = {
  medical:   { gradient: "from-[hsl(187,68%,27%)] to-[hsl(187,70%,39%)]", Icon: Heart, defaultLabel: "Medical Care" },
  education: { gradient: "from-[hsl(242,29%,50%)] to-[hsl(242,40%,70%)]", Icon: BookOpen, defaultLabel: "Education" },
  elderly:   { gradient: "from-[hsl(28,22%,62%)] to-[hsl(187,70%,39%)]", Icon: Users, defaultLabel: "Elder Care" },
  community: { gradient: "from-[hsl(187,70%,39%)] to-[hsl(44,60%,55%)]", Icon: HandHeart, defaultLabel: "Community" },
  child:     { gradient: "from-[hsl(29,80%,52%)] to-[hsl(187,52%,45%)]", Icon: Baby, defaultLabel: "Child Support" },
  hospital:  { gradient: "from-[hsl(187,68%,27%)] to-[hsl(200,20%,15%)]", Icon: Building2, defaultLabel: "Hospital" },
  classroom: { gradient: "from-[hsl(242,40%,95%)] to-[hsl(242,29%,50%)]", Icon: GraduationCap, defaultLabel: "Classroom" },
};

const ImagePlaceholder = ({ category, className = "", label }: ImagePlaceholderProps) => {
  const { gradient, Icon, defaultLabel } = config[category];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
      style={{ animation: 'imagePlaceholderPulse 3s ease-in-out infinite' }}
    >
      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
      {/* SVG pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 100 100">
        <pattern id={`dots-${category}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="white" />
        </pattern>
        <rect width="100" height="100" fill={`url(#dots-${category})`} />
      </svg>
      {/* Icon */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <Icon size={32} className="text-white/40 mb-2" />
        <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">{label || defaultLabel}</span>
      </div>
      {/* Wipe reveal animation */}
      <div className="absolute inset-0 bg-white animate-[imageReveal_0.8s_ease-out_forwards]" />
    </div>
  );
};

export default ImagePlaceholder;
