import { Router } from 'express';
import { ordersDal } from '../dal/orders-dal.js';
import { randomUUID } from 'node:crypto';
import { HttpError } from '../lib/http-errors.js';
import { ordersToCSV } from '../lib/csv-formatter.js';


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

ordersRouter.get('/export/csv', async (req, res, next) => {
  try {
    const from = typeof req.query.from === 'string' ? req.query.from : undefined;
    const to = typeof req.query.to === 'string' ? req.query.to : undefined;

    // Validate date range if provided
    if (from || to) {
      if (!from || !to) {
        throw new HttpError(400, 'Both from and to are required together');
      }
      // Basic validation: to should be after from
      if (new Date(to) <= new Date(from)) {
        throw new HttpError(400, 'to must be after from');
      }
    }

    const orders = ordersDal.getForExport(req.merchantId!, from, to);
    const csv = ordersToCSV(orders);

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="orders-${new Date().toISOString().slice(0,10)}.csv"`);
    res.send(csv);
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
