import React, { useCallback, useEffect, useState } from "react";

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

export function Leaderboard({ userName }: { userName: string }) {
  const [leaderBoardData, setLeaderBoardData] = useState<LeaderBoard[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nextNotificationId, setNextNotificationId] = useState(1);

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

  const addScore = useCallback(
    (user: string, points: number) => {
      const newNotification: Notification = {
        id: nextNotificationId,
        userName: user,
        points,
        timestamp: new Date(),
      };

      const backendAddScore = async (userName: string, points: number) => {
        try {
          const response = await fetch("/api/score", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userName: userName,
              score: points,
            }),
          });

          if (response.ok) {
            fetchScores()
          } else {
            console.error("Failed to update score");
          }
        } catch (error) {
          console.error("Error updating score:", error);
        }
      };

      backendAddScore(user, points);

      setNextNotificationId((prevId) => prevId + 1);
      setNotifications((prev) => [newNotification, ...prev].slice(0, 4));
    },
    [nextNotificationId]
  );

  useEffect(() => {
    const users = [
      "James",
      "Brock",
      "Aliza",
      "Sophie",
      "Miguel",
      "Priya",
      userName,
    ];
    const pointValues = [50, 100, 200];

    const generateRandomScore = () => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomPoints =
        pointValues[Math.floor(Math.random() * pointValues.length)];
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
