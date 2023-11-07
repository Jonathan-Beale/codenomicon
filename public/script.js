function initializeEditor(readmeContent) {
  let editorDiv = document.getElementById('monaco-editor');
  
  // If the editor already exists, remove the container to ensure a clean start
  if (editorDiv) {
    removeEditorContainer();
    createEditorContainer();
    editorDiv = document.getElementById('monaco-editor'); // Re-select the new div
  }
  
  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' }});

  require(['vs/editor/editor.main'], function() {
    // Assign the editor instance to a property of the DOM element for future reference
    editorDiv.__monaco_editor__ = monaco.editor.create(editorDiv, {
      value: readmeContent,
      language: 'markdown'
    });
  });
}

function removeEditorContainer() {
  const editorContainer = document.getElementById('monaco-editor');
  if (editorContainer) {
    editorContainer.parentNode.removeChild(editorContainer);
  }
}

function createEditorContainer() {
  const editorContainer = document.createElement('div');
  editorContainer.id = 'monaco-editor';
  // Set any styles or attributes you need for the editor container
  editorContainer.style.width = '60vw';
  editorContainer.style.height = '600px';
  const middle = document.getElementById('middle');
  middle.appendChild(editorContainer);
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
      buildFileExplorer('user_dir', files);
    })
    .catch(error => {
      console.error('Error fetching file list:', error);
    });
}

// Function to build the file explorer UI
function buildFileExplorer(folder, files) {
  const fileExplorer = document.getElementById('file-explorer');
  fileExplorer.innerHTML = ''; // Clear the previous contents
  const root = document.createElement('div')
  root.textContent = folder
  fileExplorer.appendChild(root)
  root.className = 'directory'
  root.addEventListener('click', () => {
    // Here you could then call fetchAndDisplayFiles for the new path
    fetchAndDisplayFiles(folder);
  });


  files.forEach(file => {
    const fileElement = document.createElement('div');
    fileElement.textContent = file.name;
    fileElement.className = file.isDirectory ? 'directory' : 'file';

    // If it's a directory, maybe you want to allow it to be clicked to expand and show its contents
    if (file.isDirectory) {
      fileElement.addEventListener('click', () => {
        // Here you could then call fetchAndDisplayFiles for the new path
        fetchAndDisplayFiles(file.path);
      });
    } else {
      // If it's a file, clicking it could load the file into the Monaco editor
      fileElement.addEventListener('click', () => {
        fetchFileAndOpenInEditor(file.path);
      });
    }

    fileExplorer.appendChild(fileElement);
  });
}

// Function to fetch a file's content and open it in the Monaco editor
function fetchFileAndOpenInEditor(filePath) {
  fetch(`http://localhost:3000/file-content?filePath=${encodeURIComponent(filePath)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(fileContent => {
      const editorDiv = document.getElementById('monaco-editor');
      if (editorDiv.__monaco_editor__) {
        // Dispose of the previous model if it exists
        const oldModel = editorDiv.__monaco_editor__.getModel();
        if (oldModel) {
          oldModel.dispose();
        }
        // Create a new model for the new file
        const newModel = monaco.editor.createModel(fileContent, 'markdown');
        editorDiv.__monaco_editor__.setModel(newModel);
      } else {
        console.error('Editor is not initialized');
      }
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

// Clone button event listener
document.getElementById('cloneBtn').addEventListener('click', function() {
  const repoUrl = document.getElementById('repoUrlInput').value;
  const localPath = './user_dir'; // Replace with the path you want to clone to

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
    } else {
      alert('Repository cloned, but no README found.');
    }
  })
  .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      alert('Failed to clone repository.'); // Show an error message
  });
});



  document.getElementById('deleteBtn').addEventListener('click', function() {
    const localPath = './user_dir'; // The path to the directory you want to delete

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
      alert(data); // Show a success message
    })
    .catch(error => {
      console.error(error);
      alert('Failed to delete repository.'); // Show an error message
    });
});
