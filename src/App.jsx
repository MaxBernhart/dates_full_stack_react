import { Routes, Route, BrowserRouter} from "react-router-dom";
import { useState } from 'react'
import './App.css';
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import Match from "./Components/Match";
import Login from "./Components/Login";
import Connections from "./Components/Connections"
import New from "./Components/New";
import MatchDisplay from "./Components/MatchDisplay";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar></Navbar>

        <Routes>
          <Route path = "/" element ={<Home/>} />
          <Route path = "/match" element ={<Match/>} />
          <Route path = "/login" element ={<Login/>} />
          <Route path = "/connections" element ={<Connections/>} />
          <Route path = "/newuser" element ={<New/>} />
          <Route path = "/mymatches" element = {<MatchDisplay/>} />
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App;
