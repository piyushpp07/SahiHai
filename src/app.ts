import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';
import sticky from 'sticky-session';
import { cpus } from 'os';
import { createServer } from 'http';
import connectDB from './config/db';
import logger from './config/winston-config';

// Infrastructure
import { ChatSessionRepository } from './infrastructure/database/repositories/ChatSessionRepository';
import { aiService } from './infrastructure/external-services/aiService';
import { ChallanService } from './infrastructure/external-services/ChallanService';
import { FuelPriceService } from './infrastructure/external-services/FuelPriceService';
import { PnrService } from './infrastructure/external-services/PnrService';
import { GoldSilverService } from './infrastructure/external-services/GoldSilverService';
import { AQIService } from './infrastructure/external-services/AQIService';

// Application
import { InitiateChat } from './application/chat/InitiateChat';
import { SendMessage } from './application/chat/SendMessage';
import { CheckChallan } from './application/utilities/CheckChallan';
import { GetFuelPrices } from './application/utilities/GetFuelPrices';
import { CheckPNRStatus } from './application/utilities/CheckPNRStatus';
import { GetGoldSilverRates } from './application/utilities/GetGoldSilverRates';
import { GetAQI } from './application/utilities/GetAQI';

// Interfaces
import { ChatController } from './interfaces/http/controllers/ChatController';
import { UtilitiesController } from './interfaces/http/controllers/UtilitiesController';
import { createChatRoutes } from './interfaces/http/routes/chatRoutes';
import { createUtilityRoutes } from './interfaces/http/routes/utilityRoutes';
import { correlationIdMiddleware } from './interfaces/http/middleware/correlationIdMiddleware';

const app = express();

// Middleware
app.use(express.json());
app.use(correlationIdMiddleware);


// Dependency Injection Container
const chatSessionRepository = new ChatSessionRepository();
const challanService = new ChallanService();
const fuelPriceService = new FuelPriceService();
const pnrService = new PnrService();
const goldSilverService = new GoldSilverService();
const aqiService = new AQIService();

const initiateChat = new InitiateChat(chatSessionRepository);
const sendMessage = new SendMessage(chatSessionRepository);
const checkChallan = new CheckChallan(challanService);
const getFuelPrices = new GetFuelPrices(fuelPriceService);
const checkPNRStatus = new CheckPNRStatus(pnrService);
const getGoldSilverRates = new GetGoldSilverRates(goldSilverService);
const getAQI = new GetAQI(aqiService);

const chatController = new ChatController(initiateChat, sendMessage);
const utilitiesController = new UtilitiesController(checkChallan, getFuelPrices, checkPNRStatus, getGoldSilverRates, getAQI);

// Routes
app.use('/api/chat', createChatRoutes(chatController));
app.use('/api/utilities', createUtilityRoutes(utilitiesController));


const RedisStore = connectRedis(session);
const redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);

app.use(session({
  store: new RedisStore({ client: redisClient as any }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = createServer(app);

connectDB().then(() => {
  if (sticky.listen(server, 3000)) {
    server.once('listening', () => {
      logger.info(`Server started on port 3000 with ${cpus().length} workers`);
    });
  } else {
    logger.info(`Worker ${process.pid} started`);
  }
});