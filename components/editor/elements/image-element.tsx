"use client"

import type React from "react"

import { useState } from "react"
import { useEditorStore } from "@/lib/editor-store"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon } from "lucide-react"
import type { Element } from "@/types/editor"

interface ImageElementProps {
  element: Element
}

export default function ImageElement({ element }: ImageElementProps) {
  const { updateElement } = useEditorStore()
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)

    // 创建文件URL
    const imageUrl = URL.createObjectURL(file)

    updateElement(element.id, {
      ...element,
      content: imageUrl,
    })

    setLoading(false)
  }

  // 应用样式
  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: (element.style?.objectFit as any) || "contain",
    opacity: element.style?.opacity || 1,
    borderRadius: element.style?.borderRadius ? `${element.style.borderRadius}px` : "0",
    border: element.style?.borderWidth
      ? `${element.style.borderWidth}px solid ${element.style.borderColor || "#000000"}`
      : "none",
  }

  // 如果已有图片内容，显示图片
  if (element.content) {
    return <img src={element.content || "/placeholder.svg"} alt="Element" style={imageStyle} />
  }

  // 否则显示上传按钮
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30 p-4">
      <ImageIcon className="h-8 w-8 mb-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground mb-2">上传图片</p>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id={`image-upload-${element.id}`}
      />
      <label htmlFor={`image-upload-${element.id}`}>
        <Button variant="outline" size="sm" disabled={loading} asChild>
          <span>
            <Upload className="h-4 w-4 mr-1" />
            选择图片
          </span>
        </Button>
      </label>
    </div>
  )
}

