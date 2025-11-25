<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';

// ==================== ROTAS API ====================
Route::prefix('api')->group(function () {
    // Rota de teste
    Route::get('/test', function () {
        return response()->json([
            'success' => true,
            'message' => 'API está funcionando! 🚀',
            'timestamp' => now()
        ]);
    });

    // Rotas dos controllers
    Route::apiResource('users', \App\Http\Controllers\Api\UserController::class);
    Route::apiResource('equipas', \App\Http\Controllers\Api\EquipaController::class);
    Route::apiResource('atletas', \App\Http\Controllers\Api\AtletaController::class);
    Route::apiResource('treinadores', \App\Http\Controllers\Api\TreinadorController::class);
    Route::apiResource('epocas', \App\Http\Controllers\Api\EpocaController::class);
    Route::apiResource('estatisticas-atletas', \App\Http\Controllers\Api\EstatisticaAtletaController::class);
    Route::apiResource('estatisticas-equipas', \App\Http\Controllers\Api\EstatisticaEquipaController::class);
    Route::apiResource('dicas', \App\Http\Controllers\Api\DicaController::class);
    Route::apiResource('escaloes', \App\Http\Controllers\Api\EscalaoController::class);
    Route::apiResource('equipa-escaloes', \App\Http\Controllers\Api\EquipaEscalaoController::class);
    Route::apiResource('comentarios', \App\Http\Controllers\Api\ComentarioController::class);
    Route::apiResource('jogadas', \App\Http\Controllers\Api\JogadaController::class);

    // Health check
    Route::get('/health', function () {
        return response()->json([
            'status' => 'healthy',
            'timestamp' => now()->toDateTimeString()
        ]);
    });
});
