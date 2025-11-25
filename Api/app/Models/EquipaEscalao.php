<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipaEscalao extends Model
{
    use HasFactory;

    protected $fillable = [
        'equipa_id',
        'escalao_id'
    ];

    // ==================== RELAÇÕES ====================

    public function equipa()
    {
        return $this->belongsTo(Equipa::class);
    }

    public function escalao()
    {
        return $this->belongsTo(Escalao::class);
    }
}
