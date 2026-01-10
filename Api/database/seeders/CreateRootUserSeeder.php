<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateRootUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = 'root@localhost';

        if (!User::where('email', $email)->exists()) {
            User::create([
                'nome' => 'Root',
                'email' => $email,
                'password' => Hash::make('1234567'),
                'tipo' => 'root',
                'validado' => true
            ]);

            \Illuminate\Support\Facades\Log::info('Root user created', ['email' => $email]);
        } else {
            \Illuminate\Support\Facades\Log::info('Root user already exists', ['email' => $email]);
        }
    }
}
