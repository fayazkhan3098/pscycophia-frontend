"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Share2 } from "lucide-react"

interface ShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareModal({ open, onOpenChange }: ShareModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-card-foreground flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Conversation
          </DialogTitle>
          <DialogDescription>
            Share this conversation with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-sidebar p-4 border border-sidebar-border">
            <p className="text-sm text-sidebar-foreground">
              Share functionality will be connected after backend integration.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Soon you'll be able to share conversations with others via link or email.
            </p>
          </div>

          <div className="text-xs text-muted-foreground space-y-2">
            <p>Planned features:</p>
            <ul className="list-disc list-inside space-y-1 ml-1">
              <li>Generate shareable links</li>
              <li>Share with specific users</li>
              <li>Control access permissions</li>
              <li>Expiring share links</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
