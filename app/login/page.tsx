"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { loginUser, isAuthenticated } from "@/lib/auth-utils"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        // 如果用户已登录，重定向到编辑器页面
        if (isAuthenticated()) {
            router.push("/editor")
        }
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = loginUser(username, password)

            if (result.success) {
                toast({
                    title: "登录成功",
                    description: "欢迎回来！",
                    variant: "default",
                })
                router.push("/editor")
            } else {
                toast({
                    title: "登录失败",
                    description: result.message,
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "登录失败",
                description: "发生未知错误，请稍后再试",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">登录</CardTitle>
                    <CardDescription className="text-center">输入您的用户名和密码登录</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">用户名</Label>
                            <Input
                                id="username"
                                placeholder="请输入用户名"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">密码</Label>
                                {/*<Link*/}
                                {/*    href="#"*/}
                                {/*    className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"*/}
                                {/*>*/}
                                {/*    忘记密码?*/}
                                {/*</Link>*/}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="请输入密码"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "登录中..." : "登录"}
                        </Button>
                        <div className="text-center text-sm">
                            还没有账号?{" "}
                            <Link
                                href="/register"
                                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                注册
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

