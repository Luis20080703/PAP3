<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RootSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'root@localhost'],
            [
                'nome' => 'Admin Root',
                'password' => Hash::make('1234567'),
                'tipo' => 'root',
                'validado' => true,
                'email_verified_at' => now(),
            ]
        );

        echo "✅ Root user created: root@localhost / 1234567\n";
    }
}
