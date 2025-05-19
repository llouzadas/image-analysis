import { type NextRequest, NextResponse } from "next/server"

// Esta é uma API simulada para gerenciamento de usuários
// Em um ambiente real, você se conectaria à sua API .NET

// Usuários simulados
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 200))

  const id = Number.parseInt(params.id)
  const user = users.find((u) => u.id === id)

  if (!user) {
    return NextResponse.json({ success: false, message: "Usuário não encontrado" }, { status: 404 })
  }

  return NextResponse.json({ success: true, user })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Simula um atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 300))

    const id = Number.parseInt(params.id)
    const userData = await request.json()

    // Verifica se o usuário existe
    const userIndex = users.findIndex((u) => u.id === id)

    if (userIndex === -1) {
      return NextResponse.json({ success: false, message: "Usuário não encontrado" }, { status: 404 })
    }

    // Simula a atualização do usuário
    const updatedUser = {
      ...users[userIndex],
      ...userData,
      id, // Mantém o ID original
    }

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 300))

  const id = Number.parseInt(params.id)

  // Verifica se o usuário existe
  const userExists = users.some((u) => u.id === id)

  if (!userExists) {
    return NextResponse.json({ success: false, message: "Usuário não encontrado" }, { status: 404 })
  }

  // Simula a exclusão do usuário
  return NextResponse.json({
    success: true,
    message: `Usuário com ID ${id} excluído com sucesso`,
  })
}
