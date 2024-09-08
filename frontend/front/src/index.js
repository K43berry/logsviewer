import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route } from "react-router-dom"

import App from './App';
import Upload from './hooks/hooks.upload'
import SignIn from './hooks/hooks.signin'
import SignUp from './hooks/hooks.signup'
import Leaderboard from './hooks/hooks.leaderboard'
import MyLogs from './hooks/hooks.mylogs'
import MyFriends from './hooks/hooks.myfriends'
import Disc from './hooks/hooks.disc'
import Settings from './hooks/hooks.settings'
import MyRecap from './hooks/hooks.myrecap'
import GetStarted from './hooks/hooks.getstarted';
import FriendsLogs from './hooks/hooks.friendslogs';

import { ChakraProvider } from '@chakra-ui/react'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="/upload" element={<Upload />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path = "/leaderboard" element={<Leaderboard />}></Route>
        <Route path = "/disc" element={<Disc />}></Route>
        <Route path = "/mylogs" element={<MyLogs />}></Route>
        <Route path = "/friends" element={<MyFriends />}></Route>
        <Route path = "/settings" element={<Settings />}></Route>
        <Route path = "/myrecap" element={<MyRecap />}></Route>
        <Route path = "/getstarted" element={<GetStarted />}></Route>
        <Route path = "/friendslogs" element={<FriendsLogs />}></Route>
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
