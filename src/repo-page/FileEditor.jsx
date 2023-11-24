import "../css/RepoPage.css"

function FileEditor() {

    return (
      <>
      <div className="middle" id="middle">
        <div className="go-box" id="go-box">
          <input type="text" id="repoUrlInput" placeholder="Enter the repository URL" />
          <button id="cloneBtn">Clone Repository</button>
          <button id="testBtn">Test Button</button>
        </div>
        <div id="editor-tabs"></div>
        <div id="monaco-editor" className="monaco-editor">
        </div>
      </div>
      </>
    );
  }
  
  export default FileEditor
