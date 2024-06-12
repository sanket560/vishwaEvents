import React, { useState , useEffect} from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { CiEdit } from "react-icons/ci";
import { CiSaveDown1 } from "react-icons/ci";
import { toast } from 'react-toastify';
import { MdDelete } from "react-icons/md";
import {useNavigate} from "react-router-dom"
import { FaWpforms } from "react-icons/fa";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UpdateEvent = () => {
  const { eventId } = useParams();
  const { events, getEvents, isLoggedIn  } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const storedToken = localStorage.getItem('token');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    event_date: "",
    event_time: "",
    registration_end: "",
    registration_fees: "",
    prizes: "",
    venue: "",
    organizers: "",
  });

  const navigate = useNavigate()
  const eventDetails = events.find((event) => event._id === eventId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleEdit = () => {
    setShowUpdateModal(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/update/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Event details updated successfully")
        setIsEditing(false);
        getEvents();
      } else {
        toast.error("Failed to update event")
        // console.error("Failed to update event:", response);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleUpdateModal = () => {
    setShowUpdateModal(false);
    setIsEditing(true);
    setFormData({
      heading: eventDetails?.heading || "",
      description: eventDetails?.description || "",
      event_date: eventDetails?.event_date || "",
      event_time: eventDetails?.event_time || "",
      registration_end: eventDetails?.registration_end || "",
      registration_fees: eventDetails?.registration_fees || "",
      prizes: eventDetails?.prizes || "",
      venue: eventDetails?.venue || "",
      organizers: eventDetails?.organizers || "",
    });
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/delete/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });

      if (response.ok) {
        toast.success('Event deleted successfully');
        navigate("/myevents")
      } else {
        toast.error('Failed to delete event');
        // Handle error response
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      // Handle network errors
    }
  };
  
  if (!eventDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className='md:max-w-[1220px] mx-auto my-20 px-4'>
      <img
        src={eventDetails.banner}
        className='w-full bg-contain block mt-14 bg-center bg-no-repeat object-cover'
        alt=''
      />
      <div className='mt-6'>
        <div className='flex flex-col md:flex-row justify-between'>
          <h3 className='text-4xl font-semibold mt-3'>
            {isEditing ? (
              <input
                className='w-full border rounded-lg p-3 mt-2 focus:outline-none'
                type='text'
                name='heading'
                value={formData.heading}
                onChange={handleChange}
              />
            ) : (
              eventDetails.heading
            )}
          </h3>
          <div className='flex items-center gap-1 md:gap-3 mt-4'>
            <Link to={`/application/${eventId}`}>
              <button className='bg-green-600 text-sm text-white px-3 rounded-lg py-2 flex items-center justify-center gap-2'>
                <FaWpforms className='md:text-xl text-sm' />
                Applications
              </button>
            </Link>
            {isEditing ? (
              <button
                className='bg-green-600 text-sm flex items-center gap-2 px-4 py-1 text-white rounded-md '
                onClick={handleSave}
              >
                <CiSaveDown1 className='text-sm md:text-3xl cursor-pointer' />
                Save
              </button>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className='bg-yellow-400 text-sm text-white px-3 rounded-lg py-2 flex items-center justify-center gap-2'
                >
                  <CiEdit className='text-xl md:text-3xl' />
                  Edit
                </button>
                {showUpdateModal && (
                  <div className='fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'>
                    <div className='bg-white p-6 rounded-md'>
                      <p>You can edit everything except the poster or image</p>
                      <div className='flex justify-end'>
                        <button
                          className='bg-green-600 text-white mt-3 px-4 py-2 rounded-md'
                          onClick={handleUpdateModal}
                        >
                          ok
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <button
              onClick={handleDelete}
              className='bg-red-500 text-white px-2 rounded-lg py-2 flex items-center justify-center gap-2'
            >
              <MdDelete className='text-xl' />
              Delete
            </button>
          </div>
        </div>
        <p className='text-2xl mt-3 font-semibold'>About this event</p>
        <div className='my-2'>
          {isEditing ? (
            <textarea
              className='w-full h-40 border rounded-lg p-3 mt-2 focus:outline-none'
              name='description'
              value={formData.description}
              onChange={handleChange}
            />
          ) : (
            <p className='whitespace-pre-wrap'>{eventDetails.description}</p>
          )}
        </div>
        <div className='flex items-center gap-1'>
          {isEditing && (
            <>
              <p className='font-semibold'>Date : </p>
              <input
                className='border rounded-lg p-3 mt-2 focus:outline-none'
                type='date'
                name='event_date'
                value={formData.event_date}
                onChange={handleChange}
              />
            </>
          )}
        </div>
        <div className='flex items-center gap-1'>
          {isEditing && (
            <>
              <p className='font-semibold'>Time : </p>
              <input
                className='border rounded-lg p-3 mt-2 focus:outline-none'
                type='time'
                name='event_time'
                value={formData.event_time}
                onChange={handleChange}
              />
            </>
          )}
        </div>
        <div className='flex items-center gap-1'>
          {isEditing && (
            <>
              <p className='font-semibold'>Venue : </p>
              <input
                className='border w-96 rounded-lg p-3 mt-2 focus:outline-none'
                type='text'
                name='venue'
                value={formData.venue}
                onChange={handleChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateEvent;
