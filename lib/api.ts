// API configuration with environment variable support
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pscycophia-production.up.railway.app"

export interface QueryRequest {
  query: string
}

export interface Source {
  title: string
  url: string
}

export interface QueryResponse {
  query: string
  answer: string
  sources: string
  from_cache: boolean
}

export interface ApiError {
  message: string
  status?: number
}

/**
 * Parse sources string into array of source objects
 * The backend returns sources as a formatted string
 */
function parseSources(sourcesString: string): Source[] {
  if (!sourcesString || sourcesString === "No sources available") {
    return []
  }
  
  // Try to extract source names from the string
  // Format is typically "Source: [name1], [name2]" or similar
  const sources: Source[] = []
  const lines = sourcesString.split('\n').filter(line => line.trim())
  
  for (const line of lines) {
    const cleaned = line.replace(/^[-•*]\s*/, '').trim()
    if (cleaned) {
      sources.push({
        title: cleaned,
        url: '#' // Backend doesn't provide URLs
      })
    }
  }
  
  // If no lines parsed, treat the whole string as a single source
  if (sources.length === 0 && sourcesString.trim()) {
    sources.push({
      title: sourcesString.trim(),
      url: '#'
    })
  }
  
  return sources
}

/**
 * Send a query to the backend API
 */
export async function sendChatMessage(message: string): Promise<{
  response: string
  sources: Source[]
  from_cache: boolean
}> {
  try {
    const response = await fetch(`${API_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: message,
      } satisfies QueryRequest),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || errorData.message || `API error: ${response.status}`)
    }

    const data: QueryResponse = await response.json()
    return {
      response: data.answer,
      sources: parseSources(data.sources),
      from_cache: data.from_cache || false
    }
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
