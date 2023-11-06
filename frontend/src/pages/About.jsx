import './About.css';
import jonimage from '../components/jonimage.png';
import blakeimage from '../components/blakeimage.png';
import sydneyimage from '../components/sydneyimage.png';

function About() {

    return (
        <>
            <div className="container">
                <div><h1>ABOUT CODENOMICON</h1></div>
                <div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                    deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur 
                    adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                    deserunt mollit anim id est laborum.</p></div>
                <div className="credit">Created By:</div>
            </div>
            <div className="contributors">
                <img src={jonimage} alt="Logo" className="contributors-image"/>
                <img src={blakeimage} alt="Logo" className="contributors-image"/>
                <img src={sydneyimage} alt="Logo" className="contributors-image"/>
            </div>
            <div className="contributors">
                <div className="contributors-text">
                    <h3>Jon Beale</h3>
                    <h5>Project Manager, Back End</h5>
                </div>
                <div className="contributors-text">
                    <h3>Blake Baez</h3>
                    <h5>Dev Ops</h5>
                </div>
                <div className="contributors-text">
                    <h3>Sydney Baldwin</h3>
                    <h5>Front End</h5>
                </div>
            </div>
        </>
    );
  }
  
  export default About;
  