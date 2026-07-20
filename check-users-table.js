require('dotenv').config();
const { Client } = require('pg');

async function checkTable() {
  const connectionString = process.env.DATABASE_URL.replace('&channel_binding=require', '');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // Get table structure
    const structure = await client.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Estructura de la tabla users:');
    console.table(structure.rows);
    
    // Check existing users
    const users = await client.query('SELECT id, username, email, role FROM users;');
    console.log('\n👥 Usuarios existentes:');
    console.table(users.rows);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkTable();
