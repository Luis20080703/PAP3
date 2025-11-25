<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipa extends Model
{
    use HasFactory;

    protected $fillable = ['nome', 'escalao_equipa_escalao'];

    // ==================== RELAÇÕES ====================

    public function atletas()
    {
        return $this->hasMany(Atleta::class);
    }

    public function treinadores()
    {
        return $this->hasMany(Treinador::class);
    }

    public function estatisticas()
    {
        return $this->hasMany(EstatisticaEquipa::class);
    }

    public function escaloes()
    {
        return $this->belongsToMany(Escalao::class, 'equipa_escalao');
    }
}
