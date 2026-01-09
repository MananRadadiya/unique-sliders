import { useState } from "react";
import "../Styles/OrbitSlider.css";

const data = ["🔥", "🚀", "💎", "⚡", "🌈", "👑"];

export default function OrbitSlider() {
  const [active, setActive] = useState(0);
  const radius = 180;

  return (
    <div className="orbit-wrapper">
      <div className="orbit">
        {data.map((item, i) => {
          const angle = ((i - active) * 360) / data.length;
          const rad = (angle * Math.PI) / 180;

          return (
            <div
              key={i}
              className={`orbit-card ${i === active ? "active" : ""}`}
              style={{
                transform: `
                  translate(-50%, -50%)
                  translate(${Math.cos(rad) * radius}px,
                            ${Math.sin(rad) * radius}px)
                  scale(${i === active ? 1.2 : 0.7})
                `,
                opacity: i === active ? 1 : 0.6,
                zIndex: i === active ? 10 : 1
              }}
              onClick={() => setActive(i)}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}
