import { useEffect, useState, useRef } from "react";
import "../Styles/LiquidMorphSlider.css";

const emojis = ["🔥", "🚀", "💎", "⚡", "👑", "🌌", "🧠"];

export default function LiquidMorphSlider() {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState(0);

  const stageRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });

  // API
  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=5")
      .then(res => res.json())
      .then(data => setProducts(data.products));
  }, []);

  // Inertial mouse
  useEffect(() => {
    const animate = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.08;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.08;

      if (stageRef.current) {
        stageRef.current.style.setProperty("--mx", `${smooth.current.x}px`);
        stageRef.current.style.setProperty("--my", `${smooth.current.y}px`);
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div className="liquid-wrapper">
      <div
        ref={stageRef}
        className="liquid-stage"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mouse.current = {
            x: e.clientX - r.left - r.width / 2,
            y: e.clientY - r.top - r.height / 2,
          };
        }}
      >
        {products.map((p, i) => {
          const isActive = i === active;

          return (
            <div
              key={p.id}
              className={`liquid-card ${isActive ? "active" : ""}`}
              style={{
                transform: `
                  translate(-50%, -50%)
                  translate(calc(var(--mx) * 0.06), calc(var(--my) * 0.06))
                  scale(${isActive ? 1 : 0.6})
                `,
                opacity: isActive ? 1 : 0,
              }}
            >
              {/* LIQUID BACKGROUND */}
              <div className="liquid-blob" />

              {/* EMOJI CONTENT */}
              <div className="liquid-content">
                <div className="liquid-emoji">
                  {emojis[i % emojis.length]}
                </div>
                <h3>{p.title}</h3>
                <p>${p.price}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* PROGRESS */}
      <div className="liquid-progress">
        <div
          className="liquid-progress-bar"
          style={{
            transform: `scaleX(${products.length ? (active + 1) / products.length : 0})`,
          }}
        />
      </div>

      {/* NAV */}
      <div className="liquid-nav">
        <button
          onClick={() =>
            setActive(p => (p === 0 ? products.length - 1 : p - 1))
          }
        >
          ‹
        </button>
        <button
          onClick={() =>
            setActive(p => (p + 1) % products.length)
          }
        >
          ›
        </button>
      </div>
    </div>
  );
}
