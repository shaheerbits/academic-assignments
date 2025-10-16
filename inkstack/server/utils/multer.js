import path from "path";
import { uploadMulterFile, storagePath } from "../middlewares/multer.middleware.js";

export const uploadFile = (req, res) => {
  uploadMulterFile(req, res, (error) => {
    if (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }

    const filename = req?.file?.filename;

    res.json({
      success: 1,
      file: {
        url: `http://localhost:3000/api/download-file/${filename}`
      }
    });
  });
};

export const downloadFile = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(storagePath, filename);

  res.download(filePath, (error) => {
    if (error) res.status(404).json({ error: "File not found" });
  });
};
