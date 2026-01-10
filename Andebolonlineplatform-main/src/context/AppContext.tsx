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
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<User | null>;
  register: (userData: Omit<User, 'id'>) => Promise<void>;
  logout: () => Promise<void>;

  // Data refresh
  atualizarJogadas: () => Promise<void>;
  atualizarDicas: () => Promise<void>;
  atualizarEstatisticas: () => Promise<void>;
  updateUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Alias for setUser to match interface if we want explicit name, 
  // or just use setUser in the value.
  const updateUser = setUser;

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
      console.log('🔍 Validando utilizador na BD via token:', userToValidate.email);

      const response = await authAPI.getProfile();

      if (response.success && response.user) {
        return response.user.email === userToValidate.email;
      }

      return false;
    } catch (error) {
      console.error('❌ Erro na validação do token:', error);
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

  // ✅ Persistir user no localStorage quando mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem('current_user', JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<User | null> => {
    console.log('🔐 Iniciando login para:', email);

    if (!email || !email.includes('@')) {
      console.error('❌ Email inválido:', email);
      throw new Error('Email inválido');
    }

    if (!password || password.length < 1) {
      console.error('❌ Password vazia');
      throw new Error('Password é obrigatória');
    }

    try {
      console.log('⏳ A tentar autenticar...');
      const loggedUser = await authAPI.login(email, password);

      if (!loggedUser || !loggedUser.id) {
        console.error('❌ Utilizador retornado inválido:', loggedUser);
        throw new Error('Erro no login - utilizador inválido');
      }

      console.log('✅ Login bem-sucedido:', loggedUser.nome);
      console.log('🔍 Detalhes do utilizador:', loggedUser);

      // Atualiza o estado do user
      setUser(loggedUser);
      console.log('📦 Estado do user atualizado com sucesso');

      // Carrega todos os dados necessários
      console.log('🔄 A carregar todas as informações (jogadas, dicas, estatísticas)...');
      await refreshAllData();
      console.log('✅ Dados carregados com sucesso');

      return loggedUser; // Retorna o user para verificação imediata

    } catch (error) {
      console.error('❌ Erro durante login:', error);
      throw error; // mantém o erro para ser capturado na UI
    }
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
      console.log("🔄 A carregar estatísticas de equipas...");

      // Vai buscar estatísticas das equipas à API
      const equipas = await teamStatsAPI.getAll();

      // Converte os dados da API para o formato que o JSX usa
      const equipasDisplay = equipas.map((t: any) => ({
        id: t.id,
        nomeEquipa: t.equipa?.nome || "Sem nome",
        divisao: t.escalao || "seniores",
        golosMarcados: t.golos_marcados || 0,
        golosSofridos: t.golos_sofridos || 0,
        jogosDisputados:
          (t.vitorias || 0) + (t.empates || 0) + (t.derrotas || 0),

        vitorias: t.vitorias || 0,
        empates: t.empates || 0,
        derrotas: t.derrotas || 0
      }));

      // Atualiza estado global
      setEstatisticasEquipas(equipasDisplay);

      console.log("✅ Estatísticas carregadas:", equipasDisplay);

    } catch (error) {
      console.error("❌ Erro a carregar estatísticas:", error);
      setEstatisticasEquipas([]);
    } finally {
      setEstatisticasCarregando(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser, // ✅ Expose setUser
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
        atualizarEstatisticas,
        updateUser
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