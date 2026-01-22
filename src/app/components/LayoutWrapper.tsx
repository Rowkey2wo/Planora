"use client";

import { useState } from 'react'; 
import Navbar from './Navbar'; 

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <Navbar onMenuClick={handleMenuClick} /> 
      <main>
        {children}
      </main>
    </div>
  );
}
