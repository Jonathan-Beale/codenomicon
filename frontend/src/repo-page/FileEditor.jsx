import styles from "../css/RepoPage.module.css"
import React, { useState } from 'react';

const FileEditor = ({ files, updateFileContent }) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  const switchFile = (index) => {
    setActiveFileIndex(index);
  };

  const handleContentChange = (event) => {
    updateFileContent(activeFileIndex, event.target.value);
  };

  return (
    <div>
      <div className="editor-tabs">
        {files.map((file, index) => (
          <button 
            key={index} 
            className={`tab-item ${index === activeFileIndex ? 'active' : ''}`}
            onClick={() => switchFile(index)}
          >
            {file.name}
          </button>
        ))}
        </div>
        <div className={styles.editorContent}>
          <textarea 
            className={styles.editorContent}
            value={files[activeFileIndex].content}
            onChange={handleContentChange}
          />
        </div>
    </div>
  );
};

export default FileEditor;
