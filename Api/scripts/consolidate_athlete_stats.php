<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

// Configurar Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "🔧 Consolidando estatísticas de atletas...\n";

try {
    // Buscar todas as estatísticas agrupadas por atleta e época
    $duplicates = DB::table('estatistica_atletas')
        ->select('atleta_id', 'epoca', DB::raw('COUNT(*) as count'))
        ->groupBy('atleta_id', 'epoca')
        ->having('count', '>', 1)
        ->get();

    echo "📊 Encontrados " . $duplicates->count() . " grupos com duplicados\n";

    foreach ($duplicates as $duplicate) {
        echo "🔄 Consolidando atleta {$duplicate->atleta_id}, época {$duplicate->epoca} ({$duplicate->count} registos)\n";
        
        // Buscar todos os registos deste atleta/época
        $records = DB::table('estatistica_atletas')
            ->where('atleta_id', $duplicate->atleta_id)
            ->where('epoca', $duplicate->epoca)
            ->get();

        // Calcular totais
        $totals = [
            'golos_marcados' => $records->sum('golos_marcados'),
            'cartoes_amarelos' => $records->sum('cartoes_amarelos'),
            'cartoes_vermelhos' => $records->sum('cartoes_vermelhos'),
            'dois_minutos' => $records->sum('dois_minutos'),
            'jogos' => $records->sum('jogos'),
        ];
        
        $totals['media_golos'] = $totals['jogos'] > 0 ? round($totals['golos_marcados'] / $totals['jogos'], 2) : 0;

        // Manter o primeiro registo e atualizar com totais
        $firstRecord = $records->first();
        
        DB::table('estatistica_atletas')
            ->where('id', $firstRecord->id)
            ->update([
                'golos_marcados' => $totals['golos_marcados'],
                'cartoes_amarelos' => $totals['cartoes_amarelos'],
                'cartoes_vermelhos' => $totals['cartoes_vermelhos'],
                'dois_minutos' => $totals['dois_minutos'],
                'jogos' => $totals['jogos'],
                'media_golos' => $totals['media_golos'],
                'updated_at' => now()
            ]);

        // Apagar os registos duplicados
        DB::table('estatistica_atletas')
            ->where('atleta_id', $duplicate->atleta_id)
            ->where('epoca', $duplicate->epoca)
            ->where('id', '!=', $firstRecord->id)
            ->delete();

        echo "✅ Consolidado: {$totals['golos_marcados']} golos, {$totals['jogos']} jogos\n";
    }

    echo "🎉 Consolidação concluída!\n";
    
    // Mostrar estatísticas finais
    $finalStats = DB::table('estatistica_atletas')
        ->join('atletas', 'estatistica_atletas.atleta_id', '=', 'atletas.id')
        ->join('users', 'atletas.user_id', '=', 'users.id')
        ->select('users.nome', 'estatistica_atletas.epoca', 'estatistica_atletas.golos_marcados', 'estatistica_atletas.jogos')
        ->orderBy('estatistica_atletas.epoca', 'desc')
        ->orderBy('estatistica_atletas.golos_marcados', 'desc')
        ->get();

    echo "\n📈 Estatísticas finais:\n";
    foreach ($finalStats as $stat) {
        echo "- {$stat->nome} ({$stat->epoca}): {$stat->golos_marcados} golos em {$stat->jogos} jogos\n";
    }

} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage() . "\n";
}