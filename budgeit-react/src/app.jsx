import React from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="w-full">
          <nav className="fixed top-0 w-full bg-gray-900 px-4 py-2 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">
                Simon<sup className="text-sm">&reg;</sup>
              </div>
              <ul className="flex space-x-4">
                <li>
                  <NavLink className="hover:text-gray-300" to="">
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink className="hover:text-gray-300" to="budget">
                    Play
                  </NavLink>
                </li>
                <li>
                  <NavLink className="hover:text-gray-300" to="leaderboard">
                    Scores
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        <main className="mt-16 p-4">
          <Routes>
            <Route path="/" element={<Login />} exact />
            <Route path="/play" element={<Play />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="fixed bottom-0 w-full bg-gray-900 p-4 text-gray-400">
          <div className="container mx-auto flex justify-between">
            <span>Author Name(s)</span>
            <a
              className="hover:text-gray-300"
              href="https://github.com/webprogramming260/simon-react"
            >
              Source
            </a>
          </div>
        </footer>
      </div>
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