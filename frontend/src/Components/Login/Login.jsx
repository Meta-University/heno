import "./Login.css"

function Login(){
    return (
        <div className="login">
            <>
                <h1>Log In</h1>
            </>

            <div className="inputs">
                <input type="text" placeholder="Username or email"/>
                <input type="password" placeholder="Password"/>
            </div>

            <div>
                <input type="checkbox"/>
                <span><a href="#">Forgot password?</a></span>
            </div>

            <button className="login-btn">Log In</button>
            <button className="register-btn">Register</button>
        </div>
    )
}

export default Login;
