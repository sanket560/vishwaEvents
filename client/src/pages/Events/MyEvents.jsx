import React, { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import { useAuth } from "../../store/auth";
import {useNavigate} from 'react-router-dom'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { isLoggedIn } = useAuth();
  const storedToken = localStorage.getItem('token');

  const navigate = useNavigate()
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/myevent`, {
      headers: {
        'Authorization': `Bearer ${storedToken}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setEvents(data.myEvent || []);
        setLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching events:', error.message);
      });
  }, [storedToken]);

  const formatDate = inputDate => {
    const date = new Date(inputDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className='md:max-w-[1220px] mx-auto pt-10 md:py-20'>
        <div className='flex md:flex-wrap overflow-x-auto gap-3'>
          {[...Array(4)].map((_, index) => (
            <div key={index} className='w-[290px] rounded-md border'>
              <Skeleton height={250} />
              <div className='p-4'>
                <Skeleton height={20} width='80%' />
                <Skeleton height={20} width='60%' />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className='h-screen flex flex-col items-center justify-center'>
        <h1 className='text-3xl font-bold text-gray-700'>
          You haven't posted any event yet.
        </h1>
        <Link to='/hostevent'>
          <li className='px-4 text-xl bg-gray-300 font-bold text-gray-700 mt-3 rounded-lg flex items-center gap-2 py-2 cursor-pointer'>
            Host Event <IoMdAdd />
          </li>
        </Link>
      </div>
    );
  }

  return (
    <div className='md:max-w-[1220px] mx-auto pt-10 md:py-20 mt-20 min-h-screen'>
      <div className='flex md:flex-wrap overflow-x-auto gap-3'>
        {events.map(event => (
          <Link to={`/update/${event._id}`} key={event._id}>
          <div className='w-[290px] relative -z-20'>
                <img
                  src={event.poster}
                  alt='Event Poster'
                  className='h-[250px] w-full rounded-lg'
                />
                <div className='absolute right-0 top-0 p-4'>
                  <p className='mt-1 flex items-center bg-white rounded-lg gap-1 p-3 text-sm font-medium'>
                    <FaCalendarAlt /> {formatDate(event.event_date)}
                  </p>
                </div>
                <h1 className='text-lg mt-4 font-semibold '>{event.heading}</h1>
              </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyEvents;