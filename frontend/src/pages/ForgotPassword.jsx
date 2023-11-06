import './ForgotPassword.css';
import {Link} from 'react-router-dom';

function ForgotPassword() {

    return (
        <>
        <div className="password-title">
            <div className="password-message"><h2>Forgot Password?</h2></div>
        </div>
        <div className="input-box">
            <div class="msg">
                Enter your email.</div>
            <div className="input">
                <input
                    id="Email"
                    type="email"
                    placeholder="Email"
                    name="email"
                    />
                </div>
                <button className="recover-button">
                    <Link to="/" style={{ textDecoration:'none', color:'white'}}>Recover Password</Link>
                </button>
                <div class="msg">
                    A recovery email will be sent to your account.</div>
            </div>
        </>
    );
  }
  
  export default ForgotPassword;
  