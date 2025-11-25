import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trophy, Users, BookOpen, TrendingUp } from 'lucide-react';

interface HomeProps {
  onNavigateToLogin: () => void;
}

export function Home({ onNavigateToLogin }: HomeProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8" />
            <h1>NexusHand</h1>
          </div>
          <Button 
            onClick={onNavigateToLogin}
            variant="secondary"
          >
            Entrar / Registar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <h2 className="text-6xl md:text-7xl lg:text-8xl tracking-tight mb-6">
              NexusHand
            </h2>
            <div className="h-1 w-32 bg-white mx-auto mb-8"></div>
          </div>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-blue-50">
            A plataforma dedicada a atletas e treinadores de andebol para partilha de jogadas, 
            dicas técnicas e estatísticas de equipas e atletas.
          </p>
          <Button 
            onClick={onNavigateToLogin}
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
          >
            Começar Agora
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card>
              <CardHeader>
                <Trophy className="w-12 h-12 text-blue-600 mb-2" />
                <CardTitle>Jogadas</CardTitle>
                <CardDescription>
                  Partilhe e comente jogadas com a comunidade
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <BookOpen className="w-12 h-12 text-blue-600 mb-2" />
                <CardTitle>Dicas Técnicas</CardTitle>
                <CardDescription>
                  Aceda a fintas, dribles e técnicas avançadas
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-blue-600 mb-2" />
                <CardTitle>Estatísticas</CardTitle>
                <CardDescription>
                  Consulte estatísticas de equipas e atletas
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-blue-600 mb-2" />
                <CardTitle>Comunidade</CardTitle>
                <CardDescription>
                  Conecte-se com atletas e treinadores
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Information Tabs */}
          <Tabs defaultValue="historia" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="historia">História</TabsTrigger>
              <TabsTrigger value="regras">Regras</TabsTrigger>
              <TabsTrigger value="curiosidades">Curiosidades</TabsTrigger>
            </TabsList>

            <TabsContent value="historia">
              <Card>
                <CardHeader>
                  <CardTitle>História do Andebol</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2">Origem</h3>
                    <p className="text-gray-600">
                      O andebol foi criado em 1919 pelo professor alemão Karl Schelenz, 
                      na cidade de Berlim. Inicialmente, era jogado em campos abertos 
                      com 11 jogadores por equipa.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2">Evolução</h3>
                    <p className="text-gray-600">
                      Em 1936, o andebol de campo foi incluído nos Jogos Olímpicos de Berlim. 
                      A versão de pavilhão (7 jogadores) tornou-se mais popular a partir de 1950 
                      e é a modalidade praticada atualmente.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2">Desenvolvimento Internacional</h3>
                    <p className="text-gray-600">
                      A Federação Internacional de Andebol (IHF) foi fundada em 1946. 
                      O andebol de pavilhão entrou nos Jogos Olímpicos em 1972 (masculino) 
                      e 1976 (feminino).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="regras">
              <Card>
                <CardHeader>
                  <CardTitle>Regras Principais do Andebol</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2">Equipas</h3>
                    <p className="text-gray-600">
                      Cada equipa tem 7 jogadores em campo (6 jogadores de campo + 1 guarda-redes). 
                      São permitidos até 7 suplentes.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2">Duração do Jogo</h3>
                    <p className="text-gray-600">
                      O jogo tem 2 partes de 30 minutos cada (seniores), com 10 minutos de intervalo. 
                      Para escalões jovens, a duração é reduzida.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2">Passos e Bola</h3>
                    <p className="text-gray-600">
                      O jogador pode dar no máximo 3 passos com a bola e mantê-la por 3 segundos. 
                      Pode driblar, parar e voltar a driblar.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2">Área de Baliza</h3>
                    <p className="text-gray-600">
                      Apenas o guarda-redes pode entrar na área de baliza (6 metros). 
                      Os jogadores podem saltar de fora e rematar no ar.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2">Penalizações</h3>
                    <p className="text-gray-600">
                      Cartão amarelo (advertência), 2 minutos de exclusão, 
                      cartão vermelho (desqualificação) e cartão azul (expulsão com relatório).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="curiosidades">
              <Card>
                <CardHeader>
                  <CardTitle>Curiosidades sobre o Andebol</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2">Velocidade da Bola</h3>
                    <p className="text-gray-600">
                      Um remate de um jogador profissional pode atingir velocidades 
                      superiores a 130 km/h!
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2">Popularidade</h3>
                    <p className="text-gray-600">
                      O andebol é o segundo desporto coletivo mais popular na Europa, 
                      perdendo apenas para o futebol.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2">Campeões</h3>
                    <p className="text-gray-600">
                      A França é a seleção mais bem-sucedida do mundo, com múltiplos 
                      títulos mundiais e olímpicos.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2">Em Portugal</h3>
                    <p className="text-gray-600">
                      O andebol em Portugal tem crescido significativamente, 
                      com várias equipas a competir em competições europeias.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2">Recordes</h3>
                    <p className="text-gray-600">
                      O maior número de golos num jogo profissional foi 320 
                      (Dinamarca vs Kuwait, 166-154, em 1982).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p>© 2025 NexusHand - Plataforma de Andebol</p>
          <p className="text-gray-400 mt-2">
            Desenvolvido para apoiar atletas e treinadores na evolução desportiva
          </p>
        </div>
      </footer>
    </div>
  );
}
