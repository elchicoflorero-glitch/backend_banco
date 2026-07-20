require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function resetPassword() {
  const connectionString = process.env.DATABASE_URL.replace('&channel_binding=require', '');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos');

    // Generate hash for "admin123"
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    // Update admin password
    const updateQuery = `
      UPDATE users 
      SET password = $1, "updatedAt" = NOW()
      WHERE username = 'admin'
      RETURNING id, username, email, role;
    `;
    
    const result = await client.query(updateQuery, [passwordHash]);

    if (result.rows.length > 0) {
      console.log('\n✅ Contraseña actualizada para:');
      console.log('   👤 Username: admin');
      console.log('   🔑 Password: admin123');
      console.log('   👑 Role: admin');
      console.log('   📧 Email: admin@bancoperu.com');
      console.log('\n🌐 Ahora puedes hacer login en:');
      console.log('   https://fronted-banco-git-main-elchicoflorero-glitchs-projects.vercel.app/login');
    } else {
      console.log('❌ No se encontró el usuario admin');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

resetPassword();
