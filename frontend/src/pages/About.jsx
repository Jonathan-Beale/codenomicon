import styles from '../css/About.module.css';
import jonimage from '../assets/jonimage.png';
import blakeimage from '../assets/blakeimage.png';
import sydneyimage from '../assets/sydneyimage.png';

const About = () => {

    return (
        <>
            <div className={styles.container}>
                <div><h1>ABOUT CODENOMICON</h1></div>
                <div className={styles.paragraph}><h3>Overview</h3>
                    <br></br>
                    <p>Codenomicon is a web-based code editor and collaboration tool designed to streamline the process of coding, testing, and sharing code within a development team. It integrates a powerful code editor, version control functionalities, and an AI chat interface.</p>
                    <br></br>
                    <h3>Features</h3>
                    <br></br>
                    <p>1. <span>Monaco Editor Integration:</span> Utilizes the Monaco Editor for an enriched coding experience, supporting multiple languages and themes.</p>
                    <br></br>
                    <p>2. <span>File Explorer:</span> A dynamic file explorer to navigate through the code repository, allowing users to open and edit files directly in the browser.</p>
                    <br></br>
                    <p>3. <span>Version Control:</span> Includes basic version control functionalities like cloning repositories, staging changes, and deleting repositories.</p>
                    <br></br>
                    <p>4. <span>AI Chat Assistant:</span> Facilitates communication with an AI. The AI can see the file currently open in the editor and can have custom conversation histories loaded into it.</p>
                    <br></br>
                    <h3>Usage</h3>
                    <br></br>
                    <p><span>Editing Code:</span> Open files from the file explorer and edit them in the Monaco Editor. The editor supports various languages and themes.</p>
                    <br></br>
                    <p><span>Version Control:</span> Use the clone, stage, and delete functionalities for basic version control operations.</p>
                    <br></br>
                    <p><span>AI Chatting:</span> Utilize the chat interface to communicate with the AI. The chat history is stored and can be retrieved for reference.</p>
                    <br></br>
                    <h3>Technologies Used</h3>
                    <br></br>
                    <p>- JavaScript (Client and server-side)</p>
                    <p>- Node.js</p>
                    <p>- Express.js</p>
                    <p>- Simple Git</p>
                    <p>- OpenAI API</p>
                    <p>- React/HTML/CSS</p></div>
                <div className={styles.credit}>Created By:</div>
            </div>
            <div className={styles.contributorsContainer}>
                <div className={styles.contributors}>
                    <img src={jonimage} alt="Logo" className={styles.contributorsImage}/>
                    <div className={styles.contributorsText}>
                        <h3>Jon Beale</h3>
                        <h5>Project Manager, Back End</h5>
                    </div>
                </div>
                {/* <div className={styles.contributors}>
                    <img src={blakeimage} alt="Logo" className={styles.contributorsImage}/>
                    <div className={styles.contributorsText}>
                        <h3>Blake Baez</h3>
                        <h5>Dev Ops</h5>
                    </div>
                </div> */}
                <div className={styles.contributors}>
                    <img src={sydneyimage} alt="Logo" className={styles.contributorsImage}/>
                    <div className={styles.contributorsText}>
                        <h3>Sydney Baldwin</h3>
                        <h5>Front End, Secondary Back End</h5>
                    </div>
                </div>
            </div>
        </>
    );
  }
  
  export default About;
