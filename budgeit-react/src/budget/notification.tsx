import React, { ReactNode, useEffect, useState } from "react";

export default function Notification({
  children,
  setState,
}: {
  children: ReactNode;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set a timeout to hide the notification after 1.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      
      // Add another timeout to set the parent state after fade-out completes
      setTimeout(() => {
        setState(false);
      }, 500); // Account for the transition duration
    }, 1500);

    // Clean up the timer if component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [setState]);

  return (
    <div
      className={`
      fixed 
      left-1/2 
      transform 
      -translate-x-1/2 
      flex 
      flex-row 
      m-auto 
      rounded-lg 
      p-1
      transition-opacity 
      duration-500 
      ease-in-out 
      z-50
      bg-green-100 text-green-800 shadow-md
      ${isVisible ? "opacity-100" : "opacity-0"}
    `}
    >
      {children}
    </div>
  );
}