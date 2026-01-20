import { useState } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent } from './ui/tabs';
import { BookOpen, TrendingUp, Users } from 'lucide-react';
import { PlaysSection } from './PlaysSection';
import { TipsSection } from './TipsSection';
import { TeamStatsSection } from './TeamStatsSection';
import { AthleteStatsSection } from './AthleteStatsSection';
import { TrainerAthleteStatsView } from './TrainerAthleteStatsView';
import { PendingAthletesView } from './PendingAthletesView';
import { AdminDashboard } from './AdminDashboard';
import { AdminSidebar } from './AdminSidebar';
import { useApp } from '../context/AppContext';
import { SidebarProvider, SidebarInset, SidebarTrigger } from './ui/sidebar';

import { DockMenu } from './DockMenu';

interface DashboardProps {
  onLogout: () => void;
  onNavigateToPremium?: () => void;
}

export function Dashboard({ onLogout, onNavigateToPremium }: DashboardProps) {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('plays');

  // Dashboard only renders if user exists
  if (!user) return null;

  const isAdmin = user && (user.tipo === 'root' || user.tipo === 'admin');

  if (isAdmin) {
    return (
      <SidebarProvider className="bg-gray-50/50">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={onLogout}
        />
        <SidebarInset className="flex-1 overflow-auto bg-transparent">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur px-6 md:px-8 shadow-sm">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase md:block hidden">Modo Administrador</span>
              <h1 className="flex items-center gap-2 text-lg md:text-xl font-bold">
                <img src="/logo.png" alt="NexusHand Logo" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
                <span className="animate-text-shine">NexusHand</span>
              </h1>
            </div>
          </header>

          <main className="p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeTab === 'plays' && <PlaysSection />}
            {activeTab === 'tips' && <TipsSection />}
            {activeTab === 'team-stats' && <TeamStatsSection />}
            {activeTab === 'athlete-stats' && (
              user.tipo === 'atleta' ? <AthleteStatsSection /> : <TrainerAthleteStatsView />
            )}
            {activeTab === 'admin' && <AdminDashboard />}
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header for regular users */}
      <header className="bg-blue-600 text-white py-4 px-4 md:px-8 shadow-lg">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-lg md:text-2xl lg:text-3xl font-bold">
              <img src="/logo.png" alt="NexusHand Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain brightness-0 invert" />
              <span className="animate-text-shine">NexusHand</span>
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {user.tipo === 'treinador' && onNavigateToPremium && (
              <Button
                onClick={onNavigateToPremium}
                className={`${user.is_premium ? 'premium-button' : 'premium-button hover:scale-105 transition-all'} text-white font-bold border-none shadow-lg`}
                size="sm"
              >
                {user.is_premium ? '🌟 Área Premium' : '👑 Aderir ao Premium'}
              </Button>
            )}
            <div className="text-center sm:text-right">
              <div className="font-medium text-lg">{user.nome}</div>
              <div className="text-sm lg:text-base text-blue-100 uppercase font-bold tracking-tighter">
                {user.tipo === 'atleta' ? 'Atleta' : 'Treinador'} • {user.equipa || 'Sem Equipa'}
              </div>
            </div>
            <button className="Btn" onClick={onLogout}>
              <div className="sign">
                <svg viewBox="0 0 512 512">
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                </svg>
              </div>
              <div className="text">Logout</div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content for regular users */}
      <main className="w-full max-w-[1920px] mx-auto py-8 px-4 md:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <DockMenu
            activeTab={activeTab}
            onTabChange={setActiveTab}
            userType={user.tipo}
          />

          <TabsContent value="plays" className="animate-in fade-in duration-500">
            <PlaysSection />
          </TabsContent>

          <TabsContent value="tips" className="animate-in fade-in duration-500">
            <TipsSection />
          </TabsContent>

          <TabsContent value="team-stats" className="animate-in fade-in duration-500">
            <TeamStatsSection />
          </TabsContent>

          <TabsContent value="athlete-stats" className="animate-in fade-in duration-500">
            {user.tipo === 'atleta' ? (
              <AthleteStatsSection />
            ) : (
              <TrainerAthleteStatsView />
            )}
          </TabsContent>

          {user.tipo === 'treinador' && (
            <TabsContent value="pending" className="animate-in fade-in duration-500">
              <PendingAthletesView />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
