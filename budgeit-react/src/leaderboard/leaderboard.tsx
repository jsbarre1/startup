import React, { useCallback, useEffect, useState } from "react";
import { AuthState } from "../app";
import UnauthorizedMessage from "../login/unauthorizedMessage";
interface LeaderBoard {
  score: number;
  userName: string;
}

interface Notification {
  id: number;
  userName: string;
  points: number;
  timestamp: Date;
}

export function Leaderboard({ authState, userName }: { userName: string, authState: AuthState }) {
  const [leaderBoardData, setLeaderBoardData] = useState<LeaderBoard[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  if(authState === AuthState.Unauthenticated){
    return (<UnauthorizedMessage/>)
  }
  const fetchScores = async () => {
    try {
      const response = await fetch("/api/scores");

      if (!response.ok) {
        throw new Error("Failed to fetch scores");
      }

      const scores = (await response.json()) as LeaderBoard[];

      setLeaderBoardData(scores);
    } catch (error) {
      console.error("Error fetching scores:", error);
    }
  };

  useEffect(() => {
    fetchScores();

    const interval = setInterval(fetchScores, 10000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const sortedData = [...leaderBoardData].sort((a, b) => b.score - a.score);
    setLeaderBoardData(sortedData);
  }, [leaderBoardData]);

  return (
    <main className="flex flex-col pt-6 w-full h-full justify-center">
      <div className="text-xs justify-center max-h-32 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-blue-300 text-center border border-white"
          >
            {notification.userName} recently scored {notification.points}{" "}
            points!
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
        {leaderBoardData.map((person, index) => (
          <div
            className={`flex flex-row justify-evenly ${
              person.userName === userName ? `border-yellow-400 border-2` : ``
            } bg-blue-400 mb-1 rounded-2xl shadow-md`}
          >
            <div className="w-full text-center">{index + 1}</div>
            <div className="w-full text-center">{person.userName}</div>
            <div className="w-full text-center">{person.score}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
