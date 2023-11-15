const express = require('express');
const app = express();
const port = 3000;
const simpleGit = require('simple-git');
const git = simpleGit();
const fs = require('fs').promises;
const path = require('path');
const OpenAI = require("openai")
const llm = new OpenAI({ apiKey: "your-key-here"});
const redis = require('redis');

const client = redis.createClient({
    password: 't23MLHAllrwCXnC9YjSoiewNjSdfOeJP',
    socket: {
        host: 'redis-16465.c267.us-east-1-4.ec2.cloud.redislabs.com',
        port: 16465
    }
});


client.on('error', err => console.log('Redis Client Error', err));

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

// Endpoint to fetch a file
app.get('/file', async (req, res) => {
  const filePath = req.query.filePath;

  // Basic input validation
  if (typeof filePath !== 'string') {
    return res.status(400).send('Invalid input');
  }

  try {
    const content = await fs.readFile(filePath, 'utf8');
    res.send(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).send('File not found');
    } else {
      console.error('Error reading file:', error);
      res.status(500).send('Error fetching file');
    }
  }
});

app.post('/answer', async (req, res) => {
  // Retrieve the user query and editor content from the request's body
  const userQuery = decodeURIComponent(req.body.userQuery);
  const editorContent = decodeURIComponent(req.body.editorContent);

  try {
    // Await the AI response
    const response = await getAIResponce(userQuery, editorContent);

    let chatHist = await client.get('user-session:123')
    chatHist += "\n" + userQuery + "\n" + response
    await client.set("user-session:123", chatHist)

    // Send the response as JSON
    res.json(response);
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).send('Error generating AI response');
  }
});

app.post('/test', async (req, res) => {
  const testKey = 'user-session:123'
  const testValue = 'this is a hypothetical prototype of prototypical nature'

  try {
    await client.set(testKey, testValue)
    const value = await client.get(testKey)

    res.json(value)
  } catch (error) {
    console.error('Error setting/getting key:', error)
  }
})

async function getAIResponce(userQuery, fileContent) {
  const completion = await llm.chat.completions.create({
    messages: [{ role: "system", content: "You will be given some code and a user's input. Assist the user." }, { role: "system", content: fileContent }, { role: "user", content: userQuery }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0]
}

// Start the Express server
app.listen(port, async () => {
  console.log(`Server listening at http://localhost:${port}`);
  await client.connect()
});
