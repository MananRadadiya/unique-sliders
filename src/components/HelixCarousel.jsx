import React, { useState, useEffect, useRef } from "react";
import "../Styles/HelixCarousel.css";

const slides = [
  { title: "Quantum Core", subtitle: "Processing limit: Unbounded", icon: "⚛️", color: "#a855f7" },
  { title: "Neural Link", subtitle: "AI Architecture v9.0", icon: "🧠", color: "#3b82f6" },
  { title: "Hyper Space", subtitle: "Interstellar Trajectory", icon: "🚀", color: "#ec4899" },
  { title: "Bio-Synth", subtitle: "Organic Reconstruction", icon: "🧬", color: "#22c55e" },
  { title: "Meta Verse", subtitle: "Digital Horizon", icon: "🥽", color: "#f97316" },
];

export default function HelixCarousel() {
  const [currIndex, setCurrIndex] = useState(1000); // Start high for infinite loop
  const [width, setWidth] = useState(0);
  
  // Touch State for Swiping
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const canvasRef = useRef(null);

  // Resize Handler
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Canvas Animation (Constellations)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fill();

        // Draw Lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - dist / 1000})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // --- SWIPE LOGIC ---
  const handleTouchStart = (e) => {
    setTouchEnd(null); 
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) setCurrIndex(prev => prev + 1);
    if (isRightSwipe) setCurrIndex(prev => prev - 1);
  };

  // --- 3D MATH ---
  const getCardStyle = (index) => {
    const total = slides.length;
    let offset = (index - (currIndex % total)) % total;
    
    // Normalize offset to find shortest path around the circle
    if (offset < -total / 2) offset += total;
    if (offset > total / 2) offset -= total;

    const absOffset = Math.abs(offset);
    const isActive = absOffset < 0.5;
    
    // If screen is small, reduce radius
    const r = width < 768 ? 240 : 400; 
    const angle = offset * (360 / total);
    const radian = (angle * Math.PI) / 180;
    
    const x = Math.sin(radian) * r;
    const z = Math.cos(radian) * r - r;
    
    const scale = 1 - absOffset * 0.2;
    const opacity = 1 - absOffset * 0.3;

    return {
      transform: `translate3d(${x}px, 0, ${z}px) rotateY(${-angle}deg) scale(${scale})`,
      zIndex: Math.round((1 - absOffset) * 100),
      opacity: opacity < 0 ? 0 : opacity,
      // Fix: Only disable pointer events if card is far back
      pointerEvents: isActive ? "auto" : "none",
      filter: `blur(${absOffset * 2}px)`
    };
  };

  return (
    <div 
      className="helix-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas ref={canvasRef} className="helix-bg" />
      
      <div className="helix-viewport">
        <div className="helix-ring">
          {slides.map((slide, i) => (
            <div
              key={i}
              className="helix-card-wrapper"
              style={getCardStyle(i)}
              onClick={() => {
                // Clicking a side card moves it to center
                const offset = (i - (currIndex % slides.length));
                let jump = offset;
                if (offset > slides.length/2) jump -= slides.length;
                if (offset < -slides.length/2) jump += slides.length;
                if (jump !== 0) setCurrIndex(currIndex + jump);
              }}
            >
              <div 
                className="helix-card" 
                style={{ "--glow-color": slide.color }}
              >
                <div className="card-inner">
                  <div className="icon-box" style={{ background: slide.color }}>
                    {slide.icon}
                  </div>
                  <h2>{slide.title}</h2>
                  <p>{slide.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="helix-controls">
        <button onClick={() => setCurrIndex(currIndex - 1)}>←</button>
        <button onClick={() => setCurrIndex(currIndex + 1)}>→</button>
      </div>
    </div>
  );
}