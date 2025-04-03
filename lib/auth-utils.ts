import type { User } from "@/types/user"

// 模拟有效的激活码列表
const VALID_ACTIVATION_CODES = ["FLOW2024", "MIX2024", "PRINT2024", "EDITOR2024"]

// 从本地存储获取用户
export const getStoredUser = (): User | null => {
    if (typeof window === "undefined") return null

    const storedUser = localStorage.getItem("flowmix_user")
    if (!storedUser) return null

    try {
        return JSON.parse(storedUser)
    } catch (error) {
        console.error("Failed to parse stored user:", error)
        return null
    }
}

// 保存用户到本地存储
export const storeUser = (user: User): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("flowmix_user", JSON.stringify(user))
}

// 清除存储的用户
export const clearStoredUser = (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem("flowmix_user")
}

// 验证激活码
export const validateActivationCode = (code: string): boolean => {
    return VALID_ACTIVATION_CODES.includes(code)
}

// 模拟用户注册
export const registerUser = (
    username: string,
    password: string,
    activationCode: string,
): { success: boolean; message: string; user?: User } => {
    // 验证激活码
    if (!validateActivationCode(activationCode)) {
        return { success: false, message: "无效的激活码" }
    }

    // 检查用户名是否已存在
    const users = getAllUsers()
    if (users.some((user) => user.username === username)) {
        return { success: false, message: "用户名已存在" }
    }

    // 创建新用户
    const newUser: User = {
        id: Date.now().toString(),
        username,
        password, // 实际应用中应该哈希处理
        activationCode,
        createdAt: new Date().toISOString(),
    }

    // 保存用户
    storeUser(newUser)
    saveUserToList(newUser)

    return {
        success: true,
        message: "注册成功",
        user: newUser,
    }
}

// 模拟用户登录
export const loginUser = (username: string, password: string): { success: boolean; message: string; user?: User } => {
    const users = getAllUsers()
    const user = users.find((u) => u.username === username)

    if (!user) {
        return { success: false, message: "用户不存在" }
    }

    if (user.password !== password) {
        // 实际应用中应该比较哈希值
        return { success: false, message: "密码错误" }
    }

    // 更新最后登录时间
    const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString(),
    }

    // 保存更新后的用户
    storeUser(updatedUser)
    updateUserInList(updatedUser)

    return {
        success: true,
        message: "登录成功",
        user: updatedUser,
    }
}

// 获取所有用户（从本地存储）
export const getAllUsers = (): User[] => {
    if (typeof window === "undefined") return []

    const storedUsers = localStorage.getItem("flowmix_users")
    if (!storedUsers) return []

    try {
        return JSON.parse(storedUsers)
    } catch (error) {
        console.error("Failed to parse stored users:", error)
        return []
    }
}

// 保存用户到用户列表
export const saveUserToList = (user: User): void => {
    if (typeof window === "undefined") return

    const users = getAllUsers()
    users.push(user)
    localStorage.setItem("flowmix_users", JSON.stringify(users))
}

// 更新用户列表中的用户
export const updateUserInList = (updatedUser: User): void => {
    if (typeof window === "undefined") return

    const users = getAllUsers()
    const index = users.findIndex((u) => u.id === updatedUser.id)

    if (index !== -1) {
        users[index] = updatedUser
        localStorage.setItem("flowmix_users", JSON.stringify(users))
    }
}

// 检查用户是否已认证
export const isAuthenticated = (): boolean => {
    return !!getStoredUser()
}

// 登出用户
export const logoutUser = (): void => {
    clearStoredUser()
}

