-- Make sourceAccountId nullable (for deposits where there's no source account)
ALTER TABLE "transactions" ALTER COLUMN "sourceAccountId" DROP NOT NULL;
