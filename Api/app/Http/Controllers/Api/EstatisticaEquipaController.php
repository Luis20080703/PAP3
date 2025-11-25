<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EstatisticaEquipa;
use Illuminate\Http\Request;

class EstatisticaEquipaController extends Controller
{
    public function index()
    {
        $estatisticas = EstatisticaEquipa::with('equipa')->get();
        return response()->json(['success' => true, 'data' => $estatisticas]);
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
