import sticky from 'sticky-session';
import http from 'http';
import { app, connectDatabase } from './app';
import logger from './infrastructure/logging/logger';
import redisClient from './infrastructure/redis/client';
import { Server } from 'socket.io'; // We will use this later for AI

const port = parseInt(process.env.PORT || '3000', 10);

const startCluster = async () => {
  await connectDatabase();

  const server = http.createServer(app);
  
  // Initialize Socket.io (placeholder for now)
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust for production
      methods: ["GET", "POST"]
    }
  });

  // Sticky Session Logic
  // sticky-session helps balance requests based on IP to the same worker
  // Note: sticky-session creates the workers for us.
  const isMaster = !sticky.listen(server, port);

  if (isMaster) {
    logger.info(`Master process ${process.pid} is running on port ${port}`);
  } else {
    logger.info(`Worker process ${process.pid} started`);
  }
  
  // Basic socket logic to verify connection
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id} on worker ${process.pid}`);
    
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });
};

startCluster().catch(err => {
  logger.error('Failed to start cluster:', err);
  process.exit(1);
});
