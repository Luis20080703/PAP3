# PAP3 — Plataforma Andebol (Frontend + API)

# Resumo

Projeto fullstack para gestão e visualização de jogadas, dicas e estatísticas de andebol.
Inclui:

- Frontend: `Andebolonlineplatform-main` (React + TypeScript + Vite)
- Backend: `Api` (Laravel — PHP)

# Estrutura principal

- `Andebolonlineplatform-main/` — Aplicação frontend (Vite, React, TS)
- `Api/` — Backend Laravel com APIs REST

# Funcionalidades principais

- Autenticação (registo/login) de `atleta` e `treinador`.
- Submissão e listagem de jogadas (plays).
- Dicas (conteúdo publicado por utilizadores).
- Estatísticas de equipas e atletas (endpoints REST e componentes UI).
- Comentários em jogadas.

# Tecnologias

- Frontend: React, TypeScript, Vite
- Backend: Laravel (PHP 8+), Eloquent ORM
- Base de dados: MySQL / MariaDB (configuração em `Api/.env`)

# Como executar localmente (PowerShell)

Pré-requisitos

- PHP 8+, Composer, Node.js, npm, MySQL
- Configurar `.env` em `Api/` (copiar `.env.example` e ajustar)

Backend (Laravel)

```powershell
cd C:\PAP3\Api
composer install
# Copiar .env.example para .env e configurar a BD
php artisan key:generate
php artisan migrate --seed    # opcional: popular dados de exemplo
php artisan serve --host=127.0.0.1 --port=8000
```

Frontend (Vite + React)

```powershell
cd C:\PAP3\Andebolonlineplatform-main
npm install
npm run dev
# Vite normalmente corre em http://localhost:5173
```

Testar API manualmente (exemplo)

```powershell
curl http://127.0.0.1:8000/api/test
curl http://127.0.0.1:8000/api/estatisticas-equipas
```

# Endpoints importantes

- `GET /api/test` — health check
- `POST /api/login` — login
- `POST /api/register` — registo
- `GET /api/users` — listar utilizadores
- `GET /api/equipas` — listar equipas
- `GET /api/estatisticas-equipas` — estatísticas de equipas (usado pelo frontend)
- `GET /api/estatisticas-atletas` — estatísticas de atletas
- Rotas REST adicionais em `Api/routes/web.php` (prefixo `/api`)

# Pontos de atenção

- Verifique as configurações de CORS se frontend e backend estiverem em origens diferentes.
- As variáveis de ambiente e segredos não devem ser commitadas.

# Contributos

1. Fork do repositório
2. Criar branch com a feature: `git checkout -b feature/nome`
3. Fazer commit e abrir pull request

# Licença

Licença não especificada — adicionar ficheiro `LICENSE` se necessário.

# Contacto

Para dúvidas contacte o autor do repositório.
