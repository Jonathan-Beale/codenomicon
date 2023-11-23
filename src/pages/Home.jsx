import './Home.css';
import logo from '../components/logo.png';
import {Link} from 'react-router-dom';

function Home() {

    return (
        <>
        <div className="slogan">
            <img src={logo} alt="Logo" className="image"/>
            <div className="slogan-text">Limitless code at your fingertips.</div>
        </div>
        <br />
        <div className="home-wrapper">
            <div className="info">
            A free tool that allows you to quickly access your GitHub repos and complete projects more efficiently, with the help of an AI assistant.
            </div>
            <button className="home-button">
                <Link to="/" style={{color:'white', textDecoration:'none'}}>Get Started</Link>
            </button>
        </div>
        </>
    );
  }
  
  export default Home;
  