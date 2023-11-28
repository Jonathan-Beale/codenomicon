const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/AuthRoute");
const { MONGO_URL, PORT } = process.env;

const port = 4000;
const simpleGit = require('simple-git');
let git = null;
const fs = require('fs').promises;
const path = require('path');
const OpenAI = require("openai")
const redis = require('redis');

const User = require("./models/UserModel");
const {createToken} = require("./util/SecretToken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");


// Serve files from the public directory
app.use(express.static('public'));

const corsOptions = {
  origin: 'http://localhost:3000', // This should match the origin of your frontend
  credentials: true, // This allows the server to accept requests with credentials (cookies, sessions)
};

app.use(cors(corsOptions));

app.use(cookieParser());

// Middleware to parse JSON bodies
app.use(express.json());

app.post("/signup", async (req, res) => {
    try {
        const {email, password} = req.body;
        // const existingUser = await User.findOne({email});
        // if (existingUser){
        //     return res.json({message: "User already exists."});
        // }
        const user = await User.create({email, password});
        const token = createToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201).json({message: "User is signed in.", success: true, user});
    } catch (error) {
        console.error(error);
    }
});

app.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password){
            return res.json({message:"Email and Password Required."})
        }
        const user = await User.findOne({email});
        if (!user){
            return res.json({message:"Incorrect Email."}) 
        }
        const auth = await bcrypt.compare(password,user.password)
        if (!auth){
            return res.json({message:"Incorrect Password."}) 
        }
        const token = createToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201).json({message: "User is logged in.", success: true});
    } catch (error) {
        console.error(error);
    }
});

app.post("/", (req, res) => {
    const token = req.cookies.token;
    if (!token){
        return res.json({status: false});
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err){
            return res.json({status: false});
        } else {
            const user = await User.findById(data.id);
            if (user){
                return res.json({status: true});
            }
            else {
                return res.json({status: false});
            }
        }
    });
});

// MongoDB setup
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is connected."))
  .catch((err) => console.error(err));

const client = redis.createClient({
  password: 't23MLHAllrwCXnC9YjSoiewNjSdfOeJP',
  socket: {
      host: 'redis-16465.c267.us-east-1-4.ec2.cloud.redislabs.com',
      port: 16465
  }
});

const requireAuth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, decodedToken) => {
      if (err) {
          return res.status(401).json({ message: 'Unauthorized' });
      }
      try {
          req.user = await User.findById(decodedToken.id);
          next();
      } catch (err) {
          console.error(err);
          res.status(401).json({ message: 'Unauthorized' });
      }
  });
};


//        -----Git Endpoints-----        //

// GIT CLONE
app.post('/clone', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { repoUrl } = req.body;

  // Basic input validation
  if (typeof repoUrl !== 'string') {
    const urlType = typeof repoUrl
    return res.status(400).send(`Invalid input. Expected string, got: ${urlType}`);
  }

  const folderName = `USER_${userId}`;
  let folderPath = path.join(__dirname, folderName);


  try {
    // Check if the folder exists before creating it
    await fs.access(folderPath);
  } catch (error) {
    // If the folder does not exist, create it
    await fs.mkdir(folderPath, { recursive: true });
  }

  try {
    // Create the directory if it does not exist
    git = simpleGit(folderPath)
    
    await git.clone(repoUrl, folderPath);
    const readmePath = path.join(folderPath, 'README.md');
    
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
app.post('/stage-all', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const localPath = `./USER_${userId}`

  if(git === null) {
    git = simpleGit(localPath)
  }

  try {
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


app.post('/stage', requireAuth, async (req, res) => {
  const { targetFiles } = req.body;
  const userId = req.user.id;

  if (git === null) {
    git = simpleGit(`./USER_${userId}`);
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
app.post('/unstage', requireAuth, async (req, res) => {
  const { targetFiles } = req.body;
  const userId = req.user.id;

  if (git === null) {
    git = simpleGit(`./USER_${userId}`);
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
app.post('/commit', requireAuth, async (req, res) => {
  const { commitMessage } = req.body;
  const userId = req.user.id;

  if(git === null) {
    git = simpleGit(`./USER_${userId}`)
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
app.post('/checkout', requireAuth, async (req, res) => {
  const { repoUrl, branch } = req.body;
  const userId = req.user.id;
  const localPath = `./USER_${userId}`

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
app.post('/publish-repo', requireAuth, async (req, res) => {
  const { remoteName, branchName, githubToken } = req.body;
  const userId = req.user.id;
  const localPath = `./USER_${userId}`

  // Basic input validation
  if (!localPath || !remoteName || !branchName || !githubToken) {
    return res.status(400).send('Invalid input');
  }

  try {
    // Initialize the Git instance if it's not already initialized
    if (git === null) {
      git = simpleGit(localPath);
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
app.delete('/delete-directory', requireAuth, async (req, res) => {
  const userId = req.user.id;
  let folderPath = `./USER_${userId}`

  try {
    // Check if the directory exists
    try {
      await fs.access(folderPath); // This will throw an error if the directory doesn't exist
      // If no error is thrown, the directory exists
      // Recursively delete the directory
      await fs.rm(folderPath, { recursive: true });
      res.status(200).send('Repository deleted successfully');
    } catch (error) {
      res.status(400).send(`Repository path does not exist: ${folderPath}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to delete the repository');
  }
});

app.post('/create-file', requireAuth, async (req, res) => {
  const { fileName, content } = req.body;
  const userId = req.user.id;

  // Basic input validation
  if (typeof fileName !== 'string' || typeof content !== 'string') {
      return res.status(400).send('Invalid input');
  }

  let filePath = path.join(`./USER_${userId}/`, fileName)

  try {
      await fs.writeFile(filePath, content, 'utf8');
      res.status(200).send(`File created at ${filePath}`);
  } catch (error) {
      console.error('Error creating file:', error);
      res.status(500).send('Failed to create file');
  }
});

app.post('/update-file', requireAuth, async (req, res) => {
  const { fileName, newContent } = req.body;
  const userId = req.user.id;

  // Basic input validation
  if (typeof fileName !== 'string' || typeof newContent !== 'string') {
    return res.status(400).send('Invalid input');
  }

  
  let filePath = fileName;

  const userDir = `USER_${userId}`;
  if (!fileName.includes(userDir)) {
    filePath = path.join(userDir, fileName);
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

app.delete('/delete-file', requireAuth, async (req, res) => {
  const { fileName } = req.body;
  const userId = req.user.id;

  // Basic input validation
  if (typeof fileName !== 'string') {
    console.log(fileName)
      return res.status(400).send('Invalid input');
  }

  let filePath = fileName;

  const userDir = `USER_${userId}`;
  if (!fileName.includes(userDir)) {
    filePath = path.join(userDir, fileName);
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
app.post('/file-contents', requireAuth, async (req, res) => {
  const { fileName } = req.body;
  const userId = req.user.id;

  // Basic input validation
  if (typeof fileName !== 'string') {
    console.log(fileName)
    return res.status(400).send('Invalid input');
  }

  let filePath = fileName;

  // Check if the fileName is not 'welcome.md' and doesn't already include the userDir
  if (fileName !== 'welcome.md' && !fileName.includes(`USER_${userId}`)) {
    // If not, add it to the filePath
    filePath = `USER_${userId}/${fileName}`;
  }

  console.log(filePath)
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
app.post('/list-files', requireAuth, async (req, res) => {
  const { folderName } = req.body
  const userId = req.user.id
  

  // Basic input validation
  if (typeof folderName !== 'string') {
    return res.status(400).send('Invalid input');
  }
  let folderPath = folderName;

  let userDir = `USER_${userId}`
  if(!folderName.includes(userDir)) {
    folderPath = path.join(`USER_${userId}/`, folderName)
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

    res.status(200).send(fileInfo);
  } catch (error) {
    res.status(500).send('Error listing files');
  }
});




//        -----AI Endpoints-----        //


// AI ANSWER -> {response: response}
app.post('/answer', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const user = req.user;
  const { userQuery, editorContent } = req.body;
  // 
  const conversationKey = `conversation:${userId}`;

  try {
    // Retrieve the conversation from Redis
    const conversation = await client.lRange(conversationKey, 0, -1);
    // Include the system prompt and previous queries when calling getAIResponse
    const response = await getAIResponse(
      conversation,
      systemPrompt="",
      userQuery,
      editorContent,
      model=user.modelType,
      OaiKey=user.oaiKey
    );

    // console.log(sessionID);

    // Structure the current turn's data
    const turnData = JSON.stringify({
      query: decodeURIComponent(userQuery),
      response: response,
      editorContent: decodeURIComponent(editorContent),
      timestamp: new Date(),
    });

    // Push the current turn's data onto the conversation list
    await client.lPush(conversationKey, turnData);

    res.json({
      query: decodeURIComponent(userQuery),
      response: response.content,
      editorContent: decodeURIComponent(editorContent),
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).send('Error generating AI response');
  }
});




async function getAIResponse(conversation, systemPrompt, userQuery, fileContent, model, OaiKey) {
  // console.log(userQuery);
  // Extract and parse the first two elements of the conversation
  console.log("\n\nCONVERSATION: \n", conversation)
  const firstElement = JSON.parse(conversation[0] || '{}');
  const secondElement = JSON.parse(conversation[1] || '{}');

  const messages = [
    { role: "system", content: systemPrompt },
    // Add the first two conversation elements if they exist
  ...(firstElement.query && firstElement.response
    ? [
        { role: "user", content: firstElement.query },
        { role: "assistant", content: firstElement.response.content },
      ]
    : []),
  ...(secondElement.query && secondElement.response
    ? [
        { role: "user", content: secondElement.query },
        { role: "assistant", content: secondElement.response.content },
      ]
    : []),
    { role: "system", content: "editorContents:\n```" + fileContent + "```" },
    { role: "user", content: userQuery }
  ]

  console.log("\n\nMESSAGES:\n", messages)

  const llm = new OpenAI({ apiKey: OaiKey });
  const completion = await llm.chat.completions.create({
    messages: messages,
    model: model,
  });

  return completion.choices[0].message;

  // return     {
  //   "role": "assistant",
  //   "content": "Of course! I'd be happy to assist you with that. To fix your function, you need to change the multiplication operation from `x*2` to `x**2`. This will calculate the square of the given number.\n\nHere's the updated code for your squared function:\n\n```python\ndef squared(x):\n    return x**2\n```\n\nNow, whenever you call this function with a number as an argument, it will return the square of that number. Let me know if there's anything else I can help you with!"
  // }
}




//        -----Redis Endpoints-----        //

// REDIS HISTORY -> JSON FILE
app.post('/history', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id
    const conversationKey = `conversation:${userId}`;

    // Retrieve the conversation history from Redis
    const conversationHistory = await client.lRange(conversationKey, 0, -1);

    // Parsing each message back into JSON object
    const history = conversationHistory.map(message => JSON.parse(message));

    // Write the conversation history to a file
    const fileName = `./USER_${userId}/codenomicon-chat-hist.json`
    // `${localPath}codenomicon-chat-hist.json`;
    await fs.writeFile(fileName, JSON.stringify(history, null, 2));

    // Send the conversation history as a JSON response
    res.status(200).json(history);
  } catch (error) {
    console.error("Error in /history endpoint:", error);
    res.status(500).send("An error occurred while processing the request.");
  }
});


// REDIS LOAD HISTORY
app.post('/load-history', requireAuth, async (req, res) => {
  const userId = req.user.id;

  // Assuming you have a way to identify the user's session, like a session ID
  const conversationKey = `conversation:${userId}`;

  try {
    // Read the JSON file at the local path
    const fileContent = await fs.readFile(`./USER_${userId}/codenomicon-chat-hist.json`, 'utf-8');
    // console.log(fileContent)

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


//      SETTINGS ENDPOINTS      //
app.post('/set-github-token', requireAuth, async (req, res) => {
  try {
    // Get the user object from req.user, which is set by the requireAuth middleware
    const user = req.user;

    // Extract the GitHub token from the request body
    const { githubToken } = req.body;

    // Update the user's GitHub token in the database
    user.githubToken = githubToken;
    await user.save();

    // Respond with a success message or the updated user object
    res.status(200).json({ message: 'GitHub token updated successfully' });
  } catch (error) {
    console.error('Error setting GitHub token:', error);
    res.status(500).json({ message: 'Failed to set GitHub token' });
  }
});

app.post('/set-openai-token', requireAuth, async (req, res) => {
  try {
    // Get the user object from req.user, which is set by the requireAuth middleware
    const user = req.user;

    // Extract the GitHub token from the request body
    const { oaiKey } = req.body;

    // Update the user's GitHub token in the database
    user.oaiKey = oaiKey;
    await user.save();

    // Respond with a success message or the updated user object
    res.status(200).json({ message: 'GitHub token updated successfully' });
  } catch (error) {
    console.error('Error setting GitHub token:', error);
    res.status(500).json({ message: 'Failed to set GitHub token' });
  }
});

app.post('/set-model', requireAuth, async (req, res) => {
  try {
    // Get the user object from req.user, which is set by the requireAuth middleware
    const user = req.user;

    // Extract the GitHub token from the request body
    const { modelType } = req.body;

    // Update the user's GitHub token in the database
    user.modelType = modelType;
    await user.save();

    // Respond with a success message or the updated user object
    res.status(200).json({ message: 'GitHub token updated successfully' });
  } catch (error) {
    console.error('Error setting GitHub token:', error);
    res.status(500).json({ message: 'Failed to set GitHub token' });
  }
});







// Start the Express server
app.listen(port, async () => {
  console.log(`Server listening at ${port}`);
  await client.connect()
});