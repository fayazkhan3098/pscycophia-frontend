"use client"

import { useState } from "react"
import { Brain, Info, AlertTriangle, User, Github, Linkedin, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { NewChatButton } from "./new-chat-button"
import { ConversationList } from "./conversation-list"
import { type Conversation } from "./conversation-item"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { ConversationDetailsModal } from "./conversation-details-modal"
import { ShareModal } from "./share-modal"

interface SidebarProps {
  className?: string
  conversations?: Conversation[]
  selectedConversationId?: string | null
  onNewChat?: () => void
  onSelectConversation?: (id: string) => void
  onDeleteConversation?: (id: string) => void
  onRenameConversation?: (id: string, title: string) => void
  onDuplicateConversation?: (id: string) => void
  onShareConversation?: (id: string) => void
  messageCountByConversation?: Record<string, number>
}

const MOCK_CONVERSATIONS: Conversation[] = [
  { id: "1", title: "Understanding Anxiety", createdAt: new Date(Date.now() - 86400000), updatedAt: new Date(Date.now() - 3600000) },
  { id: "2", title: "CBT Techniques", createdAt: new Date(Date.now() - 172800000), updatedAt: new Date(Date.now() - 86400000) },
  { id: "3", title: "Stress Management", createdAt: new Date(Date.now() - 259200000), updatedAt: new Date(Date.now() - 172800000) },
  { id: "4", title: "Depression Symptoms", createdAt: new Date(Date.now() - 345600000), updatedAt: new Date(Date.now() - 259200000) },
  { id: "5", title: "Sleep Psychology", createdAt: new Date(Date.now() - 432000000), updatedAt: new Date(Date.now() - 345600000) },
]

export function Sidebar({
  className,
  conversations = MOCK_CONVERSATIONS,
  selectedConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onDuplicateConversation,
  onShareConversation,
  messageCountByConversation = {},
}: SidebarProps) {
  const [aboutOpen, setAboutOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null)
  const [conversationToView, setConversationToView] = useState<Conversation | null>(null)
  const [conversationToShare, setConversationToShare] = useState<Conversation | null>(null)

  // Handlers for conversation actions
  const handleRenameConversation = (id: string, newTitle: string) => {
    onRenameConversation?.(id, newTitle)
  }

  const handleDeleteConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id)
    if (conv) {
      setConversationToDelete(conv)
      setDeleteConfirmOpen(true)
    }
  }

  const handleConfirmDelete = () => {
    if (conversationToDelete) {
      onDeleteConversation?.(conversationToDelete.id)
      setDeleteConfirmOpen(false)
      setConversationToDelete(null)
    }
  }

  const handleDuplicateConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id)
    if (conv) {
      onDuplicateConversation?.(id)
    }
  }

  const handleShareConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id)
    if (conv) {
      setConversationToShare(conv)
      setShareOpen(true)
      onShareConversation?.(id)
    }
  }

  const handleViewConversationDetails = (id: string) => {
    const conv = conversations.find((c) => c.id === id)
    if (conv) {
      setConversationToView(conv)
      setDetailsOpen(true)
    }
  }

  return (
    <aside className={cn(
      "flex flex-col w-72 flex-shrink-0 bg-sidebar border-r border-sidebar-border min-h-0 overflow-y-auto",
      className,
    )}>
      {/* Logo and Name */}
      <div className="p-4 flex items-center gap-3">
        <div className="rounded-lg bg-sidebar-primary/10 p-2">
          <Brain className="h-6 w-6 text-sidebar-primary" />
        </div>
        <div>
          <h1 className="font-semibold text-sidebar-foreground">Pscycophia</h1>
          <p className="text-xs text-muted-foreground">Psychology AI Assistant</p>
        </div>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      {/* About Dialog */}
      <div className="p-4">
        <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start bg-sidebar-accent border-sidebar-border hover:bg-sidebar-accent/80">
              <Info className="h-4 w-4 mr-2" />
              About Pscycophia
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-card-foreground">
                <Brain className="h-5 w-5 text-primary" />
                About Pscycophia
              </DialogTitle>
              <DialogDescription>
                Your AI-powered psychology assistant
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm text-card-foreground">
              <p>
                Pscycophia is an AI assistant designed to provide information about psychology, 
                mental health topics, therapy techniques, and emotional well-being.
              </p>
              <p>
                Powered by advanced language models, it aims to make psychological knowledge 
                more accessible while always emphasizing the importance of professional help.
              </p>
              <div className="rounded-lg bg-destructive/10 p-3 text-destructive">
                <p className="font-medium">Important Disclaimer</p>
                <p className="text-xs mt-1">
                  This AI is for informational purposes only and is not a substitute for 
                  professional mental health advice, diagnosis, or treatment.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Limitations + Chats */}
      <div className="px-4 pb-4 space-y-4 flex-1 min-h-0 overflow-hidden flex flex-col">
        <details className="group overflow-hidden rounded-3xl border border-border bg-card text-card-foreground flex-shrink-0">
          <summary className="flex cursor-pointer items-center justify-between gap-2 px-4 py-3 text-sm font-semibold">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Limitations
            </span>
            <span className="text-xs text-muted-foreground transition-transform duration-200 group-open:-rotate-180">
              ▼
            </span>
          </summary>
          <div className="border-t border-border px-4 py-3 text-sm leading-6 text-muted-foreground">
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                May occasionally generate inaccurate information
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Cannot provide medical diagnoses
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Not a replacement for professional therapy
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Knowledge cutoff may affect recent research
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Cannot handle crisis situations
              </li>
            </ul>
          </div>
        </details>

        <div className="flex flex-col min-h-0 overflow-hidden flex-1">
          <NewChatButton onClick={onNewChat || (() => {})} className="flex-shrink-0" />
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversationId || null}
            onSelect={onSelectConversation || (() => {})}
            onDelete={handleDeleteConversation}
            onRename={handleRenameConversation}
            onDuplicate={handleDuplicateConversation}
            onShare={handleShareConversation}
            onViewDetails={handleViewConversationDetails}
          />
        </div>
      </div>

      <Separator className="bg-sidebar-border flex-shrink-0" />
      
      {/* Builder Info */}
      <div className="p-4 border-t border-sidebar-border flex-shrink-0">
        <h3 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1">
          <User className="h-3 w-3" />
          Built By
        </h3>
        <div className="space-y-2">
          <p className="text-sm font-medium text-sidebar-foreground">Faiyaz Khan</p>
          <div className="flex gap-2">
            <a
              href="https://linkedin.com/in/faiyazkhan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn
            </a>
            <a
              href="https://github.com/faiyazkhan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </div>
      
      {/* Tech Stack */}
      <div className="p-4 border-t border-sidebar-border flex-shrink-0">
        <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
          <Code className="h-3 w-3" />
          Tech Stack
        </h3>
        <div className="flex flex-wrap gap-1">
          {["React", "Next.js", "Tailwind", "shadcn/ui"].map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-full bg-sidebar-accent px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmationModal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        conversationTitle={conversationToDelete?.title || ""}
        onConfirm={handleConfirmDelete}
      />

      <ConversationDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        conversation={conversationToView}
        messageCount={conversationToView ? (messageCountByConversation[conversationToView.id] || 0) : 0}
      />

      <ShareModal open={shareOpen} onOpenChange={setShareOpen} />
    </aside>
  )
}
