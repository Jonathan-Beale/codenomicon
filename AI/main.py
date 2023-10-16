import os
from langchain.chat_models import ChatOpenAI
from langchain.schema import AIMessage, HumanMessage, SystemMessage

key = input("Open AI Key: ")

print("Loading Models...")
remus = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, openai_api_key=key)
print("Loaded.")

def get_response(file_content, chat_history, user_input, system_prompt):
    messages = []
    messages.append(SystemMessage(content = file_content))
    for turn in chat_history:
        messages.append(HumanMessage(content=turn.query))
        messages.append(AIMessage(content=turn.response))
    messages.append(SystemMessage(content=system_prompt))
    messages.append(HumanMessage(content=user_input))
    return remus(messages=messages).content

def replaced(response):
    messages = []
    messages.append(AIMessage(content=response))
    messages.append(HumanMessage(content="What code would we replace?"))
    return remus(messages=messages).content


def get_content(file_path):
    try:
        with open(file_path, 'r') as file:
            file_content = file.read()
        return file_content
    except FileNotFoundError:
        return "File not found."
    except Exception as e:
        return f"Error: {str(e)}"


code_path = "example.py"
prompt_path = "prompt.txt"

running = True
while running:
    user_in = input("USER> ")
    solution = get_response(file_content=("```\n" + get_content(code_path) + "\n```"),
                 chat_history=[],
                 user_input=user_in,
                 system_prompt=get_content(prompt_path))
    print(solution)
    print(replaced(solution))