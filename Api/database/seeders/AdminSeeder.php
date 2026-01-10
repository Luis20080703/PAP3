<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cria ou actualiza o utilizador root/local
        $email = 'root@localhost';
        $password = '1234567'; // apenas para desenvolvimento local

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'nome' => 'root',
                'password' => Hash::make($password),
                'tipo' => 'root',
                'equipa' => null
            ]
        );

        // Opcional: mostrar info no stdout quando executado via artisan
        $this->command->info('AdminSeeder: root criado/atualizado -> ' . $user->email);
    }
}
