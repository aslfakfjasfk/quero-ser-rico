import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { value, webhook_url, description, email, planName } = body

    // Substitua 'SEU_TOKEN' pelo seu token real da PUSHIN PAY
    const PUSHIN_PAY_TOKEN = process.env.PUSHIN_PAY_TOKEN || "41232|uRoVNi4LNpJTYjI08wvSO4LYuJTRH6buCZsZboLJ509b596a"

    // Estrutura correta para a API PUSHIN PAY
    const pixPayload = {
      value: Math.round(value), // Valor em centavos, garantindo que seja inteiro
      webhook_url: webhook_url,
      description: description || "Pagamento GameFlow Pro",
    }

    console.log("Enviando para PUSHIN PAY:", pixPayload)

    const response = await fetch("https://api.pushinpay.com.br/api/pix/cashIn", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PUSHIN_PAY_TOKEN}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pixPayload),
    })

    const responseText = await response.text()
    console.log("Resposta PUSHIN PAY:", response.status, responseText)

    if (!response.ok) {
      console.error("Erro PUSHIN PAY:", {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
        payload: pixPayload,
      })
      
      return NextResponse.json(
        { 
          error: `Erro da API PUSHIN PAY: ${response.status}`,
          details: responseText,
          payload: pixPayload
        }, 
        { status: 400 }
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Erro ao fazer parse da resposta:", parseError)
      return NextResponse.json({ error: "Resposta inválida da API" }, { status: 500 })
    }

    console.log("Dados recebidos da PUSHIN PAY:", data)

    // Enviar log para Discord
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
            content: `🔥 **NOVA COMPRA INICIADA** 🔥\n\n📧 **Email:** ${email}\n💰 **Valor:** R$ ${(value / 100).toFixed(2).replace(".", ",")}\n📦 **Produto:** ${planName}\n⏰ **Horário:** ${brazilTime}\n🆔 **ID Transação:** ${data.id || 'N/A'}\n🔄 **Status:** PIX Gerado - Aguardando Pagamento`,
          }),
        },
      )
    } catch (discordError) {
      console.error("Erro ao enviar para Discord:", discordError)
    }

    // Retornar dados com múltiplas tentativas de campos
    return NextResponse.json({
      transaction_id: data.id || data.transaction_id || data.txid,
      qr_code: data.qr_code || data.EMV || data.pix_code || data.pixCopiaECola,
      qr_code_base64: data.qr_code_base64stringImagem || data.qr_code_base64 || data.imagemQrcode || data.qr_image || data.qrCodeImage,
      status: data.status || 'pending',
      raw_response: data, // Adicionar resposta completa para debug
    })
  } catch (error) {
    console.error("Erro ao gerar PIX:", error)
    return NextResponse.json({ error: "Erro interno do servidor", details: error.message }, { status: 500 })
  }
}
