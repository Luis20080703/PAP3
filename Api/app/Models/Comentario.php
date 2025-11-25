<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comentario extends Model
{
    use HasFactory;

    protected $table = 'comentarios';

    protected $fillable = [
        'user_id',
        'jogada_id',
        'texto',
        'data'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jogada()
    {
        return $this->belongsTo(Jogada::class);
    }
}
