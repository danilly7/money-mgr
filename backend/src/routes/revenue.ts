import { Router } from 'express';
import { deleteDailyRevenue, getDailyRevenue, getRevenue, postDailyRevenue, updateDailyRevenue } from '../controllers/revenue';

const revenueRouter = Router();

revenueRouter.get('/', getRevenue);
revenueRouter.get('/:id', getDailyRevenue);
revenueRouter.delete('/:id', deleteDailyRevenue);
revenueRouter.post('/', postDailyRevenue);
revenueRouter.put('/:id', updateDailyRevenue);

export default revenueRouter;