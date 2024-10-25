import express from 'express';
import PurchaseController from '../controllers/purchase.controller.js';

const router = express.Router();

router.post('/purchase', PurchaseController.completePurchase);

export default router;
