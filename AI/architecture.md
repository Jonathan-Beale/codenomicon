## AI Responses
The responses will be prompted with a template that includes, the contents of each file in the perview, the user's input, and a system prompt message explaining how to respond.
The template will look something like this:

### PERVIEW/FOCUS
This will be the content of each file in the current chat's focus (or perview)

### CHAT HISTORY
>**I have a problem**
>> Here is the answer

>**I have a problem**
>> Here is the answer

### USER_IN
> **I have this problem...**

### SYS PROMPT
"If the user has a problem, explain the cause of the user's problem.
If the problem is unclear, ask for elaboration.

If the issue is with the code:
- explain what is causing the issue
- wrap the code with the issue in it with an identifier
- wrap your suggested code (which will replace the issue code) with an identifier

Otherwise advise the user on how to fix the issue."
