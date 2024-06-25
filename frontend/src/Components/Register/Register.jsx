import './Register.css'

function Register(){
    return(
        <div className='register'>
            <h1>Welcome to Heno</h1>
            <input type="text" placeholder="Name"/>
            <input type="email" placeholder="Email"/>
            <input type="password" placeholder="Password"/>
            <input type="password" placeholder="Confirm Password"/>
            <select>
                <option>Project Manager</option>
                <option>Team Member</option>
            </select>


            <button>Get Started</button>
        </div>
    )
}

export default Register;
