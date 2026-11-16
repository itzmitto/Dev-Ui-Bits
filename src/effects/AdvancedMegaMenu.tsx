import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { num, str, type EffectProps } from './types';

const sections = {
  Products: [
    ['◈', 'Design system', 'A shared language for your next idea.'],
    ['⌘', 'Developer tools', 'Less friction. More room to build.'],
    ['◎', 'Analytics', 'Find the story inside your numbers.'],
    ['✳', 'Integrations', 'Connect the things you already love.'],
  ],
  Resources: [
    ['↗', 'Documentation', 'Start small. Go somewhere remarkable.'],
    ['▧', 'Changelog', 'See what’s new in your workspace.'],
    ['◇', 'Community', 'A place for ideas to come together.'],
    ['⊞', 'Templates', 'Make the first step a little easier.'],
  ],
  Company: [
    ['○', 'Our story', 'Good things begin with a little curiosity.'],
    ['✧', 'Careers', 'Bring a new perspective to the team.'],
    ['↗', 'Contact', 'The next great idea starts with hello.'],
    ['⊙', 'Journal', 'Notes from the process of making.'],
  ],
};
type Section = keyof typeof sections;

export function AdvancedMegaMenu(p: EffectProps) {
  const [open, setOpen] = useState<Section | null>(null);
  const [selection, setSelection] = useState(['Your next big idea.', 'Explore the navigation above. Everything connects.']);
  const root = useRef<HTMLDivElement>(null);
  const activeTrigger = useRef<HTMLButtonElement | null>(null);
  const id = useId();
  const reduced = useReducedMotion();
  const color = str(p, 'color', '#a855f7');

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(null); activeTrigger.current?.focus(); }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return <div className="adv-mega" ref={root} style={{ '--demo-accent': color } as React.CSSProperties}>
    <div className="adv-mega-nav" aria-label="Demo mega navigation">
      <span className="adv-demo-brand">◈ <span>Orbit</span></span>
      {(Object.keys(sections) as Section[]).map(section => <button
        key={section} aria-expanded={open === section} aria-controls={`${id}-menu`}
        onPointerEnter={event => { if (p.hoverOpen && event.pointerType !== 'touch') setOpen(section); }}
        onClick={event => { activeTrigger.current = event.currentTarget; setOpen(open === section ? null : section); }}
        onKeyDown={event => {
          if (event.key === 'ArrowDown') {
            event.preventDefault(); activeTrigger.current = event.currentTarget; setOpen(section);
          }
        }}
      >{section} <span aria-hidden>⌄</span></button>)}
    </div>
    <AnimatePresence mode="wait">
      {open && <motion.div id={`${id}-menu`} className="adv-mega-panel" key={open}
        initial={{ opacity: 0, y: reduced ? 0 : -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -4 }}
        transition={{ duration: reduced ? 0 : num(p, 'duration', .2) }}
        style={{ gridTemplateColumns: `repeat(${num(p, 'columns', 2)}, minmax(0,1fr))` }}>
        {sections[open].map(([symbol, title, description], index) => <button key={title}
          ref={element => { if (element && index === 0 && document.activeElement === activeTrigger.current) element.focus(); }}
          onClick={() => { setSelection([title, description]); setOpen(null); activeTrigger.current?.focus(); }}>
          {p.showIcons && <span className="adv-mega-symbol">{symbol}</span>}
          <span><strong>{title}</strong><small>{description}</small></span><span aria-hidden>↗</span>
        </button>)}
      </motion.div>}
    </AnimatePresence>
    <div className="adv-mega-content" aria-live="polite"><span className="adv-kicker">A CONNECTED WORKSPACE</span><h2>{selection[0]}</h2><p>{selection[1]}</p><span className="adv-orbit-mark" aria-hidden>◈</span></div>
  </div>;
}
