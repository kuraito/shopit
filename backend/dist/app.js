import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRouter';
import path from 'path';
const app = express();
// Configura CORS solo per il frontend 
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
// Parsa il JSON dal body delle richieste e lo mette in req.body
app.use(express.json());
// Rotte di autenticazione
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
// Serve i file statici dalla cartella "public" (dove mettiamo le immagini dei prodotti)
app.use(express.static(path.join(process.cwd(), 'public')));
export default app;
