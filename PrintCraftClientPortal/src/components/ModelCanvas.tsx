import { motion } from 'framer-motion';
import type { ProductKind } from '../data/products';

type Props = {
  type: ProductKind;
  color?: string;
  spinSpeed?: number;
};

const svgByKind: Record<ProductKind, string> = {
  tshirt: '/assets/tshirt.svg',
  shirt: '/assets/tshirt.svg',
  tanktop: '/assets/tanktop.svg',
  shorts: '/assets/shorts.svg',
  other: '/assets/sweatshirt.svg',
  hoodie: '/assets/hoodie.svg',
  joggers: '/assets/joggers.svg',
  sweatshirt: '/assets/sweatshirt.svg'
};

export default function ModelCanvas({ type, color = '#2563eb', spinSpeed = 0.008 }: Props) {
  const duration = Math.max(4, 10 - spinSpeed * 200);

  return (
    <div className="model-canvas-wrap">
      <div className="model-glow model-glow-a" />
      <div className="model-glow model-glow-b" />

      <motion.div
        className="model-stage"
        animate={{ rotateY: [0, 8, -8, 0], rotateX: [0, 3, -3, 0] }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.img
          src={svgByKind[type]}
          alt={`${type} preview`}
          className="model-image"
          style={{ filter: `drop-shadow(0 20px 30px ${color}44)` }}
          animate={{ y: [0, -8, 0], rotate: [0, 1.5, -1.5, 0] }}
          transition={{ duration: duration * 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <div className="model-floor" />
    </div>
  );
}

