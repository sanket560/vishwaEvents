import { FaFacebook , FaInstagram , FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import React from 'react'

const Footer = () => {
  return (
    <footer className='py-6 border border-b-0 bg-white flex-shrink-0'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col'>
            <h2 className='font-bold text-xl'>VishwaEvents</h2>
            <Link to='/contact'>
              <span className='text-lg pb-3 font-semibold text-gray-800 hover:text-gray-900'>
                Contact
              </span>
            </Link>
          </div>
          <div className='flex text-xl space-x-4'>
            <FaFacebook />
            <FaXTwitter />
            <FaInstagram />
            <FaLinkedinIn />
          </div>
        </div>
      </div>
      {/* <hr className='my-2' />
      <p className='text-center md:text-lg mt-2'>
        Developed and Maintained by Revolution Software Development Club, VU
      </p> */}
    </footer>
  );
}

export default Footer;

