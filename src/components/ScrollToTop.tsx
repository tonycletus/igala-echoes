import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on initial load and route change
    window.scrollTo(0, 0);
  }, [pathname]); // This will trigger on initial render too since pathname changes

  return null;
};

export default ScrollToTop;