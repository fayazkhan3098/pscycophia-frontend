"use client"

import { MessageCircle, HelpCircle, Lightbulb, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void
}

const suggestedQuestions = [
  {
    icon: HelpCircle,
    question: "What is depression?",
    description: "Learn about depression symptoms and causes",
  },
  {
    icon: MessageCircle,
    question: "What is anxiety?",
    description: "Understanding anxiety disorders",
  },
  {
    icon: Lightbulb,
    question: "What is CBT therapy?",
    description: "Cognitive Behavioral Therapy explained",
  },
  {
    icon: Brain,
    question: "What is PTSD?",
    description: "Post-Traumatic Stress Disorder overview",
  },
]

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Brain className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          How can I help you today?
        </h2>
        <p className="text-muted-foreground max-w-md">
          Ask me anything about psychology, mental health, therapy techniques, or emotional well-being.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestedQuestions.map((item) => (
          <Button
            key={item.question}
            variant="outline"
            className="h-auto p-4 justify-start text-left bg-secondary hover:bg-secondary/80 border-border"
            onClick={() => onSelect(item.question)}
          >
            <item.icon className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">{item.question}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
