import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { num, str, type EffectProps } from './types';

const tabs = [
  { name: 'Overview', title: 'Everything, in perspective.', sub: 'A little clarity goes a long way.', value: '24,850', label: 'CREATIVE POSSIBILITIES', bars: [25, 48, 35, 65, 50, 85, 72, 100] },
  { name: 'Insights', title: 'See the bigger picture.', sub: 'Follow the signal. Find your next idea.', value: '+32.8%', label: 'GROWTH THIS MONTH', bars: [18, 25, 32, 45, 52, 62, 80, 95] },
  { name: 'Activity', title: 'Good things are happening.', sub: 'Every small step moves you forward.', value: '128', label: 'MOMENTS OF PROGRESS', bars: [80, 40, 65, 30, 95, 60, 85, 55] },
];
export function AnimatedTabs(p: EffectProps) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId(), reduced = useReducedMotion(), vertical = p.orientation === 'vertical';
  const item = tabs[active], duration = reduced ? 0 : num(p, 'duration', .3);
  return <div className={`adv-tabs ${vertical ? 'adv-tabs-vertical' : ''}`} style={{ '--demo-accent': str(p, 'color', '#a855f7'), borderRadius: num(p, 'roundness', 18) } as React.CSSProperties}>
    <div role="tablist" aria-label="Demo animated tabs" aria-orientation={vertical ? 'vertical' : 'horizontal'}>
      {tabs.map((tab, i) => <button key={tab.name} ref={el => { refs.current[i] = el; }} role="tab" id={`${id}-tab-${i}`} aria-controls={`${id}-panel`} aria-selected={active === i} tabIndex={active === i ? 0 : -1}
        onClick={() => setActive(i)} onKeyDown={event => {
          const nextKey = vertical ? 'ArrowDown' : 'ArrowRight', prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';
          const next = event.key === nextKey ? (i + 1) % tabs.length : event.key === prevKey ? (i + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
          if (next >= 0) { event.preventDefault(); setActive(next); refs.current[next]?.focus(); }
        }}>
        {active === i && <motion.span className="adv-tabs-pill" layoutId={`${id}-pill`} transition={{ duration }}/>}<span>{tab.name}</span>
      </button>)}
    </div>
    <div className="adv-tab-content" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} tabIndex={0}>
      <AnimatePresence mode="wait"><motion.div key={active} initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration }}>
        <h2>{item.title}</h2><p>{item.sub}</p><span className="adv-tab-stat">{item.value}<small>{item.label}</small></span>
        <div className="adv-tab-chart" aria-label={`Decorative chart for ${item.name}`}>{item.bars.map((height, i) => <motion.i key={i} initial={{ height: reduced ? `${height}%` : 0 }} animate={{ height: `${height}%` }} transition={{ duration, delay: reduced ? 0 : i * .025 }}/>)}</div>
      </motion.div></AnimatePresence>
    </div>
  </div>;
}
