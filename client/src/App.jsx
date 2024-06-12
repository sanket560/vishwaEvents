import React from "react";
import Layout from "./pages/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import Home from "./pages/home/Home";
import EventDetails from "./pages/Events/EventDetails";
import HostEvent from "./pages/Events/HostEvent";
import Logout from "./pages/Logout";
import MyEvents from "./pages/Events/MyEvents";
import MyTicket from "./pages/Events/MyTicket";
import Application from "./pages/Events/Application";
import UpdateEvent from './pages/Events/UpdateEvent';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='' element={<Home />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Contact' element={<Contact />} />
          <Route path='/Events/:eventId' element={<EventDetails />} />
          <Route path='/HostEvent' element={<HostEvent />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/myevents' element={<MyEvents />} />
          <Route path='/myticket' element={<MyTicket />} />
          <Route path='/update/:eventId' element={<UpdateEvent />} />
          <Route path='/application/:eventId' element={<Application />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
