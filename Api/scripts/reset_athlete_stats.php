<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Facades\DB;

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "🧹 Limpando todas as estatísticas de atletas...\n";

try {
    // Apagar todas as estatísticas existentes
    $deleted = DB::table('estatistica_atletas')->delete();
    echo "🗑️ Apagados {$deleted} registos antigos\n";

    // Listar todos os atletas para verificar
    $atletas = DB::table('atletas')
        ->join('users', 'atletas.user_id', '=', 'users.id')
        ->select('atletas.id', 'users.nome', 'users.id as user_id')
        ->get();

    echo "👥 Atletas na base de dados:\n";
    foreach ($atletas as $atleta) {
        echo "- ID: {$atleta->id}, User ID: {$atleta->user_id}, Nome: {$atleta->nome}\n";
    }

    echo "\n✅ Tabela limpa! Cada atleta começará agora do zero.\n";

} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage() . "\n";
}