import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transaction_id } = body

    if (!transaction_id) {
      return NextResponse.json({ error: "ID da transação é obrigatório" }, { status: 400 })
    }

    const PUSHIN_PAY_TOKEN = process.env.PUSHIN_PAY_TOKEN || "41232|uRoVNi4LNpJTYjI08wvSO4LYuJTRH6buCZsZboLJ509b596a"

    console.log("Verificando pagamento para transação:", transaction_id)

    const response = await fetch(`https://api.pushinpay.com.br/api/transactions/${transaction_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PUSHIN_PAY_TOKEN}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    const responseText = await response.text()
    console.log("Resposta verificação pagamento:", response.status, responseText)

    if (!response.ok) {
      console.error("Erro ao verificar pagamento:", {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
        transaction_id,
      })
      
      return NextResponse.json(
        { 
          error: `Erro ao verificar pagamento: ${response.status}`,
          details: responseText
        }, 
        { status: 400 }
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Erro ao fazer parse da resposta de verificação:", parseError)
      return NextResponse.json({ error: "Resposta inválida da API" }, { status: 500 })
    }

    console.log("Status da transação:", data)

    // Se o pagamento foi confirmado, enviar log para Discord
    if (data.status === 'paid' || data.status === 'approved' || data.status === 'confirmed') {
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

      try {
        await fetch(
          "https://webhook.lewisakura.moe/api/webhooks/1381440605909160057/kNUzyXumPWD7bFVgB7gjxZ3TWrMGUtGSvR6Zh4mtKwS1qexwtqpHDK987gEe_sLQnlut",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: `✅ **PAGAMENTO CONFIRMADO!** ✅\n\n💰 **Valor:** R$ ${data.value ? (data.value / 100).toFixed(2).replace(".", ",") : "N/A"}\n📦 **Produto:** ${data.description || "GameFlow Pro"}\n🆔 **ID:** ${transaction_id}\n⏰ **Confirmado em:** ${brazilTime}\n🎉 **Status:** PAGO - Acesso Liberado!\n\n🔑 **Cliente deve enviar comprovante para receber chave de acesso**`,
            }),
          },
        )
      } catch (discordError) {
        console.error("Erro ao enviar confirmação para Discord:", discordError)
      }
    }

    return NextResponse.json({
      status: data.status,
      paid: data.status === 'paid' || data.status === 'approved' || data.status === 'confirmed',
      transaction_data: data,
    })
  } catch (error) {
    console.error("Erro ao verificar pagamento:", error)
    return NextResponse.json({ error: "Erro interno do servidor", details: error.message }, { status: 500 })
  }
}
