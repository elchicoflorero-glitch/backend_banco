export interface TransferForm {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: string;
}

export interface TransferResult {
  success: boolean;
  message: string;
  transactionId?: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  balance: number | string;
  currency?: string;
  clientId: string;
  createdAt: string;
}
