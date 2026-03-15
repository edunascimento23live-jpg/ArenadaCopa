import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Game, GroupStanding } from '../types';

export const recalculateStandings = async () => {
  try {
    // 1. Get all finished games
    const gamesSnap = await getDocs(query(collection(db, 'games'), where('status', '==', 'finished')));
    const finishedGames = gamesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));

    // 2. Get all standings
    const standingsSnap = await getDocs(collection(db, 'group_standings'));
    const standings = standingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GroupStanding));

    // 3. Reset all standings to zero before recalculating
    const resetStandings = standings.map(s => ({
      ...s,
      pontos: 0,
      vitorias: 0,
      empates: 0,
      derrotas: 0,
      saldo: 0
    }));

    // 4. Calculate stats for each team based on finished games
    finishedGames.forEach(game => {
      const teamA = resetStandings.find(s => s.time === game.time_a);
      const teamB = resetStandings.find(s => s.time === game.time_b);

      if (teamA && teamB) {
        teamA.saldo += (game.gols_a - game.gols_b);
        teamB.saldo += (game.gols_b - game.gols_a);

        if (game.gols_a > game.gols_b) {
          teamA.pontos += 3;
          teamA.vitorias += 1;
          teamB.derrotas += 1;
        } else if (game.gols_a < game.gols_b) {
          teamB.pontos += 3;
          teamB.vitorias += 1;
          teamA.derrotas += 1;
        } else {
          teamA.pontos += 1;
          teamB.pontos += 1;
          teamA.empates += 1;
          teamB.empates += 1;
        }
      }
    });

    // 5. Update Firestore with new standings
    const updatePromises = resetStandings.map(s => {
      const { id, ...data } = s;
      return updateDoc(doc(db, 'group_standings', id), data);
    });

    await Promise.all(updatePromises);
    console.log('Standings recalculated successfully!');
  } catch (error) {
    console.error('Error recalculating standings:', error);
  }
};
