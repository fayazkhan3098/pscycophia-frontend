"use client"

import { useState, useRef, useEffect } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar } from "./sidebar"
import { ChatInput } from "./chat-input"
import { MessageBubble, type Message } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"
import { SuggestedQuestions } from "./suggested-questions"
import { useToast } from "@/hooks/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const getAIResponse = async (question: string) => {
  const response = await fetch(`${API_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: question }),
  })
  
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`)
  }
  
  const data = await response.json()
  return {
    content: data.answer,
    sources: data.sources ? [{ title: data.sources, url: "#" }] : [],
    fromCache: data.from_cache,
  }
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, isTyping])

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    try {
      const response = await getAIResponse(content)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        sources: response.sources,
        fromCache: response.fromCache,
        feedback: null,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Unable to get a response. Please try again.",
      })
    } finally {
      setIsTyping(false)
    }
  }

  const handleFeedback = (id: string, feedback: "up" | "down") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, feedback: msg.feedback === feedback ? null : feedback } : msg
      )
    )
  }

  return (
    <div className="flex h-[100dvh] bg-background overflow-hidden">
      <Sidebar />
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar border-sidebar-border overflow-hidden">
          <ScrollArea className="h-full">
            <Sidebar isMobile />
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0">
          <div className="p-4 md:p-6">
            <div className="mx-auto max-w-3xl">
              {messages.length === 0 ? (
                <SuggestedQuestions onSelect={handleSend} />
              ) : (
                <>
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      onFeedback={handleFeedback}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                </>
              )}
            </div>
          </div>
        </ScrollArea>
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </main>
    </div>
  )
}
