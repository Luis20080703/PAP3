<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dica extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'titulo',
        'conteudo',
        'categoria',

        'ficheiro'
    ];

    // ==================== RELAÇÕES ====================

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public static function getCategoriasPermitidas()
    {
        return [
            'finta',
            'drible',
            'remate',
            'defesa',
            'táctica'
        ];
    }
}
