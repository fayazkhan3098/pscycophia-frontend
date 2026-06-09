"use client"

import { MoreVertical, Edit2, Trash2, Copy, Share2, Info } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface ConversationActionsProps {
  onRename: () => void
  onDelete: () => void
  onDuplicate: () => void
  onShare: () => void
  onViewDetails: () => void
}

export function ConversationActions({
  onRename,
  onDelete,
  onDuplicate,
  onShare,
  onViewDetails,
}: ConversationActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 text-muted-foreground hover:text-sidebar-foreground transition-colors"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open conversation menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 bg-card border-border"
      >
        <DropdownMenuItem
          onClick={onRename}
          className="cursor-pointer text-card-foreground hover:bg-sidebar-accent/50 focus:bg-sidebar-accent/50"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          <span>Rename Chat</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDuplicate}
          className="cursor-pointer text-card-foreground hover:bg-sidebar-accent/50 focus:bg-sidebar-accent/50"
        >
          <Copy className="h-4 w-4 mr-2" />
          <span>Duplicate Chat</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onShare}
          className="cursor-pointer text-card-foreground hover:bg-sidebar-accent/50 focus:bg-sidebar-accent/50"
        >
          <Share2 className="h-4 w-4 mr-2" />
          <span>Share Chat</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onViewDetails}
          className="cursor-pointer text-card-foreground hover:bg-sidebar-accent/50 focus:bg-sidebar-accent/50"
        >
          <Info className="h-4 w-4 mr-2" />
          <span>View Details</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          onClick={onDelete}
          className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          <span>Delete Chat</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
