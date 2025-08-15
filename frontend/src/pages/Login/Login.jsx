import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import Button from '../../components/Button'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleEmailInput = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordInput = (e) => {
        setPassword(e.target.value);
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        if(!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if(!password) {
            setError("Please enter your password");
            return;
        }

        setError("")

        try {
            const response = await axiosInstance.post("/login", {
                email: email, password: password
            });

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
  return (
    <>
        <div className='flex items-center justify-center mt-28'>
            <div className='w-96 rounded bg-color-2 px-7 py-10'>
                <form onSubmit={handleLogin}>
                    <h4 className='text-2xl mb-7'>Login</h4>
                    <input type="text" placeholder='Email' className='input-box' value={email} onChange={handleEmailInput} />
                    <PasswordInput value={password} onChange={handlePasswordInput} />
                    {error && (
                        <p className='text-red-500 text-xs pb-1'>
                            {error}
                        </p>
                    )}
                    <Button content={"Login"} />
                    <p className='text-sm text-center mt-4'>
                        Not registered yet?{" "}
                        <Link to="/signup" className='font-medium underline text-blue-400'>
                            Create an Account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    </>
  )
}

export default Login