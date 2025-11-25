<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jogada;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth; // ✅ ADICIONAR ESTE IMPORT

class JogadaController extends Controller
{
    public function index(): JsonResponse
    {
        // ✅ SOLUÇÃO TEMPORÁRIA: Mostrar TODAS as jogadas
        $jogadas = Jogada::with(['equipa', 'user', 'comentarios'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['success' => true, 'data' => $jogadas]);
    }

    public function store(Request $request): JsonResponse
    {
        // ✅ DEBUG: Ver o que está a chegar
        \Log::info('📥 DADOS RECEBIDOS NA JOGADA:', $request->all());

        // ✅ VALIDAÇÃO COMPLETA com TODOS os campos
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',      // ✅ ADICIONAR
            'equipa_id' => 'required|exists:equipas,id',
            'titulo' => 'required|string|max:255',
            'descricao' => 'required|string',
            'ficheiro' => 'required|string',                      // ✅ MUDAR para required
            'data_upload' => 'required|date'                      // ✅ ADICIONAR
        ]);

        \Log::info('✅ DADOS VALIDADOS:', $validated);

        // ✅ CRIAR JOGADA com TODOS os dados
        $jogada = Jogada::create($validated);

        \Log::info('🎯 JOGADA CRIADA:', $jogada->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Jogada criada com sucesso!',
            'data' => $jogada->load('equipa')
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $jogada = Jogada::with(['equipa'])->find($id);

        if (!$jogada) {
            return response()->json([
                'success' => false,
                'message' => 'Jogada não encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $jogada
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $jogada = Jogada::find($id);

        if (!$jogada) {
            return response()->json([
                'success' => false,
                'message' => 'Jogada não encontrada'
            ], 404);
        }

        $validated = $request->validate([
            'equipa_id' => 'sometimes|exists:equipas,id',
            'titulo' => 'sometimes|string|max:255',
            'descricao' => 'sometimes|string',
            'ficheiro' => 'nullable|string'
        ]);

        $jogada->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Jogada atualizada com sucesso!',
            'data' => $jogada->load('equipa')
        ]);
    }

    public function destroy($id): JsonResponse
    {
        \Log::info('🗑️ [DELETE START] Iniciando delete da jogada:', ['id' => $id]);

        try {
            // ✅ SOLUÇÃO TEMPORÁRIA: Ignorar autenticação
            $jogada = Jogada::find($id);

            \Log::info('🔍 [DELETE DEBUG] Jogada encontrada:', [
                'exists' => !!$jogada,
                'jogada_id' => $jogada ? $jogada->id : 'NULL',
                'titulo' => $jogada ? $jogada->titulo : 'NULL'
            ]);

            if (!$jogada) {
                \Log::warning('❌ [DELETE ERROR] Jogada não encontrada:', ['id' => $id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Jogada não encontrada'
                ], 404);
            }

            \Log::info('✅ [DELETE SUCCESS] A apagar jogada:', [
                'jogada_id' => $jogada->id,
                'titulo' => $jogada->titulo,
                'user_id' => $jogada->user_id
            ]);

            // ✅ PERMITIR A TODOS TEMPORARIAMENTE
            $jogada->delete();

            \Log::info('🎉 [DELETE COMPLETE] Jogada apagada com sucesso');

            return response()->json([
                'success' => true,
                'message' => 'Jogada apagada com sucesso!'
            ]);
        } catch (\Exception $e) {
            \Log::error('💥 [DELETE EXCEPTION] Erro ao apagar jogada:', [
                'id' => $id,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro interno do servidor: ' . $e->getMessage()
            ], 500);
        }
    }
    // ✅ ADICIONAR: MÉTODOS ACL PRIVADOS
    private function podeApagarJogada(Jogada $jogada, $user): bool
    {
        \Log::info('🔐 [ACL DEBUG] Verificando permissões:', [
            'user_id' => $user->id,
            'user_tipo' => $user->tipo,
            'jogada_user_id' => $jogada->user_id,
            'jogada_id' => $jogada->id
        ]);

        // Se não há user autenticado, não pode apagar
        if (!$user) {
            return false;
        }

        // Regra 1: Dono da jogada
        if ($jogada->user_id == $user->id) { // ← USA == EM VEZ DE ===
            \Log::info('✅ [ACL] É dono da jogada');
            return true;
        }

        // Regra 2: Treinador (pode apagar qualquer jogada da equipa)
        if ($user->tipo === 'treinador') {
            \Log::info('✅ [ACL] É treinador');
            return true;
        }

        \Log::info('❌ [ACL] Sem permissões');
        return false;
    }
    private function getAuthenticatedUser()
    {
        // Tentar autenticação por token primeiro
        if ($tokenUser = Auth::guard('sanctum')->user()) {
            return $tokenUser;
        }

        // Tentar autenticação normal
        if ($sessionUser = Auth::user()) {
            return $sessionUser;
        }

        return null;
    }
}
