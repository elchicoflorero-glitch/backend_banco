#!/bin/bash

echo "=== OpenSSL Configuration Check ==="
echo ""

echo "1. Checking OpenSSL versions available:"
which openssl && openssl version || echo "OpenSSL not found"
echo ""

echo "2. Checking Prisma configuration:"
echo "NODE_ENV: ${NODE_ENV:-not set}"
echo "PRISMA_CLI_BINARY_TARGETS: ${PRISMA_CLI_BINARY_TARGETS:-not set}"
echo ""

echo "3. Checking Prisma binaries:"
ls -la node_modules/.prisma/client/ 2>/dev/null | head -10 || echo "Prisma client not built yet"
echo ""

echo "4. Checking for required libraries:"
if [ -f "node_modules/.prisma/client/libquery_engine-linux-musl.so.node" ]; then
  echo "✓ Prisma binary found for linux-musl"
  
  # Try to identify required libraries
  echo ""
  echo "5. Checking library dependencies:"
  ldd node_modules/.prisma/client/libquery_engine-linux-musl.so.node 2>/dev/null || \
    echo "Could not read dependencies (may need additional checks)"
else
  echo "✗ Prisma binary not found - run: npm run prisma:generate"
fi
echo ""

echo "6. Checking for libssl.so.1.1:"
find /lib /usr/lib -name "libssl.so*" 2>/dev/null | head -10 || echo "No libssl found"
echo ""

echo "=== Docker Build Test ==="
echo "To test the Docker build locally:"
echo "docker build -f Dockerfile -t banco-peru-backend:test ."
echo ""
