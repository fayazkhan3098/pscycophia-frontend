"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Conversation } from "./conversation-item"

interface ShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversation: Conversation | null
}

export function ShareModal({ open, onOpenChange, conversation }: ShareModalProps) {
    const supabase = createClient()

    const [shareUrl, setShareUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const generateShareLink = async () => {
      setCopied(false)
      if (!conversation) return

      setLoading(true)

      const { data, error } = await supabase
        .from("conversations")
        .update({ is_public: true })
        .eq("id", conversation.id)
        .select("share_token")
        .single()

      if (!error && data) {
        setShareUrl(
          `${window.location.origin}/share/${data.share_token}`
        )
      }

      setLoading(false)
    }
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
          <Button
            className="w-full"
            onClick={generateShareLink}
            disabled={loading || !conversation}
          >
            {loading ? "Generating..." : "Generate Share Link"}
          </Button>

          {shareUrl && (
            <div className="space-y-2">
              <input
                readOnly
                value={shareUrl}
                className="w-full rounded border bg-background p-2 text-xs"
              />

              <Button
                variant="outline"
                className="w-full"
                onClick={async () => {
                  await navigator.clipboard.writeText(shareUrl)

                  setCopied(true)

                  setTimeout(() => {
                    setCopied(false)
                  }, 2000)
                }}
              >
                {copied ? "Copied ✓" : "Copy Link"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
