import './Signup.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup(){
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');

    async function handleSignup(event){
        event.preventDefault();
        try{
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    confirmPassword,
                    role
                }),
                credentials : 'include'
            });

            const data = await response.json();
            navigate("/projects")

            if(data.error){
                alert(data.error);
            }

        } catch(error){
            console.log(error);
        }

    }


    return(
        <div className='signup'>
            <h1>Welcome to Heno</h1>
            <form onSubmit={handleSignup}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                <select name='role' onChange={(e) => setRole(e.target.value)} >
                    <option value="public">Select Role</option>
                    <option value="PM">Project Manager</option>
                    <option value="TM">Team Member</option>
                </select>
                <button>Get Started</button>

            </form>

        </div>
    )
}

export default Signup;
