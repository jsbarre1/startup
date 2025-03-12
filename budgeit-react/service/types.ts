

export type UUID = string
export interface User {
    email: string
    password: string
    token?: UUID
}

export interface Score {
    score: number
    userName: string
}