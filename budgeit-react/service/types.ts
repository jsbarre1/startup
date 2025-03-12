import { UUID } from "crypto"

export interface User {
    email: string
    password: string
    token?: UUID
}

export interface Score {
    score: number
    username: string
}