<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dica;
use Illuminate\Http\Request;

class DicaController extends Controller
{
    public function index()
    {
        $dicas = Dica::with('user')->get();
        return response()->json(['success' => true, 'data' => $dicas]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'titulo' => 'required|string|max:255',
            'conteudo' => 'required|string',
            'categoria' => 'required|in:finta,drible,remate,defesa,táctica', // ✅ ADICIONADO
            'ficheiro' => 'nullable|string'
        ]);

        $dica = Dica::create($validated);
        return response()->json([
            'success' => true,
            'message' => 'Dica criada com sucesso!',
            'data' => $dica->load('user')
        ], 201);
    }

    public function show($id)
    {
        $dica = Dica::with('user')->find($id);
        if (!$dica) {
            return response()->json(['success' => false, 'message' => 'Dica não encontrada'], 404);
        }
        return response()->json(['success' => true, 'data' => $dica]);
    }

    public function update(Request $request, $id)
    {
        $dica = Dica::find($id);
        if (!$dica) {
            return response()->json(['success' => false, 'message' => 'Dica não encontrada'], 404);
        }

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'titulo' => 'sometimes|string|max:255',
            'conteudo' => 'sometimes|string',
            'categoria' => 'sometimes|in:finta,drible,remate,defesa,táctica', // ✅ ADICIONADO
            'ficheiro' => 'nullable|string'
        ]);

        $dica->update($validated);
        return response()->json([
            'success' => true,
            'message' => 'Dica atualizada com sucesso!',
            'data' => $dica->load('user')
        ]);
    }

    public function destroy($id)
    {
        $dica = Dica::find($id);
        if (!$dica) {
            return response()->json(['success' => false, 'message' => 'Dica não encontrada'], 404);
        }

        $dica->delete();
        return response()->json(['success' => true, 'message' => 'Dica apagada com sucesso!']);
    }
}
