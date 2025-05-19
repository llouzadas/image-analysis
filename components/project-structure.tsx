import { Folder, FileCode, FileJson, FileText } from "lucide-react"

export function ProjectStructure() {
  return (
    <div className="space-y-1 text-sm">
      <div className="flex items-center gap-2 font-medium">
        <Folder className="h-4 w-4 text-muted-foreground" />
        <span>AuthApi/</span>
      </div>
      <div className="ml-6 space-y-1">
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-muted-foreground" />
          <span>Controllers/</span>
        </div>
        <div className="ml-6 flex items-center gap-2">
          <FileCode className="h-4 w-4 text-blue-500" />
          <span>AuthController.cs</span>
        </div>
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-muted-foreground" />
          <span>Models/</span>
        </div>
        <div className="ml-6 flex items-center gap-2">
          <FileCode className="h-4 w-4 text-blue-500" />
          <span>User.cs</span>
        </div>
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-blue-500" />
          <span>Program.cs</span>
        </div>
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-blue-500" />
          <span>Startup.cs</span>
        </div>
        <div className="flex items-center gap-2">
          <FileJson className="h-4 w-4 text-yellow-500" />
          <span>appsettings.json</span>
        </div>
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-blue-500" />
          <span>AuthApi.csproj</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span>README.md</span>
        </div>
      </div>
    </div>
  )
}
