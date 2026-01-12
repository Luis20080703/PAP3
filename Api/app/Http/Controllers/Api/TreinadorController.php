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
    public function pending()
    {

        $pendentes = Treinador::with('user')
            ->whereHas('user', function ($q) {
                $q->where('validado', false);
            })
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pendentes
        ]);
    }
    public function approve($id)
    {
        $treinador = Treinador::with('user')->find($id);
        if (!$treinador) {
            return response()->json(['success' => false, 'message' => 'Treinador não encontrado'], 404);
        }

        // Mark both treinador and the related user as validated
        $treinador->validado = true;
        $treinador->save();

        if ($treinador->user) {
            $treinador->user->validado = true;
            $treinador->user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Treinador aprovado com sucesso!',
            'data' => $treinador->load('user')
        ]);
    }

    /**
     * Get pending athletes for the authenticated trainer's team.
     */
    public function getPendingAthletes(Request $request)
    {
        $user = $request->user();
        
        // Ensure user is a trainer
        if ($user->tipo !== 'treinador') {
            return response()->json(['success' => false, 'message' => 'Apenas treinadores podem ver atletas pendentes.'], 403);
        }

        $treinador = \App\Models\Treinador::where('user_id', $user->id)->first();
        
        $equipaId = null;

        if ($treinador) {
            $equipaId = $treinador->equipa_id;
        } else {
            // ✅ Fallback: Se o perfil de treinador não existe, tentamos encontrar a equipa pelo nome no user
            Log::info('Perfil de treinador em falta, a tentar recuperar via equipa-string', ['user_id' => $user->id, 'equipa' => $user->equipa]);
            
                if (!empty($user->equipa)) {
                    $equipa = \App\Models\Equipa::where('nome', $user->equipa)->first();
                    if ($equipa) {
                        $equipaId = $equipa->id;
                        
                        // ✅ Auto-reparação: Criar o perfil de treinador em falta
                        $epoca = \App\Models\Epoca::first();
                        if ($epoca) {
                            \App\Models\Treinador::create([
                                'user_id' => $user->id,
                                'equipa_id' => $equipaId,
                                'epoca_id' => $epoca->id,
                                'validado' => $user->validado
                            ]);
                        }
                    }
                }
            }

        if (!$equipaId) {
             return response()->json(['success' => false, 'message' => 'Não foi possível determinar a sua equipa. Contacte o administrador.'], 404);
        }

        // Fetch athletes for this team where the USER is not validated
        // Note: 'validado' is on the users table.
        $athletes = \App\Models\Atleta::with(['user'])
            ->where('equipa_id', $equipaId)
            ->whereHas('user', function ($query) {
                $query->where('validado', false);
            })
            ->get();

        return response()->json([
            'success' => true,
            'data' => $athletes
        ]);
    }

    /**
     * Approve a pending athlete.
     */
    public function approveAthlete($athleteId)
    {
        // $athleteId is the ID of the Atleta record
        $atleta = \App\Models\Atleta::with('user')->find($athleteId);
        
        if (!$atleta) {
             return response()->json(['success' => false, 'message' => 'Atleta não encontrado.'], 404);
        }

        // Validate the user
        if ($atleta->user) {
            $atleta->user->validado = true;
            $atleta->user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Atleta aprovado com sucesso!'
        ]);
    }

    /**
     * Reject (delete) a pending athlete.
     */
    public function rejectAthlete($athleteId)
    {
         $atleta = \App\Models\Atleta::with('user')->find($athleteId);

         if (!$atleta) {
             return response()->json(['success' => false, 'message' => 'Atleta não encontrado.'], 404);
         }

         // Delete the USER (which should cascade delete the atleta profile usually, 
         // but if not configured, we manually delete user. 
         // Safest is to delete User.)
         if ($atleta->user) {
             $atleta->user->delete();
         } else {
             // If orphaned atleta record
             $atleta->delete();
         }

         return response()->json([
             'success' => true,
             'message' => 'Pedido rejeitado e utilizador removido.'
         ]);
    }
}
