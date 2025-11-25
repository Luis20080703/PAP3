# Componentes Livewire - Guia Completo

## 📋 Índice de Componentes

### Autenticação
1. [LoginForm](#1-loginform) - Formulário de login
2. [RegisterForm](#2-registerform) - Formulário de registo

### Dashboard
3. [DashboardLayout](#3-dashboardlayout) - Layout principal do dashboard

### Página Inicial
4. [HomePage](#4-homepage) - Página inicial pública

### Jogadas
5. [PlaysList](#5-playslist) - Listagem de jogadas
6. [CreatePlay](#6-createplay) - Criar nova jogada
7. [EditPlay](#7-editplay) - Editar jogada
8. [PlayComments](#8-playcomments) - Comentários de uma jogada

### Dicas
9. [TipsList](#9-tipslist) - Listagem de dicas
10. [CreateTip](#10-createtip) - Criar nova dica
11. [EditTip](#11-edittip) - Editar dica

### Estatísticas
12. [TeamStats](#12-teamstats) - Estatísticas de equipas
13. [AthleteStats](#13-athletestats) - Estatísticas de atletas

---

## 1. LoginForm

**Ficheiro:** `app/Livewire/Auth/LoginForm.php`

**Comando:** `php artisan make:livewire Auth/LoginForm`

```php
<?php

namespace App\Livewire\Auth;

use Livewire\Component;
use Illuminate\Support\Facades\Auth;

class LoginForm extends Component
{
    public string $email = '';
    public string $password = '';
    public bool $showRegister = false;

    protected $rules = [
        'email' => 'required|email',
        'password' => 'required|min:6',
    ];

    protected $messages = [
        'email.required' => 'O email é obrigatório',
        'email.email' => 'Insira um email válido',
        'password.required' => 'A password é obrigatória',
        'password.min' => 'A password deve ter pelo menos 6 caracteres',
    ];

    public function login()
    {
        $this->validate();

        if (Auth::attempt(['email' => $this->email, 'password' => $this->password])) {
            session()->regenerate();
            return redirect()->route('dashboard');
        }

        $this->addError('email', 'Credenciais inválidas');
    }

    public function toggleRegister()
    {
        $this->showRegister = !$this->showRegister;
    }

    public function render()
    {
        return view('livewire.auth.login-form');
    }
}
```

**View:** `resources/views/livewire/auth/login-form.blade.php`

```blade
<div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        @if (!$showRegister)
            {{-- Formulário de Login --}}
            <div>
                <h2 class="text-center mb-6">Entrar na Plataforma</h2>
                
                <form wire:submit.prevent="login" class="space-y-4">
                    <div>
                        <label for="email" class="block mb-2">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            wire:model="email"
                            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="seu@email.com"
                        />
                        @error('email') 
                            <span class="text-red-500 text-sm">{{ $message }}</span> 
                        @enderror
                    </div>

                    <div>
                        <label for="password" class="block mb-2">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            wire:model="password"
                            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                        @error('password') 
                            <span class="text-red-500 text-sm">{{ $message }}</span> 
                        @enderror
                    </div>

                    <button 
                        type="submit" 
                        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Entrar
                    </button>
                </form>

                <div class="mt-4 text-center">
                    <button 
                        wire:click="toggleRegister" 
                        class="text-blue-600 hover:underline"
                    >
                        Não tens conta? Regista-te
                    </button>
                </div>
            </div>
        @else
            {{-- Componente de Registo --}}
            <livewire:auth.register-form />
            
            <div class="mt-4 text-center">
                <button 
                    wire:click="toggleRegister" 
                    class="text-blue-600 hover:underline"
                >
                    Já tens conta? Entra
                </button>
            </div>
        @endif

        <a href="{{ route('home') }}" class="block text-center mt-4 text-gray-600 hover:underline">
            Voltar à página inicial
        </a>
    </div>
</div>
```

---

## 2. RegisterForm

**Ficheiro:** `app/Livewire/Auth/RegisterForm.php`

```php
<?php

namespace App\Livewire\Auth;

use Livewire\Component;
use App\Models\User;
use App\Enums\UserType;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class RegisterForm extends Component
{
    public string $name = '';
    public string $email = '';
    public string $password = '';
    public string $password_confirmation = '';
    public string $type = 'athlete';
    public string $team = '';

    protected $rules = [
        'name' => 'required|min:3',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|min:6|confirmed',
        'type' => 'required|in:athlete,coach',
        'team' => 'required|min:3',
    ];

    protected $messages = [
        'name.required' => 'O nome é obrigatório',
        'email.required' => 'O email é obrigatório',
        'email.unique' => 'Este email já está registado',
        'password.required' => 'A password é obrigatória',
        'password.confirmed' => 'As passwords não coincidem',
        'team.required' => 'A equipa é obrigatória',
    ];

    public function register()
    {
        $validated = $this->validate();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'type' => UserType::from($validated['type']),
            'team' => $validated['team'],
        ]);

        Auth::login($user);
        session()->regenerate();

        return redirect()->route('dashboard');
    }

    public function render()
    {
        return view('livewire.auth.register-form');
    }
}
```

**View:** `resources/views/livewire/auth/register-form.blade.php`

```blade
<div>
    <h2 class="text-center mb-6">Criar Conta</h2>
    
    <form wire:submit.prevent="register" class="space-y-4">
        <div>
            <label for="name" class="block mb-2">Nome Completo</label>
            <input 
                type="text" 
                id="name" 
                wire:model="name"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="João Silva"
            />
            @error('name') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <div>
            <label for="email" class="block mb-2">Email</label>
            <input 
                type="email" 
                id="email" 
                wire:model="email"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="joao@exemplo.pt"
            />
            @error('email') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <div>
            <label for="password" class="block mb-2">Password</label>
            <input 
                type="password" 
                id="password" 
                wire:model="password"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            @error('password') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <div>
            <label for="password_confirmation" class="block mb-2">Confirmar Password</label>
            <input 
                type="password" 
                id="password_confirmation" 
                wire:model="password_confirmation"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div>
            <label class="block mb-2">Tipo de Utilizador</label>
            <div class="space-y-2">
                <label class="flex items-center">
                    <input 
                        type="radio" 
                        wire:model="type" 
                        value="athlete" 
                        class="mr-2"
                    />
                    Atleta
                </label>
                <label class="flex items-center">
                    <input 
                        type="radio" 
                        wire:model="type" 
                        value="coach" 
                        class="mr-2"
                    />
                    Treinador
                </label>
            </div>
            @error('type') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <div>
            <label for="team" class="block mb-2">Equipa</label>
            <input 
                type="text" 
                id="team" 
                wire:model="team"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="FC Porto"
            />
            @error('team') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <button 
            type="submit" 
            class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
            Registar
        </button>
    </form>
</div>
```

---

## 3. DashboardLayout

**Ficheiro:** `app/Livewire/Dashboard/DashboardLayout.php`

```php
<?php

namespace App\Livewire\Dashboard;

use Livewire\Component;
use Illuminate\Support\Facades\Auth;

class DashboardLayout extends Component
{
    public string $activeTab = 'plays';

    public function setTab(string $tab)
    {
        $this->activeTab = $tab;
    }

    public function logout()
    {
        Auth::logout();
        session()->invalidate();
        session()->regenerateToken();
        return redirect()->route('home');
    }

    public function render()
    {
        $user = Auth::user();
        
        return view('livewire.dashboard.dashboard-layout', [
            'user' => $user,
        ]);
    }
}
```

**View:** `resources/views/livewire/dashboard/dashboard-layout.blade.php`

```blade
<div class="min-h-screen bg-gray-50">
    {{-- Header --}}
    <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1>🤾 Plataforma Andebol</h1>
            
            <div class="flex items-center gap-4">
                <div class="text-right">
                    <div>{{ $user->name }}</div>
                    <div class="text-sm text-gray-600">
                        {{ $user->type->value === 'coach' ? 'Treinador' : 'Atleta' }} - {{ $user->team }}
                    </div>
                </div>
                
                <button 
                    wire:click="logout" 
                    class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Sair
                </button>
            </div>
        </div>
    </header>

    {{-- Navegação por Tabs --}}
    <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4">
            <nav class="flex gap-4">
                <button 
                    wire:click="setTab('plays')"
                    class="px-4 py-3 {{ $activeTab === 'plays' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600' }}"
                >
                    Jogadas
                </button>
                
                <button 
                    wire:click="setTab('tips')"
                    class="px-4 py-3 {{ $activeTab === 'tips' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600' }}"
                >
                    Dicas Técnicas
                </button>
                
                <button 
                    wire:click="setTab('team-stats')"
                    class="px-4 py-3 {{ $activeTab === 'team-stats' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600' }}"
                >
                    Estatísticas Equipas
                </button>
                
                <button 
                    wire:click="setTab('athlete-stats')"
                    class="px-4 py-3 {{ $activeTab === 'athlete-stats' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600' }}"
                >
                    Estatísticas Atletas
                </button>
            </nav>
        </div>
    </div>

    {{-- Conteúdo Principal --}}
    <main class="max-w-7xl mx-auto px-4 py-8">
        @if ($activeTab === 'plays')
            <livewire:plays.plays-list />
        @elseif ($activeTab === 'tips')
            <livewire:tips.tips-list />
        @elseif ($activeTab === 'team-stats')
            <livewire:stats.team-stats />
        @elseif ($activeTab === 'athlete-stats')
            <livewire:stats.athlete-stats />
        @endif
    </main>
</div>
```

---

## 4. HomePage

**Ficheiro:** `app/Livewire/Home/HomePage.php`

```php
<?php

namespace App\Livewire\Home;

use Livewire\Component;

class HomePage extends Component
{
    public string $activeSection = 'about';

    public function setSection(string $section)
    {
        $this->activeSection = $section;
    }

    public function render()
    {
        return view('livewire.home.home-page');
    }
}
```

**View:** `resources/views/livewire/home/home-page.blade.php`

```blade
<div class="min-h-screen bg-gray-50">
    {{-- Hero Section --}}
    <header class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <h1 class="mb-4">🤾 Plataforma de Andebol</h1>
            <p class="text-xl mb-8">
                A plataforma completa para atletas e treinadores de andebol em Portugal
            </p>
            
            <a 
                href="{{ route('login') }}" 
                class="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition"
            >
                Entrar na Plataforma
            </a>
        </div>
    </header>

    {{-- Navigation Tabs --}}
    <div class="bg-white border-b sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4">
            <nav class="flex gap-4">
                <button 
                    wire:click="setSection('about')"
                    class="px-4 py-3 {{ $activeSection === 'about' ? 'border-b-2 border-blue-600' : '' }}"
                >
                    Sobre o Andebol
                </button>
                
                <button 
                    wire:click="setSection('rules')"
                    class="px-4 py-3 {{ $activeSection === 'rules' ? 'border-b-2 border-blue-600' : '' }}"
                >
                    Regras
                </button>
                
                <button 
                    wire:click="setSection('curiosities')"
                    class="px-4 py-3 {{ $activeSection === 'curiosities' ? 'border-b-2 border-blue-600' : '' }}"
                >
                    Curiosidades
                </button>
            </nav>
        </div>
    </div>

    {{-- Content --}}
    <main class="max-w-7xl mx-auto px-4 py-8">
        @if ($activeSection === 'about')
            <div class="prose max-w-none">
                <h2>História do Andebol</h2>
                <p>
                    O andebol é um desporto coletivo que surgiu no final do século XIX...
                    [Adicionar conteúdo sobre história]
                </p>
            </div>
        @elseif ($activeSection === 'rules')
            <div class="prose max-w-none">
                <h2>Regras Básicas</h2>
                <ul>
                    <li>Campo de jogo: 40m x 20m</li>
                    <li>Duas equipas de 7 jogadores (6 + guarda-redes)</li>
                    <li>Duração: 2 partes de 30 minutos</li>
                    [Adicionar mais regras]
                </ul>
            </div>
        @elseif ($activeSection === 'curiosities')
            <div class="prose max-w-none">
                <h2>Curiosidades</h2>
                <p>
                    Sabia que o andebol é um dos desportos olímpicos mais populares...
                    [Adicionar curiosidades]
                </p>
            </div>
        @endif
    </main>
</div>
```

---

## 5. PlaysList

**Ficheiro:** `app/Livewire/Plays/PlaysList.php`

```php
<?php

namespace App\Livewire\Plays;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\Play;
use Illuminate\Support\Facades\Auth;

class PlaysList extends Component
{
    use WithPagination;

    public string $search = '';
    public string $categoryFilter = 'all';
    public bool $showCreateModal = false;
    public ?int $selectedPlayId = null;

    protected $queryString = ['search', 'categoryFilter'];

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function openCreateModal()
    {
        if (!Auth::user()->isCoach()) {
            session()->flash('error', 'Apenas treinadores podem criar jogadas');
            return;
        }
        
        $this->showCreateModal = true;
    }

    public function deletePlay($playId)
    {
        $play = Play::findOrFail($playId);
        
        if (!Auth::user()->isCoach() || $play->author_id !== Auth::id()) {
            session()->flash('error', 'Não tens permissão para eliminar esta jogada');
            return;
        }
        
        $play->delete();
        session()->flash('message', 'Jogada eliminada com sucesso');
    }

    public function render()
    {
        $query = Play::with(['author', 'comments'])
            ->when($this->search, function ($q) {
                $q->where('title', 'like', '%' . $this->search . '%')
                  ->orWhere('description', 'like', '%' . $this->search . '%');
            })
            ->when($this->categoryFilter !== 'all', function ($q) {
                $q->where('category', $this->categoryFilter);
            });

        // Se for atleta, mostrar apenas jogadas da sua equipa
        if (Auth::user()->isAthlete()) {
            $query->where('team', Auth::user()->team);
        }

        $plays = $query->orderBy('created_at', 'desc')->paginate(10);

        return view('livewire.plays.plays-list', [
            'plays' => $plays,
            'canCreate' => Auth::user()->isCoach(),
        ]);
    }
}
```

**View:** `resources/views/livewire/plays/plays-list.blade.php`

```blade
<div>
    <div class="flex items-center justify-between mb-6">
        <h2>Jogadas de Andebol</h2>
        
        @if ($canCreate)
            <button 
                wire:click="openCreateModal" 
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Nova Jogada
            </button>
        @endif
    </div>

    {{-- Filtros --}}
    <div class="mb-6 flex gap-4">
        <input 
            type="text" 
            wire:model.live="search" 
            placeholder="Pesquisar jogadas..."
            class="flex-1 px-4 py-2 border rounded-lg"
        />
        
        <select wire:model.live="categoryFilter" class="px-4 py-2 border rounded-lg">
            <option value="all">Todas as categorias</option>
            <option value="Contra-ataque">Contra-ataque</option>
            <option value="Ataque posicional">Ataque posicional</option>
            <option value="Técnica individual">Técnica individual</option>
        </select>
    </div>

    {{-- Lista de Jogadas --}}
    <div class="space-y-6">
        @forelse ($plays as $play)
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h3 class="mb-2">{{ $play->title }}</h3>
                        <p class="text-gray-600">{{ $play->description }}</p>
                        
                        <div class="flex gap-4 mt-2 text-sm text-gray-500">
                            <span>📌 {{ $play->category }}</span>
                            <span>🏆 {{ $play->team }}</span>
                            <span>👤 {{ $play->author->name }}</span>
                            <span>📅 {{ $play->created_at->diffForHumans() }}</span>
                        </div>
                    </div>
                    
                    @if ($canCreate && $play->author_id === Auth::id())
                        <button 
                            wire:click="deletePlay({{ $play->id }})" 
                            wire:confirm="Tens a certeza que queres eliminar esta jogada?"
                            class="text-red-500 hover:text-red-700"
                        >
                            Eliminar
                        </button>
                    @endif
                </div>

                {{-- Vídeo --}}
                <div class="mb-4 bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                    <span class="text-gray-500">Vídeo: {{ $play->video_url }}</span>
                </div>

                {{-- Comentários --}}
                <livewire:plays.play-comments :playId="$play->id" :key="$play->id" />
            </div>
        @empty
            <div class="text-center py-12 text-gray-500">
                Nenhuma jogada encontrada
            </div>
        @endforelse
    </div>

    {{-- Paginação --}}
    <div class="mt-6">
        {{ $plays->links() }}
    </div>

    {{-- Modal Criar Jogada --}}
    @if ($showCreateModal)
        <livewire:plays.create-play @play-created="$refresh; $set('showCreateModal', false)" />
    @endif
</div>
```

---

## Resumo dos Componentes Restantes

Por questões de espaço, os componentes seguintes seguem estrutura similar:

### 6-8. Componentes de Jogadas
- **CreatePlay**: Modal com formulário (título, descrição, vídeo, categoria)
- **EditPlay**: Similar ao CreatePlay mas para edição
- **PlayComments**: Lista de comentários + formulário para adicionar

### 9-11. Componentes de Dicas
- **TipsList**: Listagem com filtros por categoria
- **CreateTip**: Formulário com editor markdown
- **EditTip**: Edição de dicas existentes

### 12-13. Componentes de Estatísticas
- **TeamStats**: Tabela com estatísticas de equipas, filtro por escalão
- **AthleteStats**: Top marcadores, assistências, etc. Filtros por equipa/escalão

---

## 📝 Comandos para Criar Todos os Componentes

```bash
# Autenticação
php artisan make:livewire Auth/LoginForm
php artisan make:livewire Auth/RegisterForm

# Dashboard
php artisan make:livewire Dashboard/DashboardLayout

# Home
php artisan make:livewire Home/HomePage

# Jogadas
php artisan make:livewire Plays/PlaysList
php artisan make:livewire Plays/CreatePlay
php artisan make:livewire Plays/EditPlay
php artisan make:livewire Plays/PlayComments

# Dicas
php artisan make:livewire Tips/TipsList
php artisan make:livewire Tips/CreateTip
php artisan make:livewire Tips/EditTip

# Estatísticas
php artisan make:livewire Stats/TeamStats
php artisan make:livewire Stats/AthleteStats
```

---

## 🎯 Próximos Passos

1. Criar todos os componentes Livewire com os comandos acima
2. Implementar as views Blade correspondentes
3. Testar cada componente individualmente
4. Integrar no DashboardLayout
5. Adicionar validações e feedback de utilizador

Para ver os Models completos, consulta **[MODELS_REFERENCE.md](./MODELS_REFERENCE.md)**.
