export interface CreateAccountForm {
  clientId: string;
  currency: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  clientId: string;
  clientName?: string;
  balance: number | string;
  currency?: string;
  createdAt: string;
}
