import http from 'https://unpkg.com/isomorphic-git@beta/http/web/index.js';
        let editor;
        (async () => {
            // Initialize isomorphic-git with a file system
            window.fs = new LightningFS('fs');
            // I prefer using the Promisified version honestly
            window.pfs = window.fs.promises;
            window.dir = '/tutorial';

            console.log("working...");

            await git.clone({
                fs: window.fs,
                http: http,
                dir: window.dir,
                corsProxy: 'https://cors.isomorphic-git.org',
                url: 'https://github.com/isomorphic-git/isomorphic-git',
                ref: 'main',
                singleBranch: true,
                depth: 1,
            });
            console.log("cloned.");

            let dir_contents = await pfs.readdir(dir); // the contents of the dir
            console.log(dir_contents);

            let git_log = await git.log({ fs, dir }); // retrieves the commit history
            console.log(git_log);

            console.log("Status:");
            // Check status of a file
            await git.status({ fs: window.fs, dir: window.dir, filepath: 'README.md' });

            console.log("Modify:");
            // Modify a file
            await window.pfs.writeFile(`${dir}/README.md`, 'Very short README', 'utf8');

            console.log("Que Changes:");
            // Add changes to git
            await git.add({ fs: window.fs, dir: window.dir, filepath: 'README.md' });

            console.log("Commit Changes:");
            // Commit changes
            let sha = await git.commit({
                fs: window.fs,
                dir: window.dir,
                message: 'Delete package.json and overwrite README.',
                author: {
                    name: 'Mr. Test',
                    email: 'mrtest@example.com'
                }
            });
            console.log("Done.");

            let commits = await git.log({ fs: window.fs, dir: window.dir, depth: 1 });
            console.log(commits[0]);

            // Now, read the README file
            async function readReadmeFile() {
                try {
                    const readmeContent = await pfs.readFile(`${window.dir}/README.md`, 'utf8');
                    return readmeContent;
                } catch (error) {
                    console.error('Error reading README.md:', error);
                    return ''; // Return an empty string in case of an error
                }
            }

            const readmeContent = await readReadmeFile();

            require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.23.0/min/vs' } });
            require(['vs/editor/editor.main'], function () {
                // Your existing code
                editor = monaco.editor.create(document.getElementById('editor-container-content'), {
                    value: readmeContent,
                    language: 'markdown'
                });
            });

        })();

        window.saveFile = function() {
            // Get the Monaco Editor instance
            const editor = monaco.editor.getModels()[0];

            // Get the content of the editor
            const content = editor.getValue();

            // Ensure there is content to save
            if (!content) {
                console.error('No content to save.');
                return;
            }

            // Path to the file you want to save
            const filePath = `${window.dir}/README.md`;

            // Write the content to the file using fs.promises.writeFile
            window.pfs.writeFile(filePath, content, 'utf8')
                .then(() => {
                    console.log('File saved successfully.');
                })
                .catch((error) => {
                    console.error('Error saving file:', error);
                });
        }

        window.commit = async function() {
            console.log("Commit Changes:");
            // Commit changes
            let sha = await git.commit({
                fs: window.fs,
                dir: window.dir,
                message: 'Delete package.json and overwrite README.',
                author: {
                    name: 'Mr. Test',
                    email: 'mrtest@example.com'
                }
            });
            console.log("Done.");

            let commits = await git.log({ fs: window.fs, dir: window.dir, depth: 1 });
            console.log(commits[0]);
        }

        window.refresh = async function() {
            async function readReadmeFile() {
                try {
                    const readmeContent = await pfs.readFile(`${window.dir}/README.md`, 'utf8');
                    return readmeContent;
                } catch (error) {
                    console.error('Error reading README.md:', error);
                    return ''; // Return an empty string in case of an error
                }
            }

            const readmeContent = await readReadmeFile();

            if (editor) {
                editor.setValue(readmeContent);  // Set the README content
            } else {
                console.error('No editor instance found.');
            }
        }
