import { motion } from "framer-motion";
import { useParallax } from "@/hooks/useParallax";

export const TealBlob = ({ className = "" }: { className?: string }) => {
  const { ref, y } = useParallax(60);
  return (
    <motion.div ref={ref} style={{ y }} className={`absolute pointer-events-none will-change-transform ${className}`}>
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          fill="hsl(187 70% 39% / 0.07)"
          d="M44.7,-76.4C58.8,-69.2,71.8,-58.7,79.6,-45.3C87.4,-31.9,90,-15.6,88.5,-0.9C87,13.9,81.4,27.8,73.2,39.9C65,52,54.2,62.3,41.5,70.1C28.8,77.9,14.4,83.2,-0.8,84.6C-16.1,86,-32.2,83.5,-45.2,75.8C-58.2,68.1,-68.2,55.2,-75.3,41C-82.4,26.8,-86.6,11.4,-85.3,-3.2C-84,-17.8,-77.2,-35.6,-66.2,-48.4C-55.2,-61.2,-40,-69,-25.5,-75.7C-11,-82.4,2.8,-88,16.8,-86.2C30.8,-84.4,30.6,-83.6,44.7,-76.4Z"
          transform="translate(100 100)"
        />
      </motion.svg>
    </motion.div>
  );
};

export const YellowBlob = ({ className = "" }: { className?: string }) => {
  const { ref, y } = useParallax(100);
  return (
    <motion.div ref={ref} style={{ y }} className={`absolute pointer-events-none will-change-transform ${className}`}>
      <motion.svg
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          fill="hsl(44 95% 49% / 0.06)"
          d="M39.5,-65.3C52.9,-60.2,67,-53.2,74.8,-41.8C82.6,-30.4,84.1,-14.7,82.1,-0.5C80.1,13.6,74.6,27.2,66.4,38.7C58.2,50.2,47.3,59.6,34.8,66.2C22.3,72.8,8.2,76.6,-5.5,76.1C-19.2,75.6,-32.4,70.8,-44.5,63.5C-56.6,56.2,-67.6,46.4,-74.2,33.8C-80.8,21.2,-83,5.8,-80.6,-8.2C-78.2,-22.2,-71.2,-34.8,-61.2,-44.2C-51.2,-53.6,-38.2,-59.8,-25.6,-65.2C-13,-70.6,-0.8,-75.2,11.1,-74.5C23,-73.8,26.1,-70.4,39.5,-65.3Z"
          transform="translate(100 100)"
        />
      </motion.svg>
    </motion.div>
  );
};

export const PurpleBlob = ({ className = "" }: { className?: string }) => {
  const { ref, y } = useParallax(40);
  return (
    <motion.div ref={ref} style={{ y }} className={`absolute pointer-events-none will-change-transform ${className}`}>
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          fill="hsl(242 29% 50% / 0.06)"
          d="M47.7,-79.1C62.3,-72.8,75.1,-61.5,82.5,-47.4C89.9,-33.3,91.9,-16.7,89.7,-1.3C87.5,14.1,81.1,28.2,72.5,40.1C63.9,52,53.1,61.7,40.4,68.5C27.7,75.3,13.1,79.2,-1.6,81.9C-16.3,84.6,-32.6,86.1,-45.4,79.8C-58.2,73.5,-67.5,59.4,-74.2,44.6C-80.9,29.8,-85,14.9,-84.5,0.3C-84,-14.3,-78.9,-28.6,-70.7,-40.2C-62.5,-51.8,-51.2,-60.7,-38.4,-68C-25.6,-75.3,-11.3,-81,2.5,-85.3C16.3,-89.6,33.1,-85.4,47.7,-79.1Z"
          transform="translate(100 100)"
        />
      </motion.svg>
    </motion.div>
  );
};
