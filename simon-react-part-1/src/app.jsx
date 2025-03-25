import React from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { Login } from "./login/login";
import { Play } from "./play/play";
import { Scores } from "./scores/scores";
import { About } from "./about/about";

export default function App() {
  return (
    <BrowserRouter>
      <div className="body bg-dark text-light">
        <header>
          <nav className="navbar fixed-top navbar-dark bg-dark">
            <div className="container-fluid">
              <a className="navbar-brand" href="#">
                Simon<sup>&reg;</sup>
              </a>
              <ul className="navbar-nav flex-row">
                <li className="nav-item px-2">
                  <NavLink className="nav-link" to="">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item px-2">
                  <NavLink className="nav-link" to="play">
                    Play
                  </NavLink>
                </li>
                <li className="nav-item px-2">
                  <NavLink className="nav-link" to="scores">
                    Scores
                  </NavLink>
                </li>
                <li className="nav-item px-2">
                  <NavLink className="nav-link" to="about">
                    About
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        <main className="container-fluid mt-5">
          <Routes>
            <Route path="/" element={<Login />} exact />
            <Route path="/play" element={<Play />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="bg-dark text-white-50">
          <div className="container-fluid">
            <span className="text-reset">Author Name(s)</span>
            <a
              className="text-reset"
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
    <main className="container-fluid bg-secondary text-center">
      404: Return to sender. Address unknown.
    </main>
  );
}