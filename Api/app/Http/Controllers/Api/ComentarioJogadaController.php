<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comentario;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ComentarioJogadaController extends Controller
{
    // Listar comentários
    public function index(): JsonResponse
    {
        try {
            $comentarios = Comentario::with('user')->get();
            return response()->json(['success' => true, 'data' => $comentarios]);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao buscar comentários'], 500);
        }
    }

    // Criar comentário
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'jogada_id' => 'required|exists:jogadas,id',
            'texto' => 'required|string|max:500'
        ]);

        $comentario = Comentario::create([
            'user_id' => $validated['user_id'],
            'jogada_id' => $validated['jogada_id'],
            'texto' => $validated['texto'],
            'data' => now()
        ]);

        $comentario->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Comentário criado!',
            'data' => $comentario
        ], 201);
    }

    // Apagar comentário
    public function destroy($id): JsonResponse
    {
        $comentario = Comentario::find($id);
        if (!$comentario) {
            return response()->json(['success' => false, 'message' => 'Comentário não encontrado'], 404);
        }
        $comentario->delete();
        return response()->json(['success' => true, 'message' => 'Comentário apagado!']);
    }
}
