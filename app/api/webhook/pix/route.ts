import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("Webhook PIX recebido:", body)

    // Processar webhook da PUSHIN PAY
    if (body.status === "paid" || body.status === "approved") {
      const now = new Date()
      const brazilTime = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(now)

      const valueInReais = body.value ? body.value / 100 : 0

      // Enviar confirmação para Discord
      try {
        await fetch(
          "https://webhook.lewisakura.moe/api/webhooks/1381440605909160057/kNUzyXumPWD7bFVgB7gjxZ3TWrMGUtGSvR6Zh4mtKwS1qexwtqpHDK987gEe_sLQnlut",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: `✅ **PAGAMENTO CONFIRMADO VIA WEBHOOK!** ✅\n\n💰 **Valor:** R$ ${valueInReais.toFixed(2).replace(".", ",")}\n📦 **Produto:** ${body.description || "GameFlow Pro"}\n🆔 **ID:** ${body.id || body.transaction_id}\n⏰ **Confirmado em:** ${brazilTime}\n🎉 **Status:** PAGO - Acesso Liberado!\n\n🔑 **Cliente deve enviar comprovante para receber chave de acesso**`,
            }),
          },
        )
      } catch (discordError) {
        console.error("Erro ao enviar confirmação para Discord:", discordError)
      }

      // Aqui você pode adicionar lógica para notificar clientes conectados via WebSocket
      // Por exemplo, usando uma biblioteca como Socket.IO ou similar
      console.log("Pagamento confirmado via webhook para transação:", body.id || body.transaction_id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro no webhook PIX:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
