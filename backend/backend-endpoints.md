# API Endpoints Documentation

## Git Endpoints

### 1. Clone Repository
- **Endpoint**: `/clone`
- **Method**: POST
- **Input**: 
  - `repoUrl`: URL of the repository to clone.
  - `localPath`: Local path where the repository will be cloned.
- **Output**: A success message and content of `README.md` if available.

### 2. Stage All Changes
- **Endpoint**: `/stage-all`
- **Method**: POST
- **Input**: 
  - `localPath`: Local path of the repository.
- **Output**: A message listing all staged files or a message indicating no changes.

### 3. Stage Specific Files
- **Endpoint**: `/stage`
- **Method**: POST
- **Input**: 
  - `localPath`: Local path of the repository.
  - `targetFiles`: Array of file paths to stage.
- **Output**: A message listing the staged files.

### 4. Unstage Specific Files
- **Endpoint**: `/unstage`
- **Method**: POST
- **Input**: 
  - `localPath`: Local path of the repository.
  - `targetFiles`: Array of file paths to unstage.
- **Output**: A message listing the unstaged files.

### 5. Commit Changes
- **Endpoint**: `/commit`
- **Method**: POST
- **Input**: 
  - `localPath`: Local path of the repository.
  - `commitMessage`: Commit message.
- **Output**: A success message for the commit.

### 6. Checkout Branch
- **Endpoint**: `/checkout`
- **Method**: POST
- **Input**: 
  - `localPath`: Local path of the repository.
  - `repoUrl`: URL of the repository.
  - `branch`: Branch name to checkout.
- **Output**: A success message indicating the checked-out branch.

### 7. Publish Repository
- **Endpoint**: `/publish-repo`
- **Method**: POST
- **Input**: 
  - `localPath`: Local path of the repository.
  - `remoteName`: Name of the remote.
  - `branchName`: Branch name to publish.
  - `githubToken`: GitHub authentication token.
- **Output**: A success message indicating the publication details.

## File Endpoints

### 8. Delete Directory
- **Endpoint**: `/delete-directory`
- **Method**: DELETE
- **Input**: 
  - `localPath`: Path of the directory to delete.
- **Output**: A success message or error if the directory does not exist.

### 9. Create File
- **Endpoint**: `/create-file`
- **Method**: POST
- **Input**: 
  - `filePath`: Path where the file will be created.
  - `content`: Content to write in the file.
- **Output**: A success message with the file path.

### 10. Update File
- **Endpoint**: `/update-file`
- **Method**: POST
- **Input**: 
  - `filePath`: Path of the file to update.
  - `newContent`: New content to write in the file.
- **Output**: A success message with the file path.

### 11. Delete File
- **Endpoint**: `/delete-file`
- **Method**: DELETE
- **Input**: 
  - `filePath`: Path of the file to delete.
- **Output**: A success message with the file path.

### 12. Get File Contents
- **Endpoint**: `/file-contents`
- **Method**: GET
- **Input**: 
  - `filePath`: Path of the file to read.
- **Output**: The content of the file.

### 13. List Files in Directory
- **Endpoint**: `/list-files`
- **Method**: GET
- **Input**: 
  - `folderPath`: Path of the directory to list files from.
- **Output**: A JSON object with details of files in the directory.

## AI Endpoints

### 14. Get AI Answer
- **Endpoint**: `/answer`
- **Method**: GET
- **Input**: 
  - Various parameters including `sessionID`, `userQuery`, `editorContent`, `model`, `OaiKey`.
- **Output**: AI-generated response based on the input query.

## Redis Endpoints

### 15. Save History to Redis
- **Endpoint**: `/history`
- **Method**: POST
- **Input**: 
  - `sessionID`: Session ID for the history.
  - `localPath`: Local path to save the history file.
- **Output**: JSON response with the conversation history.

### 16. Load History from Redis
- **Endpoint**: `/load-history`
- **Method**: POST
- **Input**: 
  - `sessionID`: Session ID for the history.
  - `filePath`: Local path to save the history file.
- **Output**: JSON response with the conversation history.