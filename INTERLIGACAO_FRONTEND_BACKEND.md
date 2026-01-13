# 🔗 Como o Layout se Interliga com o Backend através da API

Este documento explica detalhadamente como o **frontend (React/TypeScript)** se comunica com o **backend (Laravel/PHP)** através de uma API REST no projeto NexusHand.

---

## 📋 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Camada de Serviços API (Frontend)](#camada-de-serviços-api-frontend)
3. [Contexto Global (AppContext)](#contexto-global-appcontext)
4. [Componentes React](#componentes-react)
5. [Controladores Laravel (Backend)](#controladores-laravel-backend)
6. [Fluxo Completo de uma Requisição](#fluxo-completo-de-uma-requisição)
7. [Exemplos Práticos](#exemplos-práticos)

---

## 🏗️ Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ Componentes  │───▶│  AppContext  │───▶│  api.ts      │  │
│  │  (UI/UX)     │    │  (Estado)    │    │  (Serviços)  │  │
│  └──────────────┘    └──────────────┘    └──────┬───────┘  │
│                                                   │          │
└───────────────────────────────────────────────────┼──────────┘
                                                    │
                                    HTTP Requests   │
                                    (JSON)          │
                                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (Laravel)                        │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Routes     │───▶│ Controllers  │───▶│   Models     │  │
│  │  (api.php)   │    │   (API)      │    │ (Database)   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Camada de Serviços API (Frontend)

### 📁 Localização
`src/services/api.ts`

### 🎯 Função
Este ficheiro centraliza **TODAS** as chamadas HTTP ao backend. É a ponte entre o frontend e o backend.

### 🔑 Componentes Principais

#### 1️⃣ **URL Base da API**
```typescript
const getAPIBaseURL = () => {
  // Verifica se há IP manual configurado (para mobile)
  const manualServerIP = localStorage.getItem('server_ip');
  if (manualServerIP) {
    return `http://${manualServerIP}:8000/api`;
  }
  
  // Detecção automática
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:8000/api';
  }
  
  return `http://${window.location.hostname}:8000/api`;
};

export const API_BASE_URL = getAPIBaseURL();
```

**O que faz:**
- Define dinamicamente o endereço do servidor backend
- Suporta configuração manual para acesso móvel
- Adapta-se automaticamente ao ambiente (localhost ou rede)

---

#### 2️⃣ **Função Genérica `apiCall`**
```typescript
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Adiciona token de autenticação automaticamente
  const token = localStorage.getItem('api_token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    credentials: 'include',
    ...options,
  });

  // Tratamento de erros (401, 404, etc.)
  if (!response.ok) {
    if (response.status === 401) {
      // Sessão expirada - faz logout automático
      localStorage.removeItem('current_user');
      localStorage.removeItem('api_token');
      window.location.href = '/';
    }
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
```

**O que faz:**
- Envia requisições HTTP para o backend
- Adiciona automaticamente o token de autenticação
- Trata erros (sessão expirada, servidor indisponível)
- Retorna dados em formato JSON

---

#### 3️⃣ **APIs Específicas**

##### 🔐 **authAPI** - Autenticação
```typescript
export const authAPI = {
  // LOGIN
  async login(email: string, password: string): Promise<User> {
    const response = await apiCall('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Guarda utilizador e token no localStorage
    localStorage.setItem('current_user', JSON.stringify(response.user));
    localStorage.setItem('api_token', response.token);
    
    return response.user;
  },

  // REGISTO
  async register(userData: any): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    
    if (result.success && result.user) {
      localStorage.setItem('current_user', JSON.stringify(result.user));
      localStorage.setItem('api_token', result.token);
      return result.user;
    }
    
    throw new Error(result.message || 'Erro no registo');
  },

  // LOGOUT
  async logout(): Promise<void> {
    localStorage.removeItem('current_user');
    localStorage.removeItem('api_token');
  },

  // OBTER UTILIZADOR ATUAL
  getCurrentUser(): User | null {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }
};
```

##### 🎮 **playsAPI** - Jogadas
```typescript
export const playsAPI = {
  // OBTER TODAS AS JOGADAS
  async getAll(): Promise<PlayDisplay[]> {
    const response = await apiCall('/jogadas');
    
    // Busca dados relacionados (users, equipas, comentários)
    const [usersResponse, equipasResponse, comentariosResponse] = 
      await Promise.all([
        apiCall('/users'),
        apiCall('/equipas'),
        apiCall('/comentarios')
      ]);
    
    // Processa e combina os dados
    const plays = response.data.map((play: any) => ({
      id: play.id.toString(),
      titulo: play.titulo,
      descricao: play.descricao,
      urlVideo: play.ficheiro,
      autorNome: users.find(u => u.id === play.user_id)?.nome,
      equipa: equipas.find(e => e.id === play.equipa_id)?.nome,
      // ... mais campos
    }));
    
    return plays;
  },

  // CRIAR NOVA JOGADA
  async create(playData: any, videoFile?: File): Promise<PlayDisplay> {
    const formData = new FormData();
    formData.append('user_id', currentUser.id.toString());
    formData.append('titulo', playData.titulo);
    formData.append('descricao', playData.descricao);
    
    if (videoFile) {
      formData.append('video', videoFile);
    }
    
    const response = await fetch(`${API_BASE_URL}/jogadas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('api_token')}`
      },
      body: formData
    });
    
    return response.json();
  },

  // APAGAR JOGADA
  async delete(playId: string): Promise<void> {
    await apiCall(`/jogadas/${playId}`, {
      method: 'DELETE',
    });
  }
};
```

##### 💡 **tipsAPI** - Dicas
```typescript
export const tipsAPI = {
  async getAll(): Promise<TipDisplay[]> {
    const response = await apiCall('/dicas');
    return response.data;
  },

  async create(dicaData: any): Promise<TipDisplay> {
    const response = await apiCall('/dicas', {
      method: 'POST',
      body: JSON.stringify(dicaData),
    });
    return response.data;
  },

  async delete(tipId: string): Promise<void> {
    await apiCall(`/dicas/${tipId}`, {
      method: 'DELETE',
    });
  }
};
```

##### 📊 **athleteStatsAPI** - Estatísticas de Atletas
```typescript
export const athleteStatsAPI = {
  // Estatísticas públicas (rankings)
  async getAll(): Promise<AthleteStatsDisplay[]> {
    const response = await apiCall('/estatisticas-atletas');
    return response.data;
  },

  // Minhas estatísticas (Dashboard)
  async getMyStats(): Promise<any> {
    const response = await apiCall('/estatisticas-atleta');
    return response;
  },

  // Adicionar jogo
  async addGame(payload: any): Promise<any> {
    const response = await apiCall('/estatisticas-atleta', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return response;
  }
};
```

---

## 🌐 Contexto Global (AppContext)

### 📁 Localização
`src/context/AppContext.tsx`

### 🎯 Função
Gerencia o **estado global** da aplicação e fornece funções para interagir com a API.

### 🔑 Estrutura

```typescript
interface AppContextType {
  // Estado de Autenticação
  user: User | null;
  carregando: boolean;

  // Dados Globais
  jogadas: PlayDisplay[];
  dicas: TipDisplay[];
  estatisticasEquipas: TeamStatsDisplay[];
  estatisticasAtletas: AthleteStatsDisplay[];

  // Estados de Carregamento
  jogadasCarregando: boolean;
  dicasCarregando: boolean;
  estatisticasCarregando: boolean;

  // Ações
  login: (email: string, password: string) => Promise<User | null>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  
  // Atualizar Dados
  atualizarJogadas: () => Promise<void>;
  atualizarDicas: () => Promise<void>;
  atualizarEstatisticas: () => Promise<void>;
}
```

### 📝 Exemplo de Implementação

```typescript
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [jogadas, setJogadas] = useState<PlayDisplay[]>([]);
  const [dicas, setDicas] = useState<TipDisplay[]>([]);

  // FUNÇÃO DE LOGIN
  const login = async (email: string, password: string) => {
    console.log('🔐 Iniciando login para:', email);
    
    const loggedUser = await authAPI.login(email, password);
    
    if (!loggedUser || !loggedUser.id) {
      throw new Error('Erro no login - utilizador inválido');
    }
    
    // Atualiza estado global
    setUser(loggedUser);
    
    // Carrega dados do utilizador
    await refreshAllData();
    
    return loggedUser;
  };

  // FUNÇÃO DE REGISTO
  const register = async (userData: any) => {
    console.log('📝 Iniciando registo para:', userData.email);
    
    const newUser = await authAPI.register(userData);
    
    setUser(newUser);
    await refreshAllData();
  };

  // ATUALIZAR JOGADAS
  const atualizarJogadas = async () => {
    setJogadasCarregando(true);
    try {
      const data = await playsAPI.getAll();
      setJogadas(data);
    } catch (error) {
      console.error('❌ Erro a carregar jogadas:', error);
      setJogadas([]);
    } finally {
      setJogadasCarregando(false);
    }
  };

  // ATUALIZAR DICAS
  const atualizarDicas = async () => {
    setDicasCarregando(true);
    try {
      const data = await tipsAPI.getAll();
      setDicas(data);
    } catch (error) {
      console.error('❌ Erro a carregar dicas:', error);
      setDicas([]);
    } finally {
      setDicasCarregando(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        carregando,
        jogadas,
        dicas,
        login,
        register,
        logout,
        atualizarJogadas,
        atualizarDicas,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
```

---

## 🎨 Componentes React

### 📁 Exemplo: `Login.tsx`

```typescript
export function Login({ onBack }: LoginProps) {
  // 1️⃣ ACEDE AO CONTEXTO GLOBAL
  const { login, register, logout, user } = useApp();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2️⃣ FUNÇÃO DE LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      // 3️⃣ CHAMA A FUNÇÃO DO CONTEXTO
      const loggedUser = await login(loginEmail, loginPassword);

      // 4️⃣ VERIFICA SE ESTÁ VALIDADO
      if (loggedUser && !loggedUser.validado) {
        await logout();
        toast.error('Conta aguarda aprovação.');
        return;
      }

      toast.success('Login efetuado com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  // 5️⃣ RENDERIZA O FORMULÁRIO
  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        placeholder="E-mail"
      />
      <input
        type="password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'A entrar...' : 'Entrar'}
      </button>
    </form>
  );
}
```

---

## ⚙️ Controladores Laravel (Backend)

### 📁 Localização
`Api/app/Http/Controllers/Api/`

### 🔐 Exemplo: `UserController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * LOGIN
     */
    public function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        // 1️⃣ VALIDAÇÃO: Campos obrigatórios
        if (!$email || !$password) {
            return response()->json([
                'success' => false,
                'message' => 'Email e password são obrigatórios'
            ], 400);
        }

        // 2️⃣ BUSCA UTILIZADOR NA BD
        $user = User::where('email', $email)->first();

        // 3️⃣ VALIDAÇÃO: Credenciais inválidas
        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciais inválidas'
            ], 401);
        }

        // 4️⃣ VALIDAÇÃO: Conta não validada
        if (($user->tipo === 'treinador' || $user->tipo === 'atleta') 
            && !$user->validado) {
            return response()->json([
                'success' => false,
                'message' => 'Sua conta aguarda aprovação'
            ], 403);
        }

        // 5️⃣ SUCESSO: Gera token e retorna dados
        $token = $user->createToken('api_token')->plainTextToken;
        
        return response()->json([
            'success' => true,
            'user' => $user,
            'token' => $token
        ]);
    }

    /**
     * REGISTO
     */
    public function store(Request $request)
    {
        // 1️⃣ VALIDAÇÃO DOS DADOS
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'tipo' => 'required|in:atleta,treinador',
            'equipa' => 'required|string'
        ]);

        // 2️⃣ CRIAR UTILIZADOR
        $user = User::create([
            'nome' => $validated['nome'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'tipo' => $validated['tipo'],
            'validado' => false,
        ]);

        // 3️⃣ CRIAR PERFIL (Atleta ou Treinador)
        if ($validated['tipo'] === 'atleta') {
            \App\Models\Atleta::create([
                'user_id' => $user->id,
                'equipa_id' => $equipa->id,
                'posicao' => $request->input('posicao'),
                'numero' => $request->input('numero'),
            ]);
        }

        // 4️⃣ GERAR TOKEN
        $token = $user->createToken('api_token')->plainTextToken;

        // 5️⃣ RETORNAR RESPOSTA
        return response()->json([
            'success' => true,
            'message' => 'Utilizador criado com sucesso!',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    /**
     * OBTER TODOS OS UTILIZADORES
     */
    public function index()
    {
        $users = User::all();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }
}
```

### 🎮 Exemplo: `JogadaController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jogada;
use Illuminate\Http\Request;

class JogadaController extends Controller
{
    /**
     * OBTER TODAS AS JOGADAS
     */
    public function index()
    {
        $jogadas = Jogada::with(['user', 'equipa', 'comentarios'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $jogadas
        ]);
    }

    /**
     * CRIAR NOVA JOGADA
     */
    public function store(Request $request)
    {
        // 1️⃣ VALIDAÇÃO
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'equipa_id' => 'required|exists:equipas,id',
            'titulo' => 'required|string|max:255',
            'descricao' => 'required|string',
            'video' => 'nullable|file|mimes:mp4,mov,avi|max:51200'
        ]);

        // 2️⃣ UPLOAD DE VÍDEO (se existir)
        $videoPath = null;
        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')
                ->store('videos', 'public');
        }

        // 3️⃣ CRIAR JOGADA NA BD
        $jogada = Jogada::create([
            'user_id' => $validated['user_id'],
            'equipa_id' => $validated['equipa_id'],
            'titulo' => $validated['titulo'],
            'descricao' => $validated['descricao'],
            'ficheiro' => $videoPath,
        ]);

        // 4️⃣ RETORNAR RESPOSTA
        return response()->json([
            'success' => true,
            'message' => 'Jogada criada com sucesso!',
            'data' => $jogada
        ], 201);
    }

    /**
     * APAGAR JOGADA
     */
    public function destroy($id)
    {
        $jogada = Jogada::find($id);

        if (!$jogada) {
            return response()->json([
                'success' => false,
                'message' => 'Jogada não encontrada'
            ], 404);
        }

        // Verificar permissões (admin, autor, treinador)
        $user = auth()->user();
        if ($user->tipo !== 'admin' && $jogada->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Sem permissão para apagar'
            ], 403);
        }

        $jogada->delete();

        return response()->json([
            'success' => true,
            'message' => 'Jogada apagada com sucesso!'
        ]);
    }
}
```

---

## 🔄 Fluxo Completo de uma Requisição

### Exemplo: **Utilizador faz Login**

```
┌─────────────────────────────────────────────────────────────┐
│ 1️⃣ UTILIZADOR PREENCHE FORMULÁRIO                           │
│    - Email: user@example.com                                │
│    - Password: ********                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2️⃣ COMPONENTE Login.tsx                                     │
│    - handleLogin() é chamado                                │
│    - Valida campos                                          │
│    - Chama login() do AppContext                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3️⃣ APPCONTEXT                                               │
│    - login() chama authAPI.login()                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4️⃣ API.TS (authAPI)                                         │
│    - Envia POST para /api/login                             │
│    - Body: { email, password }                              │
│    - Headers: Content-Type: application/json                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP POST
                         │ http://localhost:8000/api/login
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5️⃣ LARAVEL ROUTES (api.php)                                 │
│    Route::post('/login', [UserController::class, 'login']); │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 6️⃣ USERCONTROLLER.PHP                                       │
│    - Valida email e password                                │
│    - Busca utilizador na BD                                 │
│    - Verifica se está validado                              │
│    - Gera token de autenticação                             │
│    - Retorna JSON com user e token                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Response (JSON)
                         │ { success: true, user: {...}, token: "..." }
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 7️⃣ API.TS (authAPI)                                         │
│    - Recebe resposta                                        │
│    - Guarda user no localStorage                            │
│    - Guarda token no localStorage                           │
│    - Retorna user para AppContext                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 8️⃣ APPCONTEXT                                               │
│    - Atualiza estado: setUser(loggedUser)                   │
│    - Carrega dados: refreshAllData()                        │
│      - atualizarJogadas()                                   │
│      - atualizarDicas()                                     │
│      - atualizarEstatisticas()                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 9️⃣ COMPONENTE Login.tsx                                     │
│    - Recebe confirmação de sucesso                          │
│    - Mostra toast: "Login efetuado com sucesso!"            │
│    - Redireciona para Dashboard                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 Exemplos Práticos

### Exemplo 1: **Carregar Lista de Jogadas**

#### Frontend (`PlaysSection.tsx`)
```typescript
import { useApp } from '../context/AppContext';

export function PlaysSection() {
  // 1️⃣ Acede ao contexto global
  const { jogadas, jogadasCarregando, atualizarJogadas } = useApp();

  // 2️⃣ Carrega jogadas ao montar componente
  useEffect(() => {
    atualizarJogadas();
  }, []);

  // 3️⃣ Renderiza lista
  return (
    <div>
      {jogadasCarregando ? (
        <p>A carregar...</p>
      ) : (
        jogadas.map(jogada => (
          <div key={jogada.id}>
            <h3>{jogada.titulo}</h3>
            <p>{jogada.descricao}</p>
            <video src={jogada.urlVideo} controls />
          </div>
        ))
      )}
    </div>
  );
}
```

#### Backend (`JogadaController.php`)
```php
public function index()
{
    $jogadas = Jogada::with(['user', 'equipa', 'comentarios'])
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json([
        'success' => true,
        'data' => $jogadas
    ]);
}
```

---

### Exemplo 2: **Criar Nova Dica**

#### Frontend (`TipsSection.tsx`)
```typescript
import { tipsAPI } from '../services/api';
import { useApp } from '../context/AppContext';

export function TipsSection() {
  const { user, atualizarDicas } = useApp();
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1️⃣ Cria dica via API
      await tipsAPI.create({
        titulo,
        conteudo,
        categoria: 'táctica',
        autorId: user?.id,
        autorNome: user?.nome,
        autorTipo: user?.tipo,
        equipa: user?.equipa
      });

      // 2️⃣ Atualiza lista de dicas
      await atualizarDicas();

      // 3️⃣ Limpa formulário
      setTitulo('');
      setConteudo('');

      toast.success('Dica criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar dica');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título"
      />
      <textarea
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
        placeholder="Conteúdo"
      />
      <button type="submit">Criar Dica</button>
    </form>
  );
}
```

#### Backend (`DicaController.php`)
```php
public function store(Request $request)
{
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'titulo' => 'required|string|max:255',
        'conteudo' => 'required|string',
        'categoria' => 'required|string'
    ]);

    $dica = Dica::create($validated);

    return response()->json([
        'success' => true,
        'message' => 'Dica criada com sucesso!',
        'data' => $dica
    ], 201);
}
```

---

### Exemplo 3: **Adicionar Estatísticas de Jogo**

#### Frontend (`AthleteStatsSection.tsx`)
```typescript
import { athleteStatsAPI } from '../services/api';

export function AthleteStatsSection() {
  const [golos, setGolos] = useState(0);
  const [assistencias, setAssistencias] = useState(0);

  const handleAddGame = async () => {
    try {
      await athleteStatsAPI.addGame({
        golos_marcados: golos,
        assistencias: assistencias,
        cartoes_amarelos: 0,
        cartoes_vermelhos: 0
      });

      toast.success('Jogo registado!');
      setGolos(0);
      setAssistencias(0);
    } catch (error) {
      toast.error('Erro ao registar jogo');
    }
  };

  return (
    <div>
      <input
        type="number"
        value={golos}
        onChange={(e) => setGolos(Number(e.target.value))}
        placeholder="Golos"
      />
      <input
        type="number"
        value={assistencias}
        onChange={(e) => setAssistencias(Number(e.target.value))}
        placeholder="Assistências"
      />
      <button onClick={handleAddGame}>Registar Jogo</button>
    </div>
  );
}
```

#### Backend (`EstatisticaAtletaController.php`)
```php
public function store(Request $request)
{
    $user = auth()->user();
    $atleta = $user->atleta;

    if (!$atleta) {
        return response()->json([
            'success' => false,
            'message' => 'Apenas atletas podem registar jogos'
        ], 403);
    }

    $validated = $request->validate([
        'golos_marcados' => 'required|integer|min:0',
        'assistencias' => 'required|integer|min:0',
        'cartoes_amarelos' => 'required|integer|min:0',
        'cartoes_vermelhos' => 'required|integer|min:0'
    ]);

    // Atualiza ou cria estatísticas
    $stats = EstatisticaAtleta::updateOrCreate(
        ['atleta_id' => $atleta->id],
        [
            'golos_marcados' => DB::raw('golos_marcados + ' . $validated['golos_marcados']),
            'assistencias' => DB::raw('assistencias + ' . $validated['assistencias']),
            'jogos' => DB::raw('jogos + 1')
        ]
    );

    return response()->json([
        'success' => true,
        'message' => 'Jogo registado com sucesso!',
        'data' => $stats
    ]);
}
```

---

## 🔐 Autenticação e Segurança

### 🔑 Sistema de Tokens

1. **Login bem-sucedido** → Laravel gera token
2. **Token guardado** no `localStorage` do browser
3. **Todas as requisições** incluem o token no header:
   ```
   Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
   ```
4. **Laravel valida** o token em cada requisição
5. **Token inválido/expirado** → Logout automático

### 🛡️ Proteção de Rotas

#### Frontend
```typescript
// App.tsx
{user ? (
  <Dashboard />
) : (
  <Login />
)}
```

#### Backend
```php
// api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/jogadas', [JogadaController::class, 'store']);
    Route::post('/dicas', [DicaController::class, 'store']);
    Route::get('/me', [UserController::class, 'profile']);
});
```

---

## 📊 Resumo da Comunicação

| **Camada**       | **Tecnologia**     | **Responsabilidade**                          |
|------------------|--------------------|-----------------------------------------------|
| **UI**           | React Components   | Renderizar interface e capturar inputs        |
| **Estado**       | AppContext         | Gerir estado global da aplicação              |
| **API Client**   | api.ts             | Fazer requisições HTTP ao backend             |
| **Rotas**        | Laravel Routes     | Mapear URLs para controladores                |
| **Lógica**       | Controllers        | Processar requisições e validar dados         |
| **Dados**        | Models/Database    | Persistir e recuperar dados                   |

---

## ✅ Boas Práticas

1. **Centralizar chamadas API** em `api.ts`
2. **Usar contexto global** para estado partilhado
3. **Validar dados** no frontend E backend
4. **Tratar erros** em todas as camadas
5. **Guardar token** de forma segura
6. **Usar HTTPS** em produção
7. **Implementar rate limiting** no backend
8. **Logs detalhados** para debugging

---

## 🎯 Conclusão

A interligação entre o layout (frontend React) e o backend (Laravel) acontece através de:

1. **Componentes React** → capturam inputs do utilizador
2. **AppContext** → gere estado global
3. **api.ts** → envia requisições HTTP
4. **Laravel Routes** → recebe requisições
5. **Controllers** → processa lógica
6. **Models** → acede à base de dados
7. **Resposta JSON** → retorna ao frontend
8. **UI atualizada** → mostra dados ao utilizador

Este fluxo garante uma **separação clara de responsabilidades**, **segurança** e **escalabilidade** da aplicação.
