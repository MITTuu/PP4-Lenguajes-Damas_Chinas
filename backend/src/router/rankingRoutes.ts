import express from 'express';

import { addRanking, getRankings } from '../controllers/rankingController';

export default (router: express.Router) => {

    router.get('/api/ranking', (req, res, next) => {
        getRankings(req, res).catch(next);
    })

    router.post('/api/ranking', (req, res, next) => {
        addRanking(req, res).catch(next);
    })
};