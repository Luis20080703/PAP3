<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Escalao;
use Illuminate\Support\Facades\DB;

class EscalaoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $escaloes = [
            [
                'nome' => 'Sub-14',
                'idade_min' => 12,
                'idade_max' => 14,
                'descricao' => 'Escalão para atletas entre 12 e 14 anos'
            ],
            [
                'nome' => 'Sub-16',
                'idade_min' => 14,
                'idade_max' => 16,
                'descricao' => 'Escalão para atletas entre 14 e 16 anos'
            ],
            [
                'nome' => 'Sub-18',
                'idade_min' => 16,
                'idade_max' => 18,
                'descricao' => 'Escalão para atletas entre 16 e 18 anos'
            ],
            [
                'nome' => 'Sub-20',
                'idade_min' => 18,
                'idade_max' => 20,
                'descricao' => 'Escalão para atletas entre 18 e 20 anos'
            ],
            [
                'nome' => 'Seniores',
                'idade_min' => 20,
                'idade_max' => null,
                'descricao' => 'Escalão sénior para atletas a partir dos 20 anos'
            ],
            [
                'nome' => 'Veteranos',
                'idade_min' => 35,
                'idade_max' => null,
                'descricao' => 'Escalão para atletas a partir dos 35 anos'
            ]
        ];

        foreach ($escaloes as $escalao) {
            Escalao::firstOrCreate(
                ['nome' => $escalao['nome']],
                $escalao
            );
        }

        $this->command->info('✅ ' . count($escaloes) . ' escalões criados com sucesso!');
    }
}
