const Post = require("../models/Post");
const User = require("../models/User")

// create post
exports.createPost = async (req, res) => {
  try {

     console.log("FILE:", req.file);

    const { content, image } = req.body;
    
    // for string image
//     if (!content?.trim() && !image?.trim()) {
//   return res.status(400).json({
//     msg: "Post must contain content or image"
//   });
// }
   
// for file image
if (!content?.trim() && !req.file) {
  return res.status(400).json({
    msg: "Post must contain content or image"
  });
}

    const post = await Post.create({
  userId: req.user.id,
  content: content?.trim() || "",
  image: req.file
    ? {
        url: req.file.path,
        public_id: req.file.filename
      }
    : undefined,
});

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// get all post
exports.getPost = async (req,res) => {
    try{
  const posts = await Post.find()
  .populate("userId", "name")
  .sort({ createdAt: -1 });

  res.status(200).json(posts)
    } catch(error) {
 res.status(500).json({ msg: error.message });
    }
}

// like post
exports.likePost = async (req, res) => {
  try {

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === req.user.id
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user.id
      );
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();

    res.status(200).json( {
       likesCount: post.likes.length,
  liked: !alreadyLiked

    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// comment post
exports.commentPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized user" });
    }

    const user = await User.findById(req.user.id);
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    post.comments.push({
      userId: user._id,
      name: user.name,
      text
    });

    await post.save();

    res.status(201).json(post); // better for frontend update
  } catch (error) {
    console.log("COMMENT ERROR:", error); // 🔥 IMPORTANT
    res.status(500).json({ msg: error.message });
  }
};