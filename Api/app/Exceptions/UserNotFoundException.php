<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Exceção Personalizada: UserNotFoundException
 * 
 * Lançada quando um utilizador não é encontrado na base de dados
 * 
 * Demonstra POO:
 * - Herança: Estende Exception
 * - Encapsulamento: Protect properties
 * - Polimorfismo: Pode ser capturada como Exception genérica
 */
class UserNotFoundException extends Exception
{
    protected $httpStatusCode;
    protected $errorContext;

    public function __construct(
        string $message = "Utilizador não encontrado",
        int $httpStatusCode = 404,
        array $context = [],
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, $httpStatusCode, $previous);
        $this->httpStatusCode = $httpStatusCode;
        $this->errorContext = $context;
    }

    public function render(Request $request): JsonResponse
    {
        $response = [
            'success' => false,
            'error' => [
                'type' => 'UserNotFoundException',
                'message' => $this->getMessage(),
                'code' => $this->httpStatusCode,
                'timestamp' => now()->toIso8601String(),
            ]
        ];

        if (!empty($this->errorContext)) {
            $response['error']['context'] = $this->errorContext;
        }

        if (config('app.debug')) {
            $response['error']['trace'] = $this->getTrace();
            $response['error']['file'] = $this->getFile();
            $response['error']['line'] = $this->getLine();
        }

        return response()->json($response, $this->httpStatusCode);
    }

    public function getHttpStatusCode(): int
    {
        return $this->httpStatusCode;
    }

    public function context(): array
    {
        return array_merge([
            'exception' => static::class,
            'message' => $this->getMessage(),
            'http_code' => $this->httpStatusCode,
        ], $this->errorContext);
    }
}
