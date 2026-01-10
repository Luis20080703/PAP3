# Relatório Técnico: Exceções no Sistema de Autenticação

**Módulo 10 – Programação Orientada a Objetos**  
**Módulo 11 – POO Avançado: Tratamento de Exceções**

---

## 1. Introdução

### A. Contexto do Projeto
Este relatório detalha a reestruturação do módulo de autenticação do projeto **NexusHand**. O foco foi a substituição de validações simples no login por um sistema robusto de exceções personalizadas, especificamente para lidar com credenciais inválidas, dados em falta e utilizadores inexistentes.

### B. Objetivo
O objetivo principal é demonstrar como a Programação Orientada a Objetos (POO) pode elevar a segurança e a clareza de um sistema de login. Ao utilizar exceções tipificadas (`MissingCredentialsException`, `InvalidCredentialsException`, `UserNotFoundException`), garantimos que cada tipo de erro é tratado de forma distinta, permitindo registos (logs) de segurança precisos sem expor vulnerabilidades ao cliente.

---

## 2. Tratamento de Erros e Exceções: Conceitos Fundamentais

### A. A Limitação dos Códigos de Erro
Num sistema de login tradicional, é comum retornar um simples `HTTP 401` ou uma string de erro quando o login falha.
*Abordagem antiga:*
```php
if (!$user) return response()->json(['error' => 'Falha'], 401);
```
Esta abordagem é limitada porque não fornece contexto estruturado ao sistema de monitorização sobre *porquê* a falha ocorreu (foi a password? foi o email que não existe? faltaram campos?), dificultando a auditoria de segurança.

### B. A Abordagem por Exceções
Ao utilizar exceções, transformamos o erro num objeto rico.
*Nova abordagem:*
```php
throw new InvalidCredentialsException("Credenciais incorretas");
```
Isto permite separar a deteção do erro (no Controller) da sua resposta (no Handler), centralizando a lógica de segurança.

---

## 3. Implementação das Exceções de Login (Estudo de Caso)

### A. A Classe `InvalidCredentialsException`
Esta classe foi criada para lidar especificamente com falhas de combinação email/password. A sua importância reside na segurança: ela encapsula o erro, garantindo que o sistema saiba internamente o que aconteceu, mas controlando rigorosamente o que é enviado para fora (para evitar ataques de enumeração de utilizadores).

```php
class InvalidCredentialsException extends Exception
{
    // Encapsula o código HTTP 401 (Unauthorized) por defeito
    protected $httpStatusCode = 401;
}
```

### B. Tratamento Global e Segurança
Configurámos o `Handler` global do Laravel para intercetar estas exceções. Quando uma `InvalidCredentialsException` é capturada, o sistema realiza duas ações:
1.  **Registo (Log):** Guarda um aviso interno com o IP e o email tentado (para detetar ataques de força bruta).
2.  **Resposta:** Devolve um JSON genérico ao utilizador, não revelando se o erro foi no email ou na password.

---

## 4. POO Aplicada (Herança e Abstração)

### A. Herança Hierárquica
Implementámos uma hierarquia clara para as exceções de login. Todas estendem a classe base `Exception`, o que garante compatibilidade total com o ecossistema PHP/Laravel.

1.  `Exception` (Base PHP)
2.  `InvalidCredentialsException` (Nossa implementação concreta)

Ao usar herança, garantimos que a nossa classe possui métodos essenciais como `getTrace()` e `getMessage()` sem termos de escrever uma única linha de código para tal.

### B. Polimorfismo no Controlador
O `UserController` beneficia do polimorfismo ao poder tratar diferentes tipos de erros de forma unificada.
- Se o utilizador esquecer a password -> `MissingCredentialsException`
- Se a password estiver errada -> `InvalidCredentialsException`

Para o sistema de registo global, ambos são apenas objetos do tipo "Exceção" que precisam de ser registados, demonstrando a capacidade de tratar objetos diferentes através de uma interface comum.

---

## 5. Sobrecarga e Sobrescrita (Overload e Override)

### A. Sobrescrita (Override) do Render
Sobrescrevemos o método `render` nas nossas exceções de login. Em vez de deixar o Laravel gerar uma página HTML de erro padrão, forçamos o retorno de um JSON estruturado.

```php
// Sobrescrita para garantir resposta API
public function render($request) {
    return response()->json([
        'error' => 'Credenciais Inválidas',
        'code' => 401
    ], 401);
}
```

### B. Sobrecarga Simulada (Contexto)
Utilizámos parâmetros opcionais nos construtores para permitir que as exceções transportem dados variados.
Por exemplo, a `MissingCredentialsException` pode ser instanciada com uma lista dos campos que faltaram:

```php
// Pode ser lançada apenas com mensagem ou com lista de campos
throw new MissingCredentialsException("Faltam dados", 400, ['missing' => ['email']]);
```
Isto simula a sobrecarga, permitindo que a mesma classe de exceção se adapte a diferentes níveis de detalhe conforme a necessidade da validação.

---

## 6. Conclusão

A implementação de exceções dedicadas para o fluxo de login não foi apenas um exercício estético, mas uma melhoria fundamental de arquitetura.

Separaram-se as preocupações: o `UserController` valida a lógica de negócio, enquanto as classes de exceção (`InvalidCredentialsException`, etc.) gerem a formatação dos erros e os códigos HTTP. O resultado é um sistema de autenticação mais seguro, auditável e fácil de manter, alinhado com as melhores práticas de Engenharia de Software e Programação Orientada a Objetos.
