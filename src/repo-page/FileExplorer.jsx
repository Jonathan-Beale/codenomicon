import "../css/RepoPage.css"

function FileExplorer() {

    return (
      <>
        <div>
          <div className="left" id="left">
            <div id="file-explorer"></div>
          </div>
          <input type="text" id="commitMsg"/>
          <button id="stageBtn">Stage All</button>
          <button id="commitBtn">Commit</button>
          <button id="exitRepoBtn">Exit Repo</button>
        </div>
      </>
    );
  }
  
  export default FileExplorer
  