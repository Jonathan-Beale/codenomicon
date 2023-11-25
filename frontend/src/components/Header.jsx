import React from "react";
import styles from './Header.module.css';
import { Link } from 'react-router-dom';

const Header = ({ toggleMatrixRain }) => {
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
                <div className={styles.button} type="button">
                    <Link to="/log-out" style={{ textDecoration:'none'}}>LOG OUT</Link>
                </div>
                <div className={styles.button} type="button" id="settingsBtn">
                    <Link to="/settings" style={{ textDecoration:'none'}}>SETTINGS</Link>
                </div>
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
