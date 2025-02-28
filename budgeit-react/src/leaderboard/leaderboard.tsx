import React, { useEffect, useState } from "react";

interface LeaderBoard {
  points: number
  userName: string
}

export function Leaderboard() {
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
      userName: "YourScore"
    }
  ];
  const [leaderBoardData, setLeaderBoardData] = useState<LeaderBoard[]>(sampleData)


  useEffect(() => {
    const sortedData = [...leaderBoardData].sort((a, b) => b.points - a.points);
    setLeaderBoardData(sortedData);
  }, [leaderBoardData]);
  return (
    <main className="flex flex-col pt-6 w-full h-full justify-center">
      <div className="text-xs justify-center">
        <div className="bg-blue-300 text-center border border-white">
          James recently scored 500 points!
        </div>
        <div className="bg-blue-300 text-center border border-white">
          Brock recently scored 200 points!
        </div>
        <div className="bg-blue-300 text-center border border-white">
          Aliza recently scored 50 points!
        </div>
        <div className="bg-blue-300 text-center border border-white">
          (every time someone scores hit a random sound generator api)
        </div>
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
