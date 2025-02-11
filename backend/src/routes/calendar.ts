import { Router } from 'express';
import { getEvents, getEvent, deleteEvent, postEvent, updateEvent } from './../controllers/calendar';

const calendarRouter = Router();

calendarRouter.get('/', getEvents);
calendarRouter.get('/:id', getEvent);
calendarRouter.delete('/:id', deleteEvent);
calendarRouter.post('/', postEvent);
calendarRouter.put('/:id', updateEvent);

export default calendarRouter;