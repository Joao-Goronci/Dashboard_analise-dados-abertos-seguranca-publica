"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Dados simulados por município
const dadosMock = [
  { municipio: "Vitória", ocorrencias: 1245, homicidios: 23, furtos: 892, roubos: 330 },
  { municipio: "Vila Velha", ocorrencias: 1532, homicidios: 31, furtos: 1120, roubos: 381 },
  { municipio: "Serra", ocorrencias: 1389, homicidios: 42, furtos: 987, roubos: 360 },
  { municipio: "Cariacica", ocorrencias: 1156, homicidios: 38, furtos: 756, roubos: 362 },
  { municipio: "Cachoeiro", ocorrencias: 623, homicidios: 12, furtos: 445, roubos: 166 },
  { municipio: "Linhares", ocorrencias: 534, homicidios: 15, furtos: 378, roubos: 141 },
  { municipio: "Colatina", ocorrencias: 312, homicidios: 8, furtos: 234, roubos: 70 },
  { municipio: "Guarapari", ocorrencias: 421, homicidios: 9, furtos: 298, roubos: 114 },
]

// Dados por mês (evolução temporal)
const dadosMensais = [
  { mes: "Jan", ocorrencias: 580 },
  { mes: "Fev", ocorrencias: 520 },
  { mes: "Mar", ocorrencias: 610 },
  { mes: "Abr", ocorrencias: 590 },
  { mes: "Mai", ocorrencias: 640 },
  { mes: "Jun", ocorrencias: 680 },
  { mes: "Jul", ocorrencias: 720 },
  { mes: "Ago", ocorrencias: 690 },
  { mes: "Set", ocorrencias: 650 },
  { mes: "Out", ocorrencias: 710 },
  { mes: "Nov", ocorrencias: 750 },
  { mes: "Dez", ocorrencias: 620 },
]

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981"]

const respostasIA: Record<string, string> = {
  "qual municipio tem mais crimes": "Com base nos dados de 2025, Vila Velha apresenta o maior número de ocorrências (1.532), seguido por Serra (1.389) e Vitória (1.245).",
  "qual a taxa de homicidios": "A taxa de homicídios no ES em 2025 apresenta Serra com o maior número absoluto (42), seguido por Cariacica (38) e Vila Velha (31).",
  "default": "Posso ajudar com análises sobre ocorrências, homicídios, furtos e roubos nos municípios do ES. O que gostaria de saber?"
}

// Função para gerar variação aleatória nos dados (simula atualização)
function gerarDadosAleatorios(dadosBase: typeof dadosMock) {
  return dadosBase.map(d => ({
    ...d,
    ocorrencias: d.ocorrencias + Math.floor(Math.random() * 200) - 100,
    homicidios: Math.max(0, d.homicidios + Math.floor(Math.random() * 10) - 5),
    furtos: d.furtos + Math.floor(Math.random() * 150) - 75,
    roubos: d.roubos + Math.floor(Math.random() * 80) - 40,
  }))
}

function gerarDadosMensaisAleatorios(dadosBase: typeof dadosMensais) {
  return dadosBase.map(d => ({
    ...d,
    ocorrencias: d.ocorrencias + Math.floor(Math.random() * 100) - 50,
  }))
}

export default function Home() {
  const [dados, setDados] = useState(dadosMock)
  const [dadosMes, setDadosMes] = useState(dadosMensais)
  const [isLoading, setIsLoading] = useState(false)
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(new Date())
  const [filtroMunicipio, setFiltroMunicipio] = useState("todos")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [messages, setMessages] = useState([
    { role: "ia", content: "Olá! Sou o assistente de análise de segurança pública do ES. Como posso ajudar?" }
  ])
  const [input, setInput] = useState("")

  const handleAtualizar = useCallback(() => {
    setIsLoading(true)
    // Simula delay de requisição à API
    setTimeout(() => {
      setDados(gerarDadosAleatorios(dadosMock))
      setDadosMes(gerarDadosMensaisAleatorios(dadosMensais))
      setUltimaAtualizacao(new Date())
      setIsLoading(false)
    }, 1200)
  }, [])

  // Filtrar dados
  const dadosFiltrados = dados.filter(d => 
    filtroMunicipio === "todos" || d.municipio === filtroMunicipio
  )

  const handleSend = () => {
    if (!input.trim()) return
    
    const userMessage = input.toLowerCase()
    setMessages(prev => [...prev, { role: "user", content: input }])
    
    setTimeout(() => {
      let resposta = respostasIA["default"]
      if (userMessage.includes("mais crime") || userMessage.includes("maior")) {
        resposta = respostasIA["qual municipio tem mais crimes"]
      } else if (userMessage.includes("homicidio") || userMessage.includes("morte")) {
        resposta = respostasIA["qual a taxa de homicidios"]
      }
      setMessages(prev => [...prev, { role: "ia", content: resposta }])
    }, 800)
    
    setInput("")
  }

  const totalOcorrencias = dadosFiltrados.reduce((acc, d) => acc + d.ocorrencias, 0)
  const totalHomicidios = dadosFiltrados.reduce((acc, d) => acc + d.homicidios, 0)
  const totalFurtos = dadosFiltrados.reduce((acc, d) => acc + d.furtos, 0)
  const totalRoubos = dadosFiltrados.reduce((acc, d) => acc + d.roubos, 0)

  // Dados para gráfico de pizza
  const dadosPizza = [
    { name: "Furtos", value: totalFurtos },
    { name: "Roubos", value: totalRoubos },
    { name: "Homicídios", value: totalHomicidios },
  ]

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex gap-4 h-[calc(100vh-2rem)]">
        {/* Area Principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold">
                Dados da Segurança Pública do ES - 2025
              </h1>
              <p className="text-xs text-muted-foreground">
                Última atualização: {ultimaAtualizacao.toLocaleTimeString("pt-BR")}
              </p>
            </div>
            <Button variant="outline" onClick={handleAtualizar} disabled={isLoading}>
              {isLoading ? "Atualizando..." : "Atualizar"}
            </Button>
          </div>

          {/* Filtros */}
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Município:</label>
              <select
                value={filtroMunicipio}
                onChange={(e) => setFiltroMunicipio(e.target.value)}
                className="px-3 py-1.5 text-sm border border-border rounded-md bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="todos">Todos</option>
                {dadosMock.map(d => (
                  <option key={d.municipio} value={d.municipio}>{d.municipio}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Tipo de Crime:</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-3 py-1.5 text-sm border border-border rounded-md bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="todos">Todos</option>
                <option value="homicidios">Homicídios</option>
                <option value="furtos">Furtos</option>
                <option value="roubos">Roubos</option>
              </select>
            </div>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Ocorrências</p>
              <p className="text-2xl font-semibold">{totalOcorrencias.toLocaleString()}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Homicídios</p>
              <p className="text-2xl font-semibold text-red-600">{totalHomicidios}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Furtos</p>
              <p className="text-2xl font-semibold text-amber-600">{totalFurtos.toLocaleString()}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Roubos</p>
              <p className="text-2xl font-semibold text-blue-600">{totalRoubos.toLocaleString()}</p>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Gráfico de Barras - Ocorrências por Município */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Ocorrências por Município</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dadosFiltrados}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="municipio" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="ocorrencias" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Linha - Evolução Mensal */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Evolução Mensal de Ocorrências</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dadosMes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="ocorrencias" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Pizza + Tabela */}
          <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
            {/* Gráfico de Pizza */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Distribuição por Tipo</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={dadosPizza}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {dadosPizza.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Tabela de Dados */}
            <div className="col-span-2 bg-card border border-border rounded-lg overflow-hidden flex flex-col">
              <div className="overflow-auto flex-1">
                <table className="w-full">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="text-left p-3 font-medium text-sm">Município</th>
                      <th className="text-right p-3 font-medium text-sm">Ocorrências</th>
                      <th className="text-right p-3 font-medium text-sm">Homicídios</th>
                      <th className="text-right p-3 font-medium text-sm">Furtos</th>
                      <th className="text-right p-3 font-medium text-sm">Roubos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosFiltrados.map((item, i) => (
                      <tr key={i} className="border-t border-border hover:bg-muted/30">
                        <td className="p-3 text-sm font-medium">{item.municipio}</td>
                        <td className="p-3 text-sm text-right">{item.ocorrencias.toLocaleString()}</td>
                        <td className="p-3 text-sm text-right text-red-600">{item.homicidios}</td>
                        <td className="p-3 text-sm text-right text-amber-600">{item.furtos.toLocaleString()}</td>
                        <td className="p-3 text-sm text-right text-blue-600">{item.roubos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Chat IA - Sidebar */}
        <div className="w-72 flex flex-col bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border">
            <h2 className="font-medium text-center">Chat IA</h2>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-4 ${msg.role === "user" ? "text-right" : ""}`}>
                <p className="text-xs text-muted-foreground mb-1">
                  {msg.role === "ia" ? "IA" : "Você"}
                </p>
                <p className={`text-sm inline-block p-2 rounded-lg ${
                  msg.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                }`}>
                  {msg.content}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Digite sua pergunta..."
                className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button onClick={handleSend} size="sm">
                Enviar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
