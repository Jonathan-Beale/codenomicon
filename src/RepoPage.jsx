import ChatHistory from "./repo-page/ChatHistory";
import FileEditor from "./repo-page/FileEditor";
import FileExplorer from "./repo-page/FileExplorer";
import "./css/RepoPage.css"

function RepoPage() {

  return (
    <>
        <div className="repo-wrapper">
          <FileExplorer/>
          <FileEditor/>
          <ChatHistory/>
        </div>
    </>
  );
}

export default RepoPage
