"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckCircle, MessageCircle, Copy } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface PaymentSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  planPrice: number
  email: string
  transactionId?: string
}

export function PaymentSuccessModal({
  isOpen,
  onClose,
  planName,
  planPrice,
  email,
  transactionId,
}: PaymentSuccessModalProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const comprovante = `
🎉 COMPROVANTE DE COMPRA - GAMEFLOW PRO 🎉

📦 Produto: ${planName}
💰 Valor: R$ ${planPrice.toFixed(2).replace(".", ",")}
📧 Email: ${email}
🆔 ID da Transação: ${transactionId || "N/A"}
📅 Data: ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}

✅ PAGAMENTO CONFIRMADO!

Para receber sua chave de acesso, envie uma print desta tela para:
📱 WhatsApp: (11) 99999-9999
💬 Discord: @gameflowpro

Obrigado pela sua compra! 🚀
  `.trim()

  const copyComprovante = async () => {
    try {
      await navigator.clipboard.writeText(comprovante)
      setCopied(true)
      toast({
        title: "Copiado!",
        description: "Comprovante copiado para a área de transferência",
      })
      setTimeout(() => setCopied(false), 3000)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o comprovante",
        variant: "destructive",
      })
    }
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Acabei de comprar o plano ${planName} do GameFlow Pro. Segue o comprovante:\n\n${comprovante}`,
    )
    window.open(`https://wa.me/5527981116052?text=${message}`, "_blank")
  }

  const openDiscord = () => {
    window.open("https://discord.gg/panicorp", "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gray-800 border-gray-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-green-400 flex items-center justify-center gap-2">
            <CheckCircle className="w-8 h-8" />
            Pagamento Confirmado!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Comprovante */}
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <h3 className="text-lg font-semibold text-center text-blue-400">🎉 COMPROVANTE DE COMPRA 🎉</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">📦 Produto:</span>
                    <span className="text-white font-semibold">{planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">💰 Valor:</span>
                    <span className="text-green-400 font-bold">R$ {planPrice.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">📧 Email:</span>
                    <span className="text-white">{email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">🆔 ID da Transação:</span>
                    <span className="text-white font-mono text-xs">{transactionId || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">📅 Data:</span>
                    <span className="text-white">
                      {new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-green-900/30 text-green-400 px-4 py-2 rounded-lg border border-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">PAGAMENTO CONFIRMADO!</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instruções */}
          <Card className="bg-blue-900/20 border-blue-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4 text-center">
                🔑 Como receber sua chave de acesso:
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                  <p className="text-gray-300 text-center mb-4">
                    <strong>Tire uma print desta tela</strong> e envie para um dos canais abaixo:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      onClick={openWhatsApp}
                      className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                      size="lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp: (11) 99999-9999
                    </Button>

                    <Button
                      onClick={openDiscord}
                      className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
                      size="lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Discord: @gameflowpro
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={copyComprovante}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Comprovante Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Comprovante Completo
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Aviso importante */}
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
            <p className="text-yellow-300 text-sm text-center">
              ⚠️ <strong>Importante:</strong> Sua chave de acesso será enviada em até 24 horas após o envio do
              comprovante. Guarde este comprovante para futuras consultas.
            </p>
          </div>

          <div className="text-center">
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 px-8" size="lg">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
