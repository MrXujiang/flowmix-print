"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { useDrag } from "react-dnd"
import { useEditorStore } from "@/lib/editor-store"
import { Resizable } from "re-resizable"
import type { Element } from "@/types/editor"
import TextElement from "./elements/text-element"
import ImageElement from "./elements/image-element"
import ShapeElement from "./elements/shape-element"
import TableElement from "./elements/table-element"
import IconElement from "./elements/icon-element"
import ChartElement from "./elements/chart-element"
import BarcodeElement from "./elements/barcode-element"

interface CanvasElementProps {
  element: Element
  isSelected: boolean
  onSelect: () => void
  onMove: (id: string, x: number, y: number, width: number, height: number) => void
  onMoveEnd: () => void
  zoom: number
}

export default function CanvasElement({ element, isSelected, onSelect, onMove, onMoveEnd, zoom }: CanvasElementProps) {
  const { updateElement } = useEditorStore()
  const elementRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: element.x, y: element.y })
  const [isDraggingInternal, setIsDraggingInternal] = useState(false)
  const [size, setSize] = useState({ width: element.width, height: element.height })
  const positionRef = useRef({ x: element.x, y: element.y })

  // 更新位置状态，确保与props同步
  useEffect(() => {
    setPosition({ x: element.x, y: element.y })
    positionRef.current = { x: element.x, y: element.y }
    setSize({ width: element.width, height: element.height })
  }, [element.x, element.y, element.width, element.height])

  // 拖拽功能
  const [{ isDragging }, drag] = useDrag({
    type: "ELEMENT",
    item: () => {
      setIsDraggingInternal(true)
      return { id: element.id, type: element.type }
    },
    end: () => {
      setIsDraggingInternal(false)
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  // 处理元素调整大小
  const handleResize = (
    e: React.SyntheticEvent,
    direction: string,
    ref: HTMLElement,
    d: { width: number; height: number },
  ) => {
    // 阻止默认事件，防止冲突
    if (e && e.preventDefault) {
      e.preventDefault()
    }

    // 直接使用ref的宽高，而不是增量计算
    const newWidth = ref.offsetWidth / zoom
    const newHeight = ref.offsetHeight / zoom

    setSize({ width: newWidth, height: newHeight })

    onMove(element.id, position.x, position.y, newWidth, newHeight)
  }

  // 处理调整大小结束
  const handleResizeStop = () => {
    updateElement(element.id, {
      ...element,
      width: size.width,
      height: size.height,
    })

    onMoveEnd()
  }

  // 处理元素拖动
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isSelected || e.button !== 0) return

    // 如果点击的是调整大小的控制点，不处理拖动
    if ((e.target as HTMLElement).classList.contains("resize-handle")) return

    const startX = e.clientX
    const startY = e.clientY
    const startPosX = position.x
    const startPosY = position.y

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - startX) / zoom
      const dy = (moveEvent.clientY - startY) / zoom

      const newX = startPosX + dx
      const newY = startPosY + dy

      setPosition({ x: newX, y: newY })
      positionRef.current = { x: newX, y: newY }
      onMove(element.id, newX, newY, element.width, element.height)
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)

      // 更新元素位置
      updateElement(element.id, {
        ...element,
        x: positionRef.current.x,
        y: positionRef.current.y,
      })

      onMoveEnd()
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    e.preventDefault()
  }

  // 渲染不同类型的元素
  const renderElement = () => {
    switch (element.type) {
      case "text":
        return <TextElement element={element} />
      case "image":
        return <ImageElement element={element} />
      case "shape":
        return <ShapeElement element={element} />
      case "table":
        return <TableElement element={element} />
      case "icon":
        return <IconElement element={element} />
      case "chart":
        return <ChartElement element={element} />
      case "barcode":
        return <BarcodeElement element={element} />
      default:
        return <div>未知元素类型</div>
    }
  }

  // 防止默认拖动行为
  useEffect(() => {
    const currentElement = elementRef.current
    if (currentElement) {
      const preventDefaultDrag = (e: DragEvent) => {
        if (!isSelected) return
        e.preventDefault()
      }

      currentElement.addEventListener("dragstart", preventDefaultDrag)

      return () => {
        currentElement.removeEventListener("dragstart", preventDefaultDrag)
      }
    }
  }, [isSelected])

  return (
    <div
      style={{
        position: "absolute",
        left: position.x * zoom,
        top: position.y * zoom,
        width: element.width * zoom,
        height: element.height * zoom,
        opacity: isDragging || isDraggingInternal ? 0.5 : 1,
        zIndex: isSelected ? 10 : 1,
        transition: isDragging ? "none" : "opacity 0.2s",
      }}
    >
      <Resizable
        size={{ width: element.width * zoom, height: element.height * zoom }}
        onResize={handleResize}
        onResizeStop={handleResizeStop}
        enable={
          isSelected
            ? {
                top: true,
                right: true,
                bottom: true,
                left: true,
                topRight: true,
                bottomRight: true,
                bottomLeft: true,
                topLeft: true,
              }
            : {}
        }
        handleClasses={{
          top: "resize-handle n",
          right: "resize-handle e",
          bottom: "resize-handle s",
          left: "resize-handle w",
          topRight: "resize-handle ne",
          bottomRight: "resize-handle se",
          bottomLeft: "resize-handle sw",
          topLeft: "resize-handle nw",
        }}
        scale={zoom}
      >
        <div
          ref={(node) => {
            elementRef.current = node
            drag(node)
          }}
          className={`canvas-element ${isSelected ? "selected" : ""}`}
          style={{
            width: "100%",
            height: "100%",
          }}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          onMouseDown={handleMouseDown}
        >
          {renderElement()}
        </div>
      </Resizable>
    </div>
  )
}

