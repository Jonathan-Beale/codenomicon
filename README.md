# codenomicon

## AI
The heart of the application's purpose is the AI. The AI will start out as an assistant instructed to print out a complete code snippet to replace the old code with. We will then detect the differences between the new code and the old code with a simple algorithm, and provide the users an easy button to make the changes. Eventually, the goal is to have an option to automate the AI troubleshooting code by having it loop: [run] > [debug] > [run] > [debug]

### Prompting
The AI is provided a style guide on responses to make sure it gives context from the code, allowing us to run the similarity algorithm.
The AI is also fed the last few messages in its chat history, and the content of each file. Eventually we would like it to automatically recieve terminal output as well. This would allow for the auto debugging.