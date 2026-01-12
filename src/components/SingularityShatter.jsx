import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../Styles/SingularityShatter.css'; // Import the CSS file

// --- CONFIGURATION ---
// These polygons define the "cracks" in the glass
const SHARD_CLIP_PATHS = [
  'polygon(0% 0%, 30% 0%, 35% 30%, 0% 30%)',
  'polygon(30% 0%, 70% 0%, 65% 35%, 35% 30%)',
  'polygon(70% 0%, 100% 0%, 100% 40%, 65% 35%)',
  'polygon(0% 30%, 35% 30%, 40% 60%, 0% 70%)',
  'polygon(35% 30%, 65% 35%, 60% 65%, 40% 60%)', // The Core
  'polygon(65% 35%, 100% 40%, 100% 70%, 60% 65%)',
  'polygon(0% 70%, 40% 60%, 30% 100%, 0% 100%)',
  'polygon(40% 60%, 60% 65%, 70% 100%, 30% 100%)',
  'polygon(60% 65%, 100% 70%, 100% 100%, 70% 100%)'
];

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070",
 "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2064",
];

const SingularityShatter = ({ images = DEFAULT_IMAGES }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Allow animation to play out before switching index
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsAnimating(false);
    }, 1200);
  };

  const currentImage = images[currentIndex];
  const nextIndex = (currentIndex + 1) % images.length;
  const nextImage = images[nextIndex];

  return (
    <div className="singularity-container">
      
      {/* Ambient Background */}
      <div className="singularity-ambient">
        <div 
          className="ambient-image"
          style={{ backgroundImage: `url(${currentImage})` }}
        />
      </div>

      <h1 className="singularity-header">Singularity // Breach</h1>

      {/* Main 3D Stage */}
      <div className="singularity-stage">
        
        {/* 1. The Image Underneath (Revealed) */}
        <div className="next-image-container">
           <motion.img 
             key={`next-${nextIndex}`}
             src={nextImage}
             alt="Next Slide"
             className="next-image"
             initial={{ opacity: 0, scale: 1.1, filter: "brightness(0.5)" }}
             animate={isAnimating ? { 
               opacity: 1, 
               scale: 1, 
               filter: "brightness(1)" 
             } : { 
               opacity: 0, 
               scale: 1.1 
             }}
             transition={{ duration: 0.8, delay: 0.3, ease: "circOut" }}
           />
        </div>

        {/* 2. The Shattering Layer (Current Image) */}
        <AnimatePresence>
          {!isAnimating ? (
            <motion.div key="static-view" className="absolute inset-0 w-full h-full">
               {SHARD_CLIP_PATHS.map((clip, i) => (
                 <Shard 
                   key={i} 
                   clip={clip} 
                   img={currentImage} 
                   index={i} 
                   isExploding={false} 
                 />
               ))}
            </motion.div>
          ) : (
             <motion.div key="exploding-view" className="absolute inset-0 w-full h-full">
               {SHARD_CLIP_PATHS.map((clip, i) => (
                 <Shard 
                   key={i} 
                   clip={clip} 
                   img={currentImage} 
                   index={i} 
                   isExploding={true} 
                 />
               ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Controller */}
      <button 
        onClick={handleNext}
        disabled={isAnimating}
        className="breach-button"
      >
        Initiate Breach
      </button>

    </div>
  );
};

// Sub-component for individual glass shards
const Shard = ({ clip, img, isExploding }) => {
  // Random physics calculations
  // We use standard JS Math to generate unique trajectories for every click
  const randomX = (Math.random() - 0.5) * 800; 
  const randomY = (Math.random() - 0.5) * 800; 
  const randomZ = 200 + Math.random() * 500; // Always fly towards camera
  const randomRotate = (Math.random() - 0.5) * 200;

  const variants = {
    idle: {
      x: 0, y: 0, z: 0, 
      rotateX: 0, rotateY: 0, rotateZ: 0, 
      opacity: 1, scale: 1,
      transition: { duration: 0.5, ease: "easeInOut" }
    },
    explode: {
      x: randomX,
      y: randomY,
      z: randomZ,
      rotateX: randomRotate,
      rotateY: randomRotate,
      rotateZ: randomRotate,
      opacity: 0,
      scale: 0.8,
      transition: { 
        duration: 1.0, 
        ease: [0.11, 0, 0.5, 0] // Bezier for explosive force
      }
    }
  };

  return (
    <motion.div
      className="shard-container"
      style={{ 
        clipPath: clip,
        backfaceVisibility: 'hidden', // Hides the back of the "card"
        WebkitBackfaceVisibility: 'hidden',
      }}
      initial="idle"
      animate={isExploding ? "explode" : "idle"}
      variants={variants}
    >
      <div className="shard-content">
        <img src={img} alt="" className="shard-img" />
        <div className="shard-glint" />
        <div className="shard-border" />
      </div>
    </motion.div>
  );
};

export default SingularityShatter;