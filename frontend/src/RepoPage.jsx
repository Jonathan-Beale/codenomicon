import React, { useState, useEffect } from 'react';
import FileExplorer from './repo-page/FileExplorer';
import FileEditor from './repo-page/FileEditor';
import ChatHistory from "./repo-page/ChatHistory";
import styles from "./css/RepoPage.module.css";
import axios from 'axios';

// Protecting repo page
const RepoPage = () => {

    const [fileTabs, setFileTabs] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    
    const [refreshExplorer, setRefreshExplorer] = useState(() => () => {});
    
    const handleFileStructureChange = (clear, fetch) => {
        setRefreshFileExplorer({ clear, fetch });
    };

    useEffect(() => {
        // Fetch repository data here and update state
        // For demonstration, using static data
        const initialTabs = ["welcome.md"];
        setFileTabs(initialTabs);
    
        // Ensure the selected file is updated after fileTabs is updated
        setSelectedFile((prevSelectedFile) => {
            // If there's already a selected file, keep it
            if (prevSelectedFile) return prevSelectedFile;
    
            // Otherwise, select the first file in the updated fileTabs array
            return initialTabs.length > 0 ? initialTabs[0] : null;
        });
      } , []);


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
            <FileExplorer onFileSelect={handleFileSelect}  refresh={setRefreshExplorer}/>
            {selectedFile && <FileEditor openFile={selectedFile} closeFile={closeFile} openTabs={fileTabs} onFileSelect={handleFileSelect} refreshFileStructure={refreshExplorer} />}
            <ChatHistory openFile={selectedFile}/>
        </div>
    );
};

export default RepoPage;
