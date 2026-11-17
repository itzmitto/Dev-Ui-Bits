import type { Point } from './TechText.types';

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
export function falloff(distance: number, reach: number, softness: number) {
  const inner = reach * (1 - softness);
  if (distance <= inner) return 1;
  if (distance >= reach) return 0;
  const t = (distance - inner) / Math.max(.001, reach - inner);
  return 1 - t * t * (3 - 2 * t);
}
export function spring(position: number, velocity: number, dt: number, bounce: number): [number, number] {
  // Semi-implicit integration, substepped so a delayed frame cannot explode.
  const stiffness = 185, damping = 2 * Math.sqrt(stiffness) * (1 - bounce * .72);
  const steps = Math.max(1, Math.ceil(dt / .008));
  for (let i = 0; i < steps; i++) {
    velocity += (-stiffness * position - damping * velocity) * dt / steps;
    position += velocity * dt / steps;
  }
  return Math.abs(position) < .015 && Math.abs(velocity) < .08 ? [0,0] : [position,velocity];
}

// Original marching-squares contour extraction from an alpha mask. Both outside
// silhouettes and counters (e.g. B/e) become closed, dashable vector paths.
export function traceAlpha(alpha: Uint8ClampedArray, width: number, height: number, scale: number): Point[][] {
  const table: number[][][] = [[],[[3,0]],[[0,1]],[[3,1]],[[1,2]],[[3,0],[1,2]],[[0,2]],[[3,2]],[[2,3]],[[0,2]],[[0,1],[2,3]],[[1,2]],[[1,3]],[[0,1]],[[3,0]],[]];
  const segments: [Point,Point][] = [];
  const at = (x: number,y: number) => alpha[(y * width + x) * 4 + 3] / 255;
  for (let y=0; y<height-1; y++) for (let x=0; x<width-1; x++) {
    const values = [at(x,y),at(x+1,y),at(x+1,y+1),at(x,y+1)];
    const state = values.reduce((mask,value,index)=>mask | (value>=.5 ? 1<<index : 0),0);
    if (!state || state===15) continue;
    const corners = [[x,y],[x+1,y],[x+1,y+1],[x,y+1]];
    const edge = (index:number):Point => {
      const next = (index+1)%4, t = (.5-values[index])/(values[next]-values[index]);
      return { x:(corners[index][0]+(corners[next][0]-corners[index][0])*t+.5)/scale, y:(corners[index][1]+(corners[next][1]-corners[index][1])*t+.5)/scale };
    };
    for (const [a,b] of table[state]) segments.push([edge(a),edge(b)]);
  }
  const key = (p:Point) => `${Math.round(p.x*10000)},${Math.round(p.y*10000)}`;
  const links = new Map<string,number[]>();
  segments.forEach((segment,index)=>segment.forEach(point=>{const k=key(point);const list=links.get(k)??[];list.push(index);links.set(k,list);}));
  const visited = new Set<number>(), contours:Point[][]=[];
  for (let index=0; index<segments.length; index++) {
    if (visited.has(index)) continue;
    const path=[segments[index][0]], first=key(path[0]);let current=index, point=segments[index][1];
    while (!visited.has(current)) {
      visited.add(current);path.push(point);
      if (key(point)===first) break;
      const next=links.get(key(point))?.find(value=>!visited.has(value));
      if (next===undefined) break;
      const segment=segments[next];point=key(segment[0])===key(point)?segment[1]:segment[0];current=next;
    }
    if (path.length>3) contours.push(path);
  }
  return contours;
}
export function pointOnContours(contours: Point[][], fraction: number): Point {
  const path=contours[0];
  return path?.[Math.floor(clamp01(fraction)*Math.max(0,path.length-1))] ?? {x:0,y:0};
}
