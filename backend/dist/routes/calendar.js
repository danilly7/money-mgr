"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calendar_1 = require("./../controllers/calendar");
const calendarRouter = (0, express_1.Router)();
calendarRouter.get('/', calendar_1.getEvents);
calendarRouter.get('/:id', calendar_1.getEvent);
calendarRouter.delete('/:id', calendar_1.deleteEvent);
calendarRouter.post('/', calendar_1.postEvent);
calendarRouter.put('/:id', calendar_1.updateEvent);
exports.default = calendarRouter;
