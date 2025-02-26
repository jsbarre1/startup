import React, { useState } from "react";
import { AuthState } from "../app";

export function Login({
  userName,
  authState,
  onAuthChange,
}: {
  userName: string;
  authState: AuthState;
  onAuthChange: (userName: string, authState: AuthState) => void;
}) {
  const [inputUserName, setInputUserName] = useState<string>(userName || "");
  const [password, setPassword] = useState("");
  const [displayError, setDisplayError] = useState(null);

  async function loginUser(e : React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    localStorage.setItem("userName", inputUserName);
    onAuthChange(inputUserName, AuthState.Authenticated);
  }

  async function createUser(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    localStorage.setItem("userName", inputUserName);
    onAuthChange(inputUserName, AuthState.Authenticated);
  }

  return (
    <main className="flex flex-col pt-6 w-full justify-center">
      <h1 className="text-center">Welcome to BudgeIt</h1>
      <form method="get" action="budget.html">
        <div className="flex w-full justify-center">
          <input
            value={inputUserName}
            onChange={(e) => setInputUserName(e.target.value)}
            className="mt-4 shadow-md align-middle text-center rounded-2xl lg:w-[400px] w-[200px] ring-2 ring-blue-400"
            type="text"
            placeholder="your@email.com"
          />
        </div>
        <div className="flex w-full justify-center">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-center shadow-md ring-2 rounded-2xl lg:w-[400px] w-[200px] ring-blue-400 mt-2"
            type="password"
            placeholder="password"
          />
        </div>
        <div className="flex flex-row justify-center mt-2">
          <button
            onClick={()=> loginUser}
            className="p-2 w-[100px] shadow-md lg:w-[200px] rounded-3xl bg-blue-500 text-white"
            type="button"
          >
            Login
          </button>
          <button
            onClick={() => createUser}
            className="p-2 w-[100px] shadow-md lg:w-[200px] ml-2 rounded-3xl bg-gray-500 text-white"
            type="button"
          >
            Create
          </button>
        </div>
      </form>
    </main>
  );
}
