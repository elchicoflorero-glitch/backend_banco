const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔐 Creando usuario admin...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@bancoperu.com',
        password: hashedPassword,
        role: 'admin',
      },
    });
    
    console.log('✅ Usuario admin creado exitosamente:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Role: admin');
    console.log('   Email: admin@bancoperu.com');
    console.log('\n🌐 Ahora puedes hacer login en:');
    console.log('   https://fronted-banco-git-main-elchicoflorero-glitchs-projects.vercel.app/login');
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  El usuario admin ya existe. Usa estas credenciales:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
