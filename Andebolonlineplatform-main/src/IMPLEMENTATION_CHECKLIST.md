# Checklist de Implementação - Laravel 12 + Livewire 3.5

## 📋 Guia Passo-a-Passo Completo

### ✅ Fase 1: Setup Inicial (2-3 horas)

- [ ] **1.1 Criar projeto Laravel 12**
  ```bash
  composer create-project laravel/laravel handball-platform
  cd handball-platform
  ```

- [ ] **1.2 Configurar base de dados**
  - [ ] Editar `.env` com credenciais da BD
  - [ ] Criar base de dados MySQL: `handball_platform`
  - [ ] Testar conexão: `php artisan migrate` (migrations default)

- [ ] **1.3 Instalar Livewire 3.5**
  ```bash
  composer require livewire/livewire:^3.5
  ```

- [ ] **1.4 Configurar Tailwind CSS**
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
  - [ ] Configurar `tailwind.config.js`
  - [ ] Editar `resources/css/app.css`
  - [ ] Executar `npm run dev`

- [ ] **1.5 Configurar Git (opcional)**
  ```bash
  git init
  git add .
  git commit -m "Setup inicial Laravel + Livewire + Tailwind"
  ```

---

### ✅ Fase 2: Estrutura de Base de Dados (3-4 horas)

- [ ] **2.1 Criar Enums**
  - [ ] `app/Enums/UserType.php`
  - [ ] `app/Enums/Division.php`
  - [ ] `app/Enums/Position.php`
  - [ ] `app/Enums/TipCategory.php`

- [ ] **2.2 Criar Migrations**
  ```bash
  php artisan make:migration create_users_table
  php artisan make:migration create_plays_table
  php artisan make:migration create_comments_table
  php artisan make:migration create_tips_table
  php artisan make:migration create_team_stats_table
  php artisan make:migration create_athlete_stats_table
  ```
  - [ ] Implementar cada migration conforme `DATABASE_SCHEMA.md`
  - [ ] Executar: `php artisan migrate`

- [ ] **2.3 Criar Models**
  ```bash
  php artisan make:model User
  php artisan make:model Play
  php artisan make:model Comment
  php artisan make:model Tip
  php artisan make:model TeamStats
  php artisan make:model AthleteStats
  ```
  - [ ] Implementar cada model conforme `MODELS_REFERENCE.md`
  - [ ] Definir `$fillable`, `$casts`, relações
  - [ ] Adicionar métodos helper

- [ ] **2.4 Testar Models no Tinker**
  ```bash
  php artisan tinker
  >>> User::count()
  >>> App\Models\User::factory()->create()
  ```

---

### ✅ Fase 3: Autenticação (4-5 horas)

- [ ] **3.1 Atualizar User Model**
  - [ ] Adicionar `type` e `team` aos `$fillable`
  - [ ] Cast `type` para `UserType` enum
  - [ ] Adicionar métodos `isCoach()` e `isAthlete()`

- [ ] **3.2 Criar Controllers de Autenticação**
  ```bash
  php artisan make:controller Auth/LoginController
  php artisan make:controller Auth/RegisterController
  ```

- [ ] **3.3 Criar Componentes Livewire de Auth**
  ```bash
  php artisan make:livewire Auth/LoginForm
  php artisan make:livewire Auth/RegisterForm
  ```
  - [ ] Implementar lógica de login
  - [ ] Implementar lógica de registo
  - [ ] Validação de formulários

- [ ] **3.4 Criar Middleware**
  ```bash
  php artisan make:middleware CheckUserType
  ```
  - [ ] Implementar lógica de verificação
  - [ ] Registar em `bootstrap/app.php`

- [ ] **3.5 Definir Rotas de Autenticação**
  - [ ] Editar `routes/web.php`
  - [ ] Rota `/login` → LoginForm
  - [ ] Rota `/logout` → logout action
  - [ ] Middleware `auth` e `guest`

- [ ] **3.6 Testar Autenticação**
  - [ ] Registar utilizador teste (atleta)
  - [ ] Registar utilizador teste (treinador)
  - [ ] Testar login/logout
  - [ ] Verificar sessões

---

### ✅ Fase 4: Layouts e Componentes Base (2-3 horas)

- [ ] **4.1 Criar Layouts Blade**
  - [ ] `resources/views/layouts/app.blade.php`
  - [ ] `resources/views/layouts/guest.blade.php`
  - [ ] `resources/views/layouts/dashboard.blade.php`

- [ ] **4.2 Criar Componentes Blade**
  ```bash
  php artisan make:component Button
  php artisan make:component Card
  php artisan make:component Input
  php artisan make:component Alert
  php artisan make:component Badge
  ```
  - [ ] Implementar cada componente
  - [ ] Testar em views de exemplo

- [ ] **4.3 Configurar Estilos Tailwind**
  - [ ] Editar `resources/css/app.css`
  - [ ] Adicionar typography customizada
  - [ ] Adicionar componentes reutilizáveis
  - [ ] Compilar: `npm run build`

- [ ] **4.4 Criar Flash Messages Component**
  - [ ] `resources/views/components/flash-messages.blade.php`
  - [ ] Integrar nos layouts

---

### ✅ Fase 5: Página Inicial (2-3 horas)

- [ ] **5.1 Criar Componente HomePage**
  ```bash
  php artisan make:livewire Home/HomePage
  ```

- [ ] **5.2 Implementar Secções**
  - [ ] Hero section
  - [ ] Sobre o Andebol
  - [ ] Regras básicas
  - [ ] Curiosidades
  - [ ] Navegação por tabs

- [ ] **5.3 Definir Rota**
  - [ ] Rota `/` → HomePage
  - [ ] Testar navegação

- [ ] **5.4 Adicionar Conteúdo**
  - [ ] Escrever história do andebol
  - [ ] Listar regras principais
  - [ ] Adicionar curiosidades

---

### ✅ Fase 6: Dashboard (3-4 horas)

- [ ] **6.1 Criar Componente Dashboard**
  ```bash
  php artisan make:livewire Dashboard/DashboardLayout
  ```

- [ ] **6.2 Implementar Navegação**
  - [ ] Header com info do utilizador
  - [ ] Tabs: Jogadas, Dicas, Stats Equipas, Stats Atletas
  - [ ] Botão de logout
  - [ ] Lógica de troca de tabs

- [ ] **6.3 Integrar com Auth**
  - [ ] Middleware `auth` na rota
  - [ ] Mostrar nome e tipo de utilizador
  - [ ] Redirecionar após login

- [ ] **6.4 Testar Dashboard**
  - [ ] Login como atleta
  - [ ] Login como treinador
  - [ ] Verificar permissões

---

### ✅ Fase 7: Módulo de Jogadas (6-8 horas)

- [ ] **7.1 Criar Componentes Livewire**
  ```bash
  php artisan make:livewire Plays/PlaysList
  php artisan make:livewire Plays/CreatePlay
  php artisan make:livewire Plays/EditPlay
  php artisan make:livewire Plays/PlayComments
  ```

- [ ] **7.2 PlaysList - Listagem**
  - [ ] Query com eager loading (author, comments)
  - [ ] Paginação (10 por página)
  - [ ] Filtro por pesquisa
  - [ ] Filtro por categoria
  - [ ] Restrição: atletas só veem da sua equipa
  - [ ] Botão "Nova Jogada" (só treinadores)

- [ ] **7.3 CreatePlay - Criar**
  - [ ] Modal/Dialog
  - [ ] Formulário: título, descrição, vídeo URL, categoria
  - [ ] Validação
  - [ ] Guardar com author_id do user autenticado
  - [ ] Fechar modal e atualizar lista
  - [ ] Flash message de sucesso

- [ ] **7.4 EditPlay - Editar**
  - [ ] Carregar dados da jogada
  - [ ] Formulário pre-preenchido
  - [ ] Validação de permissões (só autor)
  - [ ] Atualizar jogada
  - [ ] Flash message

- [ ] **7.5 PlayComments - Comentários**
  - [ ] Listar comentários de uma jogada
  - [ ] Formulário para adicionar comentário
  - [ ] Validação
  - [ ] Atualização real-time
  - [ ] Mostrar autor e data

- [ ] **7.6 Eliminar Jogadas**
  - [ ] Botão eliminar (só treinador autor)
  - [ ] Confirmação
  - [ ] Soft delete ou delete permanente
  - [ ] Atualizar lista

- [ ] **7.7 Upload de Vídeos (Opcional)**
  - [ ] Configurar storage: `php artisan storage:link`
  - [ ] Validação de ficheiros
  - [ ] Upload para `storage/app/public/plays`
  - [ ] Guardar path na BD

---

### ✅ Fase 8: Módulo de Dicas (4-5 horas)

- [ ] **8.1 Criar Componentes Livewire**
  ```bash
  php artisan make:livewire Tips/TipsList
  php artisan make:livewire Tips/CreateTip
  php artisan make:livewire Tips/EditTip
  ```

- [ ] **8.2 TipsList - Listagem**
  - [ ] Query com eager loading
  - [ ] Filtro por categoria
  - [ ] Pesquisa
  - [ ] Paginação
  - [ ] Cards de dicas

- [ ] **8.3 CreateTip - Criar**
  - [ ] Formulário: título, descrição, categoria, conteúdo
  - [ ] Dropdown de categorias (enum)
  - [ ] Textarea ou editor markdown para conteúdo
  - [ ] Validação
  - [ ] Guardar

- [ ] **8.4 EditTip - Editar**
  - [ ] Permissões (autor ou treinador)
  - [ ] Formulário pre-preenchido
  - [ ] Atualizar

- [ ] **8.5 Visualização de Dicas**
  - [ ] Renderizar markdown (biblioteca CommonMark)
  - [ ] Layout de leitura
  - [ ] Ícones por categoria

- [ ] **8.6 Eliminar Dicas**
  - [ ] Botão eliminar
  - [ ] Confirmação
  - [ ] Soft delete

---

### ✅ Fase 9: Módulo de Estatísticas (5-6 horas)

- [ ] **9.1 Criar Componentes Livewire**
  ```bash
  php artisan make:livewire Stats/TeamStats
  php artisan make:livewire Stats/AthleteStats
  ```

- [ ] **9.2 TeamStats - Estatísticas de Equipas**
  - [ ] Query de team_stats
  - [ ] Filtro por escalão (dropdown)
  - [ ] Tabela ordenada por pontos
  - [ ] Colunas: Equipa, Jogos, V-E-D, GM-GS, Pontos
  - [ ] Cálculos: pontos, diferença de golos
  - [ ] Responsivo

- [ ] **9.3 AthleteStats - Estatísticas de Atletas**
  - [ ] Query de athlete_stats
  - [ ] Filtro por escalão
  - [ ] Filtro por equipa
  - [ ] Permissões: atletas só veem da sua equipa
  - [ ] Tabela de top marcadores
  - [ ] Colunas: Nome, Equipa, Posição, Golos, Jogos, Média
  - [ ] Ordenação por golos (descendente)

- [ ] **9.4 Gráficos (Opcional)**
  - [ ] Instalar Chart.js ou biblioteca similar
  - [ ] Gráfico de golos por jogo
  - [ ] Gráfico de distribuição de posições
  - [ ] Gráfico de evolução de estatísticas

---

### ✅ Fase 10: Seeders e Dados de Teste (2-3 horas)

- [ ] **10.1 Criar Factories**
  ```bash
  php artisan make:factory UserFactory
  php artisan make:factory PlayFactory
  php artisan make:factory TipFactory
  ```

- [ ] **10.2 Criar Seeders**
  ```bash
  php artisan make:seeder UserSeeder
  php artisan make:seeder PlaySeeder
  php artisan make:seeder TipSeeder
  php artisan make:seeder TeamStatsSeeder
  php artisan make:seeder AthleteStatsSeeder
  ```

- [ ] **10.3 Implementar Seeders**
  - [ ] UserSeeder: criar atletas e treinadores de teste
  - [ ] PlaySeeder: usar dados de `mockData.ts` do React
  - [ ] TipSeeder: usar dados de `mockData.ts`
  - [ ] TeamStatsSeeder: estatísticas de equipas
  - [ ] AthleteStatsSeeder: estatísticas de atletas

- [ ] **10.4 Executar Seeders**
  ```bash
  php artisan db:seed
  # ou
  php artisan migrate:fresh --seed
  ```

- [ ] **10.5 Verificar Dados**
  - [ ] Abrir Tinker e consultar registos
  - [ ] Login com utilizadores de teste
  - [ ] Verificar jogadas, dicas e stats

---

### ✅ Fase 11: Políticas e Autorização (2-3 horas)

- [ ] **11.1 Criar Policies**
  ```bash
  php artisan make:policy PlayPolicy --model=Play
  php artisan make:policy TipPolicy --model=Tip
  ```

- [ ] **11.2 Implementar PlayPolicy**
  - [ ] `view`: atletas só veem da sua equipa
  - [ ] `create`: só treinadores
  - [ ] `update`: só autor treinador
  - [ ] `delete`: só autor treinador

- [ ] **11.3 Implementar TipPolicy**
  - [ ] `create`: todos autenticados
  - [ ] `update`: só autor
  - [ ] `delete`: autor ou treinador

- [ ] **11.4 Aplicar Policies**
  - [ ] Usar `$this->authorize()` nos componentes
  - [ ] Usar `@can` nas views
  - [ ] Testar permissões

---

### ✅ Fase 12: Validações e Feedback (2-3 horas)

- [ ] **12.1 Validações de Formulários**
  - [ ] Regras de validação em todos os componentes
  - [ ] Mensagens de erro em português
  - [ ] Real-time validation com Livewire

- [ ] **12.2 Flash Messages**
  - [ ] Sucesso ao criar/editar/eliminar
  - [ ] Erros de validação
  - [ ] Avisos de permissões

- [ ] **12.3 Loading States**
  - [ ] `wire:loading` em botões
  - [ ] Spinners durante operações
  - [ ] Disable de botões durante submit

- [ ] **12.4 Confirmações**
  - [ ] Confirmar antes de eliminar
  - [ ] Usar `wire:confirm` ou SweetAlert2

---

### ✅ Fase 13: Páginas de Erro (1 hora)

- [ ] **13.1 Criar Views de Erro**
  - [ ] `resources/views/errors/404.blade.php`
  - [ ] `resources/views/errors/403.blade.php`
  - [ ] `resources/views/errors/500.blade.php`

- [ ] **13.2 Testar Páginas de Erro**
  - [ ] Aceder a rota inexistente (404)
  - [ ] Aceder sem permissões (403)

---

### ✅ Fase 14: Otimização e Performance (2-3 horas)

- [ ] **14.1 Eager Loading**
  - [ ] Verificar queries N+1
  - [ ] Adicionar `with()` onde necessário
  - [ ] Usar Laravel Debugbar para debug

- [ ] **14.2 Caching (Opcional)**
  - [ ] Cache de estatísticas
  - [ ] Cache de contagens
  - [ ] Configurar Redis (opcional)

- [ ] **14.3 Índices de BD**
  - [ ] Verificar migrations têm índices corretos
  - [ ] Adicionar índices em colunas de pesquisa

- [ ] **14.4 Pagination**
  - [ ] Limitar resultados com paginação
  - [ ] Usar cursor pagination se necessário

---

### ✅ Fase 15: Testes e Debugging (3-4 horas)

- [ ] **15.1 Testes Manuais**
  - [ ] Testar fluxo completo como atleta
  - [ ] Testar fluxo completo como treinador
  - [ ] Testar todas as funcionalidades CRUD
  - [ ] Testar validações
  - [ ] Testar permissões

- [ ] **15.2 Testes Unitários (Opcional)**
  ```bash
  php artisan make:test UserTest
  php artisan make:test PlayTest
  ```
  - [ ] Testar models
  - [ ] Testar relações
  - [ ] Executar: `php artisan test`

- [ ] **15.3 Correção de Bugs**
  - [ ] Listar bugs encontrados
  - [ ] Corrigir um a um
  - [ ] Re-testar

---

### ✅ Fase 16: Documentação (2 horas)

- [ ] **16.1 README.md**
  - [ ] Descrição do projeto
  - [ ] Requisitos (PHP 8.2+, MySQL, etc.)
  - [ ] Instruções de instalação
  - [ ] Comandos úteis
  - [ ] Credenciais de teste

- [ ] **16.2 Comentários no Código**
  - [ ] Documentar métodos complexos
  - [ ] PHPDoc nos models

- [ ] **16.3 Guia de Utilizador (Opcional)**
  - [ ] Manual para atletas
  - [ ] Manual para treinadores

---

### ✅ Fase 17: Deploy (Opcional - 2-3 horas)

- [ ] **17.1 Preparar para Produção**
  - [ ] `.env` de produção
  - [ ] `APP_ENV=production`
  - [ ] `APP_DEBUG=false`
  - [ ] Gerar `APP_KEY`: `php artisan key:generate`

- [ ] **17.2 Otimizações**
  ```bash
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
  npm run build
  ```

- [ ] **17.3 Deploy em Servidor**
  - [ ] Configurar Apache/Nginx
  - [ ] Configurar base de dados
  - [ ] Executar migrations: `php artisan migrate --force`
  - [ ] Executar seeders (opcional)

---

## 📊 Progresso Total

**Total Estimado: 50-60 horas** (distribuídas em 2-3 semanas)

### Resumo por Fase:
- ✅ Setup e BD: ~10 horas
- ✅ Autenticação e Layouts: ~8 horas
- ✅ Funcionalidades Core: ~20 horas
- ✅ Polimento e Testes: ~10 horas
- ✅ Documentação e Deploy: ~5 horas

---

## 🎯 Prioridades

### Must Have (Essencial)
- Autenticação (login/registo)
- Dashboard com navegação
- Jogadas (CRUD completo)
- Dicas (CRUD completo)
- Estatísticas (visualização)
- Permissões (atleta vs treinador)

### Should Have (Importante)
- Comentários em jogadas
- Filtros e pesquisa
- Upload de vídeos
- Flash messages
- Páginas de erro

### Could Have (Desejável)
- Gráficos de estatísticas
- Exportar dados (CSV/PDF)
- API REST
- Testes automatizados

### Won't Have (Não prioritário)
- Chat em tempo real
- Notificações push
- App mobile nativa

---

## 💡 Dicas de Produtividade

1. **Trabalha por fases**: Não saltes fases, completa uma antes de avançar
2. **Commit frequentemente**: `git commit` após cada funcionalidade
3. **Testa à medida que desenvolves**: Não acumules testes para o fim
4. **Usa o Tinker**: Testa queries e relações rapidamente
5. **Laravel Debugbar**: Instala para debug de queries
6. **Livewire DevTools**: Extensão Chrome para debug
7. **Documentação oficial**: Consulta sempre a docs oficial

---

## 🔗 Recursos Úteis

- **Laravel Docs**: https://laravel.com/docs/12.x
- **Livewire Docs**: https://livewire.laravel.com/docs/3.x
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Laracasts**: https://laracasts.com (tutoriais em vídeo)

---

## ✅ Conclusão

Ao completar esta checklist, terás uma aplicação Laravel + Livewire totalmente funcional para a tua plataforma de andebol!

**Boa sorte com o teu projeto PAP!** 🎉🤾
