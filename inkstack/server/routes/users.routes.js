import { Router } from "express";
import { getUserById, updateUserById, uploadProfilePicture } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/:id', authMiddleware, getUserById);
userRouter.put('/:id', authMiddleware, updateUserById);
userRouter.post('/:id/profile-picture', authMiddleware, uploadProfilePicture);
userRouter.get('/:id/blogs', authMiddleware, getBlogsByUserId);

export default userRouter;