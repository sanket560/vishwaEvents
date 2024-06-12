import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-phone-input-2/lib/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase/Firebase";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    phone: "",
    collegeEmail: "",
    email: "",
    collegeName: "",
    department: "",
    password: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [verified, setVerified] = useState(null);
  const [otp, setOtp] = useState("");
  const phonenumber = `+91${user.phone}`;

  const sendOtp = async () => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
      const confirmation = await signInWithPhoneNumber(
        auth,
        phonenumber,
        recaptcha
      );
      setVerified(confirmation);
      toast.success(`OTP sent to ${phonenumber}`);
      setShowModal(true);
    } catch (error) {
      console.log(error);
      toast.error("failed to send otp")
    }
  };

  const verifyOtp = async () => {
    try {
      setVerificationInProgress(true);
      await verified.confirm(otp);
      setShowModal(false);
      toast.success("Verification successful");
      await registerUser();
    } catch (error) {
      toast.error("Invalid OTP")
      console.log(error);
    }
  };
  
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (verified) {
        await registerUser();
      } else {
        await sendOtp();
      }
    } catch (error) {
      console.log("register", error);
    }
  };
  
  const registerUser = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
  
      const res_data = await response.json();
      if (response.ok) {
        setUser({
          name: "",
          phone: "",
          collegeEmail: "",
          email: "",
          collegeName: "",
          department: "",
          password: "",
        });
        navigate("/login");
        toast.success("Register Successful");
      } else {
        toast.error(
          res_data.extraDetails ? res_data.extraDetails : res_data.message
        );
      }
    } catch (error) {
      console.log("register", error);
    }
  };

  return (
    <section>
      <div className='mt-24 px-4 min-h-screen sm:px-6 lg:px-8'>
        <div className='md:w-[800px] mx-auto'>
          <h2 className='text-center text-2xl font-bold leading-tight text-black'>
            Sign up to create account
          </h2>
          <p className='mt-2 text-center text-base text-gray-600'>
            Already have an account?{" "}
            <Link
              to='/login'
              title=''
              className='font-medium text-black transition-all duration-200 hover:underline'
            >
              Sign In
            </Link>
          </p>
          <form onSubmit={handleSubmit} className='mt-8'>
            <div className='space-y-5'>
              <div id='recaptcha'></div>
              <div className='flex items-center justify-between gap-4 md:flex-row flex-col'>
                <div className='w-full'>
                  <label
                    htmlFor='name'
                    className='text-base font-medium text-gray-900'
                  >
                    {" "}
                    Full Name{" "}
                  </label>
                  <div className='mt-2'>
                    <input
                      className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                      type='text'
                      id='name'
                      name='name'
                      value={user.name}
                      onChange={handleInput}
                      required
                      autoComplete='off'
                      placeholder='Full Name'
                    ></input>
                  </div>
                </div>
                <div className='w-full'>
                  <label
                    htmlFor='phone'
                    className='text-base font-medium text-gray-900'
                  >
                    {" "}
                    Phone Number{" "}
                  </label>
                  <div className='mt-2 flex flex-col md:flex-row gap-2 items-center'>
                  <input
                      className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                      type='text'
                      id='phone'
                      name='phone'
                      value={user.phone}
                      onChange={handleInput}
                      required
                      autoComplete='off'
                      placeholder='Phone Number'
                    ></input>
                    <button
                      onClick={sendOtp}
                      className='min-w-fit bg-blue-400 text-white rounded-md px-3 py-2'
                    >
                      send otp
                    </button>
                    {/* Modal for OTP verification */}
                    {showModal && (
                      <div className='fixed inset-0 flex items-center justify-center z-50'>
                        <div className='absolute inset-0 bg-gray-900 opacity-75'></div>
                        <div className='relative bg-white rounded-lg p-8 m-4'>
                          <button
                            className='absolute top-0 right-0 p-2'
                            onClick={() => setShowModal(false)}
                          >
                            <svg
                              className='h-6 w-6 text-gray-700'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M6 18L18 6M6 6l12 12'
                              ></path>
                            </svg>
                          </button>
                          <input
                            type='text'
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className='mb-4 border rounded-md mt-3 p-2 w-full focus:outline-none'
                          />
                          <button
                            disabled={verificationInProgress}
                            onClick={verifyOtp}
                            className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md'
                          >
                            Verify OTP
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-between gap-4 md:flex-row flex-col'>
                <div className='w-full'>
                  <label
                    htmlFor='collegeEmail'
                    className='text-base font-medium text-gray-900'
                  >
                    {" "}
                    College Email{" "}
                  </label>
                  <div className='mt-2'>
                    <input
                      className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                      type='text'
                      id='collegeEmail'
                      name='collegeEmail'
                      value={user.collegeEmail}
                      onChange={handleInput}
                      required
                      autoComplete='off'
                      placeholder='12345678@vupune.ac.in'
                    ></input>
                  </div>
                </div>
                <div className='w-full'>
                  <label
                    htmlFor='email'
                    className='text-base font-medium text-gray-900'
                  >
                    {" "}
                    Email address{" "}
                  </label>
                  <div className='mt-2'>
                    <input
                      className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                      type='email'
                      id='email'
                      name='email'
                      value={user.email}
                      onChange={handleInput}
                      required
                      autoComplete='off'
                      placeholder='user@gmail.com'
                    ></input>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor='collegeName'
                  className='text-base font-medium text-gray-900'
                >
                  {" "}
                  College Name{" "}
                </label>
                <div className='mt-2'>
                  <input
                    className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                    type='text'
                    id='collegeName'
                    name='collegeName'
                    value={user.collegeName}
                    onChange={handleInput}
                    required
                    autoComplete='off'
                    placeholder='College Name'
                  ></input>
                </div>
              </div>
              <div>
                <label
                  htmlFor='department'
                  className='text-base font-medium text-gray-900'
                >
                  {" "}
                  Department{" "}
                </label>
                <div className='mt-2'>
                  <input
                    className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                    type='text'
                    id='department'
                    name='department'
                    value={user.department}
                    onChange={handleInput}
                    required
                    autoComplete='off'
                    placeholder='Department Name'
                  ></input>
                </div>
              </div>
              <div>
                <div className='flex items-center justify-between'>
                  <label
                    htmlFor='password'
                    className='text-base font-medium text-gray-900'
                  >
                    {" "}
                    Password{" "}
                  </label>
                </div>
                <div className='mt-2'>
                  <input
                    className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                    type='password'
                    id='password'
                    name='password'
                    value={user.password}
                    onChange={handleInput}
                    required
                    autoComplete='off'
                    placeholder='Password'
                  ></input>
                </div>
              </div>
              <div>
                <button
                  type='submit'
                  className='inline-flex w-full items-center justify-center rounded-md  text-white bg-[#4285f4] hover:bg-[#6f9eff] px-3.5 py-2.5 font-semibold leading-7'
                >
                  Create Account
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
