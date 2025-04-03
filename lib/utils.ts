import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import html2canvas from "html2canvas"
import { useEditorStore } from "@/lib/editor-store"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 修改 printDesign 函数，调整打印预览的比例并移除底部尺寸文本

export async function printDesign() {
  try {
    // 创建一个新的打印窗口
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("请允许弹出窗口以打印设计")
      return
    }

    // 获取画布元素
    const canvas = document.querySelector(".canvas") as HTMLElement
    if (!canvas) return

    // 使用html2canvas将画布转换为图像
    const canvasImage = await html2canvas(canvas, {
      scale: 2, // 提高清晰度
      useCORS: true, // 允许跨域图像
      allowTaint: true, // 允许污染画布
      backgroundColor: null, // 允许透明背景，以便我们可以看到自定义背景
      logging: false,
      onclone: (clonedDoc) => {
        // 在克隆的文档中移除所有控制点和选中样式
        const resizeHandles = clonedDoc.querySelectorAll(".resize-handle")
        resizeHandles.forEach((handle) => {
          handle.remove()
        })

        const selectedElements = clonedDoc.querySelectorAll(".selected")
        selectedElements.forEach((element) => {
          element.classList.remove("selected")
        })
      },
    })

    // 获取画布尺寸
    const canvasSize = useEditorStore.getState().canvasSize

    // 设置打印窗口内容
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>打印预览</title>
      <style>
        @page {
          size: ${canvasSize.width}mm ${canvasSize.height}mm;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f5f5f5;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .print-header {
          position: fixed;
          top: 20px;
          right: 20px;
          display: flex;
          gap: 10px;
          z-index: 1000;
        }
        
        .print-button, .close-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .print-button {
          background-color: #0070f3;
          color: white;
        }
        
        .close-button {
          background-color: #f3f4f6;
          color: #111;
        }
        
        .print-container {
          background-color: white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          margin: 40px;
          position: relative;
          width: ${canvasSize.width}mm;
          height: ${canvasSize.height}mm;
        }
        
        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: none;
          }
          .print-header {
            display: none !important;
          }
          .print-container {
            box-shadow: none !important;
            margin: 0 !important;
            position: absolute;
            top: 0;
            left: 0;
            width: ${canvasSize.width}mm !important;
            height: ${canvasSize.height}mm !important;
          }
          img {
            width: 100% !important;
            height: 100% !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-header">
        <button class="print-button" onclick="window.print()">打印</button>
        <button class="close-button" onclick="window.close()">关闭</button>
      </div>
      <div class="print-container">
        <img src="${canvasImage.toDataURL("image/png")}" alt="Print Preview" />
      </div>
      <script>
        // 打印后自动关闭窗口的脚本
        window.onafterprint = function() {
          setTimeout(() => window.close(), 1000);
        };
      </script>
    </body>
    </html>
    `)

    printWindow.document.close()
  } catch (error) {
    console.error("打印失败:", error)
    alert("打印失败，请重试")
  }
}

