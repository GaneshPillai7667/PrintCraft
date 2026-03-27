import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';
import { useRef } from 'react';

function RotatingModel() {
  const knot = useRef<Mesh>(null!);
  const ring = useRef<Mesh>(null!);

  useFrame(() => {
    knot.current.rotation.y += 0.013;
    knot.current.rotation.x += 0.003;
    ring.current.rotation.z -= 0.004;
  });

  return (
    <group>
      <mesh ref={knot}>
        <torusKnotGeometry args={[1.02, 0.32, 180, 24]} />
        <meshStandardMaterial color="#00D4FF" metalness={0.82} roughness={0.24} emissive="#003355" emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[1.7, 0.04, 24, 200]} />
        <meshStandardMaterial color="#7F5AF0" metalness={0.95} roughness={0.2} emissive="#21163f" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function ThreePreview() {
  return (
    <div className="h-80 w-full overflow-hidden rounded-2xl border border-cyan-300/20 bg-black/35 md:h-[360px]">
      <Canvas camera={{ position: [0, 0, 4.2] }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 2]} intensity={1.8} color="#00F5FF" />
        <pointLight position={[-3, -2, -1]} intensity={1.6} color="#7F5AF0" />
        <RotatingModel />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
