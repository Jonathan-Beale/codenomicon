import React, {useState} from "react";
import styles from "../css/LoginSignup.module.css";
import {Link} from 'react-router-dom';

function Login() {

    return (
        <>
        <div id="Tab Button" className={styles.tab}>
            <button className={styles.tabButton}>
                Existing Users
            </button>
            <button className={styles.tabButton}>
                <Link to="/signup" style={{color:'white', textDecoration:'none', padding: "60px 0px"}}>New Users</Link>
            </button>
        </div>
        <div id="Log In" className={styles.tabVisible}>
            <div className={styles.wrapper}>
                <h1>Welcome back!</h1>
            <div className={styles.input}>
                <input
                id="loginEmail"
                type="email"
                placeholder="Email"
                name="email"
                />
            </div>
            <div className={styles.input}>
                <input
                id="loginPassword"
                type="password"
                placeholder="Password"
                name="pw"
                />
            </div>
            <button type="submit" className={styles.submitButton}>
                <Link to="/repo-page" style={{color:'white', textDecoration:'none', padding: "0px 60px"}}>Log In</Link>
            </button>
            <div className={styles.message}>
                <br />
            </div>
            <div className={styles.message}>
                Forgot password? <Link to="/forgot" style={{textDecoration:'underline'}}>Recover</Link>
            </div>
            </div>
        </div>
        </>
    );
  }
  
  export default Login;
  