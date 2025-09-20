import React, { useEffect } from 'react';

const Stars = () => {
  useEffect(() => {
    const starsContainer = document.querySelector('.stars');
    const starCount = 100; // number of stars
    const stars = [];

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div'); 
      star.className = 'star'; 

      // Random position on the screen
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';

      // Random animation delay so stars twinkle at different times
      star.style.animationDelay = Math.random() * 3 + 's';

      stars.push(star);
    }

    // Add all created stars into the container
    stars.forEach(star => starsContainer.appendChild(star));

    // Cleanup: remove stars when the component unmounts
    return () => {
      stars.forEach(star => starsContainer.removeChild(star));
    };
  }, []);

  return <div className="stars"></div>;
};

export default Stars;
