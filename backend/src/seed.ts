import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Seeding database...');

    // Create default admin user carlos/1234
    const hashedPassword = await hash('1234', 10);

    const adminUser = await prisma.user.upsert({
      where: { username: 'carlos' },
      update: {},
      create: {
        username: 'carlos',
        email: 'carlos@bancoperu.com',
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log('✅ Created admin user:', adminUser.username);
    console.log('🎉 Database seeded successfully!');
    console.log('\n📝 Credentials:');
    console.log('Username: carlos');
    console.log('Password: 1234');

  } catch (err) {
    if (err.code !== 'P1001' && err.code !== 'P1003') {
      console.error('❌ Error seeding database:', err.message);
    } else {
      console.log('⚠️  Database not yet available, skipping seed');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();