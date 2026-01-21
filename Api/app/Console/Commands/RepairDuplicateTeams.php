<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Equipa;
use Illuminate\Support\Facades\DB;

class RepairDuplicateTeams extends Command
{
    protected $signature = 'repair:teams';
    protected $description = 'Remove duplicate team names';

    public function handle()
    {
        $this->info('🔍 Procurando equipas duplicadas...');

        $duplicates = DB::table('equipas')
            ->select('nome', DB::raw('count(*) as count'))
            ->groupBy('nome')
            ->having('count', '>', 1)
            ->get();

        if ($duplicates->isEmpty()) {
            $this->info('✅ Nenhuma equipa duplicada encontrada.');
            return;
        }

        foreach ($duplicates as $dup) {
            $this->warn("Equipa: {$dup->nome} ({$dup->count} instâncias)");
            
            // Manter a que tem o menor ID
            $minId = Equipa::where('nome', $dup->nome)->min('id');
            
            $deleted = Equipa::where('nome', $dup->nome)
                ->where('id', '!=', $minId)
                ->delete();
                
            $this->info("🗑️ Apagadas {$deleted} duplicatas de '{$dup->nome}'.");
        }

        $this->info('✨ Reparação concluída!');
    }
}
