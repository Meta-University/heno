import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import Navbar from "./Components/Navbar/Navbar";

function App() {


  return (
    <Router>

      <Navbar />
      <Routes>
        <Route path="/" />
        <Route path="/login" element={<Login />}/>
        <Route path='/register' element={<Register />} />

      </Routes>

    </Router>

  )
}

export default App
