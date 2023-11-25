import React, {useState} from "react";
import styles from "../css/LoginSignup.module.css";
import {Link} from 'react-router-dom';

function Signup() {

    return (
        <>
        <div id="Tab Button" className={styles.tab}>
            <button className={styles.tabButton}>
                <Link to="/" style={{color:'white', textDecoration:'none', padding: "60px 0px"}}>Existing Users</Link>
            </button>
            <button className={styles.tabButton}>
                New Users
            </button>
        </div>
        <div id="Sign Up" className={styles.tabVisible}>
            <div className={styles.wrapper}>
                <h1>Create an account.</h1>
                <div className={styles.input}>
                <input
                    id="signupEmail"
                    type="email"
                    placeholder="Email"
                    name="email"
                />
                </div>
                <div className={styles.input}>
                <input
                    id="signupPassword"
                    type="password"
                    placeholder="Password"
                    name="pw1"
                />
                </div>
                <div className={styles.input}>
                <input
                    id="signupPasswordConfirm"
                    type="password"
                    placeholder="Confirm Password"
                    name="pw2"
                />
                </div>
                <button type="submit" className={styles.submitButton}>
                    <Link to="/repo-page" style={{color:'white', textDecoration:'none', padding: "0px 60px"}}>Sign Up</Link>
                </button>
                <br />
            </div>
        </div>
        </>
    );
  }
  
  export default Signup;
  