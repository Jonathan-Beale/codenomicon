import React from "react";
import './Header.css';
import { Link } from 'react-router-dom';

const Header = ({ toggleMatrixRain }) => {
    return (
        <div className="header">
            <div className="text">
                CODENOMICON
            </div>
            <div className="buttons">
                <div className="button" type="button">
                    <Link to="/home" style={{ textDecoration:'none'}}>HOME</Link>
                </div>
                <div className="button" type="button">
                    <Link to="/about" style={{ textDecoration:'none'}}>ABOUT</Link>
                </div>
                <div className="button" type="button">
                    <Link to="/log-out" style={{ textDecoration:'none'}}>LOG OUT</Link>
                </div>
                <div className="button" type="button" id="settingsBtn">
                    <Link to="/settings" style={{ textDecoration:'none'}}>SETTINGS</Link>
                </div>
                <label className="switch" onMouseUp={toggleMatrixRain}>
                    <p>Matrix Rain</p>
                    <div>
                    <input type="checkbox" id="rainToggle"/>
                    <span className="slider"></span>
                    </div>
                </label>
            </div>
        </div>
    );
}

export default Header;
