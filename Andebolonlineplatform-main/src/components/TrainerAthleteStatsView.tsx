import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Eye, ArrowLeft, Flame, Zap, TrendingUp, Shield, Target, Award, Search } from 'lucide-react';
import { athleteStatsAPI } from '../services/api';
import { LoadingWave } from './ui/LoadingWave';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Custom ProgressBar Component for CSS Cartesian Bars
// Custom technical Cartesian Bar
// Custom technical Cartesian Bar

interface AtletaStats {
  id: number;
  atleta_id: number;
  nome: string;
  equipa: string;
  golos_marcados: number;
  cartoes_amarelos: number;
  cartoes_vermelhos: number;
  dois_minutos: number;
  jogos: number;
  media_golos: number;
}

export function TrainerAthleteStatsView() {
  const [atletasList, setAtletasList] = useState<AtletaStats[]>([]);
  const [selectedAtleta, setSelectedAtleta] = useState<AtletaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadAtletasList();
  }, []);

  useEffect(() => {
    if (selectedAtleta) {
      loadAthleteHistory(selectedAtleta.atleta_id);
    }
  }, [selectedAtleta]);

  async function loadAtletasList() {
    try {
      const data = await athleteStatsAPI.getPublicStats();

      if (data.success && data.data.length > 0) {
        const atletas = data.data.map((item: any) => ({
          id: item.id,
          atleta_id: item.atleta_id,
          nome: item.atleta?.user?.nome || 'Atleta',
          equipa: item.atleta?.equipa?.nome || 'Sem equipa',
          golos_marcados: item.golos_marcados || 0,
          cartoes_amarelos: item.cartoes_amarelos || 0,
          cartoes_vermelhos: item.cartoes_vermelhos || 0,
          dois_minutos: item.dois_minutos || 0,
          jogos: item.jogos || 0,
          media_golos: item.media_golos || 0
        }));
        setAtletasList(atletas);
      }
    } catch (error) {
      console.log('Erro ao carregar atletas:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadAthleteHistory(athleteId: number) {
    setLoadingHistory(true);
    try {
      const res = await athleteStatsAPI.getAthleteGameStats(athleteId);
      if (res.success) {
        // Transform data for chart: map to { jogo: index+1, golos: number }
        const history = res.data.map((game: any, index: number) => ({
          jogo: index + 1,
          golos: Number(game.golos) || 0,
          adversario: game.jogo?.adversario || 'Adversário'
        }));
        setGameHistory(history);
      } else {
        setGameHistory([]);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setGameHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }

  const [searchQuery, setSearchQuery] = useState('');

  // Filter athletes based on search query
  const filteredAtletas = atletasList.filter(atleta =>
    atleta.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    atleta.equipa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedAtleta) {
    // Data based on athlete stats

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4 mb-2">
          <Button
            onClick={() => setSelectedAtleta(null)}
            className="bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 font-black uppercase text-xs tracking-widest px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Lista
          </Button>
        </div>

        {/* Perfil Detalhado do Atleta */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lado Esquerdo: Bars */}
          <div className="lg:col-span-5">
            <div className="retro-card shadow-2xl h-full">
              <div className="retro-card__title">
                <span className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-blue-400" />
                  PERFIL: {selectedAtleta.nome.toUpperCase()}
                </span>
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="bg-white border-x border-b border-gray-300 p-6 flex flex-col justify-center min-h-[450px]">
                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="text-slate-600 font-bold uppercase tracking-widest text-xs">Evolução de Golos</h3>
                  </div>

                  <div style={{ width: '100%', height: '300px' }} className="w-full">
                    {loadingHistory ? (
                      <div className="h-full flex items-center justify-center">
                        <LoadingWave />
                      </div>
                    ) : gameHistory.length > 0 ? (
                      <>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={gameHistory} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                              dataKey="jogo"
                              stroke="#94a3b8"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: '#94a3b8', fontSize: 10 }}
                            />
                            <YAxis
                              stroke="#94a3b8"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              allowDecimals={false}
                              tick={{ fill: '#94a3b8', fontSize: 10 }}
                              domain={[0, 'auto']}
                            />
                            <Tooltip
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                              labelStyle={{ color: '#64748b', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                              formatter={(value: any) => [`${value} Golos`, 'Performance']}
                            />
                            <Line
                              type="monotone"
                              dataKey="golos"
                              stroke="#2563eb"
                              strokeWidth={3}
                              activeDot={{ r: 6, stroke: '#bfdbfe', strokeWidth: 4 }}
                              dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        {searchQuery.includes('debug') && (
                          <div className="h-20 overflow-auto text-[10px] bg-gray-100 p-2 mt-2">
                            DEBUG DATA: {JSON.stringify(gameHistory)}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <TrendingUp className="w-10 h-10 mb-2 opacity-20" />
                        <span className="text-xs uppercase font-bold tracking-widest opacity-50">Sem dados de evolução</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full mt-6">
                  <div className="bg-white p-4 text-center rounded-lg shadow-sm border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Média de Golos / Jogo</p>
                    <p className="text-3xl font-black text-black font-mono">{selectedAtleta.media_golos.toFixed(2)} <span className="text-sm opacity-60 text-slate-400">G/J</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito: Stats Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="retro-card mb-0 shadow-lg">
              <div className="retro-card__title bg-blue-700 py-3">
                <span className="text-xs flex items-center gap-2 uppercase tracking-tighter font-black"><Zap className="w-3 h-3" /> Jogos na Época</span>
              </div>
              <div className="bg-white border-x border-b border-gray-200 p-8 text-center">
                <div className="text-6xl font-black text-gray-900 font-mono mb-2">{selectedAtleta.jogos}</div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">REGISTOS TOTAIS</p>
              </div>
            </div>

            <div className="retro-card mb-0 shadow-lg">
              <div className="retro-card__title bg-emerald-700 py-3">
                <span className="text-xs flex items-center gap-2 uppercase tracking-tighter font-black"><Flame className="w-3 h-3" /> Total de Golos</span>
              </div>
              <div className="bg-white border-x border-b border-gray-200 p-8 text-center">
                <div className="text-6xl font-black text-emerald-600 font-mono mb-2">{selectedAtleta.golos_marcados}</div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">SOMA DE PONTUAÇÃO</p>
              </div>
            </div>

            <div className="retro-card mb-0 shadow-lg sm:col-span-2">
              <div className="retro-card__title bg-blue-700 py-3">
                <span className="text-xs flex items-center gap-2 uppercase tracking-tighter font-black"><Shield className="w-3 h-3" /> Disciplina (Cartões e Susp.)</span>
              </div>
              <div className="bg-white border-x border-b border-gray-200 p-6">
                <div className="grid grid-cols-3 divide-x divide-gray-100">
                  <div className="text-center">
                    <p className="text-3xl font-black text-gray-800 font-mono">{selectedAtleta.cartoes_amarelos}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Amarelos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-gray-800 font-mono">{selectedAtleta.dois_minutos}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">2 Minutos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-gray-800 font-mono">{selectedAtleta.cartoes_vermelhos}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Vermelhos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Estilo Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-pulse" />
            Análise de Atletas
          </h2>
          <div className="text-sm sm:text-base text-gray-500 font-medium tracking-wide flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
            Visualiza o rendimento detalhado de cada jogador
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 mb-8 shadow-sm rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Pesquisar por Atleta ou Equipa</Label>
            <div className="relative">
              <Input
                placeholder="Nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-9 font-mono border-2 border-gray-200 focus:border-blue-500 rounded-none bg-gray-50 text-sm"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingWave />
        </div>
      ) : filteredAtletas.length === 0 ? (
        <div className="retro-card shadow-xl">
          <div className="bg-white p-20 text-center space-y-4">
            <Target className="w-16 h-16 mx-auto text-gray-200" />
            <p className="text-gray-400 font-mono uppercase tracking-widest text-sm">Nenhum atleta encontrado</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAtletas.map((atleta: AtletaStats) => (
            <div key={atleta.id} className="retro-card mb-0 shadow-lg hover:shadow-2xl transition-all group">
              <div className="retro-card__title group-hover:bg-blue-700 transition-colors">
                <span className="flex items-center gap-3 truncate">
                  <Award className="w-4 h-4 text-blue-300" />
                  {atleta.nome.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono opacity-50 shrink-0">{atleta.equipa}</span>
              </div>
              <div className="bg-white border-x border-gray-300 p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Média Golos</p>
                    <p className="text-2xl font-black text-blue-600 font-mono">{atleta.media_golos.toFixed(2)}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Total Jogos</p>
                    <p className="text-2xl font-black text-gray-900 font-mono">{atleta.jogos}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 border-x border-b border-gray-300 p-4">
                <Button
                  onClick={() => setSelectedAtleta(atleta)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-none shadow-md gap-2 uppercase tracking-widest text-xs"
                >
                  <Eye className="w-4 h-4" />
                  Analisar Perfil
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}