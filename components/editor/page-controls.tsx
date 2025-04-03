"use client"
import { useEditorStore } from "@/lib/editor-store"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash, Copy, ArrowLeft, ArrowRight } from "lucide-react"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

export default function PageControls() {
    const { pages, currentPage, setCurrentPage, addPage, removePage } = useEditorStore()
    const [showConfirm, setShowConfirm] = useState(false)
    const [pageToDelete, setPageToDelete] = useState<number | null>(null)

    // 复制当前页面
    const duplicatePage = () => {
        const currentPageData = pages[currentPage]

        // 深拷贝当前页面的元素
        const duplicatedElements = JSON.parse(JSON.stringify(currentPageData.elements)).map((element: any) => ({
            ...element,
            id: uuidv4(), // 为每个元素生成新的ID
        }))

        // 创建新页面
        const newPage = {
            id: uuidv4(),
            elements: duplicatedElements,
        }

        // 在当前页面后插入新页面
        const newPages = [...pages]
        newPages.splice(currentPage + 1, 0, newPage)

        // 更新状态
        useEditorStore.setState({
            pages: newPages,
            currentPage: currentPage + 1, // 切换到新页面
        })
    }

    // 移动页面
    const movePage = (direction: "left" | "right") => {
        if (pages.length <= 1) return

        if (direction === "left" && currentPage > 0) {
            const newPages = [...pages]
            const temp = newPages[currentPage]
            newPages[currentPage] = newPages[currentPage - 1]
            newPages[currentPage - 1] = temp

            useEditorStore.setState({
                pages: newPages,
                currentPage: currentPage - 1,
            })
        } else if (direction === "right" && currentPage < pages.length - 1) {
            const newPages = [...pages]
            const temp = newPages[currentPage]
            newPages[currentPage] = newPages[currentPage + 1]
            newPages[currentPage + 1] = temp

            useEditorStore.setState({
                pages: newPages,
                currentPage: currentPage + 1,
            })
        }
    }

    // 确认删除页面
    const confirmDeletePage = (index: number) => {
        if (pages.length <= 1) {
            return // 不允许删除唯一的页面
        }

        setPageToDelete(index)
        setShowConfirm(true)

        // 3秒后自动隐藏确认
        setTimeout(() => {
            setShowConfirm(false)
            setPageToDelete(null)
        }, 3000)
    }

    // 执行删除
    const executeDeletePage = () => {
        if (pageToDelete !== null) {
            removePage(pageToDelete)
            setShowConfirm(false)
            setPageToDelete(null)
        }
    }

    return (
        <div className="border-t bg-card p-2 flex items-center">
            <div className="flex items-center gap-2 mr-4">
                <Button variant="outline" size="sm" onClick={addPage}>
                    <Plus className="h-4 w-4 mr-1" />
                    添加页面
                </Button>

                <Button variant="outline" size="sm" onClick={duplicatePage}>
                    <Copy className="h-4 w-4 mr-1" />
                    复制页面
                </Button>

                <Button variant="outline" size="sm" onClick={() => movePage("left")} disabled={currentPage === 0}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    上移
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => movePage("right")}
                    disabled={currentPage === pages.length - 1}
                >
                    <ArrowRight className="h-4 w-4 mr-1" />
                    下移
                </Button>

                {showConfirm && pageToDelete === currentPage ? (
                    <Button variant="destructive" size="sm" onClick={executeDeletePage}>
                        确认删除
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => confirmDeletePage(currentPage)}
                        disabled={pages.length <= 1}
                    >
                        <Trash className="h-4 w-4 mr-1" />
                        删除页面
                    </Button>
                )}
            </div>

            <Tabs
                value={currentPage.toString()}
                onValueChange={(value) => setCurrentPage(Number.parseInt(value))}
                className="flex-1"
            >
                <TabsList className="bg-muted/50 h-auto flex-wrap">
                    {pages.map((_, index) => (
                        <TabsTrigger key={index} value={index.toString()} className="data-[state=active]:bg-background h-8">
                            第 {index + 1} 页
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    )
}

