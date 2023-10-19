import datetime

class Turn:
    def __init__(self, query, parent=None):
        """
        Parameters:
        - query: A stirng that contains the user's query
        - response: A string containing the user's response
        - parent: Points to the parent of the current node in the conversation
        """
        
        self.query = query
        self.response = []
        self.parent = parent
        self.date_created = []


    def gen_response(self, scope, ai_engine):
        new_answer = get_answer(self.query, scope)
        self.response.append(new_answer)
        self.date_created.append(datetime.datetime())


"""
A function for getting a response from the AI given the scope and query
"""
def get_answer():
    pass

class Conversation:
    def __init__(self, scopes: list, ai_engine, MxSL):
        """
        
        """
        self.scopes = scopes
        self.scopes_content = []
        self.nodes = []
        self.ai_engine = ai_engine
        self.max_scope_len = MxSL

    def add_turn(self, query):
        new_turn = Turn(query, self.nodes[-1])
        new_turn.gen_response(self.scopes, self.ai_engine)
        self.nodes.append(new_turn)

    def set_scopes_text(self):
        self.scope_content = []
        content_len = 0
        for path in self.scopes:
            with open(path, 'r') as file:
                content = file.read()
                content_len += content.length
                if content_len < self.max_scope_len:
                    self.scope_content.append(path + ":\n```python\n" + content + "```\n")
                else:
                    self.scope_content.append("OUT OF CONTEXT LENGTH\n")
                    return self.scope_content
        return self.scope_content


def take_turn():
    pass