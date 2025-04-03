import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, GraduationCap, Stethoscope, ShoppingBag, Truck, Factory, Users, ArrowRight } from "lucide-react"

export default function CasesPage() {
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
                            <Link href="/enterprise" className="text-sm font-medium hover:underline">
                                企业方案
                            </Link>
                            <Link href="/cases" className="text-sm font-medium hover:underline">
                                应用案例
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
                <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">行业应用案例</h1>
                            <p className="text-xl opacity-90 mb-10">探索 flowmix/print
                                如何在各行各业中提升工作效率，解决实际问题</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" variant="secondary" asChild>
                                    <Link href="/enterprise">企业方案</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 行业案例概览 */}
                <section id="cases" className="py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">行业应用案例</h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* 政府机构案例 */}
                            <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">政府机构</h3>
                                <p className="text-muted-foreground mb-4">
                                    政府部门使用flowmix/print可以实现了各类行政表格、证件和公文的标准化打印，提高工作效率和文档质量。
                                </p>
                            </div>

                            {/* 教育机构案例 */}
                            <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <GraduationCap className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">教育机构</h3>
                                <p className="text-muted-foreground mb-4">
                                    大学使用flowmix/print平台可以设计和打印各类证书、学生证、教材和教学资料，实现教育资源的标准化管理。
                                </p>

                            </div>

                            {/* 医疗机构案例 */}
                            <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <Stethoscope className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">医疗机构</h3>
                                <p className="text-muted-foreground mb-4">
                                    三甲医院使用flowmix/print可以实现病历、处方、检验报告等医疗文档的标准化打印，提高医疗服务质量。
                                </p>

                            </div>

                            {/* 零售行业案例 */}
                            <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                                    <ShoppingBag className="h-6 w-6 text-yellow-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">零售行业</h3>
                                <p className="text-muted-foreground mb-4">
                                    连锁零售企业使用flowmix/print平台可以设计和打印价格标签、促销海报和会员卡，提升品牌形象和营销效果。
                                </p>

                            </div>

                            {/* 物流行业案例 */}
                            <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                    <Truck className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">物流行业</h3>
                                <p className="text-muted-foreground mb-4">
                                    大型物流公司使用flowmix/print可以实现了运单、标签和包装材料的标准化打印，优化物流流程和客户体验。
                                </p>

                            </div>

                            {/* 制造业案例 */}
                            <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                    <Factory className="h-6 w-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">制造业</h3>
                                <p className="text-muted-foreground mb-4">
                                    制造企业使用flowmix/print可以设计和打印产品说明书、标签和质检报告，提高产品质量和客户满意度。
                                </p>

                            </div>
                        </div>
                    </div>
                </section>

                {/* 详细案例展示 - 政府机构 */}
                {/*<section id="government" className="py-20 bg-muted/30">*/}
                {/*    <div className="container mx-auto px-4">*/}
                {/*        <div className="flex flex-col lg:flex-row gap-12">*/}
                {/*            <div className="lg:w-1/2">*/}
                {/*                <div className="sticky top-20">*/}
                {/*                    <div className="flex items-center gap-3 mb-4">*/}
                {/*                        <Building2 className="h-8 w-8 text-blue-600" />*/}
                {/*                        <h2 className="text-3xl font-bold">政府机构应用案例</h2>*/}
                {/*                    </div>*/}
                {/*                    <p className="text-lg text-muted-foreground mb-6">*/}
                {/*                        某省级政府部门面临大量行政文书和表格的标准化打印需求，传统的办公软件难以满足其严格的格式要求和高效率需求。*/}
                {/*                    </p>*/}
                {/*                    <div className="space-y-4 mb-8">*/}
                {/*                        <div className="flex items-start">*/}
                {/*                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">*/}
                {/*                                <span className="text-blue-600 font-medium">1</span>*/}
                {/*                            </div>*/}
                {/*                            <div>*/}
                {/*                                <h3 className="font-medium mb-1">挑战</h3>*/}
                {/*                                <p className="text-muted-foreground">*/}
                {/*                                    需要处理大量不同类型的行政文书，包括公文、证件、表格等，且对格式和排版有严格要求*/}
                {/*                                </p>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                        <div className="flex items-start">*/}
                {/*                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">*/}
                {/*                                <span className="text-blue-600 font-medium">2</span>*/}
                {/*                            </div>*/}
                {/*                            <div>*/}
                {/*                                <h3 className="font-medium mb-1">解决方案</h3>*/}
                {/*                                <p className="text-muted-foreground">*/}
                {/*                                    部署私有化打印平台，预设各类文档模板，集成现有OA系统，实现一键生成标准化文档*/}
                {/*                                </p>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                        <div className="flex items-start">*/}
                {/*                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">*/}
                {/*                                <span className="text-blue-600 font-medium">3</span>*/}
                {/*                            </div>*/}
                {/*                            <div>*/}
                {/*                                <h3 className="font-medium mb-1">成果</h3>*/}
                {/*                                <p className="text-muted-foreground">*/}
                {/*                                    文档处理效率提升65%，纸张浪费减少40%，文档质量和规范性显著提高*/}
                {/*                                </p>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                    <Button asChild>*/}
                {/*                        <Link href="/enterprise">了解私有化部署方案</Link>*/}
                {/*                    </Button>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className="lg:w-1/2">*/}
                {/*                <div className="bg-white rounded-lg shadow-md overflow-hidden">*/}
                {/*                    <img*/}
                {/*                        src="/placeholder.svg?height=400&width=600"*/}
                {/*                        alt="政府文档管理系统界面"*/}
                {/*                        className="w-full h-auto"*/}
                {/*                    />*/}
                {/*                    <div className="p-6">*/}
                {/*                        <h3 className="text-xl font-semibold mb-4">系统功能亮点</h3>*/}
                {/*                        <ul className="space-y-3">*/}
                {/*                            <li className="flex items-start">*/}
                {/*                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">*/}
                {/*                                    <span className="text-blue-600 text-xs">✓</span>*/}
                {/*                                </div>*/}
                {/*                                <p>严格的权限管理，确保文档安全</p>*/}
                {/*                            </li>*/}
                {/*                            <li className="flex items-start">*/}
                {/*                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">*/}
                {/*                                    <span className="text-blue-600 text-xs">✓</span>*/}
                {/*                                </div>*/}
                {/*                                <p>预设多种公文模板，符合国家标准</p>*/}
                {/*                            </li>*/}
                {/*                            <li className="flex items-start">*/}
                {/*                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">*/}
                {/*                                    <span className="text-blue-600 text-xs">✓</span>*/}
                {/*                                </div>*/}
                {/*                                <p>与现有OA系统无缝集成，数据自动填充</p>*/}
                {/*                            </li>*/}
                {/*                            <li className="flex items-start">*/}
                {/*                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">*/}
                {/*                                    <span className="text-blue-600 text-xs">✓</span>*/}
                {/*                                </div>*/}
                {/*                                <p>批量生成和打印功能，提高工作效率</p>*/}
                {/*                            </li>*/}
                {/*                            <li className="flex items-start">*/}
                {/*                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">*/}
                {/*                                    <span className="text-blue-600 text-xs">✓</span>*/}
                {/*                                </div>*/}
                {/*                                <p>文档版本管理，支持历史记录查询</p>*/}
                {/*                            </li>*/}
                {/*                        </ul>*/}

                {/*                        <div className="mt-8 pt-6 border-t">*/}
                {/*                            <blockquote className="italic text-muted-foreground">*/}
                {/*                                "flowmix/print*/}
                {/*                                平台帮助我们实现了行政文书的标准化和高效处理，大大提升了工作效率，减少了人为错误，是我们数字化转型的重要一步。"*/}
                {/*                            </blockquote>*/}
                {/*                            <div className="mt-4 flex items-center">*/}
                {/*                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">*/}
                {/*                                    <Users className="h-5 w-5 text-blue-600" />*/}
                {/*                                </div>*/}
                {/*                                <div>*/}
                {/*                                    <p className="font-medium">张主任</p>*/}
                {/*                                    <p className="text-sm text-muted-foreground">某省政府办公厅信息化处</p>*/}
                {/*                                </div>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</section>*/}

                {/* CTA部分 */}
                <section className="py-20 bg-primary text-primary-foreground">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">开始您的行业定制方案</h2>
                        <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                            无论您所在的行业有何特殊需求，我们都能提供专业的定制化解决方案
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="/enterprise#contact">联系我们</Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-transparent text-white border-white hover:bg-white/10"
                                asChild
                            >
                                <Link href="/editor">免费体验</Link>
                            </Button>
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

