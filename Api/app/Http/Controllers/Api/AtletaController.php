<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Atleta;
use Illuminate\Http\Request;

class AtletaController extends Controller
{
    public function index()
    {
        $atletas = Atleta::with(['user', 'equipa', 'epoca'])->get();
        return response()->json(['success' => true, 'data' => $atletas]);
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
        $atleta = Atleta::find($id);
        if (!$atleta) {
            return response()->json(['success' => false, 'message' => 'Atleta não encontrado'], 404);
        }

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'equipa_id' => 'sometimes|exists:equipas,id',
            'epoca_id' => 'sometimes|exists:epocas,id',
            'posicao' => 'sometimes|string|max:255',
            'numero' => 'sometimes|integer'
        ]);

        $atleta->update($validated);
        return response()->json([
            'success' => true,
            'message' => 'Atleta atualizado com sucesso!',
            'data' => $atleta->load(['user', 'equipa', 'epoca'])
        ]);
    }

    public function destroy($id)
    {
        $atleta = Atleta::find($id);
        if (!$atleta) {
            return response()->json(['success' => false, 'message' => 'Atleta não encontrado'], 404);
        }

        $atleta->delete();
        return response()->json(['success' => true, 'message' => 'Atleta apagado com sucesso!']);
    }
}
