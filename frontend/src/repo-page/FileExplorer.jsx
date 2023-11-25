import styles from "../css/RepoPage.module.css"

function FileExplorer() {

    return (
      <>
        <div>
          <div className={styles.left} id="left">
            <div id="file-explorer"></div>
          </div>
          <input className={styles.input} type="text" id="commitMsg"/>
          <div className={styles.newLine}>
            <button id="stageBtn">Stage All</button>
            <button id="commitBtn">Commit</button>
            <button id="exitRepoBtn">Exit Repo</button>
          </div>
        </div>
      </>
    );
  }
  
  export default FileExplorer
  