import { Request, Response } from 'express';
import models from '../models';

const {Event} = models;

export const getEvents = async (req: Request, res: Response) => {
    try {
        const result = await Event.findAll();

        res.json({
            total: result.length,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get all the events',
        });
    }
};

export const getEvent = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const event = await Event.findByPk(id);

        if (event) {
            res.json(event);
        } else {
            res.status(404).json({
                msg: `Event with id ${id} does NOT exist (yet)`
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get the event',
        });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const event = await Event.findByPk(id);

        if (!event) {
            res.status(404).json({
                msg: `Event with id ${id} does NOT exist`,
            });
        } else {
            await event.destroy();
            res.json({
                msg: `Event has been deleted successfully`,
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: 'Ups, there was an error when trying to delete the event',
        });
    }
};

export const postEvent = async (req: Request, res: Response) => {
    const { title, date, color } = req.body;

    try {
        const newEvent = await Event.create({
            title,
            date,
            color,
        });

        res.json({
            msg: 'Event has been added successfully',
            data: newEvent,
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error adding event:', error.message);
            res.status(500).json({
                msg: 'An error occurred while adding the event',
                error: error.message,
            });
        } else {
            console.error('Unknown error:', error);
            res.status(500).json({
                msg: 'An unknown error occurred',
            });
        }
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    try {
        const event = await Event.findByPk(id);
        if (event) {
            await event.update(body);
            res.json({
                msg: 'Event has been updated successfully',
                body
            })
        } else {
            res.status(404).json({
                msg: `Event with id ${id} does NOT exist (yet)`
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Ups, try again. An error has occurred.`
        });
    }
};