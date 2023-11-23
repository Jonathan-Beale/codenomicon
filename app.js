const express = require('express');
const app = express();
const port = 3000;
const simpleGit = require('simple-git');
let git = null;
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


// LOCAL FILE ENDPOINTS

// LOCAL LIST FILES
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

// LOCAL DELETE
app.delete('/delete', async (req, res) => {
  const { localPath } = req.body;
  let dirPath = process.cwd() + "/TEST_USER"

  try {
    // Check if the directory exists
    try {
      await fs.access(dirPath); // This will throw an error if the directory doesn't exist
      // If no error is thrown, the directory exists
      // Recursively delete the directory
      await fs.rm(dirPath, { recursive: true });
      res.status(200).send('Repository deleted successfully');
    } catch (error) {
      res.status(400).send(`Repository path does not exist: ${dirPath}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to delete the repository');
  }
});

// LOCAL FILE -> file content
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


// AI ENPOINTS

// AI ANSWER -> {response: response}
app.post('/answer', async (req, res) => {
  const { userID, userQuery, editorContent} = req.body;
  const conversationKey = `conversation:${userID}`;

  try {
    const response = await getAIResponse(userQuery, editorContent);

    console.log(userID)

    // Structure the current turn's data
    const turnData = JSON.stringify({
      query: decodeURIComponent(userQuery),
      response: decodeURIComponent(response),
      editorContent: decodeURIComponent(editorContent),
      timestamp: new Date()
    });

    // Push the current turn's data onto the conversation list
    await client.lPush(conversationKey, turnData);

    res.json({ response: response });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).send('Error generating AI response');
  }
});



async function getAIResponse(userQuery, fileContent) {
  // const completion = await llm.chat.completions.create({
  //   messages: [{ role: "system", content: "You will be given some code and a user's input. Assist the user." }, { role: "system", content: fileContent }, { role: "user", content: userQuery }],
  //   model: "gpt-3.5-turbo",
  // });

  // return completion.choices[0]

  return "This is an example of an AI response"
}


// GIT OPERATIONS


// GIT CLONE
app.post('/clone', async (req, res) => {
  const { repoUrl, localPath } = req.body;

  // Basic input validation
  if (typeof repoUrl !== 'string' || typeof localPath !== 'string') {
    const urlType = typeof repoUrl
    const pathType = typeof localPath
    return res.status(400).send(`Invalid input. Expected strings, got: ${urlType} ${pathType}`);
  }

  try {
    // Create the directory if it does not exist
    try {
      await fs.access(localPath);
    } catch (error) {
      await fs.mkdir(localPath, { recursive: true });
    }

    const dir_path = path.join(process.cwd(), "/TEST_USER")
    git = simpleGit(dir_path)
    
    await git.clone(repoUrl, dir_path);
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

// GIT STAGE ALL
app.post('/stage-all', async (req, res) => {
  try {
      console.log(process.cwd())
      const result = await git.raw(['ls-tree', '-r', 'HEAD', '--name-only']);
      console.log('Contents of the Git repository:', result);
      const status = await git.status();
      const changedFiles = status.files.map(file => file.path)
      const untrackedFiles = status.not_added

      const stagingFiles = new Set([...changedFiles, ...untrackedFiles])
      console.log("Files to be staged:", stagingFiles);

      if (stagingFiles.length > 0) {
          await git.add(stagingFiles);
          res.status(200).send(`Staged files: ${stagingFiles.join(', ')}`);
      } else {
          res.status(200).send('No changes to stage');
      }
  } catch (error) {
      console.error('Error in staging all files:', error);
      res.status(500).send('Failed to stage all files');
  }
});

// GIT COMMIT
app.post('/commit', async (req, res) => {
  const { commitMessage } = req.body; // Commit message
  try {
    await git.commit(commitMessage);
    res.status(200).send('Changes committed successfully');
  } catch (error) {
    console.error('Error committing changes:', error);
    res.status(500).send('Failed to commit changes');
  }
});

// GIT STAGE
app.post('/stage', async (req, res) => {
  const { filePaths } = req.body; // Array of file paths to stage
  try {
    await git.add(filePaths);
    res.status(200).send('Files staged successfully');
  } catch (error) {
    console.error('Error staging files:', error);
    res.status(500).send('Failed to stage files');
  }
});



// REDIS MEMORY OPERATIONS

// REDIS TEST
app.post('/redis-test', async (req, res) => {
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

// REDIS LOAD HISTORY
app.post('/load-history', async (req, res) => {
  const { history } = req.body;

  // Assuming you have a way to identify the user's session, like a session ID
  const sessionID = req.sessionID;
  const conversationKey = `conversation:${sessionID}`;

  try {
      // Clear existing conversation history
      await client.del(conversationKey);

      // Add each item from the history to the Redis list
      for (const item of history) {
          await client.lPush(conversationKey, JSON.stringify(item));
      }

      res.status(200).send('History loaded successfully');
  } catch (error) {
      console.error('Error loading history:', error);
      res.status(500).send('Error loading history');
  }
});

// REDIS HISTORY -> JSON FILE
app.post('/history', async (req, res) => {
  try {
    const { userID } = req.query;
    const conversationKey = `conversation:${userID}`;

    // Retrieve the conversation history from Redis
    const conversationHistory = await client.lRange(conversationKey, 0, -1);

    // Parsing each message back into JSON object
    const history = conversationHistory.map(message => JSON.parse(message));

    // Write the conversation history to a file
    const fileName = `./TEST_USER/codenomicon-chat-hist.json`;
    await fs.writeFile(fileName, JSON.stringify(history, null, 2));

    // Send the conversation history as a JSON response
    res.status(200).json(history);
  } catch (error) {
    console.error("Error in /history endpoint:", error);
    res.status(500).send("An error occurred while processing the request.");
  }
});

// Start the Express server
app.listen(port, async () => {
  console.log(`Server listening at http://localhost:${port}`);
  await client.connect()
});
