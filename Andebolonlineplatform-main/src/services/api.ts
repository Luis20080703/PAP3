import { 
  PlayDisplay, 
  TipDisplay, 
  TeamStatsDisplay, 
  AthleteStatsDisplay, 
  CommentDisplay, 
  User,
  UserType
} from '../types';

// ✅ FUNÇÃO ATUALIZADA PARA CONVERTER TIPOS
const mapUserType = (laravelType: string): 'atleta' | 'treinador' => {
  return laravelType === 'atleta' ? 'atleta' : 'treinador';
};

const API_BASE_URL = 'http://localhost:8000/api';

// Generic API function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  console.log(`🔄 Fazendo request para: ${API_BASE_URL}${endpoint}`);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API Error: ${response.status}`, errorText);
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  async login(email: string, password: string): Promise<User> {
    console.log('🔐 INICIANDO LOGIN - Email:', email, 'Password:', password ? '***' : 'VAZIA');
    
    try {
      console.log('📤 A tentar login via API Laravel...');
      const response = await apiCall('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success && response.user) {
        console.log('✅ LOGIN APROVADO via API');
        localStorage.setItem('current_user', JSON.stringify(response.user));
        return response.user;
      } else {
        console.log('❌ LOGIN REJEITADO pela API:', response.message);
        throw new Error(response.message || 'Login falhou');
      }
    } catch (apiError: any) {
      console.error('❌ ERRO NO LOGIN VIA API:', apiError);
      throw new Error('Falha na autenticação. Tente novamente.');
    }
  },

  async register(userData: any): Promise<User> {
    console.log('🎯 [REGISTER API] Dados recebidos:', userData);

    const { nome, email, password, tipo, equipa, posicao, numero } = userData;

    const registerData: any = {
      nome: nome,
      email: email,
      password: password,
      tipo: tipo,
      equipa: equipa
    };

    if (posicao !== undefined) {
      registerData.posicao = posicao;
    }
    if (numero !== undefined) {
      registerData.numero = numero;
    }

    console.log('📤 [REGISTER API] Dados COMPLETOS a enviar para Laravel:', registerData);

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });

      const result = await response.json();
      console.log('📥 [REGISTER API] Resposta do Laravel:', result);

      if (result.success && result.user) {
        console.log('✅ REGISTRO BEM-SUCEDIDO!');
        localStorage.setItem('current_user', JSON.stringify(result.user));
        return result.user;
      } else {
        throw new Error(result.message || 'Erro no registro');
      }

    } catch (error: any) {
      console.error('❌ ERRO NO REGISTER API:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem('current_user');
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }
};

// Plays API
export const playsAPI = {
  async getAll(): Promise<PlayDisplay[]> {
    try {
      console.log('🔄 [PLAYS API] Buscando jogadas...');
      const response = await apiCall('/jogadas');
      console.log('📥 [PLAYS API] Resposta recebida:', response);

      const [usersResponse, equipasResponse, comentariosResponse] = await Promise.all([
        apiCall('/users').catch(() => ({ data: [] })),
        apiCall('/equipas').catch(() => ({ data: [] })),
        apiCall('/comentarios').catch(() => ({ data: [] }))
      ]);

      const users = usersResponse.data || [];
      const equipas = equipasResponse.data || [];
      const todosComentarios = comentariosResponse.data || [];

      console.log('👥 [PLAYS API] Users disponíveis:', users.length);
      console.log('🏆 [PLAYS API] Equipas disponíveis:', equipas.length);
      console.log('💬 [PLAYS API] Comentários disponíveis:', todosComentarios.length);

      const plays = response.data.map((play: any) => {
        const comentariosDaJogada = todosComentarios.filter((comentario: any) => 
          comentario.jogada_id === play.id
        );

        const autor = users.find((u: any) => u.id === play.user_id);
        const equipa = equipas.find((e: any) => e.id === play.equipa_id);

        return {
          id: play.id.toString(),
          titulo: play.titulo || 'Sem título',
          descricao: play.descricao || 'Sem descrição',
          urlVideo: play.video_url || play.ficheiro,
          autorId: play.user_id?.toString() || '1',
          autorNome: autor?.nome || 'Utilizador Desconhecido',
          autorTipo: mapUserType(autor?.tipo) || 'atleta',
          equipa: equipa?.nome || 'Equipa Desconhecida',
          categoria: this.determinarCategoria(play.descricao),
          criadoEm: new Date(play.created_at || play.updated_at),
          comentarios: comentariosDaJogada.map((comentario: any) => ({
            id: comentario.id.toString(),
            jogadaId: comentario.jogada_id.toString(),
            autorId: comentario.user_id.toString(),
            autorNome: comentario.user?.nome || 'Utilizador',
            autorTipo: mapUserType(comentario.user?.tipo) || 'atleta',
            conteudo: comentario.texto,
            criadoEm: new Date(comentario.data || comentario.created_at)
          }))
        };
      });

      console.log('✅ [PLAYS API] Jogadas processadas:', plays.length);
      return plays;

    } catch (error) {
      console.error('❌ [PLAYS API] Erro a buscar jogadas:', error);
      return [];
    }
  },

  determinarCategoria(descricao: string): string {
    if (!descricao) return 'Geral';
    
    const desc = descricao.toLowerCase();
    
    if (desc.includes('ataque') || desc.includes('ofensiv')) return 'Jogada Ofensiva';
    if (desc.includes('defesa') || desc.includes('defensiv')) return 'Jogada Defensiva';
    if (desc.includes('transiç') || desc.includes('contra-ataque')) return 'Transição';
    if (desc.includes('bola parada') || desc.includes('livre')) return 'Bola Parada';
    
    return 'Geral';
  },

  async getById(id: string): Promise<PlayDisplay | null> {  
    try {
      const response = await apiCall(`/jogadas/${id}`);
      const play = response.data;

      const [usersResponse, equipasResponse] = await Promise.all([
        apiCall('/users').catch(() => ({ data: [] })),
        apiCall('/equipas').catch(() => ({ data: [] }))
      ]);

      const users = usersResponse.data || [];
      const equipas = equipasResponse.data || [];

      const autor = users.find((u: any) => u.id === play.user_id);
      const equipa = equipas.find((e: any) => e.id === play.equipa_id);

      return {
        id: play.id.toString(),
        titulo: play.titulo,
        descricao: play.descricao,
        urlVideo: play.video_url,
        autorId: play.user_id?.toString() || '1',
        autorNome: autor?.nome || 'Utilizador Desconhecido',
        autorTipo: mapUserType(autor?.tipo) || 'atleta',
        equipa: equipa?.nome || 'Equipa Desconhecida',
        categoria: this.determinarCategoria(play.descricao),
        criadoEm: new Date(play.created_at || play.updated_at),
        comentarios: []
      };
    } catch {
      return null;
    }
  },

  async create(playData: Omit<PlayDisplay, 'id' | 'criadoEm' | 'comentarios'>): Promise<PlayDisplay> {
    console.log('🎯 [CREATE PLAY] Iniciando criação...');

    const currentUser = authAPI.getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilizador não autenticado');
    }

    const equipasResponse = await apiCall('/equipas');
    const equipas = equipasResponse.data || [];
    
    const equipa = equipas.find((e: any) => 
      e.nome?.toLowerCase() === playData.equipa?.toLowerCase()
    );

    const equipaId = equipa?.id || 1;

    console.log('🔍 [CREATE PLAY] Dados encontrados:', {
      user: currentUser.nome,
      equipaProcurada: playData.equipa,
      equipaEncontrada: equipa?.nome,
      equipaId: equipaId
    });

    const newPlayData = {
      user_id: currentUser.id,
      equipa_id: equipaId,
      titulo: playData.titulo,
      descricao: playData.descricao,
      ficheiro: playData.urlVideo || 'default.mp4',
      data_upload: new Date().toISOString()
    };

    console.log('📤 [CREATE PLAY] Enviando dados:', newPlayData);

    const response = await apiCall('/jogadas', {
      method: 'POST',
      body: JSON.stringify(newPlayData),
    });

    console.log('✅ [CREATE PLAY] Jogada criada:', response.data);

    return {
      ...playData,
      id: response.data.id.toString(),
      criadoEm: new Date(),
      comentarios: []
    };
  },

  async addComment(jogadaId: string, comentario: Omit<CommentDisplay, 'id' | 'criadoEm'>): Promise<CommentDisplay> {
    console.log('💬 [ADD COMMENT] Adicionando comentário à jogada:', jogadaId);
    
    const currentUser = authAPI.getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilizador não autenticado');
    }

    try {
      const response = await apiCall('/comentarios-jogadas', {
        method: 'POST',
        body: JSON.stringify({
          user_id: currentUser.id,
          jogada_id: parseInt(jogadaId),
          texto: comentario.conteudo
        }),
      });

      console.log('✅ [ADD COMMENT] Comentário criado na BD:', response.data);

      return {
        id: response.data.id.toString(),
        jogadaId: jogadaId,
        autorId: response.data.user_id.toString(),
        autorNome: response.data.user?.nome || currentUser.nome,
        autorTipo: mapUserType(response.data.user?.tipo) || currentUser.tipo,
        conteudo: response.data.texto,
        criadoEm: new Date(response.data.created_at)
      };

    } catch (error) {
      console.error('❌ [ADD COMMENT] Erro ao criar comentário:', error);
      throw error;
    }
  },

  // ✅ MÉTODO DELETE ADICIONADO
  async delete(playId: string): Promise<void> {
  console.log('🗑️ [DELETE PLAY] A apagar jogada:', playId);
  
  const currentUser = authAPI.getCurrentUser();
  
  try {
    const response = await apiCall(`/jogadas/${playId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${currentUser?.id}` // ← Enviar user ID como token simples
      }
    });

    console.log('✅ [DELETE PLAY] Jogada apagada com sucesso');
  } catch (error: any) {
    console.error('❌ [DELETE PLAY] Erro ao apagar jogada:', error);
    throw error;
  }
}
};

// Tips API
export const tipsAPI = {
  async getAll(): Promise<TipDisplay[]> {
  console.log('🔄 [TIPS API DEBUG] Buscando dicas...');
  const response = await apiCall('/dicas');
  
  // ✅ BUSCAR USERS PARA TER DADOS REAIS
  const usersResponse = await apiCall('/users').catch(() => ({ data: [] }));
  const users = usersResponse.data || [];

  const dicasProcessadas = response.data.map((dica: any) => {
    // ✅ ENCONTRAR O USER REAL
    const autorReal = users.find((u: any) => u.id === dica.user_id);
    
    // ✅ USAR DADOS REAIS
    const autorNome = autorReal?.nome || dica.user?.nome || 'Utilizador';
    const autorTipo = mapUserType(autorReal?.tipo || dica.user?.tipo) || 'atleta';

    return {
      id: dica.id.toString(),
      titulo: dica.titulo,
      descricao: dica.conteudo.substring(0, 100) + '...',
      categoria: dica.categoria || 'táctica',
      conteudo: dica.conteudo,
      autorId: dica.user_id?.toString() || '1',
      autorNome: autorNome,
      autorTipo: autorTipo,
      criadoEm: new Date(dica.created_at || dica.updated_at)
    };
  });

  return dicasProcessadas;
},

  async getByCategory(categoria: string): Promise<TipDisplay[]> {
    const dicas = await this.getAll();
    return categoria === 'all' ? dicas : dicas.filter((dica: TipDisplay) => dica.categoria === categoria);
  },

  async create(dicaData: Omit<TipDisplay, 'id' | 'criadoEm'>): Promise<TipDisplay> {
  console.log('🎯 [DEBUG API CREATE] INICIANDO CRIAÇÃO DE DICA');
  console.log('📥 Dados recebidos do Frontend:', {
    titulo: dicaData.titulo,
    categoria: dicaData.categoria,
    autorId: dicaData.autorId,
    autorNome: dicaData.autorNome,
    autorTipo: dicaData.autorTipo
  });

  const user_id = dicaData.autorId;

  if (!user_id) {
    console.error('❌ ERRO: Nenhum user ID recebido do frontend!');
    throw new Error('Utilizador não identificado');
  }

  console.log('🎯 User ID a usar:', user_id);

  const newDicaData = {
    user_id: parseInt(user_id.toString()),
    titulo: dicaData.titulo,
    categoria: dicaData.categoria,
    conteudo: dicaData.conteudo,
    ficheiro: null
  };

  console.log('📤 [DEBUG API] Dados FINAIS para Laravel:', newDicaData);

  const response = await apiCall('/dicas', {
    method: 'POST',
    body: JSON.stringify(newDicaData),
  });

  console.log('✅ [DEBUG API] Resposta do Laravel:', response.data);
  
  return {
    ...dicaData,
    id: response.data.id.toString(),
    criadoEm: new Date()
  };
}

};

// Team Stats API
export const teamStatsAPI = {
  async getAll(): Promise<TeamStatsDisplay[]> {
    try {
      const response = await apiCall('/estatisticas-equipas');
      return response.data.map((stat: any) => ({
        id: stat.id.toString(),
        nomeEquipa: stat.equipa?.nome || 'Equipa Desconhecida',
        divisao: 'seniores',
        golosMarcados: stat.golos_marcados || 0,
        golosSofridos: stat.golos_sofridos || 0,
        jogosDisputados: 10,
        vitorias: 7,
        empates: 2,
        derrotas: 1
      }));
    } catch {
      return [];
    }
  },

  async getByDivision(divisao: string): Promise<TeamStatsDisplay[]> {
    const stats = await this.getAll();
    return stats.filter((stat: TeamStatsDisplay) => stat.divisao === divisao);
  }
};

// Athlete Stats API
export const athleteStatsAPI = {
  async getAll(): Promise<AthleteStatsDisplay[]> {
    try {
      const response = await apiCall('/estatisticas-atletas');
      return response.data.map((stat: any) => ({
        id: stat.id.toString(),
        nome: stat.atleta?.user?.nome || 'Atleta Desconhecido',
        equipa: stat.atleta?.equipa?.nome || 'Equipa Desconhecida',
        posicao: 'central',
        divisao: 'seniores',
        golosMarcados: stat.golos_marcados || 0,
        jogosDisputados: 10,
        assistencias: 5,
        cartoesAmarelos: 1,
        cartoesVermelhos: 0
      }));
    } catch {
      return [];
    }
  },

  async getByDivision(divisao: string): Promise<AthleteStatsDisplay[]> {
    const stats = await this.getAll();
    return stats.filter((stat: AthleteStatsDisplay) => stat.divisao === divisao);
  }
};

// Test connection to Laravel API
export const testAPIConnection = async () => {
  try {
    const response = await apiCall('/test');
    console.log('✅ Conexão com API Laravel estabelecida:', response);
    return response;
  } catch (error) {
    console.error('❌ Erro na conexão com API Laravel:', error);
    throw error;
  }
};

// Initialize API connection
export const initializeAPI = async () => {
  return await testAPIConnection();
};