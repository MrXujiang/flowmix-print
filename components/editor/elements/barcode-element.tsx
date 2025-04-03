"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import JsBarcode from "jsbarcode"
import type { Element } from "@/types/editor"

interface BarcodeElementProps {
    element: Element
}

const BarcodeElement: React.FC<BarcodeElementProps> = ({ element }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (canvasRef.current) {
            try {
                // 解析条形码数据
                const barcodeData = element.content || "1234567890"
                const options = element.style || {}

                // 生成条形码
                JsBarcode(canvasRef.current, barcodeData, {
                    format: options.format || "CODE128",
                    width: options.lineWidth || 2,
                    height: options.height || 100,
                    displayValue: options.showText !== false,
                    text: options.text || barcodeData,
                    fontOptions: options.fontOptions || "",
                    font: options.font || "monospace",
                    textAlign: options.textAlign || "center",
                    textPosition: options.textPosition || "bottom",
                    textMargin: options.textMargin || 2,
                    fontSize: options.fontSize || 20,
                    background: options.background || "#ffffff",
                    lineColor: options.lineColor || "#000000",
                    margin: options.margin || 10,
                    marginTop: options.marginTop || undefined,
                    marginBottom: options.marginBottom || undefined,
                    marginLeft: options.marginLeft || undefined,
                    marginRight: options.marginRight || undefined,
                })
            } catch (error) {
                console.error("条形码生成错误:", error)
                // 显示错误信息
                const ctx = canvasRef.current.getContext("2d")
                if (ctx) {
                    ctx.font = "14px Arial"
                    ctx.fillStyle = "red"
                    ctx.fillText("条形码生成错误", 10, 50)
                }
            }
        }
    }, [element.content, element.style])

    return (
        <div
            className="barcode-element"
            style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
            <canvas ref={canvasRef} style={{ maxWidth: "100%", maxHeight: "100%" }} />
        </div>
    )
}

export default BarcodeElement

