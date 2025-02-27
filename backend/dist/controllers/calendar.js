"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEvent = exports.postEvent = exports.deleteEvent = exports.getEvent = exports.getEvents = void 0;
const event_calendar_1 = __importDefault(require("../models/event_calendar"));
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = req.query;
    try {
        const result = yield event_calendar_1.default.findAndCountAll({
            limit: Number(limit),
            offset: (Number(page) - 1) * Number(limit),
        });
        res.json({
            total: result.count,
            pages: Math.ceil(result.count / Number(limit)),
            currentPage: Number(page),
            data: result.rows,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get all the events',
        });
    }
});
exports.getEvents = getEvents;
const getEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const event = yield event_calendar_1.default.findByPk(id);
        if (event) {
            res.json(event);
        }
        else {
            res.status(404).json({
                msg: `Event with id ${id} does NOT exist (yet)`
            });
        }
    }
    catch (error) {
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get the event',
        });
    }
});
exports.getEvent = getEvent;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const event = yield event_calendar_1.default.findByPk(id);
        if (!event) {
            res.status(404).json({
                msg: `Event with id ${id} does NOT exist`
            });
        }
        else {
            yield event.destroy();
            res.json({
                msg: `Event has been deleted successfully`
            });
        }
    }
    catch (error) {
        res.status(500).json({
            msg: 'Ups, there was an error when trying to delete the event',
        });
    }
});
exports.deleteEvent = deleteEvent;
const postEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, date, color } = req.body;
    try {
        const newEvent = yield event_calendar_1.default.create({
            title,
            date,
            color,
        });
        res.json({
            msg: 'Event has been added successfully',
            data: newEvent,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error adding event:', error.message);
            res.status(500).json({
                msg: 'An error occurred while adding the event',
                error: error.message,
            });
        }
        else {
            console.error('Unknown error:', error);
            res.status(500).json({
                msg: 'An unknown error occurred',
            });
        }
    }
});
exports.postEvent = postEvent;
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { id } = req.params;
    try {
        const event = yield event_calendar_1.default.findByPk(id);
        if (event) {
            yield event.update(body);
            res.json({
                msg: 'Event has been updated successfully',
                body
            });
        }
        else {
            res.status(404).json({
                msg: `Event with id ${id} does NOT exist (yet)`
            });
        }
    }
    catch (error) {
        console.log(error);
        res.json({
            msg: `Ups, try again. An error has occurred.`
        });
    }
});
exports.updateEvent = updateEvent;
