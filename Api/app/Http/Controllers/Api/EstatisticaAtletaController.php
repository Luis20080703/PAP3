<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EstatisticaAtleta;
use Illuminate\Http\Request;

class EstatisticaAtletaController extends Controller
{
    public function index()
    {
        $estatisticas = EstatisticaAtleta::with('atleta')->get();
        return response()->json(['success' => true, 'data' => $estatisticas]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'atleta_id' => 'required|exists:atletas,id',
            'golos_marcados' => 'required|integer',
            'epoca' => 'required|integer',
            'media_golos' => 'required|numeric'
        ]);

        $estatistica = EstatisticaAtleta::create($validated);
        return response()->json([
            'success' => true,
            'message' => 'Estatística criada com sucesso!',
            'data' => $estatistica->load('atleta')
        ], 201);
    }

    public function show($id)
    {
        $estatistica = EstatisticaAtleta::with('atleta')->find($id);
        if (!$estatistica) {
            return response()->json(['success' => false, 'message' => 'Estatística não encontrada'], 404);
        }
        return response()->json(['success' => true, 'data' => $estatistica]);
    }

    public function update(Request $request, $id)
    {
        $estatistica = EstatisticaAtleta::find($id);
        if (!$estatistica) {
            return response()->json(['success' => false, 'message' => 'Estatística não encontrada'], 404);
        }

        $validated = $request->validate([
            'atleta_id' => 'sometimes|exists:atletas,id',
            'golos_marcados' => 'sometimes|integer',
            'epoca' => 'sometimes|integer',
            'media_golos' => 'sometimes|numeric'
        ]);

        $estatistica->update($validated);
        return response()->json([
            'success' => true,
            'message' => 'Estatística atualizada com sucesso!',
            'data' => $estatistica->load('atleta')
        ]);
    }

    public function destroy($id)
    {
        $estatistica = EstatisticaAtleta::find($id);
        if (!$estatistica) {
            return response()->json(['success' => false, 'message' => 'Estatística não encontrada'], 404);
        }

        $estatistica->delete();
        return response()->json(['success' => true, 'message' => 'Estatística apagada com sucesso!']);
    }
}
