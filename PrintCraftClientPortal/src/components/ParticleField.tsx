import { motion } from 'framer-motion';

const particles = Array.from({ length: 64 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() > 0.65 ? 3 : 2,
  duration: 4.5 + Math.random() * 9
}));

export default function ParticleField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-55">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-cyan-200"
          style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
          animate={{ y: [0, -32, 0], opacity: [0.1, 0.95, 0.1], scale: [1, 1.15, 1] }}
          transition={{ duration: particle.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
