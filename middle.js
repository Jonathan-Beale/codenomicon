import axios from 'axios';

function App() {

    const cloneRepository = async (repoUrl, localPath) => {
        try {
          const response = await axios.post('/clone', {
            repoUrl: repoUrl,
            localPath: localPath,
          });
      
          // Check the response for success or failure
          if (response.status === 200) {
            const { message, readme } = response.data;
            console.log(message);
            if (readme) {
              console.log('README Content:', readme);
            }
          } else {
            console.error('Failed to clone repository:', response.data);
          }
        } catch (error) {
          console.error('Error cloning repository:', error);
        }
      }; // cloneRepository('https://github.com/example/repo.git', '/path/to/local/directory');
  
      const stageAllFiles = async (localPath) => {
        try {
          const response = await axios.post('/stage-all', {
            localPath: localPath,
          });
      
          // Check the response for success or failure
          if (response.status === 200) {
            const message = response.data;
            console.log(message);
          } else {
            console.error('Failed to stage all files:', response.data);
          }
        } catch (error) {
          console.error('Error staging all files:', error);
        }
      }; // stageAllFiles('/path/to/local/directory');
  
      const stageFiles = async (localPath, targetFiles) => {
        try {
          const response = await axios.post('/stage', {
            localPath: localPath,
            targetFiles: targetFiles,
          });
      
          // Check the response for success or failure
          if (response.status === 200) {
            const message = response.data;
            console.log(message);
          } else {
            console.error('Failed to stage files:', response.data);
          }
        } catch (error) {
          console.error('Error staging files:', error);
        }
      }; // stageFiles('/path/to/local/directory', ['file1.js', 'file2.js']);












      // AI SHIT!!!

      const getAIAnswer = async (sessionID, userQuery, editorContent, model, OaiKey, systemPrompt) => {
        try {
          const response = await axios.get('/answer', {
            params: {
              sessionID: sessionID,
              userQuery: userQuery,
              editorContent: editorContent,
              model: model,
              OaiKey: OaiKey,
              systemPrompt: systemPrompt,
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


      const fetchHistory = async (sessionID, localPath) => {
        try {
          const response = await axios.post('/history', {
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
    <div className="App">
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}

export default App;
