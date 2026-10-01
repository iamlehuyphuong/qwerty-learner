/**
 * Key positions on the virtual keyboard for SVG overlay.
 * All coordinates are in percentages relative to the keyboard container,
 * making them resolution-independent.
 *
 * Layout based on the standard QWERTY keyboard image.
 */

export interface KeyPosition {
  /** X position as percentage from left */
  x: number
  /** Y position as percentage from top */
  y: number
  /** Width as percentage */
  w: number
  /** Height as percentage */
  h: number
  /** Display label for the key */
  label: string
}

// Keyboard layout dimensions (in relative units)
// The keyboard has 5 rows:
//   Row 0: Number row (14 keys + backspace)
//   Row 1: QWERTY row (Tab + 13 keys + \)
//   Row 2: Home row (Caps + 12 keys + Enter)
//   Row 3: Bottom row (Shift + 10 keys + Shift)
//   Row 4: Space bar row

const ROW_HEIGHT = 17.5 // % per row
const KEY_WIDTH = 6.7 // % standard key width
const KEY_GAP = 0.5 // % gap between keys
const TOP_OFFSET = 1.5 // % top margin

// Helper: compute x for a key at a given column, with custom offset
function kx(col: number, rowOffset = 0): number {
  return rowOffset + col * (KEY_WIDTH + KEY_GAP)
}

function ky(row: number): number {
  return TOP_OFFSET + row * (ROW_HEIGHT + 1)
}

// ── Row offsets (stagger) matching QWERTY physical layout ──
const ROW_0_OFFSET = 0.5
const ROW_1_OFFSET = 1.5 // Tab row offset
const ROW_2_OFFSET = 3.0 // Caps lock row offset
const ROW_3_OFFSET = 4.5 // Shift row offset

export const KEY_POSITIONS: Record<string, KeyPosition> = {
  // ═══════ Row 0: Number row ═══════
  '`': { x: kx(0, ROW_0_OFFSET), y: ky(0), w: KEY_WIDTH, h: ROW_HEIGHT, label: '`' },
  '1': { x: kx(1, ROW_0_OFFSET), y: ky(0), w: KEY_WIDTH, h: ROW_HEIGHT, label: '1' },
  '2': { x: kx(2, ROW_0_OFFSET), y: ky(0), w: KEY_WIDTH, h: ROW_HEIGHT, label: '2' },
  '3': { x: kx(3, ROW_0_OFFSET), y: ky(0), w: KEY_WIDTH, h: ROW_HEIGHT, label: '3' },
  '4': { x: kx(4, ROW_0_OFFSET), y: ky(0), w: KEY_WIDTH, h: ROW_HEIGHT, label: '4' },
  '5': { x: kx(5, ROW_0_OFFSET), y: ky(0), w: KEY_WIDTH, h: ROW_HEIGHT, label: '5' },
  '6': { x: kx(6, ROW_0_OFFSET), y: ky(0), w: KEY_WIDTH, h: ROW_HEIGHT, label: '6' },
  '7': { x: kx(7, ROW_0_OFFSET), y: ky(0), w: KEY_WIDTH, h: ROW_HEIGHT, label: '7' },
  '8': { x: kx(8, ROW_0_OFFSET), y: ky(0), w: KEY_WIDTH, h: ROW_HEIGHT, label: '8' },
  '9': { x: kx(9, ROW_0_OFFSET), y: ky(0), w: KEY_WIDTH, h: ROW_HEIGHT, label: '9' },
  '0': { x: kx(10, ROW_0_OFFSET), y: ky(0), w: KEY_WIDTH, h: ROW_HEIGHT, label: '0' },
  '-': { x: kx(11, ROW_0_OFFSET), y: ky(0), w: KEY_WIDTH, h: ROW_HEIGHT, label: '-' },
  '=': { x: kx(12, ROW_0_OFFSET), y: ky(0), w: KEY_WIDTH, h: ROW_HEIGHT, label: '=' },
  Backspace: { x: kx(13, ROW_0_OFFSET), y: ky(0), w: KEY_WIDTH * 1.5, h: ROW_HEIGHT, label: '←' },

  // ═══════ Row 1: QWERTY row ═══════
  Tab: { x: ROW_1_OFFSET, y: ky(1), w: KEY_WIDTH * 1.3, h: ROW_HEIGHT, label: 'TAB' },
  q: { x: kx(1, ROW_1_OFFSET) + 2, y: ky(1), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'Q' },
  w: { x: kx(2, ROW_1_OFFSET) + 2, y: ky(1), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'W' },
  e: { x: kx(3, ROW_1_OFFSET) + 2, y: ky(1), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'E' },
  r: { x: kx(4, ROW_1_OFFSET) + 2, y: ky(1), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'R' },
  t: { x: kx(5, ROW_1_OFFSET) + 2, y: ky(1), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'T' },
  y: { x: kx(6, ROW_1_OFFSET) + 2, y: ky(1), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'Y' },
  u: { x: kx(7, ROW_1_OFFSET) + 2, y: ky(1), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'U' },
  i: { x: kx(8, ROW_1_OFFSET) + 2, y: ky(1), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'I' },
  o: { x: kx(9, ROW_1_OFFSET) + 2, y: ky(1), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'O' },
  p: { x: kx(10, ROW_1_OFFSET) + 2, y: ky(1), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'P' },
  '[': { x: kx(11, ROW_1_OFFSET) + 2, y: ky(1), w: KEY_WIDTH, h: ROW_HEIGHT, label: '[' },
  ']': { x: kx(12, ROW_1_OFFSET) + 2, y: ky(1), w: KEY_WIDTH, h: ROW_HEIGHT, label: ']' },
  '\\': { x: kx(13, ROW_1_OFFSET) + 2, y: ky(1), w: KEY_WIDTH, h: ROW_HEIGHT, label: '\\' },

  // ═══════ Row 2: Home row (ASDF...) ═══════
  CapsLock: { x: ROW_2_OFFSET, y: ky(2), w: KEY_WIDTH * 1.5, h: ROW_HEIGHT, label: 'CAPS' },
  a: { x: kx(1, ROW_2_OFFSET) + 3.5, y: ky(2), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'A' },
  s: { x: kx(2, ROW_2_OFFSET) + 3.5, y: ky(2), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'S' },
  d: { x: kx(3, ROW_2_OFFSET) + 3.5, y: ky(2), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'D' },
  f: { x: kx(4, ROW_2_OFFSET) + 3.5, y: ky(2), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'F' },
  g: { x: kx(5, ROW_2_OFFSET) + 3.5, y: ky(2), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'G' },
  h: { x: kx(6, ROW_2_OFFSET) + 3.5, y: ky(2), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'H' },
  j: { x: kx(7, ROW_2_OFFSET) + 3.5, y: ky(2), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'J' },
  k: { x: kx(8, ROW_2_OFFSET) + 3.5, y: ky(2), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'K' },
  l: { x: kx(9, ROW_2_OFFSET) + 3.5, y: ky(2), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'L' },
  ';': { x: kx(10, ROW_2_OFFSET) + 3.5, y: ky(2), w: KEY_WIDTH, h: ROW_HEIGHT, label: ';' },
  "'": { x: kx(11, ROW_2_OFFSET) + 3.5, y: ky(2), w: KEY_WIDTH, h: ROW_HEIGHT, label: "'" },
  Enter: { x: kx(12, ROW_2_OFFSET) + 3.5, y: ky(2), w: KEY_WIDTH * 2, h: ROW_HEIGHT, label: 'ENTER' },

  // ═══════ Row 3: Bottom row (ZXCV...) ═══════
  ShiftLeft: { x: ROW_3_OFFSET, y: ky(3), w: KEY_WIDTH * 2, h: ROW_HEIGHT, label: 'SHIFT' },
  z: { x: kx(1, ROW_3_OFFSET) + 7, y: ky(3), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'Z' },
  x: { x: kx(2, ROW_3_OFFSET) + 7, y: ky(3), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'X' },
  c: { x: kx(3, ROW_3_OFFSET) + 7, y: ky(3), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'C' },
  v: { x: kx(4, ROW_3_OFFSET) + 7, y: ky(3), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'V' },
  b: { x: kx(5, ROW_3_OFFSET) + 7, y: ky(3), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'B' },
  n: { x: kx(6, ROW_3_OFFSET) + 7, y: ky(3), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'N' },
  m: { x: kx(7, ROW_3_OFFSET) + 7, y: ky(3), w: KEY_WIDTH, h: ROW_HEIGHT, label: 'M' },
  ',': { x: kx(8, ROW_3_OFFSET) + 7, y: ky(3), w: KEY_WIDTH, h: ROW_HEIGHT, label: ',' },
  '.': { x: kx(9, ROW_3_OFFSET) + 7, y: ky(3), w: KEY_WIDTH, h: ROW_HEIGHT, label: '.' },
  '/': { x: kx(10, ROW_3_OFFSET) + 7, y: ky(3), w: KEY_WIDTH, h: ROW_HEIGHT, label: '/' },
  ShiftRight: { x: kx(11, ROW_3_OFFSET) + 7, y: ky(3), w: KEY_WIDTH * 2.2, h: ROW_HEIGHT, label: 'SHIFT' },

  // ═══════ Row 4: Space bar row ═══════
  ' ': { x: 25, y: ky(4), w: 50, h: ROW_HEIGHT, label: 'SPACE' },
}

/**
 * Lookup key position, handling case-insensitive and shift-key characters.
 */
export function getKeyPosition(key: string): KeyPosition | undefined {
  // Direct lookup
  if (KEY_POSITIONS[key]) return KEY_POSITIONS[key]
  // Case-insensitive
  if (KEY_POSITIONS[key.toLowerCase()]) return KEY_POSITIONS[key.toLowerCase()]

  // Map shifted characters to their base key
  const shiftMap: Record<string, string> = {
    '~': '`',
    '!': '1',
    '@': '2',
    '#': '3',
    $: '4',
    '%': '5',
    '^': '6',
    '&': '7',
    '*': '8',
    '(': '9',
    ')': '0',
    _: '-',
    '+': '=',
    '{': '[',
    '}': ']',
    '|': '\\',
    ':': ';',
    '"': "'",
    '<': ',',
    '>': '.',
    '?': '/',
  }
  if (shiftMap[key]) return KEY_POSITIONS[shiftMap[key]]

  return undefined
}
