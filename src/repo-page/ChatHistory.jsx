import styles from "../css/RepoPage.module.css"

function ChatHistory() {

  return (
    <>
    <div className={styles.right} id="right">
      <div id="bot-chat" className={styles.botChat}>
        <div>
          <h1 className={styles.chatHeader}>Bot Chat History</h1>
        </div>
        <div id="chat-history" className={styles.chatHistory}>Chat history here</div>
        <div id="input-wrapper" className={styles.inputWrapper}>
          <input id="userQuery" className={styles.input}/>
          <div className={styles.button} type="button" id="chatBtn">{'>'}</div>
          <div className={styles.button} type="button" id="printBtn">Print</div>
        </div>
        <button id="loadHistoryButton">Load History</button>
      </div>
    </div>
    </>
  );
}

export default ChatHistory
