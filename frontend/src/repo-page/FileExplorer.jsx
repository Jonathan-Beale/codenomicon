import React, { useState } from 'react';
import styles from "../css/RepoPage.module.css"
import axios from 'axios';
const backendUrl = 'http://localhost:4000';
const testPath = "Test/"


const FileExplorer = ({ files, onFileSelect, onRepoCloned }) => {

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
          onRepoCloned(readme)
        }
        const structure = await fetchFileStructure(repoUrl);
        setFileStructure(structure);
      } else {
        console.error('Failed to clone repository:', response.data);
      }
    } catch (error) {
      console.error('Error cloning repository:', error);
    }
  };


    return (
        <div className={styles.middle}>
            <h2>File Explorer</h2>
            <ul className={styles.left}>
               <div className={styles.goBox} id="go-box">
               <input className={styles.input} type="text" id="repoUrlInput" placeholder="Enter the repository URL" />
               <button onMouseUp={cloneRepo}>Clone Repository</button>
           </div>
                {files.map(file => (
                    <li key={file} onClick={() => onFileSelect(file)}>
                        {file}
                    </li>
                ))}
            </ul>
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
  