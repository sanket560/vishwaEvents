import React, { useState, useEffect } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import { MdCalendarMonth } from "react-icons/md";
import { useAuth } from "../../store/auth";
import { IoMdShareAlt } from "react-icons/io";
import { toast } from "react-toastify";
import Confetti from "react-confetti";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EventDetails = () => {
  const { eventId } = useParams();
  const { user, events, getEvents, isLoggedIn } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const userId = user?.message?._id;
  const userName = user?.message?.name;
  const userEmail = user?.message?.email;

  const FirstName = (userName) => {
    if (!userName) return "";
    const firstName = userName.split(" ")[0];
    return firstName;
  };

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [eventId]);

  useEffect(() => {
    checkRegistration();
  }, [eventId,userId]);

  const eventDetails = events.find((event) => event._id === eventId);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("URL copied to clipboard");
      })
      .catch((err) => {
        alert("Failed to copy URL to clipboard.", err);
        toast.error("Oops! URL not copied to clipboard you can directly copy link from the browser");
      });
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const storedToken = localStorage.getItem("token");

  const checkRegistration = async () => {
    try {
      const existingApplicationResponse = await fetch(
        `${BACKEND_URL}/application/check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({ eventId, userId }),
        }
      );

      if (!existingApplicationResponse.ok) {
        throw new Error("Failed to check existing application");
      }

      const existingApplicationData = await existingApplicationResponse.json();
      setIsRegistered(existingApplicationData.exists);
    } catch (error) {
      console.error("Error checking existing application:", error.message);
      setIsRegistered(false);
    }
  };
  
  // console.log(eventDetails.date);
  const handleRSVPClick = async () => {
    if (!isLoggedIn) {
      toast.error('Please log in to RSVP for this event.');
      return;
    }
  
    // Check if event date is in the past
    const eventDate = new Date(eventDetails.event_date); 
    const currentDate = new Date();
    if (eventDate < currentDate) {
      toast.error('Oops! This event has already passed.');
      return;
    }
  
    try {
      const response = await fetch(`${BACKEND_URL}/application/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          eventId: eventId,
          userId: userId,
          name: userName,
          phone: user.message.phone,
          email: userEmail,
          collegeEmail: user.message.collegeEmail,
          collegeName: user.message.collegeName,
          department: user.message.department,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit application");
      }
      checkRegistration();
      toast.success("Registration successful!");
      setShowConfetti(true);
      sendEmailConfirmation();
    } catch (error) {
      toast.error("Oops! Sorry, you need to visit the home page and try again.");
    }
  };

  const sendEmailConfirmation = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/rsvp/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userEmail,
          eventBanner : eventDetails.banner,
          eventName: eventDetails.heading,
          eventDate: eventDetails.event_date,
          eventTime: eventDetails.event_time,
          venue: eventDetails.venue
        })
      });
  
      if (!response.ok) {
        throw new Error("Failed to send email confirmation");
      }
  
      console.log("Email confirmation sent successfully");
    } catch (error) {
      console.error("Error sending email confirmation:", error.message);
    }
  };

  if (!eventDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className='md:max-w-[1220px] mx-auto mt-20 px-4 flex flex-col min-h-screen'>
      {loading ? (
        <div className='skeleton-layout -z-50'>
          <Skeleton height={200} />
          <h3 className='text-4xl uppercase font-semibold mt-3'>
            <Skeleton width={600} />
          </h3>
          <p className='whitespace-pre-wrap my-3'>
            <Skeleton count={5} />
          </p>{" "}
        </div>
      ) : (
        <div>
          <img
            src={eventDetails.banner}
            className='w-full rounded-lg bg-contain block mt-14 bg-center bg-no-repeat object-cover'
            alt=''
          />
          <div className='mt-6'>
            <div className='flex justify-between items-center'>
              <h3 className='text-4xl font-semibold md:w-full w-[270px]'>
                {eventDetails.heading}
              </h3>
              <IoMdShareAlt
                className='bg-slate-700 p-2 text-white cursor-pointer rounded-lg'
                size={40}
                onClick={handleShare}
              />
            </div>
            <p className='text-2xl mt-3 font-semibold'>About this event</p>
            <p className='whitespace-pre-wrap my-3'>
              {eventDetails.description}
            </p>
          </div>
          {showConfetti && (
            <Confetti
              width={1400}
              height={1000}
              numberOfPieces={200}
              recycle={false}
            />
          )}{" "}
          {isRegistered ? (
            <div className='border p-4 my-4'>
              <div className='flex flex-col items-center'>
                <p className='text-3xl font-semibold text-green-600'>
                  RSVP Confirmed!
                </p>
                <p className='text-xl mt-3'>
                  Your ticket has been sent to {userEmail}
                </p>
                <p className='text-xl mt-3'>
                  See you at the event, {FirstName(userName)}!
                </p>
              </div>
            </div>
          ) : (
            <div className='my-8'>
              <div className='border p-10'>
                <p className='text-center text-2xl pb-4 font-semibold'>
                  RSVP for this event now!
                </p>
                <hr />
                <div className='flex flex-col md:flex-row gap-3 items-center justify-between pt-4'>
                  <p className='font-semibold'>
                    REGISTER FOR {eventDetails.heading}
                  </p>
                  <p className='font-semibold flex items-center gap-2'>
                    {" "}
                    <MdCalendarMonth /> Registration ends{" "}
                    {formatDate(eventDetails.registration_end)}
                  </p>
                  <button
                    className='btn md:w-20 font-semibold px-3 py-1 rounded bg-[#4285f4] hover:bg-[#6f9eff] text-white'
                    onClick={handleRSVPClick}
                  >
                    RSVP
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventDetails;

// sanket mane