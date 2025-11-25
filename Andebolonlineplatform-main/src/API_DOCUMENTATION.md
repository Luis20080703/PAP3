# Documentação da API - NexusHand

## Visão Geral

A aplicação utiliza um sistema de APIs simuladas que armazena dados no `localStorage` do navegador, simulando um backend REST completo. Todos os dados são persistidos localmente e sobrevivem a refreshes da página.

## Estrutura da API

### 1. Auth API (`/services/api.ts`)

#### `authAPI.login(email, password)`
- **Descrição**: Autentica um utilizador
- **Parâmetros**: 
  - `email: string`
  - `password: string`
- **Retorna**: `Promise<User>`
- **Erros**: Lança erro se utilizador não encontrado

#### `authAPI.register(userData)`
- **Descrição**: Regista um novo utilizador
- **Parâmetros**: 
  - `userData: Omit<User, 'id'>`
- **Retorna**: `Promise<User>`
- **Erros**: Lança erro se email já registado

#### `authAPI.logout()`
- **Descrição**: Remove sessão do utilizador
- **Retorna**: `Promise<void>`

#### `authAPI.getCurrentUser()`
- **Descrição**: Obtém utilizador atual da sessão
- **Retorna**: `User | null`

---

### 2. Plays API

#### `playsAPI.getAll()`
- **Descrição**: Obtém todas as jogadas
- **Retorna**: `Promise<Play[]>`

#### `playsAPI.getById(id)`
- **Descrição**: Obtém uma jogada específica
- **Parâmetros**: `id: string`
- **Retorna**: `Promise<Play | null>`

#### `playsAPI.create(playData)`
- **Descrição**: Cria uma nova jogada
- **Parâmetros**: `playData: Omit<Play, 'id' | 'createdAt' | 'comments'>`
- **Retorna**: `Promise<Play>`

#### `playsAPI.update(id, updates)`
- **Descrição**: Atualiza uma jogada existente
- **Parâmetros**: 
  - `id: string`
  - `updates: Partial<Play>`
- **Retorna**: `Promise<Play>`
- **Erros**: Lança erro se jogada não encontrada

#### `playsAPI.delete(id)`
- **Descrição**: Elimina uma jogada
- **Parâmetros**: `id: string`
- **Retorna**: `Promise<void>`

#### `playsAPI.addComment(playId, comment)`
- **Descrição**: Adiciona comentário a uma jogada
- **Parâmetros**: 
  - `playId: string`
  - `comment: Omit<Comment, 'id' | 'createdAt'>`
- **Retorna**: `Promise<Comment>`
- **Erros**: Lança erro se jogada não encontrada

---

### 3. Tips API

#### `tipsAPI.getAll()`
- **Descrição**: Obtém todas as dicas
- **Retorna**: `Promise<Tip[]>`

#### `tipsAPI.getByCategory(category)`
- **Descrição**: Obtém dicas por categoria
- **Parâmetros**: `category: string` ('all' para todas)
- **Retorna**: `Promise<Tip[]>`

#### `tipsAPI.create(tipData)`
- **Descrição**: Cria uma nova dica
- **Parâmetros**: `tipData: Omit<Tip, 'id' | 'createdAt'>`
- **Retorna**: `Promise<Tip>`

#### `tipsAPI.update(id, updates)`
- **Descrição**: Atualiza uma dica existente
- **Parâmetros**: 
  - `id: string`
  - `updates: Partial<Tip>`
- **Retorna**: `Promise<Tip>`

#### `tipsAPI.delete(id)`
- **Descrição**: Elimina uma dica
- **Parâmetros**: `id: string`
- **Retorna**: `Promise<void>`

---

### 4. Team Stats API

#### `teamStatsAPI.getAll()`
- **Descrição**: Obtém estatísticas de todas as equipas
- **Retorna**: `Promise<TeamStats[]>`

#### `teamStatsAPI.getByDivision(division)`
- **Descrição**: Obtém estatísticas por escalão
- **Parâmetros**: `division: string`
- **Retorna**: `Promise<TeamStats[]>`

#### `teamStatsAPI.getByTeam(teamName)`
- **Descrição**: Obtém estatísticas de uma equipa específica
- **Parâmetros**: `teamName: string`
- **Retorna**: `Promise<TeamStats[]>`

---

### 5. Athlete Stats API

#### `athleteStatsAPI.getAll()`
- **Descrição**: Obtém estatísticas de todos os atletas
- **Retorna**: `Promise<AthleteStats[]>`

#### `athleteStatsAPI.getByDivision(division)`
- **Descrição**: Obtém estatísticas por escalão
- **Parâmetros**: `division: string`
- **Retorna**: `Promise<AthleteStats[]>`

#### `athleteStatsAPI.getByTeam(team)`
- **Descrição**: Obtém estatísticas por equipa
- **Parâmetros**: `team: string`
- **Retorna**: `Promise<AthleteStats[]>`

#### `athleteStatsAPI.getByName(name)`
- **Descrição**: Obtém estatísticas de um atleta específico
- **Parâmetros**: `name: string`
- **Retorna**: `Promise<AthleteStats | null>`

---

## Context API (`/context/AppContext.tsx`)

### Estado Global

```typescript
interface AppContextType {
  // Auth
  user: User | null;
  loading: boolean;
  
  // Data
  plays: Play[];
  tips: Tip[];
  teamStats: TeamStats[];
  athleteStats: AthleteStats[];
  
  // Loading states
  playsLoading: boolean;
  tipsLoading: boolean;
  statsLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id'>) => Promise<void>;
  logout: () => Promise<void>;
  
  // Data refresh
  refreshPlays: () => Promise<void>;
  refreshTips: () => Promise<void>;
  refreshStats: () => Promise<void>;
}
```

### Hook de Utilização

```typescript
import { useApp } from '../context/AppContext';

function MyComponent() {
  const { user, plays, login, refreshPlays } = useApp();
  
  // Use os dados e funções...
}
```

---

## Tipos de Dados (`/types/index.ts`)

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  type: 'athlete' | 'coach' | null;
  team?: string;
}
```

### Play
```typescript
interface Play {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  authorId: string;
  authorName: string;
  authorType: 'athlete' | 'coach';
  team: string;
  category: string;
  createdAt: Date;
  comments: Comment[];
}
```

### Tip
```typescript
interface Tip {
  id: string;
  title: string;
  description: string;
  category: 'finta' | 'drible' | 'remate' | 'defesa' | 'táctica';
  content: string;
  authorId: string;
  authorName: string;
  authorType: 'athlete' | 'coach';
  createdAt: Date;
}
```

### TeamStats
```typescript
interface TeamStats {
  id: string;
  teamName: string;
  division: 'seniores' | 'sub-20' | 'sub-18' | 'sub-16' | 'sub-14';
  goalsScored: number;
  goalsConceded: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
}
```

### AthleteStats
```typescript
interface AthleteStats {
  id: string;
  name: string;
  team: string;
  position: 'pivot' | 'ponta' | 'lateral' | 'central' | 'guarda-redes';
  division: 'seniores' | 'sub-20' | 'sub-18' | 'sub-16' | 'sub-14';
  goalsScored: number;
  matchesPlayed: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}
```

---

## Armazenamento Local

Os dados são armazenados no `localStorage` com as seguintes chaves:

- `handball_users` - Lista de utilizadores registados
- `handball_plays` - Todas as jogadas
- `handball_tips` - Todas as dicas
- `handball_team_stats` - Estatísticas das equipas
- `handball_athlete_stats` - Estatísticas dos atletas
- `handball_current_user` - Utilizador atualmente autenticado

---

## Migração para Backend Real

Para migrar esta aplicação para um backend Laravel/Livewire:

1. **Substituir APIs simuladas**: Trocar chamadas `playsAPI.create()` por chamadas HTTP reais
2. **Endpoints REST**: Criar rotas Laravel correspondentes
3. **Autenticação**: Implementar Laravel Sanctum para autenticação
4. **WebSockets**: Adicionar Laravel Broadcasting para atualizações em tempo real
5. **Validação**: Implementar Form Requests no Laravel
6. **Base de Dados**: Criar migrations e models para todas as entidades

### Exemplo de Migração

**Antes (React):**
```typescript
await playsAPI.create(playData);
await refreshPlays();
```

**Depois (com Backend Laravel):**
```typescript
const response = await fetch('/api/plays', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(playData)
});
const newPlay = await response.json();
```

---

## Notas Importantes

- Todas as operações de API incluem um delay simulado (300ms) para simular latência de rede
- Os dados são inicializados automaticamente com dados de exemplo na primeira utilização
- As datas são convertidas automaticamente de/para strings durante armazenamento
- A aplicação funciona completamente offline após carregamento inicial
