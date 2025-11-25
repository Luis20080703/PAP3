<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EquipaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $equipas = [
            [
                'nome' => 'Dragões',
                'escalao_equipa_escalao' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nome' => 'Leões',
                'escalao_equipa_escalao' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nome' => 'Águias',
                'escalao_equipa_escalao' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nome' => 'Tigres',
                'escalao_equipa_escalao' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nome' => 'Falcões',
                'escalao_equipa_escalao' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        foreach ($equipas as $equipa) {
            DB::table('equipas')->insertOrIgnore($equipa);
        }

        $this->command->info('✅ ' . count($equipas) . ' equipas criadas com sucesso!');
    }
}