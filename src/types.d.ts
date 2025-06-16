export interface Client {
  _id?: string;
  fullName: string;
  address: string;
  phone: string;
  status: 'delivered' | 'undelivered' | 'pending';
}
