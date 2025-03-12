import React, { ReactNode, useEffect, useState } from "react";
import { getRandomCat } from "./random-cat";

export default function Notification({
  children,
  setState,
}: {
  children: ReactNode;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isVisible, setIsVisible] = useState(false); 
  const [catImageUrl, setCatImageUrl] = useState<string | null>(null);
  
  const getCat = async () => {
    const imageUrl = await getRandomCat();
    setCatImageUrl(imageUrl);
  };

  useEffect(() => {
    getCat();
  }, []);

  useEffect(() => {
    if (catImageUrl !== null) {
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        
        setTimeout(() => {
          setState(false);
        }, 500); 
      }, 3000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [catImageUrl, setState]); 

  if (catImageUrl === null) {
    return null;
  }

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
      <img src={catImageUrl} alt="Random cat" className="h-8 w-8 mr-2 rounded-full" />
      {children}
    </div>
  );
}