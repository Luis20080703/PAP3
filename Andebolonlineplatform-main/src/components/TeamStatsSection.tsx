import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function TeamStatsSection() {
  const { user, estatisticasEquipas, estatisticasCarregando } = useApp();
  const [selectedDivision, setSelectedDivision] = useState<string>('seniores');

  if (!user) return null;

  const filteredStats = estatisticasEquipas.filter(
    stats => stats.divisao === selectedDivision
  );

  const calculateAverage = (total: number, matches: number) => {
    return (total / matches).toFixed(1);
  };

  const divisionLabels: Record<string, string> = {
    'seniores': 'Seniores',
    'sub-20': 'Sub-20',
    'sub-18': 'Sub-18',
    'sub-16': 'Sub-16',
    'sub-14': 'Sub-14'
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Estatísticas de Equipas</h2>
        <p className="text-gray-600">
          Consulte as estatísticas das equipas por escalão
        </p>
      </div>

      <Tabs value={selectedDivision} onValueChange={setSelectedDivision}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="seniores">Seniores</TabsTrigger>
          <TabsTrigger value="sub-20">Sub-20</TabsTrigger>
          <TabsTrigger value="sub-18">Sub-18</TabsTrigger>
          <TabsTrigger value="sub-16">Sub-16</TabsTrigger>
          <TabsTrigger value="sub-14">Sub-14</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedDivision} className="mt-6">
          {estatisticasCarregando ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardDescription>Equipas Registadas</CardDescription>
                <CardTitle>{filteredStats.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Total de Jogos</CardDescription>
                <CardTitle>
                  {filteredStats.reduce((sum, team) => sum + (team.jogosDisputados || 0), 0)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Golos Marcados (Total)</CardDescription>
                <CardTitle>
                  {filteredStats.reduce((sum, team) => sum + (team.golosMarcados || 0), 0)}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Stats Table */}
          <Card>
            <CardHeader>
              <CardTitle>Classificação - {divisionLabels[selectedDivision]}</CardTitle>
              <CardDescription>
                Estatísticas detalhadas das equipas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredStats.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Posição</TableHead>
                      <TableHead>Equipa</TableHead>
                      <TableHead className="text-center">Jogos</TableHead>
                      <TableHead className="text-center">V</TableHead>
                      <TableHead className="text-center">E</TableHead>
                      <TableHead className="text-center">D</TableHead>
                      <TableHead className="text-center">GM</TableHead>
                      <TableHead className="text-center">GS</TableHead>
                      <TableHead className="text-center">Diff</TableHead>
                      <TableHead className="text-center">Média GM</TableHead>
                      <TableHead className="text-center">Média GS</TableHead>
                      <TableHead className="text-center">Pontos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStats
                      .sort((a, b) => {
                        const pointsA = (a.vitorias || 0) * 2 + (a.empates || 0);
                        const pointsB = (b.vitorias || 0) * 2 + (b.empates || 0);
                        if (pointsB !== pointsA) return pointsB - pointsA;
                        return ((b.golosMarcados || 0) - (b.golosSofridos || 0)) - ((a.golosMarcados || 0) - (a.golosSofridos || 0));
                      })
                      .map((team, index) => {
                        const points = (team.vitorias || 0) * 2 + (team.empates || 0);
                        const goalDiff = (team.golosMarcados || 0) - (team.golosSofridos || 0);
                        const avgScored = calculateAverage(team.golosMarcados || 0, team.jogosDisputados || 1);
                        const avgConceded = calculateAverage(team.golosSofridos || 0, team.jogosDisputados || 1);
                        const isUserTeam = team.nomeEquipa === user.equipa;

                        return (
                          <TableRow key={team.id} className={isUserTeam ? 'bg-blue-50' : ''}>
                            <TableCell>
                              {isUserTeam && (
                                <Badge variant="default" className="mr-1">Sua Equipa</Badge>
                              )}
                              {index + 1}º
                            </TableCell>
                            <TableCell>{team.nomeEquipa}</TableCell>
                            <TableCell className="text-center">{team.jogosDisputados}</TableCell>
                            <TableCell className="text-center">{team.vitorias}</TableCell>
                            <TableCell className="text-center">{team.empates}</TableCell>
                            <TableCell className="text-center">{team.derrotas}</TableCell>
                            <TableCell className="text-center">{team.golosMarcados}</TableCell>
                            <TableCell className="text-center">{team.golosSofridos}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                {goalDiff > 0 ? (
                                  <>
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                    <span className="text-green-600">+{goalDiff}</span>
                                  </>
                                ) : goalDiff < 0 ? (
                                  <>
                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                    <span className="text-red-600">{goalDiff}</span>
                                  </>
                                ) : (
                                  <span>0</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{avgScored}</TableCell>
                            <TableCell className="text-center">{avgConceded}</TableCell>
                            <TableCell className="text-center">{points}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    Ainda não há estatísticas para {divisionLabels[selectedDivision]}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="mb-1"><strong>V</strong> - Vitórias</p>
                  <p className="mb-1"><strong>E</strong> - Empates</p>
                  <p className="mb-1"><strong>D</strong> - Derrotas</p>
                </div>
                <div>
                  <p className="mb-1"><strong>GM</strong> - Golos Marcados</p>
                  <p className="mb-1"><strong>GS</strong> - Golos Sofridos</p>
                  <p className="mb-1"><strong>Diff</strong> - Diferença de Golos</p>
                </div>
              </div>
            </CardContent>
          </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
