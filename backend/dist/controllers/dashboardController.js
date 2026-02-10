import { pool } from "../config/database.js";
// Prende tutti i prodotti
export const getProducts = async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT
            p.id,
            p.name,
            p.description,
            group_concat(distinct pp.descrizione) as descr_dett,
            group_concat(distinct pp.amount) AS amount,
            GROUP_CONCAT(distinct a.url) AS images
        FROM product p, product_price pp, asset a
        where pp.product_id = p.id and a.product_id = p.id
        GROUP BY p.id, p.name, p.description`);
        // Trasforma immagini, prezzi e descrizioni da stringa a array
        const productsWithImages = rows.map((product) => ({
            ...product,
            images: product.images ? product.images.split(',') : [],
            amount: product.amount ? product.amount.split(',') : [],
            descr_dett: product.descr_dett ? product.descr_dett.split(',') : []
        }));
        res.json(productsWithImages);
    }
    catch (err) {
        res.status(500).json({ error: "Errore nel caricamento dei prodotti" });
    }
};
