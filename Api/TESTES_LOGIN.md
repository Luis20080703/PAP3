# 🧪 Testes de Exceções de Login

Guia para validar as exceções implementadas no `UserController`.

## 1. Testar MissingCredentialsException (400)

**Cenário:** Tentar login sem enviar nada.

**Comando PowerShell:**
```powershell
Invoke-RestMethod http://localhost:8000/api/login `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{}'
```

**Resposta Esperada:**
```json
{
    "success": false,
    "error": {
        "type": "MissingCredentialsException",
        "message": "Email e password são obrigatórios",
        "code": 400,
        "fields_required": ["email", "password"]
    }
}
```

## 2. Testar InvalidCredentialsException (401)

**Cenário:** Email ou password errados.

**Comando PowerShell:**
```powershell
$body = @{
    email = "email_errado@teste.com"
    password = "senha_errada"
} | ConvertTo-Json

Invoke-RestMethod http://localhost:8000/api/login `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

**Resposta Esperada:**
```json
{
    "success": false,
    "error": {
        "type": "InvalidCredentialsException",
        "message": "Credenciais inválidas: verifique o email ou password.",
        "code": 401
    }
}
```

## 3. Testar UserNotFoundException (404)

**Cenário:** Tentar ver um utilizador que não existe (endpoint `show`).

**Nota:** Precisa de autenticação (Token). Use um token válido de logins anteriores.

**Comando PowerShell:**
```powershell
$token = "SEU_TOKEN_AQUI"
Invoke-RestMethod http://localhost:8000/api/users/99999 `
  -Headers @{Authorization="Bearer $token"}
```

**Resposta Esperada:**
```json
{
    "success": false,
    "error": {
        "type": "UserNotFoundException",
        "message": "Utilizador com ID 99999 não encontrado",
        "code": 404
    }
}
```

---

## ✅ Verificação de Logs

Após executar os testes, verifique `storage/logs/laravel.log`. Deve ver entradas como:
- `🔍 MissingCredentialsException capturada no Handler global`
- `🔍 InvalidCredentialsException capturada no Handler global`

Isto confirma que o sistema de monitorização está a funcionar corretamente.
