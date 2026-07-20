#!/bin/bash

# Script to run the client password migration
# This adds the password column to the clients table

echo "================================"
echo "Client Password Migration"
echo "================================"

# Load environment variables from .env
if [ -f .env ]; then
    set -a
    source .env
    set +a
else
    echo "Error: .env file not found"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL not set in .env"
    exit 1
fi

# Parse the PostgreSQL URI
# Format: postgresql://user:password@host:port/database
if [[ $DATABASE_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
    USER="${BASH_REMATCH[1]}"
    PASSWORD="${BASH_REMATCH[2]}"
    HOST="${BASH_REMATCH[3]}"
    PORT="${BASH_REMATCH[4]}"
    DATABASE="${BASH_REMATCH[5]}"
else
    echo "Error: Invalid DATABASE_URL format"
    exit 1
fi

echo "Database: $DATABASE@$HOST:$PORT"
echo ""
echo "Executing migration..."

# Export password for psql
export PGPASSWORD=$PASSWORD

# Run the migration
psql -h "$HOST" -p "$PORT" -U "$USER" -d "$DATABASE" -f prisma/add-password-to-clients.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
else
    echo ""
    echo "❌ Migration failed!"
    unset PGPASSWORD
    exit 1
fi

# Clear password from environment
unset PGPASSWORD

echo ""
echo "Next steps:"
echo "1. Update clients with passwords"
echo "2. Run 'npm start' to start the backend"
echo "3. Test login with client DNI and password"
