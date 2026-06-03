import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../services/api"

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
    const [loading,SetLoading] = useState(false)

   const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {

    SetLoading(true)
    e.preventDefault();

    console.log("button clicked")

    try {
      console.log("2. before axios");
      const res = await Api.post(
        "/auth/login",
        form
      ); 

        console.log("3. axios success");

      localStorage.setItem(
        "token",
        res.data.token
      );

     
      navigate("/feed")

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.msg || "Loading Failed");
    } finally {
      SetLoading(false)
    }
  };

  return (
    <div className="AuthPage">
      <form onSubmit={handleSubmit} className="AuthForm">
         <h2>Login with Task Planet</h2>
        
         <p>
      Login to access your account and continue
      using the amazing tools available on the platform.
    </p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">
           { loading ? "Loading" : "Register" }
        </button>
      </form>
    </div>
  );
};

export default Login;