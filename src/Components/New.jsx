'use client'

import React from "react";
import { useRef } from 'react'

export default function New(){

    let userInput = useRef();
    let passwordInput = useRef();
    let nameInput = useRef();
    let emailInput = useRef();

    return(
        <div>
        <h4>Create your account</h4>
        <p>Full Name: <input type="text" ref={nameInput} /></p>
        <p>Email: <input type="text" ref={emailInput} /></p>
        <p>User name: <input type="text" ref={userInput} /></p>
        <p>Password: <input type="text" ref={passwordInput} /></p>
        </div>
    )
}