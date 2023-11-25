import ChatHistory from "./repo-page/ChatHistory";
import FileEditor from "./repo-page/FileEditor";
import FileExplorer from "./repo-page/FileExplorer";
import styles from "./css/RepoPage.module.css";

function RepoPage() {

  return (
    <>
      <div className={styles.repoWrapper}>
          <FileExplorer/>
          <FileEditor/>
          <ChatHistory/>
      </div>
    </>
  );
}

export default RepoPage
