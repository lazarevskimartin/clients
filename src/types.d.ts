export interface Client {
  _id?: string;
  fullName: string;
  address: string;
  phone: string;
  status: 'delivered' | 'undelivered' | 'pending';
  note?: string; // Општ опис/белешка за статусот
}

export type UserRole = 'admin' | 'operator' | 'courier';

export interface User {
  _id?: string;
  email: string;
  role: UserRole;
}
