// Global editor instance
let globalEditorInstance = null;
let tabBar = null;
let userID = null;

// Function to initialize the Monaco Editor
function initializeEditor() {
  let editorDiv = document.getElementById('monaco-editor');

  // Load Monaco Editor library
  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' }});

  require(['vs/editor/editor.main'], function() {
    // Create the main editor instance here without assigning it a specific file
    globalEditorInstance = monaco.editor.create(editorDiv, {
      theme: 'vs-dark',
      language: 'markdown'
    });
  });
  tabBar = document.getElementById('editor-tabs')

  userID = '/TEST_USER'

  // For testing only
  sessionStorage.setItem('conversationId', 'testID');
}





function openFileInNewEditorTab(filePath, fileContent) {
  if (!globalEditorInstance) {
    console.error('Editor has not been initialized.');
    return;
  }

  // Function to determine the language mode based on file extension
  function getLanguageFromExtension(filePath) {
    const extension = filePath.split('.').pop();
    switch (extension) {
      case 'js':
        return 'javascript';
      case 'json':
        return 'json';
      case 'html':
        return 'html';
      case 'md':
        return 'markdown';
      case 'py':
        return 'python';
      // Add more cases as needed for other file types
      default:
        return 'plaintext';  // Default language mode
    }
  }

  const languageMode = getLanguageFromExtension(filePath);
  const model = monaco.editor.createModel(fileContent, languageMode, monaco.Uri.file(filePath));
  globalEditorInstance.setModel(model);

  let tab = document.createElement('div');
  tab.className = 'tab';
  tab.textContent = filePath;
  tab.model = model;
  tab.addEventListener('click', (e) => {
    e.stopPropagation();
    globalEditorInstance.setModel(tab.model);
  });

  tabBar.appendChild(tab);
}


// Function to fetch file list and display in the file explorer
async function fetchAndDisplayFiles(repoPath) {
  try {
    const response = await fetch(`http://localhost:3000/list-files?repoPath=${encodeURIComponent(repoPath)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const files = await response.json();
    buildFileExplorer(repoPath, files);
  } catch (error) {
    console.error('Error fetching file list:', error);
  }
}

// Function to toggle visibility of HTML elements
function toggleElementVisibility(elements) {
  elements.forEach((element) => {
    element.style.display = element.style.display !== 'none' ? 'none' : 'block';
  });
}

// Function to build the folder structure in the file explorer
function buildFolder(parent, folder, files) {
  const root = document.createElement('div');
  const name = document.createElement('p');
  const contents = document.createElement('div');
  root.appendChild(name);
  root.appendChild(contents);
  name.textContent = folder;
  root.id = folder;
  parent.appendChild(root);
  root.className = 'directory';
  
  root.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleElementVisibility([contents]);
  });

  // Use Promise.all to wait for all getFiles calls to complete
  Promise.all(files.map(file => {
    if (file.isDirectory) {
      return getFiles(file.path).then(newFiles => {
        buildFolder(contents, file.name, newFiles);
      });
    } else {
      const fileElement = document.createElement('p');
      fileElement.textContent = file.name;
      fileElement.className = 'file';
      fileElement.addEventListener('click', (e) => {
        e.stopPropagation();
        const filePath = file.path;
        fetchFileAndOpenInEditor(filePath);
      });
      contents.appendChild(fileElement);
    }
  })).catch(error => {
    console.error('Error fetching file list:', error);
  });
}


function getFiles(repoPath) {
  return fetch(`http://localhost:3000/list-files?repoPath=${encodeURIComponent(repoPath)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error fetching file list:', error);
      throw error; // Re-throw the error to handle it in the calling function
    });
}


// Function to build the file explorer UI
function buildFileExplorer(folder, files) {
  const fileExplorer = document.getElementById('file-explorer');
  fileExplorer.innerHTML = '';
  buildFolder(fileExplorer, folder, files)
}

// Function to fetch a file's content and open it in the Monaco editor
function fetchFileAndOpenInEditor(filePath) {
  fetch(`http://localhost:3000/file?filePath=${encodeURIComponent(filePath)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(fileContent => {
      openFileInNewEditorTab(filePath, fileContent);
    })
    .catch(error => {
      console.error('Error fetching file content:', error);
    });
}


// Function to open a file in the editor
function openFileInEditor(filePath) {
  fetch(`http://localhost:3000/file?filePath=${encodeURIComponent(filePath)}`)
  .then(response => response.text())
  .then(fileContent => {
    const editor = document.getElementById('monaco-editor').__monaco_editor__;
    if (editor) {
      editor.setModel(monaco.editor.createModel(fileContent, 'markdown', monaco.Uri.file(filePath)));
    }
  })
  .catch(error => console.error('Failed to open file', error));
}

// Submit button event listener
document.getElementById('chatBtn').addEventListener('click', function () {
  const user_in = document.getElementById('userQuery');
  const userQuery = encodeURIComponent(user_in.value);

  // Get the content of the Monaco editor
  const editorContent = globalEditorInstance.getValue();

  // Retrieve or generate a conversation ID
  let conversationId = sessionStorage.getItem('conversationId');
  if (!conversationId) {
    conversationId = `convoId`;
    sessionStorage.setItem('conversationId', conversationId);
  }

  // Create a request body with userQuery, editorContent, and conversationId
  const requestBody = {
    userQuery,
    editorContent,
    conversationId
  };

  // Send a POST request to the server
  fetch(`http://localhost:3000/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    // Update the conversation history with user's query and AI's response
    const history = document.getElementById('chat-history');

    // Create and append the user's query
    const userQueryDiv = document.createElement('div');
    userQueryDiv.textContent = `${decodeURIComponent(userQuery)}`;
    userQueryDiv.className = 'user-query';
    history.appendChild(userQueryDiv);

    // Create and append the AI's response
    const aiResponseDiv = document.createElement('div');
    aiResponseDiv.textContent = `AI: ${data.response}`;
    aiResponseDiv.className = 'ai-response';
    history.appendChild(aiResponseDiv);

    // Scroll to the latest entry
    history.scrollTop = history.scrollHeight;
  })
  .catch((error) => {
    console.error('Error making the server call:', error);
  });

  // Clear the input field after sending the request
  user_in.value = '';
});

// Print button event listener
document.getElementById('printBtn').addEventListener('click', function () {
  let conversationId = sessionStorage.getItem('conversationId');
  fetch(`http://localhost:3000/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({conversationId}),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Assuming the response will be the updated history
  })
  .then((updatedHistory) => {
    // Refresh the directory display after the file is created
    const repoPath = "/TEST_USER";
    fetchAndDisplayFiles(repoPath);

    // Check and update the chat history tab in the editor
    updateChatHistoryTab(updatedHistory);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

function updateChatHistoryTab(updatedHistory) {
  const models = monaco.editor.getModels();
  const historyFilePath = `/TEST_USER/codenomicon-chat-hist.json`;
  const chatHistoryModel = models.find(model => model.uri.path === historyFilePath);

  if (chatHistoryModel) {
    chatHistoryModel.setValue(JSON.stringify(updatedHistory, null, 2));
    globalEditorInstance.setModel(chatHistoryModel);
  }
}






document.getElementById('loadHistoryButton').addEventListener('click', async () => {
  try {
      const editorContent = monaco.editor.getModels()[0].getValue();
      let historyData = JSON.parse(editorContent); // This will throw an error if not valid JSON

      const response = await fetch('/load-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history: historyData })
      });

      if (response.ok) {
          const chatHistoryElement = document.getElementById('chat-history');
          chatHistoryElement.innerHTML = ''; // Clear existing content
          historyData.forEach(turn => {
            const turnData = (turn);

            const aiResponseDiv = document.createElement('div');
            aiResponseDiv.className = 'ai-response';
            aiResponseDiv.innerText = turnData.response;
            chatHistoryElement.insertBefore(aiResponseDiv, chatHistoryElement.firstChild);

            const userQueryDiv = document.createElement('div');
            userQueryDiv.className = 'user-query';
            userQueryDiv.innerText = turnData.query;
            chatHistoryElement.insertBefore(userQueryDiv, chatHistoryElement.firstChild);
          });
      } else {
          console.error('Failed to load history');
      }
  } catch (error) {
      console.error('Invalid JSON:', error);
  }
});

document.getElementById('stageBtn').addEventListener('click', async function() {
  try {
    const response = await fetch('/stage-all', { method: 'POST' });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const message = await response.text();
    console.log(message);
  } catch (error) {
    console.error('Staging all files failed:', error);
  }
})







// Event listener for the "Test" button
document.getElementById('testBtn').addEventListener('click', function() {
  fetch('http://localhost:3000/test', {
    method: 'POST',
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  })
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.error('Error:', error)
  })
})

// Event listener for the "Clone" button
document.getElementById('cloneBtn').addEventListener('click', function() {
  const repoUrl = document.getElementById('repoUrlInput').value;
  const localPath = '/TEST_USER';
  
  // Send a DELETE request to delete a repository
  fetch('http://localhost:3000/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ localPath })
  })
  .then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('Something went wrong');
    }
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
    alert('Failed to delete repository.'); // Show an error message
  });

  // Fetch and display files from the specified repository URL
  // fetchAndDisplayFiles(repoUrl)

  // Send a POST request to clone a repository
  fetch('http://localhost:3000/clone', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ repoUrl, localPath })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json(); // Expecting a JSON response
  })
  .then(data => {
    // Only populate the file explorer after the clone is successful
    fetchAndDisplayFiles(localPath); // Adjust the path as needed
    if (data.readme) {
      initializeEditor(data.readme); // Initialize the Monaco Editor with the README content
    } else {
      alert('Repository cloned, but no README found.');
    }
  })
  .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      alert('Failed to clone repository.'); // Show an error message
  });
});
