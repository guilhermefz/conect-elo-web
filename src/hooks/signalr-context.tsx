import { createContext, useContext, useEffect, useRef, useState } from "react"
import * as signalR from "@microsoft/signalr"
import { API_URL } from "../lib/config"

interface SignalRContextType {
  connection: signalR.HubConnection | null
  conectado: boolean
}

const SignalRContext = createContext<SignalRContextType>({ connection: null, conectado: false })

export function SignalRProvider({ children }: { children: React.ReactNode }) {
  const [conectado, setConectado] = useState(false)
  const connectionRef = useRef<signalR.HubConnection | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/hubs/chat`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    connectionRef.current = connection
    let deveParar = false

    connection.start()
      .then(() =>  {
        if (deveParar) {
          connection.stop()
        } else {
          setConectado(true)
        }
      })
      .catch(console.error)

    return () => {
      deveParar = true
      
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.stop()
      }
    }
  }, [])

  return (
    <SignalRContext.Provider value={{ connection: connectionRef.current, conectado }}>
      {children}
    </SignalRContext.Provider>
  )
}

export function useSignalR() {
  return useContext(SignalRContext)
}