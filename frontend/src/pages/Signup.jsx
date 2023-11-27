import React, {useState} from "react";
import styles from "../css/LoginSignup.module.css";
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
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
                `http://localhost:4000/signup`,
                {
                    ...inputValue,
                },
            );
            console.log(response.data);
            const { success, message } = response.data;
            if (success){
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                handleError(message);
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
                <Link to="/login" style={{color:'white', textDecoration:'none', padding: "60px 0px"}}>Existing Users</Link>
            </button>
            <button className={styles.tabButton}>
                New Users
            </button>
        </div>
        <form onSubmit={handleSubmit}>
            <div id="Sign Up" className={styles.tabVisible}>
                <div className={styles.wrapper}>
                    <h1>Create an account.</h1>
                    <div className={styles.input}>
                    <input
                        id="signupEmail"
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={handleOnChange}
                    />
                    </div>
                    <div className={styles.input}>
                    <input
                        id="signupPassword"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={handleOnChange}
                    />
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        Sign Up
                    </button>
                    <br />
                </div>
            </div>
        </form>
        </>
    );
  }
  
  export default Signup;
  