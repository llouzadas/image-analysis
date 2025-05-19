import { NextResponse } from "next/server"

// Esta é uma API simulada para dados de implantação
// Em um ambiente real, você se conectaria à sua API .NET ou AWS

export async function GET() {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 400))

  // Lista de implantações simuladas
  const deployments = [
    {
      id: "v-42",
      date: "2023-05-18 14:32:45",
      status: "success",
      branch: "main",
      commit: "8f4d76a",
      message: "Add password reset functionality",
      deployer: "john.doe@example.com",
    },
    {
      id: "v-41",
      date: "2023-05-16 09:15:22",
      status: "success",
      branch: "main",
      commit: "3e2c19b",
      message: "Update JWT expiration time",
      deployer: "jane.smith@example.com",
    },
    {
      id: "v-40",
      date: "2023-05-14 18:45:11",
      status: "failed",
      branch: "feature/mfa",
      commit: "7a9c24d",
      message: "Implement multi-factor authentication",
      deployer: "john.doe@example.com",
    },
    {
      id: "v-39",
      date: "2023-05-12 11:22:33",
      status: "success",
      branch: "main",
      commit: "5b2e8f1",
      message: "Fix user registration validation",
      deployer: "jane.smith@example.com",
    },
    {
      id: "v-38",
      date: "2023-05-10 15:18:27",
      status: "success",
      branch: "main",
      commit: "2d9a6c4",
      message: "Update BCrypt work factor",
      deployer: "john.doe@example.com",
    },
    {
      id: "v-37",
      date: "2023-05-08 10:05:19",
      status: "warning",
      branch: "main",
      commit: "1f8e7d3",
      message: "Optimize token validation",
      deployer: "jane.smith@example.com",
    },
    {
      id: "v-36",
      date: "2023-05-06 16:42:51",
      status: "success",
      branch: "main",
      commit: "9c4b2a8",
      message: "Add role-based authorization",
      deployer: "john.doe@example.com",
    },
    {
      id: "v-35",
      date: "2023-05-04 13:11:05",
      status: "success",
      branch: "main",
      commit: "6e5d3f2",
      message: "Implement refresh tokens",
      deployer: "jane.smith@example.com",
    },
    {
      id: "v-34",
      date: "2023-05-02 09:33:47",
      status: "success",
      branch: "main",
      commit: "4a7b9c1",
      message: "Update user model",
      deployer: "john.doe@example.com",
    },
    {
      id: "v-33",
      date: "2023-04-30 17:25:38",
      status: "success",
      branch: "main",
      commit: "8d2c6e4",
      message: "Initial deployment",
      deployer: "jane.smith@example.com",
    },
  ]

  return NextResponse.json({ deployments })
}
