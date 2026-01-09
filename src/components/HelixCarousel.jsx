import React, { useState, useEffect, useRef } from "react";
import "../Styles/HelixCarousel.css";

const slides = [
  { title: "Quantum Computing", subtitle: "Future of Processing", icon: "⚛️", gradient: "purple" },
  { title: "Neural Networks", subtitle: "AI That Learns", icon: "🧠", gradient: "blue" },
  { title: "Space Exploration", subtitle: "Beyond Stars", icon: "🚀", gradient: "pink" },
  { title: "Bioengineering", subtitle: "Life Reimagined", icon: "🧬", gradient: "green" },
  { title: "Virtual Reality", subtitle: "Digital Worlds", icon: "🥽", gradient: "orange" },
];

export default function HelixCarousel() {
  const [active, setActive] = useState(0);
  const canvasRef = useRef(null);

  /* 🔵 Particle background */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  /* 🔑 Correct Helix Math */
  const getStyle = (index) => {
    const total = slides.length;

    let offset = index - active;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const angle = offset * 60;
    const radius = 420;

    const x = Math.sin(angle * Math.PI / 180) * radius;
    const z = Math.cos(angle * Math.PI / 180) * radius - 200;

    const scale = Math.max(0.6, 1 - Math.abs(offset) * 0.15);
    const opacity = Math.max(0.25, 1 - Math.abs(offset) * 0.25);

    return {
      transform: `
        translate3d(${x}px, 0px, ${z}px)
        rotateY(${-angle}deg)
        scale(${scale})
      `,
      opacity,
      zIndex: 100 - Math.abs(offset),
      filter: `blur(${Math.abs(offset) * 1.1}px)`,
      pointerEvents: Math.abs(offset) > 2 ? "none" : "auto"
    };
  };

  return (
    <div className="helix-wrapper">
      <canvas ref={canvasRef} className="helix-canvas" />

      <div className="helix-stage">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`helix-card ${s.gradient} ${i === active ? "active" : ""}`}
            style={getStyle(i)}
            onClick={() => setActive(i)}
          >
            <div className="helix-content">
              <span className="helix-icon">{s.icon}</span>
              <h2>{s.title}</h2>
              <p>{s.subtitle}</p>
              <div className="helix-bar" />
            </div>
          </div>
        ))}
      </div>

      <button className="nav left" onClick={() => setActive((active - 1 + slides.length) % slides.length)}>‹</button>
      <button className="nav right" onClick={() => setActive((active + 1) % slides.length)}>›</button>
    </div>
  );
}
