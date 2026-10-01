/**
 * Finger mapping for standard touch typing (QWERTY layout).
 * Maps each key to which finger and hand should be used.
 */

export type FingerName = 'pinky' | 'ring' | 'middle' | 'index' | 'thumb'
export type HandSide = 'left' | 'right'

export interface FingerInfo {
  finger: FingerName
  hand: HandSide
  /** Color associated with this finger zone (matches the keyboard image) */
  color: string
}

/**
 * Color scheme matching the existing keyboard image zones:
 * - Light blue: pinky
 * - Green: ring
 * - Pink/Magenta: middle (left), Pink (right)
 * - Orange: index (left)
 * - Yellow: index (right)
 * - Cyan/Light blue: thumb (space)
 */
export const FINGER_COLORS: Record<HandSide, Record<FingerName, string>> = {
  left: {
    pinky: '#93c5fd', // light blue
    ring: '#86efac', // green
    middle: '#f9a8d4', // pink
    index: '#fdba74', // orange
    thumb: '#a5f3fc', // cyan
  },
  right: {
    pinky: '#93c5fd', // light blue
    ring: '#86efac', // green
    middle: '#f9a8d4', // pink
    index: '#fde047', // yellow
    thumb: '#a5f3fc', // cyan
  },
}

export const FINGER_MAP: Record<string, FingerInfo> = {
  // ═══════════════════════════════════
  // LEFT HAND
  // ═══════════════════════════════════

  // --- Pinky (left) ---
  '`': { finger: 'pinky', hand: 'left', color: '#93c5fd' },
  '~': { finger: 'pinky', hand: 'left', color: '#93c5fd' },
  '1': { finger: 'pinky', hand: 'left', color: '#93c5fd' },
  '!': { finger: 'pinky', hand: 'left', color: '#93c5fd' },
  q: { finger: 'pinky', hand: 'left', color: '#93c5fd' },
  a: { finger: 'pinky', hand: 'left', color: '#93c5fd' },
  z: { finger: 'pinky', hand: 'left', color: '#93c5fd' },

  // --- Ring (left) ---
  '2': { finger: 'ring', hand: 'left', color: '#86efac' },
  '@': { finger: 'ring', hand: 'left', color: '#86efac' },
  w: { finger: 'ring', hand: 'left', color: '#86efac' },
  s: { finger: 'ring', hand: 'left', color: '#86efac' },
  x: { finger: 'ring', hand: 'left', color: '#86efac' },

  // --- Middle (left) ---
  '3': { finger: 'middle', hand: 'left', color: '#f9a8d4' },
  '#': { finger: 'middle', hand: 'left', color: '#f9a8d4' },
  e: { finger: 'middle', hand: 'left', color: '#f9a8d4' },
  d: { finger: 'middle', hand: 'left', color: '#f9a8d4' },
  c: { finger: 'middle', hand: 'left', color: '#f9a8d4' },

  // --- Index (left) ---
  '4': { finger: 'index', hand: 'left', color: '#fdba74' },
  $: { finger: 'index', hand: 'left', color: '#fdba74' },
  '5': { finger: 'index', hand: 'left', color: '#fdba74' },
  '%': { finger: 'index', hand: 'left', color: '#fdba74' },
  r: { finger: 'index', hand: 'left', color: '#fdba74' },
  t: { finger: 'index', hand: 'left', color: '#fdba74' },
  f: { finger: 'index', hand: 'left', color: '#fdba74' },
  g: { finger: 'index', hand: 'left', color: '#fdba74' },
  v: { finger: 'index', hand: 'left', color: '#fdba74' },
  b: { finger: 'index', hand: 'left', color: '#fdba74' },

  // ═══════════════════════════════════
  // RIGHT HAND
  // ═══════════════════════════════════

  // --- Index (right) ---
  '6': { finger: 'index', hand: 'right', color: '#fde047' },
  '^': { finger: 'index', hand: 'right', color: '#fde047' },
  '7': { finger: 'index', hand: 'right', color: '#fde047' },
  '&': { finger: 'index', hand: 'right', color: '#fde047' },
  y: { finger: 'index', hand: 'right', color: '#fde047' },
  u: { finger: 'index', hand: 'right', color: '#fde047' },
  h: { finger: 'index', hand: 'right', color: '#fde047' },
  j: { finger: 'index', hand: 'right', color: '#fde047' },
  n: { finger: 'index', hand: 'right', color: '#fde047' },
  m: { finger: 'index', hand: 'right', color: '#fde047' },

  // --- Middle (right) ---
  '8': { finger: 'middle', hand: 'right', color: '#f9a8d4' },
  '*': { finger: 'middle', hand: 'right', color: '#f9a8d4' },
  i: { finger: 'middle', hand: 'right', color: '#f9a8d4' },
  k: { finger: 'middle', hand: 'right', color: '#f9a8d4' },
  ',': { finger: 'middle', hand: 'right', color: '#f9a8d4' },
  '<': { finger: 'middle', hand: 'right', color: '#f9a8d4' },

  // --- Ring (right) ---
  '9': { finger: 'ring', hand: 'right', color: '#86efac' },
  '(': { finger: 'ring', hand: 'right', color: '#86efac' },
  o: { finger: 'ring', hand: 'right', color: '#86efac' },
  l: { finger: 'ring', hand: 'right', color: '#86efac' },
  '.': { finger: 'ring', hand: 'right', color: '#86efac' },
  '>': { finger: 'ring', hand: 'right', color: '#86efac' },

  // --- Pinky (right) ---
  '0': { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  ')': { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  '-': { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  _: { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  '=': { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  '+': { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  p: { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  '[': { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  '{': { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  ']': { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  '}': { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  '\\': { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  '|': { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  ';': { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  ':': { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  "'": { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  '"': { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  '/': { finger: 'pinky', hand: 'right', color: '#93c5fd' },
  '?': { finger: 'pinky', hand: 'right', color: '#93c5fd' },

  // --- Thumbs (space) ---
  ' ': { finger: 'thumb', hand: 'right', color: '#a5f3fc' },
}

/** Vietnamese finger names for display */
export const FINGER_NAMES_VI: Record<FingerName, string> = {
  pinky: 'Ngón út',
  ring: 'Ngón áp út',
  middle: 'Ngón giữa',
  index: 'Ngón trỏ',
  thumb: 'Ngón cái',
}

export const HAND_NAMES_VI: Record<HandSide, string> = {
  left: 'Tay trái',
  right: 'Tay phải',
}

export function getFingerInfo(key: string): FingerInfo | undefined {
  return FINGER_MAP[key.toLowerCase()] ?? FINGER_MAP[key]
}
