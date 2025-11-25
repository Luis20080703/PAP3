<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comentario;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ComentarioController extends Controller
{
    public function index(): JsonResponse
    {
        // ✅ CORREÇÃO: APENAS 'user' - REMOVER 'dica'
        $comentarios = Comentario::with(['user'])->get();
        return response()->json(['success' => true, 'data' => $comentarios]);
    }

    public function store(Request $request): JsonResponse
    {
        // ✅ CORREÇÃO: PARA JOGADAS (não dicas)
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'jogada_id' => 'required|exists:jogadas,id', // ✅ MUDAR: dica_id → jogada_id
            'texto' => 'required|string' // ✅ MUDAR: conteudo → texto
        ]);

        $comentario = Comentario::create([
            'user_id' => $validated['user_id'],
            'jogada_id' => $validated['jogada_id'],
            'texto' => $validated['texto'],
            'data' => now() // ✅ ADICIONAR campo data
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Comentário criado com sucesso!',
            'data' => $comentario->load(['user']) // ✅ CORREÇÃO: APENAS 'user'
        ], 201);
    }

    public function show($id): JsonResponse
    {
        // ✅ CORREÇÃO: APENAS 'user' - REMOVER 'dica'
        $comentario = Comentario::with(['user'])->find($id);

        if (!$comentario) {
            return response()->json([
                'success' => false,
                'message' => 'Comentário não encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $comentario
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $comentario = Comentario::find($id);

        if (!$comentario) {
            return response()->json([
                'success' => false,
                'message' => 'Comentário não encontrado'
            ], 404);
        }

        // ✅ CORREÇÃO: PARA JOGADAS (não dicas)
        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'jogada_id' => 'sometimes|exists:jogadas,id', // ✅ MUDAR: dica_id → jogada_id
            'texto' => 'sometimes|string' // ✅ MUDAR: conteudo → texto
        ]);

        $comentario->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Comentário atualizado com sucesso!',
            'data' => $comentario->load(['user']) // ✅ CORREÇÃO: APENAS 'user'
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $comentario = Comentario::find($id);

        if (!$comentario) {
            return response()->json([
                'success' => false,
                'message' => 'Comentário não encontrado'
            ], 404);
        }

        $comentario->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comentário apagado com sucesso!'
        ]);
    }
}
