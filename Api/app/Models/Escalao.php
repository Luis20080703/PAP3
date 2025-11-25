<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Escalao extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'idade_min',
        'idade_max',
        'descricao',
    ];

    // ==================== RELAÇÕES ====================

    public function equipas()
    {
        return $this->belongsToMany(Equipa::class, 'equipa_escalao');
    }
    public function equipaEscalaos()
    {
        return $this->hasMany(EquipaEscalao::class, 'escalao_id');
    }
}
