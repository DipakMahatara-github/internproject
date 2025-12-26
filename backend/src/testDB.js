import pkg from 'pg';
const { Client } = pkg;

async function testConnection() {
  try {
    const client = new Client({
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: '12345678',
    });
    await client.connect();
    console.log("✅ Connection successful!");
    await client.end();
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

testConnection();
