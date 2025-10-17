import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Code from "@editorjs/code";
import Quote from "@editorjs/quote";
import showToast from "../../../utils/showToast";
import fetcherClient from "../../../utils/fetcherClient";
import { useNavigate } from "react-router-dom";

const NewStoryPage = () => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerLocalPreview, setBannerLocalPreview] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const initEditor = async () => {
      const tools = {
        header: Header,
        list: List,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: "http://localhost:3000/api/upload-file",
              byUrl: "http://localhost:3000/api/upload-file",
            },
            field: "image",
          },
        },
        code: Code,
        quote: {
          class: Quote,
          inlineToolbar: true,
        },
      };

      if (!mounted) return;

      const editor = new EditorJS({
        holder: "editorjs",
        autofocus: true,
        placeholder: "Start writing your story...",
        tools,
      });

      editorRef.current = editor;
    };

    initEditor();

    return () => {
      mounted = false;
      try {
        if (editorRef.current?.isReady) {
          editorRef.current.isReady
            .then(() => editorRef.current.destroy())
            .catch((err) => console.error("EditorJS cleanup failed:", err));
        }
      } catch (err) {
        console.error("Error during editor cleanup:", err);
      }

      if (bannerLocalPreview) URL.revokeObjectURL(bannerLocalPreview);
    };
  }, []);

  const handlePublish = async () => {
    try {
      const output = await editorRef.current.save();

      const token = localStorage.getItem("token");

      const body = { title, content: JSON.stringify(output) };
      if (bannerUrl) body.bannerImage = bannerUrl;

      await fetcherClient.post("/blogs/create", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast("Story published successfully!", "success");
      navigate("/");
    } catch (err) {
      console.error(err);
      showToast("Error publishing story", "error");
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (bannerLocalPreview) URL.revokeObjectURL(bannerLocalPreview);
    } catch {}
    const previewUrl = URL.createObjectURL(file);
    setBannerFile(file);
    setBannerPreview(previewUrl);
    setBannerLocalPreview(previewUrl);

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("You must be logged in to upload images", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await fetcherClient.post(`/upload-file`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      if (!data?.file?.url) throw new Error("Upload failed");

      setBannerUrl(data.file.url);
      showToast("Banner uploaded", "success");
    } catch (err) {
      console.error(err);
      showToast("Banner upload failed", "error");
      setBannerFile(null);
      setBannerPreview("");
      setBannerUrl("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <label className="block mb-4">
        <span className="block text-sm font-medium mb-1">Banner image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleBannerChange}
          className="block"
        />
      </label>

      {bannerPreview && (
        <div className="mb-4">
          <img
            src={bannerPreview}
            alt="Banner preview"
            className="max-h-52 w-auto rounded-md"
          />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>
      )}

      <input
        className="text-3xl font-bold w-full mb-4 border-b border-b-zinc-800 p-4 focus:outline-none"
        placeholder="Your story title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div id="editorjs" 
        className="p-3 pl-8 min-h-[400px] min-w-[400px] w-full bg-light--aura text-gray-800 focus:outline-none"
        ></div>

      <button
        onClick={handlePublish}
        className="mt-6 bg-dark--soul text-white px-6 py-2 rounded-lg hover:bg-black transition-colors cursor-pointer"
        disabled={uploading}
      >
        Publish
      </button>
    </div>
  );
};

export default NewStoryPage;
