import React from "react";

const NewsLetter = () => {
  return (
    <div className='mx-auto mt-3 max-w-7xl px-2 lg:px-8'>
      <div className='relative isolate overflow-hidden px-4 py-10 rounded-2xl sm:rounded-3xl sm:px-24 xl:py-32'>
        <h2 className='mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight sm:text-4xl'>
          Register for our Events
        </h2>

        <p className='mx-auto mt-2 max-w-xl text-center text-lg leading-8 '>
          Don't miss out on exciting events! Sign up now to reserve your spot
          and stay updated with all the latest event details and announcements.
        </p>

        <form className='mx-auto mt-10 flex max-w-md gap-x-4'>
          <label className='sr-only'>
            Email address
          </label>
          <input
            id='email-address'
            name='email'
            type='email'
            required=''
            className='w-full px-5 py-3 text-base leading-6 transition duration-150 ease-in-out border-2 rounded-md appearance-none focus:outline-none sm:max-w-xs border-gray-200 text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 bg-white'
            placeholder='Enter your email'
          />

          <button
            type='submit'
            className='flex-none rounded-md px-3.5 py-2.5 text-sm font-semibold text-white bg-[#4285f4] hover:bg-[#6f9eff] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
          >
            Notify me
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsLetter;
