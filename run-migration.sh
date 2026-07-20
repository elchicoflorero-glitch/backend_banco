#!/bin/bash
# Script para ejecutar la migración SQL

psql -U postgres -d banco_peru -f prisma/add-currency.sql
