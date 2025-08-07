"use client"

import { useEffect, useRef, useState } from 'react'

interface PaymentStatus {
  type: string
  transactionId: string
  status?: string
  paid?: boolean
}

interface UsePaymentWebSocketProps {
  transactionId: string | null
  onPaymentConfirmed: () => void
  onStatusUpdate?: (status: string) => void
}

export function usePaymentWebSocket({ 
  transactionId, 
  onPaymentConfirmed, 
  onStatusUpdate 
}: UsePaymentWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<string>('pending')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isActiveRef = useRef(true)

  useEffect(() => {
    if (!transactionId) return

    console.log('Iniciando monitoramento para transação:', transactionId)
    setIsConnected(true)
    isActiveRef.current = true

    // Função para verificar status do pagamento
    const checkPaymentStatus = async () => {
      if (!isActiveRef.current) return

      try {
        console.log('Verificando status do pagamento...')
        const response = await fetch('/api/check-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transaction_id: transactionId,
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Status recebido:', data)

        if (isActiveRef.current) {
          setCurrentStatus(data.status || 'pending')
          onStatusUpdate?.(data.status || 'pending')

          if (data.paid) {
            console.log('Pagamento confirmado!')
            clearInterval(intervalRef.current!)
            setIsConnected(false)
            onPaymentConfirmed()
          }
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error)
        if (isActiveRef.current) {
          setCurrentStatus('error')
        }
      }
    }

    // Verificar imediatamente
    checkPaymentStatus()

    // Verificar a cada 8 segundos
    intervalRef.current = setInterval(checkPaymentStatus, 8000)

    // Parar verificação após 30 minutos
    const timeoutId = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setIsConnected(false)
      isActiveRef.current = false
      console.log('Timeout: Parando monitoramento após 30 minutos')
    }, 30 * 60 * 1000)

    // Cleanup
    return () => {
      isActiveRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      clearTimeout(timeoutId)
      setIsConnected(false)
      console.log('Cleanup: Monitoramento interrompido')
    }
  }, [transactionId, onPaymentConfirmed, onStatusUpdate])

  const disconnect = () => {
    isActiveRef.current = false
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsConnected(false)
    console.log('Desconectado manualmente')
  }

  return {
    isConnected,
    currentStatus,
    disconnect
  }
}
