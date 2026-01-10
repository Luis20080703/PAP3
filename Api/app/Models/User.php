<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'nome',
        'email',
        'password',
        'tipo',    // ← Muda para português se quiseres
        'validado',
        'equipa',   // ← Muda para português se quiseres
        'is_premium', // ✅ Novo campo Premium
        'premium_plan' // ✅ Differentiate plan tiers
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'validado' => 'boolean',   // ⚡ importante
        'is_premium' => 'boolean', // ✅ Cast para boolean





    ];


    // ==================== RELAÇÕES ====================

    public function atletas()
    {
        return $this->hasMany(Atleta::class);
    }

    public function treinadores()
    {
        return $this->hasMany(Treinador::class);
    }

    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }

    public function dicas()
    {
        return $this->hasMany(Dica::class);
    }

    // ✅ Acessor para "equipa" (substitui o valor da coluna se for null)
    public function getEquipaAttribute($value)
    {
        // Se já tiver valor na coluna (ex: string antiga), usa-o
        if (!empty($value)) {
            return $value;
        }

        // 1. Tenta buscar via Atleta
        $atleta = $this->hasOne(Atleta::class)->first();
        if ($atleta && $atleta->equipa) {
            return $atleta->equipa->nome;
        }

        // 2. Tenta buscar via Treinador
        $treinador = $this->hasOne(Treinador::class)->first();
        if ($treinador && $treinador->equipa) {
            return $treinador->equipa->nome;
        }

        return null;
    }

    public function jogadas()
    {
        return $this->hasMany(Jogada::class);
    }
    // User.php

    // ⚠️ Renomeado para evitar conflito com a coluna 'equipa' (string)
    public function equipaData()
    {
        return $this->belongsTo(Equipa::class, 'equipa'); 
    }
}
