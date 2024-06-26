import "./Login.css"
import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";



function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleLogin(event){
        event.preventDefault();
        try{
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                }),
                credentials: "include"
            });
            if(response.ok){
                const data = await response.json();
                const loggedInUser = data.user;
                navigate("/projects");

            } else{
                alert("Login failed");
            }

        } catch(error){
            console.log(error);

        }

    }

    function navigateToSignup(){
        navigate("/signup");
    }

    return (
        <div className="login">
            <>
                <h1>Log In</h1>
            </>

            <form onSubmit={handleLogin}>
                <div className="inputs">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value) }/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
    {/*
                <div>
                    <input type="checkbox"/>
                    <span><a href="#">Forgot password?</a></span>
                </div> */}

                <button className="login-btn" onClick={handleLogin}>Log In</button>
                <button className="register-btn" onClick={navigateToSignup} >Signup</button>

            </form>

        </div>
    )
}

export default Login;
