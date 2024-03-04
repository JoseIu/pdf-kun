import 'dotenv/config';
import express, { Express } from 'express';
import gptRoutes from './routes/gpt.routes';

const PORT: number | string = process.env.PORT || 3000;

const expressApp: Express = express();

expressApp.use(express.json());
expressApp.use(express.text());

expressApp.use('/gpt', gptRoutes);

expressApp.listen(PORT, () => console.log(`Servidor levandtado en el puerto ${PORT}`));
