import React from "react";
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
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
            </div>
        </div>
    );
}

export default Header;
