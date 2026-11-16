import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { num, str, type EffectProps } from './types';

export function MorphingButton(p: EffectProps) {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'success'>('idle');
  const reduced = useReducedMotion();
  useEffect(() => {
    if (phase === 'idle' || phase === 'success' && !p.autoReset) return;
    const timer = setTimeout(() => setPhase(phase === 'loading' ? 'success' : 'idle'), phase === 'loading' ? num(p, 'duration', 1.5) * 1000 : 2200);
    return () => clearTimeout(timer);
  }, [phase, p.duration, p.autoReset]);
  return <div className="adv-morph-demo">
    <span className="adv-kicker">ONE BUTTON. THREE MOMENTS.</span>
    <motion.button className="adv-morph-button" disabled={phase === 'loading'} aria-label={phase === 'idle' ? str(p, 'text', 'Launch something') : phase === 'loading' ? 'Launching' : 'Launch again'}
      onClick={() => setPhase(phase === 'success' ? 'idle' : 'loading')}
      animate={{ width: phase === 'idle' ? 230 : phase === 'loading' ? 64 : 166, borderRadius: phase === 'loading' ? 32 : num(p, 'roundness', 18), backgroundColor: phase === 'success' ? '#168963' : str(p, 'color', '#a855f7') }}
      transition={{ type: 'spring', stiffness: reduced ? 1000 : 220, damping: 23 }}>
      <AnimatePresence mode="wait" initial={false}><motion.span key={phase} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -8 }} transition={{ duration: reduced ? 0 : .12 }}>
        {phase === 'idle' ? <>{str(p, 'text', 'Launch something')} <span aria-hidden>↗</span></> : phase === 'loading' ? <span className="adv-spinner" aria-hidden/> : <>✓ &nbsp; You’re all set</>}
      </motion.span></AnimatePresence>
    </motion.button>
    <p className="adv-helper" role="status">{phase === 'idle' ? 'Go on. Give it a click.' : phase === 'loading' ? 'Preparing your next great thing…' : 'A little idea, successfully launched.'}</p>
  </div>;
}
