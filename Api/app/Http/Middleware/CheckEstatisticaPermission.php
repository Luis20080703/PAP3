<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckEstatisticaPermission
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Não autenticado'], 401);
        }

        $estatisticaId = $request->route('estatistica_atleta') ?? $request->route('id');

        // Se for admin/root, permite tudo
        if ($user->tipo === 'admin' || $user->tipo === 'root') {
            return $next($request);
        }

        // Se for treinador, pode ver tudo mas só editar os seus atletas
        if ($user->tipo === 'treinador') {
            // Para métodos GET (ver), permite
            if (in_array($request->method(), ['GET', 'HEAD'])) {
                return $next($request);
            }

            // Para métodos PUT/PATCH/DELETE (editar/apagar), verifica se o atleta pertence à sua equipa
            if ($estatisticaId) {
                $estatistica = \App\Models\EstatisticaAtleta::find($estatisticaId);
                if ($estatistica) {
                    $treinador = \App\Models\Treinador::where('user_id', $user->id)->first();
                    if ($treinador && $estatistica->atleta->equipa_id == $treinador->equipa_id) {
                        return $next($request);
                    }
                }
            }
        }

        // Se for atleta, só pode ver/editar as suas próprias estatísticas
        if ($user->tipo === 'atleta') {
            if ($estatisticaId) {
                $estatistica = \App\Models\EstatisticaAtleta::find($estatisticaId);
                if ($estatistica && $estatistica->atleta->user_id == $user->id) {
                    return $next($request);
                }
            } else {
                // Para listar, filtra as suas próprias estatísticas
                $request->merge(['atleta_user_id' => $user->id]);
                return $next($request);
            }
        }

        return response()->json(['error' => 'Não autorizado'], 403);
    }
}