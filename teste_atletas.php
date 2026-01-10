<?php
// teste_atletas.php
require __DIR__ . '/api/vendor/autoload.php';
$app = require_once __DIR__ . '/api/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== ATLETAS EXISTENTES ===\n";

$atletas = DB::table('atletas')->get();
if ($atletas->isEmpty()) {
    echo "❌ NENHUM ATLETA NA TABELA!\n";

    // Verifica usuários
    $users = DB::table('users')->where('tipo', 'atleta')->get();
    echo "\n=== USUÁRIOS ATLETA ===\n";
    foreach ($users as $user) {
        echo "User ID: {$user->id}, Nome: {$user->nome}, Email: {$user->email}\n";
    }
} else {
    foreach ($atletas as $atleta) {
        echo "ID: {$atleta->id}, User ID: {$atleta->user_id}\n";
    }
}

// Mostra primeiros IDs disponíveis
echo "\n=== SUGESTÃO DE IDs ===\n";
echo "Use um destes atleta_id: ";
if ($atletas->isNotEmpty()) {
    echo $atletas->first()->id . "\n";
} else {
    echo "Nenhum atleta. Crie um primeiro!\n";
}
