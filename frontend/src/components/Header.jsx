import React from "react";
import Popup from 'reactjs-popup';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Header = ({ toggleMatrixRain }) => {
    // Show selection in custom dropdown
    function handleClick(value){
        if (value == 1){
            document.getElementById("dropdownButton").innerHTML = "gpt-3.5-turbo";
        }
        else if (value == 2){
            document.getElementById("dropdownButton").innerHTML = "gpt-3.5-turbo-16k";
        }
        else if (value == 3){
            document.getElementById("dropdownButton").innerHTML = "gpt-4";
        }
        else if (value == 4){
            document.getElementById("dropdownButton").innerHTML = "gpt-4-32k";
        }
    }

    // Logout button functionality
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const Logout = () => {
        if (cookies.token){
            removeCookie("token");
            navigate("/login");
        }
    };

    return (
        <div className={styles.header}>
            <div className={styles.text}>
                CODENOMICON
            </div>
            <div className={styles.buttons}>
                <div className={styles.button} type="button">
                    <Link to="/home" style={{ textDecoration:'none'}}>HOME</Link>
                </div>
                <div className={styles.button} type="button">
                    <Link to="/about" style={{ textDecoration:'none'}}>ABOUT</Link>
                </div>
                <div className={styles.button} onClick={Logout} type="button">
                    <Link to="/login" style={{ textDecoration:'none'}}>LOG IN/OUT</Link>
                </div>
                <Popup trigger={<div className={styles.button} type="button" id="settingsBtn">
                    <Link to="" style={{ textDecoration:'none'}} onClick={(event) => event.preventDefault()}>SETTINGS</Link></div>}>
                        {
                            close => (
                            <div className={styles.overlay}>
                                <div className={styles.wrapper}>
                                    <button className={styles.x} onClick={() => close()}>X</button>
                                    <br/>
                                    <h1>SETTINGS:</h1>
                                    <input type="text" className={styles.input} placeholder="Enter your OpenAI key"/>
                                    <input type="text" className={styles.input} placeholder="Enter your GitHub token"/>
                                    <h3>Select a model:</h3>
                                    <div className={styles.dropdown}>
                                        <button id="dropdownButton" className={styles.dropdownButton}></button>
                                        <div className={styles.dropdownOptions}>
                                            <button className={styles.option} id="gpt-3.5-turbo" onClick={() => handleClick(1)}>gpt-3.5-turbo</button>
                                            <button className={styles.option} id="gpt-3.5-turbo-16k" onClick={() => handleClick(2)}>gpt-3.5-turbo-16k</button>
                                            <button className={styles.option} id="gpt-4" onClick={() => handleClick(3)}>gpt-4</button>
                                            <button className={styles.option} id="gpt-4-32k" onClick={() => handleClick(4)}>gpt-4-32k</button>
                                        </div>
                                    </div>
                                    <button type="submit" className={styles.submitButton} onClick={() => close()}>
                                    SUBMIT
                                    </button>
                                </div>
                            </div>
                            )
                        }
                </Popup>
                <label className={styles.switch} onMouseUp={toggleMatrixRain}>
                    <p>Matrix Rain</p>
                    <div>
                        <input type="checkbox" id="rainToggle"/>
                        <span className={styles.slider}></span>
                    </div>
                </label>
            </div>
        </div>
    );
}

export default Header;
