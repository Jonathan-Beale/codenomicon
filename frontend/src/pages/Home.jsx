import styles from '../css/Home.module.css';
import logo from '../assets/logo.png';
import {Link} from 'react-router-dom';

const Home = () => {

    return (
        <>
        <div className={styles.slogan}>
            <img src={logo} alt="Logo" className={styles.image}/>
            <div className={styles.sloganText}>Limitless code at your fingertips.</div>
        </div>
        <br />
        <div className={styles.homeWrapper}>
            <div className={styles.info}>
            A free tool that allows you to quickly access your GitHub repos and complete projects more efficiently, with the help of an AI assistant.
            </div>
            <button className={styles.homeButton}>
                <Link to="/login" style={{color:'white', textDecoration:'none'}}>Get Started</Link>
            </button>
        </div>
        </>
    );
  }
  
  export default Home;
  