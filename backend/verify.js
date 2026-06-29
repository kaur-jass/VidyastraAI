const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const PORT = 5001; // use separate port for verification tests

const runVerification = async () => {
  let server;
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for verification.");

    // 2. Start temporary Express Server
    server = app.listen(PORT, async () => {
      console.log(`Verification server running on port ${PORT}`);

      // 3. Generate valid Admin JWT token
      const token = jwt.sign(
        { id: "60b9f0f9b6572e3412345678", role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const authHeader = `Bearer ${token}`;

      // 4. Test routes
      const endpoints = [
        { path: '/stats', method: 'GET' },
        { path: '/health', method: 'GET' },
        { path: '/courses', method: 'GET' },
        { path: '/settings/ai', method: 'GET' },
        { path: '/settings/ai/test', method: 'POST', body: { provider: 'Gemini Pro' } },
        { path: '/analytics/sessions', method: 'GET' },
        { path: '/analytics/model-ratios', method: 'GET' },
        { path: '/content-moderation/queue', method: 'GET' }
      ];

      console.log("\nStarting API routes verification...");
      let passed = 0;

      for (const ep of endpoints) {
        try {
          const url = `http://localhost:${PORT}/api/admin${ep.path}`;
          const options = {
            method: ep.method,
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json'
            }
          };
          if (ep.body) {
            options.body = JSON.stringify(ep.body);
          }

          const res = await fetch(url, options);
          const status = res.status;
          const data = await res.json();

          if (status === 200 || status === 201) {
            console.log(`✅ [${ep.method}] ${ep.path} - Success (Status: ${status})`);
            passed++;
          } else {
            console.error(`❌ [${ep.method}] ${ep.path} - Failed (Status: ${status})`, data);
          }
        } catch (e) {
          console.error(`❌ [${ep.method}] ${ep.path} - Exception:`, e.message);
        }
      }

      console.log(`\nVerification summary: ${passed}/${endpoints.length} passed.`);
      
      // Cleanup
      server.close(async () => {
        console.log("Verification server closed.");
        await mongoose.connection.close();
        console.log("Database connection closed.");
        process.exit(passed === endpoints.length ? 0 : 1);
      });
    });
  } catch (err) {
    console.error("Verification failed:", err);
    if (server) server.close();
    process.exit(1);
  }
};

runVerification();
