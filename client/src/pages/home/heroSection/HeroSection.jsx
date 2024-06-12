import React, {useState, useEffect } from 'react'
import { useAuth } from '../../../store/auth';

const linearGradient = {
  backgroundImage: `linear-gradient(
    20deg,
    hsl(220deg 27% 98%) 4%,
    hsl(219deg 70% 95%) 24%,
    hsl(218deg 81% 91%) 33%,
    hsl(216deg 86% 88%) 41%,
    hsl(215deg 89% 84%) 48%,
    hsl(214deg 90% 80%) 55%,
    hsl(223deg 93% 84%) 62%,
    hsl(237deg 92% 87%) 70%,
    hsl(257deg 85% 87%) 78%,
    hsl(278deg 74% 86%) 88%,
    hsl(301deg 63% 84%) 100%
  )`,
};

const HeroSection = () => {
  const { user, isLoggedIn } = useAuth();

  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    if (isLoggedIn && user && user.message && user.message.name) {
      setFirstName(getFirstName(user.message.name));
    } else {
      setFirstName('');
    }
  }, [isLoggedIn, user]);

  const getFirstName = (fullName) => {
    if (!fullName) return '';
    const firstName = fullName.split(' ')[0];
    return firstName;
  };

  return (
    <div className='p-3 mt-16 md:mt-0' style={{ ...linearGradient }}>
      <div className='md:w-3/4 flex flex-col md:items-center justify-center mx-auto h-[50vh] md:h-[100vh]'>
        {isLoggedIn && user && user.message && user.message.name ? (
          <p className='text-4xl font-bold md:text-5xl mb-4'>Welcome, {firstName}!</p>
        ) : null}
        <p className='text-3xl font-bold md:text-6xl'>Explore What's Happening Near You</p>
        <p className='mt-2 md:mt-4 md:text-center text-lg'>
          Join fellow students in exciting activities that enrich your university experience.
        </p>
      </div>
    </div>
  );
};

export default HeroSection;