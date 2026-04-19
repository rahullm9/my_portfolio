import React, { useEffect, useState } from 'react';

const PageLoader = ({ isLoading }) => {
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let startTimer, incrementTimer, hideTimer;

    if (isLoading) {
      setVisible(true);
      setWidth(0);

      // Start at 20% quickly
      startTimer = setTimeout(() => setWidth(20), 10);

      // Increment to ~80% over 300ms
      incrementTimer = setTimeout(() => setWidth(80), 100);
    } else {
      // Complete to 100%
      setWidth(100);

      // Then fade out
      hideTimer = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 400);
    }

    return () => {
      clearTimeout(startTimer);
      clearTimeout(incrementTimer);
      clearTimeout(hideTimer);
    };
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none">
      <div
        className="h-full bg-primary transition-all ease-out"
        style={{
          width: `${width}%`,
          transitionDuration: width === 100 ? '200ms' : '300ms',
          boxShadow: '0 0 10px var(--color-primary, #a855f7), 0 0 5px var(--color-primary, #a855f7)',
        }}
      />
    </div>
  );
};

export default PageLoader;
