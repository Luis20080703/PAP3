<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipa;
use Illuminate\Http\Request;

class EquipaController extends Controller
{
    /**
     * Buscar todas as equipas
     */
    public function index()
    {
        $equipas = Equipa::all();

        return response()->json([
            'success' => true,
            'data' => $equipas
        ]);
    }

    /**
     * Criar nova equipa
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'escalao_equipa_escalao' => 'nullable|string|max:255'
        ]);

        $equipa = Equipa::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Equipa criada com sucesso!',
            'data' => $equipa
        ], 201);
    }

    /**
     * Buscar uma equipa específica
     */
    public function show($id)
    {
        $equipa = Equipa::find($id);

        if (!$equipa) {
            return response()->json([
                'success' => false,
                'message' => 'Equipa não encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $equipa
        ]);
    }

    /**
     * Atualizar equipa
     */
    public function update(Request $request, $id)
    {
        $equipa = Equipa::find($id);

        if (!$equipa) {
            return response()->json([
                'success' => false,
                'message' => 'Equipa não encontrada'
            ], 404);
        }

        $validated = $request->validate([
            'nome' => 'sometimes|string|max:255',
            'escalao_equipa_escalao' => 'nullable|string|max:255'
        ]);

        $equipa->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Equipa atualizada com sucesso!',
            'data' => $equipa
        ]);
    }

    /**
     * Apagar equipa
     */
    public function destroy($id)
    {
        $equipa = Equipa::find($id);

        if (!$equipa) {
            return response()->json([
                'success' => false,
                'message' => 'Equipa não encontrada'
            ], 404);
        }

        $equipa->delete();

        return response()->json([
            'success' => true,
            'message' => 'Equipa apagada com sucesso!'
        ]);
    }
}
