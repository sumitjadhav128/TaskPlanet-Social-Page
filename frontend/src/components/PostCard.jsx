import { useState } from "react";
import axios from "axios";
import ImageIcon from "../assets/ImageIcon";

const PostCard = ({onPostCreated}) => {
  const [form, setForm] = useState({
    content: "",
    image: ""
  });

  const canPost =
  form.content.trim().length > 0 || form.image;

  const InputChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };
 
  // image handle
 const handleImageClick = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setForm((prev) => ({
    ...prev,
    image: file
  }));
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!canPost) {
    return alert("One field is mandatory");
  }

  try {
    const token = localStorage.getItem("token");

    //  IMPORTANT: use FormData instead of JSON
    const formData = new FormData();
    formData.append("content", form.content);

    // image is a FILE (not string)
    if (form.image) {
      formData.append("image", form.image);
    }

    const res = await axios.post(
      "http://192.168.244.196:5000/api/post/createpost",
      formData,
      {
        headers: {
          Authorization: token
          // DO NOT set Content-Type manually
        }
      }
    );

    console.log("Created:", res.data);

    setForm({
      content: "",
      image: null
    });

    onPostCreated(); // refresh feed

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.msg || "Failed to create post");
  }
};

  return (
    <form onSubmit={handleSubmit} id="PostForm">
      <div className="PostCard-Layout">
        <div className="PostCard">
          <h3 className="PostHead">Create Post</h3>

          <textarea
            name="content"
            placeholder="What's on your mind?"
            value={form.content}
            onChange={InputChange}
          />
          
          <input
  type="file"
  id="imageInput"
  style={{ display: "none" }}
  onChange={handleImageClick}
/>

          <div className="bottomContent">
            <div
              style={{
                color: "rgb(0, 122, 255)",
                cursor: "pointer"
              }}
              onClick={() => document.getElementById("imageInput").click()}
            >
              <ImageIcon />
            </div>

            <button
              type="submit"
              disabled={!canPost}
              className="post-btn"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostCard;