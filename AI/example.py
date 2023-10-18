import heapq

# Define a class for each node in the grid
class Node:
    def __init__(self, row, col):
        self.row = row
        self.col = col
        self.g = float('inf')  # cost from start node
        self.h = 0  # heuristic cost to target node
        self.f = float('inf')  # total cost

    def __lt__(self, other):
        return self.f < other.f

# Define the A* pathfinding function
def astar_pathfinding(grid, start, target):
    rows, cols = len(grid), len(grid[0])
    open_set = []
    closed_set = set()

    # Initialize the start node
    start_node = Node(start[0], start[1])
    start_node.g = 0
    start_node.h = abs(start[0] - target[0]) + abs(start[1] - target[1])
    start_node.f = start_node.g + start_node.h
    heapq.heappush(open_set, start_node)

    # Start the search
    while open_set:
        current_node = heapq.heappop(open_set)
        closed_set.add((current_node.row, current_node.col))

        # Check if we reached the target node
        if (current_node.row, current_node.col) == target:
            path = []
            while current_node:
                path.append((current_node.row, current_node.col))
                current_node = current_node.parent
            return path[::-1]

        # Generate the neighbors of the current node
        neighbors = []
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            new_row, new_col = current_node.row + dr, current_node.col + dc
            if 0 <= new_row < rows and 0 <= new_col < cols and grid[new_row][new_col] != 1:
                neighbors.append((new_row, new_col))

        # Process each neighbor
        for neighbor in neighbors:
            neighbor_node = Node(neighbor[0], neighbor[1])
            if (neighbor_node.row, neighbor_node.col) in closed_set:
                continue

            neighbor_node.g = current_node.g + 1
            neighbor_node.h = abs(neighbor_node.row - target[0]) + abs(neighbor_node.col - target[1])
            neighbor_node.f = neighbor_node.g + neighbor_node.h
            neighbor_node.parent = current_node

            # Check if the neighbor is already in the open set
            for node in open_set:
                if (node.row, node.col) == (neighbor_node.row, neighbor_node.col) and node.f <= neighbor_node.f:
                    break
            else:
                heapq.heappush(open_set, neighbor_node)

    # No path found
    return None

# Example usage
grid = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0]
]
start = (0, 0)
target = (4, 4)

path = astar_pathfinding(grid, start, target)
if path:
    print("Path found:", path)
else:
    print("No path found")