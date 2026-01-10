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
        $user = $this->getAuthenticatedUser();
        
        // Se for admin ou root, vê tudo
        if ($user && in_array($user->tipo, ['admin', 'root'])) {
             $jogadas = Jogada::with(['equipa', 'user', 'comentarios'])
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
             // Se for atleta/treinador, vê apenas da sua equipa + públicas (se houver conceito de públicas)
             // Neste caso assumimos que vê apenas da sua equipa
             $equipaId = null;
             
             // Tentar obter equipa_id do user ( assumindo que user tem equipa pelo nome ou relação direta )
             // Como a BD usa nomes nos users mas IDs nas jogadas, precisamos resolver isso.
             // O ideal era o user ter equipa_id, mas vamos buscar pelo nome
             
             if ($user && $user->equipa) {
                 $equipa = \App\Models\Equipa::where('nome', $user->equipa)->first();
                 $equipaId = $equipa ? $equipa->id : null;
             }
             
             if ($equipaId) {
                 $jogadas = Jogada::with(['equipa', 'user', 'comentarios'])
                    ->where('equipa_id', $equipaId)
                    ->orderBy('created_at', 'desc')
                    ->get();
             } else {
                 $jogadas = []; // Sem equipa, sem jogadas
             }
        }

        return response()->json(['success' => true, 'data' => $jogadas]);
    }

    public function store(Request $request): JsonResponse
    {
        \Log::info('📥 DADOS RECEBIDOS NA JOGADA:', $request->all());

        // ✅ VALIDAÇÃO PARA UPLOAD DE FICHEIROS
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'equipa_id' => 'required|integer|exists:equipas,id',
            'titulo' => 'required|string|max:255',
            'descricao' => 'required|string',
            'video' => 'nullable|file|mimes:mp4,avi,mov,wmv|max:50000', // 50MB max
            'ficheiro' => 'nullable|string'
        ]);

        \Log::info('✅ DADOS VALIDADOS:', $validated);

        $videoPath = null;
        
        // ✅ PROCESSAR UPLOAD DE VÍDEO
        if ($request->hasFile('video')) {
            $video = $request->file('video');
            $videoName = time() . '_' . $video->getClientOriginalName();
            $videoPath = $video->storeAs('videos', $videoName, 'public');
            \Log::info('📹 VÍDEO GUARDADO:', ['path' => $videoPath]);
        }

        // ✅ CRIAR JOGADA
        $jogada = Jogada::create([
            'user_id' => $validated['user_id'],
            'equipa_id' => $validated['equipa_id'],
            'titulo' => $validated['titulo'],
            'descricao' => $validated['descricao'],
            'ficheiro' => $videoPath ?? $validated['ficheiro'] ?? 'default.mp4',
            'data_upload' => now()
        ]);

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

            $user = $this->getAuthenticatedUser();

            // ✅ VERIFICAÇÃO DE PERMISSÕES RESTAURADA
            if (!$this->podeApagarJogada($jogada, $user)) {
                 \Log::warning('⛔ [DELETE ACCESS DENIED]', ['user' => $user->id, 'jogada' => $id]);
                 return response()->json([
                     'success' => false,
                     'message' => 'Não tem permissão para apagar esta jogada'
                 ], 403);
            }

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
            'user_equipa' => $user->equipa,
            'jogada_user_id' => $jogada->user_id,
            'jogada_equipa_id' => $jogada->equipa_id,
            'jogada_id' => $jogada->id
        ]);

        // Se não há user autenticado, não pode apagar
        if (!$user) {
            return false;
        }

        // Regra 1: Admin pode apagar qualquer jogada
        if ($user->tipo === 'admin') {
            \Log::info('✅ [ACL] É admin - pode apagar tudo');
            return true;
        }

        // Regra 2: Dono da jogada
        if ($jogada->user_id == $user->id) {
            \Log::info('✅ [ACL] É dono da jogada');
            return true;
        }

        // Regra 3: Treinador só pode apagar jogadas da sua equipa
        if ($user->tipo === 'treinador') {
            // Verificar se a jogada é da mesma equipa do treinador
            $jogadaEquipa = $jogada->equipa;
            if ($jogadaEquipa && $jogadaEquipa->nome === $user->equipa) {
                \Log::info('✅ [ACL] Treinador da mesma equipa');
                return true;
            } else {
                \Log::info('❌ [ACL] Treinador de equipa diferente');
                return false;
            }
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
