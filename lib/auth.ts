"use server"

import { cookies } from "next/headers"
import { login, register, validateToken } from "./api"

// Função para autenticar usuário
export async function authenticateUser(username: string, password: string) {
  const response = await login(username, password)

  if (response.error) {
    return { success: false, error: response.error.message }
  }

  if (response.data) {
    // Armazena o token em um cookie seguro
    const cookieStore = cookies()
    cookieStore.set("auth-token", response.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hora
      path: "/",
    })

    return {
      success: true,
      user: response.data.user,
      expiresIn: response.data.expiresIn,
    }
  }

  return { success: false, error: "Falha na autenticação" }
}

// Função para registrar um novo usuário
export async function registerUser(userData: {
  username: string
  email: string
  password: string
  name: string
}) {
  const response = await register(userData)

  if (response.error) {
    return { success: false, error: response.error.message }
  }

  if (response.data) {
    return { success: true, user: response.data.user }
  }

  return { success: false, error: "Falha no registro" }
}

// Função para verificar se o usuário está autenticado
export async function isAuthenticated() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    return { authenticated: false }
  }

  const response = await validateToken(token.value)

  if (response.error || !response.data) {
    // Token inválido, remove o cookie
    cookieStore.delete("auth-token")
    return { authenticated: false }
  }

  return { authenticated: true, user: response.data.user }
}

// Função para fazer logout
export async function logout() {
  const cookieStore = cookies()
  cookieStore.delete("auth-token")
  return { success: true }
}

// Função para obter o token atual
export async function getCurrentToken() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")
  return token?.value
}
