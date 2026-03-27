import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float } from '@react-three/drei';
import { useRef } from 'react';
import type { Mesh } from 'three';

function Node({ color, position }: { color: string; position: [number, number, number] }) {
  const ref = useRef<Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.getElapsedTime() * 0.4;
    ref.current.rotation.y = clock.getElapsedTime() * 0.32;
  });

  return (
    <mesh ref={ref} position={position}>
      <dodecahedronGeometry args={[0.43, 0]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
    </mesh>
  );
}

export default function Admin3DWidget() {
  return (
    <div className="h-56 w-full overflow-hidden rounded-xl border border-slate-700/70 bg-gradient-to-b from-slate-900 to-slate-950">
      <Canvas camera={{ position: [0, 0.4, 4.1], fov: 42 }}>
        <Environment preset="city" />
        <ambientLight intensity={0.32} />
        <directionalLight position={[3.2, 3.4, 2.4]} intensity={1.6} color="#93c5fd" />
        <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.26}>
          <Node color="#6366f1" position={[-1.12, 0.18, 0]} />
          <Node color="#06b6d4" position={[0.15, -0.08, 0.18]} />
          <Node color="#8b5cf6" position={[1.2, 0.26, -0.05]} />
        </Float>
        <ContactShadows position={[0, -1.03, 0]} opacity={0.33} blur={1.8} scale={5.6} />
      </Canvas>
    </div>
  );
}
