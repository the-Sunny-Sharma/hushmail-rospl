"use client";

import { Button } from "@/components/ui/button";
import { MeshDistortMaterial, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react"; // Import useSession from next-auth
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import LoadingScreen from "./loading";

type MousePosition = [number, number];

// User Object interface for session
interface UserObj {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Functional Component Definitions
function Emoji(): JSX.Element {
  const groupRef = useRef<THREE.Group>(null);
  const [mousePosition, setMousePosition] = useState<MousePosition>([0, 0]);

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure the window is defined

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition([x, y]);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t / 2) / 4;
      groupRef.current.position.x = mousePosition[0] / 2;
      groupRef.current.position.y = mousePosition[1] / 2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      <mesh position={[-0.3, 0.3, 0.9]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.3, 0.3, 0.9]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0, -0.3, 0.9]}>
        <boxGeometry args={[0.5, 0.1, 0.1]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0, 0, 1]} rotation={[0, 0, Math.PI / 4]}>
        <capsuleGeometry args={[0.05, 0.3, 8, 16]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
    </group>
  );
}

function SmilingFace({
  name,
  position,
}: {
  name: string;
  position: [number, number, number];
}): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime()) / 4;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <MeshDistortMaterial
          color="#FFD700"
          speed={2}
          distort={0.3}
          radius={1}
        />
      </mesh>
      <mesh position={[-0.15, 0.15, 0.45]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.15, 0.15, 0.45]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0, 0, 0.45]} rotation={[0, 0, Math.PI]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 32, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <Text
        position={[0, -0.7, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
}

function FooterFaces(): JSX.Element {
  const { size } = useThree();
  const scale = Math.min(1, size.width / 1600);
  const spacing = Math.min(2, size.width / 800);

  return (
    <group scale={[scale, scale, scale]}>
      <SmilingFace name="Sunny Sharma" position={[-spacing * 1.5, 0, 0]} />
      <SmilingFace name="Ganesh Jha" position={[-spacing * 0.5, 0, 0]} />
      <SmilingFace name="Rishi Kharat" position={[spacing * 0.5, 0, 0]} />
      <SmilingFace name="Bhushan Patil" position={[spacing * 1.5, 0, 0]} />
    </group>
  );
}

export default function LandingPage(): JSX.Element {
  const { data: session, status } = useSession(); // Get session data and status
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [userInfo, setUserInfo] = useState<UserObj>();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 100);

    const timeout = setTimeout(() => {
      setProgress(100);
      setLoading(false);
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const { name, email } = session.user;
      if (name && email) {
        setUserInfo({ name, email });
      }
    }
  }, [session, status]);

  return (
    <>
      {loading ? (
        <LoadingScreen initialProgress={progress} />
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white">
          <header className="p-6">
            <nav className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">HushMail</h1>
              <div className="space-x-4">
                {userInfo ? (
                  <Link
                    href="/h"
                    className=" bg-white rounded-md text-black px-2 py-1 hover:bg-gray-600 hover:text-white "
                  >
                    <span>Welcome, {userInfo.name}</span>
                  </Link>
                ) : (
                  <>
                    {" "}
                    <Link href="/login" className="hover:text-gray-300">
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className=" bg-white rounded-md text-black px-2 py-1 hover:bg-gray-600 hover:text-white "
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </header>

          <main className="container mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="lg:w-1/2 mb-12 lg:mb-0">
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                  Welcome to HushMail
                </h2>
                <p className="text-xl mb-8">
                  Share your thoughts anonymously and engage in meaningful
                  discussions.
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    className="bg-white text-black hover:text-white"
                    asChild
                  >
                    <Link href={userInfo ? "/h" : "/signup"}>Get Started</Link>
                  </Button>
                </motion.div>
              </div>
              <div className="lg:w-1/2 h-[400px]">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <Emoji />
                  <OrbitControls enableZoom={false} />
                  <Text
                    position={[0, -1.5, 0]}
                    fontSize={0.5}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                  >
                    Shhh... Your secrets are safe with us!
                  </Text>
                </Canvas>
              </div>
            </div>

            <section className="mt-24">
              <h3 className="text-3xl font-bold mb-8 text-center">
                Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                  title="Anonymous Posting"
                  description="Share your thoughts without revealing your identity."
                />
                <FeatureCard
                  title="Secure Messaging"
                  description="End-to-end encryption ensures your messages stay private."
                />
                <FeatureCard
                  title="Customizable Privacy"
                  description="Choose to reveal your identity or stay anonymous for each post."
                />
                <FeatureCard
                  title="Engaging Discussions"
                  description="Participate in meaningful conversations on various topics."
                />
                <FeatureCard
                  title="AI-Assisted Responses"
                  description="Get help crafting thoughtful replies with our AI assistant."
                />
                <FeatureCard
                  title="User-Friendly Dashboard"
                  description="Easily manage your posts, responses, and account settings."
                />
              </div>
            </section>
          </main>

          <footer className="bg-gray-800 py-6 mt-24">
            <div className="container mx-auto px-6 text-center">
              <p className="text-lg">&copy; 2024 HushMail. ROSPL Project.</p>
              <div className="mt-2 h-[300px]">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <FooterFaces />
                  <OrbitControls enableZoom={false} />
                </Canvas>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-lg"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
}
