import React , {useState , useEffect} from "react";
import noresult from "../../../Images/no-results.png"
import { useAuth } from "../../../store/auth";
import { Link } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UpComingEvents = () => {
  const { events, setEvents,getEvents } = useAuth(); 
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    getEvents()
  },[events,setEvents,getEvents])

  useEffect(() => {
    if (Array.isArray(events) && events.length > 0) {
      const today = new Date();
      const futureEvents = events.filter(event => new Date(event.event_date) > today);
      setUpcomingEvents(futureEvents);
      setLoading(false);
    }
  }, [events,setEvents,getEvents]);

  const formatDate = inputDate => {
    const date = new Date(inputDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className='md:max-w-[1220px] mx-auto mt-4'>
      <h2 className='text-3xl font-semibold mb-2 text-center py-4'>
        Upcoming Events
      </h2>
      <div className='flex md:flex-wrap overflow-x-auto gap-3'>
        {loading ? ( // Render skeleton loader when loading is true
          <>
            {[...Array(4)].map((_, index) => (
              <div key={index} className='flex flex-col -z-50'>
                <Skeleton width={290} height={250} />
                <Skeleton width={200} count={2} />
              </div>
            ))}
          </>
        ) : upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <Link to={`/events/${event._id}`} key={event._id}>
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
          ))
        ) : (
          <div className='flex flex-col justify-center items-center'>
            <p>No upcoming events. Stay tuned for updates!</p>
            <img className='w-96' src={noresult} alt='No Result' />
          </div>
        )}
      </div>
    </div>
  );
};

export default UpComingEvents;