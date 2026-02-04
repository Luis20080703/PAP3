<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Treinador;

echo "--- Users with type 'treinador' ---\n";
$users = User::where('tipo', 'treinador')->get();
foreach ($users as $u) {
    $t = Treinador::where('user_id', $u->id)->first();
    echo "ID: {$u->id} | Nome: {$u->nome} | Has Treinador Record: " . ($t ? "YES (ID: {$t->id}, Equipa: {$t->equipa_id})" : "NO") . "\n";
}

echo "\n--- Users with type 'admin' or 'root' ---\n";
$admins = User::whereIn('tipo', ['admin', 'root'])->get();
foreach ($admins as $a) {
    $t = Treinador::where('user_id', $a->id)->first();
    echo "ID: {$a->id} | Nome: {$a->nome} | Tipo: {$a->tipo} | Has Treinador Record: " . ($t ? "YES" : "NO") . "\n";
}
