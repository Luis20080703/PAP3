import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Eye, ArrowLeft, Flame, Zap, Trophy } from 'lucide-react';
import { athleteStatsAPI } from '../services/api';

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

  useEffect(() => {
    loadAtletasList();
  }, []);

  async function loadAtletasList() {
    try {
      const headers: Record<string, string> = { 'Accept': 'application/json' };
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

  if (selectedAtleta) {
    return (
      <div className="p-4 max-w-xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => setSelectedAtleta(null)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{selectedAtleta.nome}</h2>
            <p className="text-gray-500">{selectedAtleta.equipa}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 rounded-xl shadow-md text-center bg-blue-50">
            <CardContent>
              <Flame className="w-6 h-6 mx-auto text-red-500 mb-2" />
              <div className="text-sm text-gray-600">Jogos</div>
              <div className="text-xl font-bold">{selectedAtleta.jogos}</div>
            </CardContent>
          </Card>
          <Card className="p-4 rounded-xl shadow-md text-center bg-green-50">
            <CardContent>
              <Zap className="w-6 h-6 mx-auto text-green-600 mb-2" />
              <div className="text-sm text-gray-600">Golos (Total / Média)</div>
              <div className="text-xl font-bold">{selectedAtleta.golos_marcados} ({selectedAtleta.media_golos}/jogo)</div>
            </CardContent>
          </Card>
          <Card className="p-4 rounded-xl shadow-md text-center bg-red-50">
            <CardContent>
              <Trophy className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
              <div className="text-sm text-gray-600">Cartões</div>
              <div className="text-xl font-bold">🟨 {selectedAtleta.cartoes_amarelos} | 🟥 {selectedAtleta.cartoes_vermelhos}</div>
            </CardContent>
          </Card>
          <Card className="p-4 rounded-xl shadow-md text-center bg-purple-50">
            <CardContent>
              <div className="text-sm text-gray-600">2 Minutos</div>
              <div className="text-xl font-bold">{selectedAtleta.dois_minutos}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Estatísticas dos Atletas</h2>
        <p className="text-gray-500">Lista de atletas com estatísticas registadas</p>
      </div>

      {loading ? (
        <Card className="p-6 text-center">
          <CardContent>
            <p className="text-gray-500">Carregando...</p>
          </CardContent>
        </Card>
      ) : atletasList.length === 0 ? (
        <Card className="p-6 text-center">
          <CardContent>
            <p className="text-gray-500">Nenhum atleta com estatísticas encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {atletasList.map((atleta) => (
            <Card key={atleta.id} className="p-4 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{atleta.nome}</h3>
                    <p className="text-gray-600">{atleta.equipa}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>⚽ {atleta.golos_marcados} golos</span>
                      <span>🎮 {atleta.jogos} jogos</span>
                      <span>📊 {atleta.media_golos} média</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedAtleta(atleta)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}