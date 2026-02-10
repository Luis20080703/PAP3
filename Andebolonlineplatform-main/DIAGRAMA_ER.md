# Diagrama Entidade-Associação (ERD) - Plataforma de Andebol

Este documento descreve a estrutura de dados e as relações entre as entidades da base de dados, com base nas migrações do Laravel.

## Diagrama Visual (Mermaid)

```mermaid
flowchart TD
    %% Estilos para ficar bonito
    classDef entidade fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef relacao fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,shape:rhombus;

    %% ENTIDADES (Retângulos)
    User[USER]:::entidade
    Equipa[EQUIPA]:::entidade
    Atleta[ATLETA]:::entidade
    Treinador[TREINADOR]:::entidade
    Jogo[JOGO]:::entidade
    Stat[ESTATÍSTICA JOGO]:::entidade
    Jogada[JOGADA]:::entidade
    Dica[DICA]:::entidade
    EstatEquipa[ESTATÍSTICA EQUIPA]:::entidade

    %% RELACIONAMENTOS (Losangos)
    R_User_Atleta{É}:::relacao
    R_User_Treinador{É}:::relacao
    R_Equipa_Atleta{TEM}:::relacao
    R_Equipa_Treinador{TEM}:::relacao
    R_Equipa_Jogo{REALIZA}:::relacao
    R_Atleta_Stat{GERA}:::relacao
    R_Jogo_Stat{CONTÉM}:::relacao
    R_User_Jogada{CRIA}:::relacao
    R_Equipa_Jogada{POSSUI}:::relacao
    R_User_Dica{CRIA}:::relacao
    R_Equipa_Est{POSSUI}:::relacao

    %% LIGAÇÕES
    User ---|1:1| R_User_Atleta ---|0:1| Atleta
    User ---|1:1| R_User_Treinador ---|0:1| Treinador
    
    Equipa ---|1:N| R_Equipa_Atleta ---|1:1| Atleta
    Equipa ---|1:N| R_Equipa_Treinador ---|1:1| Treinador
    
    Equipa ---|1:N| R_Equipa_Jogo ---|1:1| Jogo
    
    Atleta ---|1:N| R_Atleta_Stat ---|1:1| Stat
    Jogo ---|1:N| R_Jogo_Stat ---|1:1| Stat
    
    User ---|1:N| R_User_Jogada ---|1:1| Jogada
    Equipa ---|1:N| R_Equipa_Jogada ---|1:1| Jogada
    
    User ---|1:N| R_User_Dica ---|1:1| Dica

    Equipa ---|1:1| R_Equipa_Est ---|1:1| EstatEquipa
```

## Relacionamentos Principais

1.  **Users -> Atletas / Treinadores (1:1)**
    *   Um utilizador (`users`) pode ser um `atleta` ou um `treinador`. A tabela `users` guarda o login, e as tabelas `atletas` e `treinadores` guardam os dados específicos.
    *   *Nota*: Na prática, a implementação atual permite 1:N, mas logicamente um utilizador representa um único perfil ativo.

2.  **Equipas -> Atletas (1:N)**
    *   Uma equipa tem muitos atletas.
    *   Um atleta pertence a uma equipa.

3.  **Equipas -> Jogos (1:N)**
    *   Uma equipa realiza vários jogos ao longo da época.

4.  **Jogos <-> Atletas (N:N via `atleta_jogo_stats`)**
    *   Um jogo tem estatísticas de muitos atletas.
    *   Um atleta tem estatísticas em muitos jogos.
    *   A tabela `atleta_jogo_stats` faz esta ligação, guardando golos, cartões e exclusões por jogo.

---

## Código DBML (para dbdiagram.io)

Se precisares de editar visualmente no [dbdiagram.io](https://dbdiagram.io/), usa este código:

```dbml
Table users {
  id integer [primary key]
  nome varchar
  email varchar [unique]
  tipo enum('atleta', 'treinador')
  equipa varchar
  created_at timestamp
}

Table equipas {
  id integer [primary key]
  nome varchar
  escalao_equipa_escalao varchar
}

Table atletas {
  id integer [primary key]
  user_id integer [ref: > users.id]
  equipa_id integer [ref: > equipas.id]
  epoca_id integer
  posicao varchar
  numero integer
  escalao varchar
  cipa integer
}

Table treinadores {
  id integer [primary key]
  user_id integer [ref: > users.id]
  equipa_id integer [ref: > equipas.id]
  epoca_id integer
}

Table jogos {
  id integer [primary key]
  equipa_id integer [ref: > equipas.id]
  adversario varchar
  golos_marcados integer
  golos_sofridos integer
  data_jogo date
}

Table atleta_jogo_stats {
  id integer [primary key]
  atleta_id integer [ref: > atletas.id]
  jogo_id integer [ref: > jogos.id]
  golos integer
  amarelo integer
  vermelho integer
  dois_minutos integer
}

Table jogadas {
  id integer [primary key]
  equipa_id integer [ref: > equipas.id]
  user_id integer [ref: > users.id]
  titulo varchar
  ficheiro varchar
}

Table dicas {
  id integer [primary key]
  user_id integer [ref: > users.id]
  titulo varchar
  categoria enum
}

Table estatistica_equipas {
  id integer [primary key]
  equipa_id integer [ref: > equipas.id]
  escalao varchar
  total_golos_marcados integer
  total_golos_sofridos integer
}
```
