# Relatório Técnico: Implementação de Exceções Personalizadas (Validação de Conta)

**Módulo 10 – Programação Orientada a Objetos**  
**Módulo 11 – POO Avançado: Tratamento de Exceções**

---

## 1. Introdução

### A. Contexto do Projeto
Este relatório documenta a evolução do sistema de autenticação do projeto **NexusHand**. O foco desta implementação foi a segurança e integridade dos dados no processo de login, especificamente para o perfil de "Treinador".

### B. Objetivo
O objetivo principal é demonstrar a aplicação de exceções personalizadas para controlar fluxos de negócio. Ao implementar a `AccountNotValidatedException`, transferimos a responsabilidade de validar contas do frontend para o backend, garantindo que a regra "apenas utilizadores validados entram" é imposta de forma robusta e orientada a objetos.

---

## 2. Tratamento de Erros e Exceções: Conceitos Fundamentais

### A. Tratamento de Erros vs Exceções
O tratamento convencional de erros baseia-se muitas vezes na verificação de valores de retorno (ex: retornar `false` ou `-1`). Isto polui o código com condicionais constantes (`if error...`).

A **Exceção**, por outro lado, é um mecanismo da POO que "lança" um objeto de erro quando ocorre algo imprevisto, interrompendo imediatamente o fluxo normal até ser "capturado". Isto separa claramente o código que executa a tarefa (o "caminho feliz") do código que trata os problemas (o "handler").

---

## 3. Explicação Detalhada do Código Implementado

Nesta secção, analisamos linha a linha as alterações feitas no código para implementar esta funcionalidade.

### A. A Classe de Exceção (`AccountNotValidatedException.php`)

Esta classe não é apenas um "erro", é um componente inteligente que sabe como se comportar.

**1. Propriedades Protegidas (Encapsulamento)**
```php
protected $httpStatusCode;
protected $errorContext;
```
Definimos estas variáveis como `protected` para garantir que só a própria classe pode alterá-las. Elas guardam o estado do erro: *qual* o erro HTTP (403) e *quais* os dados extra (ID do user) para debug.

**2. O Construtor Inteligente**
```php
public function __construct($message = "...", $code = 403, $context = []) {
    parent::__construct($message, $code);
    $this->httpStatusCode = $code;
    $this->errorContext = $context;
}
```
Aqui o código faz duas coisas cruciais:
1.  **Chama o Pai (`parent::__construct`)**: É obrigatório reportar a mensagem à classe base `Exception` do PHP para que o sistema saiba que houve um erro.
2.  **Configura os Defaults**: Se não passarmos nada, ele assume automaticamente a mensagem "Conta não validada" e o código 403. Isto simplifica o uso noutras partes do código.

**3. A Resposta JSON (`render`)**
```php
public function render($request) {
    return response()->json([ ... ], 403);
}
```
Este é o método que o Laravel chama automaticamente. Em vez de deixar o erro "rebentar" na cara do utilizador, formatamo-lo num JSON limpo (`success: false`). Isto permite que o Frontend (React) receba uma resposta elegante e mostre um aviso bonito, mesmo quando ocorre um erro grave no servidor.

### B. O Controlador (`UserController.php`)

No método `login`, a lógica segue agora um funil de segurança rigoroso.

```php
// ... validação de password ...

// A NOSSA IMPLEMENTAÇÃO:
if ($user->tipo === 'treinador' && $user->validado === false) {
     throw new AccountNotValidatedException(
         "Conta de treinador pendente de aprovação.",
         403,
         ['user_id' => $user->id]
     );
}

// GERAÇÃO DO TOKEN (Só chega aqui se tudo estiver bem)
return $user->createToken('api_token')->plainTextToken;
```
**Análise:**
1.  **O "Guard clause"**: O `if` atua como um guarda. Se a condição for verdadeira (treinador não validado), a execução **para** imediatamente na linha do `throw`.
2.  **A Segurança**: Como o `throw` interrompe o script, o código que gera o token de acesso (que está mais abaixo) **nunca** é executado. Isto é muito mais seguro do que gerar o token e pedir ao frontend para fazer logout, pois o token nunca chega a existir.

---

## 4. POO Aplicada (Herança e Abstração)

### A. Herança
A nossa classe utiliza o mecanismo de **Herança** (`extends Exception`).
Isto significa que não tivemos de programar funcionalidades básicas como "guardar a mensagem de erro" ou "saber em que linha aconteceu". A nossa classe personalizada "herdou" automaticamente todos esses métodos da classe pai `Exception` do PHP, permitindo-nos focar apenas naquilo que é específico do nosso negócio (a validação de conta).

### B. Polimorfismo
Este é o conceito mais poderoso aplicado. O sistema de tratamento de erros global do Laravel está programado para aceitar qualquer objeto do tipo genérico `Throwable`.
Como a nossa classe `AccountNotValidatedException` é filha de `Exception`, ela **é** um `Throwable`.

Isto permite que o Laravel trate a nossa exceção personalizada da mesma forma que trata um erro de base de dados ou um erro de sistema, sem precisar de código extra. O sistema "olha" para o nosso objeto de formas múltiplas (como uma exceção genérica ou como a nossa classe específica), garantindo flexibilidade.

---

## 5. Sobrecarga e Sobrescrita (Overload e Override)

### A. Sobrescrita (Override)
O conceito de **Override** verifica-se quando alteramos um comportamento padrão herdado.
A classe base `Exception` não sabe que o nosso projeto é uma API e tentaria mostrar uma página HTML genérica. Nós **sobrescrevemos** o método `render()` na nossa classe para forçar o sistema a ignorar o comportamento padrão e, em vez disso, devolver uma resposta JSON limpa e estruturada, adequada para a comunicação com o React.

### B. Sobrecarga (Overload)
A **Sobrecarga** refere-se à capacidade de criar métodos com o mesmo nome mas assinaturas (parâmetros) diferentes.
Embora o PHP não suporte isto nativamente como Java ou C#, aplicámos este conceito conceptualmente através de parâmetros opcionais no construtor.

Isto dá-nos a liberdade de instanciar o erro de várias formas:
1.  Sem argumentos: usa as mensagens padrão da classe.
2.  Com argumentos: personaliza a mensagem e o código de erro no momento do lançamento.

---

## 6. Conclusão

Esta implementação demonstra que a POO não serve apenas para organizar código, mas para criar sistemas seguros. Ao encapsular a lógica de erro numa classe própria (Exceção Personalizada) e ao usar Herança e Polimorfismo para a integrar no framework, tornámos o sistema de login do NexusHand mais seguro, legível e preparado para o futuro.
