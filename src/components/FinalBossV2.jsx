import { useState, useRef, useEffect } from "react";
import "../Styles/FinalBossV2.css";

const data = ["🔥", "🚀", "💎", "⚡", "👑", "🌌", "🧠"];

export default function FinalBossV2() {
  const [rotation, setRotation] = useState(0);
  const velocity = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  const radius = 280;

  // 🎥 AUTO CINEMATIC ROTATION
  useEffect(() => {
    const animate = () => {
      if (!isDragging.current) {
        setRotation((r) => r + velocity.current);
        velocity.current *= 0.95;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const onDown = (e) => {
    isDragging.current = true;
    lastX.current = e.clientX;
  };

  const onMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.clientX - lastX.current;
    velocity.current = delta * 0.08;
    setRotation((r) => r + delta * 0.4);
    lastX.current = e.clientX;
  };

  const onUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      className="boss-v2-wrapper"
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
    >
      <div className="boss-v2-ring">
        {data.map((item, i) => {
          const angle = (360 / data.length) * i + rotation;
          const rad = (angle * Math.PI) / 180;

          const depth = Math.cos(rad);
          const scale = 0.6 + depth * 0.6;
          const blur = Math.abs(Math.sin(rad)) * 6;

          return (
            <div
              key={i}
              className="boss-v2-card"
              style={{
                transform: `
                  translate(-50%, -50%)
                  translateX(${Math.sin(rad) * radius}px)
                  translateZ(${depth * 240}px)
                  scale(${scale})
                `,
                filter: `blur(${blur}px)`,
                zIndex: Math.floor(scale * 100),
                opacity: scale > 0.75 ? 1 : 0.5
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}
