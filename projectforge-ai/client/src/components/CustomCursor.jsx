import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence, useTransform } from 'framer-motion';

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverLabel, setHoverLabel] = useState('');
  const [isMouseDown, setIsMouseDown] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Velocity tracking for deformation
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const velocity = useMotionValue(0);
  const rotation = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Fluid trail springs
  const trail1X = useSpring(mouseX, { damping: 30, stiffness: 100 });
  const trail1Y = useSpring(mouseY, { damping: 30, stiffness: 100 });
  const trail2X = useSpring(mouseX, { damping: 50, stiffness: 80 });
  const trail2Y = useSpring(mouseY, { damping: 50, stiffness: 80 });

  useEffect(() => {
    const moveMouse = (e) => {
      const { clientX, clientY } = e;
      
      // Calculate velocity and rotation
      const deltaX = clientX - lastMouseX.current;
      const deltaY = clientY - lastMouseY.current;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      velocity.set(Math.min(dist / 20, 1.5));
      rotation.set(angle);

      mouseX.set(clientX);
      mouseY.set(clientY);

      lastMouseX.current = clientX;
      lastMouseY.current = clientY;
    };

    const handleHover = (e) => {
      const target = e.target.closest('button, a, input, [role="button"], .magnetic-item, [data-cursor]');
      if (target) {
        setIsHovered(true);
        setHoverLabel(target.getAttribute('data-cursor') || '');
      } else {
        setIsHovered(false);
        setHoverLabel('');
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mouseover', handleHover);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleHover);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Transform velocity into stretch
  const scaleX = useTransform(velocity, [0, 1.5], [1, 1.5]);
  const scaleY = useTransform(velocity, [0, 1.5], [1, 0.7]);

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[10000] mix-blend-difference">
      {/* 1. FLUID TRAIL BLOBS */}
      <motion.div
        className="absolute w-12 h-12 bg-cyan-400/5 rounded-full blur-xl"
        style={{ x: trail2X, y: trail2Y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="absolute w-8 h-8 bg-cyan-400/10 rounded-full blur-lg"
        style={{ x: trail1X, y: trail1Y, translateX: "-50%", translateY: "-50%" }}
      />

      {/* 2. MAIN SUPREME RING */}
      <motion.div
        className="absolute flex items-center justify-center"
        style={{ 
          x: cursorX, 
          y: cursorY, 
          rotate: rotation,
          translateX: "-50%", 
          translateY: "-50%" 
        }}
      >
        <motion.div
          animate={{
            width: isHovered ? 100 : 40,
            height: isHovered ? 100 : 40,
            borderWidth: isHovered ? 1 : 2,
            borderColor: isHovered ? "rgba(34, 211, 238, 0.8)" : "rgba(34, 211, 238, 0.3)",
          }}
          style={{ scaleX, scaleY }}
          className="relative rounded-full border border-cyan-400/30 flex items-center justify-center transition-colors duration-500"
        >
          {/* Internal Crosshair (Rotates on move) */}
          <motion.div 
             animate={{ rotate: isHovered ? 180 : 0 }}
             className="absolute inset-0 opacity-20"
          >
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-400" />
            <div className="absolute left-1/2 top-0 w-[1px] h-full bg-cyan-400" />
          </motion.div>

          {/* Label Reveal */}
          <AnimatePresence>
            {isHovered && hoverLabel && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-10 whitespace-nowrap"
              >
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-cyan-400 drop-shadow-[0_0_5px_#22D3EE]">
                  {hoverLabel}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* 3. CORE POINT */}
      <motion.div
        className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_15px_white]"
        style={{ 
          x: mouseX, 
          y: mouseY, 
          translateX: "-50%", 
          translateY: "-50%",
          scale: isMouseDown ? 3 : 1
        }}
      />

      {/* 4. SCANLINE / PULSE RING (On Click) */}
      <AnimatePresence>
        {isMouseDown && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute w-10 h-10 border border-white/50 rounded-full"
            style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomCursor;
