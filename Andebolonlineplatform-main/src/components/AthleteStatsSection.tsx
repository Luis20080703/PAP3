import { useState, useEffect } from 'react';
import { Flame, Zap, TrendingUp, Shield, Award, Target } from 'lucide-react';
import { athleteStatsAPI } from '../services/api';
import { LoadingWave } from './ui/LoadingWave';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


// Interface para uma entrada de jogo individual
export interface GameStat {
  golos: number;
  cartoesAmarelos: number;
  cartoesVermelhos: number;
  doisMinutos: number;
}

// Interface para as estatísticas agregadas do atleta
export interface AthleteStats extends GameStat {
  jogos: number;
}

export function AthleteStatsSection() {
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<AthleteStats>({
    golos: 0,
    cartoesAmarelos: 0,
    cartoesVermelhos: 0,
    doisMinutos: 0,
    jogos: 0,
  });

  useEffect(() => {
    loadStats();
    loadGameHistory();
  }, []);

  async function loadGameHistory() {
    setLoading(true);
    try {
      const res = await athleteStatsAPI.getMyGameStats();
      if (res.success) {
        setGameHistory(res.data || []);

        // Prepare data for chart (reverse to be chronological: Game 1 -> N)
        const chronologicalData = [...(res.data || [])].reverse();
        const cData = chronologicalData.map((game: any, index: number) => ({
          jogo: index + 1,
          golos: Number(game.golos) || 0,
          adversario: game.jogo?.adversario || 'Adversário'
        }));
        setChartData(cData);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const res = await athleteStatsAPI.getMyStats();

      if (res.success && res.data && res.data.length > 0) {
        const myStats = res.data[0];
        setStats({
          golos: myStats.golos_marcados || 0,
          cartoesAmarelos: myStats.cartoes_amarelos || 0,
          cartoesVermelhos: myStats.cartoes_vermelhos || 0,
          doisMinutos: myStats.dois_minutos || 0,
          jogos: myStats.jogos || 0,
        });
      }
    } catch (error: any) {
      console.error('❌ Erro loadStats:', error);
    }
  }

  const mediaGolos = stats.jogos > 0 ? (stats.golos / stats.jogos).toFixed(2) : '0.00';


  if (loading && gameHistory.length === 0) return <div className="flex justify-center py-20"><LoadingWave /></div>;

  return (
    <div className="space-y-10 pb-10">
      {/* Header com Estilo Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-pulse" />
            O Meu Percurso
          </h2>
          <div className="text-sm sm:text-base text-gray-500 font-medium tracking-wide flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
            Análise de rendimento e historial de competição
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lado Esquerdo: Análise de Rendimento */}
        <div className="lg:col-span-5">
          <div className="retro-card shadow-2xl h-full">
            <div className="retro-card__title">
              <span className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                PERFORMANCE INDIVIDUAL
              </span>
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="bg-white border-x border-b border-gray-300 p-4 sm:p-6 flex flex-col justify-center min-h-fit lg:min-h-[450px]">
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="text-slate-600 font-bold uppercase tracking-widest text-xs">Evolução de Golos</h3>
                </div>

                <div style={{ width: '100%', height: '250px' }} className="w-full">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                          dataKey="jogo"
                          stroke="#94a3b8"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: '#94a3b8', fontSize: 10 }}
                          label={{ value: 'Jogos (Seq.)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#94a3b8' }}
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
                  <p className="text-3xl font-black text-black font-mono">{mediaGolos} <span className="text-sm opacity-60 text-slate-400">G/J</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Cards de Stats */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="retro-card mb-0 shadow-lg">
            <div className="retro-card__title bg-blue-700 py-3">
              <span className="text-xs flex items-center gap-2"><Zap className="w-3 h-3" /> ATIVIDADE</span>
            </div>
            <div className="bg-white border-x border-b border-gray-200 p-8 text-center">
              <div className="text-6xl font-black text-gray-900 font-mono mb-2">{stats.jogos}</div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">JOGOS DISPUTADOS</p>
            </div>
          </div>

          <div className="retro-card mb-0 shadow-lg">
            <div className="retro-card__title bg-emerald-700 py-3">
              <span className="text-xs flex items-center gap-2"><Flame className="w-3 h-3" /> EFICÁCIA</span>
            </div>
            <div className="bg-white border-x border-b border-gray-200 p-8 text-center">
              <div className="text-6xl font-black text-emerald-600 font-mono mb-2">{stats.golos}</div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">GOLOS MARCADOS</p>
            </div>
          </div>

          <div className="retro-card mb-0 shadow-lg sm:col-span-2">
            <div className="retro-card__title bg-blue-700 py-3">
              <span className="text-xs flex items-center gap-2"><Shield className="w-3 h-3" /> REGISTO DISCIPLINAR</span>
            </div>
            <div className="bg-white border-x border-b border-gray-200 p-6">
              <div className="grid grid-cols-3 divide-x divide-gray-100">
                <div className="text-center">
                  <p className="text-3xl font-black text-gray-800 font-mono">{stats.cartoesAmarelos}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Amarelos</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-gray-800 font-mono">{stats.doisMinutos}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">2 Minutos</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-gray-800 font-mono">{stats.cartoesVermelhos}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Vermelhos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico como Retro-Card */}
      <div className="retro-card shadow-2xl">
        <div className="retro-card__title">
          <span className="flex items-center gap-3">
            <Award className="w-5 h-5 text-blue-300" />
            HISTORIAL DE COMPETIÇÃO
          </span>
          <span className="text-xs font-mono opacity-50">{gameHistory.length} JOGOS REGISTADOS</span>
        </div>

        <div className="retro-card__data">
          {/* Coluna Esquerda: Detalhes do Jogo */}
          <div className="retro-card__right">
            <div className="retro-item retro-header">
              DATA / ADVERSÁRIO / DESEMPENHO ATLETA
            </div>
            {gameHistory.length === 0 ? (
              <div className="retro-item text-center text-gray-400 font-mono">
                Sem registos de jogo disponíveis.
              </div>
            ) : (
              gameHistory.map((h) => (
                <div key={h.id} className="retro-item">
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-600 font-black text-xs shrink-0 font-mono text-center">
                      {h.jogo?.data_jogo ? new Date(h.jogo.data_jogo).toLocaleDateString().split('/').slice(0, 2).join('/') : '??'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900 text-sm truncate leading-none uppercase">
                          VS {h.jogo?.adversario || 'ADVERSÁRIO'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                          {h.golos} GOLOS MARCADOS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coluna Direita: Detalhes de Jogo */}
          <div className="retro-card__left">
            <div className="retro-item retro-header justify-end">
              RESULTADO / DISCIPLINA
            </div>
            {gameHistory.map((h) => (
              <div key={h.id} className="retro-item justify-end gap-3 text-right">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-mono font-bold text-gray-600">
                    {h.jogo?.golos_marcados} - {h.jogo?.golos_sofridos}
                  </span>
                  <div className="flex gap-1 mt-1">
                    {h.amarelo > 0 && <div className="w-2 h-3 bg-yellow-400 rounded-sm" title="Amarelo"></div>}
                    {h.vermelho > 0 && <div className="w-2 h-3 bg-red-500 rounded-sm" title="Vermelho"></div>}
                    {h.dois_minutos > 0 && Array.from({ length: h.dois_minutos }).map((_, i) => (
                      <div key={i} className="w-2 h-3 bg-purple-400 rounded-sm" title="2 Min"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
