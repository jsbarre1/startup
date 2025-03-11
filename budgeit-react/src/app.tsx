import React, { useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Budget } from "./budget/budget";
import { Login } from "./login/login";
import { Leaderboard } from "./leaderboard/leaderboard";
import "./app.css";

export enum AuthState {
  Authenticated,
  Unauthenticated,
}
function AppContent() {
  const navigate = useNavigate();
  const storedUserName = localStorage.getItem("userName");
  const [userName, setUserName] = useState<string>(
    storedUserName !== null ? storedUserName : ""
  );
  const currentAuthState = userName
    ? AuthState.Authenticated
    : AuthState.Unauthenticated;
  const [authState, setAuthState] = useState<AuthState>(currentAuthState);

  const onAuthChange = (userName: string, authState: AuthState) => {
    setAuthState(authState);
    setUserName(userName);
  };

  const logout = () => {
    fetch(`/api/auth/logout`, {
      method: "delete",
    })
      .catch(() => {
        // Logout failed. Assuming offline
      })
      .finally(() => {
        localStorage.removeItem("userName");
        setAuthState(AuthState.Unauthenticated);
        setUserName("");
        navigate("/");
      });
  };

  return (
    <>
      {authState === AuthState.Authenticated ? (
        <header>
          <nav className="fixed">
            <menu className="flex flex-row w-screen justify-between justify-items-center">
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
              <button
                onClick={logout}
                className="bg-blue-500 hover:bg-red-300 w-full text-center"
              >
                Logout
              </button>
            </menu>
          </nav>

          <hr />
        </header>
      ) : null}

      <main className="p-4">
        <Routes>
          {authState === AuthState.Unauthenticated ? (
            <Route
              path="/"
              element={
                <Login
                  userName={userName}
                  authState={authState}
                  onAuthChange={onAuthChange}
                />
              }
            />
          ) : (
            <>
              <Route path="/" element={<Budget userName={userName} />} />
              <Route path="/budget" element={<Budget userName={userName} />} />
              <Route
                path="/leaderboard"
                element={<Leaderboard userName={userName} />}
              />
            </>
          )}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="flex w-full pt-2">
        <hr />
        <span className="w-full text-center">John Barrett</span>
        <br />
        <a
          className="w-full text-center"
          href="https://github.com/jsbarre1/startup"
        >
          GitHub
        </a>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
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
