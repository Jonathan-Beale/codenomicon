import React, {useState} from "react";
import "../css/LoginSignup.css";
import {Link} from 'react-router-dom';

function LoginSignup() {
    const [tab, setTab] = useState(1);

    return (
        <>
        <div id="Tab Button" className="tab">
            <button className="tab-button" onClick={()=>setTab(1)} id="tab">
                Existing Users
            </button>
            <button className="tab-button" onClick={()=>setTab(2)}>
                New Users
            </button>
        </div>
        <div id="Log In" className={tab === 1 ? "tab-visible" : "tab-hidden"}>
            <div className="wrapper">
                <h1>Welcome back!</h1>
            <div className="input">
                <input
                id="loginEmail"
                type="email"
                placeholder="Email"
                name="email"
                />
            </div>
            <div className="input">
                <input
                id="loginPassword"
                type="password"
                placeholder="Password"
                name="pw"
                />
            </div>
            <button type="submit" className="submit-button">
                <Link to="/repo-page" style={{color:'white', textDecoration:'none', padding: "60px 0px"}}>Log In</Link>
            </button>
            <div className="message">
                <br />
            </div>
            <div className="message">
                Forgot password? <a href='/forgot'><Link to="/forgot">Recover</Link></a>
            </div>
                <div id="Login Message" className="message" />
            </div>
        </div>
        <div id="Sign Up" className={tab === 2 ? "tab-visible" : "tab-hidden"}>
            <div className="wrapper">
                <h1>Create an account.</h1>
                <div className="input">
                <input
                    id="signupEmail"
                    type="email"
                    placeholder="Email"
                    name="email"
                />
                </div>
                <div className="input">
                <input
                    id="signupPassword"
                    type="password"
                    placeholder="Password"
                    name="pw1"
                />
                </div>
                <div className="input">
                <input
                    id="signupPasswordConfirm"
                    type="password"
                    placeholder="Confirm Password"
                    name="pw2"
                />
                </div>
                <button type="submit" className="submit-button" onClick={event => window.location.href='repopage.html'}>
                    Sign Up
                </button>
                <div className="message">
                    <br />
                </div>
                <div id="Email Message" className="message" />
                <div id="Password Message" className="message" />
            </div>
        </div>
        </>
    );
  }
  
  export default LoginSignup;
  