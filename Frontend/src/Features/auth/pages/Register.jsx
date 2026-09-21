import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/loadingAnimation/Loading';

const Register = () => {

    const navigate = useNavigate()
    const {loading , handleRegister } = useAuth()
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const formHandler=async (e)=>{
        e.preventDefault()
        await handleRegister({username, email , password});
        navigate('/login')
    }

     if(loading){
        return (<main>{<Loading label='Creating...'/>}</main>)
    }
  return (
    <main>
        <div className="form-Container">
            <h1>Register</h1>

            <form>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                    onChange={(e)=>{setUsername(e.target.value)}}
                    type="username" placeholder='Enter your username' required/>
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e)=>{setEmail(e.target.value)}}
                    type="email" placeholder='Enter your email' required/>
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                    onChange={(e)=>{setPassword(e.target.value)}}
                    type="password" placeholder='Enter your Password' required/>
                </div>

                <button className='button primary-button' 
                onClick={formHandler}
                >Register</button>
            </form>

            <p >Already havea an Account <Link to={"/login"}>  Login</Link></p>
        </div>
    </main>
  )
}


export default Register