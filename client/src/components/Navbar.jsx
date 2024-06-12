import React, { useState, useEffect } from "react";
import {
  BookOpenIcon,
  XMarkIcon,
  Bars3BottomRightIcon,
} from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { useAuth } from "../store/auth";
import { FiUser } from "react-icons/fi";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <div className='shadow-md w-full fixed top-0 left-0'>
      <div className='flex items-center justify-between bg-white py-4 md:px-10 px-7'>
        <div className='font-bold text-2xl cursor-pointer flex items-center gap-1'>
          <BookOpenIcon className='w-7 h-7 text-[#4285f4]' />
          <Link to='/'>
            <span>VishwaEvents</span>
          </Link>
        </div>
        <div className='flex items-center'>
          {showModal && (
            <RegistrationModal
              showModal={showModal}
              setShowModal={setShowModal}
            />
          )}
          <div className='flex items-center relative'>
            {isLoggedIn ? (
              <>
                <FiUser
                  className='w-7 h-7 cursor-pointer mx-2 md:mx-3'
                  onClick={() => setOpen(!open)}
                />
                {open && (
                  <ul
                    className={`absolute w-36 right-0 top-12 bg-white shadow-md py-2 rounded-md ${
                      open ? "block" : "hidden"
                    }`}
                  >
                    <Link to={"/hostevent"}>
                      <li className='px-4 flex items-center gap-2 py-2 cursor-pointer'>
                        Host Event <IoMdAdd />
                      </li>
                    </Link>
                    <Link to={"/myevents"}>
                      <li className='px-4 py-2 cursor-pointer'>My Events</li>
                    </Link>
                    <Link to={"/myticket"}>
                      <li className='px-4 py-2 cursor-pointer'>My Tickets</li>
                    </Link>
                    <Link to={"/logout"}>
                      <li className='px-4 py-2 cursor-pointer text-red-600'>
                        Logout
                      </li>
                    </Link>
                  </ul>
                )}
              </>
            ) : (
              <Link to='/login'>
                <button className='hidden md:block btn md:w-20 w-80 bg-[#4285f4] hover:bg-[#6f9eff] text-white md:ml-8 font-semibold px-3 py-1 rounded duration-500 md:static'>
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
        {!isLoggedIn && (
          <>
            <div
              onClick={() => setOpen(!open)}
              className='md:hidden cursor-pointer w-7 h-7'
            >
              {open ? <XMarkIcon /> : <Bars3BottomRightIcon />}
            </div>
            <ul
              className={`md:hidden md:items-center md:pb-0 py-3 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-100 ease-in ${
                open ? "top-14" : "top-[-490px]"
              }`}
            >
              <Link to='/login'>
                <button className='btn w-80 md:w-16 bg-[#4285f4] hover:bg-[#6f9eff] text-white md:ml-8 font-semibold px-3 py-1 rounded duration-100 md:static'>
                  login
                </button>
              </Link>
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
