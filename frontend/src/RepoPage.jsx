import React, { useState, useEffect } from 'react';
import FileExplorer from './repo-page/FileExplorer';
import FileEditor from './repo-page/FileEditor';
import ChatHistory from "./repo-page/ChatHistory";
import styles from "./css/RepoPage.module.css";

const RepoPage = () => {
    const [fileTabs, setFileTabs] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        // Fetch repository data here and update state
        // For demonstration, using static data
        setFileTabs(["welcome.md"]);
        setSelectedFile(fileTabs[0])
    }, []);


    const handleFileSelect = (file) => {
        // Check if file is already in the fileTabs array
        if (!fileTabs.includes(file)) {
            // Append file to fileTabs if it's not there already
            setFileTabs(prevTabs => [...prevTabs, file]);
        }
        // Select the file
        setSelectedFile(file);
    };

    const closeFile = (file) => {
        // Find the index of the file in the fileTabs array
        const index = fileTabs.indexOf(file);
    
        // Proceed if the file is found
        if (index > -1) {
            // Create a new array without the file
            const updatedTabs = [...fileTabs.slice(0, index), ...fileTabs.slice(index + 1)];
    
            // Update the fileTabs state
            setFileTabs(updatedTabs);
    
            // If the closed file is the selected file, select another file or set to null
            if (selectedFile === file) {
                setSelectedFile(updatedTabs.length > 0 ? updatedTabs[0] : null);
            }
        }

    }


    // We want to give the fileExplorer all of the git files and the ability to add to the selected files
    return (
        <div className={styles.repoWrapper}>
            <FileExplorer onFileSelect={handleFileSelect} />
            {selectedFile && <FileEditor openFile={selectedFile} closeFile={closeFile} openTabs={fileTabs} onFileSelect={handleFileSelect} />}
            <ChatHistory/>
        </div>
    );
};

export default RepoPage;

// function RepoPage() {
//   const [files, setFiles] = useState([{ name: 'Welcome', content: 'Clone a repository to view its files.' }]);

//   const handleRepoCloned = (readmeContent) => {
//     setFiles([{ name: 'README.md', content: readmeContent }]);
//   };

//   const updateFileContent = (fileIndex, newContent) => {
//     const updatedFiles = files.map((file, index) => {
//       if (index === fileIndex) {
//         return { ...file, content: newContent };
//       }
//       return file;
//     });
//     setFiles(updatedFiles);
//   };
  
//   const [repoData, setRepoData] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);

//   useEffect(() => {
//       // Fetch repository data here and update state
//       // For demonstration, using static data
//       setRepoData(["file1.txt", "file2.js", "directory1/file3.md"]);
//   }, []);

//   const handleFileSelect = (file) => {
//       setSelectedFile(file);
//   };

//   return (
//     <>
//       <div className={styles.repoWrapper}>
//           <FileExplorer files={repoData} onFileSelect={handleFileSelect} />
//           {selectedFile && <FileEditor file={selectedFile} />}
//           <ChatHistory/>
//       </div>
//     </>
//   );
// }

// export default RepoPage
