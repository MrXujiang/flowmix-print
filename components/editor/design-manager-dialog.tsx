"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useEditorStore } from "@/lib/editor-store"
import { getDesignList, deleteDesign, getDesign } from "@/lib/storage-utils"
import html2canvas from "html2canvas"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, FileDown, FileUp, Save, Plus, FolderOpen, Download, Upload, FileText } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

interface DesignManagerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function DesignManagerDialog({ open, onOpenChange }: DesignManagerDialogProps) {
    const {
        designId,
        designName,
        setDesignName,
        saveDesign,
        loadDesign,
        createNewDesign,
        exportAsJSON,
        importFromJSON,
        exportAsZip,
        importFromZip,
    } = useEditorStore()

    const [designs, setDesigns] = useState<Array<{ id: string; name: string; updatedAt: number }>>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [importCount, setImportCount] = useState(0)
    const [pagePreviewsOpen, setPagePreviewsOpen] = useState(false)
    const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null)
    const [pagePreviews, setPagePreviews] = useState<string[]>([])
    const [previewLoading, setPreviewLoading] = useState(false)

    // 加载设计列表
    const loadDesigns = async () => {
        try {
            setLoading(true)
            const designList = await getDesignList()
            setDesigns(designList)
            setError(null)
        } catch (err) {
            setError("加载设计列表失败")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // 初始加载
    useEffect(() => {
        if (open) {
            loadDesigns()
        }
    }, [open])

    // 保存当前设计
    const handleSaveDesign = async () => {
        try {
            setLoading(true)
            await saveDesign()
            await loadDesigns() // 刷新列表
            setSuccessMessage("设计已保存")
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch (err) {
            setError("保存设计失败")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // 加载选中的设计
    const handleLoadDesign = async (id: string) => {
        try {
            setLoading(true)
            await loadDesign(id)
            onOpenChange(false) // 关闭对话框
        } catch (err) {
            setError("加载设计失败")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // 删除设计
    const handleDeleteDesign = async (id: string) => {
        if (!confirm("确定要删除这个设计吗？此操作不可撤销。")) {
            return
        }

        try {
            setLoading(true)
            await deleteDesign(id)
            await loadDesigns() // 刷新列表
            setSuccessMessage("设计已删除")
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch (err) {
            setError("删除设计失败")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // 创建新设计
    const handleCreateNewDesign = () => {
        createNewDesign()
        onOpenChange(false) // 关闭对话框
    }

    // 导入JSON
    const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setLoading(true)
            await importFromJSON(file)
            setSuccessMessage("设计已导入")
            setTimeout(() => setSuccessMessage(null), 3000)
            onOpenChange(false) // 关闭对话框
        } catch (err) {
            setError("导入设计失败")
            console.error(err)
        } finally {
            setLoading(false)
            // 重置文件输入
            e.target.value = ""
        }
    }

    // 导入ZIP
    const handleImportZip = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setLoading(true)
            const count = await importFromZip(file)
            setImportCount(count)
            setSuccessMessage(`成功导入 ${count} 个设计`)
            setTimeout(() => setSuccessMessage(null), 3000)
            await loadDesigns() // 刷新列表
        } catch (err) {
            setError("导入备份失败")
            console.error(err)
        } finally {
            setLoading(false)
            // 重置文件输入
            e.target.value = ""
        }
    }

    // 查看设计页面预览
    const handleViewPages = async (id: string) => {
        try {
            setSelectedDesignId(id)
            setPreviewLoading(true)
            setPagePreviewsOpen(true)

            // 获取设计数据
            const design = await getDesign(id)
            if (!design) {
                throw new Error("设计不存在")
            }

            // 保存当前状态
            const currentState = {
                designId: useEditorStore.getState().designId,
                designName: useEditorStore.getState().designName,
                pages: [...useEditorStore.getState().pages], // 深拷贝
                currentPage: useEditorStore.getState().currentPage,
                canvasSize: { ...useEditorStore.getState().canvasSize }, // 深拷贝
                canvasBackground: { ...useEditorStore.getState().canvasBackground }, // 深拷贝
            }

            // 临时设置设计数据用于预览
            useEditorStore.setState({
                pages: design.data.pages,
                canvasSize: design.data.canvasSize,
                canvasBackground: design.data.canvasBackground || {
                    type: "color",
                    value: "#ffffff",
                    opacity: 1,
                },
            })

            // 等待DOM更新
            await new Promise((resolve) => setTimeout(resolve, 100))

            // 生成每个页面的预览
            const previews: string[] = []

            // 获取当前画布元素
            const canvasElement = document.querySelector(".canvas") as HTMLElement
            if (canvasElement) {
                // 为每个页面生成预览
                for (let i = 0; i < design.data.pages.length; i++) {
                    // 临时切换到当前页面
                    useEditorStore.setState({ currentPage: i })

                    // 等待DOM更新
                    await new Promise((resolve) => setTimeout(resolve, 50))

                    // 生成预览
                    try {
                        const canvas = await html2canvas(canvasElement, {
                            scale: 1,
                            useCORS: true,
                            logging: false,
                            backgroundColor: null,
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

                        previews.push(canvas.toDataURL("image/png"))
                    } catch (err) {
                        console.error(`生成第 ${i + 1} 页预览失败:`, err)
                        previews.push("")
                    }
                }
            }

            // 恢复原始状态
            useEditorStore.setState({
                designId: currentState.designId,
                designName: currentState.designName,
                pages: currentState.pages,
                currentPage: currentState.currentPage,
                canvasSize: currentState.canvasSize,
                canvasBackground: currentState.canvasBackground,
            })

            setPagePreviews(previews)
        } catch (err) {
            console.error("生成页面预览失败:", err)
            setError("生成页面预览失败")
        } finally {
            setPreviewLoading(false)
        }
    }

    // 加载特定页面
    const handleLoadSpecificPage = async (id: string, pageIndex: number) => {
        try {
            setLoading(true)
            await loadDesign(id)
            // 设置特定页面
            useEditorStore.setState({ currentPage: pageIndex })
            onOpenChange(false) // 关闭对话框
        } catch (err) {
            setError("加载设计失败")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>设计管理</DialogTitle>
                    <DialogDescription>管理、保存和导入您的设计</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="save">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="save">保存设计</TabsTrigger>
                        <TabsTrigger value="open">打开设计</TabsTrigger>
                        <TabsTrigger value="import-export">导入导出</TabsTrigger>
                    </TabsList>

                    {/* 保存设计选项卡 */}
                    <TabsContent value="save" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="design-name">设计名称</Label>
                            <Input
                                id="design-name"
                                value={designName}
                                onChange={(e) => setDesignName(e.target.value)}
                                placeholder="输入设计名称"
                            />
                        </div>

                        <Button onClick={handleSaveDesign} disabled={loading || !designName.trim()} className="w-full">
                            <Save className="mr-2 h-4 w-4" />
                            保存设计
                        </Button>

                        <Button variant="outline" onClick={handleCreateNewDesign} className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            创建新设计
                        </Button>
                    </TabsContent>

                    {/* 打开设计选项卡 */}
                    <TabsContent value="open" className="space-y-4">
                        <ScrollArea className="h-[300px] border rounded-md p-2">
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <p>加载中...</p>
                                </div>
                            ) : designs.length === 0 ? (
                                <div className="flex justify-center items-center h-full">
                                    <p className="text-muted-foreground">没有保存的设计</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {designs.map((design) => (
                                        <div
                                            key={design.id}
                                            className="flex items-center justify-between p-3 border rounded-md hover:bg-accent"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{design.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    更新于: {format(new Date(design.updatedAt), "yyyy年MM月dd日 HH:mm", { locale: zhCN })}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleLoadDesign(design.id)} title="打开">
                                                    <FolderOpen className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleViewPages(design.id)} title="查看页面">
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive"
                                                    onClick={() => handleDeleteDesign(design.id)}
                                                    title="删除"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>

                        <Button variant="outline" onClick={loadDesigns} className="w-full" disabled={loading}>
                            <FolderOpen className="mr-2 h-4 w-4" />
                            刷新设计列表
                        </Button>
                    </TabsContent>

                    {/* 导入导出选项卡 */}
                    <TabsContent value="import-export" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>导出当前设计</Label>
                                <Button variant="outline" onClick={exportAsJSON} className="w-full">
                                    <FileDown className="mr-2 h-4 w-4" />
                                    导出为JSON
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="import-json">导入设计</Label>
                                <div className="relative">
                                    <Input id="import-json" type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                                    <Button
                                        variant="outline"
                                        onClick={() => document.getElementById("import-json")?.click()}
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        <FileUp className="mr-2 h-4 w-4" />
                                        导入JSON文件
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div className="space-y-2">
                                <Label>导出所有设计</Label>
                                <Button
                                    variant="outline"
                                    onClick={exportAsZip}
                                    className="w-full"
                                    disabled={loading || designs.length === 0}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    导出为ZIP备份
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="import-zip">导入备份</Label>
                                <div className="relative">
                                    <Input id="import-zip" type="file" accept=".zip" onChange={handleImportZip} className="hidden" />
                                    <Button
                                        variant="outline"
                                        onClick={() => document.getElementById("import-zip")?.click()}
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        导入ZIP备份
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {importCount > 0 && (
                            <p className="text-sm text-center text-muted-foreground">成功导入 {importCount} 个设计</p>
                        )}
                    </TabsContent>
                </Tabs>

                {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>}

                {successMessage && <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm">{successMessage}</div>}

                {/* 页面预览对话框 */}
                <Dialog open={pagePreviewsOpen} onOpenChange={setPagePreviewsOpen}>
                    <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
                        <DialogHeader>
                            <DialogTitle>页面预览</DialogTitle>
                            <DialogDescription>查看设计的所有页面，点击页面可直接打开该页面</DialogDescription>
                        </DialogHeader>

                        {previewLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <p>加载预览中...</p>
                            </div>
                        ) : pagePreviews.length === 0 ? (
                            <div className="flex justify-center items-center h-40">
                                <p className="text-muted-foreground">无法生成预览</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                {pagePreviews.map((preview, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-md p-2 cursor-pointer hover:bg-accent"
                                        onClick={() => {
                                            if (selectedDesignId) {
                                                handleLoadSpecificPage(selectedDesignId, index)
                                            }
                                        }}
                                    >
                                        <div className="aspect-[210/297] bg-white border rounded-md overflow-hidden">
                                            {preview ? (
                                                <img
                                                    src={preview || "/placeholder.svg"}
                                                    alt={`页面 ${index + 1}`}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    无法生成预览
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-center mt-2 text-sm">第 {index + 1} 页</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">关闭</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">关闭</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

