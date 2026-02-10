import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardTitle } from './ui/card';
import { athleteStatsAPI } from '../services/api';
import { Loader2, Trophy, Target, AlertTriangle, TrendingDown, Medal } from 'lucide-react';
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
  const { user, estatisticasCarregando } = useApp();

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

        console.log('📊 Raw API Data:', data.data); // Debug completo

        const scorers = data.data
          .filter((item: any) => {
            const golos = item.golos_marcados || item.golos || 0;
            console.log(`Atleta: ${item.atleta?.user?.nome || 'N/A'}, Golos: ${golos}`);
            return golos > 0;
          })
          .map((item: any) => {
            const nome = item.atleta?.user?.nome || item.nome || item.atleta_nome || 'Atleta';
            const equipa = item.atleta?.equipa?.nome || item.equipa || 'Sem Equipa';
            const golos = item.golos_marcados || item.golos || 0;
            const jogos = item.jogos || 1;
            const media = jogos > 0 ? golos / jogos : 0;

            return { nome, equipa, golos, jogos, media };
          })
          .sort((a: TopScorer, b: TopScorer) => b.golos - a.golos)
          .slice(0, 5);

        console.log('🏆 Top Scorers Final:', scorers);
        setTopScorers(scorers);
      }
    } catch (error) {
      console.log('Erro ao carregar estatísticas da equipa:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;




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
            <div className="retro-card shadow-lg">
              <div className="retro-card__title bg-yellow-600 py-3">
                <span className="text-xs flex items-center gap-2">
                  <Trophy className="w-3 h-3" /> TOP 5 MELHORES MARCADORES
                </span>
              </div>
              <div className="bg-white border-x border-b border-gray-300">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : topScorers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                          <th className="text-left p-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">#</th>
                          <th className="text-left p-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">Atleta / Equipa</th>
                          <th className="text-center p-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">Jogos</th>
                          <th className="text-center p-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">Golos</th>
                          <th className="text-center p-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">Média</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topScorers.map((scorer, index) => (
                          <tr key={index} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-yellow-50' : ''}`}>
                            <td className="p-3">
                              <div className="flex justify-center items-center">
                                {index === 0 ? (
                                  <div className="relative flex items-center justify-center">
                                    <Trophy className="w-10 h-10 text-yellow-500 drop-shadow-sm" fill="#EAB308" />
                                  </div>
                                ) : index === 1 ? (
                                  <div className="relative flex items-center justify-center">
                                    <Medal className="w-9 h-9 text-slate-400 drop-shadow-sm" fill="#94a3b8" />
                                  </div>
                                ) : index === 2 ? (
                                  <div className="relative flex items-center justify-center">
                                    <Medal className="w-9 h-9 text-amber-600 drop-shadow-sm" fill="#d97706" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
                                    {index + 1}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-gray-900">{scorer.nome}</div>
                              <div className="text-xs text-gray-500 font-semibold">{scorer.equipa}</div>
                            </td>
                            <td className="p-3 text-center">
                              <div className="text-lg font-black text-gray-900 font-mono">{scorer.jogos}</div>
                            </td>
                            <td className="p-3 text-center">
                              <div className="text-lg font-black text-emerald-600 font-mono">{scorer.golos}</div>
                            </td>
                            <td className="p-3 text-center">
                              <div className="text-sm font-bold text-gray-700 font-mono">{scorer.media.toFixed(1)}<span className="text-xs text-gray-400">G/J</span></div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8 text-sm">Ainda não há marcadores registados</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
