"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useEditorStore } from "@/lib/editor-store"
import type { Element } from "@/types/editor"

interface TextElementProps {
  element: Element
}

export default function TextElement({ element }: TextElementProps) {
  const { updateElement } = useEditorStore()
  const [isEditing, setIsEditing] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)

    // 确保在下一个渲染周期后聚焦
    setTimeout(() => {
      if (textRef.current) {
        textRef.current.focus()

        // 将光标放在文本末尾
        const range = document.createRange()
        const sel = window.getSelection()
        range.selectNodeContents(textRef.current)
        range.collapse(false)
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
    }, 0)
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setIsEditing(false)
    updateElement(element.id, {
      ...element,
      content: e.target.innerText,
    })
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      textRef.current?.blur()
    }
  }

  // 监听点击事件，如果点击了文本元素外部，则结束编辑
  useEffect(() => {
    if (!isEditing) return

    const handleClickOutside = (e: MouseEvent) => {
      if (textRef.current && !textRef.current.contains(e.target as Node)) {
        setIsEditing(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditing])

  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    fontSize: element.style?.fontSize || 14,
    fontWeight: element.style?.fontWeight || "normal",
    fontStyle: element.style?.fontStyle || "normal",
    textDecoration: element.style?.textDecoration || "none",
    color: element.style?.color || "#000000",
    textAlign: (element.style?.textAlign as any) || "left",
    lineHeight: element.style?.lineHeight || 1.5,
    letterSpacing: element.style?.letterSpacing ? `${element.style.letterSpacing}px` : "normal",
    padding: "4px",
    overflow: "hidden",
    outline: "none",
    userSelect: isEditing ? "text" : "none",
  }

  return (
    <div
      ref={textRef}
      style={style}
      onDoubleClick={handleDoubleClick}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={isEditing ? "text-editing" : ""}
    >
      {element.content}
    </div>
  )
}

