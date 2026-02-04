<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Treinador;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\AccountApproved;

/**
 * Controller para funcionalidades administrativas (API).
 *
 * Funcionalidades principais implementadas:
 *  - Apenas utilizadores com `tipo = 'admin'` (ou 'root') podem aceder.
 *  - Listar treinadores pendentes de validação.
 *  - Validar um treinador (marcar `validado = true`).
 *  - Endpoint de resumo para o dashboard.
 */
class AdminController extends Controller
{
    public function __construct()
    {
        // Aplica autenticação (session / sanctum conforme a app)
        $this->middleware('auth');
    }

    /**
     * Validação interna para garantir que o utilizador é admin/root.
     * Lança 403 se não for.
     */
    protected function authorizeAdmin(): void
    {
        $user = Auth::user();
        if (!$user || !in_array($user->tipo, ['admin', 'root'])) {
            Log::warning('Acesso admin negado', ['user_id' => $user->id ?? null]);
            abort(403, 'Acesso negado');
        }
    }

    /**
     * Lista todos os utilizadores do sistema.
     */
    public function getUsers()
    {
        $this->authorizeAdmin();
        $users = User::withCount(['atletas', 'treinadores'])->get();
        return response()->json(['success' => true, 'data' => $users]);
    }

    public function updateUserRole(Request $request, $id)
    {
        $this->authorizeAdmin();
        $validated = $request->validate([
            'tipo' => 'sometimes|in:atleta,treinador,admin',
            'nome' => 'sometimes|string|max:255',
            'equipa' => 'sometimes|string|nullable'
        ]);
        
        $user = User::findOrFail($id);
        
        if (isset($validated['tipo'])) $user->tipo = $validated['tipo'];
        if (isset($validated['nome'])) $user->nome = $validated['nome'];
        if (isset($validated['equipa'])) $user->equipa = $validated['equipa'];
        
        $user->save();

        // ✅ Sincronizar perfis (Treinador/Atleta) para evitar erros de 404
        $equipa = null;
        if (!empty($user->equipa)) {
            $equipa = \App\Models\Equipa::where('nome', $user->equipa)->first();
        }
        
        // Se não encontrar equipa pelo nome, pega a primeira disponível se for obrigatório
        if (!$equipa && ($user->tipo === 'atleta' || $user->tipo === 'treinador')) {
            $equipa = \App\Models\Equipa::first();
        }

        $epoca = \App\Models\Epoca::first() ?? \App\Models\Epoca::create(['ano' => now()->year]);

        if ($user->tipo === 'treinador') {
            \App\Models\Treinador::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'equipa_id' => $equipa->id ?? null,
                    'epoca_id' => $epoca->id ?? null,
                    'validado' => $user->validado
                ]
            );
        } elseif ($user->tipo === 'atleta') {
            \App\Models\Atleta::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'equipa_id' => $equipa->id ?? null,
                    'epoca_id' => $epoca->id ?? null,
                    'posicao' => 'Central', // Default
                    'numero' => 0
                ]
            );
        }
        
        return response()->json(['success' => true, 'message' => 'Utilizador e perfis atualizados com sucesso']);
    }

    /**
     * Alterna o estado premium de um utilizador.
     */
    public function togglePremium($id)
    {
        $this->authorizeAdmin();
        $user = User::findOrFail($id);
        $user->is_premium = !$user->is_premium;
        $user->save();
        
        return response()->json([
            'success' => true, 
            'message' => $user->is_premium ? 'Premium ativado' : 'Premium desativado',
            'data' => ['is_premium' => $user->is_premium]
        ]);
    }

    /**
     * Elimina um utilizador e dependências.
     */
    /**
     * Elimina um utilizador e dependências.
     */
    public function deleteUser($id)
    {
        $this->authorizeAdmin();
        $user = User::findOrFail($id);
        
        if ($user->id === Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Não podes apagar a tua própria conta'], 400);
        }

        try {
            \Illuminate\Support\Facades\DB::transaction(function () use ($user) {
                // 1. Apagar conteúdos criados pelo user
                $user->jogadas()->delete();
                $user->dicas()->delete();
                $user->comentarios()->delete();

                // 2. Apagar perfis associados
                // Nota: Se 'atletas' tiver foreign keys noutras tabelas (ex: estatisticas), 
                // pode ser necessário limpar isso também aqui se o cascade não estiver na DB.
                $user->atletas()->delete(); 
                $user->treinadores()->delete();

                // 3. Finalmente apagar o user
                $user->delete();
            });

            return response()->json(['success' => true, 'message' => 'Utilizador e dados associados removidos com sucesso']);

        } catch (\Exception $e) {
            Log::error('Erro ao apagar utilizador: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao apagar utilizador: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Estatísticas globais para o dashboard.
     */
    public function getStats()
    {
        $this->authorizeAdmin();
        
        return response()->json([
            'success' => true,
            'data' => [
                'users' => User::count(),
                'atletas' => \App\Models\Atleta::count(),
                'treinadores' => Treinador::count(),
                'jogadas' => \App\Models\Jogada::count(),
                'dicas' => \App\Models\Dica::count(),
                'comentarios' => \App\Models\Comentario::count(),
                'pendentes' => User::where('validado', false)->whereIn('tipo', ['treinador', 'atleta'])->count()
            ]
        ]);
    }

    /**
     * Elimina conteúdo (jogadas, dicas, comentários).
     */
    public function deleteContent($type, $id)
    {
        $this->authorizeAdmin();
        
        $model = match($type) {
            'jogada' => \App\Models\Jogada::find($id),
            'dica' => \App\Models\Dica::find($id),
            'comentario' => \App\Models\Comentario::find($id),
            default => null
        };

        if (!$model) {
            return response()->json(['success' => false, 'message' => 'Conteúdo não encontrado'], 404);
        }

        $model->delete();
        return response()->json(['success' => true, 'message' => 'Conteúdo removido com sucesso']);
    }

    /**
     * Lista treinadores pendentes (validado = false).
     */
    public function getPendingTreinadores()
    {
        $this->authorizeAdmin();

        $treinadores = Treinador::with(['user', 'equipa'])
            ->where('validado', false)
            ->get();

        return response()->json(['success' => true, 'data' => $treinadores]);
    }

    /**
     * Valida um treinador pelo ID do treinador.
     */
    public function validateTreinador(Request $request, $userId)
    {
        $this->authorizeAdmin();

        try {
            // Frontend envia o User ID (u.id), então buscamos o treinador associado a esse user
            $treinador = Treinador::with('user')->where('user_id', $userId)->first();

            if (!$treinador) {
                // Fallback: se não encontrar por user_id, tenta pelo ID direto (caso venha de outra interface)
                $treinador = Treinador::with('user')->find($userId);
            }

            if (!$treinador) {
                return response()->json(['success' => false, 'message' => 'Perfil de treinador não encontrado para este utilizador'], 404);
            }

            if ($treinador->validado) {
                return response()->json(['success' => false, 'message' => 'Treinador já está validado'], 400);
            }

            // Mark treinador record as validated
            $treinador->validado = true;
            $treinador->save();

            // Also ensure the related User record is marked validated so they can log in
            if ($treinador->user) {
                $treinador->user->validado = true;
                $treinador->user->save();

                try {
                    Mail::to($treinador->user->email)->send(new AccountApproved($treinador->user));
                } catch (\Exception $e) {
                    Log::error('Erro ao enviar email de aprovação: ' . $e->getMessage());
                }
            }

            Log::info('Treinador validado pelo admin', ['treinador_id' => $treinador->id, 'admin_id' => Auth::id(), 'user_validado' => $treinador->user->validado ?? null]);

            return response()->json(['success' => true, 'message' => 'Treinador validado com sucesso', 'data' => $treinador->load("user")]);
        } catch (\Exception $e) {
            Log::error('Erro a validar treinador: ' . $e->getMessage(), ['user_id' => $userId]);
            return response()->json(['success' => false, 'message' => 'Erro interno ao validar treinador'], 500);
        }
    }

    /**
     * Lista atletas pendentes (validado = false).
     */
    public function getPendingAthletes()
    {
        $this->authorizeAdmin();

        $atletas = \App\Models\Atleta::with(['user', 'equipa'])
            ->whereHas('user', function ($q) {
                $q->where('validado', false);
            })
            ->get();

        return response()->json(['success' => true, 'data' => $atletas]);
    }

    /**
     * Valida um utilizador genericamente (Treinador ou Atleta).
     */
    public function validateUser(Request $request, $id)
    {
        $this->authorizeAdmin();

        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Utilizador não encontrado'], 404);
        }

        if ($user->validado) {
            return response()->json(['success' => false, 'message' => 'Utilizador já está validado'], 400);
        }

        $user->validado = true;
        $user->save();

        try {
            Mail::to($user->email)->send(new AccountApproved($user));
        } catch (\Exception $e) {
            Log::error('Erro ao enviar email de aprovação: ' . $e->getMessage());
        }
        
        
        // Se for treinador, também validamos o registo na tabela 'treinadores'
        if ($user->tipo === 'treinador') {
            $treinador = Treinador::where('user_id', $user->id)->first();
            if ($treinador) {
                $treinador->validado = true;
                $treinador->save();
            }
        }

        // Se for atleta, nada mais a fazer na tabela atletas pois 'validado' está no user
        // (mas se tivéssemos lá um campo, atualizaríamos aqui também)

        Log::info('Utilizador validado pelo admin', ['target_id' => $user->id, 'admin_id' => Auth::id()]);

        return response()->json(['success' => true, 'message' => 'Utilizador validado com sucesso']);
    }

    /**
     * Alterna o estado de validação de um utilizador.
     */
    public function toggleValidation($id)
    {
        $this->authorizeAdmin();
        $user = User::findOrFail($id);
        $user->validado = !$user->validado;
        $user->save();

        if ($user->tipo === 'treinador') {
            $treinador = Treinador::where('user_id', $user->id)->first();
            if ($treinador) {
                $treinador->validado = $user->validado;
                $treinador->save();
            }
        }

        return response()->json([
            'success' => true,
            'message' => $user->validado ? 'Utilizador ativado' : 'Utilizador desativado',
            'data' => ['validado' => $user->validado]
        ]);
    }

    /**
     * Endpoint para dados iniciais do dashboard admin (contagens, etc.).
     */
    public function dashboard()
    {
        return $this->getStats();
    }
}
