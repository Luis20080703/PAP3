<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Treinador;
use Illuminate\Http\Request;

class TreinadorController extends Controller
{
    public function index()
    {
        $treinadores = Treinador::with(['user', 'equipa', 'epoca'])->get();
        return response()->json(['success' => true, 'data' => $treinadores]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'equipa_id' => 'required|exists:equipas,id',
            'epoca_id' => 'required|exists:epocas,id'
        ]);

        $treinador = Treinador::create($validated);
        return response()->json([
            'success' => true,
            'message' => 'Treinador criado com sucesso!',
            'data' => $treinador->load(['user', 'equipa', 'epoca'])
        ], 201);
    }

    public function show($id)
    {
        $treinador = Treinador::with(['user', 'equipa', 'epoca'])->find($id);
        if (!$treinador) {
            return response()->json(['success' => false, 'message' => 'Treinador não encontrado'], 404);
        }
        return response()->json(['success' => true, 'data' => $treinador]);
    }

    public function update(Request $request, $id)
    {
        $treinador = Treinador::find($id);
        if (!$treinador) {
            return response()->json(['success' => false, 'message' => 'Treinador não encontrado'], 404);
        }

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'equipa_id' => 'sometimes|exists:equipas,id',
            'epoca_id' => 'sometimes|exists:epocas,id'
        ]);

        $treinador->update($validated);
        return response()->json([
            'success' => true,
            'message' => 'Treinador atualizado com sucesso!',
            'data' => $treinador->load(['user', 'equipa', 'epoca'])
        ]);
    }

    public function destroy($id)
    {
        $treinador = Treinador::find($id);
        if (!$treinador) {
            return response()->json(['success' => false, 'message' => 'Treinador não encontrado'], 404);
        }

        $treinador->delete();
        return response()->json(['success' => true, 'message' => 'Treinador apagado com sucesso!']);
    }
}
