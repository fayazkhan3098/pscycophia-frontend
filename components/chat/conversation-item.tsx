"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { ConversationActions } from "./conversation-actions"
import { Input } from "@/components/ui/input"

export interface Conversation {
  id: string
  title: string
  createdAt: Date
  updatedAt?: Date
}

interface ConversationItemProps {
  conversation: Conversation
  isSelected: boolean
  onClick: (id: string) => void
  onRename?: (id: string, newTitle: string) => void
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
  onShare?: (id: string) => void
  onViewDetails?: (id: string) => void
  onActionMenuOpen?: (isOpen: boolean) => void
}

export function ConversationItem({
  conversation,
  isSelected,
  onClick,
  onRename,
  onDelete,
  onDuplicate,
  onShare,
  onViewDetails,
  onActionMenuOpen,
}: ConversationItemProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [editValue, setEditValue] = useState(conversation.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isRenaming])

  const handleRenameStart = () => {
    setIsRenaming(true)
    setEditValue(conversation.title)
  }

  const handleRenameSave = () => {
    if (editValue.trim() && editValue !== conversation.title) {
      onRename?.(conversation.id, editValue.trim())
    }
    setIsRenaming(false)
  }

  const handleRenameCancel = () => {
    setIsRenaming(false)
    setEditValue(conversation.title)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRenameSave()
    } else if (e.key === "Escape") {
      handleRenameCancel()
    }
  }

  if (isRenaming) {
    return (
      <div className="flex items-center gap-2 rounded-lg px-3 py-1.5">
        <MessageCircle className="h-3.5 w-3.5 flex-shrink-0 text-sidebar-foreground" />
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleRenameSave}
          onKeyDown={handleKeyDown}
          placeholder="Enter new title"
          className="h-6 text-sm bg-sidebar border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground px-2 py-1"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all duration-150",
        isSelected
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50",
      )}
    >
      <button
        onClick={() => onClick(conversation.id)}
        className="flex-1 flex items-center gap-2.5 min-w-0 text-left"
      >
        <MessageCircle className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="text-sm truncate">{conversation.title}</span>
      </button>

      <div className="opacity-0 transition-opacity group-hover:opacity-100">
        <ConversationActions
          onRename={handleRenameStart}
          onDelete={() => onDelete?.(conversation.id)}
          onDuplicate={() => onDuplicate?.(conversation.id)}
          onShare={() => onShare?.(conversation.id)}
          onViewDetails={() => onViewDetails?.(conversation.id)}
        />
      </div>
    </div>
  )
}
