import React, { useEffect, useEffectEvent, useState } from 'react'
import PostCard from '../components/PostCard'
import "../styles/PostCard.css";
import Api from "../services/api"
import { Navigate, useNavigate } from 'react-router-dom';

function Feed() {
 const navigate = useNavigate();
 const [post,setPost] = useState([])
 
 // getpost
  const getInfo = async () => {
    const res = await Api.get("/post/getpost");
    setPost(res.data);
  };

  useEffect(() => {
    getInfo();
  }, []);

  // getlikes
  const handleLike = async (postId) => {
  const token = localStorage.getItem("token");

  await Api.post(
    `/post/${postId}/likes`,
    {},
    { headers: { Authorization: token } }
  );

  getInfo(); // refresh feed
};

  return (
   <div>
  <PostCard onPostCreated={getInfo}/>

  {post.map((p) => (
    <div className="PostItem" key={p._id}>
      <div className="PostItemHeader">
        <div style={{display: "flex", gap: "8px"}}>
          
           <span> {/* Fallback Initial Avatar styling */}
              <div className="UserAvatar">
                {p.userId?.name?.charAt(0) || "U"}
              </div></span>

          <div><h3>
  {p.userId?.name || "User"}</h3>
        
          <span>
            {new Date(p.createdAt).toLocaleString()}
          </span></div>
        </div>
      </div>

      <p className="PostContent">
        {p.content}
      </p>

      {p.image?.url && (
        <img
          src={p.image.url}
          alt="post"
          className="PostImage"
        />
      )}

      <div className="PostActions">
        {/* <span>❤️ {p.likes?.length || 0}</span> */}
       <button style={{border: "none", background: "white"}} onClick={() => handleLike(p._id)}>
  ❤️ {p.likes?.length || 0}
</button>

       <button style={{border: "none", background: "white"}} onClick={() => navigate(`/post/comment/${p._id}`)}>
  💬 {p.comments?.length || 0}
</button>

        <span>🔗 Share</span>
      </div>
    </div>
  ))}
</div>
  )
}

export default Feed
