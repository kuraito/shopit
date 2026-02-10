import express from 'express'
import { getProducts } from '../controllers/dashboardController.js'
import { createPurchase, getPurchases } from '../controllers/purchaseController.js'

const router = express.Router()

// GET /products - prende tutti i prodotti
router.get('/products', getProducts)

// POST /purchase - crea un nuovo acquisto
router.post('/purchase', createPurchase)

// GET /dashboard/purchases - prende gli acquisti dell'utente
router.get('/purchases', getPurchases)


export default router