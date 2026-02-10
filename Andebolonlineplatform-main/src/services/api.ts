import {
  PlayDisplay,
  TipDisplay,
  TeamStatsDisplay,
  AthleteStatsDisplay,
  CommentDisplay,
  User
} from '../types';

// ✅ FUNÇÃO ATUALIZADA PARA CONVERTER TIPOS
const mapUserType = (laravelType: string): 'atleta' | 'treinador' => {
  return laravelType === 'atleta' ? 'atleta' : 'treinador';
};

// ✅ URL CENTRALIZADA DO SERVIDOR - DINÂMICA
const getAPIBaseURL = () => {
  // ✅ Piority: Environment Variable (for production/ngrok)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window === 'undefined') {
    return 'http://localhost:8000/api';
  }

  // ✅ VERIFICAR SE HÁ UM IP CONFIGURADO MANUALMENTE (para acesso móvel)
  const manualServerIP = localStorage.getItem('server_ip');
  if (manualServerIP) {
    console.log('🌐 Usando IP manual do servidor:', manualServerIP);
    return `http://${manualServerIP}:8000/api`;
  }

  // ✅ DETECÇÃO AUTOMÁTICA
  const hostname = window.location.hostname;

  // Se estiver a usar ngrok, usar caminho relativo (via proxy do Vite)
  if (hostname.includes('ngrok') || hostname.includes('loca.lt')) {
    return '/api';
  }

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }

  return `http://${hostname}:8000/api`;
};

export const API_BASE_URL = getAPIBaseURL();

// Generic API function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  // ✅ Prioritize token from sessionStorage (tab-specific) then fallback to localStorage
  try {
    const sessionToken = sessionStorage.getItem('api_token');
    const localToken = localStorage.getItem('api_token');
    const token = sessionToken || localToken;

    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // Storage may be unavailable in some contexts
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      credentials: 'include',
      ...options,
    });
  } catch (networkError) {
    // Network-level error (server down / connection refused)
    console.error('Network error when calling API:', networkError);
    try {
      // Redirect user to a helpful static page explaining the backend is down
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/server-down.html';
      }
    } catch (e) {
      // ignore redirect errors in non-browser contexts
    }

    // Re-throw so callers can handle if needed (or the redirect will occur)
    throw networkError;
  }

  if (!response.ok) {
    // ✅ CHECK FOR 401 (Unauthenticated) AND FORCE LOGOUT
    if (response.status === 401) {
      console.warn('⚠️ Sessão expirada ou inválida. A terminar sessão...');
      localStorage.removeItem('current_user');
      localStorage.removeItem('api_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/'; // Reload to login page
      }
      // Stop here
      throw new Error('Sessão expirada. Por favor faça login novamente.');
    }

    // ✅ CHECK FOR 403 (Forbidden)
    if (response.status === 403) {
      console.warn('⚠️ Acesso negado (403).');
    }

    let errorMessage = '';

    try {
      const clonedResponse = response.clone();
      const errorJson = await clonedResponse.json();

      if (errorJson.errors) {
        errorMessage = Object.values(errorJson.errors).flat().join(' ');
      } else if (errorJson.error?.message) {
        errorMessage = errorJson.error.message;
      } else if (errorJson.message) {
        errorMessage = errorJson.message;
      }
    } catch (e) {
      errorMessage = await response.text().catch(() => '');
    }

    if (!errorMessage || errorMessage.length < 5) {
      if (response.status === 403) {
        errorMessage = "A sua conta ainda não foi validada. Por favor, aguarde a aprovação do treinador ou administrador.";
      } else {
        errorMessage = `API error: ${response.status} ${response.statusText}`;
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  async login(email: string, password: string, cipa?: string): Promise<User> {
    try {
      const response = await apiCall('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, cipa }),
      });

      if (response.success && response.user) {
        localStorage.setItem('current_user', JSON.stringify(response.user));
        sessionStorage.setItem('current_user', JSON.stringify(response.user));
        if (response.token) {
          localStorage.setItem('api_token', response.token);
          sessionStorage.setItem('api_token', response.token);
        }
        return response.user;
      } else {
        throw new Error(response.message || 'Login falhou');
      }
    } catch (apiError: any) {
      throw apiError; // Throw the actual error
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
    if (userData.escalao !== undefined) {
      registerData.escalao = userData.escalao;
    }
    if (userData.cipa !== undefined) {
      registerData.cipa = userData.cipa; // ✅ Add CIPA to payload
    }

    console.log('📤 [REGISTER API] Dados COMPLETOS a enviar para Laravel:', registerData);

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(registerData)
      });

      const result = await response.json();
      console.log('📥 [REGISTER API] Resposta do Laravel:', result);

      if (result.success && result.user) {
        const userData = result.user;
        console.log('✅ REGISTRO BEM-SUCEDIDO!');
        localStorage.setItem('current_user', JSON.stringify(userData));
        sessionStorage.setItem('current_user', JSON.stringify(userData));

        // ✅ GUARDAR TOKEN PARA AUTO-LOGIN (Ambos os storages)
        if (result.token) {
          localStorage.setItem('api_token', result.token);
          sessionStorage.setItem('api_token', result.token);
          console.log('🔑 Token guardado em local e session storage');
        }

        return userData;
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
    localStorage.removeItem('api_token');
    sessionStorage.removeItem('current_user');
    sessionStorage.removeItem('api_token');
    console.log('🚪 Sessão encerrada em todos os storages');
  },

  getCurrentUser(): User | null {
    const sessionUser = sessionStorage.getItem('current_user');
    const localUser = localStorage.getItem('current_user');
    const user = sessionUser || localUser;
    return user ? JSON.parse(user) : null;
  },

  async getProfile(): Promise<any> {
    return apiCall('/me');
  }
};

// Users API
export const usersAPI = {
  async update(id: string | number, data: any): Promise<any> {
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
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

        // ✅ GERAR URL COMPLETA PARA VÍDEOS
        const videoUrl = play.ficheiro?.startsWith('videos/')
          ? `${API_BASE_URL.replace('/api', '')}/storage/${play.ficheiro}`
          : play.video_url || play.ficheiro;

        // ✅ NORMALIZAR CATEGORIAS
        const rawCategory = play.categoria || this.determinarCategoria(play.descricao);
        let normalizedCategory = rawCategory;

        if (rawCategory === 'Jogada Ofensiva') normalizedCategory = 'Ataque posicional';
        else if (rawCategory === 'Jogada Defensiva') normalizedCategory = 'Defesa';
        else if (rawCategory === 'Bola Parada') normalizedCategory = 'Bola parada';
        else if (rawCategory === 'Geral') normalizedCategory = 'Técnica individual';

        return {
          id: play.id.toString(),
          titulo: play.titulo || 'Sem título',
          descricao: play.descricao || 'Sem descrição',
          urlVideo: videoUrl,
          autorId: play.user_id?.toString() || '1',
          autorNome: autor?.nome || 'Utilizador Desconhecido',
          autorTipo: mapUserType(autor?.tipo) || 'atleta',
          equipa: equipa?.nome || 'Equipa Desconhecida',
          categoria: normalizedCategory,
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
    if (!descricao) return 'Técnica individual';

    const desc = descricao.toLowerCase();

    // ✅ MAPEAMENTO PARA OPÇÕES VÁLIDAS DO SELECT
    if (desc.includes('contra-ataque') || desc.includes('transição rápida')) return 'Contra-ataque';
    if (desc.includes('ataque') || desc.includes('posicional') || desc.includes('ofensiv')) return 'Ataque posicional';
    if (desc.includes('defesa') || desc.includes('defensiv') || desc.includes('bloqueio')) return 'Defesa';
    if (desc.includes('transiç') || desc.includes('recuperação')) return 'Transição';
    if (desc.includes('bola parada') || desc.includes('livre') || desc.includes('7 metros')) return 'Bola parada';
    if (desc.includes('técnica') || desc.includes('finta') || desc.includes('remate')) return 'Técnica individual';

    return 'Técnica individual'; // Fallback padrão seguro
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
        categoria: play.categoria || this.determinarCategoria(play.descricao),
        criadoEm: new Date(play.created_at || play.updated_at),
        comentarios: []
      };
    } catch {
      return null;
    }
  },

  async create(playData: Omit<PlayDisplay, 'id' | 'criadoEm' | 'comentarios'>, videoFile?: File): Promise<PlayDisplay> {
    console.log('🎯 [CREATE PLAY] Iniciando criação...');

    const currentUser = authAPI.getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilizador não autenticado');
    }

    const equipasResponse = await apiCall('/equipas');
    const equipas = equipasResponse.data || [];

    let equipa = equipas.find((e: any) =>
      e.nome?.toLowerCase() === currentUser.equipa?.toLowerCase()
    );

    if (!equipa && playData.equipa) {
      equipa = equipas.find((e: any) =>
        e.nome?.toLowerCase() === playData.equipa?.toLowerCase()
      );
    }

    const equipaId = equipa?.id || equipas[0]?.id || 17;

    // ✅ CRIAR FORMDATA PARA UPLOAD DE FICHEIROS
    const formData = new FormData();
    formData.append('user_id', currentUser.id.toString());
    formData.append('equipa_id', equipaId.toString());
    formData.append('titulo', playData.titulo);
    formData.append('descricao', playData.descricao);
    formData.append('categoria', playData.categoria); // ✅ ENVIAR CATEGORIA

    if (videoFile) {
      formData.append('video', videoFile);
      console.log('📹 [CREATE PLAY] Vídeo anexado:', videoFile.name);
    } else if (playData.urlVideo) {
      formData.append('ficheiro', playData.urlVideo);
    }

    console.log('📤 [CREATE PLAY] Enviando FormData...');

    // ✅ ENVIAR COM FORMDATA (SEM JSON)
    const response = await fetch(`${API_BASE_URL}/jogadas`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('api_token')}`
        // NÃO incluir Content-Type para FormData
      },
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Erro no upload: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ [CREATE PLAY] Jogada criada:', result.data);

    return {
      ...playData,
      id: result.data.id.toString(),
      urlVideo: result.data.ficheiro,
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

  async update(playId: string, playData: Partial<PlayDisplay>, videoFile?: File): Promise<PlayDisplay> {
    console.log('🔄 [UPDATE PLAY] A atualizar jogada:', playId);

    const currentUser = authAPI.getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilizador não autenticado');
    }

    const formData = new FormData();
    formData.append('_method', 'PUT'); // Importante para Laravel aceitar multipart em PUT via POST

    if (playData.titulo) formData.append('titulo', playData.titulo);
    if (playData.descricao) formData.append('descricao', playData.descricao);
    if (playData.categoria) formData.append('categoria', playData.categoria); // ✅ ENVIAR CATEGORIA

    if (videoFile) {
      formData.append('video', videoFile);
      console.log('📹 [UPDATE PLAY] Novo vídeo anexado:', videoFile.name);
    } else if (playData.urlVideo) {
      formData.append('ficheiro', playData.urlVideo);
    }

    console.log('📤 [UPDATE PLAY] Enviando dados...');

    try {
      const response = await fetch(`${API_BASE_URL}/jogadas/${playId}`, {
        method: 'POST', // Usar POST com _method=PUT para suportar ficheiros
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('api_token')}`
        },
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Erro na atualização: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ [UPDATE PLAY] Jogada atualizada:', result.data);

      return {
        ...playData,
        id: playId,
        titulo: playData.titulo || '',
        descricao: playData.descricao || '',
        urlVideo: result.data.ficheiro || playData.urlVideo,
        autorId: result.data.user_id?.toString() || currentUser.id,
        autorNome: currentUser.nome,
        autorTipo: currentUser.tipo as any,
        equipa: currentUser.equipa || '',
        categoria: playData.categoria || this.determinarCategoria(playData.descricao || ''),
        criadoEm: new Date(),
        comentarios: []
      } as PlayDisplay;

    } catch (error: any) {
      console.error('❌ [UPDATE PLAY] Erro ao atualizar jogada:', error);
      throw error;
    }
  },

  async delete(playId: string): Promise<void> {
    console.log('🗑️ [DELETE PLAY] A apagar jogada:', playId);

    try {
      await apiCall(`/jogadas/${playId}`, {
        method: 'DELETE',
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

    const usersResponse = await apiCall('/users').catch(() => ({ data: [] }));
    const users = usersResponse.data || [];

    const dicasProcessadas = response.data.map((dica: any) => {
      const autorReal = users.find((u: any) => u.id === dica.user_id);

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
        equipa: autorReal?.equipa || dica.user?.equipa || 'Sem Equipa',
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
    const user_id = dicaData.autorId;

    if (!user_id) {
      throw new Error('Utilizador não identificado');
    }

    const newDicaData = {
      user_id: parseInt(user_id.toString()),
      titulo: dicaData.titulo,
      categoria: dicaData.categoria,
      conteudo: dicaData.conteudo,
      ficheiro: null
    };

    const response = await apiCall('/dicas', {
      method: 'POST',
      body: JSON.stringify(newDicaData),
    });

    return {
      ...dicaData,
      id: response.data.id.toString(),
      criadoEm: new Date()
    };
  },
  async update(tipId: string, tipData: Partial<TipDisplay>): Promise<TipDisplay> {
    const currentUser = authAPI.getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilizador não autenticado');
    }

    try {
      const response = await apiCall(`/dicas/${tipId}`, {
        method: 'PUT',
        body: JSON.stringify({
          titulo: tipData.titulo,
          descricao: tipData.descricao,
          categoria: tipData.categoria,
          conteudo: tipData.conteudo
        }),
      });

      return {
        ...tipData,
        id: tipId,
        titulo: response.data.titulo,
        descricao: response.data.descricao,
        categoria: response.data.categoria,
        conteudo: response.data.conteudo,
        autorId: response.data.user_id.toString(),
        autorNome: currentUser.nome,
        autorTipo: currentUser.tipo as any,
        equipa: currentUser.equipa || '',
        criadoEm: new Date(response.data.updated_at || response.data.created_at)
      } as TipDisplay;

    } catch (error: any) {
      console.error('❌ [UPDATE TIP] Erro ao atualizar dica:', error);
      throw error;
    }
  },

  async delete(tipId: string | number): Promise<void> {
    try {
      await apiCall(`/dicas/${tipId}`, {
        method: 'DELETE',
      });
      console.log('✅ [DELETE TIP] Dica apagada com sucesso');
    } catch (error: any) {
      console.error('❌ [DELETE TIP] Erro ao apagar dica:', error);
      throw error;
    }
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

      if (!response.data) return [];

      return response.data.map((stat: any) => ({
        id: stat.id.toString(),
        nome: stat.atleta?.user?.nome || 'Atleta Desconhecido',
        equipa: stat.atleta?.equipa?.nome || 'Equipa Desconhecida',
        posicao: stat.atleta?.posicao || 'central',
        divisao: 'seniores',
        golosMarcados: stat.golos_marcados || 0,
        jogosDisputados: stat.jogos || 0,
        assistencias: 0,
        cartoesAmarelos: stat.cartoes_amarelos || 0,
        cartoesVermelhos: stat.cartoes_vermelhos || 0
      }));

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      return [];
    }
  },

  async getByDivision(divisao: string): Promise<AthleteStatsDisplay[]> {
    const stats = await this.getAll();
    return stats.filter((stat: AthleteStatsDisplay) => stat.divisao === divisao);
  },

  async getMyStats(): Promise<any> {
    const response = await apiCall('/estatisticas-atleta');
    return response;
  },

  async addGame(payload: any): Promise<any> {
    const response = await apiCall('/estatisticas-atleta', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return response;
  },

  async getPublicStats(): Promise<any> {
    return apiCall('/estatisticas-atletas');
  },

  async getMyGameStats(): Promise<any> {
    const response = await apiCall('/atleta/jogos');
    return response;
  },

  async getAthleteGameStats(athleteId: number | string): Promise<any> {
    const response = await apiCall(`/atleta/${athleteId}/jogos`);
    return response;
  }
};

// Trainers API
export const trainersAPI = {
  async getPendingAthletes(): Promise<any[]> {
    try {
      const response = await apiCall('/treinador/atletas-pendentes');
      return response.data || [];
    } catch (error) {
      console.error('❌ [TRAINERS API] Erro a buscar atletas pendentes', error);
      return [];
    }
  },

  async approveAthlete(id: string): Promise<any> {
    return apiCall(`/treinador/aprovar-atleta/${id}`, {
      method: 'POST'
    });
  },

  async rejectAthlete(id: string): Promise<any> {
    return apiCall(`/treinador/rejeitar-atleta/${id}`, {
      method: 'DELETE'
    });
  },

  async getTeamGames(): Promise<any[]> {
    try {
      const response = await apiCall('/treinador/meus-jogos');
      return response.data || [];
    } catch (error) {
      console.error('❌ [TRAINERS API] Erro a buscar jogos da equipa', error);
      return [];
    }
  }
};

// Admin API
export const adminAPI = {
  async getPendingTreinadores(): Promise<any[]> {
    try {
      const response = await apiCall('/admin/pending-treinadores');
      return response.data || [];
    } catch (error) {
      console.error('❌ [ADMIN API] Erro a buscar treinadores pendentes', error);
      return [];
    }
  },

  async getPendingAthletes(): Promise<any[]> {
    try {
      const response = await apiCall('/admin/pending-athletes');
      return response.data || [];
    } catch (error) {
      console.error('❌ [ADMIN API] Erro a buscar atletas pendentes', error);
      return [];
    }
  },

  async getUsers(): Promise<any[]> {
    try {
      const response = await apiCall('/admin/users');
      return response.data || [];
    } catch (error) {
      console.error('❌ [ADMIN API] Erro a buscar utilizadores', error);
      return [];
    }
  },

  async getStats(): Promise<any> {
    try {
      const response = await apiCall('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('❌ [ADMIN API] Erro ao buscar estatísticas globais', error);
      return null;
    }
  },

  async updateUserRole(userId: number, role: string): Promise<any> {
    return apiCall(`/admin/users/${userId}/role`, {
      method: 'POST',
      body: JSON.stringify({ tipo: role })
    });
  },

  async validateTreinador(treinadorId: number): Promise<any> {
    return apiCall(`/admin/validate-treinador/${treinadorId}`, {
      method: 'POST'
    });
  },

  async validateUser(id: number): Promise<any> {
    return apiCall(`/admin/validate-user/${id}`, { method: 'POST' });
  },

  async deleteUser(userId: number): Promise<any> {
    return apiCall(`/admin/users/${userId}`, {
      method: 'DELETE'
    });
  },

  async togglePremium(userId: number): Promise<any> {
    return apiCall(`/admin/users/${userId}/toggle-premium`, {
      method: 'POST'
    });
  },

  async toggleValidation(userId: number): Promise<any> {
    return apiCall(`/admin/users/${userId}/toggle-validation`, {
      method: 'POST'
    });
  },

  async updateUser(userId: number, data: any): Promise<any> {
    return apiCall(`/admin/users/${userId}/update`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async deleteContent(type: 'jogada' | 'dica' | 'comentario', id: number): Promise<any> {
    return apiCall(`/admin/content/${type}/${id}`, {
      method: 'DELETE'
    });
  }
};

// Equipas API
export const equipasAPI = {
  async getAll(): Promise<any[]> {
    try {
      const response = await apiCall('/equipas');
      return response.data || [];
    } catch (error) {
      console.error('❌ [EQUIPAS API] Erro ao buscar equipas', error);
      return [];
    }
  },
  async create(data: { nome: string; escalao_equipa_escalao?: string }): Promise<any> {
    return apiCall('/equipas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async update(id: number | string, data: { nome: string }): Promise<any> {
    return apiCall(`/equipas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async delete(id: number | string): Promise<any> {
    return apiCall(`/equipas/${id}`, {
      method: 'DELETE',
    });
  }
};

// Escalões API
export const escaloesAPI = {
  async getAll(): Promise<any[]> {
    try {
      const response = await apiCall('/escaloes');
      return response.data || [];
    } catch (error) {
      console.error('❌ [ESCALÕES API] Erro ao buscar escalões', error);
      return [];
    }
  }
};

// Atletas API
export const atletasAPI = {
  async getAll(): Promise<any> {
    return apiCall('/atletas');
  },
  async update(id: number | string, data: any): Promise<any> {
    return apiCall(`/atletas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async delete(id: number | string): Promise<any> {
    return apiCall(`/atletas/${id}`, {
      method: 'DELETE'
    });
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
