'use client'

import React from "react";
import { useRef } from 'react'
import { Link } from 'react-router-dom';
import './login.css'
import { useAuth } from "../AuthContext";

export default function Login() {

  const { login, logout } = useAuth();
  let nameInput = useRef();
  let passwordInput = useRef();

    async function handleLogin(){
      const username = nameInput.current.value;
      const password = passwordInput.current.value;

      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        login(data.token, data.id, username);
        console.log('User logged in successfully');
      } else {
        console.error('Login failed');
      }
    };  

    async function handleNew(){
      const username = nameInput.current.value;
      const password = passwordInput.current.value;
  
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        console.log('User registered successfully');
        const loginResponse = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
  
        if (loginResponse.ok) {
          const data = await loginResponse.json();
          login(data.token, data.id, username);
        }
      } else {
        console.error('User registration failed');
      }
    }

    function handleLogout(){
      logout();
    }

    return (
      <div className="container">
        <div className="center">
          <h2>Welcome to our application!</h2>
          <h4>Log in to your account</h4>
          <p>User name: <input type="text" ref={nameInput} /></p>
          <p>Password: <input type="password" ref={passwordInput} /></p>
          <button onClick={handleLogin} className="log"><p>Log In</p></button>
          <button onClick={handleNew} className="reg"><p>Sign Up</p></button>
          <button onClick={handleLogout} className="log"><p>Log Out</p></button>
        </div>
    </div>
    )
  }