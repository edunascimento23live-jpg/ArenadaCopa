export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  link_checkout: string;
  stock: number;
  createdAt: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  date: string;
}

export interface Game {
  id: string;
  time_a: string;
  time_b: string;
  data: string;
  hora: string;
  estadio: string;
  fase: string;
  gols_a?: number;
  gols_b?: number;
  status: 'scheduled' | 'finished';
  homeLineup?: string;
  awayLineup?: string;
}

export interface GroupStanding {
  id: string;
  grupo: string;
  time: string;
  pontos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  saldo: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}
