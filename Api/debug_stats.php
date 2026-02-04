<?php

use App\Models\Atleta;
use App\Models\AtletaJogoStat;
use App\Models\Jogo;
use App\Models\EstatisticaAtleta;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- TOTALS ---\n";
echo "Jogos: " . Jogo::count() . "\n";
echo "AtletaJogoStats: " . AtletaJogoStat::count() . "\n";
echo "EstatisticaAtletas: " . EstatisticaAtleta::count() . "\n";

echo "\n--- ATLETA JOGO STATS ---\n";
$stats = AtletaJogoStat::with('jogo')->get();
foreach ($stats as $s) {
    echo "ID: {$s->id} | Atleta: {$s->atleta_id} | Jogo: {$s->jogo_id} ({$s->jogo->adversario}) | Golos: {$s->golos}\n";
}

echo "\n--- GLOBAL STATS ---\n";
$globals = EstatisticaAtleta::all();
foreach ($globals as $g) {
    echo "Atleta: {$g->atleta_id} | Golos Marcados: {$g->golos_marcados} | Jogos: {$g->jogos}\n";
}
