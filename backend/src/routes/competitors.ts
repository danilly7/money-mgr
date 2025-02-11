import { Router } from 'express';
import { getCompetitors, getCompetitor } from './../controllers/competitors';

const competitorRouter = Router();

competitorRouter.get('/', getCompetitors);

competitorRouter.get('/:id', getCompetitor);

export default competitorRouter;