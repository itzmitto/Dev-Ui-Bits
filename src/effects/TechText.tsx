import { useEffect, useId, useLayoutEffect, useRef } from 'react';
import { TechTextEngine } from './TechText.engine';
import { normalizeTechText, type TechTextProps } from './TechText.types';
import './TechText.css';

// Original DevUI Bits implementation. No external font files or drawing library.
export function TechText(props: TechTextProps) {
  const canvas = useRef<HTMLCanvasElement>(null), host = useRef<HTMLDivElement>(null);
  const engine = useRef<TechTextEngine | null>(null), instructions = useId();
  const latest = useRef(props);latest.current=props;
  useEffect(() => {
    if (!canvas.current || !host.current) return;
    const instance=new TechTextEngine(canvas.current,host.current,normalizeTechText(latest.current));
    engine.current=instance;
    return () => { instance.destroy();engine.current=null; };
  }, []);
  useLayoutEffect(() => { engine.current?.update(normalizeTechText(props)); });
  return <div ref={host} className="tech-text">
    <canvas ref={canvas} role="img" aria-label={props.text ?? 'DevUI Bits'} aria-describedby={instructions} tabIndex={0}/>
    <span id={instructions} className="tech-text-instructions">Move over a letter to reveal its outline. Drag to move; release to return. Use arrow keys to select a letter and Enter or Space to kick it.</span>
  </div>;
}
