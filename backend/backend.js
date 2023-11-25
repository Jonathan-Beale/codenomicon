const express = require('express');
const app = express();
const port = 4000;
const simpleGit = require('simple-git');
let git = null;
const fs = require('fs').promises;
const path = require('path');
const OpenAI = require("openai")
const redis = require('redis');
const cors = require('cors');

const client = redis.createClient({
  password: 't23MLHAllrwCXnC9YjSoiewNjSdfOeJP',
  socket: {
      host: 'redis-16465.c267.us-east-1-4.ec2.cloud.redislabs.com',
      port: 16465
  }
});

// Serve files from the public directory
app.use(express.static('public'));
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());


//        -----Git Endpoints-----        //

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
    await fs.access(localPath);
  } catch (error) {
    await fs.mkdir(localPath, { recursive: true });
  }

  const dir_path = path.join(process.cwd(), localPath)
  try {
    // Create the directory if it does not exist
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
  const { localPath } = req.body;

  if(git === null) {
    git = simpleGit(path.join(process.cwd(), localPath))
  }

  try {
      console.log(process.cwd())
      const result = await git.raw(['ls-tree', '-r', 'HEAD', '--name-only']);
      console.log('Contents of the Git repository:', result);
      const status = await git.status();
      const changedFiles = status.files.map(file => file.path)
      const untrackedFiles = status.not_added

      const stagingFiles = [...changedFiles, ...untrackedFiles];
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


app.post('/stage', async (req, res) => {
  const { localPath, targetFiles } = req.body;

  if (git === null) {
    git = simpleGit(path.join(process.cwd(), localPath));
  }

  try {
    // Ensure targetFiles is an array
    if (!Array.isArray(targetFiles)) {
      return res.status(400).send('Invalid input. "targetFiles" should be an array of file paths.');
    }

    // Stage the specified files
    await git.add(targetFiles);
    res.status(200).send(`Staged files: ${targetFiles.join(', ')}`);
  } catch (error) {
    console.error('Error in staging multiple files:', error);
    res.status(500).send('Failed to stage multiple files');
  }
});

// Git Unstage endpoint
app.post('/unstage', async (req, res) => {
  const { localPath, targetFiles } = req.body;

  if (git === null) {
    git = simpleGit(path.join(process.cwd(), localPath));
  }

  try {
    // Ensure targetFiles is an array
    if (!Array.isArray(targetFiles)) {
      return res.status(400).send('Invalid input. "targetFiles" should be an array of file paths.');
    }

    // Unstage the specified files
    await git.reset(['--'].concat(targetFiles));

    res.status(200).send(`Unstaged files: ${targetFiles.join(', ')}`);
  } catch (error) {
    console.error('Error in unstaging multiple files:', error);
    res.status(500).send('Failed to unstage multiple files');
  }
});


// GIT COMMIT
app.post('/commit', async (req, res) => {
  const { localPath, commitMessage } = req.body;

  if(git === null) {
    git = simpleGit(path.join(process.cwd(), localPath))
  }

  try {
    await git.commit(commitMessage);
    res.status(200).send('Changes committed successfully');
  } catch (error) {
    console.error('Error committing changes:', error);
    res.status(500).send('Failed to commit changes');
  }
});


// Define the route for checking out a repository
app.post('/checkout', async (req, res) => {
  const { localPath, repoUrl, branch } = req.body;

  try {
    // Check if the local repository already exists, if not, clone it
    if (!await simpleGit().checkIsRepo(localPath)) {
      await simpleGit().clone(repoUrl, localPath);
    }

    // Switch to the specified branch
    await simpleGit(localPath).checkout(branch);

    res.status(200).send(`Checked out branch '${branch}' successfully`);
  } catch (error) {
    console.error('Error checking out repository:', error);
    res.status(500).send('Failed to check out repository');
  }
});

// Define the route for publishing the repository
app.post('/publish-repo', async (req, res) => {
  const { localPath, remoteName, branchName, githubToken } = req.body;

  // Basic input validation
  if (!localPath || !remoteName || !branchName || !githubToken) {
    return res.status(400).send('Invalid input');
  }

  try {
    // Initialize the Git instance if it's not already initialized
    if (git === null) {
      git = simpleGit(path.join(process.cwd(), localPath));
    }

    // Ensure that the specified remote exists
    const remotes = await git.getRemotes(true);
    const remoteExists = remotes.some(remote => remote.name === remoteName);
    if (!remoteExists) {
      return res.status(400).send(`Remote '${remoteName}' does not exist.`);
    }

    // Authenticate with GitHub using a personal access token
    await git.addConfig('user.name', 'Your GitHub Username');
    await git.addConfig('user.email', 'Your GitHub Email');
    await git.addConfig('credential.helper', 'store --file ~/.git-credentials');
    await git.addConfig('credential.username', githubToken);

    // Push the branch to the remote repository (GitHub)
    await git.push(remoteName, branchName);
    
    res.status(200).send(`Repository published to '${remoteName}/${branchName}' successfully`);
  } catch (error) {
    console.error('Error publishing repository:', error);
    res.status(500).send('Failed to publish repository');
  }
});


//        -----File Endpoints-----        //

// LOCAL DELETE
app.delete('/delete-directory', async (req, res) => {
  const { localPath } = req.body;
  let dirPath = path.join(process.cwd(), localPath)

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

app.post('/create-file', async (req, res) => {
  const { filePath, content } = req.body;

  // Basic input validation
  if (typeof filePath !== 'string' || typeof content !== 'string') {
      return res.status(400).send('Invalid input');
  }

  try {
      await fs.writeFile(filePath, content, 'utf8');
      res.status(200).send(`File created at ${filePath}`);
  } catch (error) {
      console.error('Error creating file:', error);
      res.status(500).send('Failed to create file');
  }
});

app.post('/update-file', async (req, res) => {
  const { filePath, newContent } = req.body;

  // Basic input validation
  if (typeof filePath !== 'string' || typeof newContent !== 'string') {
    return res.status(400).send('Invalid input');
  }

  try {
    // Check if the file exists
    await fs.access(filePath);

    // Update the file with new content
    await fs.writeFile(filePath, newContent, 'utf8');
    res.status(200).send(`File updated at ${filePath}`);
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).send('Failed to update file');
  }
});

app.delete('/delete-file', async (req, res) => {
  const { filePath } = req.body;

  // Basic input validation
  if (typeof filePath !== 'string') {
      return res.status(400).send('Invalid input');
  }

  try {
      await fs.unlink(filePath);
      res.status(200).send(`File deleted at ${filePath}`);
  } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).send('Failed to delete file');
  }
});



// LOCAL FILE -> file content
app.get('/file-contents', async (req, res) => {
  const { filePath } = req.body;

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


// LOCAL LIST FILES
app.get('/list-files', async (req, res) => {
  const { folderPath } = req.body

  
  // Basic input validation
  if (typeof folderPath !== 'string') {
    return res.status(400).send('Invalid input');
  }

  try {
    const files = await fs.readdir(folderPath);
    const fileInfo = await Promise.all(files.map(async file => {
      const filePath = path.join(folderPath, file);
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




//        -----AI Endpoints-----        //


// AI ANSWER -> {response: response}
app.get('/answer', async (req, res) => {
  const { sessionID, userQuery, editorContent, model, OaiKey, systemPrompt } = req.body;
  // 
  const conversationKey = `conversation:${sessionID}`;

  try {
    // Retrieve the conversation from Redis
    const conversation = await client.lRange(conversationKey, 0, -1);

    // Include the system prompt and previous queries when calling getAIResponse
    const response = await getAIResponse(
      systemPrompt,
      conversation,
      editorContent,
      model,
      OaiKey
    );

    console.log(sessionID);

    // Structure the current turn's data
    const turnData = JSON.stringify({
      query: decodeURIComponent(userQuery),
      response: response,
      editorContent: decodeURIComponent(editorContent),
      timestamp: new Date(),
    });

    // Push the current turn's data onto the conversation list
    await client.lPush(conversationKey, turnData);

    res.json(turnData);
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).send('Error generating AI response');
  }
});




async function getAIResponse(userQuery, fileContent, model, OaiKey) {
  const llm = new OpenAI({ apiKey: OaiKey});
  const completion = await llm.chat.completions.create({
    messages: [{ role: "system", content: "You will be given some code and a user's input. Assist the user." }, { role: "system", content: fileContent }, { role: "user", content: userQuery }],
    model: model,
  });

  return completion.choices[0].message
}




//        -----Redis Endpoints-----        //

// REDIS HISTORY -> JSON FILE
app.post('/history', async (req, res) => {
  try {
    const { sessionID, localPath } = req.body;
    const conversationKey = `conversation:${sessionID}`;

    // Retrieve the conversation history from Redis
    const conversationHistory = await client.lRange(conversationKey, 0, -1);

    // Parsing each message back into JSON object
    const history = conversationHistory.map(message => JSON.parse(message));

    // Write the conversation history to a file
    const fileName = `${localPath}codenomicon-chat-hist.json`;
    await fs.writeFile(fileName, JSON.stringify(history, null, 2));

    // Send the conversation history as a JSON response
    res.status(200).json(history);
  } catch (error) {
    console.error("Error in /history endpoint:", error);
    res.status(500).send("An error occurred while processing the request.");
  }
});


// REDIS LOAD HISTORY
app.post('/load-history', async (req, res) => {
  const { sessionID, filePath } = req.body; // The specific path to the JSON file

  // Assuming you have a way to identify the user's session, like a session ID
  const conversationKey = `conversation:${sessionID}`;

  try {
    // Read the JSON file at the specified path
    const fileContent = await fs.readFile(filePath, 'utf-8');
    console.log(fileContent)

    // Parse the JSON content into an array
    const history = JSON.parse(fileContent);

    // Clear existing conversation history
    await client.del(conversationKey);

    // Add each item from the history to the Redis list
    for (const item of history) {
      await client.lPush(conversationKey, JSON.stringify(item));
    }

    res.status(200).send('History loaded successfully');
  } catch (error) {
    console.error('Error loading history from file:', error);
    res.status(500).send('Error loading history from file');
  }
});





// Start the Express server
app.listen(port, async () => {
  console.log(`Server listening at ${port}`);
  await client.connect()
});