"use client"
import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
import { usePathname } from 'next/navigation';

const ScrollToTop = () => {
    // Extracts pathname property(key) from an object
    // const { pathname } = useLocation();
    const pathname = usePathname();
  
    // Automatically scrolls to top whenever pathname changes
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  }
  
  export default ScrollToTop;