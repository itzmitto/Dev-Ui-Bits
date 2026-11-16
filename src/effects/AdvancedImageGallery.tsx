import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { num, str, type EffectProps } from './types';
import { galleryArt } from './galleryArt';

export function AdvancedImageGallery(p: EffectProps) {
  const [filter, setFilter] = useState('All'), [selected, setSelected] = useState<number | null>(null), [zoom, setZoom] = useState(false);
  const opener = useRef<HTMLElement | null>(null), dialog = useRef<HTMLDivElement>(null), close = useRef<HTMLButtonElement>(null);
  const id = useId(), reduced = useReducedMotion();
  const visible = galleryArt.filter(item => filter === 'All' || item.tag === filter);
  const next = (direction: number) => { setSelected(index => index === null ? null : (index + direction + galleryArt.length) % galleryArt.length); setZoom(false); };
  useEffect(() => {
    if (selected === null) return;
    const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; close.current?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowRight') { event.preventDefault(); next(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); next(-1); }
      if (event.key === 'Tab') {
        const buttons = [...(dialog.current?.querySelectorAll<HTMLButtonElement>('button') || [])], first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', keyboard);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', keyboard); opener.current?.focus(); };
    // The listener uses functional updates, and only lives for the dialog session.
  }, [selected !== null]);

  return <div className="adv-gallery" style={{ '--demo-accent': str(p, 'color', '#a855f7') } as React.CSSProperties}>
    <div className="adv-gallery-heading"><div><span className="adv-kicker">A COLLECTION OF PERSPECTIVES</span><h2>{str(p, 'text', 'Look a little closer.')}</h2></div><span>06 / ORIGINALS</span></div>
    <div className="adv-gallery-filters" aria-label="Gallery filters">{['All', 'Nature', 'Architecture'].map(tag => <button aria-pressed={filter === tag} key={tag} onClick={() => setFilter(tag)}>{tag}</button>)}</div>
    <div className={`adv-gallery-grid ${p.layout === 'masonry' ? 'adv-gallery-masonry' : ''}`} style={{ gap: num(p, 'gap', 12), gridTemplateColumns: `repeat(${num(p, 'columns', 3)}, minmax(0,1fr))`, '--gallery-columns': num(p, 'columns', 3), '--gallery-gap': `${num(p, 'gap', 12)}px` } as React.CSSProperties}>
      <AnimatePresence mode="popLayout">{visible.map(item => <motion.button key={item.title} layout={!reduced} initial={{ opacity: 0, scale: reduced ? 1 : .95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: reduced ? 1 : .95 }} transition={{ duration: reduced ? 0 : .25 }} aria-label={`Open ${item.title}`} onClick={event => { opener.current = event.currentTarget; setSelected(galleryArt.indexOf(item)); setZoom(false); }}>
        <img src={item.image} alt={item.title} loading="lazy" draggable={false} style={{ borderRadius: num(p, 'roundness', 10) }}/><span>{item.title} <span>↗</span></span>
      </motion.button>)}</AnimatePresence>
    </div>
    {selected !== null && createPortal(<div className="adv-lightbox-backdrop" onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}><div role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} className="adv-lightbox" ref={dialog}>
      <div className="adv-lightbox-top"><span id={`${id}-title`}>{galleryArt[selected].title}</span><span>{String(selected + 1).padStart(2, '0')} / 06</span><button aria-label="Close gallery" ref={close} onClick={() => setSelected(null)}>✕</button></div>
      <div className="adv-lightbox-image"><AnimatePresence mode="wait"><motion.img key={selected} src={galleryArt[selected].image} alt={galleryArt[selected].title} initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1, scale: zoom ? 1.5 : 1 }} exit={{ opacity: reduced ? 1 : 0 }} transition={{ duration: reduced ? 0 : .2 }}/></AnimatePresence></div>
      <div className="adv-lightbox-bottom"><button aria-label="Previous image" onClick={() => next(-1)}>← Previous</button><button aria-label="Zoom image" aria-pressed={zoom} onClick={() => setZoom(!zoom)}>{zoom ? 'Zoom out −' : 'Zoom in +'}</button><button aria-label="Next image" onClick={() => next(1)}>Next →</button></div>
    </div></div>, document.body)}
  </div>;
}
