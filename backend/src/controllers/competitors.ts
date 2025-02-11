import { Request, Response } from 'express';
import models from '../models';

const {Competitor} = models;

export const getCompetitors = async (req: Request, res: Response) => {
    try {
        const result = await Competitor.findAndCountAll();
        res.json({data: result });
    } catch (error) {
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get all the competitors',
        });
    }
};

export const getCompetitor = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const competitor = await Competitor.findByPk(id);

        if (competitor) {
            res.json(competitor);
        } else {
            res.status(404).json({
                msg: `Competitor with id ${id} does NOT exist (yet)`,
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get the competitor',
        });
    }
};