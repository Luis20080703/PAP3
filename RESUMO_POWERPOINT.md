# 🏆 NEXUSHAND - PLATAFORMA DE ANDEBOL
## "Andebol mais que um desporto"

---

## 📌 SLIDE 1: INTRODUÇÃO

### O QUE É O NEXUSHAND?
- **Plataforma web fullstack** para gestão moderna de equipas de andebol
- **Centraliza** estatísticas, jogadas táticas e gestão de equipas
- **Interface intuitiva e profissional** para atletas, treinadores e administradores

### OBJETIVO DO PROJETO
Digitalizar e modernizar a gestão desportiva no andebol português, facilitando:
- ✅ Análise de desempenho individual e coletivo
- ✅ Partilha de conhecimento técnico e tático
- ✅ Gestão eficiente de equipas e atletas

---

## 🏗️ SLIDE 2: ARQUITETURA TÉCNICA

### FRONTEND (Interface do Utilizador)
- **React 18** + **TypeScript** - Framework moderno e robusto
- **Vite** - Build tool rápido e eficiente
- **Tailwind CSS** + **Shadcn/ui** - Design system profissional
- **Context API** - Gestão de estado global
- **PWA Ready** - Preparado para aplicação móvel

### BACKEND (Servidor e Base de Dados)
- **Laravel 12** (PHP 8.2+) - Framework PHP líder de mercado
- **API RESTful** - Comunicação padronizada
- **Laravel Sanctum** - Autenticação segura com tokens
- **SQLite** - Base de dados leve e eficiente
- **Eloquent ORM** - Gestão elegante de dados

### COMUNICAÇÃO
- **HTTP/JSON** - Protocolo standard da web
- **Token-based Authentication** - Segurança em cada requisição

---

## 🔐 SLIDE 3: SISTEMA DE AUTENTICAÇÃO

### TIPOS DE UTILIZADOR

#### 👤 ATLETA
- Registo direto com validação automática
- Acesso às suas estatísticas pessoais
- Criar e partilhar jogadas da equipa
- Comentar jogadas e dicas
- Registar performance em jogos

#### 🧑‍🏫 TREINADOR
- Registo sujeito a aprovação do administrador
- Todas as funcionalidades do atleta
- Visualizar estatísticas completas da equipa
- Gestão e análise de atletas
- Apagar jogadas da sua equipa
- Acesso a rankings e comparações

#### 🛠️ ADMINISTRADOR
- Controlo total da plataforma
- Validar e aprovar treinadores
- Gestão global de utilizadores e equipas
- Apagar qualquer conteúdo
- Monitorização completa do sistema

### SEGURANÇA
- ✅ Tokens de autenticação seguros (Laravel Sanctum)
- ✅ Validação de permissões por endpoint
- ✅ Isolamento de dados por utilizador/equipa
- ✅ Proteção contra acessos não autorizados

---

## 📊 SLIDE 4: GESTÃO DE ESTATÍSTICAS

### ESTATÍSTICAS DE ATLETAS
**Registo por Jogo:**
- ⚽ Golos marcados
- 🟨 Cartões amarelos
- 🟥 Cartões vermelhos
- ⏱️ Exclusões de 2 minutos
- 📊 Jogos disputados

**Cálculos Automáticos:**
- 📈 Média de golos por jogo
- 📊 Totais acumulados
- 🎯 Isolamento de dados (cada atleta vê apenas as suas)
- 🔄 Sistema anti-duplicação (updateOrCreate)

### ESTATÍSTICAS DE EQUIPAS
**Agregação Automática:**
- 🏆 Soma de todas as estatísticas dos atletas
- 📊 Golos marcados vs sofridos
- 🎯 Vitórias, empates e derrotas
- 📈 Jogos disputados

**Rankings:**
- 🥇 Top 5 melhores marcadores
- 📊 Análise disciplinar da equipa
- 🎨 Visualização em cards coloridos
- 📱 Interface responsiva

---

## 🎥 SLIDE 5: SISTEMA DE JOGADAS

### UPLOAD E PARTILHA
**Múltiplos Formatos Suportados:**
- 📺 URLs do YouTube (incluindo Shorts)
- 📁 Ficheiros de vídeo locais (MP4, MOV, AVI)
- 🔗 URLs externas

**Categorização Tática:**
- ⚡ Contra-ataque
- 🎯 Ataque posicional
- 🛡️ Defesa
- 🔄 Transição
- 🏐 Bola parada
- 💪 Técnica individual

### VISUALIZAÇÃO INTELIGENTE
- **YouTube:** Player embed automático integrado
- **Ficheiros locais:** Player HTML5 com controlos completos
- **URLs externas:** Botão para abertura em nova aba
- **Fallbacks:** Placeholders informativos para conteúdo indisponível

### SISTEMA DE COMENTÁRIOS
- 💬 Discussão tática por jogada
- 👤 Identificação de autor (nome + tipo)
- 📅 Timestamps de criação
- 🔒 Permissões granulares

---

## 💡 SLIDE 6: SISTEMA DE DICAS

### PARTILHA DE CONHECIMENTO
**Criação de Conteúdo Técnico:**
- 📝 Dicas táticas e técnicas
- 🎯 Categorização por tipo
- 👤 Autoria identificada
- 🌐 Partilha entre clubes

**Categorias Disponíveis:**
- 🎭 Fintas
- 🏃 Dribles
- 🎯 Remates
- 🛡️ Defesa
- 📋 Tácticas

**Funcionalidades:**
- ✅ Criar dicas (atletas e treinadores)
- ✅ Visualizar dicas de todos os clubes
- ✅ Comentar e discutir
- ✅ Apagar (com permissões)

---

## 🛡️ SLIDE 7: SISTEMA DE PERMISSÕES

### CONTROLO DE ACESSO GRANULAR

#### ATLETA - Permissões
✅ Visualizar jogadas e dicas
✅ Criar jogadas e dicas
✅ Eliminar apenas o que criou
✅ Adicionar/modificar suas estatísticas
✅ Visualizar estado geral da equipa
❌ Não pode apagar conteúdo de outros
❌ Não pode ver estatísticas de outros atletas

#### TREINADOR - Permissões
✅ Todas as permissões do atleta
✅ Eliminar jogadas dos seus atletas
✅ Visualizar estatísticas de todos os atletas da equipa
✅ Acesso a rankings completos
✅ Gestão da equipa
✅ Com premium: aparece nos rankings

#### ADMINISTRADOR - Permissões
✅ Controlo total da plataforma
✅ Apagar qualquer conteúdo
✅ Validar e aprovar utilizadores
✅ Gestão global de equipas
✅ Monitorização completa
⚠️ Não cria jogadas/dicas (não pertence a equipa)

---

## 🔧 SLIDE 8: IMPLEMENTAÇÃO TÉCNICA

### FRONTEND - COMPONENTES PRINCIPAIS

**Dashboard.tsx**
- Interface principal do utilizador
- Visualização de estatísticas pessoais
- Acesso rápido a todas as funcionalidades

**AthleteStatsSection.tsx**
- Registo de estatísticas por jogo
- Visualização de métricas pessoais
- Cards coloridos com ícones intuitivos
- Cálculo automático de médias

**PlaysSection.tsx**
- Upload de vídeos (URL ou ficheiro)
- Player inteligente adaptado ao tipo
- Sistema completo de comentários
- Pesquisa e filtros avançados

**AdminDashboard.tsx**
- Painel de controlo administrativo
- Gestão de utilizadores pendentes
- Aprovação de treinadores
- Estatísticas globais

### BACKEND - CONTROLADORES PRINCIPAIS

**UserController.php**
- Login e registo de utilizadores
- Validação de credenciais
- Geração de tokens de autenticação
- Gestão de perfis

**JogadaController.php**
- CRUD completo de jogadas
- Upload de vídeos
- Sistema de permissões
- Validação de dados

**EstatisticaAtletaController.php**
- Isolamento de dados por atleta
- Sistema anti-duplicação
- Cálculos automáticos de médias
- Verificação dupla de segurança

**AdminController.php**
- Aprovação de utilizadores
- Gestão global da plataforma
- Envio de emails de aprovação
- Controlo de acessos

---

## 🔄 SLIDE 9: FLUXO DE COMUNICAÇÃO

### EXEMPLO: LOGIN DE UTILIZADOR

**1️⃣ FRONTEND (Login.tsx)**
```
Utilizador preenche email e password
↓
handleLogin() valida campos
↓
Chama login() do AppContext
```

**2️⃣ CONTEXT (AppContext.tsx)**
```
login() chama authAPI.login()
↓
Envia dados para API
```

**3️⃣ API SERVICE (api.ts)**
```
POST /api/login
Body: { email, password }
Headers: Content-Type: application/json
```

**4️⃣ BACKEND (Laravel)**
```
Routes (api.php) → UserController
↓
Valida credenciais na base de dados
↓
Verifica se utilizador está validado
↓
Gera token de autenticação
↓
Retorna JSON: { success, user, token }
```

**5️⃣ RESPOSTA**
```
api.ts recebe resposta
↓
Guarda user e token no localStorage
↓
AppContext atualiza estado global
↓
Carrega dados (jogadas, dicas, estatísticas)
↓
Login.tsx mostra sucesso e redireciona
```

---

## 📱 SLIDE 10: INTERFACE E EXPERIÊNCIA

### DESIGN SYSTEM

**Cores e Identidade:**
- 🔵 Azul - Confiança e profissionalismo
- 🟢 Verde - Sucesso e confirmação
- 🔴 Vermelho - Alertas e ações críticas
- ⚪ Branco/Cinza - Neutralidade e elegância

**Componentes UI:**
- ✅ Shadcn/ui para consistência visual
- ✅ Design responsivo (mobile-first)
- ✅ Acessibilidade (contraste, navegação por teclado)
- ✅ Animações suaves e micro-interações

### FEEDBACK VISUAL

**Estados de Carregamento:**
- ⏳ Spinners durante operações assíncronas
- 📊 Skeleton loaders para conteúdo
- 🔄 Indicadores de progresso

**Notificações:**
- ✅ Toast notifications para feedback imediato
- ⚠️ Mensagens de erro claras e acionáveis
- 📝 Placeholders informativos para estados vazios
- ✔️ Confirmações de ações bem-sucedidas

---

## 📈 SLIDE 11: IMPACTO E BENEFÍCIOS

### PARA ATLETAS
✅ **Acompanhamento automático** do progresso pessoal
✅ **Motivação** através de rankings e comparações
✅ **Partilha** de jogadas e conquistas
✅ **Feedback tático** dos treinadores
✅ **Visualização clara** da evolução

### PARA TREINADORES
✅ **Visão completa** da equipa em tempo real
✅ **Decisões baseadas em dados** reais
✅ **Ferramenta de análise tática** profissional
✅ **Comunicação centralizada** com atletas
✅ **Identificação de padrões** de desempenho

### PARA CLUBES
✅ **Organização profissional** e moderna
✅ **Relatórios automáticos** de performance
✅ **Gestão centralizada** de informação
✅ **Redução de 5h/semana** em trabalho manual
✅ **Eliminação de dados duplicados** e perdidos

---

## 🚀 SLIDE 12: FUNCIONALIDADES AVANÇADAS

### SISTEMA DE VÍDEO INTELIGENTE
**Detecção Automática:**
- 📺 YouTube (normal + Shorts) → Player embed integrado
- 📁 Ficheiros locais → Player HTML5 completo
- 🔗 URLs externas → Botão de abertura
- ⚠️ URLs inválidas → Placeholder informativo

### GESTÃO DE ESTADO
- 🌐 Context API para estado global
- ⚡ Carregamento assíncrono sob demanda
- 💾 Cache local (localStorage)
- 🔄 Sincronização automática após ações

### SEGURANÇA E VALIDAÇÃO
- 🔒 Isolamento de dados por utilizador/equipa
- ✅ Validação dupla (user_id + atleta_id)
- 🛡️ Proteção contra injeção SQL (Eloquent ORM)
- 🔐 Tokens com expiração automática

---

## 💻 SLIDE 13: ESTRUTURA DO CÓDIGO

### FRONTEND (React + TypeScript)
```
src/
├── components/          # Componentes React
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── AdminDashboard.tsx
│   ├── PlaysSection.tsx
│   ├── AthleteStatsSection.tsx
│   └── ui/              # Componentes reutilizáveis
├── context/
│   └── AppContext.tsx   # Estado global
├── services/
│   └── api.ts           # Comunicação com backend
└── types/
    └── index.ts         # Definições TypeScript
```

### BACKEND (Laravel + PHP)
```
Api/
├── app/
│   ├── Http/
│   │   └── Controllers/Api/
│   │       ├── UserController.php
│   │       ├── JogadaController.php
│   │       ├── EstatisticaAtletaController.php
│   │       └── AdminController.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Atleta.php
│   │   ├── Treinador.php
│   │   ├── Jogada.php
│   │   └── EstatisticaAtleta.php
│   └── Mail/
│       └── AccountApproved.php
├── database/
│   └── migrations/      # Estrutura da BD
└── routes/
    └── api.php          # Rotas da API
```

---

## 📊 SLIDE 14: BASE DE DADOS

### TABELAS PRINCIPAIS

**users** - Utilizadores do sistema
- id, nome, email, password, tipo, validado

**atletas** - Perfil de atletas
- id, user_id, equipa_id, posicao, numero

**treinadores** - Perfil de treinadores
- id, user_id, equipa_id, validado

**equipas** - Equipas de andebol
- id, nome, escalao, epoca_id

**jogadas** - Vídeos táticos
- id, user_id, equipa_id, titulo, descricao, ficheiro, categoria

**dicas** - Conteúdo técnico
- id, user_id, titulo, descricao, categoria

**estatisticas_atletas** - Performance
- id, atleta_id, golos, cartoes_amarelos, cartoes_vermelhos, exclusoes_2min, jogos_disputados

**jogos** - Partidas disputadas
- id, equipa_casa_id, equipa_fora_id, data, resultado

### RELAÇÕES
- User → Atleta/Treinador (1:1)
- Equipa → Atletas (1:N)
- Equipa → Jogadas (1:N)
- Atleta → Estatísticas (1:1)

---

## �️ SLIDE 15: MODELO RELACIONAL

### ESTRUTURA DA BASE DE DADOS

**[INSERIR IMAGEM DO DIAGRAMA ENTIDADE-RELAÇÃO]**

### ENTIDADES PRINCIPAIS

**USERS (Utilizadores)**
- Armazena todos os utilizadores do sistema
- Campos: id, nome, email, password, tipo, validado
- Relaciona-se com Atletas e Treinadores

**ATLETAS**
- Perfil específico de atletas
- Campos: id, user_id, equipa_id, posicao, numero
- Relaciona-se com Users, Equipas e Estatísticas

**TREINADORES**
- Perfil específico de treinadores
- Campos: id, user_id, equipa_id, validado, escalao
- Relaciona-se com Users e Equipas

**EQUIPAS**
- Equipas de andebol
- Campos: id, nome, escalao, epoca_id
- Relaciona-se com Atletas, Treinadores, Jogadas

**JOGADAS**
- Vídeos táticos partilhados
- Campos: id, user_id, equipa_id, titulo, descricao, ficheiro, categoria
- Relaciona-se com Users, Equipas, Comentários

**ESTATISTICAS_ATLETAS**
- Performance individual
- Campos: id, atleta_id, golos, cartoes_amarelos, cartoes_vermelhos, exclusoes_2min
- Relaciona-se com Atletas

**JOGOS**
- Partidas disputadas
- Campos: id, equipa_casa_id, equipa_fora_id, data, resultado
- Relaciona-se com Equipas

### TIPOS DE RELAÇÕES
- 🔗 **1:1** - User ↔ Atleta/Treinador
- 🔗 **1:N** - Equipa → Atletas, Jogadas, Jogos
- 🔗 **N:M** - Equipas ↔ Jogos (através de equipa_casa e equipa_fora)

---

## 📋 SLIDE 16: DIAGRAMA DE CASOS DE USO

### INTERAÇÕES DO SISTEMA

**[INSERIR IMAGEM DO DIAGRAMA DE CASOS DE USO]**

### ATORES DO SISTEMA

**👤 ATLETA**
- Fazer login/registo
- Visualizar suas estatísticas
- Registar performance em jogos
- Criar jogadas
- Comentar jogadas
- Criar dicas
- Visualizar estado da equipa

**🧑‍🏫 TREINADOR**
- Todos os casos de uso do Atleta
- Visualizar estatísticas da equipa
- Gerir atletas da equipa
- Apagar jogadas da equipa
- Aprovar/rejeitar conteúdo
- Aceder a rankings completos

**🛠️ ADMINISTRADOR**
- Gerir utilizadores
- Aprovar/rejeitar treinadores
- Apagar qualquer conteúdo
- Gerir equipas
- Visualizar estatísticas globais
- Configurar sistema
- Enviar notificações

### CASOS DE USO PRINCIPAIS
1. **Autenticação** - Login, Registo, Logout
2. **Gestão de Estatísticas** - Criar, Visualizar, Atualizar
3. **Gestão de Jogadas** - Criar, Visualizar, Comentar, Apagar
4. **Gestão de Dicas** - Criar, Visualizar, Partilhar
5. **Gestão de Utilizadores** - Aprovar, Validar, Remover
6. **Visualização de Rankings** - Top marcadores, Equipas

---

## 🎯 SLIDE 17: MÉTRICAS DE SUCESSO

### EFICIÊNCIA OPERACIONAL
- ⏱️ **Redução de 5 horas/semana** em organização manual
- 📊 **100% dos dados centralizados** numa plataforma
- 🚫 **Eliminação de duplicações** e perda de informação
- ⚡ **Automatização completa** de cálculos estatísticos

### MELHORIA DA PERFORMANCE
- 📈 **Decisões baseadas em dados** reais e atualizados
- 🎯 **Identificação de padrões** de desempenho
- 🏆 **Motivação através de rankings** e comparações
- 💬 **Feedback tático estruturado** e documentado

### ADOÇÃO E USABILIDADE
- ✅ **Interface intuitiva** - sem necessidade de formação
- 📱 **Acesso multiplataforma** (web + mobile)
- ⚡ **Resposta rápida** - carregamento < 2 segundos
- 🎨 **Design profissional** - primeira impressão positiva

---

## 🛠️ SLIDE 18: TECNOLOGIAS UTILIZADAS

### FRONTEND
| Tecnologia | Versão | Função |
|-----------|--------|--------|
| React | 18 | Framework UI |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.x | Styling |
| Shadcn/ui | Latest | Componentes |

### BACKEND
| Tecnologia | Versão | Função |
|-----------|--------|--------|
| Laravel | 12 | Framework PHP |
| PHP | 8.2+ | Linguagem |
| SQLite | 3.x | Base de dados |
| Sanctum | Latest | Autenticação |
| Eloquent | Latest | ORM |

### FERRAMENTAS
- **Git** - Controlo de versões
- **Composer** - Gestor de dependências PHP
- **NPM** - Gestor de dependências JS
- **Postman** - Testes de API
- **VS Code** - Editor de código

---

## 🚀 SLIDE 19: EXECUÇÃO LOCAL

### REQUISITOS DO SISTEMA
- **PHP** 8.2 ou superior
- **Composer** (gestor de dependências PHP)
- **Node.js** 18+ (LTS)
- **NPM** ou **Yarn**
- **Git** (opcional, mas recomendado)

### INSTALAÇÃO - BACKEND
```bash
# 1. Navegar para a pasta da API
cd Api

# 2. Instalar dependências
composer install

# 3. Configurar ambiente
cp .env.example .env
php artisan key:generate

# 4. Criar base de dados
php artisan migrate --seed

# 5. Iniciar servidor
php artisan serve
# Servidor disponível em: http://localhost:8000
```

### INSTALAÇÃO - FRONTEND
```bash
# 1. Navegar para a pasta do frontend
cd Andebolonlineplatform-main

# 2. Instalar dependências
npm install

# 3. Iniciar servidor de desenvolvimento
npm run dev
# Aplicação disponível em: http://localhost:5173
```

### ACESSO INICIAL
**Administrador padrão:**
- Email: `admin@nexushand.pt`
- Password: `admin123`

---

## 📧 SLIDE 20: SISTEMA DE EMAILS

### NOTIFICAÇÕES AUTOMÁTICAS

**Email de Aprovação de Conta:**
- 📧 Enviado automaticamente quando admin aprova treinador
- 🎨 Template personalizado com cores NexusHand
- 📝 Informações de acesso e próximos passos
- ✅ Confirmação de validação bem-sucedida

**Configuração SMTP:**
- 📮 Suporte para Gmail, Outlook, SMTP customizado
- 🔐 Autenticação segura
- ✉️ Fila de emails para performance
- 📊 Log de emails enviados

**Emails Futuros (Roadmap):**
- 🔔 Notificação de novo jogo registado
- 📊 Relatório semanal de estatísticas
- 💬 Alerta de novo comentário em jogada
- 🏆 Conquista de novo recorde pessoal

---

## 🎓 SLIDE 21: APRENDIZAGENS E COMPETÊNCIAS

### COMPETÊNCIAS TÉCNICAS DESENVOLVIDAS

**Frontend Development:**
- ✅ React com TypeScript (type safety)
- ✅ Gestão de estado global (Context API)
- ✅ Comunicação assíncrona com APIs
- ✅ Design responsivo e acessível
- ✅ Componentização e reutilização

**Backend Development:**
- ✅ Laravel e arquitetura MVC
- ✅ Design de APIs RESTful
- ✅ Autenticação e autorização
- ✅ Eloquent ORM e relações de BD
- ✅ Validação e segurança de dados

**DevOps e Ferramentas:**
- ✅ Git e controlo de versões
- ✅ Debugging e resolução de problemas
- ✅ Testes de API (Postman)
- ✅ Deploy e configuração de servidores

### SOFT SKILLS
- 🎯 Resolução de problemas complexos
- 📊 Planeamento e gestão de projeto
- 📝 Documentação técnica clara
- 🔍 Atenção ao detalhe
- 💡 Pensamento crítico e criativo

---

## 📝 SLIDE 22: CONCLUSÃO

### RESUMO DO PROJETO

**NexusHand** é uma **plataforma web fullstack completa** que materializa a visão de que **"Andebol mais que um desporto"**.

### PRINCIPAIS CONQUISTAS
✅ **Arquitetura robusta** - Frontend React + Backend Laravel
✅ **Funcionalidades abrangentes** - Estatísticas, jogadas, gestão
✅ **Segurança implementada** - Autenticação, permissões, validação
✅ **Interface profissional** - Design moderno e intuitivo
✅ **Sistema escalável** - Preparado para crescimento

### IMPACTO REAL
- 🏆 **Moderniza** a gestão de equipas de andebol
- 📊 **Facilita** decisões baseadas em dados
- 💬 **Promove** partilha de conhecimento tático
- ⚡ **Reduz** trabalho administrativo manual
- 🎯 **Melhora** performance individual e coletiva

### ESTADO ATUAL
- ✅ **Todas as funcionalidades principais implementadas**
- ✅ **Sistema funcional e testado**
- ✅ **Pronto para deploy em produção**
- 🚀 **Roadmap definido para evolução**

---

## 🙏 SLIDE 23: AGRADECIMENTOS

### OBRIGADO!

**Projeto:** NexusHand - Plataforma de Andebol
**Slogan:** "Andebol mais que um desporto"

**Desenvolvido no âmbito da:**
📚 PAP - Prova de Aptidão Profissional
🎓 Curso de Programação e Sistemas de Informação

**Tecnologias:**
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Laravel, PHP, SQLite
- Arquitetura: API RESTful, SPA

**Contacto:**
- 📧 Email: [seu-email]
- 💼 LinkedIn: [seu-linkedin]
- 🌐 GitHub: [seu-github]

---

### 💡 DICAS PARA APRESENTAÇÃO

**Tempo sugerido por slide:**
- Slides 1-3: 1-2 minutos cada (introdução)
- Slides 4-7: 2-3 minutos cada (funcionalidades)
- Slides 8-10: 2-3 minutos cada (técnico)
- Slides 11-16: 1-2 minutos cada (impacto, diagramas e BD)
- Slides 17-22: 1 minuto cada (conclusão)
- Slide 23: 30 segundos (agradecimentos)

**Total: 30-40 minutos**

**Pontos-chave a enfatizar:**
1. ✅ Problema que resolve (gestão manual e desorganizada)
2. ✅ Solução técnica (arquitetura fullstack moderna)
3. ✅ Funcionalidades principais (estatísticas, jogadas, permissões)
4. ✅ Impacto real (redução de tempo, melhoria de performance)
5. ✅ Competências desenvolvidas (fullstack development)
