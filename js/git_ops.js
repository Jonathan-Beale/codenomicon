import http from 'https://unpkg.com/isomorphic-git@beta/http/web/index.js';

let fs = new LightningFS('fs');
let pfs = fs.promises;
let dir = '/tutorial';

(async () => {

    console.log("working...");

    await git.clone({
        fs,
        http,
        dir,
        corsProxy: 'https://cors.isomorphic-git.org',
        url: 'https://github.com/isomorphic-git/isomorphic-git',
        ref: 'main',
        singleBranch: true,
        depth: 1,
    });
    console.log("cloned.");

    const dirContents = await pfs.readdir(dir);
    console.log(dirContents);

    const gitLog = await git.log({ fs, dir });
    console.log(gitLog);

    console.log("Status:");
    await git.status({ fs, dir, filepath: 'README.md' });

    console.log("Modify:");
    await pfs.writeFile(`${dir}/README.md`, 'Very short README', 'utf8');

    console.log("Que Changes:");
    await git.add({ fs, dir, filepath: 'README.md' });

    console.log("Commit Changes:");
    await git.commit({
        fs,
        dir,
        message: 'Delete package.json and overwrite README.',
        author: {
            name: 'Mr. Test',
            email: 'mrtest@example.com'
        }
    });
    console.log("Done.");

    const readmeContent = await readReadmeFile();

    require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.23.0/min/vs' } });
    require(['vs/editor/editor.main'], function () {
        editor = monaco.editor.create(document.getElementById('editor-container-content'), {
            value: readmeContent,
            language: 'markdown'
        });
    });

})();

function readReadmeFile() {
    return pfs.readFile(`${window.dir}/README.md`, 'utf8')
        .catch(error => {
            console.error('Error reading README.md:', error);
            return ''; // Return an empty string in case of an error
        });
}

function saveFile() {
    const editor = monaco.editor.getModels()[0];
    const content = editor.getValue();

    if (!content) {
        console.error('No content to save.');
        return;
    }

    const filePath = `${window.dir}/README.md`;

    pfs.writeFile(filePath, content, 'utf8')
        .then(() => {
            console.log('File saved successfully.');
        })
        .catch((error) => {
            console.error('Error saving file:', error);
        });
}

async function commit() {
    console.log("Commit Changes:");
    const sha = await git.commit({
        fs,
        dir,
        message: 'Delete package.json and overwrite README.',
        author: {
            name: 'Mr. Test',
            email: 'mrtest@example.com'
        }
    });
    console.log("Done.");

    const commits = await git.log({ fs, dir, depth: 1 });
    console.log(commits[0]);
}

function refresh() {
    readReadmeFile()
        .then((readmeContent) => {
            if (editor) {
                editor.setValue(readmeContent);
            } else {
                console.error('No editor instance found.');
            }
        });
}
// Function to recursively build and display the directory structure
async function displayDirectoryStructure(dirPath, parentElement) {
    const dirContents = await pfs.readdir(dirPath);

    // Create a div for the directory name
    const directoryNameDiv = document.createElement('div');
    directoryNameDiv.textContent = dirPath.split('/').pop(); // Display only the directory name
    directoryNameDiv.classList.add('directory-name');
    parentElement.appendChild(directoryNameDiv);

    // Create a div for the directory contents
    const directoryContentsDiv = document.createElement('div');
    directoryContentsDiv.classList.add('directory-contents', 'collapsed'); // Initially collapsed

    for (const item of dirContents) {
        const itemPath = `${dirPath}/${item}`;
        const itemStats = await pfs.stat(itemPath);

        if (itemStats.isDirectory()) {
            const folderDiv = document.createElement('div');
            folderDiv.textContent = item;
            folderDiv.classList.add('directory');

            folderDiv.addEventListener('click', async (event) => {
                event.stopPropagation(); // Prevent the click event from propagating to parent elements

                // Toggle visibility of the subdirectory
                const childDiv = folderDiv.querySelector('.subdirectory');
                if (childDiv) {
                    childDiv.classList.toggle('collapsed');
                    childDiv.classList.toggle('expanded');
                } else {
                    const subdirectoryDiv = document.createElement('div');
                    subdirectoryDiv.classList.add('subdirectory');
                    await displayDirectoryStructure(itemPath, subdirectoryDiv);
                    folderDiv.appendChild(subdirectoryDiv);
                    folderDiv.classList.toggle('collapsed');
                    folderDiv.classList.toggle('expanded');
                }
            });

            directoryContentsDiv.appendChild(folderDiv);
        } else {
            // For files, you can use a different element (e.g., <span>) and apply custom styling as needed
            const fileSpan = document.createElement('span');
            fileSpan.textContent = item;
            fileSpan.classList.add('file');
            directoryContentsDiv.appendChild(fileSpan);
        }
    }

    parentElement.appendChild(directoryContentsDiv);
}

// Call the function to display the directory structure in the .directory-container
(async () => {
    const directoryContainer = document.querySelector('.directory-list'); // Change the selector to '.directory-list'
    await displayDirectoryStructure(window.dir, directoryContainer);
})();
