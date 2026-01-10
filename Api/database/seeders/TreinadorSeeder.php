<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Treinador;
use App\Models\Equipa;
use App\Models\Epoca;
use Illuminate\Support\Facades\Hash;

class TreinadorSeeder extends Seeder
{
    public function run(): void
    {
        // Get first equipa and epoca (or create if needed)
        $equipa = Equipa::first() ?? Equipa::create(['nome' => 'Dragões', 'escalao_equipa_escalao' => 'Seniores']);
        $epoca = Epoca::first() ?? Epoca::create(['ano' => 2025]);

        // Create trainer user
        $user = User::updateOrCreate(
            ['email' => 'treinador@example.com'],
            [
                'nome' => 'Carlos Treinador',
                'password' => Hash::make('password'),
                'tipo' => 'treinador',
                'validado' => true, // Already validated
                'email_verified_at' => now(),
            ]
        );

        // Create trainer profile
        Treinador::updateOrCreate(
            ['user_id' => $user->id],
            [
                'equipa_id' => $equipa->id,
                'epoca_id' => $epoca->id,
            ]
        );

        echo "✅ Trainer created: treinador@example.com / password\n";
    }
}
