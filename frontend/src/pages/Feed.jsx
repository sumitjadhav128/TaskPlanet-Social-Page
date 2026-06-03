import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import "../styles/PostCard.css";
import Api from "../services/api";
import { useNavigate } from "react-router-dom";

function Feed() {
  const navigate = useNavigate();
  const [post, setPost] = useState([]);

  //  get userId from token
  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch (err) {
      return null;
    }
  };

  const userId = getUserId();

  //  GET POSTS
  const getInfo = async () => {
    try {
      const res = await Api.get("/post/getpost");
      setPost(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  //  LIKE POST
  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");

    try {
      await Api.post(
        `/post/${postId}/likes`,
        {},
        {
          headers: { Authorization: token },
        }
      );

      getInfo(); // refresh posts
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <PostCard onPostCreated={getInfo} />

      {post.map((p) => (
        <div className="PostItem" key={p._id}>
          {/* HEADER */}
          <div className="PostItemHeader">
            <div style={{ display: "flex", gap: "8px" }}>
              <div className="UserAvatar">
                {p.userId?.name?.charAt(0) || "U"}
              </div>

              <div>
                <h3>{p.userId?.name || "User"}</h3>

                <span>
                  {new Date(p.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <p className="PostContent">{p.content}</p>

          {/* IMAGE */}
          {p.image?.url && (
            <img
              src={p.image.url}
              alt="post"
              className="PostImage"
            />
          )}

          {/* ACTIONS */}
          <div className="PostActions">
            {/* ❤️ LIKE BUTTON (FIXED) */}
            <button
              style={{
                border: "none",
                background: "white",
                cursor: "pointer",
              }}
              onClick={() => handleLike(p._id)}
            >
              {p.likes?.includes(userId) ? "❤️" : "🤍"}{" "}
              {p.likes?.length || 0}
            </button>

            {/* 💬 COMMENTS */}
            <button
              style={{
                border: "none",
                background: "white",
                cursor: "pointer",
              }}
              onClick={() =>
                navigate(`/post/comment/${p._id}`)
              }
            >
              💬 {p.comments?.length || 0}
            </button>

            <span>🔗 Share</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feed;