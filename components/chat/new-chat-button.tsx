"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NewChatButtonProps {
  onClick: () => void
  className?: string
}

export function NewChatButton({ onClick, className }: NewChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={cn(
        "w-full justify-start gap-2 rounded-3xl border border-border bg-sidebar-accent/50 hover:bg-sidebar-accent text-sidebar-foreground transition-colors",
        className,
      )}
    >
      <Plus className="h-4 w-4" />
      <span className="text-sm font-medium">New Chat</span>
    </Button>
  )
}
