import React from "react";

export function Leaderboard() {
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
        <div className="flex flex-row justify-evenly bg-blue-400 rounded-2xl shadow-md">
          <div className="w-full text-center">1</div>
          <div className="w-full text-center">James</div>
          <div className="w-full text-center">15075</div>
        </div>
        <div className="flex flex-row justify-evenly bg-blue-400 rounded-2xl mt-1 shadow-md">
          <div className="w-full text-center">2</div>
          <div className="w-full text-center">Brock</div>
          <div className="w-full text-center">13000</div>
        </div>
        <div className="flex flex-row justify-evenly bg-blue-400 rounded-2xl mt-1 shadow-md">
          <div className="w-full text-center">3</div>
          <div className="w-full text-center">Aliza</div>
          <div className="w-full text-center">12075</div>
        </div>
        <div className="flex flex-row justify-evenly bg-blue-400 rounded-2xl mt-1 shadow-md">
          <div className="w-full text-center">4</div>
          <div className="w-full text-center">(Username)</div>
          <div className="w-full text-center">11000</div>
        </div>
      </div>
    </main>
  );
}
