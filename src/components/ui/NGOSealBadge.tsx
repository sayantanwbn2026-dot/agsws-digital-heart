import { ShieldCheck } from "lucide-react";

interface NGOSealBadgeProps {
  size?: number;
  className?: string;
}

const NGOSealBadge = ({ size = 80, className = "" }: NGOSealBadgeProps) => {
  const r = size / 2;
  const textR = r * 0.72;

  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {/* Outer ring */}
        <circle cx={r} cy={r} r={r - 2} fill="none" stroke="hsl(187 70% 39%)" strokeWidth="2" />
        {/* Inner ring */}
        <circle cx={r} cy={r} r={r - 6} fill="none" stroke="hsl(187 52% 93%)" strokeWidth="1" />
        {/* White fill */}
        <circle cx={r} cy={r} r={r - 8} fill="white" />
        {/* Arc text paths */}
        <defs>
          <path id="topArc" d={`M ${r - textR},${r} A ${textR},${textR} 0 0,1 ${r + textR},${r}`} />
          <path id="bottomArc" d={`M ${r + textR},${r} A ${textR},${textR} 0 0,1 ${r - textR},${r}`} />
        </defs>
        <text fill="hsl(187 70% 39%)" fontSize={size * 0.1} fontWeight="600" fontFamily="Inter, sans-serif" letterSpacing="0.08em">
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">AGSWS CERTIFIED</textPath>
        </text>
        <text fill="hsl(0 0% 53%)" fontSize={size * 0.09} fontWeight="500" fontFamily="Inter, sans-serif" letterSpacing="0.06em">
          <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">Since 2020</textPath>
        </text>
      </svg>
      <div className="absolute">
        <ShieldCheck size={size * 0.3} className="text-teal" />
      </div>
    </div>
  );
};

export default NGOSealBadge;
