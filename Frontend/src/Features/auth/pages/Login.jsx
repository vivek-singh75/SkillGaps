import React, { useState } from 'react'
import "../form.style.scss"
import { Link, useNavigate } from 'react-router-dom'
import  {useAuth}  from '../hooks/useAuth'
import Loading from '../components/loadingAnimation/Loading'

const Login = () => {

    const navigate = useNavigate()

    const {loading, handleLogin} = useAuth()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')


    const formHandler= async (e)=>{
        e.preventDefault()
        await handleLogin({email , password})
        navigate('/')
    }

    if(loading){
        return (<main>{<Loading label='Login...'/>}</main>)
    }

  return (
    <main>
        <div className="form-Container">
            <h1>Login</h1>

            <form>
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
                >Login</button>
            </form>

            <p >don't have an Account <Link to={"/register"}>  Create Account</Link></p>

        </div>
    </main>
  )
}

export default Login