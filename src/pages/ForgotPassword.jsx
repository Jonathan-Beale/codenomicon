import styles from '../css/ForgotPassword.module.css';
import {Link} from 'react-router-dom';

function ForgotPassword() {

    return (
        <>
        <div className={styles.passwordTitle}>
            <div className={styles.passwordMessage}><h2>Forgot Password?</h2></div>
        </div>
        <div className={styles.inputBox}>
            <div className={styles.msg}>
                Enter your email.</div>
            <div className={styles.input}>
                <input
                    id="Email"
                    type="email"
                    placeholder="Email"
                    name="email"
                    />
                </div>
                <button className={styles.recoverButton}>
                    <Link to="/" style={{ textDecoration:'none', color:'white'}}>Recover Password</Link>
                </button>
                <div className={styles.msg}>
                    A recovery email will be sent to your account.</div>
            </div>
        </>
    );
  }
  
  export default ForgotPassword;
  