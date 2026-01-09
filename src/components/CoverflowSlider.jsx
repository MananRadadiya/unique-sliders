import { useState } from "react";
import "../Styles/CoverflowSlider.css";

const data = ["🔥", "🚀", "💎", "⚡"];

export default function CoverflowSlider() {
  const [active, setActive] = useState(0);

  return (
    <div className="coverflow">
      {data.map((item, i) => (
        <div
          key={i}
          className="card"
          style={{
            transform: `
              translateX(${(i - active) * 220}px)
              scale(${i === active ? 1 : 0.8})
              rotateY(${(i - active) * 30}deg)
            `,
            zIndex: data.length - Math.abs(i - active)
          }}
          onClick={() => setActive(i)}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
