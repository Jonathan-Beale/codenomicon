import React, { useState } from "react";
import Popup from 'reactjs-popup';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from 'axios';
const backendUrl = 'http://localhost:4000';

const Header = ({ toggleMatrixRain }) => {
    let model

    // State to track input values
    const [openaiKey, setOpenaiKey] = useState('');
    const [githubToken, setGithubToken] = useState('');

    // Function to handle input changes and enable/disable checkmark buttons
    const handleOpenaiKeyChange = (event) => {
        setOpenaiKey(event.target.value);
    };

    const handleGithubTokenChange = (event) => {
        setGithubToken(event.target.value);
    };

    // Show selection in custom dropdown
    async function handleClick(value){
        if (value == 1){
            model = "gpt-3.5-turbo"
        }
        else if (value == 2){
            model = "gpt-3.5-turbo-16k";
        }
        else if (value == 3){
            model = "gpt-4";
        }
        else if (value == 4){
            model = "gpt-4-32k";
        }
        document.getElementById("dropdownButton").innerHTML = model;

        await axios.post(`${backendUrl}/set-model`, { modelType: model }, { withCredentials: true })
    }

    async function updateGithubToken() {
        await axios.post(`${backendUrl}/set-github-token`, { githubToken: githubToken }, { withCredentials: true })
        
        setGithubToken('');
    }

    async function updateOAIToken() {
        await axios.post(`${backendUrl}/set-openai-token`, { oaiKey: openaiKey }, { withCredentials: true })
        
        setOpenaiKey('');
    }

    return (
        <div className={styles.header}>
            <div className={styles.text}>
                CODENOMICON
            </div>
            <div className={styles.buttons}>
                <div className={styles.button} type="button">
                    <Link to="/" style={{ textDecoration:'none'}}>HOME</Link>
                </div>
                <div className={styles.button} type="button">
                    <Link to="/about" style={{ textDecoration:'none'}}>ABOUT</Link>
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
                                    <div className={styles.inputWrapper}>
                                        <h2 className={styles.settingsLabel}>OpenAI Key:</h2>
                                        <input
                                            type="text"
                                            id="OAIToken"
                                            className={styles.settingsInput}
                                            placeholder="Enter your OpenAI key"
                                            value={openaiKey}
                                            onChange={handleOpenaiKeyChange}
                                        />
                                        {openaiKey && <button onMouseUp={updateOAIToken} className={styles.checkBtn}>✓</button>}
                                    </div>
                                    <div className={styles.inputWrapper}>
                                        <h2 className={styles.settingsLabel}>Github Key:</h2>
                                        <input
                                            type="text"
                                            id="GithubToken"
                                            className={styles.settingsInput}
                                            placeholder="Enter your GitHub token"
                                            value={githubToken}
                                            onChange={handleGithubTokenChange}
                                        />
                                        {githubToken && <button onMouseUp={updateGithubToken} className={styles.checkBtn}>✓</button>}
                                    </div>
                                    <div className={styles.inputWrapper}>
                                    <h2 className={styles.settingsLabel}>Chat Model:</h2>
                                    <div className={styles.dropdown}>
                                        <button id="dropdownButton" className={styles.dropdownButton}></button>
                                        <div className={styles.dropdownOptions}>
                                            <button className={styles.option} id="gpt-3.5-turbo" onClick={() => handleClick(1)}>gpt-3.5-turbo</button>
                                            <button className={styles.option} id="gpt-3.5-turbo-16k" onClick={() => handleClick(2)}>gpt-3.5-turbo-16k</button>
                                            <button className={styles.option} id="gpt-4" onClick={() => handleClick(3)}>gpt-4</button>
                                            <button className={styles.option} id="gpt-4-32k" onClick={() => handleClick(4)}>gpt-4-32k</button>
                                        </div>
                                    </div>
                                    </div>
                                    {/* <button type="submit" className={styles.submitButton} onMouseUp={() => {updateGithubToken; updateOAIToken; close()}}>
                                    SUBMIT
                                    </button> */}
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
