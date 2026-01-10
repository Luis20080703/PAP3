<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Exceção Personalizada: InvalidCredentialsException
 * 
 * Lançada quando as credenciais (email/password) fornecidas são inválidas
 * 
 * Demonstra POO:
 * - Herança: Estende Exception
 * - Encapsulamento: Propriedades protegidas
 * - Overload: Construtor com parâmetros opcionais
 * - Override: Método render() personalizado
 */
class InvalidCredentialsException extends Exception
{
    protected $httpStatusCode;
    protected $errorContext;

    /**
     * Construtor com OVER LOAD (múltiplas formas de instanciar)
     * 
     * @param string $message Mensagem de erro
     * @param int $httpStatusCode Código HTTP (padrão: 401 Unauthorized)
     * @param array $context Contexto adicional
     * @param \Throwable|null $previous Exceção anterior
     */
    public function __construct(
        string $message = "Credenciais inválidas. Email ou password incorretos.",
        int $httpStatusCode = 401,
        array $context = [],
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, $httpStatusCode, $previous);
        $this->httpStatusCode = $httpStatusCode;
        $this->errorContext = $context;
    }

    /**
     * OVERRIDE - Sobrescreve renderização padrão
     */
    public function render(Request $request): JsonResponse
    {
        $response = [
            'success' => false,
            'error' => [
                'type' => 'InvalidCredentialsException',
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
