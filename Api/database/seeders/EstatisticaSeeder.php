<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Atleta;
use App\Models\Equipa;
use App\Models\EstatisticaAtleta;
use Illuminate\Database\Seeder;

class EstatisticaSeeder extends Seeder
{
    public function run(): void
    {
        $equipa = Equipa::first();
        if (!$equipa) {
            $equipa = Equipa::create(['nome' => 'Benfica', 'cidade' => 'Lisboa']);
        }

        // Pega primeira época
        $epoca = \App\Models\Epoca::first();
        if (!$epoca) {
            $epoca = \App\Models\Epoca::create(['nome' => '2024-2025']);
        }

        $user = User::where('email', 'atleta@example.com')->first();
        if (!$user) {
            $user = User::create([
                'nome' => 'João Silva',
                'email' => 'atleta@example.com',
                'password' => bcrypt('password'),
                'tipo' => 'atleta',
                'validado' => true
            ]);
        }

        $atleta = Atleta::where('user_id', $user->id)->first();
        if (!$atleta) {
            $atleta = Atleta::create([
                'user_id' => $user->id,
                'equipa_id' => $equipa->id,
                'epoca_id' => $epoca->id,
                'posicao' => 'Avançado',
                'numero' => 7
            ]);
        }

        $stat = EstatisticaAtleta::where('atleta_id', $atleta->id)->first();
        if (!$stat) {
            EstatisticaAtleta::create([
                'atleta_id' => $atleta->id,
                'golos_marcados' => 15,
                'epoca' => date('Y'),
                'media_golos' => 1.5
            ]);
        }

        echo "✅ Estatísticas de teste criadas!\n";
    }
}
