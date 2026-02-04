<?php

namespace App\Exceptions;

use Exception;

class AccountNotValidatedException extends Exception
{
    protected $httpStatusCode;
    protected $errorContext;

    /**
     * Construtor Personalizado
     * 
     * @param string $message Mensagem de erro
     * @param int $httpStatusCode Código HTTP (padrão: 403 Forbidden)
     * @param array $context Contexto adicional para debug
     */
    public function __construct(
        string $message = "A sua conta ainda não foi validada pelo administrador.", 
        int $httpStatusCode = 403, 
        array $context = []
    ) {
        parent::__construct($message, $httpStatusCode);
        $this->httpStatusCode = $httpStatusCode;
        $this->errorContext = $context;
    }

    /**
     * Renderização Personalizada para API (JSON)
     */
    public function render($request)
    {
        return response()->json([
            'success' => false,
            'error' => [
                'type' => 'AccountNotValidatedException',
                'message' => $this->getMessage(),
                'code' => $this->httpStatusCode,
                'suggestion' => 'Aguarde a validação ou contacte o suporte.'
            ]
        ], $this->httpStatusCode);
    }

    public function getHttpStatusCode(): int
    {
        return $this->httpStatusCode;
    }

    public function context(): array
    {
        return $this->errorContext;
    }
}
