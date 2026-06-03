const {createPost, getPost, likePost, commentPost} = require("../controllers/PostController")
const authMiddleware = require("../middleware/AuthMiddleware")
const upload = require("../middleware/uploadMiddleware");

const express = require('express');
const router = express.Router();

router.post("/createpost", authMiddleware,upload.single("image"), createPost);
router.get("/getpost", getPost)
router.post("/:postId/likes", authMiddleware, likePost)
router.post("/:postId/comments", authMiddleware, commentPost)

module.exports = router;
