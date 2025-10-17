import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import fetcherClient from "../../../utils/fetcherClient";

const FallbackEditorJsRenderer = ({ data }) => {
  if (!data || !Array.isArray(data.blocks)) return null;

  const sanitizeHtml = (html) => {
    if (!html) return "";
    return String(html).replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  };

  return (
    <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
      {data.blocks.map((block, idx) => {
        const key = `${block.type}-${idx}`;
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={key}
                className="mb-5 text-[1.1rem] text-gray-700 leading-8 tracking-wide"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text) }}
              />
            );

          case "header":
            const level = block.data.level || 2;
            const HeadingTag = `h${Math.min(level, 4)}`;
            return (
              <HeadingTag
                key={key}
                className={`mt-10 mb-4 font-bold text-gray-900 ${
                  level === 1
                    ? "text-4xl"
                    : level === 2
                    ? "text-3xl"
                    : level === 3
                    ? "text-2xl"
                    : "text-xl"
                }`}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text) }}
              />
            );

          case "list":
            const isOrdered = block.data.style === "ordered";
            const Tag = isOrdered ? "ol" : "ul";
            return (
              <Tag
                key={key}
                className={`ml-6 mb-5 ${
                  isOrdered ? "list-decimal" : "list-disc"
                } text-gray-700 space-y-2`}
              >
                {(block.data.items || []).map((it, i) => (
                  <li
                    key={i}
                    className="pl-1"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(it) }}
                  />
                ))}
              </Tag>
            );

          case "image":
            return (
              <figure key={key} className="my-8">
                <img
                  src={block.data.file?.url || block.data.url}
                  alt={block.data.caption || ""}
                  className="rounded-xl shadow-md w-full object-cover transition-transform duration-300 hover:scale-[1.01]"
                />
                {block.data.caption && (
                  <figcaption
                    className="text-sm text-gray-500 italic mt-2 text-center"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.caption) }}
                  />
                )}
              </figure>
            );

          case "quote":
            return (
              <blockquote
                key={key}
                className="border-l-4 border-indigo-500 pl-4 italic text-gray-600 my-6"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text) }}
              />
            );

          case "code":
            return (
              <pre
                key={key}
                className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6"
              >
                <code>{sanitizeHtml(block.data.code)}</code>
              </pre>
            );

          default:
            return (
              <div key={key} className="mb-4 text-gray-500 text-sm">
                Unsupported block: <code>{block.type}</code>
              </div>
            );
        }
      })}
    </div>
  );
};


const StoryReadingPage = () => {
  const { storyId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    if (!storyId) return;

    let mounted = true;
    const getBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetcherClient.get(`/blogs/${storyId}`);
        console.debug("GET /blogs/:id response:", res);
        if (!mounted) return;
        if (!res) {
          console.error("fetcherClient.get returned null/undefined for blog id", storyId);
          setError("No response from server");
          return;
        }

        const payload = res?.data && (res?.data.blog || res?.data) ? (res?.data.blog || res?.data) : null;
        if (!payload) {
          console.warn("GET /blogs/:id returned empty payload", res?.data);
          setError("Story not found or invalid response.");
          return;
        }

        setBlog(payload);
      } catch (err) {
        console.error("Failed to fetch story:", err);
        if (mounted) setError(err?.response?.data?.message || "Failed to load story.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getBlog();
    return () => { mounted = false; };
  }, [storyId]);

  if (loading) return <div className="p-6">Loading story...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!blog) return <div className="p-6">Story not found.</div>;

  let content = null;
  try {
    content = typeof blog.content === "string" ? JSON.parse(blog.content) : blog.content;
  } catch {
    content = null;
  }

  const author = blog.author || {};

  return (
    <div className="max-w-4xl mx-auto p-6">
      {blog.bannerImage && (
        <img src={blog.bannerImage} alt={blog.title} className="w-full h-64 object-cover rounded-md mb-6" />
      )}

      <h1 className="text-4xl font-bold mb-3">{blog.title}</h1>

      <div className="flex items-center gap-3 mb-6">
        <Link to={`/profile/${author._id}`} className="flex items-center gap-3">
          {author.profilePic ? (
            <img src={author.profilePic} alt={author.name || author.username} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm text-white">
              {author.name ? author.name.charAt(0).toUpperCase() : (author.username ? author.username.charAt(0).toUpperCase() : "U")}
            </div>
          )}

          <div>
            <div className="font-semibold">{author.name || author.username || "Unknown"}</div>
            {author.username && <div className="text-sm text-gray-500">@{author.username}</div>}
          </div>
        </Link>
      </div>

      <div className="prose max-w-none">
        {content ? (
          <FallbackEditorJsRenderer data={content} />
        ) : (
          <div>{blog.content}</div>
        )}
      </div>
    </div>
  );
};

export default StoryReadingPage;
