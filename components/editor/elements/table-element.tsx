"use client"

import { useEffect, useState } from "react"

interface TableElementProps {
  element: {
    content: string
    width: number
    height: number
    style?: any
  }
}

// 默认表格数据
const DEFAULT_TABLE_DATA = {
  columns: 3,
  rows: 3,
  data: [
    ["列 1", "列 2", "列 3"],
    ["数据 1", "数据 2", "数据 3"],
    ["数据 4", "数据 5", "数据 6"],
  ],
  style: {
    borderWidth: 1,
    borderColor: "#000000",
    headerBgColor: "#f0f0f0",
    cellPadding: 8,
    fontSize: 14,
    headerFontSize: 14,
    headerFontWeight: "bold",
    headerTextAlign: "center",
    cellTextAlign: "left",
  },
}

export default function TableElement({ element }: TableElementProps) {
  const { content, width, height, style: elementStyle } = element
  const [tableData, setTableData] = useState<{
    columns: number
    rows: number
    data: string[][]
    style?: any
  } | null>(null)

  useEffect(() => {
    try {
      const parsed = typeof content === "string" ? JSON.parse(content) : content
      if (parsed && typeof parsed === "object" && parsed.columns && parsed.rows && Array.isArray(parsed.data)) {
        setTableData(parsed)
      } else {
        console.warn("Invalid table data, using default")
        setTableData(DEFAULT_TABLE_DATA)
      }
    } catch (error) {
      console.error("Failed to parse table data:", error)
      setTableData(DEFAULT_TABLE_DATA)
    }
  }, [content])

  if (!tableData) {
    return <div>加载中...</div>
  }

  // 合并样式
  const mergedStyle = {
    ...tableData.style,
    ...elementStyle,
  }

  return (
      <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            backgroundColor: mergedStyle.backgroundColor || "transparent",
          }}
      >
        <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              color: mergedStyle.color || "#000000",
              fontSize: `${mergedStyle.fontSize || 14}px`,
            }}
        >
          <thead>
          <tr>
            {tableData.data[0]?.map((cell, index) => (
                <th
                    key={index}
                    style={{
                      padding: `${mergedStyle.cellPadding || 8}px`,
                      border: `${mergedStyle.borderWidth || 1}px solid ${mergedStyle.borderColor || "#000000"}`,
                      backgroundColor: mergedStyle.headerBgColor || "#f0f0f0",
                      color: mergedStyle.headerColor || mergedStyle.color || "#000000",
                      fontSize: `${mergedStyle.headerFontSize || mergedStyle.fontSize || 14}px`,
                      fontWeight: mergedStyle.headerFontWeight || "bold",
                      textAlign: mergedStyle.headerTextAlign || "center",
                    }}
                >
                  {cell}
                </th>
            ))}
          </tr>
          </thead>
          <tbody>
          {tableData.data.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                    <td
                        key={cellIndex}
                        style={{
                          padding: `${mergedStyle.cellPadding || 8}px`,
                          border: `${mergedStyle.borderWidth || 1}px solid ${mergedStyle.borderColor || "#000000"}`,
                          textAlign: mergedStyle.cellTextAlign || "left",
                        }}
                    >
                      {cell}
                    </td>
                ))}
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  )
}

