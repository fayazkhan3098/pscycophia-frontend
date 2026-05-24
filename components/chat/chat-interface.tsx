"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sidebar } from "./sidebar"
import { ChatInput } from "./chat-input"
import { MessageBubble, type Message } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"
import { SuggestedQuestions } from "./suggested-questions"
import { sendChatMessage } from "@/lib/api"

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | undefined>()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, isTyping])

  const handleSend = async (content: string) => {
    // Clear any previous errors
    setError(null)
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    try {
      const response = await sendChatMessage(content, conversationId)
      
      // Update conversation ID if returned
      if (response.conversation_id) {
        setConversationId(response.conversation_id)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response || response.error || "I apologize, but I couldn't generate a response. Please try again.",
        sources: response.sources,
        fromCache: response.from_cache,
        feedback: null,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get a response. Please try again."
      setError(errorMessage)
      
      // Add error message to chat
      const errorAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error while processing your request. Please try again later or check if the service is available.",
        feedback: null,
      }
      setMessages((prev) => [...prev, errorAssistantMessage])
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

  const dismissError = () => setError(null)

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Menu */}
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
        <SheetContent side="left" className="w-72 p-0 bg-sidebar border-sidebar-border">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="m-4 mb-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={dismissError}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Chat Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 md:p-6">
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
        </ScrollArea>

        {/* Input Area */}
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </main>
    </div>
  )
}
