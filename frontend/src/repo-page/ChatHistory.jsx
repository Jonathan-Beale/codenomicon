import styles from "../css/RepoPage.module.css"
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';


const backendUrl = "http://localhost:4000"



function ChatHistory() {
  const [chatHistory, setChatHistory] = useState([]);
  const chatHistoryRef = useRef(null);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      getAIAnswer();
    }
  };

  function getEditorContent() {
    return "def squared(x):\n    return x*2"
  }
  function getSessionID() {
    return "test"
  }

  const formatMessage = (message) => {
    // Regular expression to find code blocks
    const codeBlockRegex = /```[\s\S]*?```/g;
    const parts = message.split(codeBlockRegex);
  
    // Extract code blocks
    const codeBlocks = (message.match(codeBlockRegex) || []).map(block => 
      block.replace(/```(\w+\n)?/g, '').replace(/```/g, '') // Remove language tag and closing ```
    );
  
    // Combine text parts and code blocks
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index < codeBlocks.length && (
          <pre className={styles.codeBlock}><code>{codeBlocks[index].replace(/```/g, '')}</code></pre>
        )}
      </React.Fragment>
    ));
  };

  const getAIAnswer = async () => {
    const sessionID = getSessionID()
    const editorContent = getEditorContent()
    const userQuery = document.getElementById("userQuery").value
    // Clear input and update chat history
    document.getElementById("userQuery").value = '';
    updateChatHistory(userQuery, 'user');
    try {
      const response = await axios.get(`${backendUrl}/answer`, {
        params: {
          sessionID: sessionID,
          userQuery: userQuery,
          editorContent: editorContent,
          model: "gpt-3.5-turbo",
          OaiKey: "KEY HERE PLEASE REPLACE",
          systemPrompt: "Say something silly to the user.",
        },
      });
  
      // Check the response for success or failure
      if (response.status === 200) {
        const { query, response: aiResponse, editorContent: decodedEditorContent, timestamp } = response.data;
        console.log('User Query:', query);
        console.log('AI Response:', aiResponse);
        updateChatHistory(aiResponse, 'ai');
        console.log('Editor Content:', decodedEditorContent);
        console.log('Timestamp:', new Date(timestamp));
      } else {
        console.error('Failed to get AI response:', response.data);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
    }
  };

  
  const updateChatHistory = (message, sender) => {
    setChatHistory(prevHistory => [...prevHistory, { message, sender }]);
  };

  const fetchHistory = async () => {
    let sessionID = "test"
    let localPath = "Test/"
    try {
      const response = await axios.post(`${backendUrl}/history`, {
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

  const loadHistory = async () => {
    try {
      const response = await axios.post(`${backendUrl}/file-contents`, {  filePath: 'Test/codenomicon-chat-hist.json' });
      
      // Check the response for success or failure
      if (response.status === 200) {
        const historyData = response.data;
        let formattedHistory = [];
  
        for (let i = historyData.length - 1; i >= 0; i--) {
          const item = historyData[i];
  
          // Add user's query to the history
          if (item.query) {
            formattedHistory.push({ message: item.query, sender: 'user' });
          }
  
          // Add assistant's response to the history
          if (item.response && item.response.content) {
            formattedHistory.push({ message: item.response.content, sender: 'ai' });
          }
        }
  
        setChatHistory(formattedHistory);
      } else {
        console.error('Failed to load chat history:', response.data);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the chat history container
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <>
    <div className={styles.right} id="right">
      <div id="bot-chat" className={styles.botChat}>
        <div>
          <h1 className={styles.chatHeader}>Bot Chat History</h1>
        </div>
          <div ref={chatHistoryRef} className={styles.chatHistory}>
            {chatHistory.map((item, index) => (
              <div key={index} className={item.sender === 'user' ? styles.userMsg : styles.aiMsg}>
                {formatMessage(item.message)}
              </div>
            ))}
          </div>
        <div id="input-wrapper" className={styles.inputWrapper}>
          <div id="userQuery" contentEditable="true" className={styles.userQuery} onKeyUp={handleKeyPress}></div>
          <div className={styles.button} type="button"  onMouseUp={getAIAnswer}>{'>'}</div>
        </div>
        <div className={styles.newLine}>
          <button id="loadHistoryButton" onMouseUp={loadHistory}>Load History</button>
          <button className={styles.button} onMouseUp={fetchHistory}>Print</button>
        </div>
      </div>
    </div>
    </>
  );
}

export default ChatHistory
