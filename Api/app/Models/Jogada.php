<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jogada extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'equipa_id',
        'titulo',
        'descricao',
        'ficheiro',
        'data_upload'
    ];

    // ==================== RELAÇÕES ====================

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ✅ RELAÇÃO EQUIPA (FALTAVA!)
    public function equipa()
    {
        return $this->belongsTo(Equipa::class);
    }

    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }
       // ==================== ACL - CONTROLO DE ACESSO ====================

    /**
     * Verifica se um utilizador pode apagar esta jogada
     * ACL Rules:
     * 1. O criador da jogada pode apagar
     * 2. Treinadores da mesma equipa podem apagar
     * 3. Administradores podem apagar
     */
    public function podeApagar(User $user): bool
    {
        // Regra 1: Dono da jogada
        if ($this->user_id === $user->id) {
            return true;
        }

        // Regra 2: Treinador da mesma equipa
        if ($user->tipo === 'treinador' && $this->equipa_id === $user->equipa_id) {
            return true;
        }

        // Regra 3: Administrador (se tiveres este campo)
        if ($user->tipo === 'admin') {
            return true;
        }

        return false;
    }

    /**
     * Verifica se um utilizador pode editar esta jogada
     */
    public function podeEditar(User $user): bool
    {
        return $this->podeApagar($user); // Mesmas regras para editar
    }

    /**
     * Scope para filtrar jogadas visíveis para um utilizador
     */
    public function scopeVisiveisPara($query, User $user)
    {
        return $query->where(function ($q) use ($user) {
            // Ver jogadas da mesma equipa ou públicas
            $q->where('equipa_id', $user->equipa_id);

            // Se quiseres adicionar jogadas públicas de outras equipas:
            // ->orWhere('is_public', true);
        });
    }
}
