import React, { useCallback, useEffect, useState } from "react";

interface LeaderBoard {
  points: number
  userName: string
}

interface Notification {
  id: number;
  userName: string;
  points: number;
  timestamp: Date;
}

export function Leaderboard({ userName }: { userName: string }) {
  const sampleData: LeaderBoard[] = [
    {
      points: 15075,
      userName: "James"
    },{
      points: 12075,
      userName: "James"
    },{
      points: 13000,
      userName: "Brock"
    },{
      points: 11000,
      userName: userName
    }
  ];
  const [leaderBoardData, setLeaderBoardData] = useState<LeaderBoard[]>(sampleData)
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nextNotificationId, setNextNotificationId] = useState(1);
  

  const addScore = useCallback((user: string, points: number) => {
    setLeaderBoardData(prevData => {
      const existingUserIndex = prevData.findIndex(item => item.userName === user);
      
      if (existingUserIndex !== -1) {
        const newData = [...prevData];
        newData[existingUserIndex] = {
          ...newData[existingUserIndex],
          points: newData[existingUserIndex].points + points
        };
        
        return newData.sort((a, b) => b.points - a.points);
      } else {
        const newData = [...prevData, { userName: user, points }];
        return newData.sort((a, b) => b.points - a.points);
      }
    });
    
    const newNotification: Notification = {
      id: nextNotificationId,
      userName: user,
      points,
      timestamp: new Date()
    };
    
    setNextNotificationId(prevId => prevId + 1);
    setNotifications(prev => [newNotification, ...prev].slice(0, 4)); 
    
    playRandomSound();
  }, [nextNotificationId]);
  
  const playRandomSound = () => {
    console.log("Playing random sound!");
  };
  
  useEffect(() => {
    const users = ["James", "Brock", "Aliza", "Sophie", "Miguel", "Priya", userName];
    const pointValues = [50, 100, 200, 500];
    
    const generateRandomScore = () => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomPoints = pointValues[Math.floor(Math.random() * pointValues.length)];
      addScore(randomUser, randomPoints);
    };
    
    const initialTimeout = setTimeout(() => {
      generateRandomScore();
    }, 3000);
    
    const interval = setInterval(() => {
      generateRandomScore();
    }, 3000); 
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [addScore, userName]);
  

  useEffect(() => {
    const sortedData = [...leaderBoardData].sort((a, b) => b.points - a.points);
    setLeaderBoardData(sortedData);
  }, [leaderBoardData]);
  return (
    <main className="flex flex-col pt-6 w-full h-full justify-center">
       <div className="text-xs justify-center max-h-32 overflow-y-auto">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className="bg-blue-300 text-center border border-white p-2 animate-fadeIn"
          >
            {notification.userName} recently scored {notification.points} points!
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="bg-gray-200 text-center border border-white p-2">
            Waiting for score updates...
          </div>
        )}
      </div>
      <div className="flex flex-col bg-gray-200 self-center w-full md:w-[800px] rounded-lg shadow-md">
        <h1 className="flex justify-center text-center">Leaderboard</h1>
        {leaderBoardData.map((person, index)=>(
          <div className="flex flex-row justify-evenly bg-blue-400 mb-1 rounded-2xl shadow-md">
          <div className="w-full text-center">{index +1}</div>
          <div className="w-full text-center">{person.userName}</div>
          <div className="w-full text-center">{person.points}</div>
        </div>
        ))}
       
      </div>
    </main>
  );
}
