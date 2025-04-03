"use client"
import { useEditorStore } from "@/lib/editor-store"
import { Button } from "@/components/ui/button"
import { FileDown, Image } from "lucide-react"

export default function EditorFooter() {
  const { exportAsPDF, exportAsImage } = useEditorStore()

  return (
      <div className="border-t bg-card p-4 flex justify-center">
        <div className="flex items-center gap-4">
          {/* 移除了打印按钮 */}
          <Button variant="outline" onClick={exportAsPDF}>
            <FileDown className="h-4 w-4 mr-2" />
            导出PDF
          </Button>
          <Button variant="outline" onClick={exportAsImage}>
            <Image className="h-4 w-4 mr-2" />
            导出图片
          </Button>
        </div>
      </div>
  )
}

