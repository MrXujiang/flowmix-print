"use client"

import Link from "next/link"
import type React from "react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useEditorStore } from "@/lib/editor-store"
import {
  FileText,
  Edit,
  Printer,
  Database,
  PrinterIcon,
  Minus,
  Plus,
  Ruler,
  ChevronLeft,
  Save,
  Copy,
  ClipboardPasteIcon as Paste,
  Trash,
  Undo,
  Redo,
  FileDown,
  ImageIcon,
  Grid,
  FolderOpen,
  Download,
  Upload,
  User,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { printDesign } from "@/lib/utils"
import DesignManagerDialog from "./design-manager-dialog"
import { isAuthenticated, logoutUser, getStoredUser } from "@/lib/auth-utils"
import { useToast } from "@/components/ui/use-toast"

export default function EditorHeader() {
  const {
    designId,
    designName,
    setDesignName,
    canvasSize,
    setCanvasSize,
    zoom,
    setZoom,
    showRulers,
    setShowRulers,
    showGrid,
    setShowGrid,
    selectedElement,
    deleteElement,
    duplicateElement,
    undo,
    redo,
    canUndo,
    canRedo,
    saveDesign,
    exportAsPDF,
    exportAsImage,
    exportAsJSON,
    importFromJSON,
  } = useEditorStore()

  // 用户认证状态
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // 剪贴板状态
  const [clipboard, setClipboard] = useState<any>(null)

  // 数据绑定对话框状态
  const [dataBindingOpen, setDataBindingOpen] = useState(false)

  // 设计管理对话框状态
  const [designManagerOpen, setDesignManagerOpen] = useState(false)

  // 预设纸张尺寸
  const paperSizes = [
    { label: "A4", value: "a4", width: 210, height: 297 },
    { label: "A5", value: "a5", width: 148, height: 210 },
    { label: "Letter", value: "letter", width: 216, height: 279 },
    { label: "自定义", value: "custom" },
  ]

  // 检查用户认证状态
  useEffect(() => {
    const authStatus = isAuthenticated()
    setAuthenticated(authStatus)

    if (authStatus) {
      const user = getStoredUser()
      setUsername(user?.username || "用户")
    } else {
      // 如果未登录，重定向到登录页面
      router.push("/login")
    }
  }, [router])

  const handlePaperSizeChange = (value: string) => {
    const selectedSize = paperSizes.find((size) => size.value === value)
    if (selectedSize && value !== "custom") {
      setCanvasSize({
        width: selectedSize.width,
        height: selectedSize.height,
        unit: "mm",
      })
    }
  }

  // 复制选中元素
  const handleCopy = () => {
    if (selectedElement) {
      setClipboard({ ...selectedElement })
      toast({
        title: "已复制",
        description: "元素已复制到剪贴板",
      })
    }
  }

  // 粘贴元素
  const handlePaste = () => {
    if (clipboard) {
      duplicateElement(clipboard.id)
      toast({
        title: "已粘贴",
        description: "元素已粘贴到画布",
      })
    }
  }

  // 处理数据绑定
  const handleDataBinding = (dataSource: string, field: string) => {
    if (selectedElement) {
      console.log("数据绑定功能尚未实现", dataSource, field)
      setDataBindingOpen(false)
    }
  }

  // 处理文件导入
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 显示加载状态
    const loadingToast = toast({
      title: "正在导入...",
      description: "正在处理您的设计文件",
      duration: 5000,
    })

    importFromJSON(file)
        .then(() => {
          toast({
            title: "导入成功",
            description: "设计已成功导入",
            variant: "success",
          })

          // 强制触发一次额外的状态更新，确保画布重新渲染
          setTimeout(() => {
            const currentZoom = useEditorStore.getState().zoom
            useEditorStore.setState({ zoom: currentZoom + 0.001 })
            setTimeout(() => {
              useEditorStore.setState({ zoom: currentZoom })
            }, 50)
          }, 100)
        })
        .catch((error) => {
          console.error("导入失败", error)
          toast({
            title: "导入失败",
            description: error.message || "无法导入设计文件",
            variant: "destructive",
          })
        })
        .finally(() => {
          // 重置文件输入
          e.target.value = ""
          // 关闭加载提示
          toast.dismiss(loadingToast.id)
        })
  }

  // 处理登出
  const handleLogout = () => {
    logoutUser()
    toast({
      title: "已登出",
      description: "您已成功登出系统",
    })
    router.push("/login")
  }

  // 处理保存设计
  const handleSaveDesign = () => {
    saveDesign()
    toast({
      title: "已保存",
      description: "设计已成功保存",
    })
  }

  return (
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-2 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24">
              <path fill="currentColor"
                    d="M3.32.954S2.388.78 2.388 2.138c0 1.359.222 18.01.222 18.01s.379.663.521.631c.141-.03 2.546-.358 2.577-.363l.017-.002l.013-4.004l.012-3.9l4.259-.001l-.004-.305l-4.254-.054l.005-1.616l5.04.057l.012-.322l-5.05-.117l.017-6.148s-.056-.673.354-.673s10.856.377 10.856.377s.343.012.354.257c.005.107.003 3.4.004 5.959l-1.068.114l.002.315l-4.215-.062l-.006.338l4.244.058l.005 1.535l-2.39.017l-.002.296l2.377-.023l.003.235h1.053c0 1.01.002 1.713 0 2.43c.542.158 1.385.435 1.385.435l-1.403.21c0 .223.002.572.005.923l-.93-.35l-.654.083l1.585.589l.003.367l2.072-.291l-.007-14.759s.01-.546-.564-.564C18.263 1.803 3.32.954 3.32.954m6.26 8.662l-.005.55l1.303.032l-.03.869l-.79-.02l.021 1.8l.284-.03l.007.35l.969.03v.566q.014 0 .023.01q.01.01.01.023v.013l.238.12a.03.03 0 0 1 .016.014a.03.03 0 0 1 .002.02l-.002.006l.417.12l-.02-2.048l.016-.018c.02 0 1.736-.007 1.736-.018l.002-.947l-1.796.013l.03-1.331zm4.193 2.474l-1.618.017l.02 1.91l1.598-.044zm-2.434 1.706l-.158.157l.21.21l.205-.204l-.257-.13zm2.425.405c-.029 0-7.873.896-7.873.896l3.197 1.718l9.556-1.209s-4.85-1.405-4.88-1.405m-7.923.925l.01.495l.217.113l.618.02l2.121 1.164l-.257.186l.412.288l1.308-.113l.33-.186l6.293-.793l.36.062l-.03-.515l-8.168 1.04zm.649 1.283l-.706.02l-.01 4.002l.84-.176l-.037-.932l3.276 2.488s-.026.453.03.87c.057.417.613.37.613.37l1.293-.277l.2-.242l7.957-1.525l.212.206l1.158-.247c.119-.026.211-.2.273-.314s-.024-1.802-.005-2.333c.016-.445-.08-.425-.129-.438l-.757.134s-.208.057-.314.01c-.174-.076-.154-.205-.154-.205s.01-.222-.067-.469s-.258-.211-.258-.211l-7.08.994s-.372.058-.695.14l-1.802-.99l-.041.023l-.014.004l-.526.046l2.018 1.065c-.003.007-.037.009-.038.016c-.097.882-.202.989-.463 1.03l-1.385.195l-3.08-2.111Z"/>
            </svg>
            <span className="font-semibold">flowmix/print</span>
          </Link>

          <Link href="/" className="mr-6">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1"/>
              返回首页
            </Button>
          </Link>

          <nav className="flex items-center space-x-1 mr-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4 mr-1"/>
                  文件
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleSaveDesign}>
                  <Save className="h-4 w-4 mr-2"/>
                  保存设计
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDesignManagerOpen(true)}>
                  <FolderOpen className="h-4 w-4 mr-2"/>
                  打开设计
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={exportAsPDF}>
                  <FileDown className="h-4 w-4 mr-2"/>
                  导出PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportAsImage}>
                  <ImageIcon className="h-4 w-4 mr-2"/>
                  导出图片
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportAsJSON}>
                  <Download className="h-4 w-4 mr-2"/>
                  导出JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => document.getElementById("import-file")?.click()}>
                  <Upload className="h-4 w-4 mr-2"/>
                  导入JSON
                  <Input id="import-file" type="file" accept=".json" onChange={handleFileImport} className="hidden" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={printDesign}>
                  <Printer className="h-4 w-4 mr-2" />
                  打印
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  编辑
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={undo} disabled={!canUndo}>
                  <Undo className="h-4 w-4 mr-2" />
                  撤销
                </DropdownMenuItem>
                <DropdownMenuItem onClick={redo} disabled={!canRedo}>
                  <Redo className="h-4 w-4 mr-2" />
                  重做
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCopy} disabled={!selectedElement}>
                  <Copy className="h-4 w-4 mr-2" />
                  复制
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePaste} disabled={!clipboard}>
                  <Paste className="h-4 w-4 mr-2" />
                  粘贴
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => selectedElement && deleteElement(selectedElement.id)}
                    disabled={!selectedElement}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm" onClick={printDesign}>
              <Printer className="h-4 w-4 mr-1" />
              打印预览
            </Button>

            <Dialog open={dataBindingOpen} onOpenChange={setDataBindingOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Database className="h-4 w-4 mr-1" />
                  绑定数据
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>数据绑定</DialogTitle>
                  <DialogDescription>选择数据源和字段，将数据绑定到当前选中的元素。</DialogDescription>
                </DialogHeader>

                {!selectedElement ? (
                    <div className="text-center py-4 text-muted-foreground">请先选择一个元素进行数据绑定</div>
                ) : (
                    <Tabs defaultValue="datasources">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="datasources">数据源</TabsTrigger>
                        <TabsTrigger value="custom">自定义数据</TabsTrigger>
                      </TabsList>

                      <TabsContent value="datasources" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="datasource">选择数据源</Label>
                          <Select>
                            <SelectTrigger id="datasource">
                              <SelectValue placeholder="选择数据源" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(useEditorStore.getState().dataSources).map((source) => (
                                  <SelectItem key={source} value={source}>
                                    {source}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>选择字段</Label>
                          <ScrollArea className="h-[200px] border rounded p-2">
                            {Object.keys(useEditorStore.getState().dataSources.customers[0] || {}).map((field) => (
                                <div
                                    key={field}
                                    className="flex items-center p-2 hover:bg-accent rounded cursor-pointer"
                                    onClick={() => handleDataBinding("customers", field)}
                                >
                                  <div className="ml-2">{field}</div>
                                </div>
                            ))}
                          </ScrollArea>
                        </div>
                      </TabsContent>

                      <TabsContent value="custom" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="custom-data">自定义数据</Label>
                          <Input id="custom-data" placeholder="输入自定义数据" />
                        </div>

                        <Button
                            onClick={() => {
                              const customData = (document.getElementById("custom-data") as HTMLInputElement).value
                              if (customData) {
                                handleDataBinding("custom", customData)
                              }
                            }}
                        >
                          绑定自定义数据
                        </Button>
                      </TabsContent>
                    </Tabs>
                )}

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">取消</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </nav>

          <div className="flex items-center gap-2">
            <Select defaultValue="a4" onValueChange={handlePaperSizeChange}>
              <SelectTrigger className="w-24 h-8">
                <SelectValue placeholder="纸张尺寸" />
              </SelectTrigger>
              <SelectContent>
                {paperSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-none"
                        onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>缩小</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="px-2 h-8 flex items-center justify-center border-y bg-background min-w-[50px]">
                {Math.round(zoom * 100)}%
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-none"
                        onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>放大</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                      variant={showRulers ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShowRulers(!showRulers)}
                  >
                    <Ruler className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>显示/隐藏标尺</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                      variant={showGrid ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShowGrid(!showGrid)}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>显示/隐藏网格</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <ModeToggle />

            {authenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-2 gap-2">
                      <User className="h-4 w-4" />
                      {username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>用户选项</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSaveDesign}>
                      <Save className="h-4 w-4 mr-2" />
                      保存我的设计
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDesignManagerOpen(true)}>
                      <FolderOpen className="h-4 w-4 mr-2" />
                      管理设计
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      登出
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            )}

            <Button
                variant="outline"
                size="sm"
                onClick={() => setDesignManagerOpen(true)}
                className="ml-2"
                title="管理设计"
            >
              <FolderOpen className="h-4 w-4 mr-1" />
              {designName || "未命名设计"}
            </Button>
          </div>
        </div>

        {/* 设计管理对话框 */}
        <DesignManagerDialog open={designManagerOpen} onOpenChange={setDesignManagerOpen} />
      </header>
  )
}

