"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type Conversation } from "./conversation-item"

interface ConversationDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversation: Conversation | null
  messageCount?: number
}

export function ConversationDetailsModal({
  open,
  onOpenChange,
  conversation,
  messageCount = 0,
}: ConversationDetailsModalProps) {
  if (!conversation) return null

  const createdDate = new Date(conversation.createdAt)
  const updatedDate = conversation.updatedAt
    ? new Date(conversation.updatedAt)
    : createdDate

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Conversation Details</DialogTitle>
          <DialogDescription>
            Information about this conversation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Title
            </p>
            <p className="text-sm text-card-foreground">{conversation.title}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Conversation ID
            </p>
            <p className="text-xs font-mono text-muted-foreground break-all">
              {conversation.id}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Created
            </p>
            <p className="text-sm text-card-foreground">{formatDate(createdDate)}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Last Updated
            </p>
            <p className="text-sm text-card-foreground">{formatDate(updatedDate)}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Messages
            </p>
            <p className="text-sm text-card-foreground">{messageCount} message{messageCount !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
