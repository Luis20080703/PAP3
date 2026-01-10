<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use App\Exceptions\AtletaNotFoundException;
use App\Exceptions\InvalidCredentialsException;
use App\Exceptions\MissingCredentialsException;
use App\Exceptions\UserNotFoundException;
use App\Exceptions\AccountNotValidatedException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // ✅ CORS CONFIGURADO
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        // ✅ CSRF EXCEPTION PARA API
        $middleware->validateCsrfTokens(except: [
            'api/*',
            'sanctum/csrf-cookie'
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // ⚠️ CONFIGURAÇÃO DO HANDLER DE EXCEÇÕES PERSONALIZADAS
        // Este bloco demonstra como registar o tratamento global de exceções específicas
        
        // Helper function para exceções renderizáveis
        $handlerRenderable = function ($e, Request $request) {
            // Logs
            $className = class_basename($e);
            Log::channel('stack')->warning("🔍 {$className} capturada no Handler global", [
                'message' => $e->getMessage(),
                'http_code' => $e->getHttpStatusCode(),
                'context' => $e->context(),
                'url' => $request->fullUrl(),
                'ip' => $request->ip(),
            ]);
            
            // Render
            return $e->render($request);
        };
        
        // Registar handlers
        $exceptions->renderable(function (AtletaNotFoundException $e, Request $request) use ($handlerRenderable) {
            return $handlerRenderable($e, $request);
        });
        
        $exceptions->renderable(function (InvalidCredentialsException $e, Request $request) use ($handlerRenderable) {
            return $handlerRenderable($e, $request);
        });

        $exceptions->renderable(function (MissingCredentialsException $e, Request $request) use ($handlerRenderable) {
            return $handlerRenderable($e, $request);
        });

        $exceptions->renderable(function (UserNotFoundException $e, Request $request) use ($handlerRenderable) {
            return $handlerRenderable($e, $request);
        });

        $exceptions->renderable(function (AccountNotValidatedException $e, Request $request) use ($handlerRenderable) {
            return $handlerRenderable($e, $request);
        });
        
        // Demonstração de tratamento de outras exceções comuns
        $exceptions->renderable(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'error' => [
                        'type' => 'ModelNotFoundException',
                        'message' => 'Recurso não encontrado',
                        'code' => 404
                    ]
                ], 404);
            }
        });
    })->create();
