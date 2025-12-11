import app from './app.js';
import { config } from './config/config.js';
import { testConnection } from './config/db.js';

async function start() {
  try {
    await testConnection();
    console.log('Database connected');
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
