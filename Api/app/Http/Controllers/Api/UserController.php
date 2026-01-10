<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Exceptions\MissingCredentialsException;
use App\Exceptions\InvalidCredentialsException;
use App\Exceptions\UserNotFoundException;
use App\Exceptions\AccountNotValidatedException;

class UserController extends Controller
{
    /**
     * Buscar todos os utilizadores
     */
    public function index()
    {
        $users = User::all();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Criar novo utilizador
     */
    public function store(Request $request)
    {
        Log::info('📝 [STORE] Request received', ['all' => $request->all()]);

        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'tipo' => 'required|in:atleta,treinador',
            'equipa' => 'required|string'
        ]);

        Log::info('✅ [STORE] Validated data', ['validated' => $validated]);

        // Create user
        $user = User::create([
            'nome' => $validated['nome'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'tipo' => $validated['tipo'],
            'validado' => false, // ✅ Atletas agora precisam de aprovação (igual a treinadores)
        ]);

        // Get equipa
        $equipa = \App\Models\Equipa::where('nome', $validated['equipa'])->first();
        if (!$equipa) {
            $equipa = \App\Models\Equipa::first();
        }

        // Get first epoca
        $epoca = \App\Models\Epoca::first() ?? \App\Models\Epoca::create(['ano' => now()->year]);

        // Create athlete or trainer profile
        if ($validated['tipo'] === 'atleta') {
            \App\Models\Atleta::create([
                'user_id' => $user->id,
                'equipa_id' => $equipa->id,
                'epoca_id' => $epoca->id,
                'posicao' => $request->input('posicao', 'Central'),
                'numero' => $request->input('numero', 0),
                'escalao' => $request->input('escalao')
            ]);
        } elseif ($validated['tipo'] === 'treinador') {
            \App\Models\Treinador::create([
                'user_id' => $user->id,
                'equipa_id' => $equipa->id,
                'epoca_id' => $epoca->id,
                'escalao' => $request->input('escalao')
            ]);
        }

        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Utilizador criado com sucesso!',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    /**
     * Buscar um utilizador específico
     */
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            throw new UserNotFoundException(
                "Utilizador com ID {$id} não encontrado",
                404,
                ['id_procurado' => $id]
            );
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Atualizar utilizador
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilizador não encontrado'
            ], 404);
        }

        $validated = $request->validate([
            'nome' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:6',
            'is_premium' => 'sometimes|boolean', // ✅ Permitir update de premium
            'premium_plan' => 'sometimes|string|nullable' // ✅ Differentiate plan tiers
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Utilizador atualizado com sucesso!',
            'data' => $user
        ]);
    }

    /**
     * Apagar utilizador
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilizador não encontrado'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilizador apagado com sucesso!'
        ]);
    }

    /**
     * Fazer login e retornar token
     * 
     * @throws MissingCredentialsException Se faltarem campos
     * @throws InvalidCredentialsException Se dados estiverem incorretos
     */
    public function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        // VALIDAÇÃO 1: Campos obrigatórios
        if (!$email || !$password) {
            throw new MissingCredentialsException(
                "Email e password são obrigatórios",
                400,
                ['recebido' => $request->only('email')]
            );
        }

        $user = User::where('email', $email)->first();

        // VALIDAÇÃO 2: Credenciais inválidas
        if (!$user || !Hash::check($password, $user->password)) {
            throw new InvalidCredentialsException(
                "Credenciais inválidas: verifique o email ou password.",
                401,
                ['email_tentado' => $email]
            );
        }

        // VALIDAÇÃO 3: Conta não validada (Treinadores E Atletas)
        if (($user->tipo === 'treinador' || $user->tipo === 'atleta') && !$user->validado) {
             throw new AccountNotValidatedException(
                 "Sua conta aguarda aprovação " . ($user->tipo === 'atleta' ? "do treinador." : "do administrador."),
                 403,
                 ['user_id' => $user->id]
             );
        }

        // Sucesso
        $token = $user->createToken('api_token')->plainTextToken;
        return response()->json([
            'success' => true,
            'user' => $user,
            'token' => $token
        ]);
    }
}
