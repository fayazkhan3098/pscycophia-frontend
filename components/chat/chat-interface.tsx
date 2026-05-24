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

// Simulated responses for demo
const getAIResponse = (question: string): { content: string; sources: { title: string; url: string }[]; fromCache: boolean } => {
  const responses: Record<string, { content: string; sources: { title: string; url: string }[]; fromCache: boolean }> = {
    "What is depression?": {
      content: "Depression is a common and serious mental health disorder that negatively affects how you feel, think, and act. It causes feelings of sadness and/or a loss of interest in activities you once enjoyed.\n\nKey symptoms include:\n• Persistent sad, anxious, or empty mood\n• Loss of interest in hobbies and activities\n• Changes in appetite and weight\n• Sleep disturbances\n• Fatigue and decreased energy\n• Feelings of worthlessness or guilt\n• Difficulty concentrating\n• Thoughts of death or suicide\n\nDepression is treatable with psychotherapy, medication, or a combination of both. If you're experiencing symptoms, please reach out to a mental health professional.",
      sources: [
        { title: "NIMH Depression", url: "https://nimh.nih.gov/depression" },
        { title: "APA Guidelines", url: "https://apa.org/depression" },
      ],
      fromCache: false,
    },
    "What is anxiety?": {
      content: "Anxiety is your body's natural response to stress. It's a feeling of fear or apprehension about what's to come. While occasional anxiety is normal, anxiety disorders involve excessive worry that interferes with daily life.\n\nTypes of anxiety disorders include:\n• Generalized Anxiety Disorder (GAD)\n• Panic Disorder\n• Social Anxiety Disorder\n• Specific Phobias\n\nCommon symptoms:\n• Restlessness or feeling on edge\n• Rapid heartbeat\n• Difficulty concentrating\n• Sleep problems\n• Muscle tension\n• Excessive worry\n\nTreatment options include cognitive-behavioral therapy (CBT), medication, relaxation techniques, and lifestyle changes.",
      sources: [
        { title: "Anxiety & Depression Association", url: "https://adaa.org" },
        { title: "Mayo Clinic Anxiety", url: "https://mayoclinic.org/anxiety" },
      ],
      fromCache: true,
    },
    "What is CBT therapy?": {
      content: "Cognitive Behavioral Therapy (CBT) is a widely used, evidence-based psychotherapy that helps people identify and change negative thought patterns and behaviors.\n\nCore principles of CBT:\n• Our thoughts affect our feelings and behaviors\n• Negative thinking patterns can be identified and challenged\n• New, healthier thought patterns can be learned\n• Behavioral changes reinforce cognitive changes\n\nCBT is effective for:\n• Depression\n• Anxiety disorders\n• PTSD\n• OCD\n• Eating disorders\n• Substance abuse\n\nA typical CBT session involves identifying problematic thoughts, examining evidence for and against them, and developing more balanced perspectives. Homework assignments help reinforce skills between sessions.",
      sources: [
        { title: "Beck Institute", url: "https://beckinstitute.org/cbt" },
        { title: "APA CBT Overview", url: "https://apa.org/cbt" },
      ],
      fromCache: false,
    },
    "What is PTSD?": {
      content: "Post-Traumatic Stress Disorder (PTSD) is a mental health condition triggered by experiencing or witnessing a terrifying event. It can develop after exposure to actual or threatened death, serious injury, or sexual violence.\n\nPTSD symptoms fall into four categories:\n\n1. Intrusive memories:\n• Flashbacks\n• Nightmares\n• Severe emotional distress\n\n2. Avoidance:\n• Avoiding places, activities, or people that remind you of the trauma\n• Trying not to think about the event\n\n3. Negative changes in thinking and mood:\n• Negative thoughts about self or others\n• Hopelessness\n• Memory problems\n• Detachment from loved ones\n\n4. Changes in physical and emotional reactions:\n• Being easily startled\n• Self-destructive behavior\n• Trouble sleeping\n• Irritability\n\nEffective treatments include trauma-focused CBT, EMDR therapy, and medication.",
      sources: [
        { title: "PTSD Foundation", url: "https://ptsd.va.gov" },
        { title: "NIMH PTSD", url: "https://nimh.nih.gov/ptsd" },
      ],
      fromCache: true,
    },
  }

  if (responses[question]) {
    return responses[question]
  }

  return {
    content: `Thank you for your question about "${question}". As a psychology AI assistant, I can provide general information about mental health topics.\n\nThis topic involves several important aspects that are worth exploring. For personalized advice or if you're experiencing distress, please consult with a licensed mental health professional.\n\nWould you like me to explain any specific aspect in more detail?`,
    sources: [
      { title: "Psychology Today", url: "https://psychologytoday.com" },
    ],
    fromCache: false,
  }
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const response = getAIResponse(content)
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
