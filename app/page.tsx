"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  ArrowRight,
  FileEdit,
  Layers,
  MousePointerIcon as MousePointerSquare,
  Printer,
  Grid,
  FileImage,
  FilePlus2,
  Building2,
  ShoppingBag,
  Truck,
  Factory,
  ChevronRight,
  CheckCircle,
  ExternalLink,
  LogOut,
  User,
} from "lucide-react"
import { useEffect, useState } from "react"
import { isAuthenticated, logoutUser, getStoredUser } from "@/lib/auth-utils"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // 检查用户是否已登录
    const authStatus = isAuthenticated()
    setAuthenticated(authStatus)

    if (authStatus) {
      const user = getStoredUser()
      setUsername(user?.username || "用户")
    }
  }, [])

  const handleLogout = () => {
    logoutUser()
    setAuthenticated(false)
    setUsername("")
    toast({
      title: "已登出",
      description: "您已成功登出系统",
    })
  }

  return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                  <path fill="currentColor"
                        d="M3.32.954S2.388.78 2.388 2.138c0 1.359.222 18.01.222 18.01s.379.663.521.631c.141-.03 2.546-.358 2.577-.363l.017-.002l.013-4.004l.012-3.9l4.259-.001l-.004-.305l-4.254-.054l.005-1.616l5.04.057l.012-.322l-5.05-.117l.017-6.148s-.056-.673.354-.673s10.856.377 10.856.377s.343.012.354.257c.005.107.003 3.4.004 5.959l-1.068.114l.002.315l-4.215-.062l-.006.338l4.244.058l.005 1.535l-2.39.017l-.002.296l2.377-.023l.003.235h1.053c0 1.01.002 1.713 0 2.43c.542.158 1.385.435 1.385.435l-1.403.21c0 .223.002.572.005.923l-.93-.35l-.654.083l1.585.589l.003.367l2.072-.291l-.007-14.759s.01-.546-.564-.564C18.263 1.803 3.32.954 3.32.954m6.26 8.662l-.005.55l1.303.032l-.03.869l-.79-.02l.021 1.8l.284-.03l.007.35l.969.03v.566q.014 0 .023.01q.01.01.01.023v.013l.238.12a.03.03 0 0 1 .016.014a.03.03 0 0 1 .002.02l-.002.006l.417.12l-.02-2.048l.016-.018c.02 0 1.736-.007 1.736-.018l.002-.947l-1.796.013l.03-1.331zm4.193 2.474l-1.618.017l.02 1.91l1.598-.044zm-2.434 1.706l-.158.157l.21.21l.205-.204l-.257-.13zm2.425.405c-.029 0-7.873.896-7.873.896l3.197 1.718l9.556-1.209s-4.85-1.405-4.88-1.405m-7.923.925l.01.495l.217.113l.618.02l2.121 1.164l-.257.186l.412.288l1.308-.113l.33-.186l6.293-.793l.36.062l-.03-.515l-8.168 1.04zm.649 1.283l-.706.02l-.01 4.002l.84-.176l-.037-.932l3.276 2.488s-.026.453.03.87c.057.417.613.37.613.37l1.293-.277l.2-.242l7.957-1.525l.212.206l1.158-.247c.119-.026.211-.2.273-.314s-.024-1.802-.005-2.333c.016-.445-.08-.425-.129-.438l-.757.134s-.208.057-.314.01c-.174-.076-.154-.205-.154-.205s.01-.222-.067-.469s-.258-.211-.258-.211l-7.08.994s-.372.058-.695.14l-1.802-.99l-.041.023l-.014.004l-.526.046l2.018 1.065c-.003.007-.037.009-.038.016c-.097.882-.202.989-.463 1.03l-1.385.195l-3.08-2.111Z"/>
                </svg>
                <span className="text-xl font-bold">flowmix/print</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                  功能特点
                </Link>
                <Link href="#workflow" className="text-sm font-medium hover:text-primary transition-colors">
                  工作流程
                </Link>
                <Link href="/enterprise" className="text-sm font-medium hover:text-primary transition-colors">
                  私有化部署
                </Link>
                <Link href="/cases" className="text-sm font-medium hover:text-primary transition-colors">
                  应用案例
                </Link>
              </nav>
              <ModeToggle/>

              {authenticated ? (
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <User className="h-4 w-4"/>
                          {username}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => router.push("/editor")}>
                          <FileEdit className="h-4 w-4 mr-2"/>
                          我的设计
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                          登出
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button asChild>
                      <Link href="/editor">进入编辑器</Link>
                    </Button>
                  </div>
              ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/login">
                      <Button variant="ghost">登录</Button>
                    </Link>
                    <Link href="/register">
                      <Button>注册</Button>
                    </Link>
                  </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-20 md:py-32 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-block animate-fade-in-up">
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                  <span>全新升级 v2.0</span>
                </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up [animation-delay:200ms]">
                  专业的可视化打印设计平台
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-10 animate-fade-in-up [animation-delay:400ms]">
                  轻松创建高质量的打印设计，无需专业设计软件
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up [animation-delay:600ms]">
                  <Button size="lg" asChild className="group">
                    <Link href={authenticated ? "/editor" : "/register"}>
                      {authenticated ? "开始设计" : "立即注册"}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="https://mindlink.turntip.cn">灵语AI文档编辑器</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-grid-pattern"></div>
            </div>

            {/* Floating Elements Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
              <div className="absolute top-1/2 -left-32 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float [animation-delay:2s]"></div>
              <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float [animation-delay:4s]"></div>
            </div>
          </section>

          {/* Industry Applications */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">适用于各行各业的打印解决方案</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  无论您是政府机构、教育单位、医疗机构还是零售企业，flowmix/print 都能满足专业打印需求
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <Link
                    href="/cases#government"
                    className="flex flex-col items-center p-6 bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <Building2 className="h-10 w-10 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium text-center">政府机构</h3>
                  <ChevronRight className="h-4 w-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <Link
                    href="/cases#retail"
                    className="flex flex-col items-center p-6 bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <ShoppingBag className="h-10 w-10 text-yellow-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium text-center">零售行业</h3>
                  <ChevronRight className="h-4 w-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <Link
                    href="/cases#logistics"
                    className="flex flex-col items-center p-6 bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <Truck className="h-10 w-10 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium text-center">物流行业</h3>
                  <ChevronRight className="h-4 w-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <Link
                    href="/cases#manufacturing"
                    className="flex flex-col items-center p-6 bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <Factory className="h-10 w-10 text-orange-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium text-center">制造业</h3>
                  <ChevronRight className="h-4 w-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>

              <div className="text-center mt-10">
                <Button variant="outline" asChild>
                  <Link href="/cases" className="group">
                    查看更多行业应用案例
                    <ExternalLink className="ml-2 h-4 w-4 group-hover:rotate-45 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">强大的功能特点</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md hover:border-primary/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <MousePointerSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">拖拽式设计</h3>
                  <p className="text-muted-foreground">直观的拖拽界面，轻松放置和调整元素，无需专业技能</p>
                </div>

                <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md hover:border-primary/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">多种内容元素</h3>
                  <p className="text-muted-foreground">支持文本、图片、形状、表格、图标等多种元素，满足各种设计需求</p>
                </div>

                <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md hover:border-primary/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Grid className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">智能参考线</h3>
                  <p className="text-muted-foreground">自动对齐和吸附功能，帮助你创建精确的专业级设计</p>
                </div>

                <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md hover:border-primary/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <FileEdit className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">自定义画布</h3>
                  <p className="text-muted-foreground">支持各种纸张尺寸和自定义尺寸，适应不同打印需求</p>
                </div>

                <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md hover:border-primary/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <FileImage className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">高质量导出</h3>
                  <p className="text-muted-foreground">支持导出为PDF、高分辨率图片，以及直接打印功能</p>
                </div>

                <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md hover:border-primary/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <FilePlus2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">多页面管理</h3>
                  <p className="text-muted-foreground">创建和管理多个页面，轻松处理多页文档设计</p>
                </div>
              </div>
            </div>
          </section>

          {/* Workflow Section */}
          <section id="workflow" className="py-20 bg-muted/50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">简单三步，完成专业设计</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center relative">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold relative z-10">
                    1
                  </div>
                  <div className="absolute top-8 left-1/2 right-0 h-0.5 bg-primary/20 hidden md:block"></div>
                  <h3 className="text-xl font-semibold mb-3">选择模板或创建新设计</h3>
                  <p className="text-muted-foreground">从丰富的模板库中选择，或从空白画布开始创建</p>
                  <ul className="mt-4 space-y-2 text-left">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>多种行业模板可选</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>自定义画布尺寸</span>
                    </li>
                  </ul>
                </div>

                <div className="text-center relative">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold relative z-10">
                    2
                  </div>
                  <div className="absolute top-8 left-0 right-1/2 h-0.5 bg-primary/20 hidden md:block"></div>
                  <div className="absolute top-8 left-1/2 right-0 h-0.5 bg-primary/20 hidden md:block"></div>
                  <h3 className="text-xl font-semibold mb-3">自定义设计内容</h3>
                  <p className="text-muted-foreground">添加文本、图片和其他元素，调整布局和样式</p>
                  <ul className="mt-4 space-y-2 text-left">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>拖拽式编辑界面</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>丰富的元素库</span>
                    </li>
                  </ul>
                </div>

                <div className="text-center relative">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold relative z-10">
                    3
                  </div>
                  <div className="absolute top-8 left-0 right-1/2 h-0.5 bg-primary/20 hidden md:block"></div>
                  <h3 className="text-xl font-semibold mb-3">导出或打印成品</h3>
                  <p className="text-muted-foreground">以PDF、图片格式导出，或直接发送到打印机</p>
                  <ul className="mt-4 space-y-2 text-left">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>高质量PDF导出</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>一键打印功能</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Enterprise Section */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">企业级私有化部署解决方案</h2>
                  <p className="text-xl opacity-90 mb-8">为企业提供安全、可靠、可定制的打印设计平台，满足企业特定需求</p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span>数据安全，部署在企业内部服务器</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span>精细的组件属性配置面板</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span>根据企业需求进行功能定制</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span>与现有系统无缝集成</span>
                    </li>
                  </ul>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/enterprise">
                      了解更多 <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="lg:w-1/2">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <img
                        src="https://flowmix.turntip.cn/uploads/demo/image_195f1c2f371.png"
                        alt="企业级解决方案"
                        className="w-full h-auto rounded-md shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">准备好开始你的设计了吗？</h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                无需下载软件，立即在浏览器中创建专业级打印设计
              </p>
              <Button size="lg" className="group" asChild>
                <Link href={authenticated ? "/editor" : "/login"}>
                  {authenticated ? "开始设计" : "立即登录"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </section>
        </main>

        <footer className="border-t py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                  <path fill="currentColor"
                        d="M3.32.954S2.388.78 2.388 2.138c0 1.359.222 18.01.222 18.01s.379.663.521.631c.141-.03 2.546-.358 2.577-.363l.017-.002l.013-4.004l.012-3.9l4.259-.001l-.004-.305l-4.254-.054l.005-1.616l5.04.057l.012-.322l-5.05-.117l.017-6.148s-.056-.673.354-.673s10.856.377 10.856.377s.343.012.354.257c.005.107.003 3.4.004 5.959l-1.068.114l.002.315l-4.215-.062l-.006.338l4.244.058l.005 1.535l-2.39.017l-.002.296l2.377-.023l.003.235h1.053c0 1.01.002 1.713 0 2.43c.542.158 1.385.435 1.385.435l-1.403.21c0 .223.002.572.005.923l-.93-.35l-.654.083l1.585.589l.003.367l2.072-.291l-.007-14.759s.01-.546-.564-.564C18.263 1.803 3.32.954 3.32.954m6.26 8.662l-.005.55l1.303.032l-.03.869l-.79-.02l.021 1.8l.284-.03l.007.35l.969.03v.566q.014 0 .023.01q.01.01.01.023v.013l.238.12a.03.03 0 0 1 .016.014a.03.03 0 0 1 .002.02l-.002.006l.417.12l-.02-2.048l.016-.018c.02 0 1.736-.007 1.736-.018l.002-.947l-1.796.013l.03-1.331zm4.193 2.474l-1.618.017l.02 1.91l1.598-.044zm-2.434 1.706l-.158.157l.21.21l.205-.204l-.257-.13zm2.425.405c-.029 0-7.873.896-7.873.896l3.197 1.718l9.556-1.209s-4.85-1.405-4.88-1.405m-7.923.925l.01.495l.217.113l.618.02l2.121 1.164l-.257.186l.412.288l1.308-.113l.33-.186l6.293-.793l.36.062l-.03-.515l-8.168 1.04zm.649 1.283l-.706.02l-.01 4.002l.84-.176l-.037-.932l3.276 2.488s-.026.453.03.87c.057.417.613.37.613.37l1.293-.277l.2-.242l7.957-1.525l.212.206l1.158-.247c.119-.026.211-.2.273-.314s-.024-1.802-.005-2.333c.016-.445-.08-.425-.129-.438l-.757.134s-.208.057-.314.01c-.174-.076-.154-.205-.154-.205s.01-.222-.067-.469s-.258-.211-.258-.211l-7.08.994s-.372.058-.695.14l-1.802-.99l-.041.023l-.014.004l-.526.046l2.018 1.065c-.003.007-.037.009-.038.016c-.097.882-.202.989-.463 1.03l-1.385.195l-3.08-2.111Z"/>
                </svg>
                <span className="font-semibold">flowmix/print</span>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                    href="/enterprise"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  私有化部署
                </Link>
                <Link href="https://flowmix.turntip.cn"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  flowmix/docx文档引擎
                </Link>
                <Link href="https://mindlink.turntip.cn"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  灵语文档
                </Link>
                <Link href="https://orange.turntip.cn"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  轻橙文档
                </Link>
                <Link href="https://orange.turntip.cn"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  AI知识库平台
                </Link>
                <Link href="https://orange.turntip.cn"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  H5-Dooring零代码可视化
                </Link>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} flowmix/print. 保留所有权利.
            </div>
          </div>
        </footer>
      </div>
  )
}

