import ChatHistory from "./repo-page/ChatHistory";
import FileExplorer from "./repo-page/FileExplorer";
import styles from "./css/RepoPage.module.css";
// import * as monaco from 'monaco-editor';

function RepoPage() {

  let editorInstance = null

  function initializeEditor() {
    let editorDiv = document.getElementById('monaco-editor');

    globalEditorInstance = monaco.editor.create(editorDiv, {
      theme: 'vs-dark',
      language: 'markdown'
    });

    tabBar = document.getElementById('editor-tabs')

    userID = './TEST_USER'

    // For testing only
    sessionStorage.setItem('conversationId', 'testID');
  }

  return (
    <>
      <div className={styles.repoWrapper}>
          <FileExplorer initializeEditor={ initializeEditor }/>
          <div className={styles.middle} id="middle">
            <div id="editor-tabs"></div>
            <div id="monaco-editor" className={styles.monacoEditor}>
            </div>
          </div>
          <ChatHistory/>
      </div>
    </>
  );
}

export default RepoPage
