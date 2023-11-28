import styles from "../css/RepoPage.module.css"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const backendUrl = 'http://localhost:4000';

// Function to get file type based on extension
const getFileType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  const fileTypeMap = {
    json: 'JSON',
    txt: 'Text',
    md: 'Markdown',
    py: 'Python'
    // Add more extensions and their corresponding types as needed
  };
  return fileTypeMap[extension] || 'Unknown';
};

const FileEditor = ({ openFile, closeFile, openTabs, onFileSelect, refreshFileStructure }) => {
    const [content, setContent] = useState('');
    const [fileType, setFileType] = useState('Unknown'); // Initialize with 'Unknown'

    useEffect(() => {
        // Function to fetch or generate file content
        const loadFileContent = async (file) => {
            try {
                const response = await axios.post(`${backendUrl}/file-contents`, {  fileName: file }, 
                { withCredentials: true });
            
                let loadedContent = response.data;
    
                // Check if the loaded content is not a string (e.g., an object)
                if (typeof loadedContent !== 'string') {
                    // Convert non-string content to a JSON string
                    loadedContent = JSON.stringify(loadedContent, null, 2); // You can adjust the second argument for pretty formatting
                }
    
                setContent(loadedContent);

                // Set the file type based on the extension
                const fileType = getFileType(file);
                setFileType(fileType);
            } catch (error) {
                // Handle errors here
                console.error('Error fetching file content:', error);
                // Set some default error content or handle the error as needed
                setContent('Error loading file content');
            }
        };

        if (openFile) {
            loadFileContent(openFile);
        }
    }, [openFile]);

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };
    
    const handleSave = async () => {
        if (!openFile) {
            console.error("No file is currently open for editing");
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/update-file`, {
                fileName: openFile,
                newContent: content}, {
                withCredentials: true,
            });
            console.log(response.data); // You can handle the response as needed
        } catch (error) {
            console.error('Error saving file content:', error);
        }
    };


    const handleDelete = async () => {
        if (!openFile) {
            console.error("No file is currently open for editing");
            return;
        }

        // Confirm deletion with the user
        if (window.confirm(`Are you sure you want to delete ${openFile}?`)) {
            try {
                const response = await axios.delete(`${backendUrl}/delete-file`, {
                    data: { fileName: openFile }, // Note: Axios requires 'data' field for DELETE request body
                     withCredentials: true
                });
                console.log(response.data);
                closeFile(openFile);
                refreshFileStructure()
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        }
    };

    const handleCloseTab = (file, event) => {
        event.stopPropagation();
        closeFile(file);
    };

    return (
        <div className={styles.editor}>
            <ul className={styles.editorTabs}>
                {openTabs.map(file => (
                    <div className={styles.tab}>
                        <li key={file} onClick={() => onFileSelect(file)} className={styles.tabText}>
                            {file.split('\\').pop()} {/* Display only the text after the last '/' */}
                            <span className={styles.fileType}></span> {/* Display the file type */}
                        </li>
                        <button 
                            className={styles.closeTab} 
                            onClick={(event) => handleCloseTab(file, event)}
                        >
                            X
                        </button>
                    </div>
                ))}
            </ul>
            <textarea className={styles.editorContent} value={content} onChange={handleContentChange} />
            <ul className={styles.fileStateTabs}>
                <button onClick={handleSave} className={styles.saveButton}>
                    Save
                </button>
                <button onClick={handleDelete} className={styles.deleteButton}>
                    Delete
                </button>
            </ul>
        </div>
    );
};

export default FileEditor;
