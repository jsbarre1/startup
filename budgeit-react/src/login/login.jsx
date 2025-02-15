import React from 'react';

export function Login() {
  return (
    
    <main className="flex flex-col pt-6 w-full justify-center">
    <h1 className="text-center">Welcome to BudgeIt</h1>
    <form method="get" action="budget.html">
      <div className="flex w-full justify-center">
        <input className="mt-4  shadow-md align-middle text-center rounded-2xl lg:w-[400px] w-[200px] ring-2 ring-blue-400" type="text" placeholder="your@email.com" />
      </div>
      <div className="flex w-full justify-center">
        <input className=" text-center shadow-md ring-2 rounded-2xl lg:w-[400px] w-[200px] ring-blue-400" type="password" placeholder="password" />
      </div>
      <div className="flex flex-row justify-center">
        <button className="p-2 w-[100px] shadow-md lg:w-[200px] rounded-3xl bg-blue-500 text-white" type="submit">Login</button>
      <button className="p-2 w-[100px] shadow-md lg:w-[200px] ml-2 rounded-3xl bg-gray-500 text-white" type="submit">Create</button>
      </div>
      
    </form>
    </main>
  );
}