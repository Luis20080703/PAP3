<?php

use App\Models\User;
use App\Models\Treinador;
use App\Models\Atleta;
use App\Models\Equipa;
use App\Models\Epoca;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API Laravel 12 funcionando! 🚀',
        'timestamp' => now()->toISOString()
    ]);
});

// ✅ ROTA DE LOGIN
Route::post('/login', function (Request $request) {
    Log::info('🔐 PEDIDO DE LOGIN RECEBIDO', $request->all());

    $email = $request->input('email');
    $password = $request->input('password');

    // Validação
    if (!$email || !$password) {
        Log::warning('❌ DADOS INCOMPLETOS');
        return response()->json([
            'success' => false,
            'message' => 'Email e password são obrigatórios'
        ], 400);
    }

    // Buscar utilizador
    $user = User::where('email', $email)->first();

    if (!$user) {
        Log::warning('❌ UTILIZADOR NÃO ENCONTRADO: ' . $email);
        return response()->json([
            'success' => false,
            'message' => 'Utilizador não encontrado'
        ], 404);
    }

    Log::info('🔍 UTILIZADOR ENCONTRADO: ' . $user->nome);

    // ✅ VERIFICAÇÃO DA PASSWORD
    if (!$user->password) {
        Log::error('❌ PASSWORD NÃO DEFINIDA NA BD PARA: ' . $user->email);
        return response()->json([
            'success' => false,
            'message' => 'Password não definida'
        ], 500);
    }

    // ⚠️ VERIFICA SE A PASSWORD ESTÁ EM HASH
    if (Hash::needsRehash($user->password)) {
        Log::warning('⚠️ PASSWORD NÃO ESTÁ HASHED - RECRIPTOGRAFANDO...');
        $user->password = Hash::make($password);
        $user->save();
    }

    // ✅ VERIFICA A PASSWORD
    if (Hash::check($password, $user->password)) {
        Log::info('✅ PASSWORD CORRETA - LOGIN APROVADO');
        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    } else {
        Log::warning('❌ PASSWORD INCORRETA para: ' . $user->email);
        return response()->json([
            'success' => false,
            'message' => 'Password incorreta'
        ], 401);
    }
});

// ✅ ROTA DE REGISTO COMPLETA - CRIA TREINADOR/ATLETA AUTOMATICAMENTE
// ✅ ROTA DE REGISTO CORRIGIDA - CRIA TREINADOR/ATLETA AUTOMATICAMENTE
// ✅ ROTA DE REGISTO COMPLETA - CRIA TREINADOR/ATLETA AUTOMATICAMENTE
// ✅ ROTA DE REGISTO COMPLETAMENTE CORRIGIDA
// ✅ ROTA DE REGISTO COMPLETAMENTE CORRIGIDA
Route::post('/register', function (Request $request) {
    \Log::info('🎯 [REGISTER] Dados recebidos:', $request->all());

    try {
        // ✅ VALIDAÇÃO CORRIGIDA
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'tipo' => 'required|in:atleta,treinador',
            'equipa' => 'required|string|max:255',
            'posicao' => 'nullable|string|max:255',
            'numero' => 'nullable|integer'  // ✅ AGORA É integer
        ]);

        \Log::info('✅ Dados validados:', $validated);

        // ✅ 1. CRIAR USER
        $user = User::create([
            'nome' => $validated['nome'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'tipo' => $validated['tipo'],
            'equipa' => $validated['equipa']
        ]);

        \Log::info('✅ USER CRIADO:', ['user_id' => $user->id, 'nome' => $user->nome]);

        // ✅ 2. CRIAR TREINADOR OU ATLETA
        if ($user->tipo === 'treinador') {
            try {
                $equipa = Equipa::where('nome', $validated['equipa'])->first() ?? Equipa::first();
                $epoca = Epoca::first();

                if (!$equipa || !$epoca) {
                    throw new Exception('Equipa ou época não disponível');
                }

                $treinador = Treinador::create([
                    'user_id' => $user->id,
                    'equipa_id' => $equipa->id,
                    'epoca_id' => $epoca->id
                ]);

                \Log::info('✅ TREINADOR CRIADO', ['treinador_id' => $treinador->id]);
            } catch (Exception $e) {
                \Log::error('❌ ERRO AO CRIAR TREINADOR: ' . $e->getMessage());
            }
        } elseif ($user->tipo === 'atleta') {
            try {
                $equipa = Equipa::where('nome', $validated['equipa'])->first() ?? Equipa::first();
                $epoca = Epoca::first();

                if (!$equipa || !$epoca) {
                    throw new Exception('Equipa ou época não disponível');
                }

                // ✅ CORREÇÃO FINAL - DADOS DIRETOS DO FORMULÁRIO
                $atletaData = [
                    'user_id' => $user->id,
                    'equipa_id' => $equipa->id,
                    'epoca_id' => $epoca->id,
                ];

                // ✅ ADICIONAR POSIÇÃO E NÚMERO DIRETAMENTE DO VALIDATED
                if (isset($validated['posicao']) && $validated['posicao'] !== null) {
                    $atletaData['posicao'] = $validated['posicao'];
                }

                if (isset($validated['numero']) && $validated['numero'] !== null) {
                    $atletaData['numero'] = $validated['numero'];
                }

                \Log::info('🔧 [ATLETA CORRIGIDO] Dados para criação:', $atletaData);

                // ✅ CRIAR ATLETA COM DADOS CORRETOS
                $atleta = Atleta::create($atletaData);

                \Log::info('✅ ATLETA CRIADO COM SUCESSO', [
                    'atleta_id' => $atleta->id,
                    'posicao_salva' => $atleta->posicao,
                    'numero_salvo' => $atleta->numero
                ]);
            } catch (Exception $e) {
                \Log::error('❌ ERRO AO CRIAR ATLETA: ' . $e->getMessage());
                \Log::error('Detalhes: ' . $e->getFile() . ':' . $e->getLine());
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Registro realizado com sucesso!',
            'user' => $user
        ], 201);
    } catch (Exception $e) {
        \Log::error('❌ ERRO NO REGISTRO: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erro no registro: ' . $e->getMessage()
        ], 500);
    }
});
// ✅ ROTA /users ALTERNATIVA
Route::post('/users', function (Request $request) {
    try {
        Log::info('📥 Dados recebidos em /users:', $request->all());

        $validated = $request->validate([
            'nome' => 'required_without:name|string|max:255',
            'name' => 'required_without:nome|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'tipo' => 'required_without:type|in:atleta,treinador',
            'type' => 'required_without:tipo|in:atleta,treinador',
            'equipa' => 'nullable|string|max:255',
            'team' => 'nullable|string|max:255'
        ]);

        $nome = $validated['nome'] ?? $validated['name'];
        $tipo = $validated['tipo'] ?? $validated['type'];
        $equipa = $validated['equipa'] ?? $validated['team'] ?? null;

        $user = User::create([
            'nome' => $nome,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'tipo' => $tipo,
            'equipa' => $equipa
        ]);

        Log::info('✅ Utilizador criado via /users:', ['user_id' => $user->id, 'nome' => $user->nome]);

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Utilizador criado com sucesso!'
        ], 201);
    } catch (Exception $e) {
        Log::error('❌ Erro em /users: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erro: ' . $e->getMessage(),
            'received_data' => $request->all()
        ], 500);
    }
});

Route::get('/users', function () {
    return response()->json([
        'success' => true,
        'data' => User::all()
    ]);
});
// ✅ ROTAS PARA COMENTÁRIOS
Route::get('/jogadas/{id}/comentarios', function ($id) {
    try {
        \Log::info("📥 Buscando comentários para jogada: {$id}");

        $comentarios = \App\Models\Comentario::with('user')
            ->where('jogada_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        \Log::info("✅ Comentários encontrados: " . $comentarios->count());

        return response()->json([
            'success' => true,
            'data' => $comentarios
        ]);
    } catch (Exception $e) {
        \Log::error('❌ ERRO AO BUSCAR COMENTÁRIOS: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erro ao buscar comentários'
        ], 500);
    }
});

// ✅ ROTA ESPECÍFICA PARA COMENTÁRIOS DE JOGADAS
// ✅ ROTA COMPLETAMENTE NOVA PARA COMENTÁRIOS DE JOGADAS
// ✅ ROTA PARA COMENTÁRIOS DE JOGADAS
// ✅ ROTA PARA COMENTÁRIOS DE JOGADAS
// ✅ ROTA PARA COMENTÁRIOS DE JOGADAS
// ✅ ROTA ESPECÍFICA PARA COMENTÁRIOS DE JOGADAS
// ✅ ROTA ESPECÍFICA PARA COMENTÁRIOS DE JOGADAS
// ✅ ROTA ESPECÍFICA PARA COMENTÁRIOS DE JOGADAS
// ✅ ROTA ESPECÍFICA PARA COMENTÁRIOS DE JOGADAS
Route::post('/comentarios-jogadas', function (Request $request) {
    \Log::info('💬 [COMENTARIOS-JOGADAS] Dados recebidos:', $request->all());

    try {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'jogada_id' => 'required|exists:jogadas,id',
            'texto' => 'required|string|max:500'
        ]);

        $comentario = \App\Models\Comentario::create([
            'user_id' => $validated['user_id'],
            'jogada_id' => $validated['jogada_id'],
            'texto' => $validated['texto'],
            'data' => now()
        ]);

        $comentario->load('user');

        \Log::info('✅ COMENTÁRIO DE JOGADA CRIADO:', [
            'id' => $comentario->id,
            'jogada_id' => $comentario->jogada_id,
            'user_id' => $comentario->user_id,
            'texto' => $comentario->texto
        ]);

        return response()->json([
            'success' => true,
            'data' => $comentario,
            'message' => 'Comentário adicionado com sucesso!'
        ], 201);
    } catch (Exception $e) {
        \Log::error('❌ ERRO AO CRIAR COMENTÁRIO DE JOGADA: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erro ao criar comentário: ' . $e->getMessage()
        ], 500);
    }
});
// ✅ ROTA PARA BUSCAR TODOS OS COMENTÁRIOS (FALTAVA ESTA!)
// ✅ SOBRESCREVER ROTA CONFLITUANTE - COLOCAR NO TOPO!
Route::get('/comentarios', function () {
    try {
        // ✅ APENAS 'user' - NÃO 'dica'
        $comentarios = \App\Models\Comentario::with('user')->get();

        \Log::info('📥 [COMENTARIOS API] Buscando comentários:', [
            'total' => $comentarios->count()
        ]);

        return response()->json([
            'success' => true,
            'data' => $comentarios
        ]);
    } catch (Exception $e) {
        \Log::error('❌ [COMENTARIOS API] Erro: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erro ao buscar comentários: ' . $e->getMessage()
        ], 500);
    }
});