import os
from langchain.chat_models import ChatOpenAI
from langchain.schema import AIMessage, HumanMessage, SystemMessage

MAX_SCOPE_LEN = 5000

key = input("Open AI Key: ")

print("Loading Models...")
remus = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, openai_api_key=key)
print("Loaded.")

def get_response(file_content, chat_history, user_input, system_prompt):
    messages = []
    for turn in chat_history:
        messages.append(HumanMessage(content=turn.query))
        messages.append(AIMessage(content=turn.response))
    messages.append(SystemMessage(content=system_prompt))
    messages.append(HumanMessage(content = "Here is my code:" + file_content))
    messages.append(HumanMessage(content=user_input))

    # FOR DEBUG
    # contents = []
    # for message in messages:
    #     contents.append(message.content)
    # return contents
    return remus(messages=messages).content

def replaced(response):
    messages = []
    messages.append(AIMessage(content=response))
    messages.append(HumanMessage(content="What lines of code does the new code replace?"))
    return remus(messages=messages).content

def get_scope(file_paths):
    """
    Takes a list of file paths and iterates through them adding the file contents to a string.
    Returns a string of each file formatted in markdown, stops at context length cap.
    """
    scope_content = ""
    for path in file_paths:
        with open(path, 'r') as file:
            content = file.read()
            if content.length + scope_content.length < MAX_SCOPE_LEN:
                scope_content.append("```python\n" + content + "```\n")
            else:
                scope_content.append("OUT OF CONTEXT LENGTH\n")
                return scope_content
    return scope_content

def get_content(file_path):
    try:
        with open(file_path, 'r') as file:
            file_content = file.read()
        return file_content
    except FileNotFoundError:
        return "File not found."
    except Exception as e:
        return f"Error: {str(e)}"


code_path = "C:/Users/Jonathan/codenomicon/AI/example.py"
user_path = "C:/Users/Jonathan/codenomicon/AI/user_in.txt"
prompt_path = "C:/Users/Jonathan/codenomicon/AI/prompt.txt"


while input("USER> ") == "run":
    solution = get_response(file_content=("```\n" + get_content(code_path) + "\n```"),
                 chat_history=[],
                 user_input=get_content(user_path),
                 system_prompt=get_content(prompt_path))
    print(solution)
    print("Seen:: " + get_content(code_path))
    # print(replaced(solution))

# print(get_content(code_path), get_content("C:\\Users\\Jonathan\\codenomicon\\AI\\user_in.txt"), get_content(prompt_path))