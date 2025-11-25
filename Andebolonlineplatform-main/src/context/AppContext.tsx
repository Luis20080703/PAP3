  import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
  import { User, PlayDisplay, TipDisplay, TeamStatsDisplay, AthleteStatsDisplay } from '../types';
  import { authAPI, playsAPI, tipsAPI, teamStatsAPI, athleteStatsAPI, initializeAPI } from '../services/api';

  interface AppContextType {
    // Auth
    user: User | null;
    carregando: boolean;
    
    // Data
    jogadas: PlayDisplay[];
    dicas: TipDisplay[];
    estatisticasEquipas: TeamStatsDisplay[];
    estatisticasAtletas: AthleteStatsDisplay[];
    
    // Loading states
    jogadasCarregando: boolean;
    dicasCarregando: boolean;
    estatisticasCarregando: boolean;
    
    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (userData: Omit<User, 'id'>) => Promise<void>;
    logout: () => Promise<void>;
    
    // Data refresh
    atualizarJogadas: () => Promise<void>;
    atualizarDicas: () => Promise<void>;
    atualizarEstatisticas: () => Promise<void>;
  }

  const AppContext = createContext<AppContextType | undefined>(undefined);

  export function AppProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [carregando, setCarregando] = useState(true);
    
    const [jogadas, setJogadas] = useState<PlayDisplay[]>([]);
    const [dicas, setDicas] = useState<TipDisplay[]>([]);
    const [estatisticasEquipas, setEstatisticasEquipas] = useState<TeamStatsDisplay[]>([]);
    const [estatisticasAtletas, setEstatisticasAtletas] = useState<AthleteStatsDisplay[]>([]);
    
    const [jogadasCarregando, setJogadasCarregando] = useState(false);
    const [dicasCarregando, setDicasCarregando] = useState(false);
    const [estatisticasCarregando, setEstatisticasCarregando] = useState(false);

    // ✅ FUNÇÃO PARA VALIDAR SE O USER EXISTE NA BD
    const validateUser = async (userToValidate: User): Promise<boolean> => {
      try {
        console.log('🔍 Validando utilizador na BD:', userToValidate.email);
        
        const usersResponse = await fetch('http://localhost:8000/api/users');
        if (!usersResponse.ok) {
          console.error('❌ Erro a buscar utilizadores');
          return false;
        }
        
        const usersData = await usersResponse.json();
        const users = usersData.data || usersData;
        
        const userExists = users.some((u: any) => u.id === userToValidate.id && u.email === userToValidate.email);
        console.log('✅ Utilizador válido:', userExists);
        return userExists;
      } catch (error) {
        console.error('❌ Erro a validar utilizador:', error);
        return false;
      }
    };

    // ✅ FUNÇÃO PARA CARREGAR TODOS OS DADOS
    const refreshAllData = async () => {
      try {
        await Promise.all([
          atualizarJogadas(),
          atualizarDicas(),
          atualizarEstatisticas()
        ]);
      } catch (error) {
        console.error('❌ Erro a carregar dados:', error);
      }
    };

    // Initialize data and check for current user
    useEffect(() => {
      const initialize = async () => {
        try {
          await initializeAPI();
          const currentUser = authAPI.getCurrentUser();
          
          if (currentUser) {
            const isValid = await validateUser(currentUser);
            
            if (isValid) {
              console.log('✅ Utilizador válido, a carregar dados...');
              setUser(currentUser);
              await refreshAllData();
            } else {
              console.log('❌ Utilizador inválido ou removido, a fazer logout...');
              await logout();
            }
          }
        } catch (error) {
          console.error('❌ Erro na inicialização:', error);
        } finally {
          setCarregando(false);
        }
      };
      
      initialize();
    }, []);

    const login = async (email: string, password: string) => {
      console.log('🔐 Iniciando login para:', email);
      
      if (!email || !email.includes('@')) {
        throw new Error('Email inválido');
      }
      
      if (!password || password.length < 1) {
        throw new Error('Password é obrigatória');
      }
      
      const loggedUser = await authAPI.login(email, password);
      
      if (!loggedUser || !loggedUser.id) {
        throw new Error('Erro no login - utilizador inválido');
      }
      
      console.log('✅ Login bem-sucedido:', loggedUser.nome);
      setUser(loggedUser);
      await refreshAllData();
    };

    const register = async (userData: Omit<User, 'id'>) => {
      console.log('📝 Iniciando registo para:', userData.email);
      
      if (!userData.nome?.trim() || !userData.email?.trim() || !userData.password || !userData.equipa?.trim()) {
        throw new Error('Por favor, preencha todos os campos');
      }

      const newUser = await authAPI.register(userData);
      
      if (!newUser || !newUser.id) {
        throw new Error('Erro no registo - utilizador não criado');
      }
      
      console.log('✅ Registo bem-sucedido:', newUser.nome);
      setUser(newUser);
      await refreshAllData();
    };

    const logout = async () => {
      console.log('🚪 Fazendo logout...');
      await authAPI.logout();
      setUser(null);
      setJogadas([]);
      setDicas([]);
      setEstatisticasEquipas([]);
      setEstatisticasAtletas([]);
      console.log('✅ Logout completo');
    };

    const atualizarJogadas = async () => {
      setJogadasCarregando(true);
      try {
        console.log('🔄 A carregar jogadas...');
        const data = await playsAPI.getAll();
        setJogadas(data);
        console.log('✅ Jogadas carregadas:', data.length);
      } catch (error) {
        console.error('❌ Erro a carregar jogadas:', error);
        setJogadas([]);
      } finally {
        setJogadasCarregando(false);
      }
    };

    const atualizarDicas = async () => {
      setDicasCarregando(true);
      try {
        console.log('🔄 A carregar dicas...');
        const data = await tipsAPI.getAll();
        setDicas(data);
        console.log('✅ Dicas carregadas:', data.length);
      } catch (error) {
        console.error('❌ Erro a carregar dicas:', error);
        setDicas([]);
      } finally {
        setDicasCarregando(false);
      }
    };

    const atualizarEstatisticas = async () => {
      setEstatisticasCarregando(true);
      try {
        console.log('🔄 A carregar estatísticas...');
        const [equipas, atletas] = await Promise.all([
          teamStatsAPI.getAll(),
          athleteStatsAPI.getAll()
        ]);
        setEstatisticasEquipas(equipas);
        setEstatisticasAtletas(atletas);
        console.log('✅ Estatísticas carregadas - Equipas:', equipas.length, 'Atletas:', atletas.length);
      } catch (error) {
        console.error('❌ Erro a carregar estatísticas:', error);
        setEstatisticasEquipas([]);
        setEstatisticasAtletas([]);
      } finally {
        setEstatisticasCarregando(false);
      }
    };

    return (
      <AppContext.Provider
        value={{
          user,
          carregando,
          jogadas,
          dicas,
          estatisticasEquipas,
          estatisticasAtletas,
          jogadasCarregando,
          dicasCarregando,
          estatisticasCarregando,
          login,
          register,
          logout,
          atualizarJogadas,
          atualizarDicas,
          atualizarEstatisticas
        }}
      >
        {children}
      </AppContext.Provider>
    );
  }

  export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
      throw new Error('useApp must be used within an AppProvider');
    }
    return context;
  }