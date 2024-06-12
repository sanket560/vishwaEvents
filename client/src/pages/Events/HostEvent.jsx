import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { RiInformationLine } from "react-icons/ri";
import { toast } from "react-toastify";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const HostEvent = () => {
  const { setEvents, isLoggedIn } = useAuth();
  const [isSubmitting , setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    event_date: "",
    event_time: "",
    registration_end: "",
    venue: "",
  });
  const [posterFile, setPosterFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'posterFile') {
      setPosterFile(files[0]);
    } else if (name === 'bannerFile') {
      setBannerFile(files[0]);
    }
  };

  const storedToken = localStorage.getItem('token');

  const addNewEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const onSubmit = async (e) => {
    setIsSubmitting(true)
    e.preventDefault();
    const formDataWithFiles = new FormData();
    formDataWithFiles.append('heading', formData.heading);
    formDataWithFiles.append('description', formData.description);
    formDataWithFiles.append('event_date', formData.event_date);
    formDataWithFiles.append('event_time', formData.event_time);
    formDataWithFiles.append('registration_end', formData.registration_end);
    formDataWithFiles.append('venue', formData.venue);
    formDataWithFiles.append('posterFile', posterFile);
    formDataWithFiles.append('bannerFile', bannerFile);

    try {
      const response = await fetch(`${BACKEND_URL}/postevent`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${storedToken}`
        },
        body: formDataWithFiles,
      });

      if (response.ok) {
        setFormData({
          heading: "",
          description: "",
          event_date: "",
          event_time: "",
          registration_end: "",
          venue: "",
        });
        setPosterFile(null);
        setBannerFile(null);

        toast.success("Event successfully hosted!")
        const newEvent = await response.json();
        addNewEvent(newEvent);

        navigate('/');
      } else {
        const errorData = await response.json();
        toast.error(errorData.extraDetails);
      }
    } catch (error) {
      console.error('Error hosting event:', error);
    }
    setIsSubmitting(false)
  };

  return (
    <div className='mt-20'>
      <div className='w-full my-6 mx-auto max-w-3xl'>
        <div className='border-0 flex flex-col w-full bg-white outline-none focus:outline-none'>
          <div className=' text-center py-3'>
            <h3 className='text-3xl font-semibold'>Host Your Event</h3>
            <p className='italic text-gray-600'>
              "Create memories, build connections, and inspire others."
            </p>
          </div>
          <div className='flex-auto'>
            <form onSubmit={onSubmit} className='px-8 pt-6 pb-8 w-full'>

              <label className='block text-black text-lg mb-3'>
                Event Name
              </label>
              <input
                name='heading'
                value={formData.heading}
                onChange={handleChange}
                className='focus:outline-none  px-3 border mb-3 rounded w-full py-2 text-black'
                placeholder='Event Name'
              />
              <label className='block text-black text-lg'>
                Event Description
              </label>
              <p className="bg-[#f0f4ff] py-3 px-3 rounded-md my-3 flex items-center gap-2"> <RiInformationLine className="text-blue-400 text-xl" />Make sure you enter event description , prizes, date, time, venue , Fees</p>
              <textarea
                name='description'
                rows={10}
                value={formData.description}
                onChange={handleChange}
                className='focus:outline-none px-3 border mb-3 rounded w-full py-2 text-black'
                placeholder='Event Description | Prizes | Date | Time | Venue | Fees'
              />
              <div className='mb-3'>
                <label className='block text-black text-lg'>
                  Upload Poster
                </label>
                <p className="bg-[#f0f4ff] py-3 px-3 rounded-md my-3 flex items-center gap-2"> <RiInformationLine className="text-blue-400 text-xl" />For poster use width 290px and height 294px</p>
                <input
                  type="file"
                  name="posterFile"
                  onChange={handleFileChange}
                  className="focus:outline-none px-3 border mb-3 rounded w-full py-2 text-black"
                />
              </div>
              <div className='mb-3'>
                <label className='block text-black text-lg'>
                  Upload Banner
                </label>
                <p className="bg-[#f0f4ff] py-3 px-3 rounded-md my-3 flex items-center gap-2"> <RiInformationLine className="text-blue-400 text-xl" />For banner use width 2560px and height 640px</p>
                <input
                  type="file"
                  name="bannerFile"
                  onChange={handleFileChange}
                  className="focus:outline-none px-3 border mb-3 rounded w-full py-2 text-black"
                />
              </div>
              <div>
                <label className='block text-black text-lg'>Event Date</label>
                <input
                  name='event_date'
                  value={formData.event_date}
                  onChange={handleChange}
                  className='focus:outline-none px-3 border mb-3 rounded w-full py-2 text-black'
                  type='date'
                />
              </div>
              <div>
                <label className='block text-black text-lg'>Event Time</label>
                <input
                  name='event_time'
                  value={formData.event_time}
                  onChange={handleChange}
                  className='focus:outline-none px-3 border mb-3 rounded w-full py-2 text-black'
                  type='time'
                />
              </div>
              <div>
                <label className='block text-black text-lg'>
                  Last Date To Apply
                </label>
                <input
                  name='registration_end'
                  value={formData.registration_end}
                  onChange={handleChange}
                  className='focus:outline-none px-3 border mb-3 rounded w-full py-2 text-black'
                  type='date'
                />
              </div>
              <div>
                <label className='block text-black text-lg'>Venue</label>
                <input
                  name='venue'
                  value={formData.venue}
                  onChange={handleChange}
                  className='focus:outline-none px-3 border mb-3 rounded w-full py-2 text-black'
                  placeholder='Venue'
                />
              </div>
              <div className='flex items-center justify-end pb-3 rounded-b'>
                <button
                  className='w-full bg-[#4285f4] hover:bg-[#6f9eff] text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1'
                  type='submit'
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostEvent;
