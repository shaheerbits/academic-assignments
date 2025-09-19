import express from 'express';
import { config } from 'dotenv';
// Database connection
import connectDB from './db/connection.js';
// Routes
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/users.routes.js';
import blogRouter from './routes/blogs.routes.js';
import commentRouter from './routes/comments.routes.js';

config();

const app = express();

app.use(express.json());

connectDB();

// Routers
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/comments', commentRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});