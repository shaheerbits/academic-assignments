import { Router } from "express";
import { getBlogsByUserId, getUserById, updateUserById, uploadProfilePicture } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { uploadMulterFile } from "../middlewares/multer.middleware.js";

const userRouter = Router();

// Protected routes (require auth)
userRouter.get('/:id', authMiddleware, getUserById);
userRouter.put('/:id', authMiddleware, updateUserById);
userRouter.post('/:id/profile-picture', authMiddleware, uploadMulterFile, uploadProfilePicture);
userRouter.get('/:id/blogs', authMiddleware, getBlogsByUserId);

// Public routes for read-only access (no auth required)
userRouter.get('/public/:id', getUserById);
userRouter.get('/public/:id/blogs', getBlogsByUserId);

export default userRouter;