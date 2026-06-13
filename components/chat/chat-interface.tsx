"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar } from "./sidebar"
import { ChatInput } from "./chat-input"
import { MessageBubble, type Message } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"
import { SuggestedQuestions } from "./suggested-questions"
import { type Conversation } from "./conversation-item"
import { createClient } from "@/lib/supabase/client"

const API_URL = process.env.NEXT_PUBLIC_API_URL

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

interface ChatInterfaceProps {
  userEmail: string
  conversations: Conversation[]
}

export function ChatInterface({ userEmail, conversations:initialConversations }: ChatInterfaceProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, isTyping])

  const createConversation = async (firstMessage: string) => {
    console.log("Creating conversation...");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        title: firstMessage.slice(0, 50),
        model: "default",
        source_type: "rag",
        domain: "psychology",
        message_count: 0,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }
    console.log("Created conversation:", data);
    return data;
  };

  const saveMessage = async (
    conversationId: string,
    role: string,
    content: string
  ) => {
    const { error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role,
        content,
        model: "default",
        message_type: "chat",
      });

    if (error) {
      console.error("Message save failed:", error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to load messages:", error);
      return [];
    }

    return data;
  };

  const handleSend = async (content: string) => {

    let conversationId = selectedConversationId;

    if (!selectedConversationId) {
      
      const conversation = await createConversation(content);

      conversationId = conversation.id;

      setSelectedConversationId(conversation.id);

      setConversations((prev) => [
        {
          id: conversation.id,
          title: conversation.title,
          createdAt: new Date(conversation.created_at),
          updatedAt: new Date(conversation.updated_at),
        },
        ...prev,
      ]);
      
    }

    await saveMessage(
      conversationId!,
      "user",
      content
    );

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

      await saveMessage(
        conversationId!,
        "assistant",
        response.content
      );

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        sources: [],
        fromCache: false,
        feedback: null,
      }])
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

  const handleNewChat = () => {
    // Clear messages and prepare for new conversation
    // Conversation will be created after first message is sent with a generated title
    setSelectedConversationId(null)
    setMessages([])
    setMobileMenuOpen(false)
  }

  const handleSelectConversation = async (id: string) => {
    setSelectedConversationId(id);

    const dbMessages = await loadMessages(id);

    const formattedMessages: Message[] = dbMessages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      sources: [],
      fromCache: false,
      feedback: null,
    }));

    setMessages(formattedMessages);

    setMobileMenuOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id))
    if (selectedConversationId === id) {
      const remaining = conversations.filter((conv) => conv.id !== id)
      if (remaining.length > 0) {
        setSelectedConversationId(remaining[0].id)
      } else {
        setSelectedConversationId(null)
        setMessages([])
      }
    }
  }

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id
          ? { ...conv, title: newTitle, updatedAt: new Date() }
          : conv
      )
    )
  }

  const handleDuplicateConversation = (id: string) => {
    const conversation = conversations.find((c) => c.id === id)
    if (conversation) {
      const newId = Date.now().toString()
      const newConversation: Conversation = {
        ...conversation,
        id: newId,
        title: `${conversation.title} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setConversations((prev) => [newConversation, ...prev])
    }
  }

  return (
    <div className="flex h-screen min-h-screen overflow-hidden bg-background">
      {!sidebarCollapsed && (
        <Sidebar
          className="hidden md:flex"
          userEmail={userEmail}
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
          onDuplicateConversation={handleDuplicateConversation}
        />
      )}

      {sidebarCollapsed && (
        <aside className="hidden md:flex h-screen w-16 shrink-0 flex-col items-center justify-start border-r border-sidebar-border bg-sidebar px-2 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(false)}
            className="text-sidebar-foreground"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Expand sidebar</span>
          </Button>
        </aside>
      )}

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <div className="flex flex-1 flex-col min-h-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 md:px-6">
            <div className="flex items-center gap-2">
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>

              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                </span>
              </Button>
            </div>
          </div>

          <main className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea
              ref={scrollAreaRef}
              className="flex-1 min-h-0 h-full overflow-hidden p-4 pb-28 md:p-6 md:pb-28"
            >
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
                    <div className="h-24 md:h-28" aria-hidden="true" />
                  </>
                )}
              </div>
            </ScrollArea>

            <ChatInput onSend={handleSend} disabled={isTyping} />
          </main>
        </div>

        <SheetContent side="left" className="w-72 p-0 bg-sidebar border-sidebar-border">
          <Sidebar
            className="flex md:hidden"
            userEmail={userEmail}
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            onRenameConversation={handleRenameConversation}
            onDuplicateConversation={handleDuplicateConversation}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
