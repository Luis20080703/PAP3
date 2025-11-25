<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Epoca;
use Illuminate\Http\Request;

class EpocaController extends Controller
{
    public function index()
    {
        $epocas = Epoca::all();
        return response()->json(['success' => true, 'data' => $epocas]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date|after:data_inicio'
        ]);

        $epoca = Epoca::create($validated);
        return response()->json([
            'success' => true,
            'message' => 'Época criada com sucesso!',
            'data' => $epoca
        ], 201);
    }

    public function show($id)
    {
        $epoca = Epoca::find($id);
        if (!$epoca) {
            return response()->json(['success' => false, 'message' => 'Época não encontrada'], 404);
        }
        return response()->json(['success' => true, 'data' => $epoca]);
    }

    public function update(Request $request, $id)
    {
        $epoca = Epoca::find($id);
        if (!$epoca) {
            return response()->json(['success' => false, 'message' => 'Época não encontrada'], 404);
        }

        $validated = $request->validate([
            'data_inicio' => 'sometimes|date',
            'data_fim' => 'sometimes|date|after:data_inicio'
        ]);

        $epoca->update($validated);
        return response()->json([
            'success' => true,
            'message' => 'Época atualizada com sucesso!',
            'data' => $epoca
        ]);
    }

    public function destroy($id)
    {
        $epoca = Epoca::find($id);
        if (!$epoca) {
            return response()->json(['success' => false, 'message' => 'Época não encontrada'], 404);
        }

        $epoca->delete();
        return response()->json(['success' => true, 'message' => 'Época apagada com sucesso!']);
    }
}
