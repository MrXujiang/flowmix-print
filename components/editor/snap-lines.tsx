"use client"

interface SnapLinesProps {
  horizontal: number[]
  vertical: number[]
  zoom: number
}

export default function SnapLines({ horizontal, vertical, zoom }: SnapLinesProps) {
  return (
    <>
      {horizontal.map((y, index) => (
        <div key={`h-${index}`} className="horizontal-line" style={{ top: y * zoom }} />
      ))}
      {vertical.map((x, index) => (
        <div key={`v-${index}`} className="vertical-line" style={{ left: x * zoom }} />
      ))}
    </>
  )
}

