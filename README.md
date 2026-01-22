# 🏆 NexusHand — Plataforma de Andebol

“Andebol — mais do que um desporto.”

📌 Visão Geral

NexusHand é uma plataforma web full-stack para a gestão profissional de equipas de andebol, integrando estatísticas, jogadas em vídeo e gestão desportiva.

<details> <summary><strong>🎯 Objetivos do Projeto</strong></summary>

Digitalizar a gestão desportiva no andebol

Facilitar a análise de desempenho individual e coletivo

Promover a partilha de jogadas e conhecimento técnico

Criar uma plataforma segura, moderna e escalável

</details>
<details> <summary><strong>🏗️ Arquitetura da Solução</strong></summary>
🎨 Frontend — React

React 18 + TypeScript

Vite

Tailwind CSS + Shadcn/ui

SPA + PWA

Design responsivo

⚙️ Backend — Laravel

Laravel 12 (PHP 8.2+)

SQLite

API REST

Autenticação Sanctum

</details>
<details> <summary><strong>🔐 Sistema de Autenticação e Perfis</strong></summary>
👤 Atletas

Registo sujeito a aprovação

Acesso limitado até validação

Apenas veem as suas estatísticas

🧑‍🏫 Treinadores

Validados por Administrador

Gerem atletas da sua equipa

🛠️ Administradores

Gestão total da plataforma

Moderação e validações

</details>
<details> <summary><strong>📊 Gestão de Estatísticas</strong></summary>
Estatísticas de Atleta

Golos

Cartões

Exclusões (2 minutos)

Jogos

Médias automáticas

Estatísticas de Equipa

Soma automática dos atletas

Rankings (Top 5 marcadores)

Estatísticas disciplinares

</details>
<details> <summary><strong>🎥 Sistema de Jogadas (Vídeo)</strong></summary>

Upload de vídeos locais

Integração com YouTube (inclui Shorts)

Categorias:

Ataque

Defesa

Contra-ataque

Guarda-redes

Comentários e autoria identificada

</details>
<details> <summary><strong>💡 Dicas Técnicas</strong></summary>

Partilha de artigos e dicas

Técnica, tática e preparação física

Conteúdo categorizado

</details>
<details> <summary><strong>🧑‍💼 Administração e Gestão</strong></summary>

Criação de equipas

Gestão de escalões

Validação de treinadores

Moderação de conteúdos

</details>
<details> <summary><strong>📱 Interface e UX/UI</strong></summary>

Design moderno

Mobile-first

Feedback visual (toasts, loaders, estados vazios)

</details>
<details> <summary><strong>🚀 Executar o Projeto Localmente</strong></summary>
Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

Frontend
npm install
npm run dev

</details>
<details> <summary><strong>📚 API — Endpoints</strong></summary>
Método	Endpoint	Descrição
POST	/login	Autenticação
POST	/register	Registo
GET	/equipas	Equipas
GET	/estatisticas-atletas	Estatísticas do atleta
GET	/estatisticas-equipas	Estatísticas da equipa
GET	/jogadas	Jogadas
</details>
<details> <summary><strong>🏁 Conclusão</strong></summary>

O NexusHand é uma plataforma moderna, segura e funcional que contribui para a profissionalização da gestão no andebol, integrando tecnologia e análise desportiva.

Projeto desenvolvido no âmbito da PAP — Programação e Sistemas de Informação.

</details>