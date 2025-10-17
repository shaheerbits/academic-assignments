import { Router } from "express";
import {
	createBlog,
	getAllBlogs,
	getBlogById,
	updateBlog,
	deleteBlog,
	getBlogsByUser,
} from "../controllers/blog.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const blogRouter = Router();

blogRouter.post("/create", authMiddleware, createBlog);
blogRouter.get("/", getAllBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.put("/:id", authMiddleware, updateBlog);
blogRouter.delete("/:id", authMiddleware, deleteBlog);
blogRouter.get("/user/:userId", getBlogsByUser);

export default blogRouter;