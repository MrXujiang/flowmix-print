"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import PrintEditor from "@/components/editor/print-editor"
import { isAuthenticated } from "@/lib/auth-utils"
import { useToast } from "@/components/ui/use-toast"

export default function EditorPage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // 检查用户是否已登录
    if (!isAuthenticated()) {
      toast({
        title: "需要登录",
        description: "请先登录后再访问编辑器",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [router, toast])

  return <PrintEditor />
}


