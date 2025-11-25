# 🎯 Como Funcionam as Rotas no NexusHand

## Introdução

O projeto **NexusHand** é uma plataforma de andebol que usa um **sistema de navegação baseado em estado** (sem React Router).

---

## 1️⃣ Diagrama do Fluxo de Navegação

```
┌─────────────────────────────────────────────────────────────┐
│                     INICIO DA APLICAÇÃO                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
          ┌──────────────────────────────┐
          │   Verifica se user existe    │
          │   (na primeira renderização) │
          └──────┬───────────────┬───────┘
                 │               │
          SIM (user existe)  NÃO (user é null)
                 │               │
                 ↓               ↓
         ┌─────────────┐   ┌──────────────┐
         │  DASHBOARD  │   │     HOME     │
         │ (protegida) │   │  (pública)   │
         └─────┬───────┘   └──────┬───────┘
               │                  │
               │         Clica "Entrar/Registar"
               │                  │
               │                  ↓
               │          ┌──────────────┐
               │          │    LOGIN     │
               │          │  (pública)   │
               │          └──────┬───────┘
               │                 │
               │      Login bem-sucedido
               │      (user é preenchido)
               │                 │
               └─────────┬───────┘
                         │
                         ↓
                  ┌─────────────┐
                  │  DASHBOARD  │
                  │ (protegida) │
                  └─────┬───────┘
                        │
              Clica "Sair" (Logout)
                        │
                        ↓
                  ┌─────────────┐
                  │    HOME     │
                  │  (pública)  │
                  └─────────────┘
```

---

## 2️⃣ As 3 Rotas Principais

### 📄 **Rota 1: HOME** (Página Inicial)

- **Ficheiro:** `src/components/Home.tsx`
- **Quando aparece:** Quando o utilizador NÃO está autenticado
- **O que mostra:** Apresentação da plataforma, botão "Entrar/Registar"
- **Props recebidas:** `onNavigateToLogin` (função para ir para Login)

```tsx
<Home onNavigateToLogin={() => setCurrentPage("login")} />
```

### 🔐 **Rota 2: LOGIN** (Autenticação)

- **Ficheiro:** `src/components/Login.tsx`
- **Quando aparece:** Quando o utilizador clica "Entrar/Registar"
- **O que mostra:** Formulário de login e registo
- **Props recebidas:** `onBack` (função para voltar à Home)

```tsx
<Login onBack={() => setCurrentPage("home")} />
```

### 📊 **Rota 3: DASHBOARD** (Painel Principal)

- **Ficheiro:** `src/components/Dashboard.tsx`
- **Quando aparece:** Quando o utilizador está autenticado (tem `user`)
- **O que mostra:** 4 abas (Jogadas, Dicas, Estatísticas de Equipas, Estatísticas de Atletas)
- **Props recebidas:** `onLogout` (função para fazer logout)

```tsx
<Dashboard onLogout={handleLogout} />
```

---

## 3️⃣ Como o Sistema Decide Qual Página Mostrar

### **Código Principal** (`App.tsx`, linhas 40-48)

```tsx
return (
  <div className="min-h-screen bg-gray-50">
    {/* Se currentPage é 'home' E user não existe → mostra Home */}
    {currentPage === "home" && !user && (
      <Home onNavigateToLogin={() => setCurrentPage("login")} />
    )}

    {/* Se currentPage é 'login' E user não existe → mostra Login */}
    {currentPage === "login" && !user && (
      <Login onBack={() => setCurrentPage("home")} />
    )}

    {/* Se user existe → mostra Dashboard (SEMPRE) */}
    {user && <Dashboard onLogout={handleLogout} />}

    <Toaster />
  </div>
);
```

### **Explicação**

O React renderiza **condicionalmente** cada componente:

| Condição                           | Resultado                 |
| ---------------------------------- | ------------------------- |
| `currentPage === 'home' && !user`  | ✅ Mostra `<Home />`      |
| `currentPage === 'login' && !user` | ✅ Mostra `<Login />`     |
| `user` (se existe)                 | ✅ Mostra `<Dashboard />` |

---

## 4️⃣ Estado & Contexto

### **Estado Local** (`currentPage`)

```tsx
const [currentPage, setCurrentPage] = useState<"home" | "login" | "dashboard">(
  "home"
);
```

- **Tipo:** `'home'` | `'login'` | `'dashboard'`
- **Valor inicial:** `'home'`
- **Propósito:** Controlar qual página mostrar

### **Contexto Global** (`user`)

```tsx
const { user, loading, logout: apiLogout } = useApp();
```

- **`user`:** Dados do utilizador autenticado (ou `null` se não autenticado)
- **`loading`:** `true` enquanto carrega, `false` quando pronto
- **`logout()`:** Função para fazer logout

---

## 5️⃣ O Fluxo de Autenticação

### **1. Utilizador faz Login**

```tsx
// Em Login.tsx
const handleLogin = async () => {
  await login(email, password); // Chama a função do contexto
  // Se bem-sucedido, user é preenchido no contexto
};
```

### **2. O Contexto Atualiza `user`**

```tsx
// Em AppContext.tsx
const login = async (email: string, password: string) => {
  const userData = await authAPI.login(email, password);
  setUser(userData); // ✅ User agora tem dados
};
```

### **3. A Página Muda Automaticamente**

```tsx
// Em App.tsx
{
  user && (
    <Dashboard onLogout={handleLogout} /> // ✅ Agora mostra Dashboard
  );
}
```

### **4. Utilizador faz Logout**

```tsx
// Em Dashboard.tsx
const handleLogout = async () => {
  await apiLogout(); // Chama logout do contexto
  setCurrentPage("home"); // Volta para Home
};
```

### **5. O Contexto Limpa `user`**

```tsx
// Em AppContext.tsx
const logout = async () => {
  await authAPI.logout();
  setUser(null); // ✅ User agora é null
};
```

### **6. A Página Muda Automaticamente para Home**

```tsx
{
  !user && (
    <Home onNavigateToLogin={() => setCurrentPage("login")} /> // ✅ Home novamente
  );
}
```

---

## 6️⃣ Exemplo Prático: O que Acontece Passo a Passo

### **Cenário: Utilizador abre a app**

```
1. App.tsx carrega
2. currentPage = 'home', user = null, loading = true
3. useEffect verifica: "Existe user na sessão?"
   → NÃO existe
4. loading = false
5. Renderiza: {!user && <Home ... />}
   → Mostra a página HOME ✅
```

### **Cenário: Utilizador clica "Entrar/Registar"**

```
1. Home.tsx chama onNavigateToLogin()
2. App.tsx executa: setCurrentPage('login')
3. currentPage = 'login', user = null
4. Renderiza: {currentPage === 'login' && !user && <Login ... />}
   → Mostra a página LOGIN ✅
```

### **Cenário: Utilizador faz login com sucesso**

```
1. Login.tsx chama login(email, password)
2. AppContext.tsx atualiza: setUser(userData)
3. user = {id: 1, nome: "João", email: "joao@example.com", ...}
4. App.tsx renderiza novamente
5. Renderiza: {user && <Dashboard ... />}
   → Mostra o DASHBOARD ✅
```

### **Cenário: Utilizador clica "Sair"**

```
1. Dashboard.tsx chama onLogout()
2. AppContext.tsx executa: logout()
3. setUser(null)
4. setCurrentPage('home')
5. user = null
6. Renderiza: {!user && <Home ... />}
   → Mostra HOME novamente ✅
```

---

## 7️⃣ Vantagens vs Limitações

### ✅ **Vantagens**

| Vantagem                     | Explicação                                        |
| ---------------------------- | ------------------------------------------------- |
| **Simples**                  | Sem dependências externas (ex: React Router)      |
| **Rápido**                   | Apenas re-renderiza os componentes necessários    |
| **Fácil de entender**        | Lógica clara e direta                             |
| **Sincronização automática** | Quando `user` muda, a página muda automaticamente |

### ❌ **Limitações**

| Limitação           | Problema                                        |
| ------------------- | ----------------------------------------------- |
| **Sem URLs reais**  | Não há `/home`, `/login`, `/dashboard`          |
| **Sem histórico**   | O botão "voltar" do browser não funciona        |
| **Sem bookmarking** | Não podes partilhar URLs de páginas específicas |
| **Difícil SEO**     | Os motores de busca não indexam bem             |

---

## 8️⃣ Estrutura de Ficheiros Envolvida

```
src/
├── App.tsx                    ← 🎛️ Centro de controlo (lógica das rotas)
├── context/
│   └── AppContext.tsx         ← 🔐 Gerencia autenticação e user
├── components/
│   ├── Home.tsx               ← 📄 Rota 1: Página inicial
│   ├── Login.tsx              ← 🔐 Rota 2: Autenticação
│   ├── Dashboard.tsx          ← 📊 Rota 3: Painel principal
│   ├── PlaysSection.tsx       ← 🎬 Aba do Dashboard: Jogadas
│   ├── TipsSection.tsx        ← 💡 Aba do Dashboard: Dicas
│   ├── TeamStatsSection.tsx   ← 👥 Aba do Dashboard: Stats de Equipas
│   └── AthleteStatsSection.tsx ← 🏃 Aba do Dashboard: Stats de Atletas
└── services/
    └── api.ts                 ← 📡 Chamadas à API (login, dados, etc)
```

---

## 9️⃣ Resumo Visual

```
┌────────────────────────────────────────────────┐
│          COMPONENTE APP.TSX (PRINCIPAL)        │
├────────────────────────────────────────────────┤
│                                                │
│  Estado Local:                                 │
│  • currentPage: 'home' | 'login' | 'dashboard'│
│                                                │
│  Contexto Global (AppContext):                │
│  • user: User | null                          │
│  • loading: boolean                           │
│  • login(), logout(), etc                     │
│                                                │
│  Lógica de Renderização:                      │
│  IF currentPage === 'home' && !user           │
│    → Mostra <Home />                          │
│  ELSE IF currentPage === 'login' && !user     │
│    → Mostra <Login />                         │
│  ELSE IF user                                 │
│    → Mostra <Dashboard />                     │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 🔟 Perguntas Frequentes

### **P: E se o utilizador recarregar a página?**

**R:** O `useEffect` em `App.tsx` verifica se existe um `user` na sessão. Se sim, mantém no Dashboard; se não, volta para Home.

### **P: Como o sistema sabe se o utilizador está autenticado?**

**R:** Através do objeto `user` do contexto. Se `user` é `null`, não está autenticado; se tem dados, está autenticado.

### **P: Por que não usam React Router?**

**R:** O projeto optou por simplicidade. React Router é melhor para apps maiores com muitas páginas, mas para 3 rotas simples, este sistema é suficiente.

### **P: Como se protegem as rotas (impedir acesso sem autenticação)?**

**R:** No `App.tsx`, o Dashboard só renderiza se `{user &&` — ou seja, só mostra se user existe.

### **P: E se quisermos adicionar mais rotas?**

**R:** Basta adicionar mais estados em `currentPage` e mais condições no return de `App.tsx`.

---

## 📚 Código Completo Simplificado

```tsx
// App.tsx (versão resumida)

import { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";

function AppContent() {
  // ✅ Estado local: controla qual página mostrar
  const [currentPage, setCurrentPage] = useState("home");

  // ✅ Estado global: dados do utilizador
  const { user, loading } = useApp();

  // ✅ Renderização condicional
  return (
    <div>
      {currentPage === "home" && !user && (
        <Home onNavigateToLogin={() => setCurrentPage("login")} />
      )}

      {currentPage === "login" && !user && (
        <Login onBack={() => setCurrentPage("home")} />
      )}

      {user && <Dashboard onLogout={() => setCurrentPage("home")} />}
    </div>
  );
}

export default App;
```

---

## 🎓 Conclusão

O sistema de rotas do NexusHand é **simples mas eficaz**:

1. **Estado local** (`currentPage`) controla a navegação
2. **Contexto global** (`user`) controla a autenticação
3. **Renderização condicional** decide qual página mostrar
4. **Props como callbacks** permitem comunicação entre componentes

Esta é uma abordagem comum em aplicações React pequenas e médias. ✅
