"use client"

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground"></span>
          <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground"></span>
          <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground"></span>
        </div>
      </div>
    </div>
  )
}
