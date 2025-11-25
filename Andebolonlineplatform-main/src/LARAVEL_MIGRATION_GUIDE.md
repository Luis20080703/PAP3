# Guia de Migração: React → Laravel 12 + Livewire 3.5

## 📋 Índice
1. [Estrutura do Projeto](#estrutura-do-projeto)
2. [Configuração Inicial](#configuração-inicial)
3. [Base de Dados](#base-de-dados)
4. [Autenticação](#autenticação)
5. [Componentes Livewire](#componentes-livewire)
6. [Implementação Passo-a-Passo](#implementação-passo-a-passo)

---

## 🏗️ Estrutura do Projeto

### Estrutura Laravel Recomendada

```
handball-platform/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginController.php
│   │   │   │   └── RegisterController.php
│   │   │   ├── PlayController.php
│   │   │   ├── TipController.php
│   │   │   └── StatsController.php
│   │   └── Middleware/
│   │       ├── CheckUserType.php
│   │       └── CoachOnly.php
│   ├── Livewire/
│   │   ├── Auth/
│   │   │   ├── LoginForm.php
│   │   │   └── RegisterForm.php
│   │   ├── Dashboard/
│   │   │   ├── DashboardLayout.php
│   │   │   └── Navigation.php
│   │   ├── Plays/
│   │   │   ├── PlaysList.php
│   │   ���   ├── PlayCard.php
│   │   │   ├── CreatePlay.php
│   │   │   ├── EditPlay.php
│   │   │   └── PlayComments.php
│   │   ├── Tips/
│   │   │   ├── TipsList.php
│   │   │   ├── CreateTip.php
│   │   │   └── EditTip.php
│   │   ├── Stats/
│   │   │   ├── TeamStats.php
│   │   │   └── AthleteStats.php
│   │   └── Home/
│   │       ├── HomePage.php
│   │       ├── AboutHandball.php
│   │       └── HandballRules.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Play.php
│   │   ├── Comment.php
│   │   ├── Tip.php
│   │   ├── TeamStats.php
│   │   └── AthleteStats.php
│   └── Enums/
│       ├── UserType.php
│       ├── Division.php
│       ├── Position.php
│       └── TipCategory.php
├── database/
│   ├── migrations/
│   │   ├── 2025_11_01_000001_create_users_table.php
│   │   ├── 2025_11_01_000002_create_plays_table.php
│   │   ├── 2025_11_01_000003_create_comments_table.php
│   │   ├── 2025_11_01_000004_create_tips_table.php
│   │   ├── 2025_11_01_000005_create_team_stats_table.php
│   │   └── 2025_11_01_000006_create_athlete_stats_table.php
│   ├── seeders/
│   │   ├── DatabaseSeeder.php
│   │   ├── UserSeeder.php
│   │   ├── PlaySeeder.php
│   │   ├── TipSeeder.php
│   │   └── StatsSeeder.php
│   └── factories/
│       ├── UserFactory.php
│       ├── PlayFactory.php
│       └── TipFactory.php
├── resources/
│   ├── views/
│   │   ├── layouts/
│   │   │   ├── app.blade.php
│   │   │   ├── guest.blade.php
│   │   │   └── dashboard.blade.php
│   │   ├── livewire/
│   │   │   └── [componentes Livewire]
│   │   ├── components/
│   │   │   ├── button.blade.php
│   │   │   ├── card.blade.php
│   │   │   └── input.blade.php
│   │   ├── home.blade.php
│   │   ├── login.blade.php
│   │   └── dashboard.blade.php
│   └── css/
│       └── app.css (Tailwind)
├── routes/
│   ├── web.php
│   └── auth.php
└── config/
    └── livewire.php
```

---

## ⚙️ Configuração Inicial

### 1. Criar Projeto Laravel 12

```bash
composer create-project laravel/laravel handball-platform
cd handball-platform
```

### 2. Instalar Livewire 3.5

```bash
composer require livewire/livewire:^3.5
```

### 3. Configurar Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**tailwind.config.js:**
```javascript
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./app/Livewire/**/*.php",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**resources/css/app.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Copiar estilos customizados do styles/globals.css do React */
```

### 4. Configurar Base de Dados

**.env:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=handball_platform
DB_USERNAME=root
DB_PASSWORD=
```

---

## 🗄️ Base de Dados

Ver ficheiro detalhado: **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)**

### Resumo das Tabelas

1. **users** - Utilizadores (atletas e treinadores)
2. **plays** - Jogadas de andebol
3. **comments** - Comentários nas jogadas
4. **tips** - Dicas técnicas
5. **team_stats** - Estatísticas de equipas
6. **athlete_stats** - Estatísticas de atletas

---

## 🔐 Autenticação

### Sistema de Autenticação Personalizado

Laravel vem com autenticação integrada, mas precisamos customizar para 2 tipos de utilizadores.

**app/Models/User.php:**
```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Enums\UserType;

class User extends Authenticatable
{
    protected $fillable = [
        'name',
        'email',
        'password',
        'type',
        'team',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'type' => UserType::class,
        'email_verified_at' => 'datetime',
    ];

    // Relações
    public function plays()
    {
        return $this->hasMany(Play::class, 'author_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'author_id');
    }

    public function tips()
    {
        return $this->hasMany(Tip::class, 'author_id');
    }

    // Helpers
    public function isCoach(): bool
    {
        return $this->type === UserType::COACH;
    }

    public function isAthlete(): bool
    {
        return $this->type === UserType::ATHLETE;
    }
}
```

**app/Enums/UserType.php:**
```php
<?php

namespace App\Enums;

enum UserType: string
{
    case ATHLETE = 'athlete';
    case COACH = 'coach';
}
```

---

## 🧩 Componentes Livewire

Ver ficheiro detalhado: **[LIVEWIRE_COMPONENTS.md](./LIVEWIRE_COMPONENTS.md)**

### Mapeamento React → Livewire

| Componente React | Componente Livewire | Ficheiro |
|-----------------|---------------------|----------|
| Home.tsx | HomePage.php | app/Livewire/Home/HomePage.php |
| Login.tsx | LoginForm.php | app/Livewire/Auth/LoginForm.php |
| Dashboard.tsx | DashboardLayout.php | app/Livewire/Dashboard/DashboardLayout.php |
| PlaysSection.tsx | PlaysList.php | app/Livewire/Plays/PlaysList.php |
| TipsSection.tsx | TipsList.php | app/Livewire/Tips/TipsList.php |
| TeamStatsSection.tsx | TeamStats.php | app/Livewire/Stats/TeamStats.php |
| AthleteStatsSection.tsx | AthleteStats.php | app/Livewire/Stats/AthleteStats.php |

---

## 📝 Implementação Passo-a-Passo

### Fase 1: Setup Base (Dia 1)

1. ✅ Criar projeto Laravel 12
2. ✅ Instalar Livewire 3.5
3. ✅ Configurar Tailwind CSS
4. ✅ Criar enums (UserType, Division, Position, TipCategory)
5. ✅ Criar migrations
6. ✅ Executar `php artisan migrate`

### Fase 2: Models e Relações (Dia 1-2)

1. ✅ Criar model User com relações
2. ✅ Criar model Play com relações
3. ✅ Criar model Comment
4. ✅ Criar model Tip
5. ✅ Criar models TeamStats e AthleteStats
6. ✅ Testar relações no Tinker

### Fase 3: Autenticação (Dia 2-3)

1. ✅ Criar LoginController
2. ✅ Criar RegisterController
3. ✅ Criar componente Livewire LoginForm
4. ✅ Criar componente Livewire RegisterForm
5. ✅ Configurar rotas de autenticação
6. ✅ Criar middleware CheckUserType

### Fase 4: Página Inicial (Dia 3-4)

1. ✅ Criar componente Livewire HomePage
2. ✅ Criar secções: Sobre Andebol, Regras, Curiosidades
3. ✅ Criar layout guest
4. ✅ Adicionar navegação

### Fase 5: Dashboard (Dia 4-6)

1. ✅ Criar DashboardLayout
2. ✅ Criar navegação com tabs
3. ✅ Implementar lógica de permissões (atleta vs treinador)

### Fase 6: Jogadas (Dia 6-8)

1. ✅ Criar PlaysList (listagem)
2. ✅ Criar CreatePlay (formulário - só treinadores)
3. ✅ Criar EditPlay (edição - só treinadores)
4. ✅ Criar PlayComments (comentários)
5. ✅ Implementar upload de vídeos
6. ✅ Adicionar filtros e pesquisa

### Fase 7: Dicas Técnicas (Dia 8-9)

1. ✅ Criar TipsList
2. ✅ Criar CreateTip
3. ✅ Criar EditTip
4. ✅ Implementar filtros por categoria
5. ✅ Adicionar editor de markdown

### Fase 8: Estatísticas (Dia 9-11)

1. ✅ Criar TeamStats (estatísticas de equipas)
2. ✅ Criar AthleteStats (estatísticas de atletas)
3. ✅ Implementar filtros por escalão
4. ✅ Adicionar gráficos (Chart.js ou similar)
5. ✅ Implementar permissões (atletas só veem sua equipa)

### Fase 9: Seeders e Dados de Teste (Dia 11-12)

1. ✅ Criar PlaySeeder com dados do mockData.ts
2. ✅ Criar TipSeeder
3. ✅ Criar StatsSeeder
4. ✅ Executar seeders

### Fase 10: Refinamento e Testes (Dia 12-14)

1. ✅ Testar todos os fluxos
2. ✅ Corrigir bugs
3. ✅ Adicionar validações
4. ✅ Melhorar UX
5. ✅ Optimizar queries (eager loading)

---

## 📚 Ficheiros de Referência

1. **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Schema completo da base de dados
2. **[LIVEWIRE_COMPONENTS.md](./LIVEWIRE_COMPONENTS.md)** - Todos os componentes Livewire
3. **[MODELS_REFERENCE.md](./MODELS_REFERENCE.md)** - Definição completa dos Models
4. **[ROUTES_REFERENCE.md](./ROUTES_REFERENCE.md)** - Todas as rotas da aplicação
5. **[BLADE_TEMPLATES.md](./BLADE_TEMPLATES.md)** - Templates Blade principais

---

## 🚀 Comandos Úteis

```bash
# Criar migration
php artisan make:migration create_plays_table

# Criar model com migration
php artisan make:model Play -m

# Criar componente Livewire
php artisan make:livewire Plays/PlaysList

# Executar migrations
php artisan migrate

# Executar seeders
php artisan db:seed

# Limpar cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Servidor de desenvolvimento
php artisan serve
```

---

## 📝 Notas Importantes

### Diferenças React vs Livewire

| Aspecto | React | Livewire |
|---------|-------|----------|
| Estado | useState hook | Propriedades públicas |
| Efeitos | useEffect | Lifecycle hooks (mount, updated) |
| Eventos | onClick, onChange | wire:click, wire:model |
| Validação | Manual/bibliotecas | Integrado no Laravel |
| Roteamento | Cliente (react-router) | Servidor (Laravel routes) |
| API Calls | fetch/axios | Métodos do componente |

### Vantagens do Livewire

✅ SEO melhor (renderização servidor)
✅ Segurança integrada (CSRF, validação)
✅ Menos código JavaScript
✅ Integração natural com Laravel
✅ Validação automática de formulários

### Desvantagens do Livewire

❌ Requer conexão ao servidor
❌ Latência em interações
❌ Menos controlo sobre frontend
❌ Curva de aprendizagem se não conheces Laravel

---

## 🎯 Próximos Passos

1. Ler **DATABASE_SCHEMA.md** para entender a estrutura
2. Criar as migrations seguindo o schema
3. Implementar os models com relações
4. Seguir a ordem da implementação passo-a-passo
5. Consultar **LIVEWIRE_COMPONENTS.md** ao criar cada componente

---

## 💡 Suporte

Para dúvidas sobre:
- **Laravel**: https://laravel.com/docs/12.x
- **Livewire**: https://livewire.laravel.com/docs/3.x
- **Tailwind**: https://tailwindcss.com/docs

Boa sorte com o teu projeto PAP! 🎉
