import express from 'express';

import authentication from './userRouter';

const router = express.Router();

export default (): express.Router => {
    authentication(router);

    return router;
}