"use client"

import { useEffect, useRef, useState } from "react"
import Chart from "chart.js/auto"
import type { ChartData } from "@/types/editor"

interface ChartElementProps {
  element: {
    content: string
    width: number
    height: number
    style?: any
  }
}

// 默认图表数据
const DEFAULT_CHART_DATA: ChartData = {
  type: "bar",
  labels: ["一月", "二月", "三月", "四月", "五月", "六月"],
  datasets: [
    {
      label: "数据集",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
}

export default function ChartElement({ element }: ChartElementProps) {
  const { content, width, height, style } = element
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null)
  const [chartId] = useState(`chart-${Math.random().toString(36).substring(2, 11)}`)

  useEffect(() => {
    let chartData: ChartData = DEFAULT_CHART_DATA

    if (content) {
      try {
        // 尝试解析图表数据
        const parsedData = typeof content === "string" ? JSON.parse(content) : content

        // 验证解析后的数据是否有效
        if (
            parsedData &&
            typeof parsedData === "object" &&
            parsedData.type &&
            Array.isArray(parsedData.labels) &&
            Array.isArray(parsedData.datasets)
        ) {
          chartData = parsedData
        } else {
          console.warn("Parsed chart data is invalid, using default data")
        }
      } catch (error) {
        console.error("Failed to parse chart data:", error)
      }
    }

    // 清理之前的图表实例
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
      chartInstanceRef.current = null
    }

    // 确保canvas元素存在
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        try {
          // 创建新的图表实例
          chartInstanceRef.current = new Chart(ctx, {
            type: chartData.type as any,
            data: {
              labels: chartData.labels,
              datasets: chartData.datasets,
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                },
              },
            },
          })
        } catch (error) {
          console.error("Error creating chart:", error)
        }
      }
    }

    // 组件卸载时清理图表实例
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
    }
  }, [content])

  return (
      <div
          style={{
            width: "100%",
            height: "100%",
            ...style,
          }}
      >
        <canvas id={chartId} ref={canvasRef} />
      </div>
  )
}

