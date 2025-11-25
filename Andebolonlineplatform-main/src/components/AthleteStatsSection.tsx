import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Award, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function AthleteStatsSection() {
  const { user, athleteStats, statsLoading } = useApp();
  const [selectedDivision, setSelectedDivision] = useState<string>('seniores');
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('all');

  if (!user) return null;

  const isCoach = user.type === 'coach';

  const filteredStats = useMemo(() => {
    let stats = athleteStats;

    // Atletas só veem as suas próprias estatísticas
    if (!isCoach) {
      stats = athleteStats.filter(athlete => athlete.name === user.name);
    }

    return stats.filter(athlete => {
      // Atletas veem todos os seus escalões, treinadores filtram por escalão selecionado
      const matchesDivision = isCoach ? athlete.division === selectedDivision : true;
      const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           athlete.team.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = positionFilter === 'all' || athlete.position === positionFilter;
      
      return matchesDivision && matchesSearch && matchesPosition;
    });
  }, [athleteStats, selectedDivision, searchTerm, positionFilter, isCoach, user.name]);

  const calculateAverage = (total: number, matches: number) => {
    return (total / matches).toFixed(2);
  };

  const divisionLabels: Record<string, string> = {
    'seniores': 'Seniores',
    'sub-20': 'Sub-20',
    'sub-18': 'Sub-18',
    'sub-16': 'Sub-16',
    'sub-14': 'Sub-14'
  };

  const positionLabels: Record<string, string> = {
    'all': 'Todas',
    'pivot': 'Pivot',
    'ponta': 'Ponta',
    'lateral': 'Lateral',
    'central': 'Central',
    'guarda-redes': 'Guarda-Redes'
  };

  const topScorer = filteredStats.reduce((top, athlete) => 
    athlete.goalsScored > (top?.goalsScored || 0) ? athlete : top
  , filteredStats[0]);

  const topAssister = filteredStats.reduce((top, athlete) => 
    athlete.assists > (top?.assists || 0) ? athlete : top
  , filteredStats[0]);

  return (
    <div className="space-y-6">
      <div>
        <h2>{isCoach ? 'Estatísticas de Atletas' : 'Minhas Estatísticas'}</h2>
        <p className="text-gray-600">
          {isCoach 
            ? 'Consulte as estatísticas individuais de todos os atletas'
            : 'Consulte as suas estatísticas individuais'
          }
        </p>
      </div>

      {isCoach ? (
        <Tabs value={selectedDivision} onValueChange={setSelectedDivision}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="seniores">Seniores</TabsTrigger>
            <TabsTrigger value="sub-20">Sub-20</TabsTrigger>
            <TabsTrigger value="sub-18">Sub-18</TabsTrigger>
            <TabsTrigger value="sub-16">Sub-16</TabsTrigger>
            <TabsTrigger value="sub-14">Sub-14</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedDivision} className="mt-6">
          {statsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {/* Top Performers - Only for Coaches */}
              {isCoach && topScorer && topAssister && filteredStats.length > 1 && (
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <CardDescription>Melhor Marcador</CardDescription>
                  </div>
                  <CardTitle>{topScorer.name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge>{topScorer.team}</Badge>
                    <Badge variant="outline">{positionLabels[topScorer.position]}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-yellow-600">
                    {topScorer.goalsScored} golos
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Média: {calculateAverage(topScorer.goalsScored, topScorer.matchesPlayed)} por jogo
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <CardDescription>Melhor Assistente</CardDescription>
                  </div>
                  <CardTitle>{topAssister.name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge>{topAssister.team}</Badge>
                    <Badge variant="outline">{positionLabels[topAssister.position]}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-blue-600">
                    {topAssister.assists} assistências
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Média: {calculateAverage(topAssister.assists, topAssister.matchesPlayed)} por jogo
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters - Only for Coaches */}
          {isCoach && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Procurar Atleta ou Equipa</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Nome do atleta ou equipa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Filtrar por Posição</label>
                  <Select value={positionFilter} onValueChange={setPositionFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Posições</SelectItem>
                      <SelectItem value="pivot">Pivot</SelectItem>
                      <SelectItem value="ponta">Ponta</SelectItem>
                      <SelectItem value="lateral">Lateral</SelectItem>
                      <SelectItem value="central">Central</SelectItem>
                      <SelectItem value="guarda-redes">Guarda-Redes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Stats Table */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas - {divisionLabels[selectedDivision]}</CardTitle>
              <CardDescription>
                {filteredStats.length} atletas encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredStats.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Atleta</TableHead>
                      <TableHead>Equipa</TableHead>
                      <TableHead>Posição</TableHead>
                      <TableHead className="text-center">Jogos</TableHead>
                      <TableHead className="text-center">Golos</TableHead>
                      <TableHead className="text-center">Média Golos</TableHead>
                      <TableHead className="text-center">Assistências</TableHead>
                      <TableHead className="text-center">Média Assist.</TableHead>
                      <TableHead className="text-center">🟨</TableHead>
                      <TableHead className="text-center">🟥</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStats
                      .sort((a, b) => b.goalsScored - a.goalsScored)
                      .map((athlete) => {
                        const avgGoals = calculateAverage(athlete.goalsScored, athlete.matchesPlayed);
                        const avgAssists = calculateAverage(athlete.assists, athlete.matchesPlayed);
                        const isCurrentUser = athlete.name === user.name;

                        return (
                          <TableRow key={athlete.id} className={isCurrentUser && isCoach ? 'bg-blue-50' : ''}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {athlete.name}
                                {isCurrentUser && isCoach && (
                                  <Badge variant="default" className="ml-1">Você</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{athlete.team}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {positionLabels[athlete.position]}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">{athlete.matchesPlayed}</TableCell>
                            <TableCell className="text-center">{athlete.goalsScored}</TableCell>
                            <TableCell className="text-center">{avgGoals}</TableCell>
                            <TableCell className="text-center">{athlete.assists}</TableCell>
                            <TableCell className="text-center">{avgAssists}</TableCell>
                            <TableCell className="text-center">{athlete.yellowCards}</TableCell>
                            <TableCell className="text-center">{athlete.redCards}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {isCoach 
                      ? 'Nenhum atleta encontrado com os filtros selecionados'
                      : 'Ainda não há estatísticas disponíveis para si neste escalão'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="text-sm">
                <p className="mb-1"><strong>🟨</strong> - Cartões Amarelos</p>
                <p><strong>🟥</strong> - Cartões Vermelhos</p>
              </div>
            </CardContent>
          </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
      ) : (
        // Athlete view - No division tabs
        <div className="mt-6">
          {statsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {/* Stats Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Suas Estatísticas</CardTitle>
                  <CardDescription>
                    {filteredStats.length > 0 
                      ? `${filteredStats[0]?.team} - ${positionLabels[filteredStats[0]?.position]}`
                      : 'Nenhuma estatística disponível'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredStats.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Escalão</TableHead>
                          <TableHead className="text-center">Jogos</TableHead>
                          <TableHead className="text-center">Golos</TableHead>
                          <TableHead className="text-center">Média Golos</TableHead>
                          <TableHead className="text-center">Assistências</TableHead>
                          <TableHead className="text-center">Média Assist.</TableHead>
                          <TableHead className="text-center">🟨</TableHead>
                          <TableHead className="text-center">🟥</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStats.map((athlete) => {
                          const avgGoals = calculateAverage(athlete.goalsScored, athlete.matchesPlayed);
                          const avgAssists = calculateAverage(athlete.assists, athlete.matchesPlayed);

                          return (
                            <TableRow key={athlete.id}>
                              <TableCell>
                                <Badge variant="outline">
                                  {divisionLabels[athlete.division]}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">{athlete.matchesPlayed}</TableCell>
                              <TableCell className="text-center">{athlete.goalsScored}</TableCell>
                              <TableCell className="text-center">{avgGoals}</TableCell>
                              <TableCell className="text-center">{athlete.assists}</TableCell>
                              <TableCell className="text-center">{avgAssists}</TableCell>
                              <TableCell className="text-center">{athlete.yellowCards}</TableCell>
                              <TableCell className="text-center">{athlete.redCards}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        Ainda não há estatísticas disponíveis
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Legend */}
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="text-sm">
                    <p className="mb-1"><strong>🟨</strong> - Cartões Amarelos</p>
                    <p><strong>🟥</strong> - Cartões Vermelhos</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}
