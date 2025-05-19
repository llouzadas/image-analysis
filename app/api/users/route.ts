import { NextResponse } from "next/server"

// Esta é uma API simulada para gerenciamento de usuários
// Em um ambiente real, você se conectaria à sua API .NET

export async function GET() {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Lista de usuários simulados
  const users = [
    {
      id: 1,
      username: "johndoe",
      email: "john.doe@example.com",
      name: "John Doe",
      status: "active",
      role: "admin",
      lastLogin: "2023-05-18 14:32:45",
    },
    {
      id: 2,
      username: "janesmith",
      email: "jane.smith@example.com",
      name: "Jane Smith",
      status: "active",
      role: "user",
      lastLogin: "2023-05-17 09:15:22",
    },
    {
      id: 3,
      username: "bobwilson",
      email: "bob.wilson@example.com",
      name: "Bob Wilson",
      status: "inactive",
      role: "user",
      lastLogin: "2023-05-10 18:45:11",
    },
    {
      id: 4,
      username: "alicejohnson",
      email: "alice.johnson@example.com",
      name: "Alice Johnson",
      status: "active",
      role: "user",
      lastLogin: "2023-05-16 11:22:33",
    },
    {
      id: 5,
      username: "charlielee",
      email: "charlie.lee@example.com",
      name: "Charlie Lee",
      status: "locked",
      role: "user",
      lastLogin: "2023-05-05 15:18:27",
    },
  ]

  return NextResponse.json({ users })
}

export async function POST(request: Request) {
  try {
    const userData = await request.json()

    // Validação básica
    if (!userData.username || !userData.email) {
      return NextResponse.json({ success: false, message: "Dados de usuário inválidos" }, { status: 400 })
    }

    // Simula a criação de um novo usuário
    const newUser = {
      id: Math.floor(Math.random() * 1000) + 10,
      username: userData.username,
      email: userData.email,
      name: userData.name || userData.username,
      status: "active",
      role: userData.role || "user",
      lastLogin: "Nunca",
    }

    return NextResponse.json({ success: true, user: newUser })
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 })
  }
}
