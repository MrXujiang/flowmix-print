"use client"
import { useEditorStore } from "@/lib/editor-store"
import React from "react"

import { useState, useEffect, useCallback, useRef, memo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  PlusIcon,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import type { ChartData } from "@/types/editor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export default function PropertyPanel() {
  const { selectedElement, updateElement, canvasSize, setCanvasSize, canvasBackground, setCanvasBackground } =
      useEditorStore()
  const [activeTab, setActiveTab] = useState("element")
  const [tableData, setTableData] = useState<{ columns: number; rows: number; data: string[][]; style: any } | null>(
      null,
  )
  const [chartDataState, setChartDataState] = useState<ChartData | null>(null)
  const [editedChartData, setEditedChartData] = useState<ChartData | null>(null)
  const [tableStyle, setTableStyle] = useState<any>(selectedElement?.style || {})
  const [tableDialogOpen, setTableDialogOpen] = useState(false)
  const [dialogTableData, setDialogTableData] = useState<{
    columns: number
    rows: number
    data: string[][]
    style: any
  } | null>(null)

  useEffect(() => {
    if (selectedElement?.type === "table") {
      parseTableData()
      setTableStyle(selectedElement?.style || {})
    }
    if (selectedElement?.type === "chart") {
      parseChartData()
    }
  }, [selectedElement])

  const parseTableData = () => {
    try {
      if (selectedElement?.type === "table" && typeof selectedElement.content === "string") {
        const parsed = JSON.parse(selectedElement.content)
        setTableData(parsed)
      }
    } catch (e) {
      console.error("Failed to parse table data", e)
      // 默认表格数据
      const defaultData = {
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
      setTableData(defaultData)
    }
  }

  // 在 parseChartData 函数中，添加图表数据解析逻辑
  const parseChartData = () => {
    try {
      if (selectedElement?.type === "chart" && typeof selectedElement.content === "string") {
        const parsed = JSON.parse(selectedElement.content)
        setChartDataState(parsed)
        setEditedChartData(parsed)
      }
    } catch (e) {
      console.error("Failed to parse chart data", e)
      // 默认图表数据
      const defaultData = {
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
      setChartDataState(defaultData)
      setEditedChartData(defaultData)
    }
  }

  // 处理位置和尺寸变化
  const handlePositionChange = (property: string, value: number) => {
    if (!selectedElement) return

    updateElement(selectedElement.id, {
      ...selectedElement,
      [property]: value,
    })
  }

  // 处理样式变化
  const handleStyleChange = (property: string, value: any) => {
    if (!selectedElement) return

    updateElement(selectedElement.id, {
      ...selectedElement,
      style: {
        ...selectedElement.style,
        [property]: value,
      },
    })
  }

  // 表格相关函数 - 移到组件级别
  // 处理单元格编辑
  const handleCellChange = useCallback(
      (rowIndex: number, colIndex: number, value: string) => {
        if (!tableData || !selectedElement) return

        // 创建新数据的副本，避免直接修改原始数据
        const newData = JSON.parse(JSON.stringify(tableData.data))

        // 确保行存在
        if (!newData[rowIndex]) {
          newData[rowIndex] = Array(tableData.columns).fill("")
        }

        // 更新单元格值
        newData[rowIndex][colIndex] = value

        // 更新表格数据
        const updatedTableData = {
          ...tableData,
          data: newData,
        }

        setTableData(updatedTableData)

        // 使用防抖来减少更新频率，避免频繁重新渲染
        // 这里我们可以使用一个简单的延迟更新
        const timeoutId = setTimeout(() => {
          // 更新元素内容
          updateElement(selectedElement.id, {
            ...selectedElement,
            content: JSON.stringify(updatedTableData),
          })
        }, 300) // 300ms 延迟

        // 清理函数
        return () => clearTimeout(timeoutId)
      },
      [tableData, selectedElement, updateElement],
  )

  // 添加行
  const addRow = useCallback(() => {
    if (!tableData || !selectedElement) return

    // 创建新数据的副本，避免直接修改原始数据
    const newData = JSON.parse(JSON.stringify(tableData.data))
    newData.push(Array(tableData.columns).fill(""))

    const updatedTableData = {
      ...tableData,
      rows: tableData.rows + 1,
      data: newData,
    }

    // 更新本地状态
    setTableData(updatedTableData)

    // 使用 requestAnimationFrame 延迟更新元素内容，避免立即触发重新渲染
    requestAnimationFrame(() => {
      // 更新元素内容
      updateElement(selectedElement.id, {
        ...selectedElement,
        content: JSON.stringify(updatedTableData),
      })
    })
  }, [tableData, selectedElement, updateElement])

  // 添加列
  const addColumn = useCallback(() => {
    if (!tableData || !selectedElement) return

    // 创建新数据的副本，避免直接修改原始数据
    const newData = tableData.data.map((row) => [...row, ""])

    const updatedTableData = {
      ...tableData,
      columns: tableData.columns + 1,
      data: newData,
    }

    // 更新本地状态
    setTableData(updatedTableData)

    // 使用 requestAnimationFrame 延迟更新元素内容，避免立即触发重新渲染
    requestAnimationFrame(() => {
      // 更新元素内容
      updateElement(selectedElement.id, {
        ...selectedElement,
        content: JSON.stringify(updatedTableData),
      })
    })
  }, [tableData, selectedElement, updateElement])

  // 删除行
  const deleteRow = useCallback(
      (rowIndex: number) => {
        if (!tableData || !selectedElement || tableData.rows <= 2) return

        // 创建新数据的副本，避免直接修改原始数据
        const newData = JSON.parse(JSON.stringify(tableData.data))
        newData.splice(rowIndex, 1)

        const updatedTableData = {
          ...tableData,
          rows: tableData.rows - 1,
          data: newData,
        }

        // 更新本地状态
        setTableData(updatedTableData)

        // 使用 requestAnimationFrame 延迟更新元素内容，避免立即触发重新渲染
        requestAnimationFrame(() => {
          // 更新元素内容
          updateElement(selectedElement.id, {
            ...selectedElement,
            content: JSON.stringify(updatedTableData),
          })
        })
      },
      [tableData, selectedElement, updateElement],
  )

  // 删除列
  const deleteColumn = useCallback(
      (colIndex: number) => {
        if (!tableData || !selectedElement || tableData.columns <= 2) return

        // 创建新数据的副本，避免直接修改原始数据
        const newData = tableData.data.map((row) => {
          const newRow = [...row]
          newRow.splice(colIndex, 1)
          return newRow
        })

        const updatedTableData = {
          ...tableData,
          columns: tableData.columns - 1,
          data: newData,
        }

        // 更新本地状态
        setTableData(updatedTableData)

        // 使用 requestAnimationFrame 延迟更新元素内容，避免立即触发重新渲染
        requestAnimationFrame(() => {
          // 更新元素内容
          updateElement(selectedElement.id, {
            ...selectedElement,
            content: JSON.stringify(updatedTableData),
          })
        })
      },
      [tableData, selectedElement, updateElement],
  )

  // 移动行
  const moveRow = useCallback(
      (fromIndex: number, direction: "up" | "down") => {
        if (!tableData || !selectedElement) return
        if (direction === "up" && fromIndex <= 1) return // 不能移动表头和第一行
        if (direction === "down" && fromIndex >= tableData.data.length - 1) return

        const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1

        // 创建新数据的副本，避免直接修改原始数据
        const newData = JSON.parse(JSON.stringify(tableData.data))
        const temp = newData[fromIndex]
        newData[fromIndex] = newData[toIndex]
        newData[toIndex] = temp

        const updatedTableData = {
          ...tableData,
          data: newData,
        }

        // 更新本地状态
        setTableData(updatedTableData)

        // 使用 requestAnimationFrame 延迟更新元素内容，避免立即触发重新渲染
        requestAnimationFrame(() => {
          // 更新元素内容
          updateElement(selectedElement.id, {
            ...selectedElement,
            content: JSON.stringify(updatedTableData),
          })
        })
      },
      [tableData, selectedElement, updateElement],
  )

  // 复制行
  const duplicateRow = useCallback(
      (rowIndex: number) => {
        if (!tableData || !selectedElement) return

        // 创建新数据的副本，避免直接修改原始数据
        const newData = JSON.parse(JSON.stringify(tableData.data))
        const rowToDuplicate = [...newData[rowIndex]]
        newData.splice(rowIndex + 1, 0, rowToDuplicate)

        const updatedTableData = {
          ...tableData,
          rows: tableData.rows + 1,
          data: newData,
        }

        // 更新本地状态
        setTableData(updatedTableData)

        // 使用 requestAnimationFrame 延迟更新元素内容，避免立即触发重新渲染
        requestAnimationFrame(() => {
          // 更新元素内容
          updateElement(selectedElement.id, {
            ...selectedElement,
            content: JSON.stringify(updatedTableData),
          })
        })
      },
      [tableData, selectedElement, updateElement],
  )

  // 更新表格样式
  const updateTableStyle = useCallback(
      (newStyle: any) => {
        if (!selectedElement) return

        const updatedStyle = { ...tableStyle, ...newStyle }
        setTableStyle(updatedStyle)
        updateElement(selectedElement.id, {
          ...selectedElement,
          style: updatedStyle,
        })
      },
      [tableStyle, selectedElement, updateElement],
  )

  // 弹窗相关函数
  const openTableDialog = useCallback(() => {
    if (tableData) {
      // 创建深拷贝以避免直接修改原始数据
      setDialogTableData(JSON.parse(JSON.stringify(tableData)))
      setTableDialogOpen(true)
    }
  }, [tableData])

  // 添加表格编辑对话框 - 使用 memo 优化渲染
  const TableEditDialog = memo(
      ({
         tableDialogOpen,
         setTableDialogOpen,
         dialogTableData,
         onSave,
       }: {
        tableDialogOpen: boolean
        setTableDialogOpen: (open: boolean) => void
        dialogTableData: { columns: number; rows: number; data: string[][]; style: any } | null
        onSave: (data: { columns: number; rows: number; data: string[][]; style: any }) => void
      }) => {
        // 使用 useRef 存储编辑中的数据，避免每次编辑都触发重新渲染
        const editingDataRef = useRef<{ columns: number; rows: number; data: string[][]; style: any } | null>(null)

        // 初始化编辑数据
        if (dialogTableData && !editingDataRef.current) {
          editingDataRef.current = JSON.parse(JSON.stringify(dialogTableData))
        }

        // 弹窗中添加行
        const dialogAddRow = () => {
          if (!editingDataRef.current) return

          const currentData = editingDataRef.current
          // 创建新数据的副本
          const newData = [...currentData.data]
          newData.push(Array(currentData.columns).fill(""))

          // 更新引用中的数据
          editingDataRef.current = {
            ...currentData,
            rows: currentData.rows + 1,
            data: newData,
          }

          // 强制重新渲染
          forceUpdate()
        }

        // 弹窗中添加列
        const dialogAddColumn = () => {
          if (!editingDataRef.current) return

          const currentData = editingDataRef.current
          // 创建新数据的副本
          const newData = currentData.data.map((row) => [...row, ""])

          // 更新引用中的数据
          editingDataRef.current = {
            ...currentData,
            columns: currentData.columns + 1,
            data: newData,
          }

          // 强制重新渲染
          forceUpdate()
        }

        // 弹窗中删除行
        const dialogDeleteRow = (rowIndex: number) => {
          if (!editingDataRef.current || editingDataRef.current.rows <= 2) return

          const currentData = editingDataRef.current
          // 创建新数据的副本
          const newData = [...currentData.data]
          newData.splice(rowIndex, 1)

          // 更新引用中的数据
          editingDataRef.current = {
            ...currentData,
            rows: currentData.rows - 1,
            data: newData,
          }

          // 强制重新渲染
          forceUpdate()
        }

        // 弹窗中删除列
        const dialogDeleteColumn = (colIndex: number) => {
          if (!editingDataRef.current || editingDataRef.current.columns <= 2) return

          const currentData = editingDataRef.current
          // 创建新数据的副本
          const newData = currentData.data.map((row) => {
            const newRow = [...row]
            newRow.splice(colIndex, 1)
            return newRow
          })

          // 更新引用中的数据
          editingDataRef.current = {
            ...currentData,
            columns: currentData.columns - 1,
            data: newData,
          }

          // 强制重新渲染
          forceUpdate()
        }

        // 弹窗中移动行
        const dialogMoveRow = (fromIndex: number, direction: "up" | "down") => {
          if (!editingDataRef.current) return

          const currentData = editingDataRef.current
          if (direction === "up" && fromIndex <= 1) return // 不能移动表头和第一行
          if (direction === "down" && fromIndex >= currentData.data.length - 1) return

          const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1

          // 创建新数据的副本
          const newData = [...currentData.data]
          const temp = newData[fromIndex]
          newData[fromIndex] = newData[toIndex]
          newData[toIndex] = temp

          // 更新引用中的数据
          editingDataRef.current = {
            ...currentData,
            data: newData,
          }

          // 强制重新渲染
          forceUpdate()
        }

        // 弹窗中复制行
        const dialogDuplicateRow = (rowIndex: number) => {
          if (!editingDataRef.current) return

          const currentData = editingDataRef.current
          // 创建新数据的副本
          const newData = [...currentData.data]
          const rowToDuplicate = [...newData[rowIndex]]
          newData.splice(rowIndex + 1, 0, rowToDuplicate)

          // 更新引用中的数据
          editingDataRef.current = {
            ...currentData,
            rows: currentData.rows + 1,
            data: newData,
          }

          // 强制重新渲染
          forceUpdate()
        }

        // 弹窗中编辑单元格 - 不触发重新渲染
        const dialogHandleCellChange = (rowIndex: number, colIndex: number, value: string) => {
          if (!editingDataRef.current) return

          // 直接修改引用中的数据，不触发重新渲染
          editingDataRef.current.data[rowIndex][colIndex] = value
        }

        // 保存弹窗中的更改
        const saveDialogChanges = () => {
          if (!editingDataRef.current) return

          // 调用父组件的保存函数
          onSave(editingDataRef.current)

          // 清空编辑数据
          editingDataRef.current = null
        }

        // 使用 useState 创建一个强制更新函数
        const [, setForceUpdate] = React.useState({})
        const forceUpdate = React.useCallback(() => setForceUpdate({}), [])

        // 当弹窗关闭时重置编辑数据
        React.useEffect(() => {
          if (!tableDialogOpen) {
            editingDataRef.current = null
          } else if (dialogTableData && !editingDataRef.current) {
            editingDataRef.current = JSON.parse(JSON.stringify(dialogTableData))
          }
        }, [tableDialogOpen, dialogTableData])

        if (!editingDataRef.current) return null

        const currentData = editingDataRef.current

        return (
            <Dialog
                open={tableDialogOpen}
                onOpenChange={(open) => {
                  if (!open) {
                    // 当弹窗关闭时保存更改
                    saveDialogChanges()
                    setTableDialogOpen(false)
                  }
                }}
            >
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>编辑表格数据</DialogTitle>
                  <DialogDescription>添加、编辑或删除表格中的行和列</DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col">
                  {/* 表头编辑 */}
                  <div className="border-b pb-4 mb-4">
                    <Label className="mb-2 block font-bold">表头</Label>
                    <div className="flex flex-wrap gap-2">
                      {currentData.data[0]?.map((cell, colIndex) => (
                          <div key={`dialog-header-${colIndex}`} className="relative flex-1 min-w-[150px]">
                            <Input
                                defaultValue={cell}
                                onChange={(e) => dialogHandleCellChange(0, colIndex, e.target.value)}
                                className="pr-8"
                                placeholder={`列 ${colIndex + 1}`}
                            />
                            {currentData.columns > 2 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full text-red-500 hover:text-red-700 hover:bg-transparent"
                                    onClick={() => dialogDeleteColumn(colIndex)}
                                    title="删除列"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                          </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={dialogAddColumn}>
                        <PlusIcon className="h-4 w-4 mr-1" />
                        添加列
                      </Button>
                    </div>
                  </div>

                  {/* 表格数据编辑 */}
                  <div className="flex-1 overflow-auto">
                    <Label className="mb-2 block font-bold">表格数据</Label>
                    {currentData.data.slice(1).map((row, rowIndex) => (
                        <div key={`dialog-row-${rowIndex}`} className="border rounded p-2 mb-3 relative">
                          <div className="flex justify-between items-center mb-2">
                            <Label className="font-medium">行 {rowIndex + 1}</Label>
                            <div className="flex gap-1">
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => dialogMoveRow(rowIndex + 1, "up")}
                                  disabled={rowIndex === 0}
                                  title="上移"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => dialogMoveRow(rowIndex + 1, "down")}
                                  disabled={rowIndex === currentData.data.length - 2}
                                  title="下移"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => dialogDuplicateRow(rowIndex + 1)}
                                  title="复制行"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              {currentData.rows > 2 && (
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-red-500 hover:text-red-700"
                                      onClick={() => dialogDeleteRow(rowIndex + 1)}
                                      title="删除行"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                              )}
                            </div>
                          </div>
                          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${currentData.columns}, 1fr)` }}>
                            {row.map((cell, colIndex) => (
                                <Input
                                    key={`dialog-cell-${rowIndex + 1}-${colIndex}`}
                                    defaultValue={cell}
                                    onChange={(e) => dialogHandleCellChange(rowIndex + 1, colIndex, e.target.value)}
                                    placeholder={`单元格 ${rowIndex + 1}-${colIndex + 1}`}
                                />
                            ))}
                          </div>
                        </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t mt-4">
                    <Button variant="outline" className="w-full" onClick={dialogAddRow}>
                      <PlusIcon className="h-4 w-4 mr-1" />
                      添加行
                    </Button>
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button onClick={saveDialogChanges}>完成</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        )
      },
  )

  // 弹窗中添加行
  const dialogAddRow = useCallback(() => {
    setDialogTableData((prev) => {
      if (!prev) return prev

      // 创建新数据的副本
      const newData = [...prev.data]
      newData.push(Array(prev.columns).fill(""))

      // 返回更新后的数据
      return {
        ...prev,
        rows: prev.rows + 1,
        data: newData,
      }
    })
  }, [])

  // 弹窗中添加列
  const dialogAddColumn = useCallback(() => {
    setDialogTableData((prev) => {
      if (!prev) return prev

      // 创建新数据的副本
      const newData = prev.data.map((row) => [...row, ""])

      // 返回更新后的数据
      return {
        ...prev,
        columns: prev.columns + 1,
        data: newData,
      }
    })
  }, [])

  // 弹窗中删除行
  const dialogDeleteRow = useCallback((rowIndex: number) => {
    setDialogTableData((prev) => {
      if (!prev || prev.rows <= 2) return prev

      // 创建新数据的副本
      const newData = [...prev.data]
      newData.splice(rowIndex, 1)

      // 返回更新后的数据
      return {
        ...prev,
        rows: prev.rows - 1,
        data: newData,
      }
    })
  }, [])

  // 弹窗中删除列
  const dialogDeleteColumn = useCallback((colIndex: number) => {
    setDialogTableData((prev) => {
      if (!prev || prev.columns <= 2) return prev

      // 创建新数据的副本
      const newData = prev.data.map((row) => {
        const newRow = [...row]
        newRow.splice(colIndex, 1)
        return newRow
      })

      // 返回更新后的数据
      return {
        ...prev,
        columns: prev.columns - 1,
        data: newData,
      }
    })
  }, [])

  // 弹窗中移动行
  const dialogMoveRow = useCallback((fromIndex: number, direction: "up" | "down") => {
    setDialogTableData((prev) => {
      if (!prev) return prev
      if (direction === "up" && fromIndex <= 1) return prev // 不能移动表头和第一行
      if (direction === "down" && fromIndex >= prev.data.length - 1) return prev

      const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1

      // 创建新数据的副本
      const newData = [...prev.data]
      const temp = newData[fromIndex]
      newData[fromIndex] = newData[toIndex]
      newData[toIndex] = temp

      // 返回更新后的数据
      return {
        ...prev,
        data: newData,
      }
    })
  }, [])

  // 弹窗中复制行
  const dialogDuplicateRow = useCallback((rowIndex: number) => {
    setDialogTableData((prev) => {
      if (!prev) return prev

      // 创建新数据的副本
      const newData = [...prev.data]
      const rowToDuplicate = [...newData[rowIndex]]
      newData.splice(rowIndex + 1, 0, rowToDuplicate)

      // 返回更新后的数据
      return {
        ...prev,
        rows: prev.rows + 1,
        data: newData,
      }
    })
  }, [])

  // 弹窗中编辑单元格
  const dialogHandleCellChange = useCallback((rowIndex: number, colIndex: number, value: string) => {
    setDialogTableData((prev) => {
      if (!prev) return prev

      // 创建新数据的副本
      const newData = [...prev.data]

      // 确保行存在
      if (!newData[rowIndex]) {
        newData[rowIndex] = Array(prev.columns).fill("")
      }

      // 更新单元格值
      newData[rowIndex][colIndex] = value

      // 返回更新后的数据
      return {
        ...prev,
        data: newData,
      }
    })
  }, [])

  // 保存弹窗中的更改
  const saveDialogChanges = useCallback(() => {
    if (!dialogTableData || !selectedElement) return

    // 更新本地表格数据
    setTableData(dialogTableData)

    // 更新元素内容
    updateElement(selectedElement.id, {
      ...selectedElement,
      content: JSON.stringify(dialogTableData),
    })

    // 关闭弹窗
    setTableDialogOpen(false)
  }, [dialogTableData, selectedElement, updateElement])

  // 渲染画布属性
  const renderCanvasProperties = () => (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="canvas-width">画布宽度 (mm)</Label>
          <Input
              id="canvas-width"
              type="number"
              value={canvasSize.width}
              onChange={(e) => setCanvasSize({ ...canvasSize, width: Number(e.target.value) || 210 })}
              min={1}
              max={5000}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="canvas-height">画布高度 (mm)</Label>
          <Input
              id="canvas-height"
              type="number"
              value={canvasSize.height}
              onChange={(e) => setCanvasSize({ ...canvasSize, height: Number(e.target.value) || 297 })}
              min={1}
              max={5000}
          />
        </div>

        <div className="space-y-2">
          <Label>预设尺寸</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => setCanvasSize({ width: 210, height: 297, unit: "mm" })}>
              A4
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCanvasSize({ width: 148, height: 210, unit: "mm" })}>
              A5
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCanvasSize({ width: 105, height: 148, unit: "mm" })}>
              A6
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCanvasSize({ width: 216, height: 279, unit: "mm" })}>
              Letter
            </Button>
          </div>
        </div>

        {/* 添加背景设置 */}
        <Accordion type="single" collapsible defaultValue="background">
          <AccordionItem value="background">
            <AccordionTrigger>背景设置</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="background-type">背景类型</Label>
                  <Select
                      value={canvasBackground.type}
                      onValueChange={(value) => setCanvasBackground({ type: value as "color" | "image" | "pattern" })}
                  >
                    <SelectTrigger id="background-type">
                      <SelectValue placeholder="选择背景类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="color">纯色背景</SelectItem>
                      <SelectItem value="image">图片背景</SelectItem>
                      <SelectItem value="pattern">图案背景</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {canvasBackground.type === "color" && (
                    <div className="space-y-2">
                      <Label htmlFor="background-color">背景颜色</Label>
                      <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded border cursor-pointer"
                            style={{ backgroundColor: canvasBackground.value }}
                        >
                          <Input
                              id="background-color"
                              type="color"
                              value={canvasBackground.value}
                              onChange={(e) => setCanvasBackground({ value: e.target.value })}
                              className="opacity-0 w-full h-full cursor-pointer"
                          />
                        </div>
                        <Input
                            type="text"
                            value={canvasBackground.value}
                            onChange={(e) => setCanvasBackground({ value: e.target.value })}
                            className="flex-1"
                        />
                      </div>

                      {/* 添加预设颜色选择器 */}
                      <div className="mt-2">
                        <Label className="mb-2 block">预设颜色</Label>
                        <div className="grid grid-cols-8 gap-2">
                          {[
                            "#ffffff",
                            "#f8f9fa",
                            "#e9ecef",
                            "#dee2e6",
                            "#f8f0e3",
                            "#eaf4f4",
                            "#f0f4ef",
                            "#f9f9f9",
                            "#ffefd5",
                            "#f0fff0",
                            "#f0f8ff",
                            "#f5f5f5",
                            "#fffafa",
                            "#f0ffff",
                            "#f5fffa",
                            "#f0f0f0",
                          ].map((color) => (
                              <div
                                  key={color}
                                  className={`w-6 h-6 rounded-full border cursor-pointer hover:scale-110 transition-transform ${
                                      canvasBackground.value === color ? "ring-2 ring-primary ring-offset-2" : ""
                                  }`}
                                  style={{ backgroundColor: color }}
                                  onClick={() => setCanvasBackground({ value: color })}
                                  title={color}
                              />
                          ))}
                        </div>
                      </div>
                    </div>
                )}

                {canvasBackground.type === "image" && (
                    <div className="space-y-2">
                      <Label htmlFor="background-image">背景图片</Label>
                      <div className="flex flex-col gap-2">
                        <Input
                            id="background-image"
                            type="text"
                            placeholder="输入图片URL"
                            value={canvasBackground.value}
                            onChange={(e) => setCanvasBackground({ value: e.target.value })}
                        />
                        <div className="flex items-center justify-between">
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const input = document.createElement("input")
                                input.type = "file"
                                input.accept = "image/*"
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0]
                                  if (file) {
                                    const reader = new FileReader()
                                    reader.onload = (event) => {
                                      setCanvasBackground({ value: event.target?.result as string })
                                    }
                                    reader.readAsDataURL(file)
                                  }
                                }
                                input.click()
                              }}
                          >
                            上传图片
                          </Button>
                          {canvasBackground.value && (
                              <Button variant="outline" size="sm" onClick={() => setCanvasBackground({ value: "" })}>
                                清除图片
                              </Button>
                          )}
                        </div>
                        {canvasBackground.value && (
                            <div className="mt-2 border rounded p-2">
                              <img
                                  src={canvasBackground.value || "/placeholder.svg"}
                                  alt="背景预览"
                                  className="max-w-full h-auto"
                                  style={{ maxHeight: "100px" }}
                              />
                            </div>
                        )}

                        {/* 添加预设背景图片库 */}
                        <div className="mt-4">
                          <Label className="mb-2 block">预设背景</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              {
                                name: "纸张纹理",
                                url: "https://images.unsplash.com/photo-1587653263995-422546a7a559?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                              },
                              {
                                name: "大理石",
                                url: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                              },
                              {
                                name: "木纹",
                                url: "https://images.unsplash.com/photo-1595514535215-8a5b0fad470f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                              },
                              {
                                name: "水彩",
                                url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                              },
                              {
                                name: "渐变",
                                url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                              },
                              {
                                name: "几何",
                                url: "https://images.unsplash.com/photo-1550684848-86a5d8727436?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                              },
                            ].map((image) => (
                                <div
                                    key={image.name}
                                    className={`border rounded p-1 cursor-pointer hover:border-primary ${
                                        canvasBackground.value === image.url ? "border-primary" : ""
                                    }`}
                                    onClick={() => setCanvasBackground({ value: image.url })}
                                >
                                  <div className="aspect-video overflow-hidden rounded">
                                    <img
                                        src={image.url || "/placeholder.svg"}
                                        alt={image.name}
                                        className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="text-xs text-center mt-1">{image.name}</div>
                                </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                )}

                {canvasBackground.type === "pattern" && (
                    <div className="space-y-2">
                      <Label>背景图案</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { name: "点状", value: "radial-gradient(#00000010 1px, transparent 0) 0 0 / 10px 10px" },
                          {
                            name: "网格",
                            value:
                                "linear-gradient(#00000010 1px, transparent 0) 0 0 / 10px 10px, linear-gradient(90deg, #00000010 1px, transparent 0) 0 0 / 10px 10px",
                          },
                          {
                            name: "斜线",
                            value:
                                "repeating-linear-gradient(45deg, #00000010, #00000010 1px, transparent 1px, transparent 10px)",
                          },
                          {
                            name: "交叉",
                            value:
                                "repeating-linear-gradient(45deg, #00000010, #00000010 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, #00000010, #00000010 1px, transparent 1px, transparent 10px)",
                          },
                          {
                            name: "波浪",
                            value: "repeating-radial-gradient(#00000010, #00000010 1px, transparent 1px, transparent 10px)",
                          },
                          {
                            name: "蜂巢",
                            value:
                                "radial-gradient(#00000010 2px, transparent 0) 0 0 / 16px 16px, radial-gradient(#00000010 2px, transparent 0) 8px 8px / 16px 16px",
                          },
                        ].map((pattern) => (
                            <div
                                key={pattern.name}
                                className={`border rounded p-2 cursor-pointer hover:border-primary ${
                                    canvasBackground.value === pattern.value ? "border-primary bg-primary/10" : ""
                                }`}
                                style={{ backgroundImage: pattern.value }}
                                onClick={() => setCanvasBackground({ value: pattern.value })}
                            >
                              <div className="h-12 flex items-end justify-center">
                                <span className="text-xs bg-background/80 px-1 rounded">{pattern.name}</span>
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="background-opacity">背景不透明度</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                        id="background-opacity"
                        value={[canvasBackground.opacity]}
                        min={0.1}
                        max={1}
                        step={0.1}
                        onValueChange={(value) => setCanvasBackground({ opacity: value[0] })}
                    />
                    <span className="w-12 text-center">{Math.round(canvasBackground.opacity * 100)}%</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  )

  // 渲染元素通用属性
  const renderCommonProperties = () => (
      <div className="space-y-4">
        <Accordion type="single" collapsible defaultValue="position">
          <AccordionItem value="position">
            <AccordionTrigger>位置和尺寸</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="element-x">X 坐标</Label>
                  <Input
                      id="element-x"
                      type="number"
                      value={Math.round(selectedElement?.x || 0)}
                      onChange={(e) => handlePositionChange("x", Number(e.target.value) || 0)}
                      min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="element-y">Y 坐标</Label>
                  <Input
                      id="element-y"
                      type="number"
                      value={Math.round(selectedElement?.y || 0)}
                      onChange={(e) => handlePositionChange("y", Number(e.target.value) || 0)}
                      min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="element-width">宽度</Label>
                  <Input
                      id="element-width"
                      type="number"
                      value={Math.round(selectedElement?.width || 0)}
                      onChange={(e) => handlePositionChange("width", Number(e.target.value) || 10)}
                      min={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="element-height">高度</Label>
                  <Input
                      id="element-height"
                      type="number"
                      value={Math.round(selectedElement?.height || 0)}
                      onChange={(e) => handlePositionChange("height", Number(e.target.value) || 10)}
                      min={10}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  )

  // 渲染文本特有属性
  const renderTextProperties = () => (
      <Accordion type="single" collapsible defaultValue="text">
        <AccordionItem value="text">
          <AccordionTrigger>文本样式</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-font-size">字体大小</Label>
                <div className="flex items-center gap-2">
                  <Slider
                      id="text-font-size"
                      value={[selectedElement?.style?.fontSize || 14]}
                      min={8}
                      max={72}
                      step={1}
                      onValueChange={(value) => handleStyleChange("fontSize", value[0])}
                  />
                  <span className="w-12 text-center">{selectedElement?.style?.fontSize || 14}px</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>字体样式</Label>
                <div className="flex gap-2">
                  <Button
                      variant={selectedElement?.style?.fontWeight === "bold" ? "default" : "outline"}
                      size="icon"
                      onClick={() =>
                          handleStyleChange("fontWeight", selectedElement?.style?.fontWeight === "bold" ? "normal" : "bold")
                      }
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                      variant={selectedElement?.style?.fontStyle === "italic" ? "default" : "outline"}
                      size="icon"
                      onClick={() =>
                          handleStyleChange("fontStyle", selectedElement?.style?.fontStyle === "italic" ? "normal" : "italic")
                      }
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                      variant={selectedElement?.style?.textDecoration === "underline" ? "default" : "outline"}
                      size="icon"
                      onClick={() =>
                          handleStyleChange(
                              "textDecoration",
                              selectedElement?.style?.textDecoration === "underline" ? "none" : "underline",
                          )
                      }
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text-color">字体颜色</Label>
                <div className="flex items-center gap-2">
                  <div
                      className="w-8 h-8 rounded border cursor-pointer"
                      style={{ backgroundColor: selectedElement?.style?.color || "#000000" }}
                  >
                    <Input
                        id="text-color"
                        type="color"
                        value={selectedElement?.style?.color || "#000000"}
                        onChange={(e) => handleStyleChange("color", e.target.value)}
                        className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <Input
                      type="text"
                      value={selectedElement?.style?.color || "#000000"}
                      onChange={(e) => handleStyleChange("color", e.target.value)}
                      className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>对齐方式</Label>
                <div className="flex gap-2">
                  <Button
                      variant={selectedElement?.style?.textAlign === "left" ? "default" : "outline"}
                      size="icon"
                      onClick={() => handleStyleChange("textAlign", "left")}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                      variant={selectedElement?.style?.textAlign === "center" ? "default" : "outline"}
                      size="icon"
                      onClick={() => handleStyleChange("textAlign", "center")}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                      variant={selectedElement?.style?.textAlign === "right" ? "default" : "outline"}
                      size="icon"
                      onClick={() => handleStyleChange("textAlign", "right")}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text-line-height">行高</Label>
                <div className="flex items-center gap-2">
                  <Slider
                      id="text-line-height"
                      value={[selectedElement?.style?.lineHeight || 1.5]}
                      min={1}
                      max={3}
                      step={0.1}
                      onValueChange={(value) => handleStyleChange("lineHeight", value[0])}
                  />
                  <span className="w-12 text-center">{selectedElement?.style?.lineHeight || 1.5}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text-letter-spacing">字间距</Label>
                <div className="flex items-center gap-2">
                  <Slider
                      id="text-letter-spacing"
                      value={[selectedElement?.style?.letterSpacing || 0]}
                      min={-2}
                      max={10}
                      step={0.5}
                      onValueChange={(value) => handleStyleChange("letterSpacing", value[0])}
                  />
                  <span className="w-12 text-center">{selectedElement?.style?.letterSpacing || 0}px</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
  )

  // 渲染形状特有属性
  const renderShapeProperties = () => (
      <Accordion type="single" collapsible defaultValue="shape">
        <AccordionItem value="shape">
          <AccordionTrigger>形状样式</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shape-fill">填充颜色</Label>
                <div className="flex items-center gap-2">
                  <div
                      className="w-8 h-8 rounded border cursor-pointer"
                      style={{ backgroundColor: selectedElement?.style?.fill || "#ffffff" }}
                  >
                    <Input
                        id="shape-fill"
                        type="color"
                        value={selectedElement?.style?.fill || "#ffffff"}
                        onChange={(e) => handleStyleChange("fill", e.target.value)}
                        className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <Input
                      type="text"
                      value={selectedElement?.style?.fill || "#ffffff"}
                      onChange={(e) => handleStyleChange("fill", e.target.value)}
                      className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shape-stroke">边框颜色</Label>
                <div className="flex items-center gap-2">
                  <div
                      className="w-8 h-8 rounded border cursor-pointer"
                      style={{ backgroundColor: selectedElement?.style?.stroke || "#000000" }}
                  >
                    <Input
                        id="shape-stroke"
                        type="color"
                        value={selectedElement?.style?.stroke || "#000000"}
                        onChange={(e) => handleStyleChange("stroke", e.target.value)}
                        className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <Input
                      type="text"
                      value={selectedElement?.style?.stroke || "#000000"}
                      onChange={(e) => handleStyleChange("stroke", e.target.value)}
                      className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shape-stroke-width">边框宽度</Label>
                <div className="flex items-center gap-2">
                  <Slider
                      id="shape-stroke-width"
                      value={[selectedElement?.style?.strokeWidth || 1]}
                      min={0}
                      max={10}
                      step={0.5}
                      onValueChange={(value) => handleStyleChange("strokeWidth", value[0])}
                  />
                  <span className="w-12 text-center">{selectedElement?.style?.strokeWidth || 1}px</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shape-opacity">不透明度</Label>
                <div className="flex items-center gap-2">
                  <Slider
                      id="shape-opacity"
                      value={[selectedElement?.style?.opacity || 1]}
                      min={0.1}
                      max={1}
                      step={0.1}
                      onValueChange={(value) => handleStyleChange("opacity", value[0])}
                  />
                  <span className="w-12 text-center">{Math.round((selectedElement?.style?.opacity || 1) * 100)}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shape-radius">圆角</Label>
                <div className="flex items-center gap-2">
                  <Slider
                      id="shape-radius"
                      value={[selectedElement?.style?.borderRadius || 0]}
                      min={0}
                      max={50}
                      step={1}
                      onValueChange={(value) => handleStyleChange("borderRadius", value[0])}
                  />
                  <span className="w-12 text-center">{selectedElement?.style?.borderRadius || 0}px</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
  )

  // 渲染图标特有属性
  const renderIconProperties = () => (
      <Accordion type="single" collapsible defaultValue="icon">
        <AccordionItem value="icon">
          <AccordionTrigger>图标样式</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="icon-fill">图标颜色</Label>
                <div className="flex items-center gap-2">
                  <div
                      className="w-8 h-8 rounded border cursor-pointer"
                      style={{ backgroundColor: selectedElement?.style?.fill || "#000000" }}
                  >
                    <Input
                        id="icon-fill"
                        type="color"
                        value={selectedElement?.style?.fill || "#000000"}
                        onChange={(e) => handleStyleChange("fill", e.target.value)}
                        className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <Input
                      type="text"
                      value={selectedElement?.style?.fill || "#000000"}
                      onChange={(e) => handleStyleChange("fill", e.target.value)}
                      className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon-opacity">不透明度</Label>
                <div className="flex items-center gap-2">
                  <Slider
                      id="icon-opacity"
                      value={[selectedElement?.style?.opacity || 1]}
                      min={0.1}
                      max={1}
                      step={0.1}
                      onValueChange={(value) => handleStyleChange("opacity", value[0])}
                  />
                  <span className="w-12 text-center">{Math.round((selectedElement?.style?.opacity || 1) * 100)}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon-rotation">旋转角度</Label>
                <div className="flex items-center gap-2">
                  <Slider
                      id="icon-rotation"
                      value={[selectedElement?.style?.rotation || 0]}
                      min={0}
                      max={360}
                      step={15}
                      onValueChange={(value) => handleStyleChange("rotation", value[0])}
                  />
                  <span className="w-12 text-center">{selectedElement?.style?.rotation || 0}°</span>
                </div>
              </div>

              {/* 新增图标选择功能 */}
              <div className="space-y-2">
                <Label>选择图标</Label>
                <Tabs defaultValue="common">
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="common">常用</TabsTrigger>
                    <TabsTrigger value="arrows">箭头</TabsTrigger>
                    <TabsTrigger value="media">媒体</TabsTrigger>
                    <TabsTrigger value="other">其他</TabsTrigger>
                  </TabsList>

                  <TabsContent value="common" className="mt-2">
                    <ScrollArea className="h-[200px] border rounded p-2">
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          "star",
                          "heart",
                          "check",
                          "info",
                          "alert",
                          "bell",
                          "calendar",
                          "clock",
                          "mail",
                          "phone",
                          "user",
                          "users",
                          "settings",
                          "home",
                          "file",
                          "folder",
                          "search",
                          "cart",
                          "dollar",
                          "tag",
                        ].map((iconName) => (
                            <div
                                key={iconName}
                                className={`p-2 border rounded flex items-center justify-center cursor-pointer hover:bg-accent ${selectedElement?.content === iconName ? "bg-primary text-primary-foreground" : ""}`}
                                onClick={() =>
                                    updateElement(selectedElement.id, {
                                      ...selectedElement,
                                      content: iconName,
                                    })
                                }
                            >
                              <div className="text-lg">{getIconPreview(iconName)}</div>
                            </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="arrows" className="mt-2">
                    <ScrollArea className="h-[200px] border rounded p-2">
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          "arrowup",
                          "arrowdown",
                          "arrowleft",
                          "arrowright",
                          "up",
                          "down",
                          "left",
                          "right",
                          "navigation",
                          "move",
                          "refresh",
                          "rotatecw",
                          "rotateccw",
                          "maximize",
                          "minimize",
                          "external",
                          "upload",
                          "download",
                          "share",
                          "link",
                        ].map((iconName) => (
                            <div
                                key={iconName}
                                className={`p-2 border rounded flex items-center justify-center cursor-pointer hover:bg-accent ${selectedElement?.content === iconName ? "bg-primary text-primary-foreground" : ""}`}
                                onClick={() =>
                                    updateElement(selectedElement.id, {
                                      ...selectedElement,
                                      content: iconName,
                                    })
                                }
                            >
                              <div className="text-lg">{getIconPreview(iconName)}</div>
                            </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="media" className="mt-2">
                    <ScrollArea className="h-[200px] border rounded p-2">
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          "camera",
                          "music",
                          "video",
                          "headphones",
                          "smartphone",
                          "tablet",
                          "laptop",
                          "monitor",
                          "printer",
                          "wifi",
                          "bluetooth",
                          "image",
                          "play",
                          "pause",
                          "volume",
                          "mic",
                          "speaker",
                          "tv",
                          "youtube",
                          "instagram",
                        ].map((iconName) => (
                            <div
                                key={iconName}
                                className={`p-2 border rounded flex items-center justify-center cursor-pointer hover:bg-accent ${selectedElement?.content === iconName ? "bg-primary text-primary-foreground" : ""}`}
                                onClick={() =>
                                    updateElement(selectedElement.id, {
                                      ...selectedElement,
                                      content: iconName,
                                    })
                                }
                            >
                              <div className="text-lg">{getIconPreview(iconName)}</div>
                            </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="other" className="mt-2">
                    <ScrollArea className="h-[200px] border rounded p-2">
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          "sun",
                          "moon",
                          "cloud",
                          "rain",
                          "snow",
                          "wind",
                          "umbrella",
                          "coffee",
                          "utensils",
                          "bag",
                          "briefcase",
                          "book",
                          "scissors",
                          "trash",
                          "save",
                          "award",
                          "gift",
                          "thumbsup",
                          "thumbsdown",
                          "message",
                        ].map((iconName) => (
                            <div
                                key={iconName}
                                className={`p-2 border rounded flex items-center justify-center cursor-pointer hover:bg-accent ${selectedElement?.content === iconName ? "bg-primary text-primary-foreground" : ""}`}
                                onClick={() =>
                                    updateElement(selectedElement.id, {
                                      ...selectedElement,
                                      content: iconName,
                                    })
                                }
                            >
                              <div className="text-lg">{getIconPreview(iconName)}</div>
                            </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
  )

  // 添加这个辅助函数来获取图标预览
  const getIconPreview = (iconName: string) => {
    // 这里简单返回图标名称，实际实现中可以返回对应的图标组件
    // 为了简单起见，我们使用emoji或符号来表示
    const iconMap: Record<string, string> = {
      star: "★",
      heart: "♥",
      check: "✓",
      info: "ℹ",
      alert: "⚠",
      bell: "🔔",
      calendar: "📅",
      clock: "🕒",
      mail: "✉",
      phone: "📱",
      user: "👤",
      users: "👥",
      settings: "⚙",
      home: "🏠",
      file: "📄",
      folder: "📁",
      search: "🔍",
      cart: "🛒",
      dollar: "$",
      tag: "🏷",
      arrowup: "↑",
      arrowdown: "↓",
      arrowleft: "←",
      arrowright: "→",
      up: "⬆",
      down: "⬇",
      left: "⬅",
      right: "➡",
      navigation: "🧭",
      move: "↔",
      refresh: "🔄",
      rotatecw: "↻",
      rotateccw: "↺",
      maximize: "⤢",
      minimize: "⤫",
      external: "↗",
      upload: "⬆",
      download: "⬇",
      share: "📤",
      link: "🔗",
      camera: "📷",
      music: "🎵",
      video: "🎬",
      headphones: "🎧",
      smartphone: "📱",
      tablet: "📱",
      laptop: "💻",
      monitor: "🖥",
      printer: "🖨",
      wifi: "📶",
      bluetooth: "📶",
      image: "🖼",
      play: "▶",
      pause: "⏸",
      volume: "🔊",
      mic: "🎤",
      speaker: "🔈",
      tv: "📺",
      youtube: "📺",
      instagram: "📷",
      sun: "☀",
      moon: "🌙",
      cloud: "☁",
      rain: "🌧",
      snow: "❄",
      wind: "💨",
      umbrella: "☂",
      coffee: "☕",
      utensils: "🍴",
      bag: "👜",
      briefcase: "💼",
      book: "📚",
      scissors: "✂",
      trash: "🗑",
      save: "💾",
      award: "🏆",
      gift: "🎁",
      thumbsup: "👍",
      thumbsdown: "👎",
      message: "💬",
    }

    return iconMap[iconName] || iconName
  }

  // 渲染图片特有属性
  const renderImageProperties = () => (
      <Accordion type="single" collapsible defaultValue="image">
        <AccordionItem value="image">
          <AccordionTrigger>图片设置</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-opacity">不透明度</Label>
                <div className="flex items-center gap-2">
                  <Slider
                      id="image-opacity"
                      value={[selectedElement?.style?.opacity || 1]}
                      min={0.1}
                      max={1}
                      step={0.1}
                      onValueChange={(value) => handleStyleChange("opacity", value[0])}
                  />
                  <span className="w-12 text-center">{Math.round((selectedElement?.style?.opacity || 1) * 100)}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-border-radius">圆角</Label>
                <div className="flex items-center gap-2">
                  <Slider
                      id="image-border-radius"
                      value={[selectedElement?.style?.borderRadius || 0]}
                      min={0}
                      max={50}
                      step={1}
                      onValueChange={(value) => handleStyleChange("borderRadius", value[0])}
                  />
                  <span className="w-12 text-center">{selectedElement?.style?.borderRadius || 0}px</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-border-width">边框宽度</Label>
                <div className="flex items-center gap-2">
                  <Slider
                      id="image-border-width"
                      value={[selectedElement?.style?.borderWidth || 0]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(value) => handleStyleChange("borderWidth", value[0])}
                  />
                  <span className="w-12 text-center">{selectedElement?.style?.borderWidth || 0}px</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-border-color">边框颜色</Label>
                <div className="flex items-center gap-2">
                  <div
                      className="w-8 h-8 rounded border cursor-pointer"
                      style={{ backgroundColor: selectedElement?.style?.borderColor || "#000000" }}
                  >
                    <Input
                        id="image-border-color"
                        type="color"
                        value={selectedElement?.style?.borderColor || "#000000"}
                        onChange={(e) => handleStyleChange("borderColor", e.target.value)}
                        className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <Input
                      type="text"
                      value={selectedElement?.style?.borderColor || "#000000"}
                      onChange={(e) => handleStyleChange("borderColor", e.target.value)}
                      className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-object-fit">填充方式</Label>
                <Select
                    value={selectedElement?.style?.objectFit || "contain"}
                    onValueChange={(value) => handleStyleChange("objectFit", value)}
                >
                  <SelectTrigger id="image-object-fit">
                    <SelectValue placeholder="选择填充方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contain">包含 (Contain)</SelectItem>
                    <SelectItem value="cover">覆盖 (Cover)</SelectItem>
                    <SelectItem value="fill">填充 (Fill)</SelectItem>
                    <SelectItem value="none">无 (None)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
  )

  // 优化表格编辑功能，提供更友好的编辑交互
  const renderTableProperties = () => {
    if (!selectedElement || !tableData) return <div>加载中...</div>

    return (
        <div className="space-y-4">
          <Accordion type="single" collapsible defaultValue="tableStyle">
            <AccordionItem value="tableStyle">
              <AccordionTrigger>表格样式</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Label className="mb-2 block">背景颜色</Label>
                  <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded border cursor-pointer"
                        style={{ backgroundColor: tableStyle.backgroundColor || "#ffffff" }}
                    >
                      <Input
                          type="color"
                          value={tableStyle.backgroundColor || "#ffffff"}
                          onChange={(e) => updateTableStyle({ backgroundColor: e.target.value })}
                          className="opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                    <Input
                        type="text"
                        value={tableStyle.backgroundColor || "#ffffff"}
                        onChange={(e) => updateTableStyle({ backgroundColor: e.target.value })}
                        className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="mb-2 block">字体颜色</Label>
                  <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded border cursor-pointer"
                        style={{ backgroundColor: tableStyle.color || "#000000" }}
                    >
                      <Input
                          type="color"
                          value={tableStyle.color || "#000000"}
                          onChange={(e) => updateTableStyle({ color: e.target.value })}
                          className="opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                    <Input
                        type="text"
                        value={tableStyle.color || "#000000"}
                        onChange={(e) => updateTableStyle({ color: e.target.value })}
                        className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="mb-2 block">字体大小</Label>
                  <Input
                      type="number"
                      value={tableStyle.fontSize || 16}
                      onChange={(e) => updateTableStyle({ fontSize: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="mb-2 block">边框颜色</Label>
                  <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded border cursor-pointer"
                        style={{ backgroundColor: tableStyle.borderColor || "#000000" }}
                    >
                      <Input
                          type="color"
                          value={tableStyle.borderColor || "#000000"}
                          onChange={(e) => updateTableStyle({ borderColor: e.target.value })}
                          className="opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                    <Input
                        type="text"
                        value={tableStyle.borderColor || "#000000"}
                        onChange={(e) => updateTableStyle({ borderColor: e.target.value })}
                        className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="mb-2 block">边框宽度</Label>
                  <Input
                      type="number"
                      value={tableStyle.borderWidth || 1}
                      onChange={(e) => updateTableStyle({ borderWidth: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <Label className="mb-2 block">表头背景颜色</Label>
                  <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded border cursor-pointer"
                        style={{ backgroundColor: tableStyle.headerBgColor || "#f0f0f0" }}
                    >
                      <Input
                          type="color"
                          value={tableStyle.headerBgColor || "#f0f0f0"}
                          onChange={(e) => updateTableStyle({ headerBgColor: e.target.value })}
                          className="opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                    <Input
                        type="text"
                        value={tableStyle.headerBgColor || "#f0f0f0"}
                        onChange={(e) => updateTableStyle({ headerBgColor: e.target.value })}
                        className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label className="mb-2 block">表头字体颜色</Label>
                  <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded border cursor-pointer"
                        style={{ backgroundColor: tableStyle.headerColor || "#000000" }}
                    >
                      <Input
                          type="color"
                          value={tableStyle.headerColor || "#000000"}
                          onChange={(e) => updateTableStyle({ headerColor: e.target.value })}
                          className="opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                    <Input
                        type="text"
                        value={tableStyle.headerColor || "#000000"}
                        onChange={(e) => updateTableStyle({ headerColor: e.target.value })}
                        className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label className="mb-2 block">表头字体大小</Label>
                  <Input
                      type="number"
                      value={tableStyle.headerFontSize || 16}
                      onChange={(e) => updateTableStyle({ headerFontSize: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <Label className="mb-2 block">表头字体粗细</Label>
                  <Button
                      variant={tableStyle.headerFontWeight === "bold" ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                          updateTableStyle({ headerFontWeight: tableStyle.headerFontWeight === "bold" ? "normal" : "bold" })
                      }
                  >
                    <Bold className="h-4 w-4 mr-2" />
                    {tableStyle.headerFontWeight === "bold" ? "粗体" : "正常"}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible defaultValue="tableData">
            <AccordionItem value="tableData">
              <AccordionTrigger>表格数据</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={addRow}>
                      <PlusIcon className="h-4 w-4 mr-1" />
                      添加行
                    </Button>
                    <Button variant="outline" size="sm" onClick={addColumn}>
                      <PlusIcon className="h-4 w-4 mr-1" />
                      添加列
                    </Button>
                  </div>

                  {/* 表头编辑区域 */}
                  <div className="border rounded-t bg-muted p-2">
                    <Label className="mb-2 block font-bold">表头</Label>
                    <div className="flex flex-wrap gap-2">
                      {tableData &&
                          tableData.data[0] &&
                          tableData.data[0].map((cell, colIndex) => (
                              <div key={`header-${colIndex}`} className="relative flex-1 min-w-[120px]">
                                <Input
                                    value={cell}
                                    onChange={(e) => handleCellChange(0, colIndex, e.target.value)}
                                    className="pr-8 bg-white"
                                    placeholder={`列 ${colIndex + 1}`}
                                />
                                {tableData.columns > 2 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full text-red-500 hover:text-red-700 hover:bg-transparent"
                                        onClick={() => deleteColumn(colIndex)}
                                        title="删除列"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                              </div>
                          ))}
                    </div>
                  </div>

                  {/* 表格数据预览 */}
                  <div className="border rounded p-2">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="font-medium">表格数据预览</Label>
                      <Button variant="outline" size="sm" onClick={openTableDialog}>
                        编辑表格数据
                      </Button>
                    </div>

                    <div className="max-h-[200px] overflow-auto">
                      <table className="w-full border-collapse">
                        <thead>
                        <tr>
                          {tableData.data[0]?.map((header, index) => (
                              <th key={index} className="border p-1 bg-muted text-xs">
                                {header}
                              </th>
                          ))}
                        </tr>
                        </thead>
                        <tbody>
                        {tableData.data.slice(1, 5).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="border p-1 text-xs">
                                    {cell}
                                  </td>
                              ))}
                            </tr>
                        ))}
                        </tbody>
                      </table>
                      {tableData.data.length > 6 && (
                          <div className="text-center text-xs text-muted-foreground mt-2">
                            显示前 {Math.min(5, tableData.data.length - 1)} 行，共 {tableData.data.length - 1} 行
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
    )
  }

  // 在 renderChartProperties 函数中，替换现有的图表属性渲染逻辑，添加图表数据编辑功能
  const renderChartProperties = () => {
    if (!selectedElement || !chartDataState) return <div>加载中...</div>

    // 更新图表数据
    const updateChartData = (newData: Partial<ChartData>) => {
      const updatedChartData = {
        ...chartDataState,
        ...newData,
      }

      setChartDataState(updatedChartData)

      // 更新元素内容
      updateElement(selectedElement.id, {
        ...selectedElement,
        content: JSON.stringify(updatedChartData),
      })
    }

    return (
        <div className="space-y-4">
          <Accordion type="single" collapsible defaultValue="chartType">
            <AccordionItem value="chartType">
              <AccordionTrigger>图表类型</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Label>图表类型</Label>
                  <Select value={chartDataState.type} onValueChange={(value) => updateChartData({ type: value as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择图表类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">柱状图</SelectItem>
                      <SelectItem value="line">折线图</SelectItem>
                      <SelectItem value="pie">饼图</SelectItem>
                      <SelectItem value="doughnut">环形图</SelectItem>
                      <SelectItem value="radar">雷达图</SelectItem>
                      <SelectItem value="polarArea">极区图</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible defaultValue="chartData">
            <AccordionItem value="chartData">
              <AccordionTrigger>图表数据</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>标签 (用逗号分隔)</Label>
                    <Input
                        value={chartDataState.labels.join(",")}
                        onChange={(e) => {
                          const labels = e.target.value.split(",").map((label) => label.trim())
                          updateChartData({ labels })
                        }}
                    />
                  </div>

                  {chartDataState.datasets.map((dataset, index) => (
                      <div key={index} className="space-y-2 border p-3 rounded">
                        <div className="flex justify-between items-center">
                          <Label>数据集 {index + 1}</Label>
                          {chartDataState.datasets.length > 1 && (
                              <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 h-6 px-2"
                                  onClick={() => {
                                    const newDatasets = [...chartDataState.datasets]
                                    newDatasets.splice(index, 1)
                                    updateChartData({ datasets: newDatasets })
                                  }}
                              >
                                删除
                              </Button>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">名称</Label>
                          <Input
                              value={dataset.label}
                              onChange={(e) => {
                                const newDatasets = [...chartDataState.datasets]
                                newDatasets[index] = { ...dataset, label: e.target.value }
                                updateChartData({ datasets: newDatasets })
                              }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">数据 (用逗号分隔)</Label>
                          <Input
                              value={dataset.data.join(",")}
                              onChange={(e) => {
                                const data = e.target.value.split(",").map((val) => Number(val.trim()) || 0)
                                const newDatasets = [...chartDataState.datasets]
                                newDatasets[index] = { ...dataset, data }
                                updateChartData({ datasets: newDatasets })
                              }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label className="text-xs">背景颜色</Label>
                            <div className="flex items-center gap-2">
                              <div
                                  className="w-8 h-8 rounded border cursor-pointer"
                                  style={{
                                    backgroundColor:
                                        typeof dataset.backgroundColor === "string" ? dataset.backgroundColor : "#4BC0C0",
                                  }}
                              >
                                <Input
                                    type="color"
                                    value={typeof dataset.backgroundColor === "string" ? dataset.backgroundColor : "#4BC0C0"}
                                    onChange={(e) => {
                                      const newDatasets = [...chartDataState.datasets]
                                      newDatasets[index] = { ...dataset, backgroundColor: e.target.value }
                                      updateChartData({ datasets: newDatasets })
                                    }}
                                    className="opacity-0 w-full h-full cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">边框颜色</Label>
                            <div className="flex items-center gap-2">
                              <div
                                  className="w-8 h-8 rounded border cursor-pointer"
                                  style={{
                                    backgroundColor:
                                        typeof dataset.borderColor === "string" ? dataset.borderColor : "#4BC0C0",
                                  }}
                              >
                                <Input
                                    type="color"
                                    value={typeof dataset.borderColor === "string" ? dataset.borderColor : "#4BC0C0"}
                                    onChange={(e) => {
                                      const newDatasets = [...chartDataState.datasets]
                                      newDatasets[index] = { ...dataset, borderColor: e.target.value }
                                      updateChartData({ datasets: newDatasets })
                                    }}
                                    className="opacity-0 w-full h-full cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  ))}

                  <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const newDatasets = [...chartDataState.datasets]
                        newDatasets.push({
                          label: `数据集 ${newDatasets.length + 1}`,
                          data: Array(chartDataState.labels.length).fill(0),
                          backgroundColor: "rgba(153, 102, 255, 0.2)",
                          borderColor: "rgba(153, 102, 255, 1)",
                          borderWidth: 1,
                        })
                        updateChartData({ datasets: newDatasets })
                      }}
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    添加数据集
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
    )
  }

  // 添加表格编辑对话框
  // const TableEditDialog = () => {
  //   if (!dialogTableData) return null

  //   return (
  //     <Dialog
  //       open={tableDialogOpen}
  //       onOpenChange={(open) => {
  //         if (!open) {
  //           // 当弹窗关闭时保存更改
  //           saveDialogChanges()
  //         }
  //       }}
  //     >
  //       <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
  //         <DialogHeader>
  //           <DialogTitle>编辑表格数据</DialogTitle>
  //           <DialogDescription>添加、编辑或删除表格中的行和列</DialogDescription>
  //         </DialogHeader>

  //         <div className="flex-1 overflow-hidden flex flex-col">
  //           {/* 表头编辑 */}
  //           <div className="border-b pb-4 mb-4">
  //             <Label className="mb-2 block font-bold">表头</Label>
  //             <div className="flex flex-wrap gap-2">
  //               {dialogTableData.data[0]?.map((cell, colIndex) => (
  //                 <div key={`dialog-header-${colIndex}`} className="relative flex-1 min-w-[150px]">
  //                   <Input
  //                     value={cell}
  //                     onChange={(e) => dialogHandleCellChange(0, colIndex, e.target.value)}
  //                     className="pr-8"
  //                     placeholder={`列 ${colIndex + 1}`}
  //                   />
  //                   {dialogTableData.columns > 2 && (
  //                     <Button
  //                       variant="ghost"
  //                       size="icon"
  //                       className="absolute right-0 top-0 h-full text-red-500 hover:text-red-700 hover:bg-transparent"
  //                       onClick={() => dialogDeleteColumn(colIndex)}
  //                       title="删除列"
  //                     >
  //                       <Trash2 className="h-4 w-4" />
  //                     </Button>
  //                   )}
  //                 </div>
  //               ))}
  //               <Button variant="outline" size="sm" onClick={dialogAddColumn}>
  //                 <PlusIcon className="h-4 w-4 mr-1" />
  //                 添加列
  //               </Button>
  //             </div>
  //           </div>

  //           {/* 表格数据编辑 */}
  //           <div className="flex-1 overflow-auto">
  //             <Label className="mb-2 block font-bold">表格数据</Label>
  //             {dialogTableData.data.slice(1).map((row, rowIndex) => (
  //               <div key={`dialog-row-${rowIndex}`} className="border rounded p-2 mb-3 relative">
  //                 <div className="flex justify-between items-center mb-2">
  //                   <Label className="font-medium">行 {rowIndex + 1}</Label>
  //                   <div className="flex gap-1">
  //                     <Button
  //                       variant="ghost"
  //                       size="icon"
  //                       className="h-7 w-7"
  //                       onClick={() => dialogMoveRow(rowIndex + 1, "up")}
  //                       disabled={rowIndex === 0}
  //                       title="上移"
  //                     >
  //                       <ArrowUp className="h-4 w-4" />
  //                     </Button>
  //                     <Button
  //                       variant="ghost"
  //                       size="icon"
  //                       className="h-7 w-7"
  //                       onClick={() => dialogMoveRow(rowIndex + 1, "down")}
  //                       disabled={rowIndex === dialogTableData.data.length - 2}
  //                       title="下移"
  //                     >
  //                       <ArrowDown className="h-4 w-4" />
  //                     </Button>
  //                     <Button
  //                       variant="ghost"
  //                       size="icon"
  //                       className="h-7 w-7"
  //                       onClick={() => dialogDuplicateRow(rowIndex + 1)}
  //                       title="复制行"
  //                     >
  //                       <Copy className="h-4 w-4" />
  //                     </Button>
  //                     {dialogTableData.rows > 2 && (
  //                       <Button
  //                         variant="ghost"
  //                         size="icon"
  //                         className="h-7 w-7 text-red-500 hover:text-red-700"
  //                         onClick={() => dialogDeleteRow(rowIndex + 1)}
  //                         title="删除行"
  //                       >
  //                         <Trash2 className="h-4 w-4" />
  //                       </Button>
  //                     )}
  //                   </div>
  //                 </div>
  //                 <div
  //                   className="grid gap-2"
  //                   style={{ gridTemplateColumns: `repeat(${dialogTableData.columns}, 1fr)` }}
  //                 >
  //                   {row.map((cell, colIndex) => (
  //                     <Input
  //                       key={`dialog-cell-${rowIndex + 1}-${colIndex}`}
  //                       value={cell}
  //                       onChange={(e) => dialogHandleCellChange(rowIndex + 1, colIndex, e.target.value)}
  //                       placeholder={`单元格 ${rowIndex + 1}-${colIndex + 1}`}
  //                     />
  //                   ))}
  //                 </div>
  //               </div>
  //             ))}
  //           </div>

  //           <div className="pt-4 border-t mt-4">
  //             <Button variant="outline" className="w-full" onClick={dialogAddRow}>
  //               <PlusIcon className="h-4 w-4 mr-1" />
  //               添加行
  //             </Button>
  //           </div>
  //         </div>

  //         <DialogFooter>
  //           <DialogClose asChild>
  //             <Button onClick={saveDialogChanges}>完成</Button>
  //           </DialogClose>
  //         </DialogFooter>
  //       </DialogContent>
  //     </Dialog>
  //   )
  // }

  return (
      <div className="p-4 h-full overflow-auto">
        <h3 className="font-semibold mb-4">属性面板</h3>

        <Tabs defaultValue="element" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="element" className="flex-1">
              元素属性
            </TabsTrigger>
            <TabsTrigger value="canvas" className="flex-1">
              画布属性
            </TabsTrigger>
          </TabsList>

          <TabsContent value="element" className="mt-4">
            {!selectedElement ? (
                <div className="text-center text-muted-foreground py-8">请选择一个元素</div>
            ) : (
                <>
                  {renderCommonProperties()}
                  <Separator className="my-4" />

                  {selectedElement.type === "text" && renderTextProperties()}
                  {selectedElement.type === "shape" && renderShapeProperties()}
                  {selectedElement.type === "icon" && renderIconProperties()}
                  {selectedElement.type === "table" && renderTableProperties()}
                  {selectedElement.type === "chart" && renderChartProperties()}
                  {selectedElement.type === "image" && renderImageProperties()}
                </>
            )}
          </TabsContent>

          <TabsContent value="canvas" className="mt-4">
            {renderCanvasProperties()}
          </TabsContent>
        </Tabs>
        {/* 表格编辑对话框 */}
        {selectedElement?.type === "table" && (
            <TableEditDialog
                tableDialogOpen={tableDialogOpen}
                setTableDialogOpen={setTableDialogOpen}
                dialogTableData={dialogTableData}
                onSave={(data) => {
                  if (!selectedElement) return

                  // 更新本地表格数据
                  setTableData(data)

                  // 更新元素内容
                  updateElement(selectedElement.id, {
                    ...selectedElement,
                    content: JSON.stringify(data),
                  })
                }}
            />
        )}
      </div>
  )
}

