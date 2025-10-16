import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import InputField from '../../../components/ui/InputField'
import ButtonPrimary from '../../../components/ui/ButtonPrimary'
import showToast from '../../../utils/showToast'
import fetcherClient from '../../../utils/fetcherClient'
import eraseInput from '../../../utils/eraseInput'

const RegisterPage = () => {
  const USERNAME_REGEX = /^[a-zA-Z0-9_]{2,30}$/;
  const PASSWORD_REGEX = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [username, setUsername] = useState("");
  const [usernameValidated, setUsernameValidated] = useState(false);

  const [email, setEmail] = useState("");
  const [emailValidated, setEmailValidated] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordValidated, setPasswordValidated] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setUsernameValidated(USERNAME_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setEmailValidated(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setPasswordValidated(PASSWORD_REGEX.test(password));
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!usernameValidated) {
      showToast("Invalid username. It should be 2-30 characters long and can include letters, numbers, and underscores only.", "error");
      return;
    } else if (!emailValidated) {
      showToast("Invalid email format.", "error");
      return;
    } else if (!passwordValidated) {
      showToast("Weak password. It should be at least 8 characters long and include at least one letter, one number, and one special character.", "error");
      return;
    } else {
      try {
        const response = await fetcherClient.post("/auth/register", {
          name: firstName + " " + lastName,
          email,
          username,
          password,
        });
        
        console.log(response);

        eraseInput(setFirstName, setLastName, setEmail, setUsername, setPassword);
        showToast("User registered successfully!", "default", 3000);
        setTimeout(() => navigate("/login"), 3000);
      } catch (error) {
        if (!error?.response) {
          showToast("No server response!", "error");
        } else if (error.response?.status === 409) {
          showToast("Username or email already in use!", "error");
        } else {
          showToast("Uncaught error", "error");
        }
      }
    }
  }

  return (
    <div className='flex flex-col gap-6 w-[80%] max-w-[520px]'>
      <div className='mb-8'>
        <h2 className='text-2xl'>Create an Account</h2>
        <h3 className='text-md text-zinc-400'>Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log in</Link></h3>
      </div>

      <form className='flex flex-col gap-4 mb-6'>
        <div className='flex gap-4'>
            <InputField type="text" placeholder="First Name" value={firstName} onChangeHandler={(e) => setFirstName(e.target.value)} />
            <InputField type="text" placeholder="Last Name" value={lastName} onChangeHandler={(e) => setLastName(e.target.value)} />
        </div>
        <InputField type="text" placeholder="Username" value={username} onChangeHandler={(e) => setUsername(e.target.value)} />
        <InputField type="email" placeholder="Email" value={email} onChangeHandler={(e) => setEmail(e.target.value)} />
        <InputField type="password" placeholder="Password" value={password} onChangeHandler={(e) => setPassword(e.target.value)} />
      </form>

      <ButtonPrimary buttonText="Create Account" onClickHandler={handleSubmit} />
      <ToastContainer />
    </div>
  )
}

export default RegisterPage
