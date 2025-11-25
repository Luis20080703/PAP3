<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class EpocaEquipaSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ CRIAR ÉPOCAS (COM ESTRUTURA CORRETA)
        if (Schema::hasTable('epocas')) {
            DB::table('epocas')->delete();

            DB::table('epocas')->insert([
                [
                    'data_inicio' => '2024-09-01',
                    'data_fim' => '2025-06-30',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            ]);
            echo "✅ 1 época criada\n";
        }

        // ✅ CRIAR EQUIPAS (COM ESTRUTURA CORRETA)
        if (Schema::hasTable('equipas')) {
            DB::table('equipas')->delete();

            DB::table('equipas')->insert([
                [
                    'nome' => 'Dragões',
                    'escalao_equipa_escalao' => 'Seniores',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'nome' => 'Leões',
                    'escalao_equipa_escalao' => 'Seniores',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'nome' => 'Águias',
                    'escalao_equipa_escalao' => 'Seniores',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            ]);
            echo "✅ 3 equipas criadas\n";
        }

        // ✅ RESUMO
        echo "\n🎯 RESUMO:\n";
        echo "Épocas: " . DB::table('epocas')->count() . "\n";
        echo "Equipas: " . DB::table('equipas')->count() . "\n";
    }
}
