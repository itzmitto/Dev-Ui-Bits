import { useEffect, useRef } from 'react';
import { num, str, type EffectProps } from './types';

type Particle = { x: number; y: number; vx: number; vy: number; radius: number };

// Original bounded particle physics with a spatial hash for nearby connections.
export function InteractiveParticleBackground(p: EffectProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current, ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    let width = 1, height = 1, frame = 0, visible = true, last = performance.now();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: -10000, y: -10000 };
    const density = Math.round(Math.max(20, Math.min(200, num(p, 'density', 110))));
    const distance = num(p, 'connectionDistance', 100), primary = str(p, 'color', '#a855f7');
    const secondary = str(p, 'secondary', '#67e8f9'), background = str(p, 'background', '#120f17');
    const rgb = [1, 3, 5].map(i => parseInt(background.slice(i, i + 2), 16));
    let seed = 811;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const particles: Particle[] = Array.from({ length: density }, () => ({ x: random(), y: random(), vx: (random() - .5) * .04, vy: (random() - .5) * .04, radius: 1 + random() * 1.6 }));

    function draw(now: number) {
      if (!el || !ctx) return;
      const dt = Math.min((now - last) / 1000, .04); last = now;
      ctx.fillStyle = `rgba(${rgb.join(',')},${reduced.matches ? 1 : 1 - num(p, 'trail', .2)})`; ctx.fillRect(0, 0, width, height);
      const cells = new Map<string, number[]>();
      particles.forEach((particle, index) => {
        if (!reduced.matches) {
          const dx = particle.x * width - pointer.x, dy = particle.y * height - pointer.y, length = Math.hypot(dx, dy);
          if (p.interactive && length < 160 && length > 1) {
            const force = (1 - length / 160) * num(p, 'strength', .8) * (p.interactionMode === 'attract' ? -1 : 1);
            particle.vx += dx / length * force * dt * .08; particle.vy += dy / length * force * dt * .08;
          }
          particle.vx *= .998; particle.vy *= .998;
          particle.x = (particle.x + particle.vx * dt * num(p, 'speed', 1) + 1) % 1;
          particle.y = (particle.y + particle.vy * dt * num(p, 'speed', 1) + 1) % 1;
        }
        const key = `${Math.floor(particle.x * width / distance)},${Math.floor(particle.y * height / distance)}`;
        const bin = cells.get(key) || []; bin.push(index); cells.set(key, bin);
      });
      const opacity = num(p, 'opacity', .8);
      particles.forEach((particle, index) => {
        const x = particle.x * width, y = particle.y * height;
        const cx = Math.floor(x / distance), cy = Math.floor(y / distance);
        for (let ix = -1; ix <= 1; ix++) for (let iy = -1; iy <= 1; iy++) {
          for (const otherIndex of cells.get(`${cx + ix},${cy + iy}`) || []) {
            if (otherIndex <= index) continue;
            const other = particles[otherIndex], length = Math.hypot(x - other.x * width, y - other.y * height);
            if (length < distance) {
              ctx.strokeStyle = primary; ctx.globalAlpha = (1 - length / distance) * .35 * opacity;
              ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(other.x * width, other.y * height); ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = opacity; ctx.fillStyle = index % 4 === 0 ? secondary : primary;
        ctx.beginPath(); ctx.arc(x, y, particle.radius, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
    }
    function tick(now: number) { frame = 0; draw(now); schedule(); }
    function schedule() { if (!frame && visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick); }
    function refresh() { cancelAnimationFrame(frame); frame = 0; last = performance.now(); draw(last); schedule(); }
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width; height = entry.contentRect.height;
      const dpr = Math.min(devicePixelRatio || 1, 2); el.width = width * dpr; el.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = background; ctx.fillRect(0, 0, width, height); refresh();
    });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; refresh(); });
    const move = (event: PointerEvent) => { const r = el.getBoundingClientRect(); pointer.x = event.clientX - r.left; pointer.y = event.clientY - r.top; };
    const leave = () => { pointer.x = pointer.y = -10000; };
    const burst = () => {
      if (!p.interactive || reduced.matches) return;
      particles.forEach(particle => { const dx = particle.x * width - pointer.x, dy = particle.y * height - pointer.y, d = Math.hypot(dx, dy); if (d < 220 && d > 1) { particle.vx += dx / d * .15 * num(p, 'strength', .8); particle.vy += dy / d * .15 * num(p, 'strength', .8); } });
    };
    resize.observe(el); observer.observe(el); el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave); el.addEventListener('pointerdown', burst);
    document.addEventListener('visibilitychange', refresh); reduced.addEventListener('change', refresh);
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect();
      el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); el.removeEventListener('pointerdown', burst);
      document.removeEventListener('visibilitychange', refresh); reduced.removeEventListener('change', refresh);
    };
  }, [p]);
  return <div className="adv-particle-scene"><canvas ref={canvas} className="field-canvas" aria-label="Interactive particle network"/><div className="adv-particle-copy"><span className="adv-kicker">EVERYTHING IS CONNECTED</span><h2>{str(p, 'text', 'A universe of possibilities.')}</h2><p>Move to reshape the network. Click to send a pulse.</p></div></div>;
}
