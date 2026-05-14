import { Router } from 'express';
import { ordersDal } from '../dal/orders-dal.js';
import { randomUUID } from 'node:crypto';
import { HttpError } from '../lib/http-errors.js';


export const ordersRouter = Router();

ordersRouter.get('/', async (req, res, next) => {
  try {
    const orders = ordersDal.listByMerchant(req.merchantId!, {
      from: typeof req.query.from === 'string' ? req.query.from : undefined,
      to: typeof req.query.to === 'string' ? req.query.to : undefined,
      limit: typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined,
    });
  res.json({ orders });
  } catch (error) {
    next(error);
  }
});

ordersRouter.get('/:id', async (req, res, next) => {
  try {
    const order = ordersDal.getById(req.params.id);
    if (!order) {
      throw new HttpError(404, 'Order not found');
    }
    res.json({ order });
  } catch (error) {
    next(error);
  }
});

ordersRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body as {
      customer_email?: string;
      total_amount?: number;
      type?: 'sale' | 'refund';
    };
    if (!body.customer_email || typeof body.total_amount !== 'number') {
      next(new HttpError(400, 'Invalid request body')); 
      return;
    }
    const order = ordersDal.create({
      id: randomUUID(),
      merchant_id: req.merchantId!,
      customer_email: body.customer_email,
      total_amount: body.total_amount,
      type: body.type ?? 'sale',
      status: 'completed',
    });
    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
});
