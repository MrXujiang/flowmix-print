import { openDB, type DBSchema, type IDBPDatabase } from "idb"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import type { CanvasSize, Page } from "@/types/editor"
import { v4 as uuidv4 } from "uuid"

// 定义数据库结构
interface PrintEditorDB extends DBSchema {
    designs: {
        key: string
        value: {
            id: string
            name: string
            createdAt: number
            updatedAt: number
            data: {
                canvasSize: CanvasSize
                pages: Page[]
                currentPage: number
                canvasBackground: {
                    type: "color" | "image" | "pattern"
                    value: string
                    opacity: number
                }
            }
        }
    }
}

// 数据库名称和版本
const DB_NAME = "print-editor-db"
const DB_VERSION = 1

// 打开数据库连接
async function openDatabase(): Promise<IDBPDatabase<PrintEditorDB>> {
    return openDB<PrintEditorDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // 创建设计存储对象
            if (!db.objectStoreNames.contains("designs")) {
                const store = db.createObjectStore("designs", { keyPath: "id" })
                store.createIndex("updatedAt", "updatedAt")
            }
        },
    })
}

// 保存设计到IndexedDB
export async function saveDesignToIndexedDB(
    id: string,
    name: string,
    data: {
        canvasSize: CanvasSize
        pages: Page[]
        currentPage: number
        canvasBackground: {
            type: "color" | "image" | "pattern"
            value: string
            opacity: number
        }
    },
): Promise<string> {
    const db = await openDatabase()

    const now = Date.now()
    const design = {
        id,
        name,
        createdAt: now,
        updatedAt: now,
        data,
    }

    // 检查是否已存在
    const existingDesign = await db.get("designs", id)
    if (existingDesign) {
        design.createdAt = existingDesign.createdAt
    }

    await db.put("designs", design)
    return id
}

// 更新现有设计
export async function updateDesign(
    id: string,
    data: {
        canvasSize: CanvasSize
        pages: Page[]
        currentPage: number
        canvasBackground: {
            type: "color" | "image" | "pattern"
            value: string
            opacity: number
        }
    },
): Promise<void> {
    const db = await openDatabase()

    const existingDesign = await db.get("designs", id)
    if (!existingDesign) {
        throw new Error("设计不存在")
    }

    const updatedDesign = {
        ...existingDesign,
        updatedAt: Date.now(),
        data,
    }

    await db.put("designs", updatedDesign)
}

// 获取设计列表
export async function getDesignList(): Promise<Array<{ id: string; name: string; updatedAt: number }>> {
    const db = await openDatabase()
    const designs = await db.getAll("designs")

    return designs
        .map((design) => ({
            id: design.id,
            name: design.name,
            updatedAt: design.updatedAt,
        }))
        .sort((a, b) => b.updatedAt - a.updatedAt) // 按更新时间降序排序
}

// 获取单个设计
export async function getDesign(id: string) {
    const db = await openDatabase()
    return db.get("designs", id)
}

// 删除设计
export async function deleteDesign(id: string): Promise<void> {
    const db = await openDatabase()
    await db.delete("designs", id)
}

// 导出设计为JSON
export function exportDesignAsJSON(
    name: string,
    data: {
        canvasSize: CanvasSize
        pages: Page[]
        currentPage: number
        canvasBackground: {
            type: "color" | "image" | "pattern"
            value: string
            opacity: number
        }
    },
): void {
    try {
        // 确保数据格式正确
        const exportData = {
            ...data,
            canvasBackground: {
                type: data.canvasBackground?.type || "color",
                value: data.canvasBackground?.value || "#ffffff",
                opacity: data.canvasBackground?.opacity || 1,
            },
        }

        const jsonString = JSON.stringify(exportData, null, 2)
        const blob = new Blob([jsonString], { type: "application/json" })
        saveAs(blob, `${name}.json`)
        console.log("设计已导出为JSON")
    } catch (error) {
        console.error("导出JSON失败:", error)
        alert("导出JSON失败")
    }
}

// 导入设计JSON
export async function importDesignFromJSON(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (event) => {
            try {
                if (!event.target?.result) {
                    reject(new Error("读取文件失败"))
                    return
                }

                const jsonData = JSON.parse(event.target.result as string)

                // 验证基本结构
                if (!jsonData.canvasSize || !Array.isArray(jsonData.pages)) {
                    reject(new Error("无效的JSON文件格式"))
                    return
                }

                // 确保每个页面都有有效的元素数组
                const validatedPages = jsonData.pages.map((page: any) => ({
                    id: page.id || uuidv4(),
                    elements: Array.isArray(page.elements)
                        ? page.elements.map((element: any) => ({
                            id: element.id || uuidv4(),
                            type: element.type || "text",
                            x: typeof element.x === "number" ? element.x : 0,
                            y: typeof element.y === "number" ? element.y : 0,
                            width: typeof element.width === "number" ? element.width : 100,
                            height: typeof element.height === "number" ? element.height : 50,
                            content: element.content || "",
                            style: element.style || {},
                        }))
                        : [],
                }))

                // 确保至少有一个页面
                if (validatedPages.length === 0) {
                    validatedPages.push({
                        id: uuidv4(),
                        elements: [],
                    })
                }

                // 返回验证和修复后的数据
                resolve({
                    ...jsonData,
                    pages: validatedPages,
                    currentPage:
                        typeof jsonData.currentPage === "number" ? Math.min(jsonData.currentPage, validatedPages.length - 1) : 0,
                    canvasBackground: jsonData.canvasBackground || {
                        type: "color",
                        value: "#ffffff",
                        opacity: 1,
                    },
                })
            } catch (error) {
                reject(new Error("无效的JSON文件"))
            }
        }

        reader.onerror = () => {
            reject(new Error("读取文件失败"))
        }

        reader.readAsText(file)
    })
}

// 导出所有设计为ZIP
export async function exportAllDesignsAsZip(): Promise<void> {
    const db = await openDatabase()
    const designs = await db.getAll("designs")

    if (designs.length === 0) {
        throw new Error("没有可导出的设计")
    }

    const zip = new JSZip()

    // 添加元数据文件
    const metadata = {
        exportDate: new Date().toISOString(),
        version: "1.0",
        count: designs.length,
    }

    zip.file("metadata.json", JSON.stringify(metadata, null, 2))

    // 为每个设计创建一个文件
    designs.forEach((design) => {
        const fileName = `designs/${design.id}/${design.name.replace(/[^a-z0-9]/gi, "_")}.json`
        zip.file(fileName, JSON.stringify(design, null, 2))
    })

    // 生成并下载ZIP文件
    const zipBlob = await zip.generateAsync({ type: "blob" })
    saveAs(zipBlob, `flowmix-print-backup-${new Date().toISOString().slice(0, 10)}.zip`)
}

// 从ZIP导入设计
export async function importDesignsFromZip(file: File): Promise<number> {
    const zip = new JSZip()
    const contents = await zip.loadAsync(file)

    let importCount = 0
    const db = await openDatabase()

    // 处理所有JSON文件
    const promises = Object.keys(contents.files)
        .filter((filename) => filename.endsWith(".json") && filename !== "metadata.json")
        .map(async (filename) => {
            const fileData = await contents.files[filename].async("string")
            try {
                const design = JSON.parse(fileData)

                // 验证设计数据结构
                if (design.id && design.name && design.data) {
                    await db.put("designs", design)
                    importCount++
                }
            } catch (error) {
                console.error(`导入文件 ${filename} 失败:`, error)
            }
        })

    await Promise.all(promises)
    return importCount
}

