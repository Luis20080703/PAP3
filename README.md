🏆 NexusHand — Plataforma de Andebol

“Andebol — mais do que um desporto.”

📌 Visão Geral

    NexusHand é uma plataforma web full-stack desenvolvida com o objetivo de modernizar e profissionalizar a gestão de equipas de andebol, integrando estatísticas, jogadas em vídeo e partilha de conhecimento técnico numa única solução digital.

<details> <summary><strong>🎯 Objetivos do Projeto</strong></summary> <br>

    O projeto NexusHand tem como principais objetivos:

  Digitalizar a gestão desportiva no andebol

  Facilitar a análise de desempenho individual e coletivo

  Promover a partilha de jogadas e conhecimento técnico

  Garantir segurança, escalabilidade e boa experiência de utilização

</details>
<details> <summary><strong>🏗️ Arquitetura da Solução</strong></summary> <br>

    A plataforma adota uma arquitetura moderna, separando claramente Frontend e Backend, comunicando através de uma API REST.

🎨 Frontend

    Responsável pela interface e experiência do utilizador.

  React 18 + TypeScript

  Vite

  Tailwind CSS + Shadcn/ui

  SPA (Single Page Application)

  Preparado para PWA

⚙️ Backend

    Responsável pela lógica de negócio, segurança e persistência de dados.

  Laravel 12 (PHP 8.2+)

  Base de dados SQLite

  API RESTful

  Autenticação com Laravel Sanctum

</details>
<details> <summary><strong>🔐 Sistema de Autenticação e Perfis</strong></summary> <br>

    O sistema de autenticação é baseado em tokens seguros, garantindo controlo de acessos e isolamento de dados.

👤 Atletas

  Registo sujeito a aprovação

  Acesso limitado até validação

  Visualização apenas das suas estatísticas

🧑‍🏫 Treinadores

  Aprovação obrigatória por Administrador

  Gestão exclusiva da sua equipa

🛠️ Administradores

  Controlo total da plataforma

  Gestão de utilizadores, equipas e conteúdos

</details>
<details> <summary><strong>📊 Gestão de Estatísticas</strong></summary> <br>

    A plataforma permite o registo e cálculo automático de estatísticas, fornecendo dados relevantes para análise de desempenho.

Estatísticas de Atleta

  Golos marcados

  Cartões amarelos e vermelhos

  Exclusões (2 minutos)

  Jogos disputados

  Médias calculadas automaticamente

Estatísticas de Equipa

  Agregação das estatísticas dos atletas

  Rankings (Top 5 marcadores)

  Análise disciplinar coletiva

</details>
<details> <summary><strong>🎥 Sistema de Jogadas em Vídeo</strong></summary> <br>

    O módulo de jogadas permite a análise tática através de vídeo.

  Upload de vídeos locais

  Integração com YouTube (incluindo Shorts)

  Classificação por categorias:

  Ataque

  Defesa

  Contra-ataque

  Guarda-redes

  Sistema de comentários

  Autoria identificada

</details>
<details> <summary><strong>💡 Dicas Técnicas</strong></summary> <br>

    Área dedicada à partilha de conhecimento técnico e educativo.

  Artigos e dicas práticas

  Conteúdos sobre técnica, tática e preparação física

  Organização por categorias

</details>
<details> <summary><strong>🧑‍💼 Administração e Gestão</strong></summary> <br>

    Ferramentas administrativas avançadas para controlo total da plataforma.

  Criação e gestão de equipas

  Gestão de escalões

  Validação de treinadores

  Moderação de conteúdos

</details>
<details> <summary><strong>🚀 Execução Local do Projeto</strong></summary> <br>
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
<details> <summary><strong>📚 Documentação da API</strong></summary> <br>
Método	Endpoint	Descrição
POST	/login	Autenticação
POST	/register	Registo
GET	/equipas	Equipas
GET	/estatisticas-atletas	Estatísticas do atleta
GET	/estatisticas-equipas	Estatísticas da equipa
GET	/jogadas	Jogadas
</details>
<details> <summary><strong>🏁 Conclusão</strong></summary> <br>

    O NexusHand apresenta-se como uma solução completa e moderna para a gestão de equipas de andebol, aliando tecnologia, análise desportiva e organização profissional.

</details>