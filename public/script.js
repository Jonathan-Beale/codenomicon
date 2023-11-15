// Global editor instance
let globalEditorInstance = null;
let tabBar = null;

function initializeEditor() {
  let editorDiv = document.getElementById('monaco-editor');

  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' }});

  require(['vs/editor/editor.main'], function() {
    // Create the main editor instance here without assigning it a specific file
    globalEditorInstance = monaco.editor.create(editorDiv, {
      theme: 'vs-dark',
      language: 'markdown'
    });
  });
  tabBar = document.getElementById('editor-tabs')
}

function openFileInNewEditorTab(filePath, fileContent) {
  if (!globalEditorInstance) {
    console.error('Editor has not been initialized.');
    return;
  }

  // Assuming you have a mechanism to track opened files and tabs
  // This is a placeholder for an actual tab management system
  const model = monaco.editor.createModel(fileContent, 'markdown', monaco.Uri.file(filePath));
  globalEditorInstance.setModel(model);
  let tab = document.createElement('div');
  tab.className = 'tab';
  tab.textContent = filePath;
  tab.model = model
  tab.addEventListener('click', (e) => {
    e.stopPropagation();
    globalEditorInstance.setModel(tab.model)
  });
  tabBar.appendChild(tab)
}

// Function to fetch the file list and build the file explorer
function fetchAndDisplayFiles(repoPath) {
  fetch(`http://localhost:3000/list-files?repoPath=${encodeURIComponent(repoPath)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(files => {
      buildFileExplorer(repoPath, files);
    })
    .catch(error => {
      console.error('Error fetching file list:', error);
    });
}

function toggleElementVisibility(elements) {
  elements.forEach((element) => {
    if (element.style.display === 'none' || element.style.display === '') {
      element.style.display = 'block'; // Show the element
    } else {
      element.style.display = 'none'; // Hide the element
    }
  });
}

function buildFolder(parent, folder, files) {
  const root = document.createElement('div');
  root.textContent = folder;
  root.id = folder;
  parent.appendChild(root);
  root.className = 'directory';
  
  root.addEventListener('click', (e) => {
    e.stopPropagation(); // This will prevent the event from reaching parent nodes.
    const toggleContents = root.querySelectorAll('.file, .directory');
    toggleElementVisibility(toggleContents);
  });

  // Use Promise.all to wait for all getFiles calls to complete
  Promise.all(files.map(file => {
    if (file.isDirectory) {
      return getFiles(file.path).then(newFiles => {
        buildFolder(root, file.name, newFiles);
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
      root.appendChild(fileElement);
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

  // Create a request body with userQuery and editorContent
  const requestBody = {
    userQuery,
    editorContent
  };

  fetch(`http://localhost:3000/answer`, {
    method: 'POST', // Use POST method to send JSON data
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody), // Send the JSON data
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Handle the response data here
      console.log(data);
    })
    .catch((error) => {
      console.error('Error making the server call:', error);
    });

  user_in.value = '';
});

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

// Clone button event listener
document.getElementById('cloneBtn').addEventListener('click', function() {
  const repoUrl = document.getElementById('repoUrlInput').value;
  const localPath = '/user_dir';
  
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

  fetchAndDisplayFiles(repoUrl)

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
      target = document.getElementById("go-box")
      toggleElementVisibility([target])
    } else {
      alert('Repository cloned, but no README found.');
    }
  })
  .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      alert('Failed to clone repository.'); // Show an error message
  });
});
