import express from 'express';
import { config } from 'dotenv';
import path from 'path';
// Database connection
import connectDB from './db/connection.js';
// Routes
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/users.routes.js';
import blogRouter from './routes/blogs.routes.js';
import commentRouter from './routes/comments.routes.js';
// Multer Utils
import { uploadFile, downloadFile } from './utils/multer.js';

config();

const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

const uploadFileEndpoint = "/upload-file";
const downloadFileEndpoint = "/download-file/:filename";


// Routers
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/comments', commentRouter);

app.post(uploadFileEndpoint, uploadFile);
app.get(downloadFileEndpoint, downloadFile);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});