import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

// 修改网站标题和元数据
export const metadata: Metadata = {
    title: {
        default: "flowmix/print - 专业可视化打印设计平台",
        template: "%s | flowmix/print",
    },
    description:
        "一款功能强大的在线打印编辑器，支持自定义画布尺寸、多种内容元素、拖拽设计、参考线和吸附功能、高质量导出和多页面管理。",
    keywords: "打印编辑器, 在线设计, 可视化编辑, PDF导出, 打印设计, flowmix, 表格打印, 标签打印, 报表设计",
    authors: [{ name: "flowmix Team" }],
    creator: "flowmix",
    publisher: "flowmix",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: "website",
        locale: "zh_CN",
        url: "https://flowmix.com",
        title: "flowmix/print - 专业可视化打印设计平台",
        description:
            "一款功能强大的在线打印编辑器，支持自定义画布尺寸、多种内容元素、拖拽设计、参考线和吸附功能、高质量导出和多页面管理。",
        siteName: "flowmix/print",
    },
    twitter: {
        card: "summary_large_image",
        title: "flowmix/print - 专业可视化打印设计平台",
        description:
            "一款功能强大的在线打印编辑器，支持自定义画布尺寸、多种内容元素、拖拽设计、参考线和吸附功能、高质量导出和多页面管理。",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="zh-CN" suppressHydrationWarning>
        <head>
            {/* 结构化数据 - 组织信息 */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        name: "flowmix/print",
                        url: "https://flowmix.com",
                        logo: "https://flowmix.com/logo.png",
                        description: "专业可视化打印设计平台",
                        sameAs: ["https://twitter.com/flowmix", "https://www.linkedin.com/company/flowmix"],
                    }),
                }}
            />
            {/* 结构化数据 - 软件应用 */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        name: "flowmix/print",
                        operatingSystem: "Web",
                        applicationCategory: "DesignApplication",
                        offers: {
                            "@type": "Offer",
                            price: "0",
                            priceCurrency: "CNY",
                        },
                    }),
                }}
            />
        </head>
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
        </ThemeProvider>
        </body>
        </html>
    )
}

