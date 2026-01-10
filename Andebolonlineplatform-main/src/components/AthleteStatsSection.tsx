import React, { useState, ChangeEvent, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Flame, Zap, Trophy } from 'lucide-react';
import { toast } from 'sonner';
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
  const [currentGame, setCurrentGame] = useState<GameStat>({
    golos: 0,
    cartoesAmarelos: 0,
    cartoesVermelhos: 0,
    doisMinutos: 0,
  });

  const [stats, setStats] = useState<AthleteStats>({
    golos: 0,
    cartoesAmarelos: 0,
    cartoesVermelhos: 0,
    doisMinutos: 0,
    jogos: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      // ✅ USAR API CENTRALIZADA (gere token e URL automaticamente)
      const res = await athleteStatsAPI.getMyStats();

      if (res.success && res.data && res.data.length > 0) {
        const myStats = res.data[0];
        console.log('📊 Stats carregadas com sucesso');

        setStats({
          golos: myStats.golos_marcados || 0,
          cartoesAmarelos: myStats.cartoes_amarelos || 0,
          cartoesVermelhos: myStats.cartoes_vermelhos || 0,
          doisMinutos: myStats.dois_minutos || 0,
          jogos: myStats.jogos || 0,
        });
      } else {
        console.log('🆕 Atleta novo ou sem dados');
        setStats({ golos: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, doisMinutos: 0, jogos: 0 });
      }
    } catch (error: any) {
      console.error('❌ Erro loadStats:', error);
    }
  }

  const onChange = (field: keyof GameStat, e: ChangeEvent<HTMLInputElement>) => {
    setCurrentGame(prev => ({
      ...prev,
      [field]: parseInt(e.target.value) || 0
    }));
  };

  async function addGame() {
    try {
      console.log('📤 Payload enviado:', currentGame);

      // ✅ USAR API CENTRALIZADA
      const res = await athleteStatsAPI.addGame(currentGame);

      if (res.success) {
        toast.success("Jogo registado!", {
          description: "As tuas estatísticas foram atualizadas.",
        });

        await loadStats();

        setCurrentGame({
          golos: 0,
          cartoesAmarelos: 0,
          cartoesVermelhos: 0,
          doisMinutos: 0,
        });
      } else {
        throw new Error(res.message || 'Erro ao guardar');
      }

    } catch (error: any) {
      console.error('❌ Erro addGame:', error);
      toast.error(error.message || "Erro ao adicionar jogo");
    }
  }

  const mediaGolos = stats.jogos > 0 ? (stats.golos / stats.jogos).toFixed(2) : '0.00';

  // ✅ DEBUG DO RENDER
  console.log('🎨 Renderizando com stats:', stats);
  console.log('🎨 Média golos calculada:', mediaGolos);

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Registo de Jogos</h2>
        <p className="text-gray-500">Preenche os golos, cartões e 2 minutos de cada jogo.</p>
      </div>

      <Card className="p-4 rounded-xl shadow-md border border-gray-100">
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Golos</label>
              <Input type="number" value={currentGame.golos} onChange={e => onChange('golos', e)} min={0} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Amarelos</label>
              <Input type="number" value={currentGame.cartoesAmarelos} onChange={e => onChange('cartoesAmarelos', e)} min={0} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Vermelhos</label>
              <Input type="number" value={currentGame.cartoesVermelhos} onChange={e => onChange('cartoesVermelhos', e)} min={0} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">2 Minutos</label>
              <Input type="number" value={currentGame.doisMinutos} onChange={e => onChange('doisMinutos', e)} min={0} />
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={addGame} className="btn-donate">
              Registar Jogo
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 rounded-xl shadow-md text-center bg-blue-50">
          <CardContent>
            <Flame className="w-6 h-6 mx-auto text-red-500 mb-2" />
            <div className="text-sm text-gray-600">Jogos</div>
            <div className="text-xl font-bold">{stats.jogos}</div>
          </CardContent>
        </Card>
        <Card className="p-4 rounded-xl shadow-md text-center bg-green-50">
          <CardContent>
            <Zap className="w-6 h-6 mx-auto text-green-600 mb-2" />
            <div className="text-sm text-gray-600">Golos (Total / Média)</div>
            <div className="text-xl font-bold">{stats.golos} ({mediaGolos}/jogo)</div>
          </CardContent>
        </Card>
        <Card className="p-4 rounded-xl shadow-md text-center bg-red-50">
          <CardContent>
            <Trophy className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
            <div className="text-sm text-gray-600">Cartões</div>
            <div className="text-xl font-bold">🟨 {stats.cartoesAmarelos} | 🟥 {stats.cartoesVermelhos}</div>
          </CardContent>
        </Card>
        <Card className="p-4 rounded-xl shadow-md text-center bg-purple-50">
          <CardContent>
            <div className="text-sm text-gray-600">2 Minutos</div>
            <div className="text-xl font-bold">{stats.doisMinutos}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
