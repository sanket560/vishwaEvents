import React, { useEffect, useState } from "react";
import { useAuth } from "../../store/auth";
import { useNavigate, useParams } from "react-router-dom";
import {CSVLink} from 'react-csv';
import { RiFileExcel2Fill } from "react-icons/ri";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Application = () => {
  const { eventId } = useParams();
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { events, isLoggedIn } = useAuth();
  const storedToken = localStorage.getItem("token");

  const event = events.find((event) => event._id === eventId);

  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchRegisteredUsers = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/application/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch registered users");
        }
        const data = await response.json();
        setRegisteredUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching registered users:", error.message);
        setLoading(false);
      }
    };

    fetchRegisteredUsers();
  }, [eventId, storedToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const headers = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "College", key: "collegeName" },
    { label: "Department", key: "department" },
  ];

  return (
    <div className='p-4 flex mt-20 items-center flex-col min-h-screen'>
      <img
        src={event.banner}
        className='w-full rounded-lg bg-contain block mb-10 bg-center bg-no-repeat object-cover'
        alt=''
      />
      <div className='overflow-x-auto w-full'>
        <table className='w-full table-auto border-collapse border border-gray-200 rounded-lg'>
          <thead>
            <tr>
              <th className='border border-gray-200 px-4 py-2'>name</th>
              <th className='border border-gray-200 px-4 py-2'>Email</th>
              <th className='border border-gray-200 px-4 py-2'>Phone</th>
              <th className='border border-gray-200 px-4 py-2'>College</th>
              <th className='border border-gray-200 px-4 py-2'>Department</th>
            </tr>
          </thead>
          <tbody>
            {registeredUsers.map((user) => (
              <tr key={user._id}>
                <td className='border border-gray-200 px-4 py-2'>
                  {user.name}
                </td>
                <td className='border border-gray-200 px-4 py-2'>
                  {user.email}
                </td>
                <td className='border border-gray-200 px-4 py-2'>
                  {user.phone}
                </td>
                <td className='border border-gray-200 px-4 py-2'>
                  {user.collegeName}
                </td>
                <td className='border border-gray-200 px-4 py-2'>
                  {user.department}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CSVLink
        className='text-center flex items-center gap-2 text-lg my-4 border w-fit px-2 py-1 rounded-md'
        data={registeredUsers}
        headers={headers}
        filename={`${event.heading} registered_users.csv`}
      >
        <RiFileExcel2Fill className="text-green-600 text-2xl" /> Download sheet
      </CSVLink>
    </div>
  );
};
export default Application;