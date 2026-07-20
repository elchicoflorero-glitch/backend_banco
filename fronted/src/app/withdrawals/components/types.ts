export interface WithdrawalForm {
  accountNumber: string;
  amount: string;
  reason?: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  balance: number | string;
  currency: string;
}

export interface WithdrawalResult {
  success: boolean;
  message: string;
  transactionId?: string;
}
