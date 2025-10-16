import Blog from "../models/blog.model.js";

export const createBlog = async (req, res) => {
    const { title, content, tags = [], bannerImage = "" } = req.body;
    const authorId = req._id;

    if (!authorId) return res.status(401).json({ message: "Unauthorized" });
    if (!title || !content)
        return res.status(400).json({ message: "Title and content are required" });

    try {
        const blog = await Blog.create({
            author: authorId,
            title,
            content,
            tags,
            bannerImage,
        });

        return res.status(201).json({ message: "Blog created", blog });
    } catch (error) {
        console.error("createBlog error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getAllBlogs = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    try {
        const [blogs, total] = await Promise.all([
            Blog.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("author", "name email"),
            Blog.countDocuments(),
        ]);

        return res.json({ page, limit, total, blogs });
    } catch (error) {
        console.error("getAllBlogs error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getBlogById = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate("author", "name email");

        if (!blog) return res.status(404).json({ message: "Blog not found" });

        return res.json({ blog });
    } catch (error) {
        console.error("getBlogById error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const updateBlog = async (req, res) => {
    const { id } = req.params;
    const authorId = req.user && req.user._id;
    const updates = (({ title, content, tags, bannerImage }) => ({ title, content, tags, bannerImage }))(req.body);

    try {
        const blog = await Blog.findById(id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        if (String(blog.author) !== String(authorId))
            return res.status(403).json({ message: "Forbidden" });

        Object.keys(updates).forEach((key) => {
            if (updates[key] !== undefined) blog[key] = updates[key];
        });

        await blog.save();
        return res.json({ message: "Blog updated", blog });
    } catch (error) {
        console.error("updateBlog error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Delete a blog (only author)
export const deleteBlog = async (req, res) => {
    const { id } = req.params;
    const authorId = req.user && req.user._id;

    try {
        const blog = await Blog.findById(id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        if (String(blog.author) !== String(authorId))
            return res.status(403).json({ message: "Forbidden" });

        await blog.remove();
        return res.json({ message: "Blog deleted" });
    } catch (error) {
        console.error("deleteBlog error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getBlogsByUser = async (req, res) => {
    const userId = req.params.userId || (req.user && req.user._id);
    if (!userId) return res.status(400).json({ message: "User id required" });

    try {
        const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
        return res.json({ blogs });
    } catch (error) {
        console.error("getBlogsByUser error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};