import { Router } from 'express';

const commentRouter = Router();

commentRouter.get('/', (req, res) => {
  res.send('Comment route');
});

export default commentRouter;