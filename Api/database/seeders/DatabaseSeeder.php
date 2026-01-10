<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'nome' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
                'tipo' => 'atleta',
                'equipa' => 'Test Team',
            ]
        );

        // Call other seeders
        $this->call([
            EpocaEquipaSeeder::class,
            EquipaSeeder::class,
            EscalaoSeeder::class,
            AdminUserSeeder::class, // <- Adiciona esta linha

        ]);
    }
}
