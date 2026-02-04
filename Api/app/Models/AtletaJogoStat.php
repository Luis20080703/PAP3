<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AtletaJogoStat extends Model
{
    use HasFactory;

    protected $table = 'atleta_jogo_stats';

    protected $fillable = [
        'atleta_id',
        'jogo_id',
        'golos',
        'amarelo',
        'vermelho',
        'dois_minutos',
    ];

    public function atleta()
    {
        return $this->belongsTo(Atleta::class);
    }

    public function jogo()
    {
        return $this->belongsTo(Jogo::class);
    }
}
