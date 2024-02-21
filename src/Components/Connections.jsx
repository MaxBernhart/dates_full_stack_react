import React from "react";
import { useState, useRef, useEffect } from "react";
import { useAuth} from '../AuthContext';
import ConnectionDisplay from "./ConnectionDisplay";
import './login.css'

export default function Connections() {
  const { token, id, username, isAuthenticated, setConnection } = useAuth();
  const userInput = useRef();
  const [created, setCreated] = useState(false);
  const [allConnections, setAllConnections] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [complete, setComplete] = useState(false);
  const [newSearch, setNewSearch] = useState(0);

  async function getConnections(){
    const response = await fetch('http://localhost:5000/getconnections?user='+id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if(response.ok) {
      const data = await response.json();
      setAllConnections(data);
      setComplete(true);
    }
    else{
      console.log(response);
      setComplete(true);
      console.error('Connection search failed');
    }
  }

  async function findUser(){
    let username = userInput.current.value;

    const response = await fetch('http://localhost:5000/find?username='+username, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log('ID found');
      connect(data.id,username)
    } else {
      console.log(response);
      console.error('ID search failed');
    }
  }

  async function connect(user2, username2){
    const user1 = id;
    const username1 = username;
    console.log(user2);    
    const res = await fetch('http://localhost:5000/connections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ user1, username1, user2, username2 }),
    });

    const data = await res.json();
    if (res.ok){
      console.log('Connection registered successfully');
      const conId = data.id;
      setConnection(conId);
    }
  }

  if(allConnections.length == 0){
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="container">
          <div className="center">
            <h1>Connections</h1>
            <h3>My Connections</h3>
            <button onClick={getConnections}><p>Find my Connections</p></button>
            <h3>New Connection</h3>
            <p>Enter the usernmane of the user you would like to connect with</p>
            <p>Username <input type="text" ref={userInput} /></p>
            <button onClick={findUser}><p>Connect</p></button>
          </div>
        </div>
      </main>
    );
  }
  else{
    return (
        <div className="container">
          <div className="center">
            <h1>Connections</h1>
            <h3>My Connections</h3>
            {allConnections.connections.map((con) => {return(<ConnectionDisplay connection ={con} name = {username}/>)})}
            
            <h3>New Connection</h3>
            <p>Enter the usernmane of the user you would like to connect with</p>
            <p>Username <input type="text" ref={userInput} /></p>
            <button onClick={findUser}><p>Connect</p></button>
          </div>
        </div>
    );






















    
  }
  }