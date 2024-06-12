import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyTicket = () => {
  const [eventsData, setEventsData] = useState([]);
  const { events, isLoggedIn } = useAuth();
  const storedToken = localStorage.getItem("token");
  const todayDate = new Date(); 

  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/application/applicant`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch registered events: ${response.status}`
          );
        }

        const { applications } = await response.json();
        setEventsData(applications || []);
      } catch (error) {
        console.error(error.message);
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [storedToken]);

  const eventDataWithDetails = eventsData
    .map((eventData) => {
      const eventDetails = events.find(
        (event) => event._id === eventData.eventId
      );
      if (eventDetails) {
        const { heading, event_date, event_time, venue } = eventDetails;
        return {
          ...eventData,
          heading,
          event_date,
          event_time,
          venue,
        };
      } else {
        return null;
      }
    })
    .filter((eventData) => eventData !== null);

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (inputTime) => {
    try {
      const processedTime = inputTime.replace(/\s+/g, "").toUpperCase();
      const dummyDate = new Date(`2000-01-01T${processedTime}`);
      const options = { hour: "numeric", minute: "numeric", hour12: true };
      return dummyDate.toLocaleTimeString("en-US", options);
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid Time";
    }
  };

  const handleDelete = async (applicationId) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/application/${applicationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete application: ${response.status}`);
      }
      toast.success("Application Deleted");
      setEventsData((prevEventsData) =>
        prevEventsData.filter((event) => event._id !== applicationId)
      );
    } catch (error) {
      console.error("Error deleting application:", error.message);
    }
  };

  const downloadCertificate = (eventDate) => {
    const formattedEventDate = new Date(eventDate);
    if (formattedEventDate > todayDate) {
      toast.error("You will get a certificate once the event is over.");
    } else {
      toast.success("Certificate downloaded");
    }
  };

  return (
    <div className='container mx-auto px-4 py-8 flex mt-20 flex-col min-h-screen'>
      <h2 className='text-2xl font-bold mb-4'>My Registered Events</h2>
      <div className='overflow-x-auto'>
        <table className='table-auto w-full border-collapse border border-gray-200'>
          <thead>
            <tr>
              <th className='border border-gray-200 px-4 py-2'>Event</th>
              <th className='border border-gray-200 px-4 py-2'>Date</th>
              <th className='border border-gray-200 px-4 py-2'>Time</th>
              <th className='border border-gray-200 px-4 py-2'>Venue</th>
              {/* <th className='border border-gray-200 px-4 py-2'>Certificate</th> */}
              <th className='border border-gray-200 px-4 py-2'>Remove</th>
            </tr>
          </thead>
          <tbody>
            {eventDataWithDetails.map((eventData) => (
              <tr key={eventData._id}>
                <td className='border border-gray-200 px-4 py-2'>
                  {eventData.heading}
                </td>
                <td className='border border-gray-200 px-4 py-2'>
                  {formatDate(eventData.event_date)}
                </td>
                <td className='border border-gray-200 px-4 py-2'>
                  {formatTime(eventData.event_time)}
                </td>
                <td className='border border-gray-200 px-4 py-2'>
                  {eventData.venue}
                </td>
                {/* <td className='border border-gray-200 px-4 py-2'>
                  <button
                    onClick={() => downloadCertificate(eventData.event_date)}
                    className='font-bold py-2 px-4 rounded'
                  >
                    Download
                  </button>
                </td> */}
                <td className='border border-gray-200 px-4 py-2'>
                  <button
                    onClick={() => handleDelete(eventData._id)}
                    className='font-bold py-2 px-4 rounded'
                  >
                    <MdDelete className='text-2xl text-red-500 ' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyTicket;