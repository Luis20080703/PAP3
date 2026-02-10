# 🎙️ GUIÃO DE APRESENTAÇÃO - NEXUSHAND

Este documento serve como roteiro para a tua apresentação da PAP. Podes ler a "Narrativa Sugerida" ou usar os "Tópicos Chave" para falar de forma mais livre. Ajusta o tempo conforme necessário.

---

## 🏁 INÍCIO (0:00 - 2:00)

### SLIDE 1: INTRODUÇÃO
**Tópicos Chave:**
- Bom dia/Boa tarde a todos, júri e colegas.
- O meu nome é [Teu Nome] e hoje apresento o "NexusHand".
- É uma plataforma Web Fullstack.
- **Slogan:** "Andebol mais que um desporto" - foca-se na comunidade e gestão.

**Narrativa Sugerida:**
> "Bom dia a todos. O meu nome é [Teu Nome] e hoje venho apresentar-vos a minha Prova de Aptidão Profissional: o **NexusHand**.
> O NexusHand não é apenas um site, é uma plataforma web completa (Fullstack) desenhada especificamente para modernizar a gestão de equipas de andebol.
> Sob o lema 'Andebol mais que um desporto', o meu objetivo foi criar uma ferramenta que centralize tudo o que um clube precisa: desde as estatísticas dos jogos até às táticas e gestão dos atletas, tudo numa interface moderna e intuitiva."

---

### SLIDE 2: ARQUITETURA TÉCNICA
**Tópicos Chave:**
- Aplicação moderna, dividida em Frontend e Backend.
- **Frontend:** React + TypeScript (interativo, rápido). Design com Tailwind.
- **Backend:** Laravel 12 (PHP). É o cérebro do sistema.
- **Comunicação:** API REST (segura e padronizada).

**Narrativa Sugerida:**
> "Para construir esta solução, utilizei uma arquitetura profissional e robusta.
> No **Frontend**, aquilo que o utilizador vê, usei **React com TypeScript**. Isto garante que o site é rápido, interativo e funciona quase como uma aplicação móvel. Para o design, usei Tailwind CSS para garantir um aspeto visual apelativo.
> No **Backend**, o motor do sistema, escolhi o **Laravel 12**. É uma das frameworks PHP mais utilizadas no mercado, garantindo segurança e eficiência na gestão da base de dados.
> A comunicação entre estas duas partes é feita via API REST, garantindo que os dados viajam de forma segura."

---

### SLIDE 3: SISTEMA DE AUTENTICAÇÃO
**Tópicos Chave:**
- Segurança é prioridade.
- 3 níveis de acesso: Atleta, Treinador, Administrador.
- **Atleta:** Vê as suas coisas.
- **Treinador:** Vê a equipa e gere táticas (precisa de aprovação).
- **Admin:** Controla tudo.

**Narrativa Sugerida:**
> "Uma plataforma destas precisa de segurança e organização. Implementei um sistema de autenticação robusto com três níveis de acesso distintos.
> Temos o **Atleta**, que acede às suas estatísticas e vídeos.
> Temos o **Treinador**, que tem uma visão global da equipa e pode gerir conteúdos. Importante referir que o registo de treinadores passa por uma aprovação manual por segurança.
> E finalmente o **Administrador**, que tem controlo total sobre a plataforma. Tudo isto é protegido por tokens de segurança, tal como nas grandes aplicações que usamos no dia-a-dia."

---

## ⚙️ FUNCIONALIDADES (2:00 - 15:00)

### SLIDE 4: GESTÃO DE ESTATÍSTICAS
**Tópicos Chave:**
- **Atletas:** Golos, cartões, jogos. Vêem a sua evolução.
- **Equipas:** Totais, vitórias/derrotas.
- **Cálculos Automáticos:** O sistema faz a matemática (médias, somas).
- Rankings para motivar (Top Marcadores).

**Narrativa Sugerida:**
> "Entrando nas funcionalidades principais, temos a Gestão de Estatísticas.
> Acabaram-se os papéis e os Excels perdidos. Aqui, cada jogo é registado e o sistema calcula tudo automaticamente: médias de golos, totais acumulados, cartões e vitórias.
> Para os atletas, é motivador verem a sua evolução. Para a equipa, é vital ter dados concretos. O sistema gera até rankings automáticos, como o 'Top 5 Melhores Marcadores', promovendo uma competição saudável."

---

### SLIDE 5: SISTEMA DE JOGADAS
**Tópicos Chave:**
- Upload de vídeos (YouTube, Ficheiros Locais).
- Categorização (Ataque, Defesa, etc.).
- Comentários para discussão tática.
- Player inteligente (adapta-se à origem do vídeo).

**Narrativa Sugerida:**
> "O andebol é um desporto muito tático. Por isso, criei o Sistema de Jogadas.
> Os treinadores e atletas podem partilhar vídeos de jogadas, seja através de links do YouTube ou enviando ficheiros diretos.
> O sistema deteta automaticamente o tipo de vídeo e ajusta o player.
> Mais do que ver, é possível discutir. Implementei um sistema de comentários em cada vídeo, permitindo que a equipa debata a tática 'Contra-Ataque' ou 'Defesa' diretamente na plataforma."

---

### SLIDE 6: SISTEMA DE DICAS
**Tópicos Chave:**
- Partilha de conhecimento técnico (Fintas, Remates).
- Biblioteca de conhecimento do clube.
- Todos podem contribuir (partilha entre clubes).

**Narrativa Sugerida:**
> "Além das jogadas da equipa, temos o Sistema de Dicas.
> O objetivo aqui é criar uma base de conhecimento. Imaginem uma 'Wikipédia' do vosso clube.
> É possível criar conteúdos sobre como melhorar uma finta, um drible ou um remate. Isto democratiza o conhecimento, permitindo que os atletas mais experientes ajudem os mais novos através da plataforma."

---

### SLIDE 7: SISTEMA DE PERMISSÕES
**Tópicos Chave:**
- Quem pode fazer o quê? (Controlo granular).
- Atleta não apaga coisas do Treinador.
- Treinador gere a sua equipa.
- Privacidade dos dados.

**Narrativa Sugerida:**
> "Para que tudo isto funcione sem caos, o Sistema de Permissões é fundamental.
> Foi programado para que um Atleta nunca possa apagar uma jogada do Treinador, ou ver estatísticas privadas de outro colega se não for suposto.
> O Treinador tem poder sobre a sua equipa, mas não sobre a plataforma inteira.
> Cada botão, cada funcionalidade que aparece no ecrã muda dinamicamente dependendo de quem está logado. Isso garante a integridade dos dados."

---

## 👨‍💻 PARTE TÉCNICA (15:00 - 25:00)

### SLIDE 8: IMPLEMENTAÇÃO TÉCNICA
**Tópicos Chave:**
- Componentes React Reutilizáveis (Dashboard, StatsSection).
- Controladores Laravel focados (User, Jogada, Stats).
- Estrutura organizada e limpa.

**Narrativa Sugerida:**
> "Olhando 'debaixo do capô', a estrutura do código foi pensada para ser escalável.
> No Frontend, criei componentes reutilizáveis como o 'AthleteStatsSection', que pode ser usado em várias partes do site sem repetir código.
> No Backend, cumpri o padrão MVC (Model-View-Controller). Tenho controladores específicos para cada função: um só para gerir Jogadas, outro só para Estatísticas. Isso mantém o código organizado e fácil de manter no futuro."

---

### SLIDE 9: FLUXO DE COMUNICAÇÃO (LOGIN)
**Tópicos Chave:**
- Explicar o caminho dos dados.
- Frontend pede -> Autenticação -> Backend valida -> Resposta volta.
- Demonstra que percebes o ciclo completo da web.

**Narrativa Sugerida:**
> "Para exemplificar como o sistema funciona, vejamos o fluxo de Login.
> Quando o utilizador clica em 'Entrar', o Frontend envia os dados para a API.
> O Laravel recebe, vai à base de dados verificar se a password está correta e se a conta está validada.
> Se estiver tudo ok, gera um 'Token' digital e devolve-o. A partir daí, o React guarda esse token e usa-o para abrir as portas da aplicação. Tudo isto acontece em milissegundos."

---

### SLIDE 10: INTERFACE E EXPERIÊNCIA
**Tópicos Chave:**
- Design importa (Primeira impressão).
- Cores com significado (Azul=Confiança, Verde=Sucesso).
- Responsividade (funciona no telemóvel).
- Feedback ao utilizador (Spinners, Toasts).

**Narrativa Sugerida:**
> "Não basta funcionar, tem de ser agradável de usar. Dediquei muito tempo à Interface e Experiência do Utilizador (UI/UX).
> Usei uma paleta de cores consistente, onde o Azul transmite confiança e o Verde sucesso.
> Tudo é reativo: se algo está a carregar, aparece um spinner; se uma ação falha, aparece um erro claro; se funciona, uma notificação de sucesso.
> E claro, 'Mobile First': o site adapta-se perfeitamente aos telemóveis, que é onde os atletas vão aceder mais."

---

### SLIDE 11, 12, 13 (IMPACTO E ESTRUTURA)
*Podes resumir estes slides mais rapidamente se o tempo estiver curto.*

**Tópicos Chave:**
- **Impacto:** Menos tempo perdido, mais dados reais.
- **Vídeo Inteligente:** Deteta origem automaticamente.
- **Estrutura:** Frontend e Backend bem separados.

**Narrativa Sugerida:**
> "O impacto prático deste projeto é a redução drástica de tempo administrativo – estimo menos 5 horas semanais para um treinador – e o aumento da motivação dos atletas.
> Implementei funcionalidades avançadas como a deteção automática de vídeos, seja do YouTube ou ficheiros locais, e mantive uma estrutura de pastas profissional que qualquer programador conseguiria pegar e continuar."

---

## 📊 BASE DE DADOS (25:00 - 30:00)

### SLIDE 14, 15, 16 (BD e DIAGRAMAS)
**Tópicos Chave:**
- **Tabelas:** Users, Atletas, Treinadores, Equipas.
- **Relações:** Como tudo se liga (Chaves estrangeiras).
- **Modelo ER:** Mostrar o diagrama.
- **Casos de Uso:** Quem faz o quê.

**Narrativa Sugerida:**
> "A base de dados é a espinha dorsal do NexusHand.
> Tenho tabelas separadas para 'Atletas' e 'Treinadores' que se ligam a uma tabela central de 'Users'. Isso evita repetição de dados de login.
> As 'Equipas' ligam-se aos 'Jogos' e às 'Jogadas'. O diagrama Entidade-Relação mostra como garantimos a integridade referencial: se apagarmos uma equipa, o sistema sabe como lidar com os dados associados."

---

## 🏁 CONCLUSÃO (30:00 - Fim)

### SLIDE 17, 18, 19, 20 (MÉTRICAS E TECNOLOGIAS)
**Tópicos Chave:**
- Tecnologias modernas apenas (Stack de 2024/2026).
- Sistema de Emails (Notificações).
- Tudo prontos para correr localmente.

**Narrativa Sugerida:**
> "Em resumo, utilizei as tecnologias mais procuradas no mercado de trabalho atual: React, TypeScript e Laravel.
> O sistema está preparado para envio de emails automáticos e configurado para ser instalado facilmente em qualquer servidor local ou na nuvem."

---

### SLIDE 21: APRENDIZAGENS
**Tópicos Chave:**
- Hard Skills (Codificar, BD, API).
- Soft Skills (Organização, Resolução de Problemas).

**Narrativa Sugerida:**
> "Este projeto foi a maior escola que poderia ter.
> Tecnicamente, consolidei o conhecimento em Fullstack Development.
> Mas também desenvolvi 'Soft Skills': aprendi a gerir um projeto grande, a resolver bugs complexos e a pensar no produto final para o utilizador."

---

### SLIDE 22 & 23: CONCLUSÃO FINAL
**Tópicos Chave:**
- NexusHand é real e funcional.
- Agradecimentos.
- Disponível para perguntas.

**Narrativa Sugerida:**
> "Concluindo, o NexusHand cumpre o seu propósito: digitalizar o andebol. É uma ferramenta funcional, segura e moderna.
> Agradeço a vossa atenção e estou agora disponível para responder a quaisquer questões que tenham sobre o projeto ou sobre o código. Muito obrigado."

---

### 💡 DICAS EXTRAS
- **Olha para o público**, não leias apenas os slides.
- **Usa o rato/pointer** para mostrar nos diagramas do que estás a falar.
- **Respira** entre os slides.
- Se te encalhares, **para, sorri e retoma**. Todos querem que corra bem.
