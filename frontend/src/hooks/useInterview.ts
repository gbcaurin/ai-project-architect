import { useEffect, useRef, useCallback } from 'react'
import { useProjectStore } from '../store/projectStore'
import { WS_BASE } from '../api/client'

export function useInterview(projectId: string | undefined) {
  const ws = useRef<WebSocket | null>(null)
  const {
    addMessage, appendToLastMessage, setStreaming,
    setPhase, setInterviewComplete, messages
  } = useProjectStore()

  useEffect(() => {
    if (!projectId) return

    const token = localStorage.getItem('token')
    if (!token) return

    const url = `${WS_BASE}/ws/interview/${projectId}?token=${token}`
    ws.current = new WebSocket(url)

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'message') {
          addMessage({ role: data.role, content: data.content })
        } else if (data.type === 'token') {
          appendToLastMessage(data.content)
        } else if (data.type === 'done') {
          setStreaming(false)
          if (data.phase) setPhase(data.phase)
          if (data.interview_complete) setInterviewComplete(true)
        } else if (data.type === 'error') {
          setStreaming(false)
          console.error('WS error:', data.message)
        }
      } catch (e) {
        console.error('WS parse error', e)
      }
    }

    ws.current.onerror = () => setStreaming(false)
    ws.current.onclose = () => setStreaming(false)

    return () => {
      ws.current?.close()
    }
  }, [projectId])

  const sendMessage = useCallback((content: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return
    if (!content.trim()) return

    addMessage({ role: 'user', content })
    addMessage({ role: 'assistant', content: '' })
    setStreaming(true)

    ws.current.send(JSON.stringify({ type: 'message', content }))
  }, [])

  return { sendMessage }
}
