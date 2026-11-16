import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { num, str, type EffectProps } from './types';

const chapters = [
  ['01', 'Find the spark.', 'Every remarkable thing begins as a small idea. Leave a little room for curiosity.'],
  ['02', 'Give it shape.', 'Turn a possibility into something you can see, feel, and explore. Make a few unexpected connections.'],
  ['03', 'Let it take flight.', 'Good ideas are made to move. Share your perspective, and see what happens next.'],
];
export function ScrollStorytellingSection(p: EffectProps) {
  const container = useRef<HTMLDivElement>(null), [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ container });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : num(p, 'rotation', 180)]);
  const scale = useTransform(scrollYProgress, [0, .5, 1], reduced ? [1, 1, 1] : [.7, 1.1, .9]);
  useEffect(() => {
    const root = container.current; if (!root) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.chapter));
    }, { root, rootMargin: '-20% 0px -35% 0px', threshold: 0 });
    root.querySelectorAll('[data-chapter]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return <div className="adv-story" style={{ '--demo-accent': str(p, 'color', '#a855f7') } as React.CSSProperties}>
    {p.showProgress && <motion.div className="adv-story-progress" style={{ scaleX: scrollYProgress }} aria-hidden/>}
    <div className="adv-story-scroll" ref={container} tabIndex={0} aria-label="Scroll through the story">
      <div className="adv-story-body"><div className="adv-story-art"><span className="adv-kicker">{str(p, 'text', 'FROM A LITTLE IDEA')}</span><motion.div className="adv-story-sculpture" style={{ rotate, scale }}><i/><i/><i/><i/></motion.div><span className="adv-story-counter">{chapters[active][0]} <span>/ 03</span></span><small>SCROLL TO EXPLORE ↓</small></div>
        <div className="adv-story-chapters">{chapters.map(([number, title, description], index) => <section data-chapter={index} key={number} style={{ minHeight: num(p, 'sectionHeight', 380) }}><motion.div initial={false} animate={{ opacity: active === index || reduced ? 1 : .3, x: active === index || reduced ? 0 : 10 }} transition={{ duration: reduced ? 0 : .4 }}><span className="adv-kicker">CHAPTER {number}</span><h2>{title}</h2><p>{description}</p></motion.div></section>)}</div>
      </div>
    </div>
  </div>;
}
