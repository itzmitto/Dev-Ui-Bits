import { useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { num, str, type EffectProps } from './types';

const destinations = [
  ['◈', 'Discover', 'A new perspective awaits.', 'Follow a spark of curiosity. See where it takes you.'],
  ['⊞', 'Projects', 'From idea to something real.', 'A space for all the things you’re bringing to life.'],
  ['◇', 'Saved', 'Keep a little inspiration.', 'Your favorite details, ready when you need them.'],
  ['◎', 'Profile', 'A space that feels like you.', 'Small preferences. A very personal point of view.'],
];
export function MagneticNavigation(p: EffectProps) {
  const [active, setActive] = useState(0), [hover, setHover] = useState(-1), [offset, setOffset] = useState({ x: 0, y: 0 });
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId(), reduced = useReducedMotion();
  const vertical = p.orientation === 'vertical';
  return <div className={`adv-magnetic ${vertical ? 'adv-magnetic-vertical' : ''}`} style={{ '--demo-accent': str(p, 'color', '#a855f7') } as React.CSSProperties}>
    <div className="adv-magnetic-nav" role="tablist" aria-label="Magnetic demo navigation" aria-orientation={vertical ? 'vertical' : 'horizontal'} style={{ borderRadius: num(p, 'roundness', 22) }} onPointerLeave={() => { setHover(-1); setOffset({ x: 0, y: 0 }); }}>
      {destinations.map(([symbol, label], i) => <motion.button key={label} ref={el => { buttons.current[i] = el; }} role="tab" aria-selected={active === i} id={`${id}-${i}`} aria-controls={`${id}-content`} tabIndex={active === i ? 0 : -1}
        onPointerMove={event => { const r = event.currentTarget.getBoundingClientRect(); setHover(i); setOffset({ x: (event.clientX - r.left - r.width / 2) * num(p, 'strength', .3), y: (event.clientY - r.top - r.height / 2) * num(p, 'strength', .3) }); }}
        animate={hover === i && !reduced ? offset : { x: 0, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setActive(i)} onKeyDown={event => {
          const next = ['ArrowRight', 'ArrowDown'].includes(event.key) ? (i + 1) % 4 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? (i + 3) % 4 : event.key === 'Home' ? 0 : event.key === 'End' ? 3 : -1;
          if (next >= 0) { event.preventDefault(); setActive(next); buttons.current[next]?.focus(); }
        }}>
        {active === i && <motion.span className="adv-magnetic-selected" layoutId={`${id}-indicator`} transition={{ duration: reduced ? 0 : .25 }}/>}<span className="adv-nav-symbol" aria-hidden>{symbol}</span><span>{label}</span>
      </motion.button>)}
    </div>
    <div className="adv-magnetic-copy" role="tabpanel" id={`${id}-content`} aria-labelledby={`${id}-${active}`}><span className="adv-kicker">{destinations[active][1].toUpperCase()}</span><h2>{destinations[active][2]}</h2><p>{destinations[active][3]}</p></div>
  </div>;
}
