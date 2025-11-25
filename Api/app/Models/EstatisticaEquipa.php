<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstatisticaEquipa extends Model
{
    use HasFactory;

    protected $fillable = [
        'equipa_id',
        'escalao',
        'golos_marcados',
        'golos_sofridos',
        'total_golos_marcados',
        'total_golos_sofridos',
        'media_golos_marcados',
        'media_golos_sofridos'
    ];

    // ==================== RELAÇÕES ====================

    public function equipa()
    {
        return $this->belongsTo(Equipa::class);
    }
}
