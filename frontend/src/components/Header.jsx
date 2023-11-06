import React from "react";
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div class="header">
            <div class="text">
                CODENOMICON
            </div>
            <div class="buttons">
                <div class="button" type="button">
                    <Link to="/home" style={{ textDecoration:'none'}}>HOME</Link>
                </div>
                <div class="button" type="button">
                    <Link to="/about" style={{ textDecoration:'none'}}>ABOUT</Link>
                </div>
            </div>
        </div>
    );
}

export default Header;
