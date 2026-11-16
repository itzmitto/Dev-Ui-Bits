import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { num, str, type EffectProps } from './types';

export function InteractiveCard3D(p: EffectProps) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion();
  const color = str(p, 'color', '#a855f7');
  const tilt = reduced ? 0 : num(p, 'tilt', 22);
  return <div className="adv-3d-scene" style={{ perspective: num(p, 'perspective', 900) }}>
    <motion.button aria-label="Flip interactive card" aria-pressed={flipped} className="adv-3d-card"
      onPointerMove={event => { const r = event.currentTarget.getBoundingClientRect(); setPointer({ x: (event.clientX - r.left) / r.width - .5, y: (event.clientY - r.top) / r.height - .5 }); }}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })} onBlur={() => setPointer({ x: 0, y: 0 })}
      onClick={() => setFlipped(!flipped)}
      animate={{ rotateX: -pointer.y * tilt, rotateY: (flipped ? 180 : 0) + pointer.x * tilt }}
      transition={{ type: 'spring', stiffness: reduced ? 1000 : 130, damping: 20 }}
      style={{ '--demo-accent': color } as React.CSSProperties}>
      <span className="adv-3d-face adv-3d-front" aria-hidden={flipped}>
        <span className="adv-kicker">THE EXPLORER’S EDITION</span><span className="adv-3d-object" aria-hidden><i/><i/><i/></span>
        <span className="adv-3d-heading">{str(p, 'text', 'Beyond the surface.')}</span>
        <span className="adv-3d-footer"><span>DEVUI / 029</span><span>FLIP TO DISCOVER ↗</span></span>
      </span>
      <span className="adv-3d-face adv-3d-back" aria-hidden={!flipped}><span className="adv-kicker">ANOTHER PERSPECTIVE</span><span className="adv-3d-back-symbol">✳</span><strong>Depth is in the details.</strong><span>CSS perspective. Real interaction.<br/>No WebGL required.</span><small>CLICK TO RETURN ↗</small></span>
      {p.glare && <span className="adv-3d-glare" aria-hidden style={{ background: `radial-gradient(circle at ${(pointer.x + .5) * 100}% ${(pointer.y + .5) * 100}%, #ffffff32, transparent 65%)` }}/>}
    </motion.button>
    <p className="adv-helper">Move to explore · click or press Enter to flip</p>
  </div>;
}
