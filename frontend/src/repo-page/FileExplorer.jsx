import React, { useState } from 'react';
import styles from "../css/RepoPage.module.css"
import axios from 'axios';
const backendUrl = 'http://localhost:4000';

function FileExplorer({ onRepoCloned }) {

  const [showRepoBox, setShowRepoBox] = useState(true);
  const [showCommitBox, setShowCommitBox] = useState(false);

  function getSessionID() {
    return "Test/"
  }

  const cloneRepo = async () => {
    const repoUrlInput = document.getElementById("repoUrlInput");
    const repoUrl = repoUrlInput.value;
    console.log(repoUrl)
    const sessionID = getSessionID()
    try {
      const response = await axios.post(`${backendUrl}/clone`, {
        repoUrl: repoUrl,
        localPath: sessionID,
      })
  
      // Check the response for success or failure
      if (response.status === 200) {
        const { message, readme } = response.data;
        console.log(message);
        if (readme) {
          console.log('README Content:', readme);
          onRepoCloned(readme)
        }
      } else {
        console.error('Failed to clone repository:', response.data);
      }
    } catch (error) {
      console.error('Error cloning repository:', error);
    }
  };

  const stageAllFiles = async () => {
    const sessionID = getSessionID()
    try {
      const response = await axios.post(`${backendUrl}/stage-all`, {
        localPath: sessionID,
      });
  
      // Check the response for success or failure
      if (response.status === 200) {
        const message = response.data;
        console.log(message);
      } else {
        console.error('Failed to stage all files:', response.data);
      }
    } catch (error) {
      console.error('Error staging all files:', error);
    }
  };

  const commitChanges = async () => {
    const commitMsg = document.getElementById("commitMsg").value;
    try {
      let localPath = getSessionID()
      const response = await axios.post(`${backendUrl}/commit`, {
        localPath: localPath,
        commitMessage: commitMsg,
      });
  
      // Check the response for success or failure
      if (response.status === 200) {
        const message = response.data;
        console.log(message);
      } else {
        console.error('Failed to commit changes:', response.data);
      }
    } catch (error) {
      console.error('Error committing changes:', error);
    }
  };
  
  const publishRepository = async () => {
    let localPath = "Test/"
    let remoteName = "origin"
    let branchName = "main"
    let githubToken = "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"
    try {
      const response = await axios.post(`${backendUrl}/publish-repo`, {
        localPath: localPath,
        remoteName: remoteName,
        branchName: branchName,
        githubToken: githubToken,
      });
  
      // Check the response for success or failure
      if (response.status === 200) {
        const message = response.data;
        console.log(message);
      } else {
        console.error('Failed to publish repository:', response.data);
      }
    } catch (error) {
      console.error('Error publishing repository:', error);
    }
  };
  

  return (
    <>
      <div>
        <div className={styles.left} id="left">
          <div className={styles.goBox} id="go-box">
            <input className={styles.input} type="text" id="repoUrlInput" placeholder="Enter the repository URL" />
            <button onMouseUp={cloneRepo}>Clone Repository</button>
          </div>
          <div id="file-explorer"></div>
        </div>
        <input className={styles.input} type="text" id="commitMsg"/>
        <div className={styles.newLine}>
          <button id="stageBtn" onMouseUp={stageAllFiles}>Stage All</button>
          <button id="commitBtn" onMouseUp={commitChanges}>Commit</button>
          <button id="exitRepoBtn" onMouseUp={publishRepository}>Publish Repo</button>
        </div>
      </div>
    </>
  );
}

export default FileExplorer
  