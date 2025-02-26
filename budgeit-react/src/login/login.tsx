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
  const [inputPassword, setInputPassword] = useState("");
  const [displayError, setDisplayError] = useState(null);

  async function loginUser(e :React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    localStorage.setItem("userName", inputUserName);
    onAuthChange(inputUserName, AuthState.Authenticated);
  }

  async function createUser(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
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
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            className="text-center shadow-md ring-2 rounded-2xl lg:w-[400px] w-[200px] ring-blue-400 mt-2"
            type="password"
            placeholder="password"
          />
        </div>
        <div className="flex flex-row justify-center mt-2">
          <button
            onClick={(e)=> {loginUser(e)}}
            className="p-2 transition-colors w-[100px] shadow-md lg:w-[200px] rounded-3xl bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-300"
            type="button"
            disabled={!inputUserName || !inputPassword}
          >
            Login
          </button>
          <button
            onClick={(e) => {createUser(e)}}
            className="p-2 transition-colors disabled:bg-gray-200 disabled:text-gray-300 w-[100px] shadow-md lg:w-[200px] ml-2 rounded-3xl bg-gray-500 hover:bg-gray-600 text-white"
            type="button"
            disabled={!inputUserName || !inputPassword}
          >
            Create
          </button>
        </div>
      </form>
    </main>
  );
}
