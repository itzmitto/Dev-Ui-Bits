export interface TechTextProps {
  text?: string;
  fontWeight?: number;
  fontSize?: number;
  fontFamily?: string;
  letterSpacing?: number;
  color?: string;
  accentColor?: string;
  align?: 'left' | 'center' | 'right';
  reveal?: 'letter' | 'area' | 'off';
  reach?: number;
  softness?: number;
  lineStyle?: 'dashed' | 'solid';
  dashLength?: number;
  dashGap?: number;
  strokeWidth?: number;
  speed?: number;
  bounce?: number;
  specks?: number;
  intro?: 'none' | 'type' | 'assemble' | 'metrics';
  introDuration?: number;
  clickKick?: boolean;
  guides?: boolean;
  selection?: boolean;
  labels?: boolean;
  draggable?: boolean;
  sweep?: boolean;
}
export type TechTextOptions = Required<TechTextProps>;
export type Point = { x: number; y: number };
export const techTextDefaults: TechTextOptions = {
  text: 'DevUI Bits', fontWeight: 600, fontSize: 150, reveal: 'letter',
  dashLength: 4, dashGap: 2, specks: 15, intro: 'none', introDuration: 2,
  clickKick: true, guides: false, fontFamily: '', letterSpacing: -.05,
  accentColor: 'currentColor', reach: 200, softness: .7, lineStyle: 'dashed',
  strokeWidth: 1.5, speed: 1, bounce: .4, selection: true, labels: true,
  color: 'currentColor', align: 'center', draggable: true, sweep: true,
};
export function normalizeTechText(props: TechTextProps): TechTextOptions {
  const options = { ...techTextDefaults, ...props };
  const bounds: Partial<Record<keyof TechTextOptions, [number, number]>> = {
    fontSize: [8, 400], fontWeight: [100, 900], letterSpacing: [-.1, .3],
    dashLength: [.5, 24], dashGap: [.5, 20], strokeWidth: [.2, 6],
    reach: [10, 500], softness: [0, 1], speed: [0, 4], bounce: [0, 1],
    specks: [0, 60], introDuration: [.2, 8],
  };
  for (const key of Object.keys(bounds) as (keyof typeof bounds)[]) {
    const value = Number(options[key]), [min, max] = bounds[key]!;
    Object.assign(options, { [key]: Math.min(max, Math.max(min, Number.isFinite(value) ? value : Number(techTextDefaults[key]))) });
  }
  options.specks = Math.round(options.specks);
  return options;
}
