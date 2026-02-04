<?php

use App\Models\Atleta;
use App\Models\User;
use Illuminate\Http\Request;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Simular Atleta 133
$atletaId = 133;
$atleta = Atleta::find($atletaId);

if (!$atleta) {
    die("Atleta $atletaId não encontrado\n");
}

$stats = \App\Models\AtletaJogoStat::where('atleta_id', $atleta->id)
    ->with(['jogo'])
    ->orderBy('created_at', 'desc')
    ->get();

$response = [
    'success' => true,
    'data' => $stats
];

echo json_encode($response, JSON_PRETTY_PRINT) . PHP_EOL;
