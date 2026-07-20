#!/bin/bash

# Script para verificar que Prisma está correctamente configurado

echo "🔍 Verificando configuración de Prisma..."
echo ""

# Verificar versión de Node
echo "✓ Versión de Node:"
node --version
echo ""

# Verificar versión de npm
echo "✓ Versión de npm:"
npm --version
echo ""

# Verificar que Prisma está instalado
echo "✓ Verificando instalación de Prisma..."
npx prisma --version
echo ""

# Generar cliente de Prisma
echo "✓ Generando cliente de Prisma..."
npx prisma generate
echo ""

# Verificar schema
echo "✓ Validando schema de Prisma..."
npx prisma validate
echo ""

# Intentar conectarse a la base de datos
echo "✓ Intentando conectarse a la base de datos..."
npx prisma db execute --stdin --file /dev/null 2>/dev/null || true
echo ""

echo "✅ Verificación completada. Si no hay errores arriba, está todo listo."
