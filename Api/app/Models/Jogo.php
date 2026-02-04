<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jogo extends Model
{
    protected $fillable = [
        'equipa_id',
        'adversario',
        'golos_marcados',
        'golos_sofridos',
        'data_jogo'
    ];

    public function atletaStats()
    {
        return $this->hasMany(AtletaJogoStat::class);
    }

    public function equipa()
    {
        return $this->belongsTo(Equipa::class);
    }
}
