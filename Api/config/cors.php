<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // ✅ Permite qualquer origem (desenvolvimento)
    // Para produção, especifique os domínios exatos:
    // 'allowed_origins' => [
    //     'http://localhost:3000',
    //     'https://seu-dominio.com',
    // ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
