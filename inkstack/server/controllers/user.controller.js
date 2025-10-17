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
  const allowed = ["name", "bio", "username", "email"];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  try {
    console.log('updateUserById:', id, updates);
    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('updateUserById error:', error);
    // Duplicate key error (e.g., unique username/email)
    if (error.code === 11000) {
      const dupKey = Object.keys(error.keyValue || {})[0];
      const value = error.keyValue ? error.keyValue[dupKey] : '';
      return res.status(400).json({ message: `${dupKey || 'Field'} '${value}' already exists` });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { id } = req.params; 
  const { file } = req;

  console.log(file, id);

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const filename = file.filename;
    const url = `http://localhost:3000/api/download-file/${filename}`;
    const user = await User.findByIdAndUpdate(id, { profilePic: url }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('uploadProfilePicture error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
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