import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Feed from "../pages/Feed";
import CommentPage from "../pages/CommentPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        
        <Route path="/" element={<Navigate to="/login" />} />

       
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      
        <Route path="/feed" element={<Feed />} />
        <Route path="/post/comment/:postId" element={<CommentPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;