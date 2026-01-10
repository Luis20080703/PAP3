<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Facades\DB;

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "🔧 Criando registo único por atleta...\n";

try {
    // Buscar todos os atletas com estatísticas
    $atletas = DB::table('estatistica_atletas')
        ->select('atleta_id')
        ->groupBy('atleta_id')
        ->get();

    echo "👥 Processando " . $atletas->count() . " atletas\n";

    foreach ($atletas as $atletaData) {
        $atletaId = $atletaData->atleta_id;
        
        // Somar todas as estatísticas deste atleta
        $totals = DB::table('estatistica_atletas')
            ->where('atleta_id', $atletaId)
            ->selectRaw('
                SUM(golos_marcados) as total_golos,
                SUM(cartoes_amarelos) as total_amarelos,
                SUM(cartoes_vermelhos) as total_vermelhos,
                SUM(dois_minutos) as total_dois_minutos,
                SUM(jogos) as total_jogos
            ')
            ->first();

        $mediaGolos = $totals->total_jogos > 0 ? round($totals->total_golos / $totals->total_jogos, 2) : 0;

        // Apagar todos os registos existentes
        DB::table('estatistica_atletas')->where('atleta_id', $atletaId)->delete();

        // Criar registo único
        DB::table('estatistica_atletas')->insert([
            'atleta_id' => $atletaId,
            'epoca' => date('Y'),
            'golos_marcados' => $totals->total_golos,
            'cartoes_amarelos' => $totals->total_amarelos,
            'cartoes_vermelhos' => $totals->total_vermelhos,
            'dois_minutos' => $totals->total_dois_minutos,
            'jogos' => $totals->total_jogos,
            'media_golos' => $mediaGolos,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        echo "✅ Atleta {$atletaId}: {$totals->total_golos} golos em {$totals->total_jogos} jogos\n";
    }

    echo "🎉 Concluído! Cada atleta tem agora um registo único.\n";

} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage() . "\n";
}