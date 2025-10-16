import { Link } from "react-router-dom"
import ButtonPrimary from "../../../components/ui/ButtonPrimary"
import InputField from "../../../components/ui/InputField"
import { useState } from "react";
import showToast from "../../../utils/showToast";
import { useNavigate } from "react-router-dom";
import fetcherClient from "../../../utils/fetcherClient";
import { ToastContainer } from "react-toastify";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!username || !password) {
    showToast("All fields are required.", "error");
    return;
  }

  try {
    const response = await fetcherClient.post("/auth/login", {
      username,
      password,
    });

    console.log("Login Response:", response.data);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    showToast("Login successful!", "default", 3000);

    setTimeout(() => navigate("/"), 3000);
  } catch (error) {
    console.error("Login Error:", error);

    if (!error?.response) {
      showToast("No server response!", "error");
    } else if (error.response.status === 400) {
      showToast(error.response.data.message || "Invalid username or password!", "error");
    } else if (error.response.status === 500) {
      showToast("Server error! Try again later.", "error");
    } else {
      showToast("Something went wrong. Try again.", "error");
    }
  }
};

  return (
    <div className='flex flex-col gap-6 w-[80%] max-w-[520px]'>
      <div className='mb-8'>
        <h2 className='text-2xl'>Login to your account</h2>
        <h3 className='text-md text-zinc-400'>New to Inkstack? <Link  to="/register" className="text-blue-500 hover:underline">Register</Link></h3>
      </div>

      <form className='flex flex-col gap-4 mb-6'>
        <InputField type="text" placeholder="Username" value={username} onChangeHandler={(e) => setUsername(e.target.value)} />
        <InputField type="password" placeholder="Password" value={password} onChangeHandler={(e) => setPassword(e.target.value)} />
      </form>

      <ButtonPrimary buttonText="Login" onClickHandler={handleLogin} />
      <ToastContainer />
    </div>
  )
}

export default LoginPage
