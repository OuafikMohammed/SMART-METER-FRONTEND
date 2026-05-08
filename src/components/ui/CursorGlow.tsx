"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

const CursorGlow = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  const springX = useSpring(-100, { stiffness: 150, damping: 20 });
  const springY = useSpring(-100, { stiffness: 150, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      springX.set(e.clientX);
      springY.set(e.clientY);

      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") !== null || 
        target.closest("a") !== null
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [springX, springY]);

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] hidden md:block"
    >
      {/* Central dot */}
      <div className="absolute inset-0 bg-brand-cyan rounded-full scale-10 transition-transform duration-300" style={{ transform: `scale(${isHovering ? 0.3 : 0.1})` }} />
      
      {/* Main glow */}
      <div 
        className="absolute inset-0 rounded-full blur-xl border border-brand-cyan/20 bg-brand-cyan/10 transition-all duration-300" 
        style={{ 
          transform: `scale(${isHovering ? 4 : 2})`,
          opacity: isHovering ? 0.8 : 0.4
        }} 
      />
      
      {/* Outer ring */}
      <div 
        className="absolute inset-0 rounded-full border border-brand-cyan/40 transition-all duration-500"
        style={{ 
          transform: `scale(${isHovering ? 3 : 1.5})`,
          opacity: isHovering ? 0.6 : 0.2
        }}
      />
    </motion.div>
  );
};

export default CursorGlow;
