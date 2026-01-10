<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EstatisticaAtleta;
use App\Models\Atleta;
use App\Models\Treinador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class EstatisticaAtletaController extends Controller
{
    // ✅ 1. Listar TODAS as estatísticas (Público - para TeamStats e Rankings)
    public function index()
    {
        try {
            // ✅ FORÇAR O USO DO GUARD SANCTUM (pois a rota é publica no api.php)
            $user = Auth::guard('sanctum')->user();
            
            // Se não autenticado, não mostra nada (proteção de privacidade)
            if (!$user) {
                return response()->json(['success' => true, 'data' => []]);
            }
            
            // Query base
            $query = EstatisticaAtleta::with(['atleta', 'atleta.user', 'atleta.equipa'])
                ->orderBy('golos_marcados', 'desc');

            // Filtragem por ACL (Se não for Admin/Root nem Premium, filtra pela equipa)
            // ✅ Treinadores Premium veem tudo
            $canSeeAll = in_array($user->tipo, ['admin', 'root']) || ($user->tipo === 'treinador' && $user->is_premium);

            if (!$canSeeAll) {
                 $equipaId = null;
                 
                 // Resolver ID da equipa pelo nome (sincronização com User)
                 if ($user->equipa) {
                     $equipa = \App\Models\Equipa::where('nome', $user->equipa)->first();
                     $equipaId = $equipa ? $equipa->id : null;
                 }
                 
                 // Fallback: Tentar relaçao direta
                 if (!$equipaId) {
                      $atleta = $user->atletas()->first();
                      if ($atleta) $equipaId = $atleta->equipa_id;
                 }
                 if (!$equipaId) {
                      $treinador = $user->treinadores()->first();
                      if ($treinador) $equipaId = $treinador->equipa_id;
                 }
                 
                 if ($equipaId) {
                     // Filtrar onde o atleta pertence à equipa do user
                     $query->whereHas('atleta', function($q) use ($equipaId) {
                         $q->where('equipa_id', $equipaId);
                     });
                 } else {
                     // Se user nao tem equipa, nao ve nada
                     return response()->json(['success' => true, 'data' => []]);
                 }
            }

            $estatisticas = $query->get();

            return response()->json(['success' => true, 'data' => $estatisticas]);
        } catch (\Exception $e) {
            Log::error('❌ Erro em index (public) EstatisticaAtleta: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao carregar estatísticas públicas'], 500);
        }
    }

    // ✅ 2. Mostrar estatísticas APENAS do atleta autenticado (Privado - Dashboard do Atleta)
    public function showMyStats()
    {
        try {
            $user = Auth::user();
            if (!$user) return response()->json(['success' => false, 'message' => 'Não autenticado'], 401);

            // Buscar ou criar atleta automaticamente
            $atleta = Atleta::where('user_id', $user->id)->first();
            
            // Auto-criação se for atleta e não tiver perfil
            if (!$atleta && $user->tipo === 'atleta') {
                $equipa = \App\Models\Equipa::first();
                $epoca = \App\Models\Epoca::first();
                if ($equipa && $epoca) {
                    $atleta = Atleta::create([
                        'user_id' => $user->id,
                        'equipa_id' => $equipa->id, // Default
                        'epoca_id' => $epoca->id,
                        'posicao' => 'Avançado',
                        'numero' => 0
                    ]);
                }
            }

            if (!$atleta) {
                return response()->json(['success' => true, 'data' => []]); 
            }

            $estatisticas = EstatisticaAtleta::where('atleta_id', $atleta->id)
                ->with(['atleta', 'atleta.user', 'atleta.equipa'])
                ->get();

            return response()->json(['success' => true, 'data' => $estatisticas]);
        } catch (\Exception $e) {
            Log::error('❌ Erro em showMyStats: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao carregar minhas estatísticas'], 500);
        }
    }

    // Criar ou atualizar estatística do atleta autenticado
    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) return response()->json(['success' => false, 'message' => 'Não autenticado'], 401);

            // Buscar ou criar atleta automaticamente
            $atleta = Atleta::where('user_id', $user->id)->first();
            
            if (!$atleta && $user->tipo === 'atleta') {
                $equipa = \App\Models\Equipa::first();
                $epoca = \App\Models\Epoca::first();
                
                if ($equipa && $epoca) {
                    $atleta = Atleta::create([
                        'user_id' => $user->id,
                        'equipa_id' => $equipa->id,
                        'epoca_id' => $epoca->id,
                        'posicao' => 'Avançado',
                        'numero' => 0
                    ]);
                    Log::info('✅ Atleta auto-criado: user_id=' . $user->id);
                }
            }
            
            if (!$atleta) return response()->json(['success' => false, 'message' => 'Erro ao criar perfil de atleta'], 500);

            // ✅ Validar campos do frontend (camelCase)
            $validated = $request->validate([
                'golos' => 'required|integer|min:0',
                'cartoesAmarelos' => 'nullable|integer|min:0',
                'cartoesVermelhos' => 'nullable|integer|min:0',
                'doisMinutos' => 'nullable|integer|min:0',
            ]);

            // Buscar ou criar estatística da época atual
            $estatistica = EstatisticaAtleta::firstOrCreate(
                ['atleta_id' => $atleta->id, 'epoca' => date('Y')],
                [
                    'golos_marcados' => 0,
                    'cartoes_amarelos' => 0,
                    'cartoes_vermelhos' => 0,
                    'dois_minutos' => 0,
                    'jogos' => 0,
                    'media_golos' => 0
                ]
            );

            // Atualizar campos (adicionar valores do jogo atual)
            $estatistica->golos_marcados += $validated['golos'];
            $estatistica->cartoes_amarelos += $validated['cartoesAmarelos'] ?? 0;
            $estatistica->cartoes_vermelhos += $validated['cartoesVermelhos'] ?? 0;
            $estatistica->dois_minutos += $validated['doisMinutos'] ?? 0;
            $estatistica->jogos += 1;
            $estatistica->media_golos = round($estatistica->golos_marcados / max(1, $estatistica->jogos), 2);
            $estatistica->save();

            return response()->json([
                'success' => true,
                'message' => 'Estatística atualizada com sucesso!',
                'data' => $estatistica
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Erro de validação', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('❌ Erro ao criar/atualizar estatística: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro: ' . $e->getMessage()], 500);
        }
    }

    // Mostrar estatística individual (por ID) com permissão
    public function show($id)
    {
        try {
            $user = Auth::user();
            if (!$user) return response()->json(['success' => false, 'message' => 'Não autenticado'], 401);

            $estatistica = EstatisticaAtleta::with(['atleta', 'atleta.user', 'atleta.equipa'])->find($id);
            if (!$estatistica) return response()->json(['success' => false, 'message' => 'Estatística não encontrada'], 404);

            // Permissões
            if ($user->tipo === 'atleta') {
                $atleta = Atleta::where('user_id', $user->id)->first();
                if (!$atleta || $estatistica->atleta_id != $atleta->id)
                    return response()->json(['success' => false, 'message' => 'Não autorizado'], 403);
            }

            if ($user->tipo === 'treinador') {
                $treinador = $user->treinador ?? Treinador::where('user_id', $user->id)->first();
                if (!$treinador || $estatistica->atleta->equipa_id != $treinador->equipa_id)
                    return response()->json(['success' => false, 'message' => 'Não autorizado'], 403);
            }

            return response()->json(['success' => true, 'data' => $estatistica]);
        } catch (\Exception $e) {
            Log::error('❌ Erro em show EstatisticaAtleta: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao buscar estatística'], 500);
        }
    }

    // Atualizar estatística
    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            if (!$user) return response()->json(['success' => false, 'message' => 'Não autenticado'], 401);

            $estatistica = EstatisticaAtleta::find($id);
            if (!$estatistica) return response()->json(['success' => false, 'message' => 'Estatística não encontrada'], 404);

            // Permissões
            if ($user->tipo === 'atleta') {
                $atleta = Atleta::where('user_id', $user->id)->first();
                if (!$atleta || $estatistica->atleta_id != $atleta->id)
                    return response()->json(['success' => false, 'message' => 'Não autorizado'], 403);
            }

            if ($user->tipo === 'treinador') {
                $treinador = $user->treinador ?? Treinador::where('user_id', $user->id)->first();
                if (!$treinador || $estatistica->atleta->equipa_id != $treinador->equipa_id)
                    return response()->json(['success' => false, 'message' => 'Não autorizado'], 403);
            }

            // Validar campos camelCase do frontend
            $validated = $request->validate([
                'golos' => 'sometimes|integer|min:0',
                'cartoesAmarelos' => 'sometimes|integer|min:0',
                'cartoesVermelhos' => 'sometimes|integer|min:0',
                'doisMinutos' => 'sometimes|integer|min:0',
                'jogos' => 'sometimes|integer|min:0',
                'epoca' => 'sometimes|integer',
            ]);

            // Mapear camelCase → snake_case
            $dbUpdate = [];
            if (isset($validated['golos'])) $dbUpdate['golos_marcados'] = $validated['golos'];
            if (isset($validated['cartoesAmarelos'])) $dbUpdate['cartoes_amarelos'] = $validated['cartoesAmarelos'];
            if (isset($validated['cartoesVermelhos'])) $dbUpdate['cartoes_vermelhos'] = $validated['cartoesVermelhos'];
            if (isset($validated['doisMinutos'])) $dbUpdate['dois_minutos'] = $validated['doisMinutos'];
            if (isset($validated['jogos'])) $dbUpdate['jogos'] = $validated['jogos'];
            if (isset($validated['epoca'])) $dbUpdate['epoca'] = $validated['epoca'];

            $estatistica->update($dbUpdate);

            return response()->json([
                'success' => true,

                'message' => 'Estatística atualizada com sucesso!',
                'data' => $estatistica->load(['atleta', 'atleta.user', 'atleta.equipa'])
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Erro de validação', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('❌ Erro ao atualizar EstatisticaAtleta: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao atualizar estatística'], 500);
        }
    }

    // Apagar estatística
    public function destroy($id)
    {
        try {
            $user = Auth::user();
            if (!$user) return response()->json(['success' => false, 'message' => 'Não autenticado'], 401);

            $estatistica = EstatisticaAtleta::find($id);
            if (!$estatistica) return response()->json(['success' => false, 'message' => 'Estatística não encontrada'], 404);

            // Permissões
            if ($user->tipo === 'atleta') {
                $atleta = Atleta::where('user_id', $user->id)->first();
                if (!$atleta || $estatistica->atleta_id != $atleta->id)
                    return response()->json(['success' => false, 'message' => 'Não autorizado'], 403);
            }

            if ($user->tipo === 'treinador') {
                $treinador = $user->treinador ?? Treinador::where('user_id', $user->id)->first();
                if (!$treinador || $estatistica->atleta->equipa_id != $treinador->equipa_id)
                    return response()->json(['success' => false, 'message' => 'Não autorizado'], 403);
            }

            $estatistica->delete();

            return response()->json(['success' => true, 'message' => 'Estatística apagada com sucesso!']);
        } catch (\Exception $e) {
            Log::error('❌ Erro ao apagar EstatisticaAtleta: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao apagar estatística'], 500);
        }
    }
}
