import { useEffect, useState } from "react";
import fetcherClient from "../../../utils/fetcherClient";
import BlogCard from "../../../components/ui/BlogCard";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const res = await fetcherClient.get("/blogs/");
        console.log(res);
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
  }, []);

  const renderExcerpt = (contentStr) => {
    if (!contentStr) return "";
    try {
      const parsed = JSON.parse(contentStr);
  
      const firstTextBlock = (parsed.blocks || []).find(
        (b) => b.type === "paragraph" || b.type === "header" || b.type === "list"
      );
      if (!firstTextBlock) return "";

      if (firstTextBlock.type === "list") {
        return (firstTextBlock.data.items || []).join(" ");
      }

      return firstTextBlock.data?.text || firstTextBlock.data?.body || "";
    } catch {
      return String(contentStr).slice(0, 200);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {blogs.length === 0 && <p>No stories yet.</p>}

      <div className="grid grid-cols-1 gap-6">
        {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} renderExcerpt={renderExcerpt} />
        ))}
      </div>
    </div>
  );
};

export default Home;
