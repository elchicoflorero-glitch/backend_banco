const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTables() {
  try {
    console.log('Verificando tablas en la base de datos...\n');
    
    // Intentar contar registros en cada tabla
    const tables = ['User', 'Client', 'Account', 'Transaction', 'AuditLog', 'OTPRequest', 'PDFReport'];
    
    for (const table of tables) {
      try {
        const count = await prisma[table.toLowerCase()].count();
        console.log(`✅ Tabla "${table}" existe - ${count} registros`);
      } catch (error) {
        if (error.code === 'P2021') {
          console.log(`❌ Tabla "${table}" NO existe`);
        } else {
          console.log(`❌ Error al verificar tabla "${table}":`, error.message);
        }
      }
    }
    
    console.log('\n✅ Verificación completada');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
