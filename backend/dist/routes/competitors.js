"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const competitors_1 = require("./../controllers/competitors");
const competitorRouter = (0, express_1.Router)();
competitorRouter.get('/', competitors_1.getCompetitors);
competitorRouter.get('/:id', competitors_1.getCompetitor);
exports.default = competitorRouter;
