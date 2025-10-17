import { Link } from "react-router-dom";

const BlogCard = ({ blog, renderExcerpt }) => {
  const author = blog.author || {};

  return (
    <Link to={`/story/${blog._id}`} className="block hover:opacity-95">
      <article className="flex justify-between items-center border-b p-4 border-b-zinc-200">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {author.profilePic ? (
              <img
                src={author.profilePic}
                alt={author.name || author.username || "author"}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-sm text-white">
                {author.name ? author.name.charAt(0).toUpperCase() : (author.username ? author.username.charAt(0).toUpperCase() : "U")}
              </div>
            )}

            <div>
              <div className="font-semibold">{author.name || author.username || "Unknown"}</div>
              {author.username && <div className="text-sm text-gray-500">@{author.username}</div>}
            </div>
          </div>

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
  );
};

export default BlogCard;
