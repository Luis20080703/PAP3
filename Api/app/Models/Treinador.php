<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Treinador extends Model
{
    use HasFactory;
    protected $table = 'treinadores';
    protected $fillable = [
        'user_id',
        'equipa_id',
        'epoca_id',
        'validado',
        'escalao'
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
}
