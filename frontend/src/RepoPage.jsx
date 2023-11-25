import ChatHistory from "./repo-page/ChatHistory";
import FileExplorer from "./repo-page/FileExplorer";
import FileEditor from "./repo-page/FileEditor";
import styles from "./css/RepoPage.module.css";
import React, { useState } from 'react';
// import * as monaco from 'monaco-editor';

function RepoPage() {
  const [files, setFiles] = useState([{ name: 'Welcome', content: 'Clone a repository to view its files.' }]);

  const handleRepoCloned = (readmeContent) => {
    setFiles([{ name: 'README.md', content: readmeContent }]);
  };

  const updateFileContent = (fileIndex, newContent) => {
    const updatedFiles = files.map((file, index) => {
      if (index === fileIndex) {
        return { ...file, content: newContent };
      }
      return file;
    });
    setFiles(updatedFiles);
  };

  return (
    <>
      <div className={styles.repoWrapper}>
          <FileExplorer onRepoCloned={handleRepoCloned} />
          <FileEditor files={files} updateFileContent={updateFileContent} />
          <ChatHistory/>
      </div>
    </>
  );
}

export default RepoPage
