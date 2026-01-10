<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Exceção Personalizada: MissingCredentialsException
 * 
 * Lançada quando faltam dados obrigatórios no login (email ou password)
 * 
 * Demonstra POO:
 * - Tratamento específico de erro (Validation logic)
 * - Mensagens de erro claras para o frontend
 */
class MissingCredentialsException extends Exception
{
    protected $httpStatusCode;
    protected $errorContext;

    public function __construct(
        string $message = "Email e password são obrigatórios",
        int $httpStatusCode = 400, // Bad Request
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
                'type' => 'MissingCredentialsException',
                'message' => $this->getMessage(),
                'code' => $this->httpStatusCode,
                'fields_required' => ['email', 'password'],
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
