# Schema da Base de Dados - Plataforma Andebol

## 📊 Diagrama de Relações

```
users (1) ────< (N) plays
  │                   │
  │                   │
  │                   └──< (N) comments
  │
  └────< (N) tips

team_stats (independente)
athlete_stats (independente)
```

---

## 📋 Tabelas

### 1. users

Armazena utilizadores (atletas e treinadores)

**Migration: `2025_11_01_000001_create_users_table.php`**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('type', ['athlete', 'coach']);
            $table->string('team')->nullable();
            $table->rememberToken();
            $table->timestamps();
            
            // Índices
            $table->index('type');
            $table->index('team');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

**Colunas:**
- `id` - Chave primária
- `name` - Nome completo
- `email` - Email único
- `password` - Password hash
- `type` - Tipo: 'athlete' ou 'coach'
- `team` - Nome da equipa (nullable)
- `timestamps` - created_at, updated_at

---

### 2. plays

Armazena jogadas de andebol

**Migration: `2025_11_01_000002_create_plays_table.php`**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plays', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('video_url');
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->string('team');
            $table->string('category');
            $table->timestamps();
            
            // Índices
            $table->index('author_id');
            $table->index('team');
            $table->index('category');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plays');
    }
};
```

**Colunas:**
- `id` - Chave primária
- `title` - Título da jogada
- `description` - Descrição detalhada
- `video_url` - URL do vídeo
- `author_id` - FK para users (quem criou)
- `team` - Nome da equipa
- `category` - Categoria (ex: "Contra-ataque", "Ataque posicional")
- `timestamps` - created_at, updated_at

**Relações:**
- Pertence a um User (author)
- Tem muitos Comments

---

### 3. comments

Comentários nas jogadas

**Migration: `2025_11_01_000003_create_comments_table.php`**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('play_id')->constrained('plays')->onDelete('cascade');
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->text('content');
            $table->timestamps();
            
            // Índices
            $table->index('play_id');
            $table->index('author_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
```

**Colunas:**
- `id` - Chave primária
- `play_id` - FK para plays
- `author_id` - FK para users
- `content` - Conteúdo do comentário
- `timestamps` - created_at, updated_at

**Relações:**
- Pertence a um Play
- Pertence a um User (author)

---

### 4. tips

Dicas técnicas de andebol

**Migration: `2025_11_01_000004_create_tips_table.php`**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tips', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->enum('category', ['finta', 'drible', 'remate', 'defesa', 'táctica']);
            $table->longText('content'); // Suporta markdown
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            // Índices
            $table->index('category');
            $table->index('author_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tips');
    }
};
```

**Colunas:**
- `id` - Chave primária
- `title` - Título da dica
- `description` - Descrição curta
- `category` - Categoria: 'finta', 'drible', 'remate', 'defesa', 'táctica'
- `content` - Conteúdo completo (markdown)
- `author_id` - FK para users
- `timestamps` - created_at, updated_at

**Relações:**
- Pertence a um User (author)

---

### 5. team_stats

Estatísticas de equipas por escalão

**Migration: `2025_11_01_000005_create_team_stats_table.php`**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_stats', function (Blueprint $table) {
            $table->id();
            $table->string('team_name');
            $table->enum('division', ['seniores', 'sub-20', 'sub-18', 'sub-16', 'sub-14']);
            $table->integer('goals_scored')->default(0);
            $table->integer('goals_conceded')->default(0);
            $table->integer('matches_played')->default(0);
            $table->integer('wins')->default(0);
            $table->integer('draws')->default(0);
            $table->integer('losses')->default(0);
            $table->timestamps();
            
            // Índices
            $table->index('team_name');
            $table->index('division');
            $table->unique(['team_name', 'division']); // Uma entrada por equipa/escalão
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_stats');
    }
};
```

**Colunas:**
- `id` - Chave primária
- `team_name` - Nome da equipa
- `division` - Escalão: 'seniores', 'sub-20', 'sub-18', 'sub-16', 'sub-14'
- `goals_scored` - Golos marcados
- `goals_conceded` - Golos sofridos
- `matches_played` - Jogos disputados
- `wins` - Vitórias
- `draws` - Empates
- `losses` - Derrotas
- `timestamps` - created_at, updated_at

---

### 6. athlete_stats

Estatísticas individuais de atletas

**Migration: `2025_11_01_000006_create_athlete_stats_table.php`**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('athlete_stats', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('team');
            $table->enum('position', ['pivot', 'ponta', 'lateral', 'central', 'guarda-redes']);
            $table->enum('division', ['seniores', 'sub-20', 'sub-18', 'sub-16', 'sub-14']);
            $table->integer('goals_scored')->default(0);
            $table->integer('matches_played')->default(0);
            $table->integer('assists')->default(0);
            $table->integer('yellow_cards')->default(0);
            $table->integer('red_cards')->default(0);
            $table->timestamps();
            
            // Índices
            $table->index('name');
            $table->index('team');
            $table->index('division');
            $table->index('position');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('athlete_stats');
    }
};
```

**Colunas:**
- `id` - Chave primária
- `name` - Nome do atleta
- `team` - Equipa
- `position` - Posição: 'pivot', 'ponta', 'lateral', 'central', 'guarda-redes'
- `division` - Escalão
- `goals_scored` - Golos marcados
- `matches_played` - Jogos disputados
- `assists` - Assistências
- `yellow_cards` - Cartões amarelos
- `red_cards` - Cartões vermelhos
- `timestamps` - created_at, updated_at

---

## 🔗 Relações entre Tabelas

### User
```php
// Um utilizador tem muitas jogadas
public function plays()
{
    return $this->hasMany(Play::class, 'author_id');
}

// Um utilizador tem muitos comentários
public function comments()
{
    return $this->hasMany(Comment::class, 'author_id');
}

// Um utilizador tem muitas dicas
public function tips()
{
    return $this->hasMany(Tip::class, 'author_id');
}
```

### Play
```php
// Uma jogada pertence a um utilizador (autor)
public function author()
{
    return $this->belongsTo(User::class, 'author_id');
}

// Uma jogada tem muitos comentários
public function comments()
{
    return $this->hasMany(Comment::class)->orderBy('created_at', 'desc');
}
```

### Comment
```php
// Um comentário pertence a uma jogada
public function play()
{
    return $this->belongsTo(Play::class);
}

// Um comentário pertence a um utilizador (autor)
public function author()
{
    return $this->belongsTo(User::class, 'author_id');
}
```

### Tip
```php
// Uma dica pertence a um utilizador (autor)
public function author()
{
    return $this->belongsTo(User::class, 'author_id');
}
```

---

## 📊 Dados de Exemplo (Seeders)

### UserSeeder

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Enums\UserType;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Treinadores
        User::create([
            'name' => 'Carlos Mendes',
            'email' => 'carlos.mendes@exemplo.pt',
            'password' => Hash::make('password'),
            'type' => UserType::COACH,
            'team' => 'FC Porto',
        ]);

        User::create([
            'name' => 'Pedro Costa',
            'email' => 'pedro.costa@exemplo.pt',
            'password' => Hash::make('password'),
            'type' => UserType::COACH,
            'team' => 'Benfica',
        ]);

        // Atletas
        User::create([
            'name' => 'João Silva',
            'email' => 'joao.silva@exemplo.pt',
            'password' => Hash::make('password'),
            'type' => UserType::ATHLETE,
            'team' => 'FC Porto',
        ]);

        User::create([
            'name' => 'Miguel Santos',
            'email' => 'miguel.santos@exemplo.pt',
            'password' => Hash::make('password'),
            'type' => UserType::ATHLETE,
            'team' => 'Sporting',
        ]);
    }
}
```

---

## 🔍 Queries Úteis

### Obter todas as jogadas com autor e comentários
```php
$plays = Play::with(['author', 'comments.author'])
    ->orderBy('created_at', 'desc')
    ->get();
```

### Obter jogadas de uma equipa específica
```php
$plays = Play::where('team', 'FC Porto')
    ->with('author')
    ->get();
```

### Obter estatísticas de uma equipa por escalão
```php
$stats = TeamStats::where('team_name', 'FC Porto')
    ->where('division', 'seniores')
    ->first();
```

### Obter top 10 marcadores de um escalão
```php
$topScorers = AthleteStats::where('division', 'seniores')
    ->orderBy('goals_scored', 'desc')
    ->take(10)
    ->get();
```

### Obter dicas por categoria
```php
$tips = Tip::where('category', 'finta')
    ->with('author')
    ->orderBy('created_at', 'desc')
    ->get();
```

---

## 📝 Notas de Implementação

1. **Soft Deletes**: Considera adicionar soft deletes para jogadas e dicas
```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Play extends Model
{
    use SoftDeletes;
}
```

2. **Timestamps**: Todas as tabelas usam timestamps do Laravel
3. **Foreign Keys**: Todas as FK têm `onDelete('cascade')`
4. **Índices**: Adicionados em colunas frequentemente consultadas
5. **Enums**: Usar Enums PHP 8.1+ para type safety

---

## ✅ Checklist de Implementação

- [ ] Criar todas as migrations
- [ ] Executar `php artisan migrate`
- [ ] Criar todos os models
- [ ] Definir relações nos models
- [ ] Criar seeders com dados de teste
- [ ] Executar `php artisan db:seed`
- [ ] Testar queries no Tinker
- [ ] Verificar integridade referencial

---

## 🚀 Próximo Passo

Depois de criar a base de dados, consulta **[MODELS_REFERENCE.md](./MODELS_REFERENCE.md)** para implementar os Models Eloquent completos.
