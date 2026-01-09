import { useEffect, useState } from "react";
import "../Styles/QuantumWarpSlider.css";

const slides = [
//   { emoji: "🔥", title: "Neural Core", subtitle: "AI Motion System", color: "#6C5CE7" },
  { emoji: "🚀", title: "Quantum Warp", subtitle: "Spatial Navigation", color: "#00D2D3" },
  { emoji: "💎", title: "Time Axis", subtitle: "Smooth Transitions", color: "#F9CA24" },
  { emoji: "⚡", title: "Void State", subtitle: "Minimal Power", color: "#FFFFFF" },
  { emoji: "🌈", title: "Spectrum", subtitle: "Creative Energy", color: "#FF6EC7" },
//   { emoji: "👑", title: "Crown Mode", subtitle: "Ultimate Control", color: "#FFD700" },
];

export default function QuantumWarpSlider() {
  const [active, setActive] = useState(2);

  useEffect(() => {
    const onWheel = (e) => {
      if (e.deltaY > 0 && active < slides.length - 1)
        setActive((p) => p + 1);
      if (e.deltaY < 0 && active > 0)
        setActive((p) => p - 1);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [active]);

  return (
    <section className="quantum-section">
      <h1 className="quantum-heading">QUANTUM INTERFACE</h1>

      <div className="quantum-rail">
        {slides.map((slide, i) => {
          const offset = i - active;

          return (
            <div
              key={i}
              className={`quantum-card ${i === active ? "active" : ""}`}
              style={{
                "--offset": offset,
                "--clr": slide.color,
              }}
              onClick={() => setActive(i)}
            >
              <div className="quantum-emoji">{slide.emoji}</div>
              <h2>{slide.title}</h2>
              <p>{slide.subtitle}</p>
            </div>
          );
        })}
      </div>

      <div className="quantum-dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={i === active ? "dot active" : "dot"}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </section>
  );
}
