import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { athleteStatsAPI } from '../services/api';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Loader2, Trophy, Target, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LoadingWave } from './ui/LoadingWave';

interface TeamAggregatedStats {
  totalGolos: number;
  totalDoisMinutos: number;
  totalVermelhos: number;
  totalJogos: number;
}

interface TopScorer {
  nome: string;
  equipa: string;
  golos: number;
  jogos: number;
  media: number;
}

export function TeamStatsSection() {
  const { user, estatisticasEquipas, estatisticasCarregando } = useApp();

  const [teamStats, setTeamStats] = useState<TeamAggregatedStats>({ totalGolos: 0, totalDoisMinutos: 0, totalVermelhos: 0, totalJogos: 0 });
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamAggregatedStats();
  }, []);

  async function loadTeamAggregatedStats() {
    try {
      const data = await athleteStatsAPI.getPublicStats();

      if (data.success && data.data.length > 0) {
        const stats = data.data.reduce((acc: TeamAggregatedStats, atleta: any) => ({
          totalGolos: acc.totalGolos + (atleta.golos_marcados || 0),
          totalDoisMinutos: acc.totalDoisMinutos + (atleta.dois_minutos || 0),
          totalVermelhos: acc.totalVermelhos + (atleta.cartoes_vermelhos || 0),
          totalJogos: acc.totalJogos + (atleta.jogos || 0)
        }), { totalGolos: 0, totalDoisMinutos: 0, totalVermelhos: 0, totalJogos: 0 });

        setTeamStats(stats);

        const scorers = data.data
          .map((atleta: any) => ({
            nome: atleta.atleta?.user?.nome || atleta.atleta_nome || 'Atleta',
            equipa: atleta.atleta?.equipa?.nome || 'Sem Equipa',
            golos: atleta.golos_marcados || 0,
            jogos: atleta.jogos || 0,
            media: atleta.media_golos || 0
          }))
          .sort((a: TopScorer, b: TopScorer) => b.golos - a.golos)
          .slice(0, 5);

        setTopScorers(scorers);
      }
    } catch (error) {
      console.log('Erro ao carregar estatísticas da equipa:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  const filteredStats = estatisticasEquipas;

  const calculateAverage = (total: number, matches: number) => {
    return (total / matches).toFixed(1);
  };



  return (
    <div className="space-y-6">
      <br />
      <div>
        <h2>Estatísticas de Equipas</h2>
        <p className="text-gray-600">
          Descobre como a tua equipa está a arrasar!
        </p>
      </div>

      <div className="mt-6">
        {estatisticasCarregando ? (
          <div className="flex justify-center items-center py-12">
            <LoadingWave />
          </div>
        ) : (
          <>
            {/* Estatísticas Agregadas da Equipa */}
            {/* Container Flex que permite que os itens quebrem linha e fiquem centralizados */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">

              {/* Total de Golos - Ocupa quase metade da largura (w-[calc(50%-8px)]) */}
              <Card className="bg-green-50 w-full sm:w-[calc(50%-8px)]">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <CardDescription>Total de Golos</CardDescription>
                  <CardTitle className="text-2xl text-green-600">{teamStats.totalGolos}</CardTitle>
                </CardContent>
              </Card>

              {/* 2 Minutos */}
              <Card className="bg-purple-50 w-full sm:w-[calc(50%-8px)]">
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                  <CardDescription>2 Minutos (Total)</CardDescription>
                  <CardTitle className="text-2xl text-purple-600">{teamStats.totalDoisMinutos}</CardTitle>
                </CardContent>
              </Card>

              {/* Cartões Vermelhos - Se for o último, o justify-center do pai vai centralizá-lo */}
              <Card className="bg-red-50 w-full sm:w-[calc(50%-8px)]">
                <CardContent className="p-4 text-center">
                  <TrendingDown className="w-8 h-8 mx-auto text-red-600 mb-2" />
                  <CardDescription>Cartões Vermelhos</CardDescription>
                  <CardTitle className="text-2xl text-red-600">{teamStats.totalVermelhos}</CardTitle>
                </CardContent>
              </Card>

              {/* Total de Jogos - Se aparecer, ocupa o 4º lugar; se não, os Vermelhos ficam sozinhos no centro */}
              {['admin', 'root'].includes(user.tipo) && (
                <Card className="bg-blue-50 w-full sm:w-[calc(50%-8px)]">
                  <CardContent className="p-4 text-center">
                    <Trophy className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                    <CardDescription>Total de Jogos</CardDescription>
                    <CardTitle className="text-2xl text-blue-600">{teamStats.totalJogos}</CardTitle>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Top 5 Marcadores */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Top 5 Melhores Marcadores
                </CardTitle>
                <CardDescription>Os atletas com mais golos marcados</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : topScorers.length > 0 ? (
                  <div className="space-y-3">
                    {topScorers.map((scorer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                              index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                            } `}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold">{scorer.nome}</div>
                            <div className="text-xs text-gray-500 font-bold">{scorer.equipa}</div>
                            <div className="text-sm text-gray-600">{scorer.jogos} jogos</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">{scorer.golos}</div>
                          <div className="text-sm text-gray-600">{scorer.media.toFixed(1)}/jogo</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">Ainda não há marcadores registados</p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
