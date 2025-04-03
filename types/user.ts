export interface User {
    id: string
    username: string
    password: string // 实际应用中应该存储哈希值而非明文密码
    email?: string
    activationCode?: string
    createdAt: string
    lastLogin?: string
}

export interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}

