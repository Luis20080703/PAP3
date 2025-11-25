# Mapeamento Base de Dados ↔ Aplicação React

Este documento descreve o mapeamento entre o schema da base de dados (Laravel) e a estrutura de dados da aplicação React.

## 📊 Estrutura das Tabelas

### 1. **users** (Utilizadores)
**Tabela BD:**
```sql
users (
  id: int PRIMARY KEY,
  nome: varchar,
  email: varchar,
  password: varchar
)
```

**Interface React:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  type: 'athlete' | 'coach' | null;
  team?: string;
}
```

**Nota:** O campo `type` é derivado verificando se existe registo em `atletas` ou `treinadores`.

---

### 2. **épocas** (Épocas/Temporadas)
**Tabela BD:**
```sql
épocas (
  id: int PRIMARY KEY,
  data_inicio: date,
  data_fim: date
)
```

**Interface React:**
```typescript
interface Season {
  id: string;
  data_inicio: Date;
  data_fim: Date;
}
```

---

### 3. **equipas** (Equipas)
**Tabela BD:**
```sql
equipas (
  id: int PRIMARY KEY,
  nome: varchar,
  escalao_equipas_escalao_ef: int FOREIGN KEY → equipas_escalão.id
)
```

**Interface React:**
```typescript
interface Team {
  id: string;
  nome: string;
  escalao_id?: string;
}
```

---

### 4. **equipas_escalão** (Escalões das Equipas)
**Tabela BD:**
```sql
equipas_escalão (
  id: int PRIMARY KEY,
  equipa_id: int FOREIGN KEY → equipas.id,
  escalao: varchar
)
```

**Interface React:**
```typescript
interface TeamDivision {
  id: string;
  equipa_id: string;
  escalao: 'seniores' | 'sub-20' | 'sub-18' | 'sub-16' | 'sub-14';
}
```

---

### 5. **atletas** (Atletas)
**Tabela BD:**
```sql
atletas (
  id: int PRIMARY KEY,
  user_id: int FOREIGN KEY → users.id,
  equipa_id: int FOREIGN KEY → equipas.id,
  epoca_id: int FOREIGN KEY → épocas.id,
  posição: varchar,
  número: int
)
```

**Interface React:**
```typescript
interface Athlete {
  id: string;
  user_id: string;
  equipa_id: string;
  epoca_id: string;
  posicao: 'pivot' | 'ponta' | 'lateral' | 'central' | 'guarda-redes';
  numero?: number;
}
```

---

### 6. **treinadores** (Treinadores)
**Tabela BD:**
```sql
treinadores (
  id: int PRIMARY KEY,
  user_id: int FOREIGN KEY → users.id,
  equipa_id: int FOREIGN KEY → equipas.id,
  epoca_id: int FOREIGN KEY → épocas.id
)
```

**Interface React:**
```typescript
interface Coach {
  id: string;
  user_id: string;
  equipa_id: string;
  epoca_id: string;
}
```

---

### 7. **jogadas** (Jogadas)
**Tabela BD:**
```sql
jogadas (
  id: int PRIMARY KEY,
  user_id: int FOREIGN KEY → users.id,
  título: varchar,
  descrição: text,
  ficheiro: varchar,
  data_upload: datetime
)
```

**Interface React (BD):**
```typescript
interface Play {
  id: string;
  user_id: string;
  titulo: string;
  descricao: string;
  ficheiro: string;
  data_upload: Date;
}
```

**Interface React (Display):**
```typescript
interface PlayDisplay {
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
  comments: CommentDisplay[];
}
```

**Mapeamento:**
- `titulo` → `title`
- `descricao` → `description`
- `ficheiro` → `videoUrl`
- `data_upload` → `createdAt`
- `user_id` → `authorId`
- Campos derivados: `authorName`, `authorType`, `team`, `category` (obtidos via JOINs)

---

### 8. **comentários** (Comentários)
**Tabela BD:**
```sql
comentários (
  id: int PRIMARY KEY,
  user_id: int FOREIGN KEY → users.id,
  jogada_id: int FOREIGN KEY → jogadas.id,
  texto: text,
  data: datetime
)
```

**Interface React (BD):**
```typescript
interface Comment {
  id: string;
  user_id: string;
  jogada_id: string;
  texto: string;
  data: Date;
}
```

**Interface React (Display):**
```typescript
interface CommentDisplay {
  id: string;
  playId: string;
  authorId: string;
  authorName: string;
  authorType: 'athlete' | 'coach';
  content: string;
  createdAt: Date;
}
```

**Mapeamento:**
- `texto` → `content`
- `data` → `createdAt`
- `jogada_id` → `playId`
- `user_id` → `authorId`
- Campos derivados: `authorName`, `authorType`

---

### 9. **dicas** (Dicas Técnicas)
**Tabela BD:**
```sql
dicas (
  id: int PRIMARY KEY,
  id_user_ef: int FOREIGN KEY → users.id,
  título: varchar,
  conteúdo: text,
  ficheiro: varchar,
  data_upload: datetime
)
```

**Interface React (BD):**
```typescript
interface Tip {
  id: string;
  id_user_ef: string;
  titulo: string;
  conteudo: string;
  ficheiro?: string;
  data_upload: Date;
}
```

**Interface React (Display):**
```typescript
interface TipDisplay {
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

**Mapeamento:**
- `titulo` → `title`
- `conteudo` → `content`
- `data_upload` → `createdAt`
- `id_user_ef` → `authorId`
- Campos derivados: `description`, `category`, `authorName`, `authorType`

---

### 10. **estatísticas_equipas** (Estatísticas das Equipas)
**Tabela BD:**
```sql
estatísticas_equipas (
  id: int PRIMARY KEY,
  equipa_id: int FOREIGN KEY → equipas.id,
  época_id: int FOREIGN KEY → épocas.id,
  escalão: varchar
  -- Campos calculados derivados de jogos
)
```

**Interface React (BD):**
```typescript
interface TeamStats {
  id: string;
  equipa_id: string;
  epoca_id: string;
  escalao: 'seniores' | 'sub-20' | 'sub-18' | 'sub-16' | 'sub-14';
}
```

**Interface React (Display):**
```typescript
interface TeamStatsDisplay {
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

**Mapeamento:**
- `escalao` → `division`
- Campos derivados: `teamName` (via JOIN com `equipas`)
- Campos calculados: `goalsScored`, `goalsConceded`, `matchesPlayed`, `wins`, `draws`, `losses`

---

### 11. **estatísticas_atleta** (Estatísticas dos Atletas)
**Tabela BD:**
```sql
estatísticas_atleta (
  id: int PRIMARY KEY,
  atleta_id: int FOREIGN KEY → atletas.id,
  golos_marcados: int,
  época: varchar,
  média_golos: float
  -- Outros campos necessários
)
```

**Interface React (BD):**
```typescript
interface AthleteStats {
  id: string;
  atleta_id: string;
  golos_marcados: number;
  epoca: string;
  media_golos: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  matchesPlayed?: number;
}
```

**Interface React (Display):**
```typescript
interface AthleteStatsDisplay {
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

**Mapeamento:**
- `golos_marcados` → `goalsScored`
- Campos derivados via JOINs:
  - `name` (via `atletas` → `users`)
  - `team` (via `atletas` → `equipas`)
  - `position` (via `atletas`)
  - `division` (via `atletas` → `equipas_escalão`)

---

## 🔄 Queries Típicas (Laravel → React)

### Obter Jogadas com Autor
```php
// Laravel
$jogadas = Jogada::with(['user', 'comentarios'])
    ->select('jogadas.*')
    ->join('users', 'jogadas.user_id', '=', 'users.id')
    ->get();
```

```typescript
// React (simulado)
const plays = await playsAPI.getAll();
// Retorna PlayDisplay[] com authorName preenchido
```

### Obter Estatísticas de Atleta
```php
// Laravel
$stats = EstatisticaAtleta::with(['atleta.user', 'atleta.equipa'])
    ->where('atleta_id', $atletaId)
    ->get();
```

```typescript
// React (simulado)
const stats = athleteStats.filter(s => s.name === user.name);
// Retorna AthleteStatsDisplay[] com todos os campos derivados
```

---

## 📝 Notas Importantes

### Diferenças entre Interfaces BD e Display

1. **Interfaces BD**: Refletem exatamente a estrutura das tabelas MySQL
   - Usam nomes de campos em português (como na BD)
   - Contêm apenas foreign keys (IDs)
   - Sem campos derivados/calculados

2. **Interfaces Display**: Preparadas para a UI
   - Nomes de campos em inglês (convenção React)
   - Contêm dados denormalizados (nomes, teams, etc.)
   - Incluem campos calculados e derivados

### Quando usar cada interface?

- **No Laravel (API)**: Use as interfaces BD para mapear modelos Eloquent
- **No React (Frontend)**: Use as interfaces Display para exibição
- **Na camada API**: Faça a transformação de BD → Display

### Exemplo de Transformação

```php
// Laravel Controller
public function getJogadas() {
    $jogadas = Jogada::with(['user'])->get();
    
    return $jogadas->map(function($jogada) {
        return [
            'id' => $jogada->id,
            'title' => $jogada->titulo,
            'description' => $jogada->descricao,
            'videoUrl' => $jogada->ficheiro,
            'authorId' => $jogada->user_id,
            'authorName' => $jogada->user->nome,
            'authorType' => $jogada->user->atleta ? 'athlete' : 'coach',
            'createdAt' => $jogada->data_upload,
            'comments' => []
        ];
    });
}
```

---

## 🎯 Permissões e Regras de Negócio

### Atletas
- ✅ Veem apenas as **suas** estatísticas
- ✅ Podem comentar em jogadas
- ❌ Não podem criar/editar/eliminar jogadas
- ❌ Não podem ver estatísticas de outros atletas

### Treinadores
- ✅ Veem estatísticas de **todos** os atletas
- ✅ Podem criar/editar/eliminar jogadas
- ✅ Podem criar/editar/eliminar dicas
- ✅ Podem gerir atletas da sua equipa

### Implementação no Laravel

```php
// AthleteStatsController
public function index(Request $request) {
    $user = $request->user();
    
    if ($user->atleta) {
        // Atleta: apenas as suas stats
        return EstatisticaAtleta::where('atleta_id', $user->atleta->id)->get();
    } elseif ($user->treinador) {
        // Treinador: todas as stats
        return EstatisticaAtleta::all();
    }
}
```

---

## 📚 Referências

- `types/index.ts` - Definição de todas as interfaces
- `services/api.ts` - Simulação das APIs (mock)
- `data/mockData.ts` - Dados de exemplo
- `DATABASE_SCHEMA.md` - Schema completo da base de dados
- `MODELS_REFERENCE.md` - Modelos Laravel correspondentes
