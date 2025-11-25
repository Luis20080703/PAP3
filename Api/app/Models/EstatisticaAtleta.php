<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstatisticaAtleta extends Model
{
    use HasFactory;

    protected $fillable = [
        'atleta_id',
        'golos_marcados',
        'epoca',
        'media_golos'
    ];

    // ==================== RELAÇÕES ====================

    public function atleta()
    {
        return $this->belongsTo(Atleta::class);
    }
}
