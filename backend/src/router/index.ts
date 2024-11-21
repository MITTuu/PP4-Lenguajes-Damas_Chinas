import express from 'express';
import rankingRouter from './rankingRoutes';

const router = express.Router();

export default (): express.Router => {
  rankingRouter(router);
  
  return router;
};
