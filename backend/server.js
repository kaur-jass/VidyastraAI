    require('dotenv').config();
    const app = require('./app');
    const connectDB = require('./common/config/db'); // Aapke folder structure ke mutabik

    const PORT = process.env.PORT || 5000;

    const startServer = async () => {
        try {
            // Database Connection (Ensure connectDB in common/config/db.js returns a promise)
            await connectDB();
            console.log("✅ Database connected successfully");

            // Server Initialization
            const server = app.listen(PORT, () => {
                console.log(`🚀 Server running on port ${PORT}`);
            });

            // Graceful Shutdown handling
            const gracefulShutdown = (signal) => {
                console.log(`\n⚠️ Received ${signal}. Shutting down gracefully...`);
                server.close(() => {
                    console.log("✅ Server closed.");
                    process.exit(0);
                });
            };

            process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
            process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        } catch (err) {
            console.error("❌ Failed to start server:", err.message);
            process.exit(1);
        }
    };

    startServer();