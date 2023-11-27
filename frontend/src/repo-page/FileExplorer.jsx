import React, { useState, useEffect } from 'react';
import styles from "../css/RepoPage.module.css"
import axios from 'axios';
const backendUrl = 'http://localhost:4000';
const testPath = "Test"


const FileExplorer = ({ onFileSelect, refresh }) => {
  const [fileStructure, setFileStructure] = useState([]);
  const [showGoBox, setShowGoBox] = useState(true);


  const cloneRepo = async () => {
    const repoUrlInput = document.getElementById("repoUrlInput");
    const repoUrl = repoUrlInput.value;
    console.log(repoUrl)
    const localPath = testPath
    try {
      const response = await axios.post(`${backendUrl}/clone`, {
        repoUrl: repoUrl,
        localPath: localPath,
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
      const response = await axios.post(`${backendUrl}/list-files`, {
        folderPath: localPath,
      });

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
    const localPath = testPath
    try {
      const response = await axios.post(`${backendUrl}/stage-all`, {
        localPath: localPath,
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
      let localPath = testPath;
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
    } finally {
      setShowCommitInput(false);
      setCommitMsg(""); // Reset commit message
    }
  };

  const publishRepository = async () => {
    let localPath = testPath
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



//   return (
//     <>
//       <div>
//         <div className={styles.left} id="left">
//           <div className={styles.goBox} id="go-box">
//             <input className={styles.input} type="text" id="repoUrlInput" placeholder="Enter the repository URL" />
//             <button onMouseUp={cloneRepo}>Clone Repository</button>
//           </div>
//           {fileStructure.map((item, index) => (
//             <Folder key={index} folder={item} onFileSelected={onFileSelected} />
//           ))}
//           {/* <div id="file-explorer"></div> */}
//         </div>
//         <input className={styles.input} type="text" id="commitMsg"/>
//         <div className={styles.newLine}>
//           <button id="stageBtn" onMouseUp={stageAllFiles}>Stage All</button>
//           <button id="commitBtn" onMouseUp={commitChanges}>Commit</button>
//           <button id="exitRepoBtn" onMouseUp={publishRepository}>Publish Repo</button>
//         </div>
//       </div>
//     </>
//   );
// }
export default FileExplorer;


// function FileExplorer({ onRepoCloned, onFileSelected }) {
//   const [fileStructure, setFileStructure] = useState([]);

//   const [showRepoBox, setShowRepoBox] = useState(true);
//   const [showCommitBox, setShowCommitBox] = useState(false);

//   function getLocalPath() {
//     return "Test/"
//   }

//   const cloneRepo = async () => {
//     const repoUrlInput = document.getElementById("repoUrlInput");
//     const repoUrl = repoUrlInput.value;
//     console.log(repoUrl)
//     const localPath = getLocalPath()
//     try {
//       const response = await axios.post(`${backendUrl}/clone`, {
//         repoUrl: repoUrl,
//         localPath: localPath,
//       })
  
//       // Check the response for success or failure
//       if (response.status === 200) {
//         const { message, readme } = response.data;
//         console.log(message);
//         if (readme) {
//           console.log('README Content:', readme);
//           onRepoCloned(readme)
//         }
//         const structure = await fetchFileStructure(repoUrl);
//         setFileStructure(structure);
//       } else {
//         console.error('Failed to clone repository:', response.data);
//       }
//     } catch (error) {
//       console.error('Error cloning repository:', error);
//     }
//   };

//   const stageAllFiles = async () => {
//     const localPath = getLocalPath()
//     try {
//       const response = await axios.post(`${backendUrl}/stage-all`, {
//         localPath: localPath,
//       });
  
//       // Check the response for success or failure
//       if (response.status === 200) {
//         const message = response.data;
//         console.log(message);
//       } else {
//         console.error('Failed to stage all files:', response.data);
//       }
//     } catch (error) {
//       console.error('Error staging all files:', error);
//     }
//   };

//   const commitChanges = async () => {
//     const commitMsg = document.getElementById("commitMsg").value;
//     try {
//       let localPath = getLocalPath()
//       const response = await axios.post(`${backendUrl}/commit`, {
//         localPath: localPath,
//         commitMessage: commitMsg,
//       });
  
//       // Check the response for success or failure
//       if (response.status === 200) {
//         const message = response.data;
//         console.log(message);
//       } else {
//         console.error('Failed to commit changes:', response.data);
//       }
//     } catch (error) {
//       console.error('Error committing changes:', error);
//     }
//   };
  
//   const publishRepository = async () => {
//     let localPath = "Test/"
//     let remoteName = "origin"
//     let branchName = "main"
//     let githubToken = "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"
//     try {
//       const response = await axios.post(`${backendUrl}/publish-repo`, {
//         localPath: localPath,
//         remoteName: remoteName,
//         branchName: branchName,
//         githubToken: githubToken,
//       });
  
//       // Check the response for success or failure
//       if (response.status === 200) {
//         const message = response.data;
//         console.log(message);
//       } else {
//         console.error('Failed to publish repository:', response.data);
//       }
//     } catch (error) {
//       console.error('Error publishing repository:', error);
//     }
//   };
  

//   return (
//     <>
//       <div>
//         <div className={styles.left} id="left">
//           <div className={styles.goBox} id="go-box">
//             <input className={styles.input} type="text" id="repoUrlInput" placeholder="Enter the repository URL" />
//             <button onMouseUp={cloneRepo}>Clone Repository</button>
//           </div>
//           {fileStructure.map((item, index) => (
//             <Folder key={index} folder={item} onFileSelected={onFileSelected} />
//           ))}
//           {/* <div id="file-explorer"></div> */}
//         </div>
//         <input className={styles.input} type="text" id="commitMsg"/>
//         <div className={styles.newLine}>
//           <button id="stageBtn" onMouseUp={stageAllFiles}>Stage All</button>
//           <button id="commitBtn" onMouseUp={commitChanges}>Commit</button>
//           <button id="exitRepoBtn" onMouseUp={publishRepository}>Publish Repo</button>
//         </div>
//       </div>
//     </>
//   );
// }

// function Folder({ folder, onFileSelected }) {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleFolder = () => setIsOpen(!isOpen);

//   return (
//     <div>
//       <p onClick={toggleFolder}>{folder.name}</p>
//       {isOpen && (
//         <div style={{ paddingLeft: '20px' }}>
//           {folder.children.map((item, index) => (
//             item.type === 'folder' 
//               ? <Folder key={index} folder={item} onFileSelected={onFileSelected} />
//               : <File key={index} file={item} onFileSelected={onFileSelected} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function File({ file, onFileSelected }) {
//   const selectFile = () => onFileSelected(file);

//   return (
//     <p onClick={selectFile}>{file.name}</p>
//   );
// }




// const fetchFileStructure = async () => {
//   const localPath = 'Test/'
//   try {
//     const response = await axios.post(`${backendUrl}/list-files`, {
//       folderPath: localPath,
//     });

//     // Check the response for success or failure
//     if (response.status === 200) {
//       const message = response.data;
//       console.log(message);
//       return message
//     } else {
//       console.error('Failed to stage all files:', response.data);
//     }
//   } catch (error) {
//     console.error('Error staging all files:', error);
//   }
// };
// export default FileExplorer
  