// API configuration with environment variable support
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pscycophia-production.up.railway.app"

export interface ChatRequest {
  message: string
  conversation_id?: string
}

export interface Source {
  title: string
  url: string
}

export interface ChatResponse {
  response: string
  sources?: Source[]
  from_cache?: boolean
  conversation_id?: string
  error?: string
}

export interface ApiError {
  message: string
  status?: number
}

/**
 * Send a chat message to the backend API
 */
export async function sendChatMessage(message: string, conversationId?: string): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
      } satisfies ChatRequest),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || errorData.message || `API error: ${response.status}`)
    }

    const data: ChatResponse = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("An unexpected error occurred")
  }
}

/**
 * Check API health status
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.ok
  } catch {
    return false
  }
}
