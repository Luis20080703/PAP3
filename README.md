🏆 NexusHand — Plataforma de Andebol

“Andebol — mais do que um desporto.”

📌 Visão Geral

  NexusHand é uma plataforma web full-stack desenvolvida para modernizar a gestão de equipas de andebol.
  Centraliza estatísticas, análise de jogadas em vídeo e gestão de equipas, oferecendo uma experiência profissional e intuitiva.

<details> <summary><strong>🎯 Objetivos do Projeto</strong></summary> <br>

  O projeto NexusHand foi desenvolvido com os seguintes objetivos principais:

<br>

  📌 Digitalizar a gestão desportiva no andebol

  📌 Facilitar a análise de desempenho individual e coletivo

  📌 Promover a partilha de jogadas e conhecimento técnico

  📌 Criar uma plataforma segura, moderna e escalável

</details>
<details> <summary><strong>🏗️ Arquitetura da Solução</strong></summary> <br>
🎨 Frontend
<br>

  O frontend foi desenvolvido como uma Single Page Application (SPA):

  ⚛️ React 18 + TypeScript

  ⚡ Vite

  🎨 Tailwind CSS + Shadcn/ui

  📱 Design responsivo (mobile-first)

  📦 Estrutura preparada para PWA

<br>
⚙️ Backend
<br>

  O backend é baseado numa API RESTful robusta:

  🐘 Laravel 12 (PHP 8.2+)

  🗄️ SQLite

  🔐 Autenticação com Laravel Sanctum

  🛡️ Validação e segurança de dados

</details>
<details> <summary><strong>🔐 Sistema de Autenticação e Perfis</strong></summary> <br>

  O sistema de autenticação foi implementado com Laravel Sanctum, garantindo segurança e controlo de acessos.

<br>
👤 Atletas

  📌 Registo sujeito a aprovação

  📌 Acesso limitado até validação

  📌 Visualizam apenas as suas estatísticas

<br>
🧑‍🏫 Treinadores

  📌 Aprovação por Administrador

  📌 Gestão de atletas da sua equipa

<br>
🛠️ Administradores

  📌 Controlo total da plataforma

  📌 Gestão de utilizadores, equipas e conteúdos

</details>
<details> <summary><strong>📊 Gestão de Estatísticas</strong></summary> <br>

  A plataforma permite uma análise detalhada do desempenho desportivo.

<br>
Estatísticas de Atleta

  ⚽ Golos marcados

  🟨 Cartões amarelos

  🟥 Cartões vermelhos

  ⏱️ Exclusões de 2 minutos

  📈 Médias automáticas por jogo

<br>
Estatísticas de Equipa

  📊 Agregação automática dos atletas;

  🏅 Rankings (Top 5 marcadores);

  🚨 Análise disciplinar da equipa;

</details>
<details> <summary><strong>🎥 Sistema de Jogadas em Vídeo</strong></summary> <br>

O módulo de jogadas permite a partilha e análise tática de vídeos só na sua equipa.

🏅Upload de vídeos locais

▶Integração com YouTube (incluindo Shorts)

📊Categorias:

  📌 Contra-ataque;

  📌 Ataque posicional;

  📌 Técnica individual;

  📌 Defesa;

  📌 Transição;

  📌 Bola parada.


Sistema de comentários

Autoria identificada

</details>
<details> <summary><strong>🎥 Sistema de dicas</strong></summary> <br>

O módulo de dicas permite a partilha de dicas entre clubes.

Categorias:

📌 Fintas;

📌 Dribles;

📌 Remates;

📌 Defesa;

📌 Tácticas
  
</details>
<details> <summary><strong>🎥Sistema de premissões</strong></summary> <br>

Este sistema faz com que o utilizador tenha restrições consoante o seu tipo.


Atletas:

📌 Vizualizar os componentes(jogadas e dicas);

📌 Criar componentes;

📌 Eliminar o componente que foi criado por ele; 

📌 Adicionar/modificar estatística dos jogos;   

📌 Vizualizar um estado geral da equipa.


Treinador:

📌 Vizualizar os componentes(jogadas e dicas);

📌 Criar componentes;

📌 Eliminar o componente que foi criado por os seus atletas e por ele; 

📌 Vizualizar as estatísticas dos atletas;    

📌 Vizualizar um estado geral da equipa(com o premium aparece nos melhores marcadores o melhor marcador, e a equipa dele, registado).


Administrador/Root:

📌 Sem restrições,só não cria jogadas e dicas, visto que não é membro de nenhuma equipa equipa.
  
</details>
<details> <summary><strong>🚀 Execução Local</strong></summary> <br>
Backend:

    composer install && \
    cp .env.example .env && \
    php artisan key:generate && \
    php artisan migrate --seed && \
    php artisan serve

<br>
Frontend

    npm install && \
    npm run dev && \

</details>
<details> <summary><strong>🏁 Conclusão</strong></summary> <br>

  O NexusHand apresenta-se como uma solução moderna e completa para a gestão de equipas de andebol, integrando tecnologia, análise desportiva e uma interface intuitiva.

<br>

  Este projeto foi desenvolvido no âmbito da PAP — Programação e Sistemas de Informação, demonstrando competências em Full-Stack Development, APIs REST e Design de Interfaces.

</details>