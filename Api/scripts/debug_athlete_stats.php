<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Facades\DB;

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "🔍 Debug de estatísticas de atletas...\n\n";

// Listar todos os users e seus atletas
$users = DB::table('users')
    ->where('tipo', 'atleta')
    ->select('id', 'nome', 'email')
    ->get();

echo "👥 Atletas na base de dados:\n";
foreach ($users as $user) {
    $atleta = DB::table('atletas')->where('user_id', $user->id)->first();
    $stats = null;
    
    if ($atleta) {
        $stats = DB::table('estatistica_atletas')->where('atleta_id', $atleta->id)->first();
    }
    
    echo "- User ID: {$user->id}, Nome: {$user->nome}, Email: {$user->email}\n";
    echo "  Atleta ID: " . ($atleta ? $atleta->id : 'NÃO EXISTE') . "\n";
    echo "  Estatísticas: " . ($stats ? "SIM (ID: {$stats->id}, Golos: {$stats->golos_marcados})" : 'NÃO') . "\n\n";
}

// Listar todas as estatísticas
echo "📊 Todas as estatísticas:\n";
$allStats = DB::table('estatistica_atletas as ea')
    ->join('atletas as a', 'ea.atleta_id', '=', 'a.id')
    ->join('users as u', 'a.user_id', '=', 'u.id')
    ->select('ea.id', 'ea.atleta_id', 'u.id as user_id', 'u.nome', 'ea.golos_marcados', 'ea.jogos')
    ->get();

foreach ($allStats as $stat) {
    echo "- Stats ID: {$stat->id}, Atleta ID: {$stat->atleta_id}, User ID: {$stat->user_id}, Nome: {$stat->nome}, Golos: {$stat->golos_marcados}, Jogos: {$stat->jogos}\n";
}