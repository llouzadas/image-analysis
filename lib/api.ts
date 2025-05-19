// Funções para comunicação com a API AuthApi

// URL base da API - em produção, isso viria de variáveis de ambiente
const API_BASE_URL = "https://authapi-env.us-east-1.elasticbeanstalk.com/api"

// Interface para resposta de erro
interface ApiError {
  message: string
  statusCode: number
}

// Interface para resposta de sucesso
interface ApiResponse<T> {
  data?: T
  error?: ApiError
}

// Função genérica para fazer chamadas à API
export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`

    // Configuração padrão para todas as requisições
    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }

    // Mescla as opções padrão com as opções fornecidas
    const fetchOptions = { ...defaultOptions, ...options }

    const response = await fetch(url, fetchOptions)

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      const errorData = await response.json()
      return {
        error: {
          message: errorData.message || "Ocorreu um erro na requisição",
          statusCode: response.status,
        },
      }
    }

    // Retorna os dados da resposta
    const data = await response.json()
    return { data }
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : "Erro desconhecido",
        statusCode: 500,
      },
    }
  }
}

// Funções específicas para autenticação
export async function login(username: string, password: string) {
  return fetchApi("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
}

export async function register(userData: {
  username: string
  email: string
  password: string
  name: string
}) {
  return fetchApi("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

export async function validateToken(token: string) {
  return fetchApi("/auth/validate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function refreshToken(refreshToken: string) {
  return fetchApi("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  })
}

// Funções para gerenciamento de usuários
export async function getUsers(token: string) {
  return fetchApi("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getUserById(id: number, token: string) {
  return fetchApi(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function createUser(userData: any, token: string) {
  return fetchApi("/users", {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function updateUser(id: number, userData: any, token: string) {
  return fetchApi(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function deleteUser(id: number, token: string) {
  return fetchApi(`/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Funções para obter dados de implantação
export async function getDeployments(token: string) {
  return fetchApi("/deployments", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Funções para obter métricas
export async function getMetrics(token: string) {
  return fetchApi("/metrics", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
