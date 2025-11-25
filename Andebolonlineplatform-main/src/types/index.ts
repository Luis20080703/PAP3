export type UserType = 'atleta' | 'treinador';

// Tabela: users
export interface User {
  id: string;
  nome: string;
  email: string;
  password: string;
  tipo: UserType;
  equipa: string;
}

// Tabela: épocas
export interface Season {
  id: string;
  data_inicio: Date;
  data_fim: Date;
}

// Tabela: equipas
export interface Team {
  id: string;
  nome: string;
  escalao_id?: string;
}

// Tabela: equipas_escalão
export interface TeamDivision {
  id: string;
  equipa_id: string;
  escalao: 'seniores' | 'sub-20' | 'sub-18' | 'sub-16' | 'sub-14';
}

// Tabela: atletas
export interface Athlete {
  id: string;
  user_id: string;
  equipa_id: string;
  epoca_id: string;
  posicao: 'pivot' | 'ponta' | 'lateral' | 'central' | 'guarda-redes';
  numero?: number;
}

// Tabela: treinadores
export interface Coach {
  id: string;
  user_id: string;
  equipa_id: string;
  epoca_id: string;
}

// Tabela: jogadas
export interface Play {
  id: string;
  user_id: string;
  titulo: string;
  descricao: string;
  ficheiro: string;
  data_upload: Date;
  // Campos derivados para exibição
  autorNome?: string;
  autorTipo?: 'atleta' | 'treinador'; // ✅ CORRIGIDO
  equipa?: string;
  categoria?: string;
  comentarios?: Comment[];
}

// Tabela: comentários
export interface Comment {
  id: string;
  user_id: string;
  jogada_id: string;
  texto: string;
  data: Date;
  // Campos derivados para exibição
  autorNome?: string;
  autorTipo?: 'atleta' | 'treinador'; // ✅ CORRIGIDO
}

// Tabela: dicas
export interface Tip {
  id: string;
  id_user_ef: string;
  titulo: string;
  conteudo: string;
  ficheiro?: string;
  data_upload: Date;
  // Campos derivados para exibição
  categoria?: 'finta' | 'drible' | 'remate' | 'defesa' | 'táctica';
  descricao?: string;
  autorNome?: string;
  autorTipo?: 'atleta' | 'treinador'; // ✅ CORRIGIDO
}

// Tabela: estatísticas_equipas
export interface TeamStats {
  id: string;
  equipa_id: string;
  epoca_id: string;
  escalao: 'seniores' | 'sub-20' | 'sub-18' | 'sub-16' | 'sub-14';
  // Campos derivados/calculados
  nomeEquipa?: string;
  divisao?: 'seniores' | 'sub-20' | 'sub-18' | 'sub-16' | 'sub-14';
  golosMarcados?: number;
  golosSofridos?: number;
  jogosDisputados?: number;
  vitorias?: number;
  empates?: number;
  derrotas?: number;
}

// Tabela: estatísticas_atleta
export interface AthleteStats {
  id: string;
  atleta_id: string;
  golos_marcados: number;
  epoca: string;
  media_golos: number;
  // Campos adicionais necessários
  assistencias?: number;
  cartoesAmarelos?: number;
  cartoesVermelhos?: number;
  jogosDisputados?: number;
  // Campos derivados para exibição
  nome?: string;
  equipa?: string;
  posicao?: 'pivot' | 'ponta' | 'lateral' | 'central' | 'guarda-redes';
  divisao?: 'seniores' | 'sub-20' | 'sub-18' | 'sub-16' | 'sub-14';
}

// Interface para exibição (compatibilidade com código existente)
export interface PlayDisplay {
  id: string;
  titulo: string; // ✅ CORRIGIDO
  descricao: string; // ✅ CORRIGIDO
  urlVideo: string; // ✅ CORRIGIDO
  autorId: string; // ✅ CORRIGIDO
  autorNome: string; // ✅ CORRIGIDO
  autorTipo: 'atleta' | 'treinador'; // ✅ CORRIGIDO
  equipa: string; // ✅ CORRIGIDO
  categoria: string;
  criadoEm: Date; // ✅ CORRIGIDO
  comentarios: CommentDisplay[];
}

export interface CommentDisplay {
  id: string;
  jogadaId: string; // ✅ CORRIGIDO
  autorId: string; // ✅ CORRIGIDO
  autorNome: string; // ✅ CORRIGIDO
  autorTipo: 'atleta' | 'treinador'; // ✅ CORRIGIDO
  conteudo: string; // ✅ CORRIGIDO
  criadoEm: Date; // ✅ CORRIGIDO
}

export interface TipDisplay {
  id: string;
  titulo: string; // ✅ CORRIGIDO
  descricao: string; // ✅ CORRIGIDO
  categoria: string;
  conteudo: string; // ✅ CORRIGIDO
  autorId: string; // ✅ CORRIGIDO
  autorNome: string; // ✅ CORRIGIDO
  autorTipo: 'atleta' | 'treinador'; // ✅ CORRIGIDO
  criadoEm: Date; // ✅ CORRIGIDO
}

export interface TeamStatsDisplay {
  id: string;
  nomeEquipa: string; // ✅ CORRIGIDO
  divisao: 'seniores' | 'sub-20' | 'sub-18' | 'sub-16' | 'sub-14';
  golosMarcados: number; // ✅ CORRIGIDO
  golosSofridos: number; // ✅ CORRIGIDO
  jogosDisputados: number; // ✅ CORRIGIDO
  vitorias: number; // ✅ CORRIGIDO
  empates: number; // ✅ CORRIGIDO
  derrotas: number; // ✅ CORRIGIDO
}

export interface AthleteStatsDisplay {
  id: string;
  nome: string; // ✅ CORRIGIDO
  equipa: string; // ✅ CORRIGIDO
  posicao: 'pivot' | 'ponta' | 'lateral' | 'central' | 'guarda-redes';
  divisao: 'seniores' | 'sub-20' | 'sub-18' | 'sub-16' | 'sub-14';
  golosMarcados: number; // ✅ CORRIGIDO
  jogosDisputados: number; // ✅ CORRIGIDO
  assistencias: number; // ✅ CORRIGIDO
  cartoesAmarelos: number; // ✅ CORRIGIDO
  cartoesVermelhos: number; // ✅ CORRIGIDO
}