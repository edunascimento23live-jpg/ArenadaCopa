import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const groupsData = [
  { grupo: 'A', teams: ['México', 'África do Sul', 'Coréia do Sul', 'Vaga D'] },
  { grupo: 'B', teams: ['Canadá', 'Vaga A', 'Catar', 'Suíça'] },
  { grupo: 'C', teams: ['Brasil', 'Marrocos', 'Haiti', 'Escócia'] },
  { grupo: 'D', teams: ['EUA', 'Paraguai', 'Austrália', 'Vaga C'] },
  { grupo: 'E', teams: ['Alemanha', 'Curaçau', 'Costa do Marfim', 'Equador'] },
  { grupo: 'F', teams: ['Holanda', 'Japão', 'Vaga D', 'Tunísia'] },
  { grupo: 'G', teams: ['Bélgica', 'Egito', 'Irã', 'Nova Zelândia'] },
  { grupo: 'H', teams: ['Espanha', 'Cabo Verde', 'Arábia Saudita', 'Uruguai'] },
  { grupo: 'I', teams: ['França', 'Senegal', 'Vaga 2', 'Noruega'] },
  { grupo: 'J', teams: ['Argentina', 'Argélia', 'Áustria', 'Jordânia'] },
  { grupo: 'K', teams: ['Portugal', 'Vaga 1', 'Uzbequistão', 'Colômbia'] },
  { grupo: 'L', teams: ['Inglaterra', 'Croácia', 'Gana', 'Panamá'] },
];

const gamesData = [
  // Image 1
  { time_a: 'México', time_b: 'África do Sul', data: '11/06/2026', hora: '16:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Coreia do Sul', time_b: 'Vaga D', data: '11/06/2026', hora: '23:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Canadá', time_b: 'Vaga A', data: '12/06/2026', hora: '16:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Estados Unidos', time_b: 'Paraguai', data: '12/06/2026', hora: '22:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Catar', time_b: 'Suíça', data: '13/06/2026', hora: '16:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Brasil', time_b: 'Marrocos', data: '13/06/2026', hora: '19:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Haiti', time_b: 'Escócia', data: '13/06/2026', hora: '22:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  // Image 2
  { time_a: 'Austrália', time_b: 'Vaga C', data: '14/06/2026', hora: '01:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Alemanha', time_b: 'Curaçau', data: '14/06/2026', hora: '14:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Holanda', time_b: 'Japão', data: '14/06/2026', hora: '17:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Costa do Marfim', time_b: 'Equador', data: '14/06/2026', hora: '20:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Vaga D', time_b: 'Tunísia', data: '14/06/2026', hora: '23:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Espanha', time_b: 'Cabo Verde', data: '15/06/2026', hora: '13:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Bélgica', time_b: 'Egito', data: '15/06/2026', hora: '16:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Arábia Saudita', time_b: 'Uruguai', data: '15/06/2026', hora: '19:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Irã', time_b: 'Nova Zelândia', data: '15/06/2026', hora: '22:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  // Image 3
  { time_a: 'França', time_b: 'Senegal', data: '16/06/2026', hora: '16:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Vaga 2', time_b: 'Noruega', data: '16/06/2026', hora: '19:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Argentina', time_b: 'Argélia', data: '16/06/2026', hora: '22:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Áustria', time_b: 'Jordânia', data: '17/06/2026', hora: '01:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Portugal', time_b: 'Vaga 1', data: '17/06/2026', hora: '14:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Inglaterra', time_b: 'Croácia', data: '17/06/2026', hora: '17:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Gana', time_b: 'Panamá', data: '17/06/2026', hora: '20:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Uzbequistão', time_b: 'Colômbia', data: '17/06/2026', hora: '23:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  // Image 4
  { time_a: 'Vaga D', time_b: 'África do Sul', data: '18/06/2026', hora: '13:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Suíça', time_b: 'Vaga A', data: '18/06/2026', hora: '16:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Canadá', time_b: 'Catar', data: '18/06/2026', hora: '19:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'México', time_b: 'Coreia do Sul', data: '18/06/2026', hora: '22:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Estados Unidos', time_b: 'Austrália', data: '19/06/2026', hora: '16:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Escócia', time_b: 'Marrocos', data: '19/06/2026', hora: '19:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Brasil', time_b: 'Haiti', data: '19/06/2026', hora: '22:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  // Image 5
  { time_a: 'Vaga C', time_b: 'Paraguai', data: '20/06/2026', hora: '01:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Holanda', time_b: 'Vaga D', data: '20/06/2026', hora: '14:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Alemanha', time_b: 'Costa do Marfim', data: '20/06/2026', hora: '17:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Equador', time_b: 'Curaçao', data: '20/06/2026', hora: '21:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Tunísia', time_b: 'Japão', data: '21/06/2026', hora: '01:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Espanha', time_b: 'Arábia Saudita', data: '21/06/2026', hora: '13:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Bélgica', time_b: 'Irã', data: '21/06/2026', hora: '16:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Uruguai', time_b: 'Cabo Verde', data: '21/06/2026', hora: '19:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Nova Zelândia', time_b: 'Egito', data: '21/06/2026', hora: '22:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  // Image 6
  { time_a: 'Argentina', time_b: 'Áustria', data: '22/06/2026', hora: '14:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'França', time_b: 'Vaga 2', data: '22/06/2026', hora: '18:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Noruega', time_b: 'Senegal', data: '22/06/2026', hora: '21:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Jordânia', time_b: 'Argélia', data: '23/06/2026', hora: '00:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Portugal', time_b: 'Uzbequistão', data: '23/06/2026', hora: '14:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Inglaterra', time_b: 'Gana', data: '23/06/2026', hora: '17:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Panamá', time_b: 'Croácia', data: '23/06/2026', hora: '20:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Colômbia', time_b: 'Vaga 1', data: '23/06/2026', hora: '23:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  // Image 7
  { time_a: 'Suíça', time_b: 'Canadá', data: '24/06/2026', hora: '16:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Vaga A', time_b: 'Catar', data: '24/06/2026', hora: '16:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Marrocos', time_b: 'Haiti', data: '24/06/2026', hora: '19:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Escócia', time_b: 'Brasil', data: '24/06/2026', hora: '19:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'África do Sul', time_b: 'Coreia do Sul', data: '24/06/2026', hora: '22:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Vaga D', time_b: 'México', data: '24/06/2026', hora: '22:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Curaçao', time_b: 'Costa do Marfim', data: '25/06/2026', hora: '17:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Equador', time_b: 'Alemanha', data: '25/06/2026', hora: '17:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Tunísia', time_b: 'Holanda', data: '25/06/2026', hora: '20:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Japão', time_b: 'Vaga D', data: '25/06/2026', hora: '20:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  // Image 8
  { time_a: 'Noruega', time_b: 'França', data: '26/06/2026', hora: '16:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Senegal', time_b: 'Vaga 2', data: '26/06/2026', hora: '16:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Cabo Verde', time_b: 'Arábia Saudita', data: '26/06/2026', hora: '21:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Uruguai', time_b: 'Espanha', data: '26/06/2026', hora: '21:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  // Image 9
  { time_a: 'Nova Zelândia', time_b: 'Bélgica', data: '27/06/2026', hora: '00:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Egito', time_b: 'Irã', data: '27/06/2026', hora: '00:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Panamá', time_b: 'Inglaterra', data: '27/06/2026', hora: '18:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Croácia', time_b: 'Gana', data: '27/06/2026', hora: '18:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Colômbia', time_b: 'Portugal', data: '27/06/2026', hora: '20:30', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Vaga 1', time_b: 'Uzbequistão', data: '27/06/2026', hora: '20:30', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Argélia', time_b: 'Áustria', data: '27/06/2026', hora: '23:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
  { time_a: 'Jordânia', time_b: 'Argentina', data: '27/06/2026', hora: '23:00', estadio: 'A definir', fase: 'Fase de Grupos', status: 'scheduled' as const },
];

export const seedGroups = async () => {
  const standingsRef = collection(db, 'group_standings');
  
  for (const group of groupsData) {
    for (const teamName of group.teams) {
      const q = query(standingsRef, where('grupo', '==', group.grupo), where('time', '==', teamName));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        await addDoc(standingsRef, {
          grupo: group.grupo,
          time: teamName,
          pontos: 0,
          vitorias: 0,
          empates: 0,
          derrotas: 0,
          saldo: 0
        });
      }
    }
  }
  console.log('Groups seeding completed!');
};

export const seedGames = async () => {
  const gamesRef = collection(db, 'games');
  
  for (const game of gamesData) {
    const q = query(gamesRef, where('time_a', '==', game.time_a), where('time_b', '==', game.time_b), where('data', '==', game.data));
    const snap = await getDocs(q);
    
    if (snap.empty) {
      await addDoc(gamesRef, {
        ...game,
        gols_a: 0,
        gols_b: 0
      });
    }
  }
  console.log('Games seeding completed!');
};
