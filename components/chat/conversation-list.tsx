"use client"

import { ConversationItem, type Conversation } from "./conversation-item"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onRename?: (id: string, newTitle: string) => void
  onDuplicate?: (id: string) => void
  onShare?: (id: string) => void
  onViewDetails?: (id: string) => void
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onDelete,
  onRename,
  onDuplicate,
  onShare,
  onViewDetails,
}: ConversationListProps) {
  return (
    <ScrollArea className="flex-1 border-t border-border">
      <div className="flex flex-col">
        {conversations.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground py-8 px-3">
            No conversations yet. Start a new chat!
          </p>
        ) : (
          <>
            <div className="px-3 py-2 mt-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recent Chats</p>
            </div>
            <div className="space-y-1 px-2">
              {conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedId === conversation.id}
                  onClick={onSelect}
                  onDelete={onDelete}
                  onRename={onRename}
                  onDuplicate={onDuplicate}
                  onShare={onShare}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  )
}
