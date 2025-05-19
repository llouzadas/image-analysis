import { type NextRequest, NextResponse } from "next/server"

// Esta é uma API simulada para testes de autenticação
// Em um ambiente real, você se conectaria à sua API .NET

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpoint, method, requestBody } = body

    // Simula um atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simula diferentes endpoints
    if (endpoint === "/api/auth/login") {
      const { username, password } = JSON.parse(requestBody)

      // Simula validação básica
      if (username && password) {
        return NextResponse.json({
          success: true,
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
          user: {
            id: 1,
            username,
            email: `${username}@example.com`,
            name: username.charAt(0).toUpperCase() + username.slice(1),
          },
          expiresIn: 3600,
        })
      } else {
        return NextResponse.json({ success: false, message: "Credenciais inválidas" }, { status: 401 })
      }
    }

    if (endpoint === "/api/auth/register") {
      const userData = JSON.parse(requestBody)

      // Simula validação básica
      if (userData.username && userData.email && userData.password) {
        return NextResponse.json({
          success: true,
          message: "Usuário registrado com sucesso",
          user: {
            id: Math.floor(Math.random() * 1000) + 10,
            username: userData.username,
            email: userData.email,
            name: userData.name || userData.username,
          },
        })
      } else {
        return NextResponse.json({ success: false, message: "Dados de usuário inválidos" }, { status: 400 })
      }
    }

    if (endpoint === "/api/auth/validate") {
      // Simula validação de token
      const authHeader = request.headers.get("Authorization")

      if (authHeader && authHeader.startsWith("Bearer ")) {
        return NextResponse.json({
          success: true,
          message: "Token válido",
          user: {
            id: 1,
            username: "johndoe",
            email: "john.doe@example.com",
            name: "John Doe",
          },
        })
      } else {
        return NextResponse.json({ success: false, message: "Token inválido ou expirado" }, { status: 401 })
      }
    }

    // Endpoint padrão para outros casos
    return NextResponse.json({ success: false, message: "Endpoint não implementado" }, { status: 404 })
  } catch (error) {
    console.error("Erro na API de teste:", error)
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 })
  }
}
