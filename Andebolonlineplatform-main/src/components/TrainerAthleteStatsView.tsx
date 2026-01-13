import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Eye, ArrowLeft, Flame, Zap, Trophy } from 'lucide-react';
import { athleteStatsAPI } from '../services/api';
import { LoadingWave } from './ui/LoadingWave';

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
        <div className="flex justify-center py-20">
          <LoadingWave />
        </div>
      ) : atletasList.length === 0 ? (
        <Card className="p-6 text-center">
          <CardContent>
            <p className="text-gray-500">Nenhum atleta com estatísticas encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {atletasList.map((atleta: AtletaStats) => (
            <div key={atleta.id} className="play-tip-card">
              <div className="play-tip-content">
                <div className="flex flex-col w-full h-full justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-2xl">{atleta.nome}</h3>
                    <p className="text-blue-100 flex items-center gap-2">
                      {atleta.equipa}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-xl text-sm">
                        <Flame className="w-3.5 h-3.5 text-red-300" />
                        <span>{atleta.golos_marcados} golos</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-xl text-sm">
                        <Zap className="w-3.5 h-3.5 text-green-300" />
                        <span>{atleta.jogos} jogos</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-xl text-sm">
                        <Trophy className="w-3.5 h-3.5 text-yellow-300" />
                        <span>{atleta.media_golos} média</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedAtleta(atleta)}
                    className="w-full bg-transparent border-white/40 text-white hover:bg-white/20 group font-semibold shadow-none mt-2"
                  >
                    <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}