import React, { useState, useEffect } from 'react';
import styles from "../css/RepoPage.module.css"
import axios from 'axios';
const backendUrl = 'http://localhost:4000';
const testPath = ""


const FileExplorer = ({ onFileSelect, refresh }) => {
  const [fileStructure, setFileStructure] = useState([]);
  const [showGoBox, setShowGoBox] = useState(true);


  const cloneRepo = async () => {
    const repoUrlInput = document.getElementById("repoUrlInput");
    const repoUrl = repoUrlInput.value;
    console.log(repoUrl)
    const localPath = testPath
    try {
      const response = await axios.post(`${backendUrl}/clone`, 
      {
        repoUrl: repoUrl
      },
      {
        withCredentials: true
      })
  
      // Check the response for success or failure
      if (response.status === 200) {
        const { message, readme } = response.data;
        console.log(message);
        if (readme) {
          console.log('README Content:', readme);
          // onRepoCloned(readme)
        }
        const structure = await fetchFileStructure(localPath);
        setFileStructure(structure);
        setShowGoBox(false);
      } else {
        console.error('Failed to clone repository:', response.data);
      }
    } catch (error) {
      console.error('Error cloning repository:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      cloneRepo();
    }
  };
  
  const fetchFileStructure = async (localPath) => {
    try {
      const response = await axios.post(`${backendUrl}/list-files`,
      {
        folderName: localPath
      },
      {
        withCredentials: true,
      });
      console.log(response)
      // Check the response for success or failure
      if (response.status === 200) {
        const message = response.data;
        console.log(message);
        return message
      } else {
        console.error('Failed to stage all files:', response.data);
      }
    } catch (error) {
      console.error('Error staging all files:', error);
    }
  };

  const refreshFileStructure = async () => {
    const structure = await fetchFileStructure(testPath); // Assuming testPath is your root directory
    console.log(structure)
    setFileStructure(structure);
  };
  

  const toggleFolder = async (folder, event) => {
    event.stopPropagation();
  
    // Function to recursively update the file structure
    const updateFileStructure = (files, path, folderContent) => {
      return files.map(file => {
        if (file.path === path) {
          const isCurrentlyVisible = file.isVisible || false;
          // Check if we have new content to load, if so, set it and make visible
          if (folderContent) {
            return { ...file, children: folderContent, isVisible: true };
          } else {
            // If no new content, just toggle the visibility
            return { ...file, isVisible: !isCurrentlyVisible };
          }
        } else if (file.isDirectory && file.children) {
          return { ...file, children: updateFileStructure(file.children, path, folderContent) };
        } else {
          return file;
        }
      });
    };

    // Determine if the folder's contents need to be loaded
  const needToLoadContent = !folder.children || folder.children.length === 0;
  let folderContent = null;
  if (needToLoadContent) {
    folderContent = await fetchFileStructure(folder.path);
  }
  
    // Update the file structure state
    setFileStructure(prevStructure =>
      updateFileStructure(prevStructure, folder.path, folderContent)
    );
  };
  
  // Recursive component to display files and folders
  const FileTree = ({ files }) => {

    if (!files || files.length === 0) {
      return <p className={styles.file}>No files to display.</p>;
    }

  
    

    return (
      <div className={styles.fileExplorer}>
        {files.map(file => (
          <div key={file.path}>
            {file.isDirectory ? (
              <div className={styles.directory} onClick={(event) => {
                toggleFolder(file, event)
              }}>
                <b>{file.name}</b>
                {file.isVisible && <FileTree  files={file.children || []} />}
              </div>
            ) : (
              <p className={styles.file} onMouseUp={(event) => {
                event.stopPropagation()
                onFileSelect(file.path)
              }}>{file.name}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const stageAllFiles = async () => {
    try {
      const response = await axios.post(`${backendUrl}/stage-all`, {}, { withCredentials: true });
  
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

  
  const [commitMsg, setCommitMsg] = useState(""); // State for commit message
  const [showCommitInput, setShowCommitInput] = useState(false); // State to toggle commit message input

  // Function to handle commit message input change
  const handleCommitMessageChange = (e) => {
    setCommitMsg(e.target.value);
  };

  // Function to initiate the commit process
  const initiateCommit = () => {
    setShowCommitInput(true);
  };
  
  // Function to cancel the commit process
  const cancelCommit = () => {
    setShowCommitInput(false);
    setCommitMsg(""); // Reset commit message
  };

  // Function to actually commit changes
  const commitChanges = async () => {
    if (!commitMsg) {
      alert("Please enter a commit message.");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/commit`, { commitMessage: commitMsg },
      { withCredentials: true });

      // Check the response for success or failure
      if (response.status === 200) {
        const message = response.data;
        console.log(message);
      } else {
        console.error('Failed to commit changes:', response.data);
      }
    } catch (error) {
      console.error('Error committing changes:', error);
    } finally {
      setShowCommitInput(false);
      setCommitMsg(""); // Reset commit message
    }
  };

  const publishRepository = async () => {
    let remoteName = "origin"
    let branchName = "main"
    let githubToken = "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"
    try {
      const response = await axios.post(`${backendUrl}/publish-repo`, {
        remoteName: remoteName,
        branchName: branchName,
        githubToken: githubToken,
      },
      { withCredentials: true });
  
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


  useEffect(() => {
    refresh(() => refreshFileStructure);
  }, [refresh]);

    return (
        <div className={styles.left}>
            <h2 className={styles.explorerHeader}>File Explorer</h2>
            <ul>
              {showGoBox && ( // Conditional rendering of go-box
                <div className={styles.goBox} id="go-box">
                  <input className={styles.input} type="text" id="repoUrlInput" onKeyUp={handleKeyPress} placeholder="Enter the repository URL" />
                  <button onMouseUp={cloneRepo}>Clone Repository</button>
                </div>
              )}
              <div className={styles.explorer}>
                <FileTree files={fileStructure} />
              </div>
            </ul>
            <div className={styles.newLine}>
              <button id="stageBtn" onMouseUp={stageAllFiles}>Stage All</button>
              <button id="commitBtn" onMouseUp={initiateCommit}>Commit</button>
              <button id="exitRepoBtn" onMouseUp={publishRepository}>Publish Repo</button>
            </div>
            
            {showCommitInput && (
                  <div className={styles.newLine}>
                    <input
                      type="text"
                      className={styles.input}
                      value={commitMsg}
                      onChange={handleCommitMessageChange}
                      placeholder="Enter commit message"
                    />
                    <button onMouseUp={commitChanges}>✓</button>
                    <button onMouseUp={cancelCommit} className={styles.deleteButton}>✕</button>
                  </div>
                )}
        </div>
    );
};

export default FileExplorer;
