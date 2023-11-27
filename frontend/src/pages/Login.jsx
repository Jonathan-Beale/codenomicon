import React, {useState} from "react";
import styles from "../css/LoginSignup.module.css";
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    // Accessing backend
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
    });
    const {email, password} = inputValue;
    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:4000/login`,
                {
                    ...inputValue,
                },
            );
            const {success, message} = response.data;
            if (success){
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            }
        } catch (error){
            console.log(error);
        }
        setInputValue({
            ...inputValue,
            email: "",
            password: "",
        });
    };

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
        <form onSubmit={handleSubmit}>
            <div id="Log In" className={styles.tabVisible}>
                <div className={styles.wrapper}>
                    <h1>Welcome back!</h1>
                <div className={styles.input}>
                    <input
                    id="loginEmail"
                    type="email"
                    value={email}
                    placeholder="Email"
                    name="email"
                    onChange={handleOnChange}
                    />
                </div>
                <div className={styles.input}>
                    <input
                    id="loginPassword"
                    type="password"
                    value={password}
                    placeholder="Password"
                    name="password"
                    onChange={handleOnChange}
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    Log In
                </button>
                <div className={styles.message}>
                    <br />
                </div>
                <div className={styles.message}>
                    Forgot password? <Link to="/forgot" style={{textDecoration:'underline'}}>Recover</Link>
                </div>
                </div>
            </div>
        </form>
        </>
    );
  }
  
  export default Login;
  