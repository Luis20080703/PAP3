<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jogo;
use Illuminate\Http\Request;

class JogoController extends Controller
{
    public function index()
    {
        $jogos = Jogo::with('equipa')->get();

        return response()->json([
            'success' => true,
            'data' => $jogos
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipa_id' => 'required|exists:equipas,id',
            'adversario' => 'required|string|max:255',
            'golos_marcados' => 'required|integer|min:0',
            'golos_sofridos' => 'required|integer|min:0',
            'data_jogo' => 'required|date'
        ]);

        $jogo = Jogo::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Jogo registado com sucesso!',
            'data' => $jogo
        ], 201);
    }

    public function show($id)
    {
        $jogo = Jogo::with('equipa')->find($id);

        if (!$jogo) {
            return response()->json([
                'success' => false,
                'message' => 'Jogo não encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $jogo
        ]);
    }

    public function update(Request $request, $id)
    {
        $jogo = Jogo::find($id);

        if (!$jogo) {
            return response()->json([
                'success' => false,
                'message' => 'Jogo não encontrado'
            ], 404);
        }

        $validated = $request->validate([
            'equipa_id' => 'sometimes|exists:equipas,id',
            'adversario' => 'sometimes|string|max:255',
            'golos_marcados' => 'sometimes|integer|min:0',
            'golos_sofridos' => 'sometimes|integer|min:0',
            'data_jogo' => 'sometimes|date'
        ]);

        $jogo->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Jogo atualizado com sucesso!',
            'data' => $jogo
        ]);
    }

    public function destroy($id)
    {
        $jogo = Jogo::find($id);

        if (!$jogo) {
            return response()->json([
                'success' => false,
                'message' => 'Jogo não encontrado'
            ], 404);
        }

        $jogo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Jogo removido com sucesso!'
        ]);
    }

    /**
     * Get games for the authenticated coach's team.
     */
    public function getMyTeamGames(Request $request)
    {
        $user = $request->user();
        $equipaId = null;

        $treinador = \App\Models\Treinador::where('user_id', $user->id)->first();
        if ($treinador) {
            $equipaId = $treinador->equipa_id;
        } elseif (in_array($user->tipo, ['root', 'admin'])) {
            // Admins see everything? Or just first team for now as per import logic
            return $this->index(); 
        } elseif ($user->equipa) {
            $equipa = \App\Models\Equipa::where('nome', $user->equipa)->first();
            if ($equipa) {
                $equipaId = $equipa->id;
            }
        }

        if (!$equipaId) {
            return response()->json(['success' => false, 'message' => 'Equipa não encontrada.'], 403);
        }

        $jogos = Jogo::where('equipa_id', $equipaId)
            ->orderBy('data_jogo', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $jogos
        ]);
    }
}
