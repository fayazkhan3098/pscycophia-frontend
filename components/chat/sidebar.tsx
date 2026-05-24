"use client"

import { useState } from "react"
import { Brain, Info, AlertTriangle, User, Github, Linkedin, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function Sidebar() {
  const [aboutOpen, setAboutOpen] = useState(false)

  return (
    <aside className="hidden md:flex flex-col w-72 bg-sidebar border-r border-sidebar-border h-screen">
      {/* Logo and Name */}
      <div className="p-4 flex items-center gap-3">
        <div className="rounded-lg bg-sidebar-primary/10 p-2">
          <Brain className="h-6 w-6 text-sidebar-primary" />
        </div>
        <div>
          <h1 className="font-semibold text-sidebar-foreground">Pscycophia</h1>
          <p className="text-xs text-muted-foreground">Psychology AI Assistant</p>
        </div>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      {/* About Dialog */}
      <div className="p-4">
        <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start bg-sidebar-accent border-sidebar-border hover:bg-sidebar-accent/80">
              <Info className="h-4 w-4 mr-2" />
              About Pscycophia
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-card-foreground">
                <Brain className="h-5 w-5 text-primary" />
                About Pscycophia
              </DialogTitle>
              <DialogDescription>
                Your AI-powered psychology assistant
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm text-card-foreground">
              <p>
                Pscycophia is an AI assistant designed to provide information about psychology, 
                mental health topics, therapy techniques, and emotional well-being.
              </p>
              <p>
                Powered by advanced language models, it aims to make psychological knowledge 
                more accessible while always emphasizing the importance of professional help.
              </p>
              <div className="rounded-lg bg-destructive/10 p-3 text-destructive">
                <p className="font-medium">Important Disclaimer</p>
                <p className="text-xs mt-1">
                  This AI is for informational purposes only and is not a substitute for 
                  professional mental health advice, diagnosis, or treatment.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Limitations Section */}
      <div className="px-4 pb-4">
        <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Limitations
        </h3>
        <ScrollArea className="h-32">
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              May occasionally generate inaccurate information
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              Cannot provide medical diagnoses
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              Not a replacement for professional therapy
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              Knowledge cutoff may affect recent research
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              Cannot handle crisis situations
            </li>
          </ul>
        </ScrollArea>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      {/* Spacer */}
      <div className="flex-1" />
      
      {/* Builder Info */}
      <div className="p-4 border-t border-sidebar-border">
        <h3 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1">
          <User className="h-3 w-3" />
          Built By
        </h3>
        <div className="space-y-2">
          <p className="text-sm font-medium text-sidebar-foreground">Faiyaz Khan</p>
          <div className="flex gap-2">
            <a
              href="https://linkedin.com/in/faiyazkhan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn
            </a>
            <a
              href="https://github.com/faiyazkhan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </div>
      
      {/* Tech Stack */}
      <div className="p-4 border-t border-sidebar-border">
        <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
          <Code className="h-3 w-3" />
          Tech Stack
        </h3>
        <div className="flex flex-wrap gap-1">
          {["React", "Next.js", "Tailwind", "shadcn/ui"].map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-full bg-sidebar-accent px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
