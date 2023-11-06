const express = require('express');
const app = express();
const port = 3000; // You can choose any port that's free on your system
const simpleGit = require('simple-git');
const git = simpleGit();
const fs = require('fs').promises; // Import the promises API of the fs module for reading files
const path = require('path');

// Serve files from the public directory
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/monaco-editor', express.static(path.join(__dirname, 'node_modules/monaco-editor/min')));

// Define a simple route for demonstration
app.get('/', (req, res) => {
  res.send('Hello, world! Your Git interface is up and running!');
});

app.get('/list-files', async (req, res) => {
  try {
    const repoPath = req.query.repoPath; // or get from params if you prefer
    const files = await fs.readdir(repoPath);
    const fileInfo = await Promise.all(files.map(async file => {
      const filePath = path.join(repoPath, file);
      const stats = await fs.stat(filePath);
      return {
        name: file,
        path: filePath,
        isDirectory: stats.isDirectory(),
        // any other info you want to send
      };
    }));

    res.json(fileInfo);
  } catch (error) {
    res.status(500).send('Error listing files');
  }
});

app.post('/clone', async (req, res) => {
  const { repoUrl, localPath } = req.body;

  // Basic input validation
  if (typeof repoUrl !== 'string' || typeof localPath !== 'string') {
    return res.status(400).send('Invalid input');
  }

  try {
    await git.clone(repoUrl, localPath);
    const readmePath = path.join(localPath, 'README.md');
    
    // Check if the README exists before attempting to read it
    try {
      await fs.access(readmePath);
    } catch (error) {
      console.error('README does not exist:', error);
      return res.status(200).json({ message: 'Repository cloned successfully, but no README found' });
    }

    // If README exists, read it
    const readmeContent = await fs.readFile(readmePath, 'utf8');
    return res.status(200).json({ message: 'Repository cloned successfully', readme: readmeContent });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send('Failed to clone the repository');
  }
});


app.get('/clone-page', (req, res) => {
    res.sendFile('index.html'); // Make sure to put the correct path to your HTML file
});
    

// Start the Express server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.delete('/delete', async (req, res) => {
  const { localPath } = req.body;

  try {
    // Check if the directory exists
    const directoryExists = await fs.access(localPath).then(() => true).catch(() => false);

    if (directoryExists) {
      // Recursively delete the directory
      await fs.rm(localPath, { recursive: true });
      res.status(200).send('Repository deleted successfully');
    } else {
      res.status(400).send('Repository path does not exist');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to delete the repository');
  }
});
