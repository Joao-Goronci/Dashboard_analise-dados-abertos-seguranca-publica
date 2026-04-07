import { useState, useRef, useEffect } from 'react'
import './Chat.css'

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ia',
      text: 'Ola! Sou o assistente de analise de seguranca publica do ES. Como posso ajudar?'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const trimmedMessage = inputValue.trim()
    if (!trimmedMessage || isLoading) return

    // Adiciona mensagem do usuário
    const userMessage = {
      id: Date.now(),
      type: 'usuario',
      text: trimmedMessage
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: trimmedMessage })
      })

      if (!response.ok) {
        throw new Error('Erro na resposta da API')
      }

      const data = await response.json()
      
      const iaMessage = {
        id: Date.now() + 1,
        type: 'ia',
        text: data.response || data.message || 'Resposta recebida.'
      }
      
      setMessages(prev => [...prev, iaMessage])
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ia',
        text: 'IA indisponivel no momento. Tente novamente mais tarde.',
        isError: true
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2 className="chat-title">Chat IA</h2>
      </header>

      <div className="chat-messages">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.type} ${message.isError ? 'error' : ''}`}
          >
            <span className="message-label">
              {message.type === 'usuario' ? 'Voce' : 'IA'}
            </span>
            <p className="message-text">{message.text}</p>
          </div>
        ))}
        
        {isLoading && (
          <div className="message ia loading">
            <span className="message-label">IA</span>
            <p className="message-text">
              <span className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder="Digite sua pergunta..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="chat-send-button"
          disabled={!inputValue.trim() || isLoading}
        >
          Enviar
        </button>
      </form>
    </div>
  )
}

export default Chat
