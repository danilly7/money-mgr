import { Request, Response } from 'express';
import models from '../models';

const {DailyRev} = models;

export const getRevenue = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const result = await DailyRev.findAndCountAll({
            limit: Number(limit),
            offset: (Number(page) - 1) * Number(limit),
        });

        res.json({
            total: result.count,
            pages: Math.ceil(result.count / Number(limit)),
            currentPage: Number(page),
            data: result.rows,
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get all the Daily Revenues',
        });
    }
};

export const getDailyRevenue = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const dailyRev = await DailyRev.findByPk(id);

        if (dailyRev) {
            res.json(dailyRev)
        } else {
            res.status(404).json({
                msg: `Daily revenue with id ${id} does NOT exist (yet)`
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get the Daily Revenue',
        });
    }
};

export const deleteDailyRevenue = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const dailyRev = await DailyRev.findByPk(id);

        if (!dailyRev) {
            res.status(404).json({
                msg: `Daily revenue with id ${id} does NOT exist`
            })
        } else {
            await dailyRev.destroy();
            res.json({
                msg: `Daily revenue has been deleted succesfully`
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: 'Ups, there was an error when trying to delete the Daily Revenue',
        });
    }
};

export const postDailyRevenue = async (req: Request, res: Response) => {
    const { title, date, closed, bank_holiday, total_sales, total_clients } = req.body;

    try {
        const newRevenue = await DailyRev.create({
            title,
            date,
            closed,
            bank_holiday,
            total_sales,
            total_clients,
            weekday_id: new Date(date).getDay(),
        });

        res.json({
            msg: 'Daily Revenue has been added successfully',
            data: newRevenue,
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error adding daily revenue:', error.message);
            res.status(500).json({
                msg: 'An error occurred while adding daily revenue',
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

export const updateDailyRevenue = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    try {
        const dailyRev = await DailyRev.findByPk(id);
        if (dailyRev) {
            await dailyRev.update(body);
            res.json({
                msg: 'Daily revenue has been updated successfully',
                body
            })
        } else {
            res.status(404).json({
                msg: `Daily revenue with id ${id} does NOT exist (yet)`
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Ups, try again. An error has occured.`
        });
    }
};