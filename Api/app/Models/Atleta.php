<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Atleta extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'equipa_id',
        'epoca_id',
        'posicao',
        'numero'
    ];

    protected $casts = [
        'numero' => 'integer',
    ];

    // ==================== RELAÇÕES ====================

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function equipa()
    {
        return $this->belongsTo(Equipa::class);
    }

    public function epoca()
    {
        return $this->belongsTo(Epoca::class);
    }

    public function estatisticas()
    {
        return $this->hasMany(EstatisticaAtleta::class);
    }
}
