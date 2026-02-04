import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Flame, Zap, Trophy, TrendingUp, Shield, Loader2 } from 'lucide-react';
import { athleteStatsAPI } from '../services/api';

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

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">O Meu Percurso</h2>
          <p className="text-gray-500 font-medium tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Estatísticas de jogo importadas pelo treinador
          </p>
        </div>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-0 overflow-hidden border-2 border-blue-50 hover:border-blue-100 transition-all shadow-sm">
          <CardContent className="p-0">
            <div className="bg-blue-600 p-3 flex justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="p-6 text-center">
              <div className="text-4xl font-black text-gray-900 mb-1">{stats.jogos}</div>
              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Jogos Disputados</div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0 overflow-hidden border-2 border-emerald-50 hover:border-emerald-100 transition-all shadow-sm">
          <CardContent className="p-0">
            <div className="bg-emerald-600 p-3 flex justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div className="p-6 text-center">
              <div className="text-4xl font-black text-gray-900 mb-1">{stats.golos}</div>
              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Golos ({mediaGolos}/j)</div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0 overflow-hidden border-2 border-amber-50 hover:border-amber-100 transition-all shadow-sm">
          <CardContent className="p-0">
            <div className="bg-amber-500 p-3 flex justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="p-6 text-center">
              <div className="text-4xl font-black text-gray-900 mb-1">🟨{stats.cartoesAmarelos} 🟥{stats.cartoesVermelhos}</div>
              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Ações Disciplinares</div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0 overflow-hidden border-2 border-purple-50 hover:border-purple-100 transition-all shadow-sm">
          <CardContent className="p-0">
            <div className="bg-purple-600 p-3 flex justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="p-6 text-center">
              <div className="text-4xl font-black text-gray-900 mb-1">{stats.doisMinutos}</div>
              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Suspensões (2m)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card className="border-2 border-gray-100 shadow-xl overflow-hidden rounded-2xl">
        <div className="bg-gray-50 border-b-2 border-gray-100 px-8 py-6 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Histórico por Jogo</h3>
          <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-full border border-gray-200">
            {gameHistory.length} REGISTOS
          </span>
        </div>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-20 flex justify-center items-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : gameHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">DATA</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ADVERSÁRIO</th>
                    <th className="px-8 py-5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">G. MARCADOS</th>
                    <th className="px-8 py-5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest text-red-400">G. SOFRIDOS</th>
                    <th className="px-8 py-5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">🟨</th>
                    <th className="px-8 py-5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">🟥</th>
                    <th className="px-8 py-5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">2MIN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {gameHistory.map((h) => (
                    <tr key={h.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-8 py-6 text-sm font-bold text-gray-900">
                        {h.jogo?.data_jogo ? new Date(h.jogo?.data_jogo).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-black text-gray-500 uppercase">
                            {h.jogo?.adversario ? h.jogo.adversario.charAt(0) : '?'}
                          </div>
                          <span className="text-sm font-bold text-gray-700">{h.jogo?.adversario || 'Desconhecido'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm font-black">
                          {h.golos}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 text-sm font-black">
                          {h.jogo?.golos_sofridos || 0}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center font-mono font-bold text-gray-600">{h.amarelo}</td>
                      <td className="px-8 py-6 text-center font-mono font-bold text-gray-600">{h.vermelho}</td>
                      <td className="px-8 py-6 text-center font-mono font-bold text-gray-600">{h.dois_minutos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <Trophy className="w-10 h-10" />
              </div>
              <div>
                <p className="text-gray-900 font-bold">Sem dados de jogo</p>
                <p className="text-gray-500 text-sm">Aguarda que o teu treinador faça o upload do próximo jogo.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
