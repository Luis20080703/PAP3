import { useState } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent } from './ui/tabs';
import { PlaysSection } from './PlaysSection';
import { TipsSection } from './TipsSection';
import { TeamStatsSection } from './TeamStatsSection';
import { AthleteStatsSection } from './AthleteStatsSection';
import { TrainerAthleteStatsView } from './TrainerAthleteStatsView';
import { PendingAthletesView } from './PendingAthletesView';
import { GamesSection } from './GamesSection';
import { TeamManagementSection } from './TeamManagementSection';
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
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/95 backdrop-blur px-4 md:px-8 shadow-sm">
            <SidebarTrigger className="h-10 w-10 md:h-8 md:w-8" />

            <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block truncate">Modo Administrador</span>
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="NexusHand Logo" className="w-8 h-8 md:w-12 md:h-12 object-contain flex-shrink-0" />
                <h1 className="text-sm md:text-xl font-black tracking-tight text-blue-600 animate-text-shine">
                  NexusHand
                </h1>
              </div>
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
      <header className="relative bg-blue-900 text-white py-12 md:py-72 px-4 md:px-8 shadow-lg transition-all duration-500">
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 z-0 overflow-hidden rounded-b-3xl opacity-50 mix-blend-overlay"
          style={{
            backgroundImage: 'url(/hero-handball-2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-blue-900/90" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[1920px] mx-auto flex flex-row justify-between items-center gap-2 md:gap-8 mb-28 md:mb-20">
          <div>
            <h1 className="flex items-center gap-2 md:gap-6 text-xl md:text-6xl font-black tracking-tighter">
              <img src="/logo.png" alt="NexusHand Logo" className="w-12 h-12 md:w-40 md:h-40 object-contain brightness-0 invert drop-shadow-2xl" />
              <span className="animate-text-shine drop-shadow-xl bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent bg-[length:200%_auto]">NexusHand</span>
            </h1>
          </div>
          <div className="flex flex-row items-center gap-3 md:gap-6">
            {user.tipo === 'treinador' && onNavigateToPremium && (
              <Button
                onClick={onNavigateToPremium}
                className={`${user.is_premium ? 'premium-button' : 'premium-button hover:scale-105 transition-all'} hidden md:flex text-white font-bold border-none shadow-xl text-lg px-8 py-6 rounded-2xl`}
              >
                {user.is_premium ? '🌟 Área Premium' : '👑 Aderir ao Premium'}
              </Button>
            )}
            <div className="text-right space-y-0.5 md:space-y-1">
              <div className="font-bold text-xs md:text-xl drop-shadow-lg text-blue-600">{user.nome}</div>
              <div className="text-xs md:text-xl text-blue-600 uppercase font-bold tracking-widest drop-shadow-md bg-blue-900/40 px-2 md:px-4 py-0.5 md:py-1 rounded-full backdrop-blur-sm border border-blue-500/30">
                {user.tipo === 'atleta' ? 'Atleta' : 'Treinador'} • {user.equipa || 'Sem Equipa'}
              </div>
            </div>
            <button className="Btn scale-75 md:scale-110" onClick={onLogout}>
              <div className="sign">
                <svg viewBox="0 0 512 512">
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                </svg>
              </div>
              <div className="text">Sair</div>
            </button>
          </div>
        </div>

        {/* Dock Menu Positioned Inside Header */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto pb-0">
          <DockMenu
            activeTab={activeTab}
            onTabChange={setActiveTab}
            userType={user.tipo}
          />
        </div>
      </header>

      {/* Main Content for regular users */}
      <main className="w-full max-w-[1920px] mx-auto py-8 px-4 md:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* DockMenu moved to header */}

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
            <>
              <TabsContent value="team" className="animate-in fade-in duration-500">
                <TeamManagementSection />
              </TabsContent>
              <TabsContent value="games" className="animate-in fade-in duration-500">
                <GamesSection />
              </TabsContent>
              <TabsContent value="pending" className="animate-in fade-in duration-500">
                <PendingAthletesView />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
}
