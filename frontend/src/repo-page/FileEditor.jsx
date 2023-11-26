import styles from "../css/RepoPage.module.css"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const backendUrl = 'http://localhost:4000';

const FileEditor = ({ openFile, closeFile, openTabs, onFileSelect }) => {
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
