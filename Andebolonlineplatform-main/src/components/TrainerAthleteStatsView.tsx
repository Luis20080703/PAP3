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

  const [searchQuery, setSearchQuery] = useState('');

  // Filter athletes based on search query
  const filteredAtletas = atletasList.filter(atleta =>
    atleta.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    atleta.equipa.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Estatísticas dos Atletas</h2>
        <p className="text-gray-500">
          Lista de atletas com estatísticas registadas
        </p>
      </div>

      {/* Search Bar - Custom Twitter Style */}
      <form className="twitter-search-form" onSubmit={(e) => e.preventDefault()}>
        <label className="twitter-search-label" htmlFor="search">
          <input
            className="twitter-search-input"
            type="text"
            required
            placeholder="Pesquisar atleta..."
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="twitter-search-fancy-bg"></div>
          <div className="twitter-search-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-3.365-7.5-7.5-7.5z"></path>
              </g>
            </svg>
          </div>
          <button
            className="twitter-search-close-btn"
            type="button"
            onClick={() => setSearchQuery('')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </label>
      </form>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingWave />
        </div>
      ) : filteredAtletas.length === 0 ? (
        <div className="text-center py-12">
          {searchQuery ? (
            <>
              <h3 className="text-gray-500 mb-2">Nenhum atleta encontrado</h3>
              <p className="text-gray-400">Tente pesquisar por outro nome</p>
            </>
          ) : (
            <h3 className="text-gray-500">Ainda não há estatísticas registadas</h3>
          )}
        </div>
      ) : (
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            columnGap: '2.5rem',
            rowGap: '3.5rem',
            justifyItems: 'start'
          }}
        >
          {filteredAtletas.map((atleta: AtletaStats) => (
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

                  <button
                    className="btn-details w-full mt-2"
                    onClick={() => setSelectedAtleta(atleta)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    VER DETALHES
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}