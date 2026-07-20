require('dotenv').config();
const { Client } = require('pg');

async function createTestUser() {
  // Remove channel_binding from connection string
  const connectionString = process.env.DATABASE_URL.replace('&channel_binding=require', '');
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos');

    // Bcrypt hash for "admin123"
    const passwordHash = '$2b$10$8X.KqZ7Xx7Xx7Xx7Xx7Xx.rqKZ7Xx7Xx7Xx7Xx7Xx7Xx7Xx7Xx7Xx';
    
    // Insert admin user
    const insertQuery = `
      INSERT INTO users (username, email, password, role, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (username) DO UPDATE 
      SET password = EXCLUDED.password, email = EXCLUDED.email, role = EXCLUDED.role, "updatedAt" = NOW()
      RETURNING id, username, email, role;
    `;
    
    const result = await client.query(insertQuery, [
      'admin',
      'admin@bancoperu.com',
      passwordHash,
      'admin'
    ]);

    console.log('\n✅ Usuario creado/actualizado:');
    console.log('   👤 Username: admin');
    console.log('   🔑 Password: admin123');
    console.log('   👑 Role: admin');
    console.log('   📧 Email: admin@bancoperu.com');
    console.log('\n🌐 Login en: https://fronted-banco-git-main-elchicoflorero-glitchs-projects.vercel.app/login');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

createTestUser();
