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
        setFileTabs(["./Test/test.py"]);
    }, []);

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };


    // We want to give the fileExplorer all of the git files and the ability to add to the selected files
    return (
        <div className={styles.repoWrapper}>
            <FileExplorer files={fileTabs} onFileSelect={handleFileSelect} />
            {selectedFile && <FileEditor openFile={selectedFile} openTabs={fileTabs} onFileSelect={handleFileSelect} />}
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
