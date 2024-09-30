"use client";

import { Canvas } from "@react-three/fiber";
import { MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function AnimatedSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial
        color="#FFD700"
        speed={1.5}
        distort={0.3}
        radius={1}
      />
    </mesh>
  );
}

export default function LoadingScreen({
  initialProgress = 0,
}: {
  initialProgress?: number;
}) {
  const [progress, setProgress] = useState(initialProgress);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100; // Ensure progress doesn't exceed 100
        }
        const diff = Math.random() * 10; // Random increment for effect
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    // Timer to ensure loading screen is displayed for a minimum time
    const timeout = setTimeout(() => {
      if (progress >= 100) {
        setLoadingComplete(true);
      }
    }, 3000); // Minimum display time of 3 seconds

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [progress]);

  // Update loadingComplete state after reaching 100% progress
  useEffect(() => {
    if (progress >= 100) {
      setLoadingComplete(true);
    }
  }, [progress]);

  if (loadingComplete) {
    return null; // Render nothing or navigate to the main app after loading
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-gray-700 flex flex-col items-center justify-center">
      <div className="w-64 h-64 mb-8">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <AnimatedSphere />
          <OrbitControls enableZoom={false} autoRotate />
        </Canvas>
      </div>
      <motion.h2
        className="text-4xl font-bold text-white mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        HushMail
      </motion.h2>
      <motion.p
        className="text-xl text-gray-300 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Loading your secure space...
      </motion.p>
      <div className="w-64 h-2 bg-gray-600 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-white mt-2">{Math.round(progress)}%</p>
    </div>
  );
}
