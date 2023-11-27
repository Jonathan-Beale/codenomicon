import ChatHistory from "./repo-page/ChatHistory";
import FileExplorer from "./repo-page/FileExplorer";
import styles from "./css/RepoPage.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from 'axios';

// import * as monaco from 'monaco-editor';

// Protecting repo page
const RepoPage = () => {
    const navigate = useNavigate();
    const cookies = useCookies();
    useEffect(() => {
      const verifyCookie = async () => {
        if (!cookies.token){
          // navigate("/login");
        }
        try {
        const response = await axios.post(
            `http://localhost:4000/`,
          {}
        );
        } catch (error){
          console.log(error);
        };
      };
      verifyCookie();
    }, [cookies, navigate]);

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
