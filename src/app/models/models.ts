export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  accounts?: UserAccount[]; // relación
  createdAt: Date | string;
  logs?: Log[]; // relación
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  accounts?: Account[]; // relación
}

export interface Account {
  id: string;
  number: string;
  iban: string;
  balance: number;
  currencyId: string;
  bankId: string;
  createdAt: Date | string;
  currency?: Currency; // relación
  bank?: Bank; // relación
  users?: UserAccount[]; // relación
  subscriptions?: Subscription[]; // relación
  transfersFrom?: Transfer[]; // relación
  transfersTo?: Transfer[]; // relación
  phone?: string | null; // <-- Agrega este campo

}

export interface UserAccount {
  userId: string;
  accountId: string;
  user?: User; // relación
  account?: Account; // relación
  role: string;
}

export interface Subscription {
  id: string;
  accountId: string;
  account?: Account; // relación
  type: string;
  alias: string | null; // puede ser null en Prisma
  createdAt: Date | string;
}

export interface Transfer {
  id: string;
  fromId: string;
  toId: string;
  from?: Account; // relación
  to?: Account; // relación
  amount: number;
  date: Date | string;
  status: string;
  transactionId: string;
  description?: string | null; // puede ser null en Prisma
  currency: string;
  hmacHash: string;
}

export interface Log {
  id: string;
  action: string;
  userId?: string | null; // puede ser null en Prisma
  user?: User | null; // relación, puede ser null
  details: string;
  timestamp: Date | string;
}

export interface Bank {
  id: string;
  code: string;
  name: string;
  ip: string;
  sharedSecret: string;
  accounts?: Account[]; // relación
}
