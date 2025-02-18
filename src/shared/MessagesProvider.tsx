import type { PropsWithChildren } from "react"
import React, { createContext, useState } from "react"

export type Messages = {
  error: string,
  info: string
}

type MessageContextType = {
  messages: Messages,
  setMessages: React.Dispatch<React.SetStateAction<Messages>>
}

const EmptyMessages = { error: '', info: '' }

export const MessagesContext = createContext<MessageContextType>({
  messages: EmptyMessages,
  setMessages: () => EmptyMessages
})

export default function MessageProvider({ children }: PropsWithChildren) {
  const [messages, setMessages] = useState<Messages>({ error: '', info: '' })

  return (
    <MessagesContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessagesContext.Provider>
  )
}
