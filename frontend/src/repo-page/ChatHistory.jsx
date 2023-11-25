import styles from "../css/RepoPage.module.css"
import axios from 'axios';

function ChatHistory() {

  function getEditorContent() {

  }
  function getSessionID() {}

  const getAIAnswer = async () => {
    const sessionID = getSessionID()
    const editorContent = getEditorContent()
    const userQuery = document.getElementById("userQuery").value
    try {
      const response = await axios.get('/answer', {
        params: {
          sessionID: sessionID,
          userQuery: userQuery,
          editorContent: editorContent,
        },
      });
  
      // Check the response for success or failure
      if (response.status === 200) {
        const { query, response: aiResponse, editorContent: decodedEditorContent, timestamp } = response.data;
        console.log('User Query:', decodeURIComponent(query));
        console.log('AI Response:', aiResponse);
        console.log('Editor Content:', decodeURIComponent(decodedEditorContent));
        console.log('Timestamp:', new Date(timestamp));
      } else {
        console.error('Failed to get AI response:', response.data);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
    }
  };


  const fetchHistory = async () => {
    let sessionID = "test"
    let localPath = "Test/"
    try {
      const response = await axios.post('http://localhost:4000/history', {
        sessionID: sessionID,
        localPath: localPath,
      });
  
      // Check the response for success or failure
      if (response.status === 200) {
        const history = response.data;
        console.log('Fetched Conversation History:', history);
  
        // Optionally, you can save the history to a local file or process it as needed.
      } else {
        console.error('Failed to fetch conversation history:', response.data);
      }
    } catch (error) {
      console.error('Error fetching conversation history:', error);
    }
  };


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
          <div className={styles.button} type="button"  onMouseUp={getAIAnswer}>{'>'}</div>
          <div className={styles.button} type="button" onMouseUp={fetchHistory}>Print</div>
        </div>
        <button id="loadHistoryButton">Load History</button>
      </div>
    </div>
    </>
  );
}

export default ChatHistory
