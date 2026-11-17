import { useEffect, useRef, useState } from 'react'

type ChatMessage = {
  content: string
}

export function useWebSocket(workspaceId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [connected, setConnected] = useState(false)

  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!workspaceId) return

    const wsUrl = import.meta.env.DEV 
        ? `ws://localhost:3001/${workspaceId}`
        : `wss://stargaze.vercel.app/${workspaceId}`

    const socket = new WebSocket(wsUrl)

    socketRef.current = socket

    socket.onopen = () => {
      setConnected(true)
      console.log('Conectado ao workspace:', workspaceId)
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ChatMessage

        setMessages((prev) => [...prev, data])
      } catch {
        console.error('Mensagem WebSocket inválida')
      }
    }

    socket.onclose = () => {
      setConnected(false)
    }

    socket.onerror = (error) => {
      console.error('Erro no WebSocket:', error)
    }

    return () => {
      socket.close()
      socketRef.current = null
    }
  }, [workspaceId])

  function sendMessage(content: string) {
    const socket = socketRef.current

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket ainda não está conectado')
      return
    }

    socket.send(JSON.stringify({ content }))
  }

  return {
    messages,
    connected,
    sendMessage,
  }
}
