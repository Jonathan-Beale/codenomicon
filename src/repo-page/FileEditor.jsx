import styles from "../css/RepoPage.module.css"

function FileEditor() {

    return (
      <>
      <div className={styles.middle} id="middle">
        <div className={styles.goBox} id="go-box">
          <input className={styles.input} type="text" id="repoUrlInput" placeholder="Enter the repository URL" />
          <button id="cloneBtn">Clone Repository</button>
          <button id="testBtn">Test Button</button>
        </div>
        <div id="editor-tabs"></div>
        <div id="monaco-editor" className={styles.monacoEditor}>
        </div>
      </div>
      </>
    );
  }
  
  export default FileEditor
