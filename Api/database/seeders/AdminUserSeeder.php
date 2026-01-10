<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'root@example.com'], // evita duplicados
            [
                'nome' => 'Administrador ROOT',
                'password' => Hash::make('senha123'), // escolhe uma senha segura
                'tipo' => 'admin',
                'validado' => true,
                'equipa' => null, // se quiseres, põe equipa
            ]
        );
    }
}
