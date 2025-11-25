# Models Eloquent - Referência Completa

## 📋 Índice
1. [User Model](#1-user-model)
2. [Play Model](#2-play-model)
3. [Comment Model](#3-comment-model)
4. [Tip Model](#4-tip-model)
5. [TeamStats Model](#5-teamstats-model)
6. [AthleteStats Model](#6-athletestats-model)
7. [Enums](#7-enums)
8. [Factories](#8-factories)

---

## 1. User Model

**Ficheiro:** `app/Models/User.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Enums\UserType;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'type',
        'team',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'type' => UserType::class,
        'email_verified_at' => 'datetime',
        'password' => 'hashed', // Laravel 12
    ];

    /**
     * Relações
     */
    
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

    /**
     * Scopes
     */
    
    public function scopeCoaches($query)
    {
        return $query->where('type', UserType::COACH);
    }

    public function scopeAthletes($query)
    {
        return $query->where('type', UserType::ATHLETE);
    }

    public function scopeFromTeam($query, string $team)
    {
        return $query->where('team', $team);
    }

    /**
     * Helper Methods
     */
    
    public function isCoach(): bool
    {
        return $this->type === UserType::COACH;
    }

    public function isAthlete(): bool
    {
        return $this->type === UserType::ATHLETE;
    }

    public function getTypeLabel(): string
    {
        return match($this->type) {
            UserType::COACH => 'Treinador',
            UserType::ATHLETE => 'Atleta',
        };
    }

    /**
     * Accessors & Mutators (Laravel 12)
     */
    
    public function getInitials(): string
    {
        $words = explode(' ', $this->name);
        if (count($words) >= 2) {
            return strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1));
        }
        return strtoupper(substr($this->name, 0, 2));
    }
}
```

---

## 2. Play Model

**Ficheiro:** `app/Models/Play.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Play extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'description',
        'video_url',
        'author_id',
        'team',
        'category',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relações
     */
    
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class)->latest();
    }

    /**
     * Scopes
     */
    
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByTeam($query, string $team)
    {
        return $query->where('team', $team);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('category', 'like', "%{$search}%");
        });
    }

    /**
     * Helper Methods
     */
    
    public function canBeEditedBy(User $user): bool
    {
        return $user->isCoach() && $this->author_id === $user->id;
    }

    public function canBeDeletedBy(User $user): bool
    {
        return $user->isCoach() && $this->author_id === $user->id;
    }

    public function getCommentsCount(): int
    {
        return $this->comments()->count();
    }

    /**
     * Accessors
     */
    
    public function getExcerpt(int $length = 100): string
    {
        return strlen($this->description) > $length
            ? substr($this->description, 0, $length) . '...'
            : $this->description;
    }
}
```

---

## 3. Comment Model

**Ficheiro:** `app/Models/Comment.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'play_id',
        'author_id',
        'content',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relações
     */
    
    public function play()
    {
        return $this->belongsTo(Play::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Scopes
     */
    
    public function scopeByPlay($query, int $playId)
    {
        return $query->where('play_id', $playId);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Helper Methods
     */
    
    public function canBeDeletedBy(User $user): bool
    {
        return $this->author_id === $user->id || $user->isCoach();
    }
}
```

---

## 4. Tip Model

**Ficheiro:** `app/Models/Tip.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\TipCategory;

class Tip extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'description',
        'category',
        'content',
        'author_id',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'category' => TipCategory::class,
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relações
     */
    
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Scopes
     */
    
    public function scopeByCategory($query, TipCategory $category)
    {
        return $query->where('category', $category);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('content', 'like', "%{$search}%");
        });
    }

    /**
     * Helper Methods
     */
    
    public function canBeEditedBy(User $user): bool
    {
        return $this->author_id === $user->id;
    }

    public function canBeDeletedBy(User $user): bool
    {
        return $this->author_id === $user->id || $user->isCoach();
    }

    public function getCategoryLabel(): string
    {
        return match($this->category) {
            TipCategory::FINTA => 'Finta',
            TipCategory::DRIBLE => 'Drible',
            TipCategory::REMATE => 'Remate',
            TipCategory::DEFESA => 'Defesa',
            TipCategory::TATICA => 'Táctica',
        };
    }

    /**
     * Accessors
     */
    
    public function getRenderedContent(): string
    {
        // Usar biblioteca markdown (ex: league/commonmark)
        // return (new \League\CommonMark\CommonMarkConverter())->convert($this->content);
        return nl2br(e($this->content));
    }
}
```

---

## 5. TeamStats Model

**Ficheiro:** `app/Models/TeamStats.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\Division;

class TeamStats extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'team_name',
        'division',
        'goals_scored',
        'goals_conceded',
        'matches_played',
        'wins',
        'draws',
        'losses',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'division' => Division::class,
        'goals_scored' => 'integer',
        'goals_conceded' => 'integer',
        'matches_played' => 'integer',
        'wins' => 'integer',
        'draws' => 'integer',
        'losses' => 'integer',
    ];

    /**
     * Scopes
     */
    
    public function scopeByDivision($query, Division $division)
    {
        return $query->where('division', $division);
    }

    public function scopeByTeam($query, string $teamName)
    {
        return $query->where('team_name', $teamName);
    }

    public function scopeOrderedByPoints($query)
    {
        return $query->selectRaw('*, (wins * 3 + draws) as points')
                     ->orderBy('points', 'desc');
    }

    /**
     * Accessors & Helpers
     */
    
    public function getPoints(): int
    {
        return ($this->wins * 3) + $this->draws;
    }

    public function getGoalDifference(): int
    {
        return $this->goals_scored - $this->goals_conceded;
    }

    public function getWinRate(): float
    {
        if ($this->matches_played === 0) {
            return 0;
        }
        return round(($this->wins / $this->matches_played) * 100, 2);
    }

    public function getAverageGoalsScored(): float
    {
        if ($this->matches_played === 0) {
            return 0;
        }
        return round($this->goals_scored / $this->matches_played, 2);
    }

    public function getAverageGoalsConceded(): float
    {
        if ($this->matches_played === 0) {
            return 0;
        }
        return round($this->goals_conceded / $this->matches_played, 2);
    }

    public function getDivisionLabel(): string
    {
        return match($this->division) {
            Division::SENIORES => 'Seniores',
            Division::SUB20 => 'Sub-20',
            Division::SUB18 => 'Sub-18',
            Division::SUB16 => 'Sub-16',
            Division::SUB14 => 'Sub-14',
        };
    }
}
```

---

## 6. AthleteStats Model

**Ficheiro:** `app/Models/AthleteStats.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\{Division, Position};

class AthleteStats extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'team',
        'position',
        'division',
        'goals_scored',
        'matches_played',
        'assists',
        'yellow_cards',
        'red_cards',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'position' => Position::class,
        'division' => Division::class,
        'goals_scored' => 'integer',
        'matches_played' => 'integer',
        'assists' => 'integer',
        'yellow_cards' => 'integer',
        'red_cards' => 'integer',
    ];

    /**
     * Scopes
     */
    
    public function scopeByDivision($query, Division $division)
    {
        return $query->where('division', $division);
    }

    public function scopeByTeam($query, string $team)
    {
        return $query->where('team', $team);
    }

    public function scopeByPosition($query, Position $position)
    {
        return $query->where('position', $position);
    }

    public function scopeTopScorers($query, int $limit = 10)
    {
        return $query->orderBy('goals_scored', 'desc')->limit($limit);
    }

    public function scopeTopAssisters($query, int $limit = 10)
    {
        return $query->orderBy('assists', 'desc')->limit($limit);
    }

    /**
     * Accessors & Helpers
     */
    
    public function getAverageGoalsPerMatch(): float
    {
        if ($this->matches_played === 0) {
            return 0;
        }
        return round($this->goals_scored / $this->matches_played, 2);
    }

    public function getTotalCards(): int
    {
        return $this->yellow_cards + $this->red_cards;
    }

    public function getPositionLabel(): string
    {
        return match($this->position) {
            Position::PIVOT => 'Pivot',
            Position::PONTA => 'Ponta',
            Position::LATERAL => 'Lateral',
            Position::CENTRAL => 'Central',
            Position::GUARDA_REDES => 'Guarda-Redes',
        };
    }

    public function getDivisionLabel(): string
    {
        return match($this->division) {
            Division::SENIORES => 'Seniores',
            Division::SUB20 => 'Sub-20',
            Division::SUB18 => 'Sub-18',
            Division::SUB16 => 'Sub-16',
            Division::SUB14 => 'Sub-14',
        };
    }
}
```

---

## 7. Enums

### UserType Enum

**Ficheiro:** `app/Enums/UserType.php`

```php
<?php

namespace App\Enums;

enum UserType: string
{
    case ATHLETE = 'athlete';
    case COACH = 'coach';

    public function label(): string
    {
        return match($this) {
            self::ATHLETE => 'Atleta',
            self::COACH => 'Treinador',
        };
    }
}
```

### Division Enum

**Ficheiro:** `app/Enums/Division.php`

```php
<?php

namespace App\Enums;

enum Division: string
{
    case SENIORES = 'seniores';
    case SUB20 = 'sub-20';
    case SUB18 = 'sub-18';
    case SUB16 = 'sub-16';
    case SUB14 = 'sub-14';

    public function label(): string
    {
        return match($this) {
            self::SENIORES => 'Seniores',
            self::SUB20 => 'Sub-20',
            self::SUB18 => 'Sub-18',
            self::SUB16 => 'Sub-16',
            self::SUB14 => 'Sub-14',
        };
    }

    public static function options(): array
    {
        return [
            self::SENIORES->value => self::SENIORES->label(),
            self::SUB20->value => self::SUB20->label(),
            self::SUB18->value => self::SUB18->label(),
            self::SUB16->value => self::SUB16->label(),
            self::SUB14->value => self::SUB14->label(),
        ];
    }
}
```

### Position Enum

**Ficheiro:** `app/Enums/Position.php`

```php
<?php

namespace App\Enums;

enum Position: string
{
    case PIVOT = 'pivot';
    case PONTA = 'ponta';
    case LATERAL = 'lateral';
    case CENTRAL = 'central';
    case GUARDA_REDES = 'guarda-redes';

    public function label(): string
    {
        return match($this) {
            self::PIVOT => 'Pivot',
            self::PONTA => 'Ponta',
            self::LATERAL => 'Lateral',
            self::CENTRAL => 'Central',
            self::GUARDA_REDES => 'Guarda-Redes',
        };
    }

    public static function options(): array
    {
        return [
            self::PIVOT->value => self::PIVOT->label(),
            self::PONTA->value => self::PONTA->label(),
            self::LATERAL->value => self::LATERAL->label(),
            self::CENTRAL->value => self::CENTRAL->label(),
            self::GUARDA_REDES->value => self::GUARDA_REDES->label(),
        ];
    }
}
```

### TipCategory Enum

**Ficheiro:** `app/Enums/TipCategory.php`

```php
<?php

namespace App\Enums;

enum TipCategory: string
{
    case FINTA = 'finta';
    case DRIBLE = 'drible';
    case REMATE = 'remate';
    case DEFESA = 'defesa';
    case TATICA = 'táctica';

    public function label(): string
    {
        return match($this) {
            self::FINTA => 'Finta',
            self::DRIBLE => 'Drible',
            self::REMATE => 'Remate',
            self::DEFESA => 'Defesa',
            self::TATICA => 'Táctica',
        };
    }

    public function icon(): string
    {
        return match($this) {
            self::FINTA => '🏃',
            self::DRIBLE => '⚡',
            self::REMATE => '🎯',
            self::DEFESA => '🛡️',
            self::TATICA => '📋',
        };
    }

    public static function options(): array
    {
        return [
            self::FINTA->value => self::FINTA->label(),
            self::DRIBLE->value => self::DRIBLE->label(),
            self::REMATE->value => self::REMATE->label(),
            self::DEFESA->value => self::DEFESA->label(),
            self::TATICA->value => self::TATICA->label(),
        ];
    }
}
```

---

## 8. Factories

### UserFactory

**Ficheiro:** `database/factories/UserFactory.php`

```php
<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Enums\UserType;

class UserFactory extends Factory
{
    protected static ?string $password = null;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'type' => fake()->randomElement([UserType::ATHLETE, UserType::COACH]),
            'team' => fake()->randomElement(['FC Porto', 'Benfica', 'Sporting', 'ABC Braga']),
            'remember_token' => Str::random(10),
        ];
    }

    public function coach(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => UserType::COACH,
        ]);
    }

    public function athlete(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => UserType::ATHLETE,
        ]);
    }
}
```

### PlayFactory

**Ficheiro:** `database/factories/PlayFactory.php`

```php
<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

class PlayFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'video_url' => 'https://example.com/video' . fake()->randomNumber(3) . '.mp4',
            'author_id' => User::factory(),
            'team' => fake()->randomElement(['FC Porto', 'Benfica', 'Sporting', 'ABC Braga']),
            'category' => fake()->randomElement([
                'Contra-ataque',
                'Ataque posicional',
                'Técnica individual',
                'Defesa',
                'Táctica'
            ]),
        ];
    }
}
```

---

## 🎯 Uso dos Models

### Exemplos Práticos

```php
// Criar utilizador
$user = User::create([
    'name' => 'João Silva',
    'email' => 'joao@exemplo.pt',
    'password' => Hash::make('password'),
    'type' => UserType::ATHLETE,
    'team' => 'FC Porto',
]);

// Criar jogada
$play = Play::create([
    'title' => 'Contra-ataque rápido',
    'description' => 'Movimento de contra-ataque eficaz',
    'video_url' => 'https://exemplo.pt/video.mp4',
    'author_id' => $user->id,
    'team' => 'FC Porto',
    'category' => 'Contra-ataque',
]);

// Adicionar comentário
$play->comments()->create([
    'author_id' => $user->id,
    'content' => 'Excelente jogada!',
]);

// Queries com relações
$plays = Play::with(['author', 'comments.author'])
    ->recent()
    ->get();

// Estatísticas
$topScorers = AthleteStats::topScorers(10)->get();
$teamStats = TeamStats::byDivision(Division::SENIORES)
    ->orderedByPoints()
    ->get();
```

---

## ✅ Checklist

- [ ] Criar todos os Enums
- [ ] Criar todos os Models
- [ ] Definir fillable e casts
- [ ] Implementar relações
- [ ] Adicionar scopes úteis
- [ ] Criar helper methods
- [ ] Implementar factories
- [ ] Testar no Tinker

---

## 🚀 Próximo Passo

Consulta **[ROUTES_REFERENCE.md](./ROUTES_REFERENCE.md)** para definir todas as rotas da aplicação.
