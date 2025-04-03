"use client"

import type React from "react"

import { useRef, useState, useEffect, useMemo } from "react"
import { useDrop } from "react-dnd"
import { useEditorStore } from "@/lib/editor-store"
import CanvasElement from "./canvas-element"
import SnapLines from "./snap-lines"

export default function Canvas() {
  const {
    canvasSize,
    zoom,
    currentPage,
    pages,
    addElement,
    moveElement,
    selectedElement,
    setSelectedElement,
    showGrid,
    showRulers,
    canvasBackground, // 添加这一行
  } = useEditorStore()

  const canvasRef = useRef<HTMLDivElement>(null)
  const [snapLines, setSnapLines] = useState<{ horizontal: number[]; vertical: number[] }>({
    horizontal: [],
    vertical: [],
  })

  // 计算画布尺寸（毫米转像素）
  const canvasWidth = canvasSize.width * 3.78 * zoom // 1mm ≈ 3.78px
  const canvasHeight = canvasSize.height * 3.78 * zoom

  // 处理元素拖放
  const [{ isOver }, drop] = useDrop({
    accept: "ELEMENT",
    drop: (item: any, monitor) => {
      const canvasRect = canvasRef.current?.getBoundingClientRect()
      if (!canvasRect) return

      const dropOffset = monitor.getSourceClientOffset()
      if (!dropOffset) return

      const x = (dropOffset.x - canvasRect.left) / zoom
      const y = (dropOffset.y - canvasRect.top) / zoom

      if (item.id) {
        // 移动已有元素
        moveElement(item.id, x, y)
      } else {
        // 添加新元素
        addElement({
          type: item.type,
          x,
          y,
          width: item.defaultWidth || 100,
          height: item.defaultHeight || 100,
          content: item.defaultContent || "",
          style: item.defaultStyle || {},
        })
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  // 计算对齐参考线
  const calculateSnapLines = (elementId: string, x: number, y: number, width: number, height: number) => {
    const horizontal: number[] = []
    const vertical: number[] = []

    // 获取当前页面的所有元素
    const currentElements = pages[currentPage]?.elements || []

    currentElements.forEach((el) => {
      if (el.id === elementId) return

      // 水平参考线
      if (Math.abs(y - el.y) < 5) horizontal.push(el.y)
      if (Math.abs(y + height - el.y) < 5) horizontal.push(el.y)
      if (Math.abs(y - (el.y + el.height)) < 5) horizontal.push(el.y + el.height)
      if (Math.abs(y + height - (el.y + el.height)) < 5) horizontal.push(el.y + el.height)

      // 垂直参考线
      if (Math.abs(x - el.x) < 5) vertical.push(el.x)
      if (Math.abs(x + width - el.x) < 5) vertical.push(el.x)
      if (Math.abs(x - (el.x + el.width)) < 5) vertical.push(el.x + el.width)
      if (Math.abs(x + width - (el.x + el.width)) < 5) vertical.push(el.x + el.width)
    })

    setSnapLines({ horizontal, vertical })
  }

  // 清除参考线
  const clearSnapLines = () => {
    setSnapLines({ horizontal: [], vertical: [] })
  }

  // 处理画布点击事件
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null)
    }
  }

  // 防止默认拖动行为
  useEffect(() => {
    const preventDefaultDrag = (e: DragEvent) => {
      e.preventDefault()
    }

    document.addEventListener("dragover", preventDefaultDrag)

    return () => {
      document.removeEventListener("dragover", preventDefaultDrag)
    }
  }, [])

  // 计算标尺刻度
  const rulerMarks = useMemo(() => {
    if (!showRulers) return { horizontal: [], vertical: [] }

    // 计算刻度间隔 (每10mm一个主刻度，每1mm一个小刻度)
    const pixelsPerMm = 3.78 * zoom
    const majorStep = 10 * pixelsPerMm
    const minorStep = pixelsPerMm

    // 水平刻度
    const horizontalMarks = []
    const horizontalCount = Math.ceil(canvasWidth / minorStep)

    for (let i = 0; i <= horizontalCount; i++) {
      const position = i * minorStep
      const isMajor = i % 10 === 0

      horizontalMarks.push({
        position,
        isMajor,
        label: isMajor ? `${i * 1}` : "",
      })
    }

    // 垂直刻度
    const verticalMarks = []
    const verticalCount = Math.ceil(canvasHeight / minorStep)

    for (let i = 0; i <= verticalCount; i++) {
      const position = i * minorStep
      const isMajor = i % 10 === 0

      verticalMarks.push({
        position,
        isMajor,
        label: isMajor ? `${i * 1}` : "",
      })
    }

    return { horizontal: horizontalMarks, vertical: verticalMarks }
  }, [canvasWidth, canvasHeight, zoom, showRulers])

  // 在组件中添加以下代码，确保在状态变化时重新渲染
  useEffect(() => {
    // 当页面或画布尺寸变化时，强制重新渲染
    // 这里不需要调用特定函数，React 会自动处理重新渲染
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, currentPage, canvasSize, canvasBackground])

  return (
      <div className="canvas-wrapper relative">
        {showRulers && (
            <>
              <div className="horizontal-ruler">
                {rulerMarks.horizontal.map((mark, index) => (
                    <div
                        key={`h-${index}`}
                        className={`absolute top-0 bottom-0 border-l ${mark.isMajor ? "border-border" : "border-border/30"}`}
                        style={{
                          left: mark.position,
                          height: mark.isMajor ? "100%" : "50%",
                          top: mark.isMajor ? 0 : "50%",
                        }}
                    >
                      {mark.label && (
                          <div className="absolute text-[8px] text-muted-foreground" style={{ top: 2, left: 2 }}>
                            {mark.label}
                          </div>
                      )}
                    </div>
                ))}
              </div>
              <div className="vertical-ruler">
                {rulerMarks.vertical.map((mark, index) => (
                    <div
                        key={`v-${index}`}
                        className={`absolute left-0 right-0 border-t ${mark.isMajor ? "border-border" : "border-border/30"}`}
                        style={{
                          top: mark.position,
                          width: mark.isMajor ? "100%" : "50%",
                          left: mark.isMajor ? 0 : "50%",
                        }}
                    >
                      {mark.label && (
                          <div className="absolute text-[8px] text-muted-foreground" style={{ top: 2, left: 2 }}>
                            {mark.label}
                          </div>
                      )}
                    </div>
                ))}
              </div>
            </>
        )}
        <div
            ref={(node) => {
              canvasRef.current = node
              drop(node)
            }}
            className={`canvas ${showGrid ? "show-grid" : ""}`}
            style={{
              width: canvasWidth,
              height: canvasHeight,
              marginTop: showRulers ? 20 : 0,
              marginLeft: showRulers ? 20 : 0,
              backgroundColor: canvasBackground.type === "color" ? canvasBackground.value : undefined,
              backgroundImage:
                  canvasBackground.type === "image"
                      ? `url(${canvasBackground.value})`
                      : canvasBackground.type === "pattern"
                          ? canvasBackground.value
                          : undefined,
              backgroundSize: canvasBackground.type === "image" ? "cover" : undefined,
              backgroundRepeat: canvasBackground.type === "pattern" ? "repeat" : undefined,
              opacity: canvasBackground.opacity,
            }}
            onClick={handleCanvasClick}
        >
          {pages[currentPage]?.elements.map((element) => (
              <CanvasElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElement?.id === element.id}
                  onSelect={() => setSelectedElement(element)}
                  onMove={calculateSnapLines}
                  onMoveEnd={clearSnapLines}
                  zoom={zoom}
              />
          ))}
          <SnapLines horizontal={snapLines.horizontal} vertical={snapLines.vertical} zoom={zoom} />
        </div>
      </div>
  )
}

