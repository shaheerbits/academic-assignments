import { Router } from 'express';

const blogRouter = Router();

blogRouter.get('/', (req, res) => {
  res.send('Blog route');
});

export default blogRouter;