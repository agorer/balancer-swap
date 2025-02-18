import { useContext } from 'react'
import { MessagesContext } from './MessagesProvider'

export default function MessagesViewer() {
  const messagesContext = useContext(MessagesContext)

  function clearErrors() {
    messagesContext.setMessages({
      ...messagesContext.messages,
      error: ''
    })
  }

  function clearMessages() {
    messagesContext.setMessages({
      ...messagesContext.messages,
      info: ''
    })
  }

  return (
    <>
      { messagesContext.messages.error ? (
          <div role="alert" className="error">
            <div>{messagesContext.messages.error}</div>

            <div className="actions">
              <button onClick={clearErrors} aria-label="close">✕</button>
            </div>
          </div>
      ) : (
        null
      )}
      { messagesContext.messages.info ? (
        <div role="alert" className="info">
          <div>{messagesContext.messages.info}</div>
            
          <div className="actions">
            <button onClick={clearMessages} aria-label="close">✕</button>
          </div>
        </div>
      ) : (
        null
      )}
    </>
  )
}

