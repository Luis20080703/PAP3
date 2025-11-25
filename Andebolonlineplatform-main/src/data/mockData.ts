import { 
  PlayDisplay, 
  CommentDisplay, 
  TipDisplay, 
  TeamStatsDisplay, 
  AthleteStatsDisplay 
} from '../types';

export const mockPlays: PlayDisplay[] = [
  {
    id: '1',
    title: 'Contra-ataque rápido com finalização',
    description: 'Jogada de contra-ataque com passe longo e finalização eficaz',
    videoUrl: 'https://example.com/video1.mp4',
    authorId: '1',
    authorName: 'João Silva',
    authorType: 'athlete',
    team: 'FC Porto',
    category: 'Contra-ataque',
    createdAt: new Date('2025-10-25'),
    comments: [
      {
        id: 'c1',
        playId: '1',
        authorId: '2',
        authorName: 'Carlos Mendes',
        authorType: 'coach',
        content: 'Excelente execução! A velocidade do contra-ataque foi perfeita.',
        createdAt: new Date('2025-10-26')
      }
    ]
  },
  {
    id: '2',
    title: 'Circulação de bola em 6-0',
    description: 'Movimento tático de circulação de bola contra defesa 6-0',
    videoUrl: 'https://example.com/video2.mp4',
    authorId: '3',
    authorName: 'Pedro Costa',
    authorType: 'coach',
    team: 'Benfica',
    category: 'Ataque posicional',
    createdAt: new Date('2025-10-28'),
    comments: []
  },
  {
    id: '3',
    title: 'Finta individual do pivot',
    description: 'Movimento técnico do pivot com finta e remate',
    videoUrl: 'https://example.com/video3.mp4',
    authorId: '4',
    authorName: 'Miguel Santos',
    authorType: 'athlete',
    team: 'Sporting',
    category: 'Técnica individual',
    createdAt: new Date('2025-10-29'),
    comments: [
      {
        id: 'c2',
        playId: '3',
        authorId: '1',
        authorName: 'João Silva',
        authorType: 'athlete',
        content: 'Muito bom! Vou tentar aplicar esta finta nos treinos.',
        createdAt: new Date('2025-10-30')
      }
    ]
  }
];

export const mockTips: TipDisplay[] = [
  {
    id: 't1',
    title: 'Finta 1:1 - Mudança de direção',
    description: 'Como executar uma finta eficaz em situação de 1 contra 1',
    category: 'finta',
    content: `
      **Passos para executar a finta:**
      
      1. Aproxime-se do defensor com velocidade controlada
      2. Faça uma finta inicial para um lado (ex: direita)
      3. Use o pé contrário como apoio
      4. Mude rapidamente de direção para o lado oposto
      5. Acelere após a mudança de direção
      
      **Dicas importantes:**
      - Mantenha a bola protegida
      - Use o corpo para bloquear o defensor
      - A velocidade de execução é fundamental
      - Treine ambos os lados
    `,
    authorId: '2',
    authorName: 'Carlos Mendes',
    authorType: 'coach',
    createdAt: new Date('2025-10-20')
  },
  {
    id: 't2',
    title: 'Drible como recurso tático',
    description: 'Quando e como usar o drible de forma eficaz',
    category: 'drible',
    content: `
      **O drible é um recurso, não uma obrigação**
      
      Use o drible para:
      - Ganhar tempo quando não há opções de passe
      - Atrair defensores e criar espaços
      - Progredir no terreno em contra-ataque
      - Reposicionar-se para um melhor ângulo de passe
      
      **Quando evitar:**
      - Não drible em excesso
      - Evite driblar perto da área de baliza adversária se houver opção de passe
      - Não drible se estiver sob pressão intensa
      
      **Técnica:**
      - Mantenha a cabeça erguida para ver opções
      - Proteja a bola com o corpo
      - Use dribles rápidos e controlados
    `,
    authorId: '3',
    authorName: 'Pedro Costa',
    authorType: 'coach',
    createdAt: new Date('2025-10-22')
  },
  {
    id: 't3',
    title: 'Remate em suspensão',
    description: 'Técnica para remate em suspensão eficaz',
    category: 'remate',
    content: `
      **Execução do remate em suspensão:**
      
      1. **Corrida de balanço:** 3 passos (direita-esquerda-direita para destros)
      2. **Impulsão:** Terceiro passo forte para ganhar altura
      3. **Braço de remate:** Levar o braço atrás com cotovelo alto
      4. **Momento do remate:** No ponto mais alto do salto
      5. **Movimento do pulso:** Rotação rápida para dar potência
      
      **Pontos chave:**
      - Timing é fundamental
      - Mantenha o equilíbrio no ar
      - Olhe para o alvo antes de rematar
      - Use todo o corpo para gerar potência
    `,
    authorId: '1',
    authorName: 'João Silva',
    authorType: 'athlete',
    createdAt: new Date('2025-10-24')
  }
];

export const mockTeamStats: TeamStatsDisplay[] = [
  {
    id: 'ts1',
    teamName: 'FC Porto',
    division: 'seniores',
    goalsScored: 245,
    goalsConceded: 198,
    matchesPlayed: 22,
    wins: 15,
    draws: 4,
    losses: 3
  },
  {
    id: 'ts2',
    teamName: 'Benfica',
    division: 'seniores',
    goalsScored: 268,
    goalsConceded: 205,
    matchesPlayed: 22,
    wins: 17,
    draws: 3,
    losses: 2
  },
  {
    id: 'ts3',
    teamName: 'Sporting',
    division: 'seniores',
    goalsScored: 252,
    goalsConceded: 210,
    matchesPlayed: 22,
    wins: 16,
    draws: 2,
    losses: 4
  },
  {
    id: 'ts4',
    teamName: 'FC Porto',
    division: 'sub-20',
    goalsScored: 189,
    goalsConceded: 145,
    matchesPlayed: 18,
    wins: 13,
    draws: 3,
    losses: 2
  },
  {
    id: 'ts5',
    teamName: 'ABC Braga',
    division: 'seniores',
    goalsScored: 215,
    goalsConceded: 220,
    matchesPlayed: 22,
    wins: 10,
    draws: 5,
    losses: 7
  }
];

export const mockAthleteStats: AthleteStatsDisplay[] = [
  {
    id: 'as1',
    name: 'João Silva',
    team: 'FC Porto',
    position: 'lateral',
    division: 'seniores',
    goalsScored: 47,
    matchesPlayed: 22,
    assists: 23,
    yellowCards: 3,
    redCards: 0
  },
  {
    id: 'as2',
    name: 'Pedro Martins',
    team: 'Benfica',
    position: 'pivot',
    division: 'seniores',
    goalsScored: 52,
    matchesPlayed: 21,
    assists: 15,
    yellowCards: 5,
    redCards: 1
  },
  {
    id: 'as3',
    name: 'Miguel Santos',
    team: 'Sporting',
    position: 'central',
    division: 'seniores',
    goalsScored: 38,
    matchesPlayed: 22,
    assists: 31,
    yellowCards: 2,
    redCards: 0
  },
  {
    id: 'as4',
    name: 'André Costa',
    team: 'FC Porto',
    position: 'ponta',
    division: 'seniores',
    goalsScored: 41,
    matchesPlayed: 20,
    assists: 18,
    yellowCards: 4,
    redCards: 0
  },
  {
    id: 'as5',
    name: 'Ricardo Sousa',
    team: 'FC Porto',
    position: 'guarda-redes',
    division: 'seniores',
    goalsScored: 0,
    matchesPlayed: 22,
    assists: 0,
    yellowCards: 1,
    redCards: 0
  },
  {
    id: 'as6',
    name: 'Carlos Ferreira',
    team: 'Benfica',
    position: 'lateral',
    division: 'sub-20',
    goalsScored: 34,
    matchesPlayed: 18,
    assists: 19,
    yellowCards: 2,
    redCards: 0
  }
];
