"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { registerUser, isAuthenticated } from "@/lib/auth-utils"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [activationCode, setActivationCode] = useState("")
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

        // 验证密码
        if (password !== confirmPassword) {
            toast({
                title: "密码不匹配",
                description: "请确保两次输入的密码相同",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        try {
            const result = registerUser(username, password, activationCode)

            if (result.success) {
                toast({
                    title: "注册成功",
                    description: "您已成功注册，现在可以使用编辑器了！",
                    variant: "default",
                })
                router.push("/editor")
            } else {
                toast({
                    title: "注册失败",
                    description: result.message,
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "注册失败",
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
                    <CardTitle className="text-2xl font-bold text-center">注册</CardTitle>
                    <CardDescription className="text-center">创建一个新账户以使用编辑器</CardDescription>
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
                            <Label htmlFor="password">密码</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="请输入密码"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">确认密码</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="请再次输入密码"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="activationCode">激活码</Label>
                            <Input
                                id="activationCode"
                                placeholder="请输入激活码"
                                value={activationCode}
                                onChange={(e) => setActivationCode(e.target.value)}
                                required
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                激活码用于验证您的账户，如果您没有激活码，请联系管理员
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "注册中..." : "注册"}
                        </Button>
                        <div className="text-center text-sm">
                            已有账号?{" "}
                            <Link
                                href="/login"
                                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                登录
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

