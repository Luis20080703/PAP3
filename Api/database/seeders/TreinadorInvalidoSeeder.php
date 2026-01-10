<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Treinador;
use App\Models\Equipa;
use App\Models\Epoca;
use Illuminate\Support\Facades\Hash;

class TreinadorInvalidoSeeder extends Seeder
{
    public function run(): void
    {
        $equipa = Equipa::first() ?? Equipa::create(['nome' => 'Dragões', 'escalao_equipa_escalao' => 'Seniores']);
        $epoca = Epoca::first() ?? Epoca::create(['ano' => 2025]);

        // Create unvalidated trainer user
        $user = User::create([
            'nome' => 'João Treinador',
            'email' => 'treinador.invalido@example.com',
            'password' => Hash::make('password'),
            'tipo' => 'treinador',
            'validado' => false, // NOT validated
        ]);

        // Create trainer profile
        Treinador::create([
            'user_id' => $user->id,
            'equipa_id' => $equipa->id,
            'epoca_id' => $epoca->id,
        ]);

        echo "✅ Unvalidated trainer created: treinador.invalido@example.com / password\n";
    }
}
