import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trophy, Users, BookOpen, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HomeProps {
  onNavigateToLogin: () => void;
}

export function Home({ onNavigateToLogin }: HomeProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/hero-handball.jpg',
    '/hero-handball-2.png',
    '/hero-handball-3.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [activeTab, setActiveTab] = useState('historia');

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 md:py-6 px-4 md:px-8 shadow-lg">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="NexusHand Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold animate-text-shine">NexusHand</h1>
          </div>
          <span className="text-white text-lg lg:text-xl font-medium" style={{ fontStyle: 'italic' }}>
            Andebol mais que um desporto
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative text-white py-12 md:py-20 lg:py-32 px-4 overflow-hidden min-h-[60vh] flex items-center justify-center">
        {/* Background Gallery */}
        {images.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 z-0 hero-background transition-opacity duration-2000 ease-in-out ${index === currentImageIndex ? 'opacity-40 animate-subtle-zoom' : 'opacity-0'
              }`}
            style={{
              backgroundImage: `url(${image})`,
              opacity: index === currentImageIndex ? 0.4 : 0
            }}
          />
        ))}
        <div className="absolute inset-0 z-0 bg-blue-950/50" />


        <div className="relative z-10 w-full max-w-[1920px] mx-auto text-center px-4">
          <div className="mb-6">
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl tracking-tight mb-8 animate-text-shine font-black">
              NexusHand
            </h2>
          </div>
          <p className="font-semibold cursive text-lg md:text-xl lg:text-2xl 2xl:text-3xl mb-10 md:mb-16 max-w-4xl mx-auto text-white dark:text-gray-100 drop-shadow-md">
            A plataforma dedicada a atletas e treinadores de andebol para partilha de jogadas,
            dicas técnicas e estatísticas de equipas e atletas.
          </p>
          <br />
          <button onClick={onNavigateToLogin} className="shadow__btn mx-auto text-lg md:text-xl px-8 py-4">
            Começar Agora
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="w-full max-w-[1920px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20 px-4 md:px-8">
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Trophy className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl lg:text-2xl">Jogadas</CardTitle>
                <CardDescription className="text-base">
                  Partilhe e comente jogadas com a comunidade
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl lg:text-2xl">Dicas Técnicas</CardTitle>
                <CardDescription className="text-base">
                  Aceda a fintas, dribles e técnicas avançadas
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl lg:text-2xl">Estatísticas</CardTitle>
                <CardDescription className="text-base">
                  Consulte estatísticas de equipas e atletas
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl lg:text-2xl">Comunidade</CardTitle>
                <CardDescription className="text-base">
                  Conecte-se com atletas e treinadores
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Information Tabs with Custom Nav */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto px-4">

            {/* Custom Lava Lamp Navigation */}
            <div className="flex justify-center w-full mb-8">
              <nav className="custom-nav">
                <a onClick={() => setActiveTab('historia')}>História</a>
                <a onClick={() => setActiveTab('regras')}>Regras</a>
                <a onClick={() => setActiveTab('curiosidades')}>Curiosidades</a>
                <div className={`animation start-${activeTab}`}></div>
              </nav>
            </div>

            <TabsContent value="historia">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">História do Andebol</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-lg text-gray-700 text-center">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Origem</h3>
                    <p>
                      O andebol foi criado em 1919 pelo professor alemão Karl Schelenz,
                      na cidade de Berlim. Inicialmente, era jogado em campos abertos
                      com 11 jogadores por equipa.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Evolução</h3>
                    <p>
                      Em 1936, o andebol de campo foi incluído nos Jogos Olímpicos de Berlim.
                      A versão de pavilhão (7 jogadores) tornou-se mais popular a partir de 1950
                      e é a modalidade praticada atualmente.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Desenvolvimento Internacional</h3>
                    <p>
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
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Regras Principais do Andebol</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-lg text-gray-700 text-center">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Equipas</h3>
                    <p>
                      Cada equipa tem 7 jogadores em campo (6 jogadores de campo + 1 guarda-redes).
                      São permitidos até 7 suplentes.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Duração do Jogo</h3>
                    <p>
                      O jogo tem 2 partes de 30 minutos cada (seniores), com 10 minutos de intervalo.
                      Para escalões jovens, a duração é reduzida.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Passos e Bola</h3>
                    <p>
                      O jogador pode dar no máximo 3 passos com a bola e mantê-la por 3 segundos.
                      Pode driblar, parar e voltar a driblar.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Área de Baliza</h3>
                    <p>
                      Apenas o guarda-redes pode entrar na área de baliza (6 metros).
                      Os jogadores podem saltar de fora e rematar no ar.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Penalizações</h3>
                    <p>
                      Cartão amarelo (advertência), 2 minutos de exclusão,
                      cartão vermelho (desqualificação) e cartão azul (expulsão com relatório).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="curiosidades">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Curiosidades sobre o Andebol</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-lg text-gray-700 text-center">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Velocidade da Bola</h3>
                    <p>
                      Um remate de um jogador profissional pode atingir velocidades
                      superiores a 130 km/h!
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Popularidade</h3>
                    <p>
                      O andebol é o segundo desporto coletivo mais popular na Europa,
                      perdendo apenas para o futebol.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Campeões</h3>
                    <p>
                      A França é a seleção mais bem-sucedida do mundo, com múltiplos
                      títulos mundiais e olímpicos.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Em Portugal</h3>
                    <p>
                      O andebol em Portugal tem crescido significativamente,
                      com várias equipas a competir em competições europeias.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Recordes</h3>
                    <p>
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
      <footer className="bg-gray-800 text-white py-12 px-4 mt-8">
        <div className="w-full max-w-[1920px] mx-auto text-center">
          <p className="text-lg">© 2025 <span className="animate-text-shine font-bold">NexusHand</span> - Plataforma de Andebol</p>
          <p className="text-gray-400 mt-4 text-base">
            Desenvolvido para apoiar atletas e treinadores na evolução desportiva
          </p>
        </div>
      </footer>
    </div>
  );
}
