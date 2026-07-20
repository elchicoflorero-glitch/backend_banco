-- AddTypeAndStatusToTransactions
ALTER TABLE "transactions" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'transfer';
ALTER TABLE "transactions" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'completed';

-- Create index for status queries
CREATE INDEX "idx_transactions_status" ON "transactions"("status");
CREATE INDEX "idx_transactions_type" ON "transactions"("type");
