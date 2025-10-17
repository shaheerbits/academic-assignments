import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import fetcherClient from "../../../utils/fetcherClient";
import BlogCard from "../../../components/ui/BlogCard";

const PublicProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    const token = localStorage.getItem("token");

    const getData = async () => {
      setLoading(true);
      try {
        // If token exists, call protected endpoints; otherwise call public endpoints
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const userPath = token ? `/user/${userId}` : `/user/public/${userId}`;
        const blogsPath = token ? `/user/${userId}/blogs` : `/user/public/${userId}/blogs`;

        const [uRes, bRes] = await Promise.all([
          fetcherClient.get(userPath, { headers }),
          fetcherClient.get(blogsPath, { headers }),
        ]);

        if (!mounted) return;
        setUser(uRes?.data || uRes?.data?.user || null);
        setBlogs((bRes?.data && (bRes.data.blogs || bRes.data)) || []);
      } catch (err) {
        console.error("Failed to load public profile:", err);
        if (mounted) setError(err?.response?.data?.message || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getData();
    return () => { mounted = false; };
  }, [userId]);

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

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!user) return <div className="p-6">User not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-6 mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-2xl text-gray-700">
          {user.profilePic ? (
            <img src={user.profilePic} alt={user.name || user.username} className="w-full rounded-full object-center object-cover" />
          ) : (
            (user.name || user.username || "U").charAt(0).toUpperCase()
          )}
        </div>

        <div>
          <div className="mb-2 font-semibold text-2xl">{user.name || user.username}</div>
          {user.username && <div className="text-sm text-gray-500">@{user.username}</div>}
          {user.bio && <div className="mt-2 text-gray-700">{user.bio}</div>}
        </div>
      </div>

      <section>
        <h3 className="text-xl font-semibold mb-3">Stories by {user.name || user.username}</h3>
        {blogs.length === 0 ? (
          <p className="text-gray-600">No stories yet.</p>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
                <Link key={blog._id} to={`/story/${blog._id}`} className="block hover:opacity-95">
                <article className="flex justify-between items-center border-b p-4 border-b-zinc-200">
                    <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                    <p className="text-gray-700">{renderExcerpt(blog.content)}</p>
                    </div>

                    <div className="pl-4">
                    {blog.bannerImage && (
                        <img
                        src={blog.bannerImage}
                        alt={blog.title}
                        className="w-[200px] object-cover rounded-md mb-3"
                        />
                    )}
                    </div>
                </article>
                </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PublicProfilePage;
