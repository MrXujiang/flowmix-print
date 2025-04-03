import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Server,
    Shield,
    Lock,
    Settings,
    Users,
    BarChart,
    FileText,
    CheckCircle,
    Globe,
    Database,
    Cpu,
} from "lucide-react"

export default function EnterprisePage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* 页面头部 */}
            <header className="border-b">
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
                            <Link href="/#features" className="text-sm font-medium hover:underline">
                                功能特点
                            </Link>

                            <Link href="/cases" className="text-sm font-medium hover:underline">
                                应用案例
                            </Link>
                            <Link href="https://orange.turntip.cn" className="text-sm font-medium hover:underline">
                                更多产品
                            </Link>
                        </nav>
                        <Button asChild>
                            <Link href="/editor">开始设计</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* 英雄区域 */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">企业级私有化部署解决方案</h1>
                            <p className="text-xl opacity-90 mb-10">为企业提供安全、可靠、可定制的打印设计平台，满足企业特定需求</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" variant="secondary" asChild>
                                    <Link href="#contact">联系我们</Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="bg-transparent text-white border-white hover:bg-white/10"
                                    asChild
                                >
                                    <Link href="https://mindlink.turntip.cn">更多产品</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 私有化部署优势 */}
                <section id="features" className="py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">私有化部署优势</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-card p-6 rounded-lg shadow-sm border">
                                <div
                                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-primary"/>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">数据安全</h3>
                                <p className="text-muted-foreground">
                                    所有数据存储在企业内部服务器，确保敏感信息不会外泄，满足合规要求
                                </p>
                            </div>

                            <div className="bg-card p-6 rounded-lg shadow-sm border">
                                <div
                                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <Settings className="h-6 w-6 text-primary"/>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">模块化设计，轻松二开</h3>
                                <p className="text-muted-foreground">根据企业需求轻松进行二次开发，与现有系统无缝集成</p>
                            </div>

                            <div className="bg-card p-6 rounded-lg shadow-sm border">
                                <div
                                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <Lock className="h-6 w-6 text-primary"/>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">高性价比</h3>
                                <p className="text-muted-foreground">多种高性价部署模式和1V1的技术服务售后</p>
                            </div>

                            <div className="bg-card p-6 rounded-lg shadow-sm border">
                                <div
                                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <Server className="h-6 w-6 text-primary"/>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">独立部署</h3>
                                <p className="text-muted-foreground">可部署在企业内网或私有云环境，确保系统稳定性和安全性</p>
                            </div>

                            <div className="bg-card p-6 rounded-lg shadow-sm border">
                                <div
                                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-primary"/>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">支持接入用户体系</h3>
                                <p className="text-muted-foreground">支持集成企业用户体验，实现更精准的用户权限控制</p>
                            </div>

                            <div className="bg-card p-6 rounded-lg shadow-sm border">
                                <div
                                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <BarChart className="h-6 w-6 text-primary"/>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">丰富的组件生态</h3>
                                <p className="text-muted-foreground">支持多种组件形态如表格，图表，图片等，持续扩展</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 部署方案 */}
                <section className="py-20 bg-muted/50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">灵活的部署方案</h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-card p-8 rounded-lg shadow-sm border relative">
                                <div className="absolute top-4 right-4">
                                    <Server className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-4">本地编译服部署</h3>
                                <ul className="space-y-3 mb-6">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>部署在企业内部服务器</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>完全离线运行，最高安全性</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>支持服务器协助部署</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>适合传统或无二次开发需求的企业</span>
                                    </li>
                                </ul>
                                <Button className="w-full" variant="outline">
                                    <a href="#contact">¥999 / 年 了解详情</a>
                                </Button>
                            </div>

                            <div className="bg-card p-8 rounded-lg shadow-sm border border-primary relative">
                                <div className="absolute top-4 right-4">
                                    <Cpu className="h-6 w-6 text-primary" />
                                </div>
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                                    推荐方案
                                </div>
                                <h3 className="text-2xl font-semibold mb-4">源码私有化部署</h3>
                                <ul className="space-y-3 mb-6">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"/>
                                        <span>部署在企业私有云环境</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"/>
                                        <span>灵活的资源扩展能力</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"/>
                                        <span>源码交付，可二次开发</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"/>
                                        <span>支持一个企业授权使用</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"/>
                                        <span>适合有系统定制集成需求的企业</span>
                                    </li>
                                </ul>
                                <Button className="w-full"><a href="#contact">¥4999 / 永久 / 联系咨询</a></Button>
                            </div>

                            <div className="bg-card p-8 rounded-lg shadow-sm border relative">
                            <div className="absolute top-4 right-4">
                                    <Globe className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-4">合作伙伴计划</h3>
                                <ul className="space-y-3 mb-6">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"/>
                                        <span>部署在企业私有云环境</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"/>
                                        <span>灵活的资源扩展能力</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"/>
                                        <span>源码交付，可二次开发</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"/>
                                        <span>企业授权数不限制，可对外服务</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"/>
                                        <span>适合有系统定制集成需求的企业</span>
                                    </li>
                                </ul>
                                <Button className="w-full" variant="outline">
                                    <a href="#contact">¥9999 / 永久 了解详情</a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 技术规格 */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">技术规格</h2>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-2xl font-semibold mb-6 flex items-center">
                                    <Database className="h-6 w-6 mr-2"/>
                                    系统要求
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-medium mb-2">服务器配置</h4>
                                        <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• CPU: 2核心及以上</li>
                                            <li>• 内存: 6GB及以上</li>
                                            <li>• 存储: 20GB SSD及以上</li>
                                            <li>• 操作系统: Linux, Windows等主流系统</li>
                                        </ul>
                                    </div>

                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-medium mb-2">软件环境</h4>
                                        <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• Docker 20.10+（可选）</li>
                                            <li>• Docker Compose 2.0+（可选）</li>
                                            <li>• Node.js 18+ (可选，用于自定义开发)</li>
                                        </ul>
                                    </div>

                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-medium mb-2">网络要求</h4>
                                        <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• 内网带宽: 3Mbps及以上</li>
                                            <li>• 支持HTTP/HTTPS配置</li>
                                            <li>• 支持反向代理(Nginx/Apache)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-semibold mb-6 flex items-center">
                                    <FileText className="h-6 w-6 mr-2" />
                                    支持服务
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-medium mb-2">部署服务</h4>
                                        <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• 专业团队远程或现场部署</li>
                                            <li>• 系统环境配置与优化</li>
                                            <li>• 数据迁移与初始化</li>
                                            <li>• 系统集成与API对接</li>
                                        </ul>
                                    </div>

                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-medium mb-2">培训与支持</h4>
                                        <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• 管理员培训</li>
                                            <li>• 用户使用培训</li>
                                            <li>• 7x24技术支持</li>
                                            <li>• 定期系统健康检查</li>
                                        </ul>
                                    </div>

                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-medium mb-2">定制开发</h4>
                                        <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>• 功能定制开发</li>
                                            <li>• UI/UX定制</li>
                                            <li>• 第三方系统集成</li>
                                            <li>• 专属模板开发</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 联系我们 */}
                <section id="contact" className="py-20 bg-primary text-primary-foreground">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">获取私有化部署方案</h2>
                        <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                            扫码加下方微信，为您提供定制化的部署方案
                        </p>

                        <div className="max-w-sm mx-auto bg-white text-foreground p-6 rounded-lg shadow-lg">
                            <img src="https://flowmix.turntip.cn/fm/static/my.8ee63da4.png" style={{width: 156, display: 'inline-block'}}
                                 alt=""/>
                            <img src="https://flowmix.turntip.cn/fm/static/logo.ce1bcd6a.jpeg" style={{width: 156, display: 'inline-block'}}
                                 alt=""/>
                        </div>
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
                            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                                首页
                            </Link>
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

