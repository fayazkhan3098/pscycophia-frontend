"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar } from "./sidebar"
import { ChatInput } from "./chat-input"
import { MessageBubble, type Message } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"
import { SuggestedQuestions } from "./suggested-questions"

const API_URL = "https://pscycophia-production.up.railway.app"

const getAIResponse = async (question: string) => {
  const response = await fetch(`${API_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: question }),
  })
  const data = await response.json()
  return {
    content: data.answer,
    sources: data.sources ? [{ title: data.sources, url: "#" }] : [],
    fromCache: data.from_cache,
  }
}
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
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

    // Simulate API delay
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
    setIsTyping(false)
  }

  const handleFeedback = (id: string, feedback: "up" | "down") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, feedback: msg.feedback === feedback ? null : feedback } : msg
      )
    )
  }

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
