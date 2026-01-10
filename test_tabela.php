<?php
// test_tabela.php
require __DIR__ . '/api/vendor/autoload.php';
$app = require_once __DIR__ . '/api/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== VERIFICANDO TABELA estatistica_atletas ===\n\n";

// 1. Verifica se a tabela existe
$exists = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name='estatistica_atletas'");
if (empty($exists)) {
    echo "❌ ERRO: Tabela 'estatistica_atletas' NÃO EXISTE!\n";
    exit(1);
}
echo "✅ Tabela existe\n";

// 2. Verifica colunas
$columns = DB::select("PRAGMA table_info(estatistica_atletas)");
echo "\n=== COLUNAS DA TABELA ===\n";
foreach ($columns as $col) {
    echo "{$col->name} ({$col->type}) - Null: {$col->notnull}\n";
}

// 3. Tenta inserir um registro de teste
echo "\n=== TESTE DE INSERÇÃO ===\n";
try {
    $id = DB::table('estatistica_atletas')->insertGetId([
        'atleta_id' => 1,
        'golos_marcados' => 3,
        'cartoes_amarelos' => 1,
        'cartoes_vermelhos' => 0,
        'dois_minutos' => 0,
        'epoca' => 2024,
        'jogos' => 1,
        'media_golos' => 3.0,
        'created_at' => now(),
        'updated_at' => now()
    ]);
    echo "✅ Inserido com ID: $id\n";
} catch (Exception $e) {
    echo "❌ Erro na inserção: " . $e->getMessage() . "\n";
    echo "📄 Detalhes: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

// 4. Mostra todos os registros
echo "\n=== REGISTROS NA TABELA ===\n";
$registros = DB::table('estatistica_atletas')->get();
foreach ($registros as $reg) {
    echo "ID: {$reg->id}, Atleta: {$reg->atleta_id}, Golos: {$reg->golos_marcados}\n";
}
