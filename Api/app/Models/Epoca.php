<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Epoca extends Model
{
    use HasFactory;

    protected $fillable = [
        'data_inicio',
        'data_fim'
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
}
