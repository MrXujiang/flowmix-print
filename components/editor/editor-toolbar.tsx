"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useEditorStore } from "@/lib/editor-store"
import { printDesign } from "@/lib/utils"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Copy,
  Trash2,
  ZoomIn,
  ZoomOut,
  Grid,
  Ruler,
  Printer,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function EditorToolbar() {
  const {
    selectedElement,
    updateElement,
    duplicateElement,
    deleteElement,
    zoom,
    setZoom,
    showGrid,
    setShowGrid,
    showRulers,
    setShowRulers,
    canvasBackground, // 添加这一行
    setCanvasBackground, // 添加这一行
  } = useEditorStore()

  // 处理文本样式变化
  const handleTextStyleChange = (property: string, value: any) => {
    if (!selectedElement || selectedElement.type !== "text") return

    updateElement(selectedElement.id, {
      ...selectedElement,
      style: {
        ...selectedElement.style,
        [property]: value,
      },
    })
  }

  // 处理文本对齐方式
  const handleTextAlign = (align: string) => {
    if (!selectedElement || selectedElement.type !== "text") return

    updateElement(selectedElement.id, {
      ...selectedElement,
      style: {
        ...selectedElement.style,
        textAlign: align,
      },
    })
  }

  // 处理缩放
  const handleZoom = (action: "in" | "out" | "reset") => {
    if (action === "in") {
      setZoom(Math.min(zoom + 0.1, 2))
    } else if (action === "out") {
      setZoom(Math.max(zoom - 0.1, 0.5))
    } else {
      setZoom(1)
    }
  }

  // 处理打印
  const handlePrint = () => {
    printDesign()
  }

  // 在 EditorToolbar 组件的顶部添加
  const setActiveTab = (tab: string) => {
    // 找到属性面板的 Tabs 组件并设置活动选项卡
    const tabsElement = document.querySelector('[role="tablist"]') as HTMLElement
    if (tabsElement) {
      const tabTrigger = Array.from(tabsElement.querySelectorAll('[role="tab"]')).find((el) =>
        el.textContent?.includes(tab === "canvas" ? "画布属性" : "元素属性"),
      ) as HTMLElement
      if (tabTrigger) {
        tabTrigger.click()
      }
    }
  }

  return (
    <div className="border-b bg-card p-2 flex items-center gap-2 overflow-x-auto">
      {/* 文本格式工具 - 仅在选中文本元素时显示 */}
      {selectedElement && selectedElement.type === "text" && (
        <>
          <Button
            variant={selectedElement.style?.fontWeight === "bold" ? "default" : "outline"}
            size="icon"
            onClick={() =>
              handleTextStyleChange("fontWeight", selectedElement.style?.fontWeight === "bold" ? "normal" : "bold")
            }
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={selectedElement.style?.fontStyle === "italic" ? "default" : "outline"}
            size="icon"
            onClick={() =>
              handleTextStyleChange("fontStyle", selectedElement.style?.fontStyle === "italic" ? "normal" : "italic")
            }
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={selectedElement.style?.textDecoration === "underline" ? "default" : "outline"}
            size="icon"
            onClick={() =>
              handleTextStyleChange(
                "textDecoration",
                selectedElement.style?.textDecoration === "underline" ? "none" : "underline",
              )
            }
          >
            <Underline className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant={selectedElement.style?.textAlign === "left" ? "default" : "outline"}
            size="icon"
            onClick={() => handleTextAlign("left")}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={selectedElement.style?.textAlign === "center" ? "default" : "outline"}
            size="icon"
            onClick={() => handleTextAlign("center")}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={selectedElement.style?.textAlign === "right" ? "default" : "outline"}
            size="icon"
            onClick={() => handleTextAlign("right")}
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />
        </>
      )}

      {/* 元素操作工具 - 仅在选中元素时显示 */}
      {selectedElement && (
        <>
          <Button variant="outline" size="icon" onClick={() => duplicateElement(selectedElement.id)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => deleteElement(selectedElement.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />
        </>
      )}

      {/* 视图工具 - 始终显示 */}
      <Button variant="outline" size="icon" onClick={() => handleZoom("in")}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleZoom("reset")}>
        {Math.round(zoom * 100)}%
      </Button>
      <Button variant="outline" size="icon" onClick={() => handleZoom("out")}>
        <ZoomOut className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Button
        variant={showGrid ? "default" : "outline"}
        size="icon"
        onClick={() => setShowGrid(!showGrid)}
        title="显示网格"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={showRulers ? "default" : "outline"}
        size="icon"
        onClick={() => setShowRulers(!showRulers)}
        title="显示标尺"
      >
        <Ruler className="h-4 w-4" />
      </Button>

      {/* 添加背景颜色按钮 */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 relative overflow-hidden"
              onClick={() => setActiveTab("canvas")}
              title="背景设置"
            >
              <div
                className="absolute inset-1 rounded-sm"
                style={{
                  backgroundColor: canvasBackground.type === "color" ? canvasBackground.value : undefined,
                  backgroundImage: canvasBackground.type !== "color" ? canvasBackground.value : undefined,
                  backgroundSize: canvasBackground.type === "image" ? "cover" : undefined,
                  backgroundRepeat: canvasBackground.type === "pattern" ? "repeat" : undefined,
                }}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>背景设置</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Separator orientation="vertical" className="h-6" />

      <Button variant="outline" size="icon" onClick={handlePrint} title="打印">
        <Printer className="h-4 w-4" />
      </Button>
    </div>
  )
}

