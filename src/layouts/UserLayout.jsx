import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbarz from '../components/user/Navbarz';
import Footerz from '../components/user/Footerz';
import '../user.css'; // Seul fichier où tu utilises Tailwind

const UserLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbarz />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footerz />
  </div>
);

export default UserLayout;
