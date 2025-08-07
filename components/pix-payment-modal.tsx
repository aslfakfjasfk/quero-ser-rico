"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, CheckCircle, Loader2, Clock, Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { PaymentSuccessModal } from "./payment-success-modal"
import { usePaymentWebSocket } from "@/hooks/use-payment-websocket"

interface PixPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  planPrice: number
}

interface PixResponse {
  transaction_id: string
  qr_code: string
  qr_code_base64: string
  status: string
  raw_response?: any
}

export function PixPaymentModal({ isOpen, onClose, planName, planPrice }: PixPaymentModalProps) {
  const [pixData, setPixData] = useState<PixResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [step, setStep] = useState<"email" | "payment">("email")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<string>("pending")

  // Hook do polling para monitoramento em tempo real
  const { isConnected, currentStatus, disconnect } = usePaymentWebSocket({
    transactionId: pixData?.transaction_id || null,
    onPaymentConfirmed: () => {
      setShowSuccessModal(true)
      toast({
        title: "🎉 Pagamento Confirmado!",
        description: "Seu pagamento foi processado com sucesso!",
      })
    },
    onStatusUpdate: (status) => {
      setPaymentStatus(status)
      console.log('Status atualizado via polling:', status)
    }
  })

  const validateEmailAndProceed = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Por favor, digite um email válido")
      return
    }
    setStep("payment")
  }

  const generatePix = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: planPrice * 100, // Valor em centavos
          webhook_url: `${window.location.origin}/api/webhook/pix`,
          description: `Plano ${planName} - GameFlow Pro`,
          email: email,
          planName: planName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Erro da API:", data)
        throw new Error(data.error || "Erro ao gerar PIX")
      }

      console.log("PIX gerado:", data)
      setPixData(data)
      
      toast({
        title: "PIX Gerado!",
        description: "Monitoramento automático ativado. Você será notificado quando o pagamento for confirmado.",
      })
    } catch (error) {
      console.error("Erro ao gerar PIX:", error)
      toast({
        title: "Erro",
        description: error.message || "Não foi possível gerar o código PIX. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyPixCode = async () => {
    if (!pixData?.qr_code) return

    try {
      await navigator.clipboard.writeText(pixData.qr_code)
      setIsCopied(true)
      toast({
        title: "Sucesso!",
        description: "PUSHIN PAY – Código copiado com sucesso!",
      })

      setTimeout(() => setIsCopied(false), 3000)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o código. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleClose = () => {
    disconnect()
    setPixData(null)
    setIsCopied(false)
    setEmail("")
    setEmailError("")
    setStep("email")
    setPaymentStatus("pending")
    onClose()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'approved':
      case 'confirmed':
        return 'text-green-400'
      case 'pending':
        return 'text-yellow-400'
      case 'cancelled':
      case 'expired':
        return 'text-red-400'
      case 'error':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
      case 'approved':
      case 'confirmed':
        return 'Pagamento Confirmado'
      case 'pending':
        return 'Aguardando Pagamento'
      case 'cancelled':
        return 'Pagamento Cancelado'
      case 'expired':
        return 'Pagamento Expirado'
      case 'error':
        return 'Erro na Verificação'
      default:
        return 'Verificando...'
    }
  }

  const getStatusIcon = (status: string, isConnected: boolean) => {
    if (!isConnected) return <WifiOff className="w-4 h-4 text-red-400" />
    
    switch (status) {
      case 'paid':
      case 'approved':
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'pending':
        return <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />
      case 'error':
        return <WifiOff className="w-4 h-4 text-red-400" />
      default:
        return <Wifi className="w-4 h-4 text-green-400" />
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Pagamento PIX - {planName}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-300 mb-2">Valor a pagar:</p>
              <p className="text-3xl font-bold text-blue-400">R$ {planPrice.toFixed(2).replace(".", ",")}</p>
            </div>

            {step === "email" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Digite seu email para continuar:
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setEmailError("")
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                  {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
                </div>
                <Button
                  onClick={validateEmailAndProceed}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  disabled={!email}
                >
                  Continuar para Pagamento
                </Button>
              </div>
            )}

            {step === "payment" && (
              <>
                {!pixData && !isLoading && (
                  <Button onClick={generatePix} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                    Gerar Código PIX
                  </Button>
                )}

                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                    <span className="ml-2 text-gray-300">Gerando código PIX...</span>
                  </div>
                )}

                {pixData && (
                  <div className="space-y-4">
                    {/* Status da Conexão e Pagamento */}
                    <div className="bg-gray-700 border border-gray-600 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(currentStatus, isConnected)}
                          <span className="text-sm text-gray-300">
                            {isConnected ? 'Monitoramento Ativo' : 'Verificando...'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm font-medium ${getStatusColor(currentStatus)}`}>
                            {getStatusText(currentStatus)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* QR Code */}
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-300 mb-3">Escaneie o QR Code com seu app bancário:</p>
                          <div className="flex justify-center">
                            {pixData.qr_code_base64 ? (
                              <div className="bg-white p-4 rounded-lg">
                                <img
                                  src={pixData.qr_code_base64.startsWith('data:') 
                                    ? pixData.qr_code_base64 
                                    : `data:image/png;base64,${pixData.qr_code_base64}`
                                  }
                                  alt="QR Code PIX"
                                  className="w-48 h-48"
                                  onLoad={() => console.log('QR Code carregado com sucesso')}
                                  onError={(e) => {
                                    console.error("Erro ao carregar QR Code:", e)
                                    console.log("Base64 recebido:", pixData.qr_code_base64?.substring(0, 100) + "...")
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="w-48 h-48 border-2 border-gray-600 rounded-lg bg-gray-600 flex items-center justify-center">
                                <div className="text-center">
                                  <p className="text-gray-400 text-sm mb-2">QR Code não disponível</p>
                                  <p className="text-gray-500 text-xs">Use o código PIX abaixo</p>
                                  {pixData.raw_response && (
                                    <details className="mt-2">
                                      <summary className="text-xs text-blue-400 cursor-pointer">Debug Info</summary>
                                      <pre className="text-xs text-gray-500 mt-1 max-w-48 overflow-hidden">
                                        {JSON.stringify(Object.keys(pixData.raw_response), null, 2)}
                                      </pre>
                                    </details>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Informações de debug em desenvolvimento */}
                          {process.env.NODE_ENV === 'development' && pixData.raw_response && (
                            <div className="mt-4 p-2 bg-gray-800 rounded text-xs">
                              <p className="text-yellow-400 mb-1">Debug - Campos disponíveis:</p>
                              <div className="text-gray-400 space-y-1 max-h-32 overflow-y-auto">
                                {Object.entries(pixData.raw_response).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span>{key}:</span>
                                    <span className="ml-2 truncate max-w-32">
                                      {typeof value === 'string' ? value.substring(0, 20) + '...' : String(value)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Código Copia e Cola */}
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-300 mb-3">Ou copie o código PIX:</p>
                        <div className="bg-gray-800 p-3 rounded border border-gray-600 mb-3">
                          <p className="text-xs text-gray-300 break-all font-mono">{pixData.qr_code}</p>
                        </div>
                        <Button
                          onClick={copyPixCode}
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={isCopied}
                        >
                          {isCopied ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Código Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copiar Código PIX
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    <div className="text-center text-sm text-gray-400">
                      <p className="flex items-center justify-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Verificação automática a cada 8 segundos
                      </p>
                      <p className="mt-1">Você será notificado automaticamente quando o pagamento for confirmado.</p>
                      <p className="mt-1 text-blue-400">Email: {email}</p>
                      {pixData.transaction_id && (
                        <p className="mt-1 text-gray-500 text-xs">ID: {pixData.transaction_id}</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {showSuccessModal && (
        <PaymentSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false)
            handleClose()
          }}
          planName={planName}
          planPrice={planPrice}
          email={email}
          transactionId={pixData?.transaction_id || ""}
        />
      )}
    </>
  )
}
