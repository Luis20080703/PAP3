<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\EquipaController;
use App\Http\Controllers\Api\EpocaController;
use App\Http\Controllers\Api\JogadaController;
use App\Http\Controllers\Api\DicaController;
use App\Http\Controllers\Api\ComentarioController;
use App\Http\Controllers\Api\EstatisticaAtletaController;
use App\Http\Controllers\Api\EstatisticaEquipaController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\EscalaoController;
use App\Http\Controllers\Api\TreinadorController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'store']);
Route::get('/equipas', [EquipaController::class, 'index']);
Route::get('/epocas', [EpocaController::class, 'index']);
Route::get('/escaloes', [EscalaoController::class, 'index']);
Route::get('/estatisticas-atletas', [EstatisticaAtletaController::class, 'index']);

// Test route
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API Laravel está funcionando!',
        'timestamp' => now()
    ]);
});


// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    });

    Route::apiResource('users', UserController::class);
    Route::apiResource('equipas', EquipaController::class)->except(['index']);
    Route::apiResource('epocas', EpocaController::class)->except(['index']);
    Route::apiResource('jogadas', JogadaController::class);
    Route::apiResource('dicas', DicaController::class);
    Route::apiResource('comentarios', ComentarioController::class);
    Route::apiResource('escaloes', EscalaoController::class)->except(['index']);
    
    Route::get('/estatisticas-atleta', [EstatisticaAtletaController::class, 'showMyStats']);
    Route::post('/estatisticas-atleta', [EstatisticaAtletaController::class, 'store']);
    Route::get('/estatisticas-equipas', [EstatisticaEquipaController::class, 'index']);

    // Trainer routes
    Route::get('/treinador/atletas-pendentes', [TreinadorController::class, 'getPendingAthletes']);
    Route::post('/treinador/aprovar-atleta/{id}', [TreinadorController::class, 'approveAthlete']);
    Route::delete('/treinador/rejeitar-atleta/{id}', [TreinadorController::class, 'rejectAthlete']);

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'getStats']);
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::get('/pending-treinadores', [AdminController::class, 'getPendingTreinadores']);
        Route::get('/pending-athletes', [AdminController::class, 'getPendingAthletes']); // ✅ New route
        Route::post('/validate-treinador/{id}', [AdminController::class, 'validateTreinador']); // Keep for backward compat
        Route::post('/validate-user/{id}', [AdminController::class, 'validateUser']); // ✅ New generic route
        Route::post('/users/{id}/role', [AdminController::class, 'updateUserRole']);
        Route::post('/users/{id}/update', [AdminController::class, 'updateUserRole']); // Duo use
        Route::post('/users/{id}/toggle-premium', [AdminController::class, 'togglePremium']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::delete('/content/{type}/{id}', [AdminController::class, 'deleteContent']);
    });
});
