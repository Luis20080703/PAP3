<?php
// Usage: php scripts/set_trainer_password.php lus@gmail.com test1234
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$email = $argv[1] ?? 'lus@gmail.com';
$newPassword = $argv[2] ?? 'test1234';

$user = User::where('email', $email)->first();
if (!$user) {
    echo "User not found: {$email}\n";
    exit(1);
}

$user->password = Hash::make($newPassword);
$user->save();

echo "Password updated for {$email}\n";
echo "New password: {$newPassword}\n";
echo "User ID: {$user->id}\n";
