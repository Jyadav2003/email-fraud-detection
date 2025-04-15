// src/components/Layout/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Mail, AlertCircle, Settings, Shield, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart2, current: true },
    { name: 'Email Analysis', href: '/analysis', icon: Mail, current: false },
    { name: 'Threat Reports', href: '/threats', icon: AlertCircle, current: false },
    { name: 'Settings', href: '/settings', icon: Settings, current: false },
  ];

  return (
    <div className={`h-full bg-indigo-700 ${isOpen ? 'block' : 'hidden'} lg:block`}>
      <div className="flex items-center justify-center h-16 bg-indigo-800">
        <Shield className="h-8 w-8 text-white" />
        <h1 className="ml-2 text-xl font-bold text-white">EmailGuard</h1>
      </div>
      
      <nav className="mt-5 px-2 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`${
              item.current
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-100 hover:bg-indigo-600'
            } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
          >
            <item.icon
              className="mr-4 h-6 w-6 text-indigo-300"
              aria-hidden="true"
            />
            {item.name}
          </Link>
        ))}
      </nav>
      
      <div className="absolute bottom-0 w-full p-4">
        <Link
          to="/logout"
          className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-indigo-100 hover:bg-indigo-600"
        >
          <LogOut className="mr-4 h-6 w-6 text-indigo-300" aria-hidden="true" />
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;