import User from '../models/user.model.js';
import Blog from '../models/blog.model.js';

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { name, bio }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { id } = req.params; 
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const user = await User.findByIdAndUpdate(id, { profilePicture: file.path }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBlogsByUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const blogs = await Blog.find({ author: id });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};