"use client"
import type { Element } from "@/types/editor"

interface ShapeElementProps {
  element: Element
}

export default function ShapeElement({ element }: ShapeElementProps) {
  const { content, style = {} } = element

  const shapeStyle = {
    width: "100%",
    height: "100%",
    fill: style.fill || "#ffffff",
    stroke: style.stroke || "#000000",
    strokeWidth: style.strokeWidth || 1,
    opacity: style.opacity || 1,
    borderRadius: style.borderRadius || 0,
  }

  const renderShape = () => {
    switch (content) {
      case "rectangle":
        return (
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            style={shapeStyle}
            rx={shapeStyle.borderRadius}
            ry={shapeStyle.borderRadius}
          />
        )
      case "circle":
        const radius = Math.min(element.width, element.height) / 2
        return <circle cx={element.width / 2} cy={element.height / 2} r={radius} style={shapeStyle} />
      case "triangle":
        const trianglePoints = `${element.width / 2},0 ${element.width},${element.height} 0,${element.height}`
        return <polygon points={trianglePoints} style={shapeStyle} />
      case "diamond":
        const diamondPoints = `${element.width / 2},0 ${element.width},${element.height / 2} ${element.width / 2},${element.height} 0,${element.height / 2}`
        return <polygon points={diamondPoints} style={shapeStyle} />
      case "pentagon":
        // 计算五边形的点
        const pentagonPoints = calculatePolygonPoints(
          5,
          element.width / 2,
          element.height / 2,
          Math.min(element.width, element.height) / 2,
        )
        return <polygon points={pentagonPoints} style={shapeStyle} />
      case "hexagon":
        // 计算六边形的点
        const hexagonPoints = calculatePolygonPoints(
          6,
          element.width / 2,
          element.height / 2,
          Math.min(element.width, element.height) / 2,
        )
        return <polygon points={hexagonPoints} style={shapeStyle} />
      case "arrow":
        // 绘制箭头
        const arrowPath = `M0,${element.height / 2} L${element.width * 0.7},${element.height / 2} L${element.width * 0.7},${element.height * 0.2} L${element.width},${element.height / 2} L${element.width * 0.7},${element.height * 0.8} L${element.width * 0.7},${element.height / 2}`
        return <path d={arrowPath} style={shapeStyle} />
      case "line":
        return (
          <line
            x1="0"
            y1={element.height / 2}
            x2={element.width}
            y2={element.height / 2}
            style={{
              stroke: style.stroke || "#000000",
              strokeWidth: style.strokeWidth || 2,
              opacity: style.opacity || 1,
            }}
          />
        )
      default:
        return null
    }
  }

  // 计算正多边形的点
  const calculatePolygonPoints = (sides: number, centerX: number, centerY: number, radius: number) => {
    let points = ""
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2 // 从顶部开始
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      points += `${x},${y} `
    }
    return points.trim()
  }

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${element.width} ${element.height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderShape()}
    </svg>
  )
}

