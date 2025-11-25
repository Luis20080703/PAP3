# Rotas e Controllers - Referência Completa

## 📋 Estrutura de Rotas

### Visão Geral

```
/ (home)                    → Página inicial pública
/login                      → Login/Registo
/dashboard                  → Dashboard (autenticado)
/logout                     → Logout
```

---

## 🛣️ Ficheiro de Rotas Principal

**Ficheiro:** `routes/web.php`

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Livewire\Home\HomePage;
use App\Livewire\Auth\LoginForm;
use App\Livewire\Dashboard\DashboardLayout;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Rotas Públicas
Route::get('/', HomePage::class)->name('home');

// Rotas de Autenticação (Guest)
Route::middleware('guest')->group(function () {
    Route::get('/login', LoginForm::class)->name('login');
});

// Rotas Autenticadas
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', DashboardLayout::class)->name('dashboard');

    Route::post('/logout', function () {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        return redirect()->route('home');
    })->name('logout');
});

// Fallback para 404
Route::fallback(function () {
    return view('errors.404');
});
```

---

## 🔐 Middleware Personalizado

### CheckUserType Middleware

**Ficheiro:** `app/Http/Middleware/CheckUserType.php`

**Comando:** `php artisan make:middleware CheckUserType`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Enums\UserType;

class CheckUserType
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $type): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $userType = UserType::from($type);

        if (auth()->user()->type !== $userType) {
            abort(403, 'Não tens permissão para aceder a esta página.');
        }

        return $next($request);
    }
}
```

**Registar no:** `bootstrap/app.php` (Laravel 12)

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'user.type' => \App\Http\Middleware\CheckUserType::class,
    ]);
})
```

**Uso nas rotas:**

```php
Route::middleware(['auth', 'user.type:coach'])->group(function () {
    // Apenas treinadores
});
```

---

## 🎮 Controllers (Opcional)

Embora Livewire gerencie a maioria da lógica, podes criar controllers para operações específicas.

### PlayController

**Ficheiro:** `app/Http/Controllers/PlayController.php`

**Comando:** `php artisan make:controller PlayController`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Play;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PlayController extends Controller
{
    /**
     * Upload de vídeo para jogada
     */
    public function uploadVideo(Request $request)
    {
        $request->validate([
            'video' => 'required|mimes:mp4,mov,avi|max:102400', // 100MB
        ]);

        $path = $request->file('video')->store('plays/videos', 'public');

        return response()->json([
            'success' => true,
            'path' => Storage::url($path),
            'url' => asset('storage/' . $path),
        ]);
    }

    /**
     * Download de estatísticas em CSV
     */
    public function exportStats()
    {
        $plays = Play::with('author')->get();

        $csv = "ID,Título,Categoria,Equipa,Autor,Data\n";

        foreach ($plays as $play) {
            $csv .= "{$play->id},{$play->title},{$play->category},{$play->team},{$play->author->name},{$play->created_at}\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="jogadas.csv"');
    }
}
```

### TipController

**Ficheiro:** `app/Http/Controllers/TipController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Tip;
use Illuminate\Http\Request;

class TipController extends Controller
{
    /**
     * API para obter dicas (se necessário para integração externa)
     */
    public function index(Request $request)
    {
        $query = Tip::with('author');

        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        $tips = $query->recent()->paginate(20);

        return response()->json($tips);
    }

    /**
     * Exportar dica em PDF (requer biblioteca)
     */
    public function exportPdf(Tip $tip)
    {
        // Usar biblioteca como barryvdh/laravel-dompdf
        // $pdf = PDF::loadView('tips.pdf', compact('tip'));
        // return $pdf->download("dica-{$tip->id}.pdf");

        return view('tips.pdf', compact('tip'));
    }
}
```

---

## 🔗 Rotas API (Opcional)

Se precisares de uma API para mobile ou integrações:

**Ficheiro:** `routes/api.php`

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AuthController,
    PlayController,
    TipController,
    StatsController
};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Autenticação
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas protegidas (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Jogadas
    Route::apiResource('plays', PlayController::class);
    Route::post('/plays/{play}/comments', [PlayController::class, 'addComment']);

    // Dicas
    Route::apiResource('tips', TipController::class);

    // Estatísticas
    Route::get('/stats/teams', [StatsController::class, 'teams']);
    Route::get('/stats/athletes', [StatsController::class, 'athletes']);
});
```

### API AuthController

**Ficheiro:** `app/Http/Controllers/Api/AuthController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'type' => 'required|in:athlete,coach',
            'team' => 'required|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'type' => $request->type,
            'team' => $request->team,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais estão incorretas.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout efetuado com sucesso']);
    }
}
```

---

## 📱 Configuração Laravel Sanctum (para API)

### 1. Instalar Sanctum

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 2. Configurar em `config/sanctum.php`

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
))),

'middleware' => [
    'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
    'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
    'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
],
```

### 3. Adicionar HasApiTokens ao User Model

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    // ...
}
```

---

## 🗺️ Navegação com Livewire (SPA Style)

Como usas Livewire, a navegação é gerida pelos componentes. Exemplo:

```php
// No componente Livewire
public function goToPlay($playId)
{
    return redirect()->route('play.show', $playId);
}

// Ou usando wire:navigate (Livewire 3.x)
<a href="/dashboard" wire:navigate>Dashboard</a>
```

---

## 📄 Páginas de Erro Personalizadas

### 404 Not Found

**Ficheiro:** `resources/views/errors/404.blade.php`

```blade
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página não encontrada</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-50">
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-6xl mb-4">404</h1>
            <p class="text-xl text-gray-600 mb-8">Página não encontrada</p>
            <a href="{{ route('home') }}" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Voltar à página inicial
            </a>
        </div>
    </div>
</body>
</html>
```

### 403 Forbidden

**Ficheiro:** `resources/views/errors/403.blade.php`

```blade
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acesso negado</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-50">
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-6xl mb-4">403</h1>
            <p class="text-xl text-gray-600 mb-2">Acesso negado</p>
            <p class="text-gray-500 mb-8">Não tens permissão para aceder a esta página.</p>
            <a href="{{ route('dashboard') }}" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Voltar ao Dashboard
            </a>
        </div>
    </div>
</body>
</html>
```

---

## 🔒 Políticas de Autorização (Policies)

### PlayPolicy

**Ficheiro:** `app/Policies/PlayPolicy.php`

**Comando:** `php artisan make:policy PlayPolicy --model=Play`

```php
<?php

namespace App\Policies;

use App\Models\{Play, User};
use App\Enums\UserType;

class PlayPolicy
{
    /**
     * Determinar se o utilizador pode ver a jogada.
     */
    public function view(User $user, Play $play): bool
    {
        // Treinadores veem todas, atletas só da sua equipa
        return $user->isCoach() || $play->team === $user->team;
    }

    /**
     * Determinar se o utilizador pode criar jogadas.
     */
    public function create(User $user): bool
    {
        return $user->isCoach();
    }

    /**
     * Determinar se o utilizador pode atualizar a jogada.
     */
    public function update(User $user, Play $play): bool
    {
        return $user->isCoach() && $play->author_id === $user->id;
    }

    /**
     * Determinar se o utilizador pode eliminar a jogada.
     */
    public function delete(User $user, Play $play): bool
    {
        return $user->isCoach() && $play->author_id === $user->id;
    }
}
```

**Registar em:** `app/Providers/AuthServiceProvider.php`

```php
protected $policies = [
    Play::class => PlayPolicy::class,
];
```

**Uso nos componentes Livewire:**

```php
public function deletePlay($playId)
{
    $play = Play::findOrFail($playId);

    $this->authorize('delete', $play);

    $play->delete();
}
```

---

## 📋 Resumo de Comandos

```bash
# Criar middleware
php artisan make:middleware CheckUserType

# Criar controller
php artisan make:controller PlayController

# Criar policy
php artisan make:policy PlayPolicy --model=Play

# Listar todas as rotas
php artisan route:list

# Limpar cache de rotas
php artisan route:clear
```

---

## 🎯 Estrutura Final de Rotas

```
GET  /                    → HomePage (público)
GET  /login               → LoginForm (guest)
POST /logout              → Logout (auth)
GET  /dashboard           → DashboardLayout (auth)

API (opcional):
POST /api/register        → Registo
POST /api/login           → Login
GET  /api/plays           → Listar jogadas (auth)
POST /api/plays           → Criar jogada (auth, coach)
```

---

## ✅ Checklist

- [ ] Criar ficheiro `routes/web.php`
- [ ] Definir rotas públicas
- [ ] Definir rotas autenticadas
- [ ] Criar middleware CheckUserType
- [ ] Criar policies para autorização
- [ ] Criar páginas de erro personalizadas
- [ ] (Opcional) Configurar API com Sanctum
- [ ] Testar todas as rotas

---

## 🚀 Próximo Passo

Consulta **[BLADE_TEMPLATES.md](./BLADE_TEMPLATES.md)** para os layouts e templates base.
