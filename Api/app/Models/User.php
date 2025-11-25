<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'nome',
        'email',
        'password',
        'tipo',    // ← Muda para português se quiseres
        'equipa'   // ← Muda para português se quiseres
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

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

    public function jogadas()
    {
        return $this->hasMany(Jogada::class);
    }
}
