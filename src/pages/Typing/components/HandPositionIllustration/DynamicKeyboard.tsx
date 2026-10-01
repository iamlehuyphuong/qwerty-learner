import { FINGER_NAMES_VI, HAND_NAMES_VI, getFingerInfo } from './fingerMap'
import type { FingerInfo } from './fingerMap'
import { currentTargetKeyAtom, isShowHandPositionAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

// ── Keyboard layout definition ──
interface KeyDef {
  key: string
  label: string
  width: number
}

const KEYBOARD_ROWS: KeyDef[][] = [
  // Row 0: Number row
  [
    { key: '`', label: '`', width: 1 },
    { key: '1', label: '1', width: 1 },
    { key: '2', label: '2', width: 1 },
    { key: '3', label: '3', width: 1 },
    { key: '4', label: '4', width: 1 },
    { key: '5', label: '5', width: 1 },
    { key: '6', label: '6', width: 1 },
    { key: '7', label: '7', width: 1 },
    { key: '8', label: '8', width: 1 },
    { key: '9', label: '9', width: 1 },
    { key: '0', label: '0', width: 1 },
    { key: '-', label: '-', width: 1 },
    { key: '=', label: '=', width: 1 },
    { key: 'Backspace', label: '←', width: 2 },
  ],
  // Row 1: QWERTY
  [
    { key: 'Tab', label: 'TAB', width: 1.5 },
    { key: 'q', label: 'Q', width: 1 },
    { key: 'w', label: 'W', width: 1 },
    { key: 'e', label: 'E', width: 1 },
    { key: 'r', label: 'R', width: 1 },
    { key: 't', label: 'T', width: 1 },
    { key: 'y', label: 'Y', width: 1 },
    { key: 'u', label: 'U', width: 1 },
    { key: 'i', label: 'I', width: 1 },
    { key: 'o', label: 'O', width: 1 },
    { key: 'p', label: 'P', width: 1 },
    { key: '[', label: '[', width: 1 },
    { key: ']', label: ']', width: 1 },
    { key: '\\', label: '\\', width: 1.5 },
  ],
  // Row 2: Home row
  [
    { key: 'CapsLock', label: 'CAPS', width: 1.75 },
    { key: 'a', label: 'A', width: 1 },
    { key: 's', label: 'S', width: 1 },
    { key: 'd', label: 'D', width: 1 },
    { key: 'f', label: 'F', width: 1 },
    { key: 'g', label: 'G', width: 1 },
    { key: 'h', label: 'H', width: 1 },
    { key: 'j', label: 'J', width: 1 },
    { key: 'k', label: 'K', width: 1 },
    { key: 'l', label: 'L', width: 1 },
    { key: ';', label: ';', width: 1 },
    { key: "'", label: "'", width: 1 },
    { key: 'Enter', label: 'ENTER', width: 2.25 },
  ],
  // Row 3: Bottom row
  [
    { key: 'ShiftLeft', label: 'SHIFT', width: 2.25 },
    { key: 'z', label: 'Z', width: 1 },
    { key: 'x', label: 'X', width: 1 },
    { key: 'c', label: 'C', width: 1 },
    { key: 'v', label: 'V', width: 1 },
    { key: 'b', label: 'B', width: 1 },
    { key: 'n', label: 'N', width: 1 },
    { key: 'm', label: 'M', width: 1 },
    { key: ',', label: ',', width: 1 },
    { key: '.', label: '.', width: 1 },
    { key: '/', label: '/', width: 1 },
    { key: 'ShiftRight', label: 'SHIFT', width: 2.75 },
  ],
  // Row 4: Space bar
  [
    { key: 'CtrlLeft', label: '', width: 1.5 },
    { key: 'AltLeft', label: '', width: 1.5 },
    { key: ' ', label: '', width: 7 },
    { key: 'AltRight', label: '', width: 1.5 },
    { key: 'CtrlRight', label: '', width: 1.5 },
  ],
]

// ── Layout constants ──
const UNIT = 48
const GAP = 4
const PADDING = 10
const ROW_H = 44
const HAND_HEIGHT = 200 // increased to fit the taller Wikipedia hands

// ── Color helpers ──
function getKeyColor(key: string, isActive: boolean): string {
  const info = getFingerInfo(key)
  if (isActive) return info?.color ?? '#818cf8'
  if (info) {
    return info.color + '40'
  }
  return 'rgba(148, 163, 184, 0.15)'
}

const SHIFT_TO_BASE: Record<string, string> = {
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

function normalizeTargetKey(target: string): string {
  if (!target) return ''
  const lower = target.toLowerCase()
  return SHIFT_TO_BASE[target] ?? SHIFT_TO_BASE[lower] ?? lower
}

function getTargetRowIndex(targetKey: string): number {
  if (!targetKey) return 2 // Default to home row
  const normalized = normalizeTargetKey(targetKey)
  for (let i = 0; i < KEYBOARD_ROWS.length; i++) {
    if (KEYBOARD_ROWS[i].some((k) => normalizeTargetKey(k.key) === normalized)) {
      return i
    }
  }
  return 2
}

function HandsSVG({ svgWidth, targetKey }: { svgWidth: number; targetKey: string }) {
  // We use the paths extracted from the Wikipedia SVG.
  // The original SVG viewBox was 841x521. We scale and translate it to match our keyboard.
  // The scale factor is roughly 0.85 to match the keyboard width.
  // We adjust translate to align the fingers with the keys.
  const scale = 1.0
  const targetRowIdx = getTargetRowIndex(targetKey)

  // The keyboard keys are staggered. Relative to row 2 (Home row):
  // Row 1 (QWERTY) is shifted left by ~12px
  // Row 0 (Numbers) is shifted left by ~36px
  // Row 3 (ZXCV) is shifted right by ~24px
  const txMap = {
    0: -24,
    1: -12,
    2: 0,
    3: 12,
    4: 0,
  }
  const tx = txMap[targetRowIdx as keyof typeof txMap] ?? 0

  const tyMap = {
    0: -95,
    1: -55,
    2: -15,
    3: 25,
    4: 55,
  }
  const ty = tyMap[targetRowIdx as keyof typeof tyMap] ?? 0

  const LEFT_HAND_PATH = `
    M92.581,490.614c9.78-17.116,31.745-52.171,33.774-58.257c1.996-5.982,6.438-13.741,5.984-20.608
    c-2.032-30.762-0.067-68.095,0.432-109.475c-2.493-14.956-6.408-30.938-7.013-44.022c-0.653-14.189,0.441-29.797,3.999-45.89
    c5.854-26.47,27.755-23.348,23.933,0.166c-1.345,8.279-4.186,17.31-2.389,36.117c0.934,9.775,6.726,22.322,8.988,39.846
    c7.482-38.685,3.484-45.925,8.898-64.608c1.952-6.732,14.314-28.626,16.745-32.312c8.806-13.338,31.287-7.732,28.794,5.729
    c-0.856,4.624-12.962,27.918-13.641,32.649c-1.665,11.574-6.063,31.633-7.539,46.22c-0.534,5.269,0.389,8.911,2.027,9.367
    c1.611,0.447,5.277-3.076,7.12-9.759c1.774-6.442,12.162-43.772,19.286-55.609c2.826-4.697,19.006-26.886,23.298-31.83
    c4.873-5.61,9.273-8.588,16.459-7.084c6.699,1.4,12.123,6.189,10.875,14.446c-1.606,10.62-14.248,31.583-14.896,33.479
    c-4.6,13.488-17.041,50.187-20.829,58.733c-2.209,4.981-1.569,8.76,0.446,9.196c2.211,0.48,5.647-2.825,9.28-8.365
    c5.646-8.616,21.476-48.167,25.945-53.555c6.311-7.606,15.584-26.964,23.037-34.043c4.678-4.446,10.01-8.476,17.585-5.366
    c7.484,3.07,7.65,10.392,6.741,15.978c-0.967,5.942-10.259,29.832-13.958,37.89c-5.953,12.969-14.698,35.87-19.199,52.039
    c-2.598,9.332-8.329,29.742-8.329,36.887c0,9.519,2.38,26.177,11.898,17.848c1.847-3.562,21.186-23.504,24.987-23.797
    c13.09-20.229,26.27-26.896,36.886-30.745c8.218-2.979,17.575-2.146,24.988,3.377c-3.924,8.951-19.961,20.975-24.826,33.521
    c-2.541,12.885-27.958,28.361-32.612,46.975c-2.549,6.005-10.044,12.208-14.624,15.29
    c-26.343,35.563-43.162,39.054-64.579,46.194c-9.338,3.112-24.615,31.47-41.28,66.645
  `

  const activeFingerInfo = targetKey ? getFingerInfo(targetKey) : undefined
  const FINGERTIPS = [
    { x: 150, y: 218 }, // Pinky
    { x: 208, y: 202 }, // Ring
    { x: 263, y: 190 }, // Middle
    { x: 302, y: 205 }, // Index
    { x: 365, y: 305 }, // Thumb
  ]

  return (
    <g
      className="hands-illustration transition-transform duration-200 ease-out"
      opacity="0.85"
      style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Left Hand */}
      <g>
        <path
          fill="rgba(147, 197, 253, 0.15)"
          stroke="#94a3b8"
          strokeWidth="1.50"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          d={LEFT_HAND_PATH}
        />
        {activeFingerInfo?.hand === 0 && (
          <circle
            cx={FINGERTIPS[activeFingerInfo.finger].x}
            cy={FINGERTIPS[activeFingerInfo.finger].y}
            r="16"
            fill={activeFingerInfo.color}
            filter="url(#glow)"
          />
        )}
      </g>

      {/* Right Hand (Mirrored Left Hand) */}
      <g transform="translate(772.811, 0) scale(-1, 1)">
        <path
          fill="rgba(147, 197, 253, 0.15)"
          stroke="#94a3b8"
          strokeWidth="1.50"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          d={LEFT_HAND_PATH}
        />
        {activeFingerInfo?.hand === 1 && (
          <circle
            cx={FINGERTIPS[activeFingerInfo.finger].x}
            cy={FINGERTIPS[activeFingerInfo.finger].y}
            r="16"
            fill={activeFingerInfo.color}
            filter="url(#glow)"
          />
        )}
      </g>
    </g>
  )
}

// ── SVG Keyboard Key ──
function KeyboardKey({
  keyDef,
  x,
  y,
  width,
  height,
  isActive,
  fingerInfo,
}: {
  keyDef: KeyDef
  x: number
  y: number
  width: number
  height: number
  isActive: boolean
  fingerInfo: FingerInfo | undefined
}) {
  const fillColor = getKeyColor(keyDef.key, isActive)
  const rx = 3

  return (
    <g className={isActive ? 'keyboard-key-active' : 'keyboard-key'}>
      <rect
        x={x + 1}
        y={y + 1}
        width={width - 2}
        height={height - 2}
        rx={rx}
        ry={rx}
        fill={fillColor}
        stroke={isActive ? fingerInfo?.color ?? '#818cf8' : 'rgba(148, 163, 184, 0.2)'}
        strokeWidth={isActive ? 2 : 0.5}
        className="transition-all duration-200"
      />

      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={width > 50 ? 16 : 20}
        fontWeight={isActive ? 700 : 500}
        fontFamily="'Inter', 'SF Pro', system-ui, sans-serif"
        fill={isActive ? '#1e293b' : 'rgba(148, 163, 184, 0.8)'}
        className="select-none transition-all duration-200"
      >
        {keyDef.label}
      </text>
    </g>
  )
}

// ── Main Exported Component ──
export default function DynamicKeyboard() {
  const isShow = useAtomValue(isShowHandPositionAtom)
  const targetKey = useAtomValue(currentTargetKeyAtom)

  const normalizedTarget = useMemo(() => normalizeTargetKey(targetKey), [targetKey])
  const activeFingerInfo = useMemo(() => (targetKey ? getFingerInfo(targetKey) : undefined), [targetKey])

  if (!isShow) return null

  // Calculate total width from widest row
  const totalUnits = Math.max(...KEYBOARD_ROWS.map((row) => row.reduce((sum, k) => sum + k.width, 0) + (row.length - 1) * (GAP / UNIT)))
  const svgWidth = totalUnits * UNIT + PADDING * 2 + (KEYBOARD_ROWS[0].length - 1) * GAP
  const svgHeight = KEYBOARD_ROWS.length * (ROW_H + GAP) + PADDING * 2 + HAND_HEIGHT

  return (
    <div className="pointer-events-none mt-[50px] flex w-full select-none justify-center opacity-90 transition-all duration-300">
      <div className="relative">
        <svg
          width="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="block h-64 max-w-[90%] lg:h-72 lg:max-w-[700px]"
          style={{ margin: '0 auto' }}
        >
          {/* Hand illustrations (rendered first, behind the keyboard) */}
          <HandsSVG svgWidth={svgWidth} targetKey={targetKey} />

          {/* Render all keyboard rows */}
          {KEYBOARD_ROWS.map((row, rowIdx) => {
            let currentX = PADDING
            const currentY = PADDING + rowIdx * (ROW_H + GAP)

            return row.map((keyDef) => {
              const keyWidth = keyDef.width * UNIT + (keyDef.width > 1 ? (keyDef.width - 1) * GAP : 0)
              const x = currentX
              currentX += keyWidth + GAP

              const isActive = normalizedTarget !== '' && normalizeTargetKey(keyDef.key) === normalizedTarget

              return (
                <KeyboardKey
                  key={`${rowIdx}-${keyDef.key}`}
                  keyDef={keyDef}
                  x={x}
                  y={currentY}
                  width={keyWidth}
                  height={ROW_H}
                  isActive={isActive}
                  fingerInfo={isActive ? activeFingerInfo : undefined}
                />
              )
            })
          })}
        </svg>
      </div>
    </div>
  )
}
