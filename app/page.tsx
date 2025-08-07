"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Users, Shield, Zap, BarChart3, Globe, Headphones, ArrowRight, Copy } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PixPaymentModal } from "@/components/pix-payment-modal"

export default function Component() {
  const [isPixModalOpen, setIsPixModalOpen] = useState(false)
  const [pixCode, setPixCode] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number } | null>(null)

  const generatePix = async () => {
    try {
      const response = await fetch("/api/pushin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 59.0 }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setPixCode(data.EMV)
      setQrCode(data.imagemQrcode)
      setIsPixModalOpen(true)
    } catch (error) {
      console.error("Erro ao gerar o PIX:", error)
      alert("Erro ao gerar o PIX. Por favor, tente novamente.")
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error("Falha ao copiar texto: ", err)
    }
  }

  const openPaymentModal = (planName: string, price: number) => {
    setSelectedPlan({ name: planName, price })
    setIsPaymentModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold text-white">GameFlow Pro</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="#features" className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium">
                  Recursos
                </Link>
                <Link href="#pricing" className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium">
                  Preços
                </Link>
                <Link href="#testimonials" className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium">
                  Avaliações
                </Link>
                <Link href="#contact" className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium">
                  Contato
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-gray-800">
                Entrar
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Começar</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-900/50 text-blue-300 hover:bg-blue-900/50 border border-blue-700">
              🚀 Novo: Dashboard com IA Avançada
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Domine o{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Black Ops 6 e MW3
              </span>{" "}
              com vantagem total
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              BO6 EXTERNAL - O melhor software externo para Call of Duty: Black Ops 6 e Modern Warfare 3. 
              Aimbot ultrapreciso, ESP completo, totalmente seguro com spoofer incluso e modo streamer. 
              Confiado por mais de 10.000+ gamers no Brasil.
            </p>
<div className="mt-12 relative max-w-4xl mx-auto">
  <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-700 w-full h-[600px]">
    <iframe
      src="https://www.youtube.com/embed/6TBfPirmJy0"
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    ></iframe>
    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent pointer-events-none"></div>
  </div>
  <div className="absolute -bottom-4 -right-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 max-w-xs">
    <div className="flex items-center space-x-2 mb-2">
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-sm font-medium text-white">Stats em Tempo Real</span>
    </div>
    <p className="text-xs text-gray-400">Acompanhamento de performance ao vivo</p>
  </div>
</div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
                onClick={() => openPaymentModal("Profissional", 59)}
              >
                Comprar Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Ver Demonstração
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />7 dias para pedir reembolso
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Sem burocracia
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Cancele quando quiser
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Product Section */}
      <section className="py-24 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-900/50 text-blue-300 hover:bg-blue-900/50 border border-blue-700">
              🧠 BO6 EXTERNAL
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              O MELHOR EXTERNO PARA BLACK OPS 6 E MW3
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Tenha controle total e uma vantagem definitiva com o BO6 EXTERNAL, um software externo avançado, 
              indetectável e compatível com Call of Duty: Black Ops 6 e Modern Warfare 3.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 bg-green-900/30 text-green-400 px-6 py-3 rounded-lg border border-green-700">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">🔥 Totalmente seguro, com spoofer incluso e modo streamer</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Aimbot Features */}
            <Card className="border border-gray-700 bg-gray-900/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-900/50 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">🎯 AIMBOT ULTRAPRECISO</CardTitle>
                    <CardDescription className="text-gray-400">Mira perfeita com configurações avançadas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Tecla de mira configurável
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Seleção automática de osso (random bone)
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Zona morta personalizável
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    FOV da zona morta e distância configurável
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Retículo personalizado com tamanho ajustável
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Suavidade ajustável (aim smoothing)
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Distância máxima de ativação configurável
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ESP Features */}
            <Card className="border border-gray-700 bg-gray-900/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">👁️ VISUAIS (ESP COMPLETO)</CardTitle>
                    <CardDescription className="text-gray-400">Veja tudo que importa no campo de batalha</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    ESP Esqueleto e Caixa 3D/2D
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    ESP Linhas até o jogador
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Barra de saúde e nome dos inimigos
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Exibição da distância em tempo real
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Visibilidade apenas de alvos visíveis
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Filtro por time (checagem de equipe)
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Personalização total das cores
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Features */}
          <div className="mt-12">
            <Card className="border border-green-700 bg-green-900/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">🛡️ SEGURANÇA E DESEMPENHO</CardTitle>
                    <CardDescription className="text-gray-400">Máxima proteção sem comprometer a performance</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <strong>Modo Stream:</strong> invisível para gravações e screenshots
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <strong>Spoofer incluso:</strong> proteção contra HWID bans
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <strong>Sem risco de banimento:</strong> técnicas atualizadas e seguras
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <strong>Interface limpa:</strong> leve e intuitiva
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <strong>Alta performance:</strong> funciona em máquinas medianas
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <strong>Fácil de usar:</strong> sem complicações técnicas
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-8 border border-blue-700">
              <h3 className="text-2xl font-bold text-white mb-4">🚀 PRONTO PARA DOMINAR?</h3>
              <p className="text-lg text-gray-300 mb-6 max-w-3xl mx-auto">
                O BO6 EXTERNAL é a escolha certa para quem quer desempenho, segurança e máxima vantagem competitiva 
                sem comprometer a conta. Perfeito para jogadores que querem resultados imediatos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
                  onClick={() => openPaymentModal("Profissional", 59)}
                >
                  Comprar Agora - R$ 59
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                >
                  Ver Demonstração
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  ✅ Fácil de usar
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  ✅ Sem complicações técnicas
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  ✅ Resultados imediatos
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Por que escolher o BO6 EXTERNAL?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Tecnologia de ponta, segurança máxima e performance incomparável para dominar Black Ops 6 e MW3.
            </p>
          </div>
      <div className="mb-16">
  <div className="grid md:grid-cols-2 gap-8 items-center">
    <div>
      <img
        src="https://i.ibb.co/4ZND29ZQ/Call-of-Duty-Modern-Warfare-II-Warzone-2.png"
        alt="Interface Warzone"
        className="rounded-lg shadow-lg border border-gray-700"
      />
    </div>
    <div>
      <img
        src="https://i.ibb.co/hR4hwjYT/O-MELHOR-CHEAT-EXTERNO-PARA-WARZONE-SPOOFER-SEM-RISCO-DE-BAN-BO6-MW3-frame-at-1m29s.jpg"
        alt="Ferramentas Black Ops 6"
        className="rounded-lg shadow-lg border border-gray-700"
      />
    </div>
  </div>
</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all hover:border-blue-600">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Performance Otimizada</CardTitle>
                <CardDescription className="text-gray-400">
                  Engine otimizada para máxima performance sem impacto no FPS. Funciona suavemente mesmo em máquinas medianas com consumo mínimo de recursos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all hover:border-blue-600">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">100% Indetectável</CardTitle>
                <CardDescription className="text-gray-400">
                  Tecnologia anti-cheat bypass avançada com atualizações constantes. Proteção contra Ricochet, BattlEye e todos os sistemas de detecção modernos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all hover:border-blue-600">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Qualidade Premium</CardTitle>
                <CardDescription className="text-gray-400">
                  Desenvolvido por especialistas em game hacking com anos de experiência. Código limpo, estável e constantemente atualizado para máxima qualidade.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all hover:border-blue-600">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Compatibilidade Total</CardTitle>
                <CardDescription className="text-gray-400">
                  Suporte completo para Black Ops 6, Modern Warfare 3 e Warzone. Funciona em todas as versões do Windows com drivers atualizados automaticamente.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all hover:border-blue-600">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Velocidade Extrema</CardTitle>
                <CardDescription className="text-gray-400">
                  Processamento em tempo real com latência zero. Aimbot instantâneo e ESP ultra-rápido para reações imediatas em combate.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all hover:border-blue-600">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Headphones className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Suporte Especializado</CardTitle>
                <CardDescription className="text-gray-400">
                  Equipe técnica especializada em game hacking disponível 24/7. Suporte via Discord com resposta rápida e soluções eficazes.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Escolha o plano perfeito</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comece grátis e escale conforme cresce. Todos os planos incluem nossos recursos principais com limites
              variados.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
           {/* Starter Plan */}
<Card className="border-2 border-gray-700 bg-gray-800/50 hover:border-blue-500 transition-colors">
  <CardHeader className="text-center pb-8">
    <CardTitle className="text-2xl text-white">Plano Semanal</CardTitle>
    <CardDescription className="text-gray-400">Perfeito para testar e conhecer o BO6 External</CardDescription>
    <div className="mt-4">
      <span className="text-4xl font-bold text-white">R$ 29</span>
      <span className="text-gray-400">/semana</span>
    </div>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="flex items-center">
      <Check className="w-5 h-5 text-green-500 mr-3" />
      <span className="text-gray-300">Aimbot com FOV, suavidade e zona morta</span>
    </div>
    <div className="flex items-center">
      <Check className="w-5 h-5 text-green-500 mr-3" />
      <span className="text-gray-300">Visual completo (caixas, esqueletos, linhas, saúde)</span>
    </div>
    <div className="flex items-center">
      <Check className="w-5 h-5 text-green-500 mr-3" />
      <span className="text-gray-300">Modo Stream (bypass de gravações e screenshots)</span>
    </div>
    <div className="flex items-center">
      <Check className="w-5 h-5 text-green-500 mr-3" />
      <span className="text-gray-300">Spoofer incluso</span>
    </div>
  </CardContent>
  <CardFooter>
    <Button
      className="w-full bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700"
      variant="outline"
      onClick={() => openPaymentModal("Iniciante", 29)}
    >
      Comprar Agora
    </Button>
  </CardFooter>
</Card>

{/* Professional Plan */}
<Card className="border-2 border-blue-500 relative bg-gray-800/70 hover:border-blue-400 transition-colors">
  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
    <Badge className="bg-blue-600 text-white px-4 py-1">Mais Popular</Badge>
  </div>
  <CardHeader className="text-center pb-8">
    <CardTitle className="text-2xl text-white">Plano Mensal</CardTitle>
    <CardDescription className="text-gray-400">Ideal para uso constante e competitivo</CardDescription>
    <div className="mt-4">
      <span className="text-4xl font-bold text-white">R$ 59</span>
      <span className="text-gray-400">/mês</span>
    </div>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="flex items-center">
      <Check className="w-5 h-5 text-green-500 mr-3" />
      <span className="text-gray-300">Todos os recursos do plano semanal</span>
    </div>
    <div className="flex items-center">
      <Check className="w-5 h-5 text-green-500 mr-3" />
      <span className="text-gray-300">Atualizações frequentes para BO6 e MW3</span>
    </div>
    <div className="flex items-center">
      <Check className="w-5 h-5 text-green-500 mr-3" />
      <span className="text-gray-300">Configurações salvas automaticamente</span>
    </div>
    <div className="flex items-center">
      <Check className="w-5 h-5 text-green-500 mr-3" />
      <span className="text-gray-300">Suporte prioritário via Discord</span>
    </div>
  </CardContent>
  <CardFooter>
    <Button
      className="w-full bg-blue-600 hover:bg-blue-700"
      onClick={() => openPaymentModal("Profissional", 59)}
    >
      Comprar Agora
    </Button>
  </CardFooter>
</Card>

{/* Enterprise Plan */}
<Card className="border-2 border-gray-700 bg-gray-800/50 hover:border-blue-500 transition-colors">
  <CardHeader className="text-center pb-8">
    <CardTitle className="text-2xl text-white">Plano Lifetime</CardTitle>
    <CardDescription className="text-gray-400">Acesso vitalício com suporte completo e sem renovações</CardDescription>
    <div className="mt-4">
      <span className="text-4xl font-bold text-white">R$ 150</span>
      <span className="text-gray-400">/único</span>
    </div>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="flex items-center">
      <Check className="w-5 h-5 text-green-500 mr-3" />
      <span className="text-gray-300">Todos os recursos do plano mensal</span>
    </div>
    <div className="flex items-center">
      <Check className="w-5 h-5 text-green-500 mr-3" />
      <span className="text-gray-300">Licença vitalícia, sem mensalidade</span>
    </div>
    <div className="flex items-center">
      <Check className="w-5 h-5 text-green-500 mr-3" />
      <span className="text-gray-300">Suporte prioritário por tempo ilimitado</span>
    </div>
    <div className="flex items-center">
      <Check className="w-5 h-5 text-green-500 mr-3" />
      <span className="text-gray-300">Atualizações garantidas para sempre</span>
    </div>
  </CardContent>
  <CardFooter>
    <Button
      className="w-full bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700"
      variant="outline"
      onClick={() => openPaymentModal("Empresarial", 150)}
    >
      Comprar Agora
    </Button>
  </CardFooter>
</Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Confiado pelos melhores gamers</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Veja o que nossos clientes têm a dizer sobre sua experiência com o GameFlow Pro.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-gray-700 bg-gray-800/50">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Incrível! O aimbot é suave e natural, nunca fui detectado. A performance é perfeita, zero impacto no FPS. Melhor investimento que já fiz."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-400 font-semibold">JD</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">João Silva</p>
                    <p className="text-sm text-gray-400">Pro Player, 3.5 K/D</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-gray-700 bg-gray-800/50">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Uso há 6 meses sem problemas. O ESP é cristalino e o modo streamer funciona perfeitamente. Qualidade premium de verdade!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-400 font-semibold">MC</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Maria Costa</p>
                    <p className="text-sm text-gray-400">Streamer, 50K Seguidores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-gray-700 bg-gray-800/50">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Suporte incrível! Tive um problema e resolveram em minutos. O software é estável, rápido e totalmente seguro. Recomendo 100%!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-400 font-semibold">PR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Pedro Rodrigues</p>
                    <p className="text-sm text-gray-400">Gamer Competitivo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pronto para dominar o jogo?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de gamers que já usam o GameFlow Pro para melhorar suas operações e aumentar a
            performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 text-lg px-8 py-3">
              Comprar Agora
            </Button>
  <a
  href="https://wa.me/5527981116052"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button
    size="lg"
    variant="outline"
    className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-900 bg-transparent"
  >
    Falar com Suporte
  </Button>
</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">GameFlow Pro</span>
              </div>
              <p className="text-gray-400">
                Transforme sua gameplay com soluções de software inteligentes projetadas para gamers modernos.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Preços
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Integrações
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Carreiras
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Documentação
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Segurança
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GameFlow Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <AlertDialog open={isPixModalOpen} onOpenChange={setIsPixModalOpen}>
        <AlertDialogContent className="bg-gray-800 border border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Pague com PIX</AlertDialogTitle>
            <AlertDialogDescription>
              Escaneie o QR Code abaixo ou copie o código para pagar com PIX.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            {qrCode && <img src={qrCode || "/placeholder.svg"} alt="QR Code PIX" className="w-64 h-64" />}
            {pixCode && (
              <div className="relative mt-4">
                <input
                  type="text"
                  value={pixCode}
                  readOnly
                  className="bg-gray-700 text-white rounded-md px-4 py-2 w-full md:w-96"
                />
                <Button
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={copied}
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-gray-300 hover:bg-gray-700">Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <PixPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        planName={selectedPlan?.name || ""}
        planPrice={selectedPlan?.price || 0}
      />
    </div>
  )
}
