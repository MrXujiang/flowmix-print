"use client"

import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"
import type { Element, Page, CanvasSize } from "@/types/editor"
import {
  saveDesignToIndexedDB,
  getDesign,
  exportDesignAsJSON,
  importDesignFromJSON,
  exportAllDesignsAsZip,
  importDesignsFromZip,
} from "./storage-utils"

export interface EditorState {
  // 设计ID和名称
  designId: string
  designName: string
  setDesignName: (name: string) => void

  // 画布尺寸
  canvasSize: CanvasSize
  setCanvasSize: (size: CanvasSize) => void

  // 页面数据
  pages: Page[]
  currentPage: number
  setCurrentPage: (index: number) => void
  addPage: () => void
  removePage: (index: number) => void

  // 元素操作
  selectedElement: Element | null
  setSelectedElement: (element: Element | null) => void
  addElement: (element: Omit<Element, "id">) => void
  updateElement: (id: string, updates: Partial<Element>) => void
  moveElement: (id: string, x: number, y: number) => void
  deleteElement: (id: string) => void
  duplicateElement: (id: string) => void

  // 视图控制
  zoom: number
  setZoom: (zoom: number) => void
  showRulers: boolean
  setShowRulers: (show: boolean) => void
  showGrid: boolean
  setShowGrid: (show: boolean) => void

  // 历史记录
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean

  // 导出功能
  saveDesign: () => Promise<void>
  exportAsPDF: () => Promise<void>
  exportAsImage: () => Promise<void>
  printDesign: () => Promise<void>

  // 新增: 导入导出JSON
  exportAsJSON: () => void
  importFromJSON: (file: File) => Promise<void>

  // 新增: 导出ZIP
  exportAsZip: () => Promise<void>
  importFromZip: (file: File) => Promise<number>

  // 新增: 创建新设计
  createNewDesign: () => void

  // 新增: 加载设计
  loadDesign: (id: string) => Promise<void>

  // 画布背景
  canvasBackground: {
    type: "color" | "image" | "pattern"
    value: string
    opacity: number
  }
  setCanvasBackground: (background: Partial<EditorState["canvasBackground"]>) => void

  // 数据绑定
  dataSources: Record<string, any[]>
  addDataSource: (name: string, data: any[]) => void
  removeDataSource: (name: string) => void
  bindElementToData: (elementId: string, dataSource: string, field: string) => void
  getBindingForElement: (elementId: string) => { dataSource: string; field: string } | null

  // 持久化
  loadFromLocalStorage: () => void
  saveToLocalStorage: () => void
  autoSaveEnabled: boolean
  setAutoSaveEnabled: (enabled: boolean) => void
}

export const useEditorStore = create<EditorState>((set, get) => {
  // 历史记录
  const history = {
    past: [] as Page[][],
    future: [] as Page[][],
  }

  // 保存当前状态到历史记录
  const saveToHistory = () => {
    history.past.push(JSON.parse(JSON.stringify(get().pages)))
    history.future = []
    set({ canUndo: true, canRedo: false })
  }

  return {
    // 设计ID和名称
    designId: uuidv4(),
    designName: "未命名设计",
    setDesignName: (name) => set({ designName: name }),

    // 画布尺寸
    canvasSize: {
      width: 210, // A4 宽度（毫米）
      height: 297, // A4 高度（毫米）
      unit: "mm",
    },
    setCanvasSize: (size) => set({ canvasSize: size }),

    // 页面数据
    pages: [{ id: uuidv4(), elements: [] }],
    currentPage: 0,
    setCurrentPage: (index) => set({ currentPage: index }),

    // 添加页面
    addPage: () => {
      saveToHistory()
      set((state) => ({
        pages: [...state.pages, { id: uuidv4(), elements: [] }],
        currentPage: state.pages.length,
      }))
    },

    // 删除页面
    removePage: (index) => {
      const { pages, currentPage } = get()

      if (pages.length <= 1) {
        console.error("至少保留一个页面")
        return
      }

      saveToHistory()

      const newPages = [...pages]
      newPages.splice(index, 1)

      set({
        pages: newPages,
        currentPage: currentPage >= index && currentPage > 0 ? currentPage - 1 : currentPage,
      })
    },

    // 元素操作
    selectedElement: null,
    setSelectedElement: (element) => set({ selectedElement: element }),

    // 添加元素
    addElement: (element) => {
      saveToHistory()

      const newElement: Element = {
        id: uuidv4(),
        ...element,
      }

      set((state) => {
        const newPages = [...state.pages]
        const pageIndex = state.currentPage

        newPages[pageIndex] = {
          ...newPages[pageIndex],
          elements: [...newPages[pageIndex].elements, newElement],
        }

        return {
          pages: newPages,
          selectedElement: newElement,
        }
      })
    },

    // 更新元素
    updateElement: (id, updates) => {
      set((state) => {
        const newPages = [...state.pages]
        const pageIndex = state.currentPage

        const elementIndex = newPages[pageIndex].elements.findIndex((el) => el.id === id)
        if (elementIndex === -1) return state

        newPages[pageIndex].elements[elementIndex] = {
          ...newPages[pageIndex].elements[elementIndex],
          ...updates,
        }

        // 如果更新的是当前选中的元素，也更新选中状态
        const newSelectedElement =
            state.selectedElement?.id === id ? { ...state.selectedElement, ...updates } : state.selectedElement

        return {
          pages: newPages,
          selectedElement: newSelectedElement,
        }
      })
    },

    // 移动元素
    moveElement: (id, x, y) => {
      get().updateElement(id, { x, y })
    },

    // 删除元素
    deleteElement: (id) => {
      saveToHistory()

      set((state) => {
        const newPages = [...state.pages]
        const pageIndex = state.currentPage

        newPages[pageIndex] = {
          ...newPages[pageIndex],
          elements: newPages[pageIndex].elements.filter((el) => el.id !== id),
        }

        return {
          pages: newPages,
          selectedElement: state.selectedElement?.id === id ? null : state.selectedElement,
        }
      })
    },

    // 复制元素
    duplicateElement: (id) => {
      const { pages, currentPage } = get()
      const element = pages[currentPage].elements.find((el) => el.id === id)

      if (!element) return

      saveToHistory()

      const newElement = {
        ...element,
        id: uuidv4(),
        x: element.x + 20, // 偏移一点，以便区分
        y: element.y + 20,
      }

      set((state) => {
        const newPages = [...state.pages]
        newPages[currentPage] = {
          ...newPages[currentPage],
          elements: [...newPages[currentPage].elements, newElement],
        }

        return {
          pages: newPages,
          selectedElement: newElement,
        }
      })
    },

    // 视图控制
    zoom: 1,
    setZoom: (zoom) => set({ zoom }),
    showRulers: true,
    setShowRulers: (show) => set({ showRulers: show }),
    showGrid: true,
    setShowGrid: (show) => set({ showGrid: show }),

    // 历史记录
    canUndo: false,
    canRedo: false,

    // 撤销
    undo: () => {
      const { past } = history
      if (past.length === 0) return

      const newPast = [...past]
      const previousState = newPast.pop()

      history.past = newPast
      history.future = [JSON.parse(JSON.stringify(get().pages)), ...history.future]

      if (previousState) {
        set({
          pages: previousState,
          canUndo: newPast.length > 0,
          canRedo: true,
        })
      }
    },

    // 重做
    redo: () => {
      const { future } = history
      if (future.length === 0) return

      const newFuture = [...future]
      const nextState = newFuture.shift()

      history.past = [...history.past, JSON.parse(JSON.stringify(get().pages))]
      history.future = newFuture

      if (nextState) {
        set({
          pages: nextState,
          canUndo: true,
          canRedo: newFuture.length > 0,
        })
      }
    },

    // 保存设计
    saveDesign: async () => {
      const { designId, designName, canvasSize, pages, currentPage, canvasBackground } = get()

      try {
        await saveDesignToIndexedDB(designId, designName, {
          canvasSize,
          pages,
          currentPage,
          canvasBackground,
        })

        console.log("设计已保存到IndexedDB")
        return Promise.resolve()
      } catch (error) {
        console.error("保存设计失败", error)
        return Promise.reject(error)
      }
    },

    // 导出为PDF
    exportAsPDF: async () => {
      try {
        const { jsPDF } = await import("jspdf")
        const html2canvas = (await import("html2canvas")).default
        const { canvasSize } = get()

        const pdf = new jsPDF({
          orientation: canvasSize.width > canvasSize.height ? "landscape" : "portrait",
          unit: "mm",
          format: [canvasSize.width, canvasSize.height],
        })

        // 获取所有画布元素
        const canvasElements = document.querySelectorAll(".canvas")

        for (let i = 0; i < canvasElements.length; i++) {
          const canvas = canvasElements[i] as HTMLElement

          // 使用html2canvas将画布转换为图像
          const canvasImage = await html2canvas(canvas, {
            scale: 2, // 提高清晰度
            useCORS: true, // 允许跨域图像
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

          // 将图像添加到PDF
          const imgData = canvasImage.toDataURL("image/png")

          if (i > 0) {
            pdf.addPage()
          }

          pdf.addImage(imgData, "PNG", 0, 0, canvasSize.width, canvasSize.height)
        }

        // 保存PDF
        pdf.save(`${get().designName || "design"}.pdf`)
        console.log("PDF导出成功")
        return Promise.resolve()
      } catch (error) {
        console.error("PDF导出失败", error)
        return Promise.reject(error)
      }
    },

    // 导出为图片
    exportAsImage: async () => {
      try {
        const html2canvas = (await import("html2canvas")).default

        // 获取当前画布元素
        const canvas = document.querySelector(".canvas") as HTMLElement
        if (!canvas) return Promise.reject(new Error("找不到画布元素"))

        // 使用html2canvas将画布转换为图像
        const canvasImage = await html2canvas(canvas, {
          scale: 2, // 提高清晰度
          useCORS: true, // 允许跨域图像
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

        // 创建下载链接
        const link = document.createElement("a")
        link.download = `${get().designName || "design"}.png`
        link.href = canvasImage.toDataURL("image/png")
        link.click()

        console.log("图片导出成功")
        return Promise.resolve()
      } catch (error) {
        console.error("图片导出失败", error)
        return Promise.reject(error)
      }
    },

    // 打印设计
    printDesign: async () => {
      try {
        const html2canvas = (await import("html2canvas")).default

        // 获取当前画布元素
        const canvas = document.querySelector(".canvas") as HTMLElement
        if (!canvas) return Promise.reject(new Error("找不到画布元素"))

        // 获取画布尺寸
        const { canvasSize } = get()

        // 使用html2canvas将画布转换为图像
        const canvasImage = await html2canvas(canvas, {
          scale: 2, // 提高清晰度
          useCORS: true, // 允许跨域图像
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

        // 创建一个新窗口用于打印
        const printWindow = window.open("", "_blank")
        if (!printWindow) {
          console.error("无法创建打印窗口")
          return Promise.reject(new Error("无法创建打印窗口"))
        }

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

        console.log("打印预览已生成")
        return Promise.resolve()
      } catch (error) {
        console.error("打印失败", error)
        return Promise.reject(error)
      }
    },

    // 导出为JSON
    exportAsJSON: () => {
      const { designName, canvasSize, pages, currentPage, canvasBackground } = get()

      exportDesignAsJSON(designName, {
        canvasSize,
        pages,
        currentPage,
        canvasBackground,
      })
    },

    // 从JSON导入
    importFromJSON: async (file) => {
      try {
        const jsonData = await importDesignFromJSON(file)

        // 验证数据结构
        if (!jsonData.canvasSize || !jsonData.pages) {
          throw new Error("无效的设计文件格式")
        }

        // 确保 canvasBackground 有正确的格式
        const canvasBackground = jsonData.canvasBackground || {
          type: "color",
          value: "#ffffff",
          opacity: 1,
        }

        // 确保 canvasBackground.type 是有效的值
        if (!["color", "image", "pattern"].includes(canvasBackground.type)) {
          canvasBackground.type = "color"
        }

        // 确保页面数据格式正确
        const pages = jsonData.pages.map((page) => ({
          id: page.id || uuidv4(),
          elements: Array.isArray(page.elements)
              ? page.elements.map((element) => ({
                ...element,
                id: element.id || uuidv4(),
              }))
              : [],
        }))

        if (pages.length === 0) {
          pages.push({ id: uuidv4(), elements: [] })
        }

        // 更新状态
        set({
          designId: uuidv4(), // 生成新ID
          designName: file.name.replace(/\.json$/, "") || "导入的设计",
          canvasSize: jsonData.canvasSize,
          pages: pages,
          currentPage: Math.min(jsonData.currentPage || 0, pages.length - 1),
          canvasBackground: canvasBackground,
          selectedElement: null, // 重置选中元素
        })

        // 清空历史记录
        history.past = []
        history.future = []
        set({ canUndo: false, canRedo: false })

        // 强制触发画布更新 - 使用两次状态更新来确保React检测到变化
        setTimeout(() => {
          const currentState = get()
          set({ ...currentState })
        }, 50)

        console.log("成功导入设计:", file.name)
        return Promise.resolve()
      } catch (error) {
        console.error("导入JSON失败", error)
        return Promise.reject(error)
      }
    },

    // 导出为ZIP
    exportAsZip: async () => {
      try {
        await exportAllDesignsAsZip()
        return Promise.resolve()
      } catch (error) {
        console.error("导出ZIP失败", error)
        return Promise.reject(error)
      }
    },

    // 从ZIP导入
    importFromZip: async (file) => {
      try {
        const count = await importDesignsFromZip(file)
        return Promise.resolve(count)
      } catch (error) {
        console.error("导入ZIP失败", error)
        return Promise.reject(error)
      }
    },

    // 创建新设计
    createNewDesign: () => {
      const newId = uuidv4()

      set({
        designId: newId,
        designName: "未命名设计",
        canvasSize: {
          width: 210,
          height: 297,
          unit: "mm",
        },
        pages: [{ id: uuidv4(), elements: [] }],
        currentPage: 0,
        selectedElement: null,
        canvasBackground: {
          type: "color",
          value: "#ffffff",
          opacity: 1,
        },
      })

      // 清空历史记录
      history.past = []
      history.future = []
      set({ canUndo: false, canRedo: false })
    },

    // 加载设计
    loadDesign: async (id) => {
      try {
        const design = await getDesign(id)

        if (!design) {
          throw new Error("设计不存在")
        }

        // 确保 canvasBackground 有正确的格式
        const canvasBackground = design.data.canvasBackground || {
          type: "color",
          value: "#ffffff",
          opacity: 1,
        }

        // 确保 canvasBackground.type 是有效的值
        if (!["color", "image", "pattern"].includes(canvasBackground.type)) {
          canvasBackground.type = "color"
        }

        set({
          designId: design.id,
          designName: design.name, // 确保设置设计名称
          canvasSize: design.data.canvasSize,
          pages: design.data.pages,
          currentPage: design.data.currentPage || 0,
          canvasBackground: canvasBackground,
          selectedElement: null, // 重置选中元素
        })

        // 清空历史记录
        history.past = []
        history.future = []
        set({ canUndo: false, canRedo: false })

        console.log(`成功加载设计: ${design.name}`)
        return Promise.resolve()
      } catch (error) {
        console.error("加载设计失败", error)
        return Promise.reject(error)
      }
    },

    // 画布背景
    canvasBackground: {
      type: "color",
      value: "#ffffff",
      opacity: 1,
    },
    setCanvasBackground: (background) =>
        set((state) => ({
          canvasBackground: {
            ...state.canvasBackground,
            ...background,
          },
        })),

    // 数据绑定
    dataSources: {
      customers: [
        { id: 1, name: "张三", email: "zhangsan@example.com", phone: "13800000001", address: "北京市朝阳区" },
        { id: 2, name: "李四", email: "lisi@example.com", phone: "13800000002", address: "上海市浦东新区" },
        { id: 3, name: "王五", email: "wangwu@example.com", phone: "13800000003", address: "广州市天河区" },
        { id: 4, name: "赵六", email: "zhaoliu@example.com", phone: "13800000004", address: "深圳市南山区" },
        { id: 5, name: "钱七", email: "qianqi@example.com", phone: "13800000005", address: "杭州市西湖区" },
      ],
      orders: [
        { id: 101, customer_id: 1, product: "笔记本电脑", quantity: 1, price: 6999, date: "2023-01-15" },
        { id: 102, customer_id: 2, product: "智能手机", quantity: 2, price: 4999, date: "2023-01-20" },
        { id: 103, customer_id: 3, product: "平板电脑", quantity: 1, price: 3999, date: "2023-02-05" },
        { id: 104, customer_id: 1, product: "无线耳机", quantity: 1, price: 999, date: "2023-02-10" },
        { id: 105, customer_id: 4, product: "智能手表", quantity: 1, price: 1999, date: "2023-02-15" },
        { id: 106, customer_id: 5, product: "电子书阅读器", quantity: 1, price: 1299, date: "2023-03-01" },
        { id: 107, customer_id: 2, product: "游戏主机", quantity: 1, price: 3799, date: "2023-03-10" },
        { id: 108, customer_id: 3, product: "蓝牙音箱", quantity: 2, price: 599, date: "2023-03-15" },
      ],
      products: [
        { id: 1, name: "笔记本电脑", category: "电脑", price: 6999, stock: 50 },
        { id: 2, name: "智能手机", category: "手机", price: 4999, stock: 100 },
        { id: 3, name: "平板电脑", category: "平板", price: 3999, stock: 75 },
        { id: 4, name: "无线耳机", category: "配件", price: 999, stock: 200 },
        { id: 5, name: "智能手表", category: "穿戴", price: 1999, stock: 80 },
        { id: 6, name: "电子书阅读器", category: "电子书", price: 1299, stock: 60 },
        { id: 7, name: "游戏主机", category: "游戏", price: 3799, stock: 40 },
        { id: 8, name: "蓝牙音箱", category: "音频", price: 599, stock: 150 },
      ],
      sales: [
        { id: 1, product_id: 1, quantity: 10, revenue: 69990, date: "2023-01" },
        { id: 2, product_id: 2, quantity: 25, revenue: 124975, date: "2023-01" },
        { id: 3, product_id: 3, quantity: 15, revenue: 59985, date: "2023-01" },
        { id: 4, product_id: 1, quantity: 12, revenue: 83988, date: "2023-02" },
        { id: 5, product_id: 2, quantity: 30, revenue: 149970, date: "2023-02" },
        { id: 6, product_id: 3, quantity: 18, revenue: 71982, date: "2023-02" },
        { id: 7, product_id: 4, quantity: 50, revenue: 49950, date: "2023-02" },
        { id: 8, product_id: 1, quantity: 15, revenue: 104985, date: "2023-03" },
        { id: 9, product_id: 2, quantity: 35, revenue: 174965, date: "2023-03" },
        { id: 10, product_id: 3, quantity: 20, revenue: 79980, date: "2023-03" },
        { id: 11, product_id: 4, quantity: 60, revenue: 59940, date: "2023-03" },
        { id: 12, product_id: 5, quantity: 25, revenue: 49975, date: "2023-03" },
      ],
    },

    addDataSource: (name, data) => {
      set((state) => ({
        dataSources: {
          ...state.dataSources,
          [name]: data,
        },
      }))
      get().saveToLocalStorage()
    },

    removeDataSource: (name) => {
      set((state) => {
        const newDataSources = { ...state.dataSources }
        delete newDataSources[name]
        return { dataSources: newDataSources }
      })
      get().saveToLocalStorage()
    },

    bindElementToData: (elementId, dataSource, field) => {
      console.log("数据绑定功能尚未实现", elementId, dataSource, field)
      // 保留原有的返回状态，避免破坏状态更新
      return get().pages
    },

    getBindingForElement: (elementId) => {
      const state = get()
      const currentPage = state.currentPage
      const pageElements = state.pages[currentPage].elements

      const element = pageElements.find((el) => el.id === elementId)
      if (!element || !element.binding) return null

      return element.binding
    },

    // 持久化
    loadFromLocalStorage: () => {
      try {
        const savedData = localStorage.getItem("printEditorData")
        if (savedData) {
          const parsedData = JSON.parse(savedData)

          // 更新状态
          set({
            canvasSize: parsedData.canvasSize || get().canvasSize,
            pages: parsedData.pages || get().pages,
            currentPage: parsedData.currentPage || 0,
            dataSources: parsedData.dataSources || get().dataSources,
            canvasBackground: parsedData.canvasBackground || get().canvasBackground,
          })

          console.log("从本地存储加载数据成功")
        }
      } catch (error) {
        console.error("从本地存储加载数据失败", error)
      }
    },

    saveToLocalStorage: () => {
      try {
        const state = get()
        const dataToSave = {
          canvasSize: state.canvasSize,
          pages: state.pages,
          currentPage: state.currentPage,
          dataSources: state.dataSources,
          canvasBackground: state.canvasBackground,
        }

        localStorage.setItem("printEditorData", JSON.stringify(dataToSave))
        console.log("数据已保存到本地存储")
      } catch (error) {
        console.error("保存数据到本地存储失败", error)
      }
    },

    autoSaveEnabled: true,
    setAutoSaveEnabled: (enabled) => set({ autoSaveEnabled: enabled }),
  }
})

// 添加自动保存功能
if (typeof window !== "undefined") {
  // 页面加载时从localStorage加载数据
  window.addEventListener("load", () => {
    setTimeout(() => {
      useEditorStore.getState().loadFromLocalStorage()
    }, 100)
  })

  // 定期自动保存
  setInterval(() => {
    if (useEditorStore.getState().autoSaveEnabled) {
      useEditorStore.getState().saveToLocalStorage()
    }
  }, 30000) // 每30秒自动保存一次

  // 页面关闭前保存
  window.addEventListener("beforeunload", () => {
    useEditorStore.getState().saveToLocalStorage()
  })
}

