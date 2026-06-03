import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css"

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
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
    e.preventDefault();

    try {
      SetLoading(true)
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        form
      );
      console.log(res.data);

      setForm({
        name: "",
        email: "",
        password: ""
      });

      navigate("/login")

    } catch (error) {
      alert(error.response?.data?.msg || "Registration Failed");
    } finally {
      SetLoading(false)
    }
  };

  return (
    <div className="AuthPage">
      <form onSubmit={handleSubmit} className="AuthForm">
        <h2>Register with Task Planet</h2>


<p>
  Create your account and start using the amazing
  tools available on the platform.
</p>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

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

export default Signup;