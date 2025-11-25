<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Escalao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EscalaoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            Log::info('📋 Buscando todos os escalões');
            $escaloes = Escalao::all();

            Log::info('✅ Escalões encontrados: ' . $escaloes->count());
            return response()->json([
                'success' => true,
                'data' => $escaloes,
                'count' => $escaloes->count()
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Erro ao buscar escalões: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erro ao carregar escalões'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('📝 Criando novo escalão:', $request->all());

        try {
            $validated = $request->validate([
                'nome' => 'required|string|max:255|unique:escalaos,nome',
                'idade_min' => 'nullable|integer|min:0',
                'idade_max' => 'nullable|integer|min:0|gt:idade_min',
                'descricao' => 'nullable|string|max:500'
            ]);

            $escalao = Escalao::create($validated);

            Log::info('✅ Escalão criado com sucesso - ID: ' . $escalao->id);
            return response()->json([
                'success' => true,
                'message' => 'Escalão criado com sucesso!',
                'data' => $escalao
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('❌ Erro de validação ao criar escalão: ' . json_encode($e->errors()));
            return response()->json([
                'success' => false,
                'message' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ Erro ao criar escalão: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar escalão'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        Log::info('🔍 Buscando escalão ID: ' . $id);

        try {
            $escalao = Escalao::find($id);

            if (!$escalao) {
                Log::warning('❌ Escalão não encontrado - ID: ' . $id);
                return response()->json([
                    'success' => false,
                    'message' => 'Escalão não encontrado'
                ], 404);
            }

            Log::info('✅ Escalão encontrado: ' . $escalao->nome);
            return response()->json([
                'success' => true,
                'data' => $escalao
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Erro ao buscar escalão ID ' . $id . ': ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erro ao carregar escalão'
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        Log::info('✏️ Atualizando escalão ID: ' . $id, $request->all());

        try {
            $escalao = Escalao::find($id);

            if (!$escalao) {
                Log::warning('❌ Escalão não encontrado para atualização - ID: ' . $id);
                return response()->json([
                    'success' => false,
                    'message' => 'Escalão não encontrado'
                ], 404);
            }

            $validated = $request->validate([
                'nome' => 'sometimes|string|max:255|unique:escalaos,nome,' . $id,
                'idade_min' => 'nullable|integer|min:0',
                'idade_max' => 'nullable|integer|min:0|gt:idade_min',
                'descricao' => 'nullable|string|max:500'
            ]);

            $escalao->update($validated);

            Log::info('✅ Escalão atualizado com sucesso - ID: ' . $id);
            return response()->json([
                'success' => true,
                'message' => 'Escalão atualizado com sucesso!',
                'data' => $escalao
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('❌ Erro de validação ao atualizar escalão: ' . json_encode($e->errors()));
            return response()->json([
                'success' => false,
                'message' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ Erro ao atualizar escalão ID ' . $id . ': ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar escalão'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        Log::info('🗑️ Apagando escalão ID: ' . $id);

        try {
            $escalao = Escalao::find($id);

            if (!$escalao) {
                Log::warning('❌ Escalão não encontrado para exclusão - ID: ' . $id);
                return response()->json([
                    'success' => false,
                    'message' => 'Escalão não encontrado'
                ], 404);
            }

            // ✅ VERIFICA SE EXISTEM EQUIPAS ASSOCIADAS ANTES DE APAGAR
            if ($escalao->equipas && $escalao->equipas->count() > 0) {
                Log::warning('⚠️ Não é possível apagar escalão com equipas associadas - ID: ' . $id);
                return response()->json([
                    'success' => false,
                    'message' => 'Não é possível apagar escalão com equipas associadas'
                ], 422);
            }

            $escalao->delete();

            Log::info('✅ Escalão apagado com sucesso - ID: ' . $id);
            return response()->json([
                'success' => true,
                'message' => 'Escalão apagado com sucesso!'
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Erro ao apagar escalão ID ' . $id . ': ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erro ao apagar escalão'
            ], 500);
        }
    }

    /**
     * Get escalões with equipas count
     */
    public function withEquipasCount()
    {
        try {
            Log::info('📊 Buscando escalões com contagem de equipas');
            $escaloes = Escalao::withCount('equipas')->get();

            Log::info('✅ Escalões com contagem encontrados: ' . $escaloes->count());
            return response()->json([
                'success' => true,
                'data' => $escaloes
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Erro ao buscar escalões com contagem: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erro ao carregar escalões'
            ], 500);
        }
    }
}
