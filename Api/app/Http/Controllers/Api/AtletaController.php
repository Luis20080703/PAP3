<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Atleta;
use Illuminate\Http\Request;

class AtletaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['success' => false, 'message' => 'Não autenticado'], 401);

        $query = Atleta::with(['user', 'equipa', 'epoca']);

        // Se for admin ou root, vê tudo
        if (in_array($user->tipo, ['admin', 'root'])) {
            return response()->json(['success' => true, 'data' => $query->get()]);
        }

        // Se for treinador, vê apenas atletas da sua equipa
        if ($user->tipo === 'treinador') {
            $treinador = \App\Models\Treinador::where('user_id', $user->id)->first();
            if ($treinador) {
                $query->where('equipa_id', $treinador->equipa_id);
                return response()->json(['success' => true, 'data' => $query->get()]);
            }
        }

        // Se for atleta, vê apenas a si mesmo ou nada (conforme a regra de negócio)
        if ($user->tipo === 'atleta') {
            $query->where('user_id', $user->id);
            return response()->json(['success' => true, 'data' => $query->get()]);
        }

        return response()->json(['success' => true, 'data' => []]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'equipa_id' => 'required|exists:equipas,id',
            'epoca_id' => 'required|exists:epocas,id',
            'posicao' => 'required|string|max:255',
            'numero' => 'required|integer'
        ]);

        $atleta = Atleta::create($validated);
        return response()->json([
            'success' => true,
            'message' => 'Atleta criado com sucesso!',
            'data' => $atleta->load(['user', 'equipa', 'epoca'])
        ], 201);
    }

    public function show($id)
    {
        $atleta = Atleta::with(['user', 'equipa', 'epoca'])->find($id);
        if (!$atleta) {
            return response()->json(['success' => false, 'message' => 'Atleta não encontrado'], 404);
        }
        return response()->json(['success' => true, 'data' => $atleta]);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $atleta = Atleta::find($id);

        if (!$atleta) {
            return response()->json(['success' => false, 'message' => 'Atleta não encontrado'], 404);
        }

        // Verificar permissão
        if (!$this->podeGerirAtleta($user, $atleta)) {
            return response()->json(['success' => false, 'message' => 'Não tem permissão para editar este atleta'], 403);
        }

        $validated = $request->validate([
            'posicao' => 'sometimes|string|max:255',
            'numero' => 'sometimes|integer',
            'escalao' => 'sometimes|string|nullable'
        ]);

        $atleta->update($validated);
        
        // Também atualizar o nome do utilizador se enviado
        if ($request->has('nome')) {
            $atleta->user->update(['nome' => $request->input('nome')]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Atleta atualizado com sucesso!',
            'data' => $atleta->load(['user', 'equipa', 'epoca'])
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $atleta = Atleta::find($id);

        if (!$atleta) {
            return response()->json(['success' => false, 'message' => 'Atleta não encontrado'], 404);
        }

        // Verificar permissão
        if (!$this->podeGerirAtleta($user, $atleta)) {
            return response()->json(['success' => false, 'message' => 'Não tem permissão para apagar este atleta'], 403);
        }

        // Opcional: Apagar também o utilizador associado se for desejado
        // $atleta->user->delete();
        
        $atleta->delete();
        return response()->json(['success' => true, 'message' => 'Atleta apagado com sucesso!']);
    }

    private function podeGerirAtleta($user, Atleta $atleta): bool
    {
        if (!$user) return false;

        // Admin/Root pode tudo
        if (in_array($user->tipo, ['admin', 'root'])) return true;

        // Treinador pode gerir se o atleta for da sua equipa
        if ($user->tipo === 'treinador') {
            $treinador = \App\Models\Treinador::where('user_id', $user->id)->first();
            return $treinador && $treinador->equipa_id === $atleta->equipa_id;
        }

        return false;
    }

    /**
     * Get per-game statistics for the authenticated athlete.
     */
    /**
     * Get per-game statistics for the authenticated athlete.
     */
    public function getMyGameStats(Request $request)
    {
        $user = $request->user();
        if (!$user) {
             return response()->json(['success' => false, 'message' => 'Não autenticado'], 401);
        }

        $atleta = Atleta::where('user_id', $user->id)->first();
        
        if (!$atleta) {
            return response()->json(['success' => false, 'message' => 'Perfil de atleta não encontrado.'], 404);
        }

        $stats = \App\Models\AtletaJogoStat::where('atleta_id', $atleta->id)
            ->with(['jogo'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get per-game statistics for a specific athlete (for trainers).
     */
    public function getAthleteGameStats(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
             return response()->json(['success' => false, 'message' => 'Não autenticado'], 401);
        }

        $atleta = Atleta::find($id);
        if (!$atleta) {
            return response()->json(['success' => false, 'message' => 'Atleta não encontrado'], 404);
        }

        // Check permissions
        $authorized = false;
        if (in_array($user->tipo, ['admin', 'root'])) {
            $authorized = true;
        } elseif ($user->tipo === 'treinador') {
            $treinador = \App\Models\Treinador::where('user_id', $user->id)->first();
            if ($treinador && $treinador->equipa_id === $atleta->equipa_id) {
                $authorized = true;
            }
        } elseif ($user->tipo === 'atleta' && $atleta->user_id === $user->id) {
            $authorized = true;
        }

        if (!$authorized) {
            return response()->json(['success' => false, 'message' => 'Não autorizado'], 403);
        }

        $stats = \App\Models\AtletaJogoStat::where('atleta_id', $atleta->id)
            ->with(['jogo'])
            ->orderBy('created_at', 'asc') // Ascending for chart progression
            ->get();

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
