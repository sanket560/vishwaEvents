import React,{useState,useEffect} from 'react'
import noresult from "../../../Images/no-results.png"
import { useAuth } from "../../../store/auth";
import { Link } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import Skeleton from 'react-loading-skeleton';

const PastEvents = () => {
  const { events } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false); 
  }, []);

  const renderEventCards = () => {
    if (loading) {
      return (
        <>
          {[...Array(4)].map((_, index) => (
            <div key={index} className='w-[290px] rounded-md border'>
              <Skeleton height={250} />
              <div className='p-4'>
                <Skeleton height={20} width='80%' />
                <Skeleton height={20} width='60%' />
              </div>
            </div>
          ))}
        </>
      );
    }

    if (!Array.isArray(events)) {
      return (
        <div className='flex flex-col justify-center items-center'>
          <p>No Past events</p>
          <img src={noresult} alt='No Result' />
        </div>
      );
    }

    const pastEvents = events.filter((currentEvent) => {
      const today = new Date();
      const eventDate = new Date(currentEvent.event_date);
      return eventDate < today;
    });

    if (pastEvents.length === 0) {
      return (
        <div className='flex flex-col justify-center items-center'>
          <p>No Past events</p>
          <img className='w-96' src={noresult} alt='No Result' />
        </div>
      );
    }

    const formatDate = (inputDate) => {
      const date = new Date(inputDate);
      const options = { day: "numeric", month: "long", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
    };

    return pastEvents.map((currentEvent) => (
      <Link to={`/events/${currentEvent._id}`} key={currentEvent._id}>
        <div className='w-[290px] relative -z-20'>
          <img
            src={currentEvent.poster}
            alt='Event Poster'
            className='h-[250px] w-full rounded-lg'
          />
          <div className='absolute right-0 top-0 p-4'>
            <p className='mt-1 flex items-center bg-white rounded-lg gap-1 p-3 text-sm font-medium'>
              <FaCalendarAlt /> {formatDate(currentEvent.event_date)}
            </p>
          </div>
          <h1 className='text-lg mt-4 font-semibold '>
            {currentEvent.heading}
          </h1>
          <p className='text-red-600'>Registration Closed</p>
        </div>
      </Link>
    ));
  };
  
  return (
    <div className='md:max-w-[1220px] mx-auto mt-4'>
      <h2 className='text-3xl font-semibold mb-2 py-4 text-center'>Past Events</h2>
      <div className='flex md:flex-wrap overflow-x-auto gap-3'>
        {renderEventCards()}
      </div>
    </div>
  );
};

export default PastEvents;