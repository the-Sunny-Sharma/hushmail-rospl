"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import { Text, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as THREE from "three";

function ErrorText(props: ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    mesh.current.rotation.x += delta * 0.2;
    mesh.current.rotation.y += delta * 0.1;
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <Text
        color={hovered ? "hotpink" : "white"}
        fontSize={1.5}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        font="/fonts/Inter-Bold.ttf"
      >
        404
        {"\n"}
        Page Not Found
      </Text>
    </mesh>
  );
}

function AnimatedCube(props: ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    mesh.current.rotation.x += delta;
    mesh.current.rotation.y += delta * 0.5;
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={hovered ? 1.2 : 1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full h-[60vh]">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <ErrorText position={[0, 1, 0]} />
          <AnimatedCube position={[-2, -1, 0]} />
          <AnimatedCube position={[2, -1, 0]} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
      <div className="text-center mt-8">
        <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
        <p className="text-xl mb-8">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Button onClick={() => reset()} variant="outline">
              Try again
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Button asChild>
              <Link href="/">Go back home</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
