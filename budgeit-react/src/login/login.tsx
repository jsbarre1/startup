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
  const [displayError, setDisplayError] = useState<string | null>(null);

  // async function loginUser(e :React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  //   e.preventDefault();
  //   localStorage.setItem("userName", inputUserName);
  //   onAuthChange(inputUserName, AuthState.Authenticated);
  // }

  // async function createUser(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  //   e.preventDefault();
  //   localStorage.setItem("userName", inputUserName);
  //   onAuthChange(inputUserName, AuthState.Authenticated);
  // }

  async function loginUser() {
    loginOrCreate(`/api/auth/login`);
  }

  async function createUser() {
    loginOrCreate(`/api/auth/create`);
  }

  async function loginOrCreate(endpoint: string) {
    const response = await fetch(endpoint, {
      method: "post",
      body: JSON.stringify({ email: inputUserName, password: inputPassword }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (response?.status === 200) {
      localStorage.setItem("userName", userName);
      onAuthChange(inputUserName, AuthState.Authenticated);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
    <>
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
              onClick={(e) => {
                loginUser();
              }}
              className="p-2 transition-colors w-[100px] shadow-md lg:w-[200px] rounded-3xl bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-300"
              type="button"
              disabled={!inputUserName || !inputPassword}
            >
              Login
            </button>
            <button
              onClick={(e) => {
                createUser();
              }}
              className="p-2 transition-colors disabled:bg-gray-200 disabled:text-gray-300 w-[100px] shadow-md lg:w-[200px] ml-2 rounded-3xl bg-gray-500 hover:bg-gray-600 text-white"
              type="button"
              disabled={!inputUserName || !inputPassword}
            >
              Create
            </button>
          </div>
        </form>
      </main>
      {displayError && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all scale-100 animate-fadeIn">
      <div className="px-6 pt-6 pb-2">
        <h3 className="text-lg font-semibold text-gray-900">Error</h3>
      </div>
      
      <div className="px-6 py-4">
        <p className="text-gray-700">{displayError}</p>
      </div>
      
      <div className="px-6 py-4 flex justify-end rounded-b-xl">
        <button 
          onClick={() => setDisplayError(null)} 
          className="px-5 py-2.5 bg-blue-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
}
