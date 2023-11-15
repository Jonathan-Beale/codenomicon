# codenomicon

The point of this project is to allow the user to talk to GPT about any repo they have on github, and share their chat histories with other users. Ideally, the user would be able to impliment the AI's code recommondations as the click of a button.

## AI Context
You may notice that currently the AI is being fed only the file currently open in the editor. Ideally the user would be able to select which files to give the AI access to.
The AI should also have a working chat memory. We want to use redis to save our conversations, this will allow for future upgrades where the AI can remember the most relevant conversations based on vector searches. We need to develop a structure for storing the chat history.


## Things to fix
Currently the tabs for the open editor windows are stacked vertically, we want them to be horizontal.
We want folders that start with a period (".") to be closed by defualt when the directory loads.
