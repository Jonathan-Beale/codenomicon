import "../css/RepoPage.css"

function ChatHistory() {

  return (
    <>
    <div className="right" id="right">
      <div id="bot-chat" className="bot-chat">
        <div>
          <h1 className="chat-header">Bot Chat History</h1>
        </div>
        <div id="chat-history" className="chat-history">Chat history here</div>
        <div id="input-wrapper" className="input-wrapper">
          <input id="userQuery" className="user-querry"/>
          <div className="button" type="button" id="chatBtn">`{'>'}`</div>
          <div className="button" type="button" id="printBtn">Print</div>
        </div>
        <button id="loadHistoryButton">Load History</button>
      </div>
    </div>
    </>
  );
}

export default ChatHistory
