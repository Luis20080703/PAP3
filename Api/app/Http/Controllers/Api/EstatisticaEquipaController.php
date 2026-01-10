<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EstatisticaEquipa;
use Illuminate\Http\Request;

class EstatisticaEquipaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Se user não autenticado, mostra vazio. 
        // Se Admin, Root ou Treinador Premium, mostra tudo.
        $canSeeAll = $user && (in_array($user->tipo, ['admin', 'root']) || ($user->tipo === 'treinador' && $user->is_premium));

        if ($canSeeAll) {
             $estatisticas = EstatisticaEquipa::with('equipa')->get();
        } else {
             // User normal (atleta/treinador) só vê da sua equipa
             $equipaId = null;
             
             // Tentar resolver equipa pelo nome
             if ($user->equipa) {
                 $equipa = \App\Models\Equipa::where('nome', $user->equipa)->first();
                 $equipaId = $equipa ? $equipa->id : null;
             }
             
             // Resolver via User ID se necessário
             if (!$equipaId && $user->equipa_id) {
                 $equipaId = $user->equipa_id;
             }
             
             if ($equipaId) {
                 $estatisticas = EstatisticaEquipa::with('equipa')
                    ->where('equipa_id', $equipaId)
                    ->get();
             } else {
                 $estatisticas = [];
             }
        }

        return response()->json(['success' => true, 'data' => $estatisticas]);
    }
    public function myTeamStats(Request $request)
    {
        // Utilizador autenticado
        $user = $request->user();

        // Verificar se o user tem equipa associada
        if (!$user->equipa_id) {
            return response()->json([
                'success' => false,
                'message' => 'O utilizador não está associado a nenhuma equipa.'
            ], 404);
        }

        // Buscar estatísticas da equipa do user
        $estatistica = EstatisticaEquipa::with('equipa')
            ->where('equipa_id', $user->equipa_id)
            ->first();

        if (!$estatistica) {
            return response()->json([
                'success' => false,
                'message' => 'Ainda não existem estatísticas para esta equipa.'
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $estatistica
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipa_id' => 'required|exists:equipas,id',
            'escalao' => 'required|string|max:255',
            'golos_marcados' => 'required|integer',
            'golos_sofridos' => 'required|integer',
            'total_golos_marcados' => 'required|integer',
            'total_golos_sofridos' => 'required|integer',
            'media_golos_marcados' => 'required|numeric',
            'media_golos_sofridos' => 'required|numeric'
        ]);

        $estatistica = EstatisticaEquipa::create($validated);
        return response()->json([
            'success' => true,
            'message' => 'Estatística de equipa criada com sucesso!',
            'data' => $estatistica->load('equipa')
        ], 201);
    }

    public function show($id)
    {
        $estatistica = EstatisticaEquipa::with('equipa')->find($id);
        if (!$estatistica) {
            return response()->json(['success' => false, 'message' => 'Estatística não encontrada'], 404);
        }
        return response()->json(['success' => true, 'data' => $estatistica]);
    }

    public function update(Request $request, $id)
    {
        $estatistica = EstatisticaEquipa::find($id);
        if (!$estatistica) {
            return response()->json(['success' => false, 'message' => 'Estatística não encontrada'], 404);
        }

        $validated = $request->validate([
            'equipa_id' => 'sometimes|exists:equipas,id',
            'escalao' => 'sometimes|string|max:255',
            'golos_marcados' => 'sometimes|integer',
            'golos_sofridos' => 'sometimes|integer',
            'total_golos_marcados' => 'sometimes|integer',
            'total_golos_sofridos' => 'sometimes|integer',
            'media_golos_marcados' => 'sometimes|numeric',
            'media_golos_sofridos' => 'sometimes|numeric'
        ]);

        $estatistica->update($validated);
        return response()->json([
            'success' => true,
            'message' => 'Estatística atualizada com sucesso!',
            'data' => $estatistica->load('equipa')
        ]);
    }

    public function destroy($id)
    {
        $estatistica = EstatisticaEquipa::find($id);
        if (!$estatistica) {
            return response()->json(['success' => false, 'message' => 'Estatística não encontrada'], 404);
        }

        $estatistica->delete();
        return response()->json(['success' => true, 'message' => 'Estatística apagada com sucesso!']);
    }
}
