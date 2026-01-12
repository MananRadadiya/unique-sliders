import { useState, useRef, useEffect } from "react";
import "../Styles/FinalBossV2.css";

const data = [
  { icon: "🔥", label: "Inferno" },
  { icon: "🚀", label: "Velocity" },
  { icon: "💎", label: "Aether" },
  { icon: "⚡", label: "Voltage" },
  { icon: "👑", label: "Sovereign" },
  { icon: "🌌", label: "Nebula" },
  { icon: "🧠", label: "Neural" },
  { icon: "🔮", label: "Oracle" },
];

export default function FinalBossV2() {
  const [rotation, setRotation] = useState(0);
  const velocity = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const requestRef = useRef();

  const radius = 320; // Slightly wider for drama

  // 🎥 PHYSICS LOOP
  useEffect(() => {
    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);

      if (!isDragging.current) {
        // Apply momentum decay
        setRotation((r) => r + velocity.current);
        velocity.current *= 0.95; // Friction

        // Auto-rotation when idle (very slow drift)
        if (Math.abs(velocity.current) < 0.02) {
            velocity.current += 0.001;
        }
      }
    };
    animate();
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // 🖱️ MOUSE & TOUCH HANDLERS
  const handleStart = (clientX) => {
    isDragging.current = true;
    lastX.current = clientX;
    // Stop momentum instantly on grab
    velocity.current = 0;
  };

  const handleMove = (clientX) => {
    if (!isDragging.current) return;
    const delta = clientX - lastX.current;
    
    // Sensitivity factor
    velocity.current = delta * 0.1;
    setRotation((r) => r + delta * 0.5);
    lastX.current = clientX;
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  return (
    <div
      className="void-wrapper"
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      {/* Background Elements */}
      <div className="void-grid-floor"></div>
      <div className="void-glow-core"></div>

      <div className="void-ring">
        {data.map((item, i) => {
          const angle = (360 / data.length) * i + rotation;
          const rad = (angle * Math.PI) / 180;

          // 3D Calculations
          const x = Math.sin(rad) * radius;
          const z = Math.cos(rad) * 280; // Depth factor
          
          // Calculate opacity/scale based on Z-depth (closer = bigger)
          // Normalized depth from -1 to 1
          const normalizedDepth = Math.cos(rad); 
          const scale = 0.5 + (normalizedDepth + 1) * 0.35; // Range 0.5 to 1.2
          const opacity = Math.max(0.2, (normalizedDepth + 1) / 2);
          const blur = Math.max(0, (1 - normalizedDepth) * 8);
          const zIndex = Math.floor(normalizedDepth * 100);

          // Dynamic lighting: Only the front-facing cards get the "shine"
          const isFront = normalizedDepth > 0.8;

          return (
            <div
              key={i}
              className={`void-card ${isFront ? "active" : ""}`}
              style={{
                transform: `translate3d(${x}px, 0, ${z}px) scale(${scale})`,
                zIndex: zIndex,
                opacity: opacity,
                filter: `blur(${blur}px)`,
              }}
            >
              <div className="card-border"></div>
              <div className="card-content">
                <span className="card-icon">{item.icon}</span>
                <span className="card-label">{item.label}</span>
              </div>
              <div className="card-reflection"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}