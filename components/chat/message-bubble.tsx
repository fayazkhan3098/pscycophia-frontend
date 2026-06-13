"use client"

import { Copy, ThumbsUp, ThumbsDown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export interface Source {
  title: string
  url: string
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: Source[]
  fromCache?: boolean
  feedback?: "up" | "down" | null
}

interface MessageBubbleProps {
  message: Message
  onFeedback?: (id: string, feedback: "up" | "down") => void
}

export function MessageBubble({ message, onFeedback }: MessageBubbleProps) {
  const { toast } = useToast()
  const isUser = message.role === "user"

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    toast({
      description: "Message copied to clipboard",
    })
  }


  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? "order-2" : "order-1"}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-secondary text-secondary-foreground rounded-bl-md"
          }`}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        </div>
        
        {!isUser && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {message.fromCache && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/50 px-2 py-0.5 text-xs text-accent-foreground">
                <Zap className="h-3 w-3" />
                From Cache
              </span>
            )}
            
            {message.sources && message.sources.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {message.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted/80 transition-colors"
                  >
                    {source.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className={`mt-1 flex items-center gap-1 ${isUser ? "justify-end" : "justify-start"}`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
          >
            <Copy className="h-3.5 w-3.5" />
            <span className="sr-only">Copy message</span>
          </Button>
          
          {!isUser && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${message.feedback === "up" ? "text-green-500" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => onFeedback?.(message.id, "up")}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span className="sr-only">Thumbs up</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${message.feedback === "down" ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => onFeedback?.(message.id, "down")}
              >
                <ThumbsDown className="h-3.5 w-3.5" />
                <span className="sr-only">Thumbs down</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
