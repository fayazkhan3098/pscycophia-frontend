"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

const MAX_CHARS = 2000

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSend = () => {
    if (input.trim() && !disabled && input.length <= MAX_CHARS) {
      onSend(input.trim())
      setInput("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="sticky bottom-0 z-20 border-t border-border bg-background p-4">
      <div className="mx-auto max-w-3xl">
        <div className="relative flex items-end gap-2 rounded-xl bg-secondary p-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            placeholder="Ask about psychology topics..."
            className="min-h-[44px] max-h-[200px] flex-1 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
            disabled={disabled}
            rows={1}
          />
          <div className="flex items-center gap-2">
            <span className={`text-xs ${input.length > MAX_CHARS * 0.9 ? "text-destructive" : "text-muted-foreground"}`}>
              {input.length}/{MAX_CHARS}
            </span>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || disabled || input.length > MAX_CHARS}
              size="icon"
              className="h-9 w-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Pscycophia provides informational content only and is not a substitute for professional mental health advice, diagnosis, or treatment.
        </p>
      </div>
    </div>
  )
}
