import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// 1. FAR BACKGROUND LAYER
const FarBackground = () => {
  const mesh = useRef();
  
  useFrame((state) => {
    const scrollY = window.scrollY;
    const progress = Math.min(scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1);
    
    // Shift colors based on scroll
    // Blue -> Cyan -> Purple
    const color1 = new THREE.Color('#0B0F19');
    const color2 = new THREE.Color('#081121');
    const color3 = new THREE.Color('#130B1D');
    
    let targetColor;
    if (progress < 0.5) {
      targetColor = color1.clone().lerp(color2, progress * 2);
    } else {
      targetColor = color2.clone().lerp(color3, (progress - 0.5) * 2);
    }
    
    mesh.current.material.color.lerp(targetColor, 0.05);
  });

  return (
    <mesh ref={mesh} scale={[100, 100, 1]} position={[0, 0, -10]}>
      <planeGeometry />
      <meshBasicMaterial color="#0B0F19" />
    </mesh>
  );
};

// 2. MID LAYER - Particles
const MidLayerParticles = () => {
  const count = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 20;
    }
    return pos;
  }, [count]);

  const points = useRef();

  useFrame((state) => {
    const scrollY = window.scrollY;
    const t = state.clock.getElapsedTime();
    
    // Slight drift and scroll-based speed
    points.current.rotation.y = t * 0.02;
    points.current.rotation.x = t * 0.01;
    
    // Parallax
    points.current.position.y = scrollY * 0.005;
    
    // Mouse react
    points.current.position.x += (state.mouse.x * 2 - points.current.position.x) * 0.02;
  });

  return (
    <Points ref={points} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#22D3EE"
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

// 3. FRONT LIGHT LAYER - Glowing Blobs
const LightBlobs = () => {
  const blobs = useRef();
  
  useFrame((state) => {
    const scrollY = window.scrollY;
    const t = state.clock.getElapsedTime();
    
    // Move blobs faster and with waves
    blobs.current.children.forEach((blob, i) => {
      blob.position.y += Math.sin(t + i) * 0.002;
      blob.position.x += Math.cos(t + i) * 0.002;
      
      // Fast scroll parallax
      blob.position.y = (blob.userData.initialY + (scrollY * 0.015 * (i + 1) * 0.5)) % 50;
      if (blob.position.y > 25) blob.position.y -= 50;
    });
  });

  return (
    <group ref={blobs}>
      {[...Array(5)].map((_, i) => (
        <Sphere
          key={i}
          args={[2, 32, 32]}
          position={[
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40,
            -5
          ]}
          userData={{ initialY: (Math.random() - 0.5) * 40 }}
        >
          <meshBasicMaterial
            color={i % 2 === 0 ? "#22D3EE" : "#38BDF8"}
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
          />
        </Sphere>
      ))}
    </group>
  );
};

// HERO SPECIAL EFFECT - AI Core
const AICore = () => {
  const coreRef = useRef();
  const outerRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const scrollY = window.scrollY;
    const scrollProgress = Math.min(scrollY / 800, 1); // Fade out as we scroll away from hero
    
    if (coreRef.current) {
      coreRef.current.rotation.z = t * 0.5;
      coreRef.current.rotation.y = t * 0.3;
      
      // Scale and intensity change with scroll
      const s = 1 - scrollProgress * 0.5;
      coreRef.current.scale.set(s, s, s);
      coreRef.current.material.distort = 0.3 + scrollProgress * 0.5;
      
      // Fade out
      coreRef.current.material.opacity = (0.6 * (1 - scrollProgress));
    }
    
    if (outerRef.current) {
      outerRef.current.rotation.z = -t * 0.2;
      outerRef.current.scale.set(1.2, 1.2, 1.2);
      outerRef.current.material.opacity = (0.2 * (1 - scrollProgress));
    }
  });

  return (
    <group position={[0, 0, 5]}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh ref={coreRef}>
          <sphereGeometry args={[2, 64, 64]} />
          <MeshDistortMaterial
            color="#22D3EE"
            speed={2}
            distort={0.4}
            radius={1}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh ref={outerRef}>
          <torusGeometry args={[3, 0.02, 16, 100]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.2} />
        </mesh>
      </Float>
    </group>
  );
};

const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden bg-[#0B0F19]">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        dpr={[1, 2]} // Performance: limit pixel ratio
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <ambientLight intensity={1} />
        <FarBackground />
        <MidLayerParticles />
        <LightBlobs />
        <AICore />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
