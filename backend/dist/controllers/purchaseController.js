import { pool } from "../config/database.js";
import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "secret123";
// Prende gli acquisti dell'utente 
export const getPurchases = async (req, res) => {
    try {
        // Estrai lo user_id dal token
        const authHeader = req.headers.authorization; //prendi l'header Authorization dalla richiesta
        if (!authHeader) {
            return res.status(401).json({ error: "Token non trovato" });
        }
        const token = authHeader.split(' ')[1]; //l'header è nel formato Bearer token quindi prendi la seconda parte
        if (!token) {
            return res.status(401).json({ error: "Token non trovato" });
        }
        const decoded = jwt.verify(token, SECRET); //verifica il token e decodifica, se non è valido lancia un errore
        const userId = decoded.id; //prendi l'id dell'utente dal token decodificato
        // Prendi gli acquisti dell'utente
        const [rows] = await pool.query(`SELECT p.id, p2.description, p.price_snapshot, p.created_at, p2.name
      FROM purchase p, product p2
      WHERE p.product_id = p2.id AND p.user_id = ?
      ORDER BY p.created_at DESC`, [userId]);
        res.json(rows); //ritorna gli acquisti dell'utente
    }
    catch (err) {
        console.error('errore in getPurchases:', err);
        res.status(500).json({ error: "Errore nel caricamento degli acquisti" });
    }
};
// Crea un acquisto
export const createPurchase = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Token non trovato" });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "Token non trovato" });
        }
        const decoded = jwt.verify(token, SECRET); //verifica il token e decodifica, se non è valido lancia un errore
        const userId = decoded.id; //prendi l'id dell'utente dal token decodificato
        const { product_id, price } = req.body; //prendi product_id e price dal body della richiesta
        await pool.query("INSERT INTO purchase (user_id, product_id, price_snapshot, created_at) VALUES (?, ?, ?, NOW())", [userId, product_id, price]);
        res.json({ message: "Acquisto effettuato con successo" });
    }
    catch (err) {
        console.error('errore in createPurchase:', err);
        res.status(500).json({ error: "Errore interno del server" });
    }
};
