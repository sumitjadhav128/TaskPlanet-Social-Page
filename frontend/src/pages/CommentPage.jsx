import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Api from "../services/api";

function CommentPage() {
  const { postId } = useParams();

  const [allPosts, setAllPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [text, setText] = useState("");

  // 🔵 FETCH ALL POSTS (refetch method)
  const fetchPosts = async () => {
    const res = await Api.get("/post/getpost");
    setAllPosts(res.data);
  };

  const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1])).id;
  } catch {
    return null;
  }
};

const userId = getUserId();

  useEffect(() => {
    fetchPosts();
  }, []);

  console.log({ allPosts });

  // 🟣 FIND SINGLE POST
  useEffect(() => {
    if (!allPosts?.length) return;

    const found = allPosts.find((p) => p?._id === postId);

    setPost(found || null);
  }, [allPosts, postId]);

  console.log("post:- ", { post });

  // 🔴 ADD COMMENT (then refetch)
  const handleComment = async () => {
    const token = localStorage.getItem("token");

    await Api.post(
      `/post/${postId}/comments`,
      { text },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    fetchPosts(); // 🔥 refresh updated data
    setText("");
  };

  return (
    <div className="CommentPageContainer">
      {/* POST CARD */}
      {post && (
        <div className="PostItem">
          <div className="PostItemHeader">
            <div className="UserMetaLeft">
              {/* Fallback Initial Avatar styling */}
              <div className="UserAvatar">
                {post.userId?.name?.charAt(0) || "U"}
              </div>
              <div className="UserMetaTexts">
                <h3>{post.userId?.name || "User"}</h3>
                <span className="UserHandle">@{post.userId?.username || "username"}</span>
                <span className="PostTime">
                  {new Date(post.createdAt).toLocaleString([], {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
            <button className="FollowBtn">Follow</button>
          </div>

          <p className="PostContent">{post.content}</p>

          {post.image?.url && <img src={post.image.url} className="PostImage" alt="post" />}

          <div className="PostActions">
            {/* <span>❤️ {post.likes?.length || 0}</span> */}

            <span>
  {post.likes?.includes(userId) ? "❤️" : "🤍"} {post.likes?.length || 0}
</span>
            <span>💬 {post.comments?.length || 0}</span>
            <span>🔗 0</span>
          </div>
        </div>
      )}

      {/* COMMENTS CONTAINER */}

       <h3 style={{margin: "16px"}}>
      {post?.comments?.length ? "": "Be the first one to comment 🚀"}
    </h3>

      <div className="CommentsWrapper">
        {post?.comments?.map((c) => (
          <div key={c._id} className="CommentItem">
            <div className="CommentAvatar">
              {c.name?.charAt(0) || "U"}
            </div>
            <div className="CommentDetails">
              <div className="CommentUserHeader">
                <span className="CommentUserName">{c.name || "Anonymous"}</span>
                <span className="CommentUserHandle">@{c.username || "user"}</span>
              </div>
              <span className="CommentTime">
                {new Date(c.createdAt).toLocaleString([], {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
              <p className="CommentTextContent">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM INPUT BAR */}
      <div className="CommentInputStickyBar">
        <div className="CommentInputInner">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="CommentInputField"
          />
          <button 
            onClick={handleComment} 
            disabled={!text.trim()} 
            className="CommentSendBtn"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentPage;