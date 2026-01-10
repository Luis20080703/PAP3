<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class EnsureTokenAuthOrJson
{
    public function handle(Request $request, Closure $next): Response
    {
        // Try to authenticate with Bearer token from header
        $token = $request->bearerToken();

        if ($token) {
            // Find the token in database
            $model = PersonalAccessToken::findToken($token);

            if ($model && $model->tokenable) {
                Auth::setUser($model->tokenable);
            }
        }

        // Check if authenticated
        if (!Auth::check()) {
            // For API requests, return JSON 401
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Não autenticado'
                ], 401);
            }
        }

        return $next($request);
    }
}
