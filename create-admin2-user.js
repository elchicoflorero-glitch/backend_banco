const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔐 Creando usuario admin2...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('codigoyara', 10);
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        username: 'admin2',
        email: 'admin2@bancoperu.com',
        password: hashedPassword,
        role: 'admin',
      },
    });
    
    console.log('✅ Usuario admin2 creado exitosamente:');
    console.log('   Username: admin2');
    console.log('   Password: codigoyara');
    console.log('   Role: admin');
    console.log('   Email: admin2@bancoperu.com');
    console.log('   ID: ' + admin.id);
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  El usuario admin2 ya existe.');
      console.log('   Username: admin2');
      console.log('   Password: codigoyara');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
