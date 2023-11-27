import styles from "../css/RepoPage.module.css"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const backendUrl = 'http://localhost:4000';

const FileEditor = ({ openFile, closeFile, openTabs, onFileSelect, refreshFileStructure }) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        // Function to fetch or generate file content
        const loadFileContent = async (file) => {
            
            try {
                const response = await axios.post(`${backendUrl}/file-contents`, {  filePath: file });
                setContent(response.data);
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
                filePath: openFile,
                newContent: content
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
                    data: { filePath: openFile } // Note: Axios requires 'data' field for DELETE request body
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
                    <li key={file} onClick={() => onFileSelect(file)} className={styles.tab}>
                        {file}
                        <button 
                            className={styles.closeTab} 
                            onClick={(event) => handleCloseTab(file, event)}
                        >
                            X
                        </button>
                    </li>
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

// const FileEditor = ({ files, updateFileContent }) => {
//   const [activeFileIndex, setActiveFileIndex] = useState(0);

//   const switchFile = (index) => {
//     setActiveFileIndex(index);
//   };

//   const handleContentChange = (event) => {
//     updateFileContent(activeFileIndex, event.target.value);
//   };

//   return (
//     <div>
//       <div className="editor-tabs">
//         {files.map((file, index) => (
//           <button 
//             key={index} 
//             className={`tab-item ${index === activeFileIndex ? 'active' : ''}`}
//             onClick={() => switchFile(index)}
//           >
//             {file.name}
//           </button>
//         ))}
//         </div>
//         <div className={styles.editorContent}>
//           <textarea 
//             className={styles.editorContent}
//             value={files[activeFileIndex].content}
//             onChange={handleContentChange}
//           />
//         </div>
//     </div>
//   );
// };

// export default FileEditor;
