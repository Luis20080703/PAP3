<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Atleta;

class EnsureAthleteIsolation
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        
        if ($user && $user->tipo === 'atleta') {
            $atleta = Atleta::where('user_id', $user->id)->first();
            
            if ($atleta) {
                // Adicionar atleta_id aos parâmetros da request
                $request->merge(['current_atleta_id' => $atleta->id]);
            }
        }
        
        return $next($request);
    }
}