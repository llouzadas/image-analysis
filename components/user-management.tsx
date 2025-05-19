"use client"

import { useState, useEffect } from "react"
import { Search, Plus, MoreHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { UserDialog } from "@/components/user-dialog"

interface User {
  id: number
  username: string
  email: string
  name: string
  status: "active" | "inactive" | "locked"
  role: string
  lastLogin: string
}

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Busca usuários da API
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)
        const response = await fetch("/api/users")

        if (!response.ok) {
          throw new Error("Falha ao carregar usuários")
        }

        const data = await response.json()
        setUsers(data.users)
        setFilteredUsers(data.users)
        setError(null)
      } catch (err) {
        console.error("Erro ao buscar usuários:", err)
        setError("Não foi possível carregar a lista de usuários")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filtra usuários com base na pesquisa
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.name.toLowerCase().includes(query),
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  // Abre o diálogo para adicionar um novo usuário
  const handleAddUser = () => {
    setCurrentUser(null)
    setIsDialogOpen(true)
  }

  // Abre o diálogo para editar um usuário existente
  const handleEditUser = (user: User) => {
    setCurrentUser(user)
    setIsDialogOpen(true)
  }

  // Salva um usuário (novo ou editado)
  const handleSaveUser = async (userData: Partial<User>) => {
    setIsProcessing(true)

    try {
      if (currentUser) {
        // Atualiza um usuário existente
        const response = await fetch(`/api/users/${currentUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })

        if (!response.ok) {
          throw new Error("Falha ao atualizar usuário")
        }

        const data = await response.json()

        // Atualiza a lista de usuários
        setUsers(users.map((user) => (user.id === currentUser.id ? data.user : user)))

        toast({
          title: "Usuário atualizado",
          description: `${data.user.name} foi atualizado com sucesso.`,
        })
      } else {
        // Cria um novo usuário
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })

        if (!response.ok) {
          throw new Error("Falha ao criar usuário")
        }

        const data = await response.json()

        // Adiciona o novo usuário à lista
        setUsers([...users, data.user])

        toast({
          title: "Usuário criado",
          description: `${data.user.name} foi criado com sucesso.`,
        })
      }

      setIsDialogOpen(false)
    } catch (err) {
      console.error("Erro ao salvar usuário:", err)
      toast({
        variant: "destructive",
        title: "Erro",
        description: err instanceof Error ? err.message : "Erro ao salvar usuário",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Altera o status de um usuário
  const handleToggleStatus = async (user: User) => {
    setIsProcessing(true)

    try {
      const newStatus = user.status === "active" ? "inactive" : "active"

      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar status do usuário")
      }

      const data = await response.json()

      // Atualiza a lista de usuários
      setUsers(users.map((u) => (u.id === user.id ? data.user : u)))

      toast({
        title: "Status atualizado",
        description: `${data.user.name} agora está ${newStatus === "active" ? "ativo" : "inativo"}.`,
      })
    } catch (err) {
      console.error("Erro ao alterar status:", err)
      toast({
        variant: "destructive",
        title: "Erro",
        description: err instanceof Error ? err.message : "Erro ao alterar status",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Exclui um usuário
  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir usuário")
      }

      // Remove o usuário da lista
      setUsers(users.filter((u) => u.id !== user.id))

      toast({
        title: "Usuário excluído",
        description: `${user.name} foi excluído com sucesso.`,
      })
    } catch (err) {
      console.error("Erro ao excluir usuário:", err)
      toast({
        variant: "destructive",
        title: "Erro",
        description: err instanceof Error ? err.message : "Erro ao excluir usuário",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="rounded-md bg-destructive/15 p-4 text-center text-destructive">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuários..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleAddUser} disabled={isProcessing}>
          {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Adicionar Usuário
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Função</TableHead>
              <TableHead className="hidden md:table-cell">Último Login</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : user.status === "inactive" ? "outline" : "destructive"
                      }
                    >
                      {user.status === "active" ? "ativo" : user.status === "inactive" ? "inativo" : "bloqueado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role === "admin" ? "administrador" : "usuário"}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.lastLogin}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isProcessing}>
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>Editar usuário</DropdownMenuItem>
                        <DropdownMenuItem>Redefinir senha</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                          {user.status === "active" ? "Desativar" : "Ativar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user)}>
                          Excluir usuário
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={currentUser}
        onSave={handleSaveUser}
        isProcessing={isProcessing}
      />
    </div>
  )
}
