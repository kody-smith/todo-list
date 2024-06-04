import React, { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import './welcome.css';
import logo from '../images/checklist.png';

export default function Welcome() {
    const [email,setEmail] = useState('');
    const [pass,setPass] = useState('');
    const [isSigning, setIsSigning] = useState(false);
    const [signUpInfo, setSignUpInfo] = useState({
        email: "",
        confirmEmail: "",
        pass: "",
        confirmPass: ""
    });

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                nav("/homepage");
            }
        })
    });

    const emailChange = (e) => {
        setEmail(e.target.value);
    };

    const passChange = (e) => {
        setPass(e.target.value);
    };
    const signIn = () => {
        signInWithEmailAndPassword(auth,email,pass)
            .then(() => {
                nav('/homepage')
            })
            .catch(err => 
                alert(err.message)
            );
    };

    const signUp = () => {
        if (signUpInfo.email !== signUpInfo.confirmEmail || signUpInfo.password !== signUpInfo.confirmPassword) {
            alert('Email or password do not match! Please enter your email and password again.');
            return
        }
        createUserWithEmailAndPassword(auth, signUpInfo.email, signUpInfo.pass)
            .then(() => {
                nav('/homepage')
            })
            .catch(err => 
                alert(err.message)
            );
    };

    return (
        <div className="welcome">
            <h1 className="sign-in-heading"><img id="logoImg" src={ logo }></img>Todo List</h1>
            <div className='login-signin-container'>
                {isSigning ? (
                    <>
                    <form id='loginForm'>
                        <label id="emailIdLabel" htmlFor='emailId'>
                            Email: <input id="emailId" type="email" placeholder="Email" value={signUpInfo.email} onChange={(e) => setSignUpInfo({...signUpInfo, email: e.target.value})}></input>
                        </label>
                        <label id="confirmEmailLabel" htmlFor='confirmEmail'>
                            Confirm Email: <input id="confirmEmail" type="email" placeholder="Confirm Email" value={signUpInfo.confirmEmail} onChange={(e) => setSignUpInfo({...signUpInfo, confirmEmail: e.target.value})}></input>
                        </label>
                        <label id="passwordIdLabel" htmlFor='passwordId'>
                            Password: <input id="passwordId" type="password" placeholder="Password" value={signUpInfo.pass} onChange={(e) => setSignUpInfo({...signUpInfo, pass: e.target.value})}></input>
                        </label>
                        <label id="confirmPassLabel" htmlFor='confirmPass'>
                            Confirm Password: <input id="confirmPass" type="password" placeholder="Confirm Password" value={signUpInfo.confirmPass} onChange={(e) => setSignUpInfo({...signUpInfo, confirmPass: e.target.value})}></input>
                        </label>
                        <div className="sign-up-btn-container">
                            <button className='sign-up-btn' onClick={signUp}>Sign Up</button>
                            <button className='back-btn' onClick={() => setIsSigning(false)}>Go Back</button>
                        </div>
                    </form>
                </>
                ) : (
                    <>
                        <label htmlFor={"emailSignIn"}>Email</label>
                        <input id="emailSignIn" type="email" placeholder="Email" onChange={emailChange} value={email}></input>
                        <label htmlFor={"passSignIn"}>Password</label>
                        <input id="passSignIn" type="password" placeholder="Password" onChange={passChange} value={pass}></input>
                        <button id="signInBtn" onClick={signIn}>Log In</button>
                        <a onClick={() => setIsSigning(true)}>New Here? <span id="createAcctLink">Create an Account</span></a>
                    </>
                )}
            </div>
        </div>
    )
}