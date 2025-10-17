import { useEffect, useState } from "react";
import fetcherClient from "../../../utils/fetcherClient";
import showToast from "../../../utils/showToast";
import ButtonPrimary from "../../../components/ui/ButtonPrimary";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    const setFromLocal = (parsed) => {
      const normalized = { ...parsed, id: parsed.id || parsed._id };
      setUser(normalized);
      setName(normalized.name || "");
      setBio(normalized.bio || "");
    };

    const fetchCanonicalUserAndBlogs = async () => {
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw);
      const userId = parsed.id || parsed._id;
      if (!userId) return setFromLocal(parsed);

      if (token) {
        try {
          const res = await fetcherClient.get(`/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          const canonical = res?.data || null;
          if (canonical) {
            const normalized = { ...canonical, id: canonical.id || canonical._id };
            setUser(normalized);
            setName(normalized.name || "");
            setBio(normalized.bio || "");
            localStorage.setItem("user", JSON.stringify(normalized));
          } else {
            setFromLocal(parsed);
          }

          setLoadingBlogs(true);
          const bRes = await fetcherClient.get(`/user/${userId}/blogs`, { headers: { Authorization: `Bearer ${token}` } });
          setBlogs((bRes?.data && (bRes.data.blogs || bRes.data)) || []);
          return;
        } catch (err) {
          console.error("Failed to fetch protected user/blogs:", err);
          // fallback to public fetch below
        } finally {
          setLoadingBlogs(false);
        }
      }

      setFromLocal(parsed);
      try {
        setLoadingBlogs(true);
        const bRes = await fetcherClient.get(`/user/public/${userId}/blogs`);
        setBlogs((bRes?.data && (bRes.data.blogs || bRes.data)) || []);
      } catch (err2) {
        console.error("Failed to fetch public blogs fallback:", err2);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchCanonicalUserAndBlogs();
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, []);

  const handleSave = async () => {
    if (!user || !user.id) return showToast("No user data", "error");

    try {
      const token = localStorage.getItem("token");
      const res = await fetcherClient.put(`/user/${user.id}`, { name, bio }, { headers: { Authorization: `Bearer ${token}` } });
      const updated = res.data;

      const normalized = { ...updated, id: updated.id || updated._id };
  localStorage.setItem("user", JSON.stringify(normalized));
  try { window.dispatchEvent(new CustomEvent('user-updated')) } catch(e){}
  setUser(normalized);

      showToast("Profile updated", "success");
    } catch (err) {
      console.error(err);

      try {
        const token = localStorage.getItem("token");
        if (token && user?.id) {
          const check = await fetcherClient.get(`/user/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
          const canonical = check.data;
          if (canonical) {
            const normalized = { ...canonical, id: canonical.id || canonical._id };
            localStorage.setItem("user", JSON.stringify(normalized));
            setUser(normalized);
            showToast("Profile updated", "success");
            return;
          }
        }
      } catch (fetchErr) {
        console.error('Fallback GET /user/:id failed:', fetchErr);
      }

      const msg = err?.response?.data?.message || err.message || "Failed to update profile";
      showToast(msg, "error");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user || !user.id) return showToast("No user data", "error");

    try {
      if (preview) URL.revokeObjectURL(preview);
    } catch {}
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const res = await fetcherClient.post(`/user/${user.id}/profile-picture`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = res.data;
      const normalizedUpdated = { ...updatedUser, id: updatedUser.id || updatedUser._id };
      const newUser = { ...user, ...normalizedUpdated };
  localStorage.setItem("user", JSON.stringify(newUser));
  try { window.dispatchEvent(new CustomEvent('user-updated')) } catch(e){}
  setUser(newUser);

      showToast("Profile picture updated", "success");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || "Failed to upload profile picture";
      showToast(msg, "error");
    } finally {
      setUploading(false);
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showToast("Logged out", "default");
    navigate("/login");
  };

  if (!user) return <div className="p-6">No user data. Please login.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

      <div className="flex items-center gap-6 mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-2xl text-gray-700">
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : user?.profilePic ? (
            <img src={user.profilePic} alt={user.name || user.username} className="w-full h-full object-cover" />
          ) : (
            (user.name || user.username || "U").charAt(0).toUpperCase()
          )}
        </div>

        <div>
          <div className="mb-2 font-semibold">{user.name || user.username}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
          {user.bio && <div className="mt-2 text-gray-700">{user.bio}</div>}
        </div>
      </div>

      <div className="block mb-4">
        <span className="block text-sm font-medium mb-1">Change profile picture</span>

        <div
          className="mt-2 p-6 border-2 border-dashed rounded-lg border-gray-300 bg-white cursor-pointer flex flex-col items-center justify-center text-center"
          onClick={() => document.getElementById("profile-file-input").click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFileChange({ target: { files: [file] } });
          }}
        >
          <div className="mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h10a4 4 0 004-4v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l3-3 2 2 4-4 3 3" />
            </svg>
          </div>

          <div className="text-sm text-gray-600">Drag & drop an image here, or click to select a file</div>
          <div className="text-xs text-gray-400 mt-2">Supports JPG, PNG, GIF</div>
          <input id="profile-file-input" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>

        {uploading && <div className="text-sm text-gray-500 mt-2">Uploading...</div>}
      </div>

      <label className="block mb-4">
        <span className="block text-sm font-medium mb-1">Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-200 p-2 rounded outline-none" />
      </label>

      <label className="block mb-4">
        <span className="block text-sm font-medium mb-1">Bio</span>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-zinc-200 p-2 rounded outline-none" rows={4} />
      </label>

      <div className="mt-4">
        <div className="flex gap-4">
          <ButtonPrimary buttonText="Save changes" onClickHandler={handleSave} />
          <button onClick={handleLogout} className="px-4 py-2 rounded bg-red-500 text-white hover:opacity-90">Logout</button>
        </div>
      </div>

      <section className="mt-8">
        <h3 className="text-xl font-semibold mb-3">Your stories</h3>
        {loadingBlogs ? (
          <div className="text-sm text-gray-500">Loading stories...</div>
        ) : blogs.length === 0 ? (
          <p className="text-gray-600">You haven't published any stories yet.</p>
        ) : (
          <div className="space-y-4">
            {blogs.map((b) => (
              <div key={b._id} className="p-4 border-b border-b-zinc-200 hover:bg-gray-50 flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="w-xs mb-4"><img src={b.bannerImage} alt="" /></div>
                  <div className="font-semibold">{b.title}</div>
                  <div className="text-sm text-gray-500 mt-1">{new Date(b.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:opacity-90"
                    onClick={async () => {
                      if (!confirm('Delete this story? This action cannot be undone.')) return;
                      try {
                        const token = localStorage.getItem('token');
                        await fetcherClient.delete(`/blogs/${b._id}`, { headers: { Authorization: `Bearer ${token}` } });
                        setBlogs((prev) => prev.filter((x) => x._id !== b._id));
                        showToast('Story deleted', 'default');
                      } catch (err) {
                        console.error('Failed to delete blog:', err);
                        showToast(err?.response?.data?.message || 'Delete failed', 'error');
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;