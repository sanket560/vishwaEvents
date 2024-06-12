import { createContext, useContext, useEffect, useState } from "react";
export const AuthContext = createContext();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  const storeTokenInLocalStorage = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const isLoggedIn = !!token;

  const LogoutUser = () => {
    setToken("");
    return localStorage.removeItem("token");
  };

  /*        user authentication            */
  const userAuthentication = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // console.log("User data:", data.message);
        setUser(data);
      } else {
        console.log("Failed to fetch user data. Response:", response);
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    userAuthentication();
  }, [token]);

  /*        get all events           */

  const getEvents = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/events`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        // console.log(data.eventData);
        setEvents(data.eventData); // Update events state with eventData
      }
    } catch (error) {
      console.log(`events error ${error}`);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        storeTokenInLocalStorage,
        LogoutUser,
        events,
        getEvents,
        user,
        setEvents,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContext;
};
