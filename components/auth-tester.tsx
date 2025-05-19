"use client"

import { useState } from "react"
import { Check, Copy, Play, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export function AuthTester() {
  const [endpoint, setEndpoint] = useState("/api/auth/login")
  const [method, setMethod] = useState("POST")
  const [requestBody, setRequestBody] = useState(
    JSON.stringify(
      {
        username: "johndoe",
        password: "password123",
      },
      null,
      2,
    ),
  )
  const [response, setResponse] = useState("")
  const [token, setToken] = useState("")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)

    try {
      // Faz uma chamada real para a API de teste
      const response = await fetch("/api/auth-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint,
          method,
          requestBody,
        }),
      })

      const data = await response.json()

      // Formata a resposta para exibição
      setResponse(JSON.stringify(data, null, 2))

      // Se for uma resposta de login bem-sucedida, extrai o token
      if (endpoint === "/api/auth/login" && data.success && data.token) {
        setToken(data.token)
      }

      // Notifica o usuário sobre o resultado
      if (data.success) {
        toast({
          title: "Requisição bem-sucedida",
          description: `Endpoint ${endpoint} respondeu com sucesso.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Erro na requisição",
          description: data.message || "A requisição falhou.",
        })
      }
    } catch (error) {
      console.error("Erro ao testar endpoint:", error)
      setResponse(
        JSON.stringify(
          {
            error: "Falha ao conectar com o servidor",
          },
          null,
          2,
        ),
      )

      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToken = () => {
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Token copiado",
      description: "O token JWT foi copiado para a área de transferência.",
    })
  }

  // Atualiza o corpo da requisição com base no endpoint selecionado
  const updateRequestBodyTemplate = (newEndpoint: string) => {
    if (newEndpoint === "/api/auth/login") {
      setRequestBody(
        JSON.stringify(
          {
            username: "johndoe",
            password: "password123",
          },
          null,
          2,
        ),
      )
    } else if (newEndpoint === "/api/auth/register") {
      setRequestBody(
        JSON.stringify(
          {
            username: "newuser",
            email: "newuser@example.com",
            password: "securepassword",
            name: "New User",
          },
          null,
          2,
        ),
      )
    } else if (newEndpoint === "/api/auth/validate") {
      setRequestBody(
        JSON.stringify(
          {
            token: token || "seu-token-jwt-aqui",
          },
          null,
          2,
        ),
      )
    } else if (newEndpoint === "/api/auth/refresh") {
      setRequestBody(
        JSON.stringify(
          {
            refreshToken: "seu-refresh-token-aqui",
          },
          null,
          2,
        ),
      )
    }
  }

  const handleEndpointChange = (value: string) => {
    setEndpoint(value)
    updateRequestBodyTemplate(value)
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="request" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="request">Requisição</TabsTrigger>
          <TabsTrigger value="response">Resposta</TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <Label htmlFor="method">Método</Label>
              <Select value={method} onValueChange={setMethod} disabled={loading}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-3">
              <Label htmlFor="endpoint">Endpoint</Label>
              <Select value={endpoint} onValueChange={handleEndpointChange} disabled={loading}>
                <SelectTrigger id="endpoint">
                  <SelectValue placeholder="Endpoint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="/api/auth/login">Login</SelectItem>
                  <SelectItem value="/api/auth/register">Registro</SelectItem>
                  <SelectItem value="/api/auth/validate">Validar Token</SelectItem>
                  <SelectItem value="/api/auth/refresh">Atualizar Token</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="request-body">Corpo da Requisição</Label>
            <Textarea
              id="request-body"
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="font-mono h-[200px]"
              disabled={loading}
            />
          </div>

          <Button onClick={handleTest} className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            Testar Endpoint
          </Button>
        </TabsContent>

        <TabsContent value="response" className="space-y-4">
          {token && (
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center justify-between">
                <Label>Token JWT</Label>
                <Button variant="ghost" size="sm" onClick={copyToken} className="h-8 px-2" disabled={loading}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="mt-2 overflow-x-auto rounded border bg-background p-2">
                <code className="text-xs break-all">{token}</code>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="response-body">Resposta</Label>
            <Textarea id="response-body" value={response} readOnly className="font-mono h-[200px]" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
