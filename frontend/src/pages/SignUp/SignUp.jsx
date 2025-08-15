import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import PasswordInput from '../../components/Input/PasswordInput';
import Button from '../../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance'
import { useEffect } from 'react';

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value)
  }

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleName = (e) => {
    setName(e.target.value);
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if(!name) {
      setError("Please enter your name");
      return;
    }

    if(!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if(!password) {
      setError("Please enter your password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name, email: email, password: password
      });

      if(response.data && response.data.error) {
        setError(response.data.error);
      }

      if(response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error ocurred. Please try again.");
      }
    }
  }

  useEffect(() => {

  }, [])

  return (
    <>
      <div className='flex items-center justify-center mt-28 text-white'>
        <div className='w-96 rounded bg-color-2 px-7 py-10'>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl mb-7'>SignUp</h4>
            <input type="text" placeholder='Name' className='input-box mb-3' value={name} onChange={handleName} />
            <input type="text" placeholder='Email' className='input-box' value={email} onChange={handleEmail} />
            <PasswordInput value={password} onChange={handlePassword} />
            {error && (
              <p className='text-red-500 text-xs pb-1'>
                {error}
              </p>
            )}
            <Button content={"SignUp"} />
            <p className='text-sm text-center mt-4'>
              Already have an account?{" "}
              <Link to="/login" className='font-medium underline text-blue-400'>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp