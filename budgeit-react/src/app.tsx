import React, { useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { Budget } from "./budget/budget";
import { Login } from "./login/login";
import { Leaderboard } from "./leaderboard/leaderboard";
import "./app.css";

enum AuthState {
  Authenticated,
  Unauthenticated,
}

export default function App() {
  const storedUserName = localStorage.getItem("userName");
  const [userName, setUserName] = useState<string>(
    storedUserName !== null ? storedUserName : ""
  );
  const currentAuthState = userName
    ? AuthState.Authenticated
    : AuthState.Unauthenticated;
  const [authState, setAuthState] = useState<AuthState>(currentAuthState);

  return (
    <BrowserRouter>
      <header>
        <nav class="fixed">
          <menu class="flex flex-row w-screen justify-between justify-items-center">
            <NavLink
              className="bg-blue-500 hover:bg-red-300 w-full text-center"
              to=""
            >
              Login
            </NavLink>
            <NavLink
              className="bg-blue-500 hover:bg-red-300 w-full text-center"
              to="budget"
            >
              Budget
            </NavLink>
            <NavLink
              className="bg-blue-500 hover:bg-red-300 w-full text-center"
              to="leaderboard"
            >
              Leaderboard
            </NavLink>
          </menu>
        </nav>

        <hr />
      </header>

      <main className="p-4">
        <Routes>
          <Route
            path="/"
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(userName, authState) => {
                  setAuthState(authState);
                  setUserName(userName);
                }}
              />
            }
          />
          <Route path="/budget" element={<Budget />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer class="flex w-full pt-2">
        <hr />
        <span class="w-full text-center">John Barrett</span>
        <br />
        <a
          class="w-full text-center"
          href="https://github.com/jsbarre1/startup"
        >
          GitHub
        </a>
      </footer>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="bg-gray-600 p-8 text-center">
      404: Return to sender. Address unknown.
    </div>
  );
}
