import { useState } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trophy, BookOpen, TrendingUp, Users, LogOut, Upload } from 'lucide-react';
import { PlaysSection } from './PlaysSection';
import { TipsSection } from './TipsSection';
import { TeamStatsSection } from './TeamStatsSection';
import { AthleteStatsSection } from './AthleteStatsSection';
import { useApp } from '../context/AppContext';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('plays');

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              NexusHand
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div>{user.nome}</div>
             <div className="text-sm text-blue-100">
  {user.tipo === 'atleta' ? 'Atleta' : 'Treinador'} • {user.equipa}
</div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="plays" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Jogadas
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Dicas
            </TabsTrigger>
            <TabsTrigger value="team-stats" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Estatísticas de Equipas
            </TabsTrigger>
            <TabsTrigger value="athlete-stats" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Estatísticas de Atletas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plays">
            <PlaysSection />
          </TabsContent>

          <TabsContent value="tips">
            <TipsSection />
          </TabsContent>

          <TabsContent value="team-stats">
            <TeamStatsSection />
          </TabsContent>

          <TabsContent value="athlete-stats">
            <AthleteStatsSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
