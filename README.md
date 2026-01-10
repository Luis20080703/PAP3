# 🏆 NexusHand — Plataforma de Andebol

> **"Andebol mais que um desporto"**

## 📋 Resumo Executivo

**NexusHand** é uma plataforma web fullstack inovadora desenvolvida para revolucionar a gestão de equipas de andebol. Centraliza estatísticas, análise de vídeo (jogadas), dicas técnicas e gestão de equipas numa interface moderna e intuitiva. O projeto visa profissionalizar a gestão desportiva servindo tanto atletas como treinadores.

---

## 🏗️ Arquitetura e Tecnologias

A solução utiliza uma arquitetura moderna separando Frontend e Backend:

### **Frontend (`Andebolonlineplatform-main/`)**
- **Core:** React 18, TypeScript, Vite
- **UI/UX:** Tailwind CSS, Shadcn/ui
- **Funcionalidades:** SPA (Single Page Application), Gestão de Estado Global, PWA ready.

### **Backend (`Api/`)**
- **Core:** Laravel 12 (PHP 8.2+)
- **Base de Dados:** SQLite
- **API:** RESTful, Autenticação Sanctum
- **Segurança:** Validação de dados.

---

## ⚙️ Funcionalidades e Relatório Técnico

### 🔐 1. Sistema de Autenticação e Perfis
O sistema utiliza **Laravel Sanctum** para autenticação segura baseada em tokens.

- **Atletas:** O registo requer **aprovação de um Treinador ou Administrador**. Até lá, o acesso é limitado.
- **Treinadores:** O registo requer **aprovação de um Administrador**. Até lá, o acesso é limitado.
- **Administradores:** Têm controlo total sobre a plataforma (gestão de equipas, utilizadores e conteúdos).

**Permissões (ACL):**
- Os dados são isolados: atletas só veem as suas estatísticas; treinadores só veem a sua equipa.

### 📊 2. Gestão de Estatísticas Desportivas
A plataforma calcula e apresenta métricas detalhadas para análise de performance.

**Estatísticas de Atleta:**
- **Entrada de Dados:** Registo de golos, cartões (amarelo/vermelho), exclusões (2 minutos) e jogos disputados.
- **Cálculo Automático:** Médias de golos por jogo e totais acumulados.
- **Visualização:** Dashboard pessoal com gráficos e indicadores de progresso.

**Estatísticas de Equipa:**
- **Agregação:** Soma automática das estatísticas de todos os atletas da equipa.
- **Rankings:** Tabelas de "Melhores Marcadores" (Top 5).
- **Cartões e Disciplina:** Visão geral das sanções da equipa.

### 🎥 3. Sistema de Vídeo e Análise Tática (Jogadas)
Módulo central para partilha e análise de vídeos de andebol.

- **Formatos Suportados:**
    - **YouTube:** Integração nativa (inclui suporte a Shorts).
    - **Ficheiros Locais:** Upload de vídeos diretamente para a plataforma.
- **Metadados:** Categorização (Ataque, Defesa, Contra-ataque, Guarda-redes), Título e Descrição.
- **Social:**
    - **Comentários:** Discussão tática contextualizada em cada vídeo.
    - **Autoria:** Identificação clara de quem submeteu a jogada (Atleta ou Treinador).

### 👥 4. Administração e Gestão de Equipas
Ferramentas dedicadas para a organização estrutural do clube/equipa.

- **Dashboard Administrativo:**
    - Criação e edição de Equipas.
    - Validação de registos de Treinadores pendentes.
    - Moderação de conteúdo (capacidade de apagar jogadas ou comentários impróprios).
- **Escalões:** Gestão de diferentes categorias etárias.

### 💡 5. Dicas e Partilha de Conhecimento
Secção dedicada ao conteúdo educacional.
- Partilha de artigos ou pequenas dicas sobre técnica, tática, preparação física e mental.
- Categorização por tipo de conteúdo.

---

## 📱 Interface e Experiência (UX/UI)
- **Design System:** Baseado em **Tailwind CSS** e **Shadcn/ui** para uma aparência clean e moderna.
- **Responsividade:** Totalmente adaptado para dispositivos móveis (Mobile-first).
- **Feedback Visual:** Spinners de carregamento, Toasts para sucesso/erro e tratamentos de estados vazios.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- PHP 8.2+, Composer
- Node.js, npm


### 1. Configurar o Backend (Laravel)

```powershell
cd C:\PAP3\Api

# 1. Instalar dependências PHP
composer install

# 2. Configurar ambiente
# Copie o .env.example para .env e configure os dados da Base de Dados (DB_DATABASE, DB_USERNAME, etc.)
cp .env.example .env
php artisan key:generate

# 3. Migrar Base de Dados
php artisan migrate --seed    # --seed é opcional para dados de teste

# 4. Iniciar Servidor API
php artisan serve --host=127.0.0.1 --port=8000
```

### 2. Configurar o Frontend (React)

```powershell
cd C:\PAP3\Andebolonlineplatform-main

# 1. Instalar dependências JS
npm install

# 2. Iniciar Servidor de Desenvolvimento
npm run dev
# Aceda a http://localhost:5173 (ou porta indicada)
```

**Nota:** Certifique-se que o ficheiro `.env` (ou configuração do axios) no Frontend aponta para a URL correta da API (`http://127.0.0.1:8000`).

---

## 📚 Documentação da API

Alguns dos principais endpoints disponíveis (`/api`):

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/login` | Autenticação de utilizadores |
| `POST` | `/register` | Registo de novos utilizadores |
| `GET`  | `/equipas` | Listagem de equipas disponíveis |
| `GET`  | `/estatisticas-atletas` | Dados individuais do atleta autenticado |
| `GET`  | `/estatisticas-equipas` | Dados agregados da equipa |
| `GET`  | `/jogadas` | Feed de vídeos/jogadas da equipa |

