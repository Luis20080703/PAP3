<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EquipaEscalao;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EquipaEscalaoController extends Controller
{
    public function index(): JsonResponse
    {
        $equipaEscaloes = EquipaEscalao::with(['equipa', 'escalao'])->get();
        return response()->json(['success' => true, 'data' => $equipaEscaloes]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'equipa_id' => 'required|exists:equipas,id',
            'escalao_id' => 'required|exists:escaloes,id'
        ]);

        $equipaEscalao = EquipaEscalao::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Relação equipa-escalão criada com sucesso!',
            'data' => $equipaEscalao->load(['equipa', 'escalao'])
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $equipaEscalao = EquipaEscalao::with(['equipa', 'escalao'])->find($id);

        if (!$equipaEscalao) {
            return response()->json([
                'success' => false,
                'message' => 'Relação não encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $equipaEscalao
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $equipaEscalao = EquipaEscalao::find($id);

        if (!$equipaEscalao) {
            return response()->json([
                'success' => false,
                'message' => 'Relação não encontrada'
            ], 404);
        }

        $validated = $request->validate([
            'equipa_id' => 'sometimes|exists:equipas,id',
            'escalao_id' => 'sometimes|exists:escaloes,id'
        ]);

        $equipaEscalao->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Relação atualizada com sucesso!',
            'data' => $equipaEscalao->load(['equipa', 'escalao'])
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $equipaEscalao = EquipaEscalao::find($id);

        if (!$equipaEscalao) {
            return response()->json([
                'success' => false,
                'message' => 'Relação não encontrada'
            ], 404);
        }

        $equipaEscalao->delete();

        return response()->json([
            'success' => true,
            'message' => 'Relação apagada com sucesso!'
        ]);
    }
}
