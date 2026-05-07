'use client';
import { useEffect, useState } from 'react';

export default function MouseTracker() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="fixed pointer-events-none z-50 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-out hidden md:block"
      style={{ left: position.x, top: position.y }}
    />
  );
}
